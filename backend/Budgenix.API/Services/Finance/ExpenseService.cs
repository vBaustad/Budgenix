using Budgenix.Data;
using Budgenix.Dtos.Expenses;
using Budgenix.Dtos.Recurring;
using Budgenix.Models.Finance;
using Budgenix.Models.Shared;
using Budgenix.Services.Recurring;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace Budgenix.Services.Finance
{
    public class ExpenseService : IExpenseService
    {
        private readonly BudgenixDbContext _context;
        private readonly ILogger<ExpenseService> _logger;
        private readonly RecurringItemService _recurringService;
        private readonly IMemoryCache _cache;

        public ExpenseService(
            BudgenixDbContext context,
            ILogger<ExpenseService> logger,
            RecurringItemService recurringService,
            IMemoryCache cache)
        {
            _context = context;
            _logger = logger;
            _recurringService = recurringService;
            _cache = cache;
        }

        public async Task<List<ExpenseDto>> GetExpensesAsync(
            string userId,
            DateTime? from = null,
            DateTime? to = null,
            List<Guid>? categoryIds = null,
            string? sort = null)
        {
            _logger.LogInformation("Fetching expenses for user {UserId}", userId);

            var query = _context.Expenses
                .Include(e => e.Category)
                .Where(e => e.UserId == userId)
                .AsQueryable();

            if (from.HasValue)
                query = query.Where(e => e.Date >= from.Value);

            if (to.HasValue)
                query = query.Where(e => e.Date <= to.Value);

            if (categoryIds != null && categoryIds.Any())
                query = query.Where(e => categoryIds.Contains(e.CategoryId));

            if (!string.IsNullOrWhiteSpace(sort))
            {
                query = sort switch
                {
                    "date_asc" => query.OrderBy(e => e.Date),
                    "amount_desc" => query.OrderByDescending(e => e.Amount),
                    "amount_asc" => query.OrderBy(e => e.Amount),
                    _ => query.OrderByDescending(e => e.Date)
                };
            }

            var expenses = await query.ToListAsync();

            return expenses.Select(e => new ExpenseDto
            {
                Id = e.Id,
                Name = e.Name,
                Amount = e.Amount,
                Date = e.Date,
                CategoryName = e.Category?.Name,
                CategoryId = e.CategoryId
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
                CategoryName = e.Category?.Name,
                CategoryId = e.CategoryId
            };
        }

        public async Task<decimal> GetTotalAsync(string userId)
        {
            var cacheKey = $"expense-total:{userId}";
            if (_cache.TryGetValue(cacheKey, out decimal cachedTotal))
            {
                _logger.LogInformation("Serving cached total for user {UserId}", userId);
                return cachedTotal;
            }

            _logger.LogInformation("Calculating total expenses for user {UserId}", userId);
            var total = await _context.Expenses
                .Where(x => x.UserId == userId)
                .SumAsync(x => x.Amount);

            _cache.Set(cacheKey, total, TimeSpan.FromMinutes(5));
            return total;
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

        public async Task<ExpenseOverviewDto> GetOverviewAsync(string userId, int month, int year)
        {
            var cacheKey = $"expense-overview:{userId}:{month}:{year}";
            if (_cache.TryGetValue(cacheKey, out ExpenseOverviewDto cached))
            {
                _logger.LogInformation("Serving expense overview from cache for user {UserId}", userId);
                return cached;
            }

            _logger.LogInformation("Generating expense overview for user {UserId}, month {Month}, year {Year}", userId, month, year);

            var firstOfMonth = new DateTime(year, month, 1);
            var lastMonth = firstOfMonth.AddMonths(-1);
            var daysInMonth = DateTime.DaysInMonth(year, month);

            var expenses = await _context.Expenses
                .Where(e => e.UserId == userId &&
                    ((e.Date.Year == year && e.Date.Month == month) ||
                     (e.Date.Year == lastMonth.Year && e.Date.Month == lastMonth.Month)))
                .ToListAsync();

            _logger.LogInformation("Fetched {Count} expenses for user {UserId}", expenses.Count, userId);

            var totalExpense = expenses
                .Where(e => e.Date.Year == year && e.Date.Month == month)
                .Sum(e => e.Amount);

            var lastMonthExpense = expenses
                .Where(e => e.Date.Year == lastMonth.Year && e.Date.Month == lastMonth.Month)
                .Sum(e => e.Amount);

            var incomeReceived = await _context.Incomes
                .Where(i => i.UserId == userId && i.Date.Year == year && i.Date.Month == month)
                .SumAsync(i => (decimal?)i.Amount) ?? 0;

            var expenseByDay = expenses
                .Where(e => e.Date.Year == year && e.Date.Month == month)
                .GroupBy(e => e.Date.Day)
                .ToDictionary(g => g.Key, g => g.Sum(e => e.Amount));

            var dailyTotals = Enumerable.Range(1, daysInMonth)
                .Select(day => new DailyExpenseDto
                {
                    Day = day,
                    Total = expenseByDay.TryGetValue(day, out var total) ? total : 0
                })
                .ToList();

            _logger.LogInformation("Daily totals generated: {DailyTotals}", string.Join(", ", dailyTotals.Select(d => $"{d.Day}:{d.Total}")));

            var result = new ExpenseOverviewDto
            {
                TotalExpense = totalExpense,
                LastMonthExpense = lastMonthExpense,
                IncomeReceived = incomeReceived,
                DailyTotals = dailyTotals
            };

            _cache.Set(cacheKey, result, TimeSpan.FromMinutes(5));
            return result;
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
