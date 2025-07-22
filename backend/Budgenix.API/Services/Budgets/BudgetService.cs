using AutoMapper;
using Budgenix.Data;
using Budgenix.Dtos.Budgets;
using Budgenix.Helpers;
using Budgenix.Helpers.Query;
using Budgenix.Models.Audit;
using Budgenix.Models.Finance;
using Budgenix.Services.Audit;
using Budgenix.Services.Shared;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Budgenix.Services.Budgets
{
    public class BudgetService : IBudgetService
    {
        private readonly BudgenixDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuditService _audit;
        private readonly ICacheInvalidatorService _cacheInvalidatorService;

        public BudgetService(BudgenixDbContext context, IMapper mapper, IAuditService audit, ICacheInvalidatorService cacheInvalidatorService)
        {
            _context = context;
            _mapper = mapper;
            _audit = audit;
            _cacheInvalidatorService = cacheInvalidatorService;
        }

        public async Task<IEnumerable<BudgetDto>> GetBudgetsAsync(string userId, string? category, BudgetTypeEnum? type, string sort, int skip, int take)
        {
            var query = _context.Budgets
                .Include(b => b.Category)
                .Where(b => b.UserId == userId)
                .AsQueryable();

            query = BudgetQueryHelper.ApplyFilters(query, category, type);

            var list = await query
                .Skip(skip)
                .Take(take)
                .ToListAsync();

            return _mapper.Map<List<BudgetDto>>(list);
        }

        public async Task<BudgetDto?> GetBudgetByIdAsync(string userId, Guid id)
        {
            var budget = await _context.Budgets
                .Include(b => b.Category)
                .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

            return budget == null ? null : _mapper.Map<BudgetDto>(budget);
        }

        public async Task<IEnumerable<BudgetProgressDto>> GetAllBudgetProgressAsync(string userId)
        {
            var budgets = await _context.Budgets
                .Include(b => b.Category)
                .Where(b => b.UserId == userId)
                .ToListAsync();

            var result = new List<BudgetProgressDto>();

            foreach (var budget in budgets)
            {
                var (start, end) = RecurrenceHelper.GetRecurrencePeriod(DateTime.Today, budget.Recurrence);
                var totalSpent = await GetTotalSpent(userId, budget.CategoryId, start, end);

                result.Add(new BudgetProgressDto
                {
                    Id = budget.Id,
                    Name = budget.Name,
                    AllocatedAmount = budget.AllocatedAmount,
                    TotalSpent = totalSpent,
                    CategoryName = budget.Category?.Name ?? "Unknown",
                    Recurrence = budget.Recurrence
                });
            }

            return result;
        }

        public async Task<BudgetProgressDto?> GetBudgetProgressAsync(string userId, Guid budgetId)
        {
            var budget = await _context.Budgets
                .Include(b => b.Category)
                .FirstOrDefaultAsync(b => b.Id == budgetId && b.UserId == userId);

            if (budget == null) return null;

            var (start, end) = RecurrenceHelper.GetRecurrencePeriod(DateTime.Today, budget.Recurrence);
            var totalSpent = await GetTotalSpent(userId, budget.CategoryId, start, end);

            return new BudgetProgressDto
            {
                Id = budget.Id,
                Name = budget.Name,
                AllocatedAmount = budget.AllocatedAmount,
                TotalSpent = totalSpent,
                CategoryName = budget.Category?.Name ?? "Unknown",
                Recurrence = budget.Recurrence
            };
        }

        public async Task<BudgetDto> CreateBudgetAsync(string userId, CreateBudgetDto dto)
        {
            var category = await _context.Categories.FindAsync(dto.CategoryId);
            if (category == null) throw new ArgumentException("Invalid category ID");

            const decimal tolerance = 0.01m;
            var similarExists = await _context.Budgets
                .AsNoTracking()
                .AnyAsync(b =>
                    b.UserId == userId &&
                    b.CategoryId == dto.CategoryId &&
                    b.Name.ToLower() == dto.Name.ToLower() &&
                    ((!b.EndDate.HasValue || !dto.EndDate.HasValue) || (b.StartDate <= dto.EndDate && (b.EndDate ?? DateTime.MaxValue) >= dto.StartDate)) &&
                    Math.Abs(b.AllocatedAmount - dto.AllocatedAmount) <= dto.AllocatedAmount * tolerance
                );

            if (similarExists) throw new InvalidOperationException("A similar budget already exists");

            var budget = _mapper.Map<Budget>(dto);
            budget.Id = Guid.NewGuid();
            budget.UserId = userId;
            budget.Category = category;

            _context.Budgets.Add(budget);
            await _context.SaveChangesAsync();
            await _audit.LogAsync(userId, AuditActionEnum.CreateBudget, "Budget", budget.Id.ToString(), null, JsonSerializer.Serialize(budget));

            _cacheInvalidatorService.InvalidateBudgets(userId);
            _cacheInvalidatorService.InvalidateDashboard(userId, DateTime.UtcNow);

            return _mapper.Map<BudgetDto>(budget);
        }

        public async Task<BudgetDto?> UpdateBudgetAsync(string userId, UpdateBudgetDto dto)
        {
            var budget = await _context.Budgets.FirstOrDefaultAsync(b => b.Id == dto.Id && b.UserId == userId);
            if (budget == null) return null;

            var category = await _context.Categories.FindAsync(dto.CategoryId);
            if (category == null) throw new ArgumentException("Invalid category ID");

            const decimal tolerance = 0.01m;
            var similarExists = await _context.Budgets
                .AsNoTracking()
                .AnyAsync(b =>
                    b.Id != dto.Id &&
                    b.UserId == userId &&
                    b.CategoryId == dto.CategoryId &&
                    b.Name.ToLower() == dto.Name.ToLower() &&
                    ((!b.EndDate.HasValue || !dto.EndDate.HasValue) || (b.StartDate <= dto.EndDate && (b.EndDate ?? DateTime.MaxValue) >= dto.StartDate)) &&
                    Math.Abs(b.AllocatedAmount - dto.AllocatedAmount) <= dto.AllocatedAmount * tolerance
                );

            if (similarExists) throw new InvalidOperationException("A similar budget already exists");

            var oldValues = JsonSerializer.Serialize(budget);

            _mapper.Map(dto, budget);
            budget.Category = category;
            await _context.SaveChangesAsync();
            await _audit.LogAsync(userId, AuditActionEnum.UpdateBudget, "Budget", budget.Id.ToString(), oldValues, JsonSerializer.Serialize(budget));

            _cacheInvalidatorService.InvalidateBudgets(userId);
            _cacheInvalidatorService.InvalidateDashboard(userId, DateTime.UtcNow);
            return _mapper.Map<BudgetDto>(budget);
        }

        public async Task<bool> DeleteBudgetAsync(string userId, Guid id)
        {
            var budget = await _context.Budgets.FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);
            if (budget == null) return false;

            var oldValues = JsonSerializer.Serialize(budget);

            _context.Budgets.Remove(budget);
            await _context.SaveChangesAsync();
            await _audit.LogAsync(userId, AuditActionEnum.DeleteBudget, "Budget", id.ToString(), oldValues, null);

            _cacheInvalidatorService.InvalidateBudgets(userId);
            _cacheInvalidatorService.InvalidateDashboard(userId, DateTime.UtcNow);

            return true;
        }

        private async Task<decimal> GetTotalSpent(string userId, Guid categoryId, DateTime start, DateTime end)
        {
            return await _context.Expenses
                .Where(e => e.UserId == userId &&
                            e.CategoryId == categoryId &&
                            e.Date >= start &&
                            e.Date <= end)
                .SumAsync(e => (decimal?)e.Amount) ?? 0;
        }
    }
}