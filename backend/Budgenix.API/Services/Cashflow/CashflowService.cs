using AutoMapper;
using Budgenix.Data;
using Budgenix.Dtos;
using Budgenix.Dtos.Cashflow;
using Budgenix.Dtos.Insights;
using Budgenix.Models.Audit;
using Budgenix.Models.Categories;
using Budgenix.Models.Finance;
using Budgenix.Models.Shared;
using Budgenix.Services.Audit;
using Budgenix.Services.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace Budgenix.Services.Finance
{
    public class CashflowService : ICashflowService
    {
        private readonly BudgenixDbContext _context;
        private readonly ILogger<CashflowService> _logger;
        private readonly IMemoryCache _cache;
        private readonly IAuditService _audit;
        private readonly IMapper _mapper;
        private readonly ICacheInvalidatorService _cacheInvalidatorService;

        public CashflowService(
            BudgenixDbContext context,
            ILogger<CashflowService> logger,
            IMemoryCache cache,
            IAuditService audit,
            IMapper mapper,
            ICacheInvalidatorService cacheInvalidatorService)
        {
            _context = context;
            _logger = logger;
            _cache = cache;
            _audit = audit;
            _mapper = mapper;
            _cacheInvalidatorService = cacheInvalidatorService;
        }

        public async Task<List<CashflowItemDto>> GetItemsAsync(string userId)
        {
            _logger.LogInformation("Fetching cashflow items for user {UserId}", userId);

            var items = await _context.CashflowItems
                .Include(x => x.Category)
                .Where(x => x.UserId == userId)
                .ToListAsync();

            
            var dtos = _mapper.Map<List<CashflowItemDto>>(items);

            return dtos;
        }


        public async Task<CashflowSummaryDto> GetSummaryAsync(string userId)
        {
            var cacheKey = $"cashflow:{userId}";

            if (_cache.TryGetValue(cacheKey, out CashflowSummaryDto cached))
            {
                _logger.LogInformation("Serving cached cashflow summary for user {UserId}", userId);
                return cached;
            }

            var items = await _context.CashflowItems
                .Include(i => i.Category)
                .Where(i => i.UserId == userId)
                .ToListAsync();

            var incomeItems = items.Where(i => i.Type == CashflowItemType.Income);
            var expenseItems = items.Where(i => i.Type == CashflowItemType.Expense);

            var savingsItems = expenseItems
                .Where(i => i.Category?.Name.ToLower().Contains("saving") == true);

            decimal Monthly(IEnumerable<CashflowItem> list) =>
                list.Sum(i => NormalizeMonthly(i.Amount, i.Frequency));


            var categoryBreakdown = items
                .Where(i => i.CategoryId != null)
                .GroupBy(i => new { i.Type, i.Category })
                .Select(g => new CategoryBreakdownDto
                {
                    CategoryId = g.Key.Category.Id,
                    CategoryName = g.Key.Category.Name,
                    Type = g.Key.Type,
                    MonthlyTotal = g.Sum(i => NormalizeMonthly(i.Amount, i.Frequency)),
                    AnnualTotal = g.Sum(i => NormalizeMonthly(i.Amount, i.Frequency)) * 12
                })
                .ToList();


            var monthlyIncome = Monthly(incomeItems);
            var monthlyExpenses = Monthly(expenseItems);
            var monthlySavings = Monthly(savingsItems);
            var monthlyBalance = monthlyIncome - monthlyExpenses;

            var summary = new CashflowSummaryDto
            {
                MonthlyIncome = monthlyIncome,
                MonthlyExpenses = monthlyExpenses,
                MonthlySavings = monthlySavings,
                MonthlyBalance = monthlyBalance,

                AnnualIncome = monthlyIncome * 12,
                AnnualExpenses = monthlyExpenses * 12,
                AnnualSavings = monthlySavings * 12,
                AnnualBalance = monthlyBalance * 12,

                CategoryBreakdown = categoryBreakdown
            };

            _cache.Set(cacheKey, summary, TimeSpan.FromMinutes(5));

            return summary;
        }

        public async Task<List<InsightDto>> GetInsightsAsync(string userId)
        {
            var items = await _context.CashflowItems
                .Include(x => x.Category)
                .Where(x => x.UserId == userId)
                .ToListAsync();

            var insights = new List<InsightDto>();

            var categoryGroups = items
                .Where(i => i.Type == CashflowItemType.Expense)
                .GroupBy(i => i.Category?.Name ?? "Uncategorized")
                .Select(g => new
                {
                    Category = g.Key,
                    Total = g.Sum(i => NormalizeMonthly(i.Amount, i.Frequency))
                });

            foreach (var group in categoryGroups)
            {
                
                if (group.Category != "Rent" && group.Total > 500)
                {
                    insights.Add(new InsightDto
                    {
                        Title = "High Spending Alert",
                        Message = $"You're spending {group.Total:N0}kr per month on {group.Category}. Consider reviewing it.",
                        Category = InsightCategoryEnum.Expenses
                    });
                }
            }

            var balance = NormalizeMonthly(items.Where(i => i.Type == CashflowItemType.Income).Sum(i => i.Amount), RecurrenceTypeEnum.Monthly)
                         - NormalizeMonthly(items.Where(i => i.Type == CashflowItemType.Expense).Sum(i => i.Amount), RecurrenceTypeEnum.Monthly);

            if (balance < 0)
            {
                insights.Add(new InsightDto
                {
                    Title = "Negative Cashflow",
                    Message = "Your monthly expenses exceed your income. You may want to reduce spending or increase income.",
                    Category = InsightCategoryEnum.System
                });
            }

            return insights;
        }


        public async Task<CashflowItemDto> AddItemAsync(string userId, CreateCashflowItemDto dto)
        {
            _logger.LogInformation("Adding cashflow item for user {UserId}", userId);

            var entity = new CashflowItem
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Amount = dto.Amount,
                Frequency = dto.Frequency,
                Type = dto.Type,
                Person = dto.Person,
                CategoryId = dto.CategoryId,
                UserId = userId
            };

            _context.CashflowItems.Add(entity);
            await _context.SaveChangesAsync();

            await _audit.LogAsync(new AuditLog
            {
                UserId = userId,
                Action = AuditActionEnum.CreateCashflowItem,
                EntityType = "CashflowItem",
                EntityId = entity.Id.ToString(),
                NewValues = JsonSerializer.Serialize(entity)
            });

            var dtoResult = _mapper.Map<CashflowItemDto>(entity);
            dtoResult.Amount = NormalizeMonthly(entity.Amount, entity.Frequency);

            _cacheInvalidatorService.InvalidateCashflow(userId);
            _cacheInvalidatorService.InvalidateDashboard(userId, DateTime.UtcNow);

            return dtoResult;
        }

        public async Task<bool> UpdateItemAsync(string userId, Guid id, UpdateCashflowItemDto dto)
        {
            _logger.LogInformation("Updating cashflow item {Id} for user {UserId}", id, userId);

            var entity = await _context.CashflowItems
                .Include(x => x.Category)
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

            if (entity == null) return false;

            var oldValues = JsonSerializer.Serialize(entity);

            entity.Name = dto.Name;
            entity.Amount = dto.Amount;
            entity.Frequency = dto.Frequency;
            entity.Type = dto.Type;
            entity.Person = dto.Person;
            entity.CategoryId = dto.CategoryId;

            await _context.SaveChangesAsync();

            await _audit.LogAsync(new AuditLog
            {
                UserId = userId,
                Action = AuditActionEnum.UpdateCashflowItem,
                EntityType = "CashflowItem",
                EntityId = entity.Id.ToString(),
                OldValues = oldValues,
                NewValues = JsonSerializer.Serialize(entity)
            });

            _cacheInvalidatorService.InvalidateCashflow(userId);
            _cacheInvalidatorService.InvalidateDashboard(userId, DateTime.UtcNow);

            return true;
        }

        public async Task<bool> DeleteItemAsync(string userId, Guid id)
        {
            _logger.LogInformation("Deleting cashflow item {Id} for user {UserId}", id, userId);

            var entity = await _context.CashflowItems
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

            if (entity == null) return false;

            var oldValues = JsonSerializer.Serialize(entity);

            _context.CashflowItems.Remove(entity);
            await _context.SaveChangesAsync();

            await _audit.LogAsync(new AuditLog
            {
                UserId = userId,
                Action = AuditActionEnum.DeleteCashflowItem,
                EntityType = "CashflowItem",
                EntityId = entity.Id.ToString(),
                OldValues = oldValues
            });

            _cacheInvalidatorService.InvalidateCashflow(userId);
            _cacheInvalidatorService.InvalidateDashboard(userId, DateTime.UtcNow);

            return true;
        }

        private static decimal NormalizeMonthly(decimal amount, RecurrenceTypeEnum frequency)
        {
            return frequency switch
            {
                RecurrenceTypeEnum.Daily => Math.Round(amount * 365 / 12, 2),
                RecurrenceTypeEnum.Weekly => Math.Round(amount * 52 / 12, 2),
                RecurrenceTypeEnum.BiWeekly => Math.Round(amount * 26 / 12, 2),
                RecurrenceTypeEnum.Monthly => amount,
                RecurrenceTypeEnum.Quarterly => Math.Round(amount * 4 / 12, 2),
                RecurrenceTypeEnum.Yearly => Math.Round(amount / 12, 2),
                _ => 0m
            };
        }

    }
}
