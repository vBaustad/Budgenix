using Budgenix.Data;
using Budgenix.Dtos.Expenses;
using Budgenix.Models.Finance;
using Budgenix.Services.Recurring;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Budgenix.Services
{
    public interface IExpensesService
    {
        Task<List<ExpenseDto>> GetExpensesAsync(string userId, /* filters */);
        Task<ExpenseDto?> GetExpenseByIdAsync(string userId, Guid id);
        Task<decimal> GetTotalAsync(string userId);
        Task<List<string>> GetUsedCategoriesAsync(string userId);
        Task<object> GetOverviewAsync(string userId, int month, int year);
        Task<ExpenseDto> AddExpenseAsync(string userId, CreateExpenseDto dto);
        Task<bool> UpdateExpenseAsync(string userId, Guid id, UpdateExpenseDto dto);
        Task<bool> DeleteExpenseAsync(string userId, Guid id);
    }

    public class ExpensesService : IExpensesService
    {
        private readonly BudgenixDbContext _context;
        private readonly ILogger<ExpensesService> _logger;
        private readonly RecurringItemService _recurringService;

        public ExpensesService(BudgenixDbContext context, ILogger<ExpensesService> logger, RecurringItemService recurringService)
        {
            _context = context;
            _logger = logger;
            _recurringService = recurringService;
        }

        public async Task<List<ExpenseDto>> GetExpensesAsync(string userId /*, filters */)
        {
            _logger.LogInformation("Fetching expenses for user {UserId}", userId);
            // Apply filters/sorting here (simplified for brevity)
            var expenses = await _context.Expenses
                .Include(e => e.Category)
                .Where(e => e.UserId == userId)
                .ToListAsync();

            return expenses.Select(e => new ExpenseDto
            {
                Id = e.Id,
                Name = e.Name,
                Amount = e.Amount,
                Date = e.Date,
                CategoryName = e.Category?.Name
            }).ToList();
        }

        public async Task<ExpenseDto?> GetExpenseByIdAsync(string userId, Guid id)
        {
            _logger.LogInformation("Fetching expense {Id} for user {UserId}", id, userId);
            var e = await _context.Expenses
                .Include(x => x.Category)
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

            if (e == null)
            {
                _logger.LogWarning("Expense {Id} not found for user {UserId}", id, userId);
                return null;
            }

            return new ExpenseDto
            {
                Id = e.Id,
                Name = e.Name,
                Amount = e.Amount,
                Date = e.Date,
                CategoryName = e.Category?.Name
            };
        }

        public async Task<decimal> GetTotalAsync(string userId)
        {
            _logger.LogInformation("Calculating total expenses for user {UserId}", userId);
            return await _context.Expenses.Where(x => x.UserId == userId).SumAsync(x => x.Amount);
        }

        public async Task<List<string>> GetUsedCategoriesAsync(string userId)
        {
            _logger.LogInformation("Fetching used categories for user {UserId}", userId);
            return await _context.Expenses
                .Where(x => x.UserId == userId && x.Category != null)
                .Select(x => x.Category!.Name)
                .Distinct()
                .OrderBy(x => x)
                .ToListAsync();
        }

        public async Task<object> GetOverviewAsync(string userId, int month, int year)
        {
            _logger.LogInformation("Generating overview for user {UserId} month {Month} year {Year}", userId, month, year);
            // (Add overview logic, bundle queries as we did with DashboardService)
            // Return anonymized or DTO result
            return new { }; // placeholder
        }

        public async Task<ExpenseDto> AddExpenseAsync(string userId, CreateExpenseDto dto)
        {
            _logger.LogInformation("Adding expense for user {UserId}", userId);
            var category = await _context.Categories.FindAsync(dto.CategoryId);
            if (category == null) throw new Exception("Invalid category");

            var e = new Expense
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Amount = dto.Amount,
                Date = dto.Date,
                Description = dto.Description,
                Category = category,
                UserId = userId
            };

            _context.Expenses.Add(e);
            await _context.SaveChangesAsync();

            return new ExpenseDto
            {
                Id = e.Id,
                Name = e.Name,
                Amount = e.Amount,
                Date = e.Date,
                CategoryName = e.Category.Name
            };
        }

        public async Task<bool> UpdateExpenseAsync(string userId, Guid id, UpdateExpenseDto dto)
        {
            _logger.LogInformation("Updating expense {Id} for user {UserId}", id, userId);
            var e = await _context.Expenses.Include(x => x.Category).FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
            if (e == null) return false;

            var category = await _context.Categories.FindAsync(dto.CategoryId);
            if (category == null) throw new Exception("Invalid category");

            e.Name = dto.Name;
            e.Amount = dto.Amount;
            e.Date = dto.Date;
            e.Description = dto.Description;
            e.Category = category;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteExpenseAsync(string userId, Guid id)
        {
            _logger.LogInformation("Deleting expense {Id} for user {UserId}", id, userId);
            var e = await _context.Expenses.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
            if (e == null) return false;

            _context.Expenses.Remove(e);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
