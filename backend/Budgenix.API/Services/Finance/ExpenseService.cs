using Budgenix.Data;
using Budgenix.Dtos.Expenses;
using Budgenix.Dtos.Recurring;
using Budgenix.Models.Finance;
using Budgenix.Models.Shared;
using Budgenix.Services.Recurring;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Budgenix.Models.Audit;
using Budgenix.Services.Audit;
using System.Text.Json;
using Budgenix.Services.Shared;
using Budgenix.Services.BankStatements.NameSuggester;

namespace Budgenix.Services.Finance
{
    public class ExpenseService : IExpenseService
    {
        private readonly BudgenixDbContext _context;
        private readonly ILogger<ExpenseService> _logger;
        private readonly RecurringItemService _recurringService;
        private readonly INameSuggesterService _nameSuggesterService;
        private readonly IMemoryCache _cache;
        private readonly IAuditService _audit;
        private readonly ICacheInvalidatorService _cacheInvalidatorService;
        public ExpenseService(
            BudgenixDbContext context,
            ILogger<ExpenseService> logger,
            RecurringItemService recurringService,
            IMemoryCache cache,
            IAuditService audit,
            ICacheInvalidatorService cacheInvalidatorService,
            INameSuggesterService nameSuggesterService)
        {
            _context = context;
            _logger = logger;
            _recurringService = recurringService;
            _cache = cache;
            _audit = audit;
            _cacheInvalidatorService = cacheInvalidatorService;
            _nameSuggesterService = nameSuggesterService;
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
                .AsNoTracking()
                .Include(e => e.Category)
                .Where(e => e.UserId == userId && !e.IsInternalTransfer)
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
                CategoryId = e.CategoryId,
                IsInternalTransfer = e.IsInternalTransfer,
            }).ToList();
        }

        public async Task<ExpenseDto?> GetExpenseByIdAsync(string userId, Guid id)
        {
            _logger.LogInformation("Fetching expense {Id} for user {UserId}", id, userId);
            var expense = await _context.Expenses
                .AsNoTracking()
                .Include(e => e.Category)
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (expense == null)
            {
                _logger.LogWarning("Expense {Id} not found for user {UserId}", id, userId);
                return null;
            }

            return new ExpenseDto
            {
                Id = expense.Id,
                Name = expense.Name,
                Amount = expense.Amount,
                Date = expense.Date,
                CategoryName = expense.Category?.Name,
                CategoryId = expense.CategoryId,
                IsInternalTransfer = expense.IsInternalTransfer,
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
                .AsNoTracking()
                .Where(e => e.UserId == userId && !e.IsInternalTransfer)
                .SumAsync(e => e.Amount);

            _cache.Set(cacheKey, total, TimeSpan.FromMinutes(5));
            return total;
        }

        public async Task<List<string>> GetUsedCategoriesAsync(string userId)
        {
            _logger.LogInformation("Fetching used categories for user {UserId}", userId);
            return await _context.Expenses
                .AsNoTracking()
                .Where(e => e.UserId == userId && !e.IsInternalTransfer && e.Category != null)
                .Select(e => e.Category!.Name)
                .Distinct()
                .OrderBy(e => e)
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
                .AsNoTracking()
                .Where(e => e.UserId == userId && !e.IsInternalTransfer &&
                    ((e.Date.Year == year && e.Date.Month == month) ||
                     (e.Date.Year == lastMonth.Year && e.Date.Month == lastMonth.Month)))
                .ToListAsync();

            _logger.LogInformation("Fetched {Count} expenses for user {UserId}", expenses.Count, userId);

            var totalExpense = expenses
                .Where(e => e.Date.Year == year && e.Date.Month == month)
                .Sum(e => e.Amount);

            _logger.LogInformation("total amount: {totalExpense}", totalExpense);

            var lastMonthExpense = expenses
                .Where(e => e.Date.Year == lastMonth.Year && e.Date.Month == lastMonth.Month)
                .Sum(e => e.Amount);

            var incomeReceived = await _context.Incomes
                .AsNoTracking()
                .Where(i => i.UserId == userId && !i.IsInternalTransfer && i.Date.Year == year && i.Date.Month == month)
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

            var category = await _context.Categories
                .Where(c => c.Id == dto.CategoryId)
                .Select(c => new { c.Id, c.Name })
                .FirstOrDefaultAsync();

            if (category == null)
            {
                _logger.LogWarning("Invalid category ID {CategoryId} provided. Falling back to 'Miscellaneous'.", dto.CategoryId);

                category = await _context.Categories
                    .Where(c => c.Name == "Miscellaneous")
                    .Select(c => new { c.Id, c.Name })
                    .FirstOrDefaultAsync();

                if (category == null)
                    throw new InvalidOperationException("Fallback category 'Miscellaneous' not found.");
            }

            var exist = await _context.Expenses.AnyAsync(e =>
                e.Amount == dto.Amount &&
                e.Date == dto.Date &&
                (e.Description ?? "").ToLower().Trim() == (dto.Description ?? "").ToLower().Trim() &&
                e.IsInternalTransfer == dto.IsInternalTransfer &&
                e.CategoryId == category.Id &&
                e.UserId == userId
            );

            if (exist)
            {
                _logger.LogWarning("Duplicate expense detected. Skipping insert for user {UserId}: {Name}, {Amount}, {Date}", userId, dto.Name, dto.Amount, dto.Date);
                return null;
            }

            if (dto.Name?.Trim().Equals("[auto] Imported transaction", StringComparison.OrdinalIgnoreCase) == true
                && !string.IsNullOrWhiteSpace(dto.Description))
            {
                try
                {
                    dto.Name = await _nameSuggesterService.SuggestNameAsync(dto.Description);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to generate AI name for income. Using fallback.");
                    // Keep fallback name
                }
            }

            var expense = new Expense
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Amount = dto.Amount,
                Date = dto.Date,
                Description = dto.Description,
                CategoryId = category.Id,
                IsInternalTransfer = dto.IsInternalTransfer,
                UserId = userId
            };

            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();

            await _audit.LogAsync(new AuditLog
            {
                UserId = userId,
                Action = AuditActionEnum.CreateExpense,
                EntityType = "Expense",
                EntityId = expense.Id.ToString(),
                NewValues = JsonSerializer.Serialize(expense)
            });

            _cacheInvalidatorService.InvalidateExpenseOverview(userId, expense.Date);
            _cacheInvalidatorService.InvalidateDashboard(userId, expense.Date);

            return new ExpenseDto
            {
                Id = expense.Id,
                Name = expense.Name,
                Amount = expense.Amount,
                Date = expense.Date,
                CategoryId = category.Id,
                CategoryName = category.Name,
                IsInternalTransfer = expense.IsInternalTransfer,
            };
        }

        public async Task<bool> UpdateExpenseAsync(string userId, Guid id, UpdateExpenseDto dto)
        {
            _logger.LogInformation("Updating expense {Id} for user {UserId}", id, userId);
            var expense = await _context.Expenses.Include(x => x.Category).FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
            if (expense == null) return false;

            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId);
            if (!categoryExists)
            {
                _logger.LogWarning("Invalid category ID {CategoryId} provided during update of expense {Id}", dto.CategoryId, id);
                throw new InvalidOperationException("Invalid category ID provided");
            }


            var oldDate = expense.Date;
            var oldValues = JsonSerializer.Serialize(expense);

            expense.Name = dto.Name;
            expense.Amount = dto.Amount;
            expense.Date = dto.Date;
            expense.Description = dto.Description;
            expense.IsInternalTransfer = dto.IsInternalTransfer;
            expense.CategoryId = dto.CategoryId;

            await _context.SaveChangesAsync();

            await _audit.LogAsync(new AuditLog
            {
                UserId = userId,
                Action = AuditActionEnum.UpdateExpense,
                EntityType = "Expense",
                EntityId = expense.Id.ToString(),
                OldValues = oldValues,
                NewValues = JsonSerializer.Serialize(expense)
            });

            _cacheInvalidatorService.InvalidateExpenseOverview(userId, oldDate);
            _cacheInvalidatorService.InvalidateExpenseOverview(userId, expense.Date);
            _cacheInvalidatorService.InvalidateDashboard(userId, expense.Date);

            return true;
        }

        public async Task<bool> DeleteExpenseAsync(string userId, Guid id)
        {
            _logger.LogInformation("Deleting expense {Id} for user {UserId}", id, userId);

            var expense = await _context.Expenses
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

            if (expense == null)
            {
                _logger.LogWarning("Expense {Id} not found for user {UserId}", id, userId);
                return false;
            }

            var oldValues = JsonSerializer.Serialize(expense);

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();

            await _audit.LogAsync(new AuditLog
            {
                UserId = userId,
                Action = AuditActionEnum.DeleteExpense,
                EntityType = "Expense",
                EntityId = expense.Id.ToString(),
                OldValues = oldValues
            });

            _cacheInvalidatorService.InvalidateExpenseOverview(userId, expense.Date);
            _cacheInvalidatorService.InvalidateDashboard(userId, expense.Date);

            return true;
        }

    }
}