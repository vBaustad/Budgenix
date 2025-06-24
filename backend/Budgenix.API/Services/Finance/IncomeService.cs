using Budgenix.Data;
using Budgenix.Dtos.Incomes;
using Budgenix.Dtos.Recurring;
using Budgenix.Models.Finance;
using Budgenix.Models.Shared;
using Budgenix.Services.Recurring;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace Budgenix.Services.Finance
{
    public class IncomeService : IIncomeService
    {
        private readonly BudgenixDbContext _context;
        private readonly ILogger<IncomeService> _logger;
        private readonly RecurringItemService _recurringService;
        private readonly IMemoryCache _cache;

        public IncomeService(
            BudgenixDbContext context,
            ILogger<IncomeService> logger,
            RecurringItemService recurringService,
            IMemoryCache cache)
        {
            _context = context;
            _logger = logger;
            _recurringService = recurringService;
            _cache = cache;
        }

        public async Task<List<IncomeDto>> GetIncomesAsync(
            string userId,
            DateTime? from = null,
            DateTime? to = null,
            List<Guid>? categoryIds = null,
            string? sort = null)
        {
            _logger.LogInformation("Fetching incomes for user {UserId}", userId);

            var query = _context.Incomes
                .Include(i => i.Category)
                .Where(i => i.UserId == userId)
                .AsQueryable();

            if (from.HasValue)
                query = query.Where(i => i.Date >= from.Value);

            if (to.HasValue)
                query = query.Where(i => i.Date <= to.Value);

            if (categoryIds != null && categoryIds.Any())
                query = query.Where(i => categoryIds.Contains(i.CategoryId));

            if (!string.IsNullOrWhiteSpace(sort))
            {
                query = sort switch
                {
                    "date_asc" => query.OrderBy(i => i.Date),
                    "amount_desc" => query.OrderByDescending(i => i.Amount),
                    "amount_asc" => query.OrderBy(i => i.Amount),
                    _ => query.OrderByDescending(i => i.Date)
                };
            }

            var incomes = await query.ToListAsync();

            return incomes.Select(i => new IncomeDto
            {
                Id = i.Id,
                Name = i.Name,
                Amount = i.Amount,
                Date = i.Date,
                CategoryName = i.Category?.Name,
                CategoryId = i.CategoryId
            }).ToList();
        }

        public async Task<IncomeDto?> GetIncomeByIdAsync(string userId, Guid id)
        {
            _logger.LogInformation("Fetching income {Id} for user {UserId}", id, userId);
            var i = await _context.Incomes
                .Include(x => x.Category)
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

            if (i == null)
            {
                _logger.LogWarning("Income {Id} not found for user {UserId}", id, userId);
                return null;
            }

            return new IncomeDto
            {
                Id = i.Id,
                Name = i.Name,
                Amount = i.Amount,
                Date = i.Date,
                CategoryName = i.Category?.Name,
                CategoryId = i.CategoryId
            };
        }

        public async Task<decimal> GetTotalAsync(string userId)
        {
            var cacheKey = $"income-total:{userId}";
            if (_cache.TryGetValue(cacheKey, out decimal cachedTotal))
            {
                _logger.LogInformation("Serving cached total income for user {UserId}", userId);
                return cachedTotal;
            }

            _logger.LogInformation("Calculating total income for user {UserId}", userId);
            var total = await _context.Incomes
                .Where(x => x.UserId == userId)
                .SumAsync(x => x.Amount);

            _cache.Set(cacheKey, total, TimeSpan.FromMinutes(5));
            return total;
        }

        public async Task<List<string>> GetUsedCategoriesAsync(string userId)
        {
            _logger.LogInformation("Fetching used income categories for user {UserId}", userId);
            return await _context.Incomes
                .Where(x => x.UserId == userId && x.Category != null)
                .Select(x => x.Category!.Name)
                .Distinct()
                .OrderBy(x => x)
                .ToListAsync();
        }

        public async Task<List<IncomeMonthlySummaryDto>> GetMonthlySummaryAsync(string userId, int months)
        {
            _logger.LogInformation("Generating monthly income summary for user {UserId} over {Months} months", userId, months);

            var start = DateTime.UtcNow.Date.AddMonths(-months + 1);

            var incomes = await _context.Incomes
                .Include(i => i.Category)
                .Where(i => i.UserId == userId && i.Date >= start && i.Category != null)
                .ToListAsync();

            var summary = incomes
                .GroupBy(i => new
                {
                    i.Date.Year,
                    i.Date.Month,
                    Category = i.Category!.Name
                })
                .Select(g => new IncomeMonthlySummaryDto
                {
                    Month = new DateTime(g.Key.Year, g.Key.Month, 1),
                    Category = g.Key.Category,
                    Total = g.Sum(i => i.Amount)
                })
                .OrderBy(g => g.Month)
                .ToList();

            return summary;
        }

        public async Task<IncomeOverviewDto> GetOverviewAsync(string userId, int month, int year)
        {
            var cacheKey = $"income-overview:{userId}:{month}:{year}";
            if (_cache.TryGetValue(cacheKey, out IncomeOverviewDto cached))
            {
                _logger.LogInformation("Serving income overview from cache for user {UserId}", userId);
                return cached;
            }

            _logger.LogInformation("Generating income overview for user {UserId}, month {Month}, year {Year}", userId, month, year);

            var firstOfMonth = new DateTime(year, month, 1);
            var lastMonth = firstOfMonth.AddMonths(-1);

            var incomes = await _context.Incomes
                .Where(i => i.UserId == userId &&
                    (i.Date.Year == year && i.Date.Month == month ||
                     i.Date.Year == lastMonth.Year && i.Date.Month == lastMonth.Month))
                .ToListAsync();

            var totalIncome = incomes
                .Where(i => i.Date.Year == year && i.Date.Month == month)
                .Sum(i => i.Amount);

            var lastMonthIncome = incomes
                .Where(i => i.Date.Year == lastMonth.Year && i.Date.Month == lastMonth.Month)
                .Sum(i => i.Amount);

            var dailyTotals = incomes
                .Where(i => i.Date.Year == year && i.Date.Month == month)
                .GroupBy(i => i.Date.Day)
                .Select(g => new DailyIncomeDto
                {
                    Day = g.Key,
                    Total = g.Sum(i => i.Amount)
                })
                .ToList();

            var result = new IncomeOverviewDto
            {
                TotalIncome = totalIncome,
                LastMonthIncome = lastMonthIncome,
                DailyTotals = dailyTotals
            };

            _cache.Set(cacheKey, result, TimeSpan.FromMinutes(5));
            return result;
        }


        public async Task<IncomeDto> AddIncomeAsync(string userId, CreateIncomeDto dto)
        {
            _logger.LogInformation("Adding income for user {UserId}", userId);

            var category = await _context.Categories
                .Where(c => c.Id == dto.CategoryId)
                .Select(c => new { c.Id, c.Name })
                .FirstOrDefaultAsync();

            if (category == null)
                throw new InvalidOperationException("Invalid category ID provided");

            var i = new Income
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Amount = dto.Amount,
                Date = dto.Date,
                Description = dto.Description,
                CategoryId = category.Id,
                UserId = userId
            };

            _context.Incomes.Add(i);
            await _context.SaveChangesAsync();

            
            InvalidateIncomeOverviewCache(userId, i.Date);

            return new IncomeDto
            {
                Id = i.Id,
                Name = i.Name,
                Amount = i.Amount,
                Date = i.Date,
                CategoryId = category.Id,
                CategoryName = category.Name
            };
        }


        public async Task<bool> UpdateIncomeAsync(string userId, Guid id, UpdateIncomeDto dto)
        {
            _logger.LogInformation("Updating income {Id} for user {UserId}", id, userId);

            var i = await _context.Incomes.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
            if (i == null) return false;

            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId);
            if (!categoryExists)
                throw new InvalidOperationException("Invalid category ID provided");

            i.Name = dto.Name;
            i.Amount = dto.Amount;
            i.Date = dto.Date;
            i.Description = dto.Description;
            i.CategoryId = dto.CategoryId;

            await _context.SaveChangesAsync();

            InvalidateIncomeOverviewCache(userId, i.Date);

            return true;
        }


        public async Task<bool> DeleteIncomeAsync(string userId, Guid id)
        {
            _logger.LogInformation("Deleting income {Id} for user {UserId}", id, userId);

            var i = await _context.Incomes.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
            if (i == null) return false;

            _context.Incomes.Remove(i);
            await _context.SaveChangesAsync();

            InvalidateIncomeOverviewCache(userId, i.Date);

            return true;
        }


        private void InvalidateIncomeOverviewCache(string userId, DateTime date)
        {
            var key = $"income-overview:{userId}:{date.Month}:{date.Year}";
            _cache.Remove(key);
            _logger.LogInformation("Invalidated cache: {CacheKey}", key);
        }
    }
}
