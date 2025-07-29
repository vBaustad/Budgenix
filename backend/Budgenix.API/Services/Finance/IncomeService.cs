using Budgenix.Data;
using Budgenix.Dtos.Incomes;
using Budgenix.Dtos.Recurring;
using Budgenix.Models.Audit;
using Budgenix.Models.Finance;
using Budgenix.Models.Shared;
using Budgenix.Services.Audit;
using Budgenix.Services.BankStatements.NameSuggester;
using Budgenix.Services.Recurring;
using Budgenix.Services.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace Budgenix.Services.Finance
{
    public class IncomeService : IIncomeService
    {
        private readonly BudgenixDbContext _context;
        private readonly ILogger<IncomeService> _logger;
        private readonly RecurringItemService _recurringService;
        private readonly INameSuggesterService _nameSuggesterService;
        private readonly IMemoryCache _cache;
        private readonly IAuditService _audit;
        private readonly ICacheInvalidatorService _cacheInvalidatorService;

        public IncomeService(
            BudgenixDbContext context,
            ILogger<IncomeService> logger,
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

        public async Task<List<IncomeDto>> GetIncomesAsync(
            string userId,
            DateTime? from = null,
            DateTime? to = null,
            List<Guid>? categoryIds = null,
            string? sort = null)
        {
            _logger.LogInformation("Fetching incomes for user {UserId}", userId);

            var query = _context.Incomes
                .AsNoTracking()
                .Include(i => i.Category)
                .Where(i => i.UserId == userId && !i.IsInternalTransfer)
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
                CategoryId = i.CategoryId,
                IsInternalTransfer = i.IsInternalTransfer,
            }).ToList();
        }

        public async Task<IncomeDto?> GetIncomeByIdAsync(string userId, Guid id)
        {
            _logger.LogInformation("Fetching income {Id} for user {UserId}", id, userId);
            var income = await _context.Incomes
                .AsNoTracking()
                .Include(x => x.Category)
                .FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);

            if (income == null)
            {
                _logger.LogWarning("Income {Id} not found for user {UserId}", id, userId);
                return null;
            }

            return new IncomeDto
            {
                Id = income.Id,
                Name = income.Name,
                Amount = income.Amount,
                Date = income.Date,
                CategoryName = income.Category?.Name,
                CategoryId = income.CategoryId,
                IsInternalTransfer = income.IsInternalTransfer,
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
                .Where(i => i.UserId == userId && !i.IsInternalTransfer)
                .SumAsync(i => i.Amount);

            _cache.Set(cacheKey, total, TimeSpan.FromMinutes(5));
            return total;
        }

        public async Task<List<string>> GetUsedCategoriesAsync(string userId)
        {
            _logger.LogInformation("Fetching used income categories for user {UserId}", userId);
            return await _context.Incomes
                .AsNoTracking()
                .Where(i => i.UserId == userId && !i.IsInternalTransfer && i.Category != null)
                .Select(i => i.Category!.Name)
                .Distinct()
                .OrderBy(i => i)
                .ToListAsync();
        }

        public async Task<List<IncomeMonthlySummaryDto>> GetMonthlySummaryAsync(string userId, int months)
        {
            _logger.LogInformation("Generating monthly income summary for user {UserId} over {Months} months", userId, months);

            var start = DateTime.UtcNow.Date.AddMonths(-months + 1);

            var incomes = await _context.Incomes
                .AsNoTracking()
                .Include(i => i.Category)
                .Where(i => i.UserId == userId && !i.IsInternalTransfer && i.Date >= start && i.Category != null)
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
                .AsNoTracking()
                .Where(i => i.UserId == userId && !i.IsInternalTransfer &&
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
               
                var monthlySums = await _context.Incomes
                    .AsNoTracking()
                    .Where(i => i.UserId == userId && i.Date.Year == year)
                    .GroupBy(i => i.Date.Month)
                    .Select(g => new
                    {
                        Month = g.Key,
                        Total = g.Sum(i => i.Amount)
                    })
                    .ToListAsync();

                var annualIncome = monthlySums.Sum(m => m.Total);
                var avgMonthly = monthlySums.Count > 0
                    ? monthlySums.Average(m => m.Total)
                    : 0m;

            var result = new IncomeOverviewDto
            {
                TotalIncome = totalIncome,
                LastMonthIncome = lastMonthIncome,
                DailyTotals = dailyTotals,
                AnnualIncome = annualIncome,
                AvgMonthly = avgMonthly
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
            {
                _logger.LogWarning("Invalid category ID {CategoryId} provided. Falling back to 'Miscellaneous'.", dto.CategoryId);

                category = await _context.Categories
                    .Where(c => c.Name == "Miscellaneous")
                    .Select(c => new { c.Id, c.Name })
                    .FirstOrDefaultAsync();

                if (category == null)
                    throw new InvalidOperationException("Fallback category 'Miscellaneous' not found.");
            }

            var exist = await _context.Incomes.AnyAsync(i =>
                i.Amount == dto.Amount &&
                i.Date == dto.Date &&
                (i.Description ?? "").ToLower().Trim() == (dto.Description ?? "").ToLower().Trim() &&
                i.IsInternalTransfer == dto.IsInternalTransfer &&
                i.CategoryId == category.Id &&
                i.UserId == userId
);

            if (exist)
            {
                _logger.LogWarning("Duplicate income detected. Skipping insert for user {UserId}: {Name}, {Amount}, {Date}", userId, dto.Name, dto.Amount, dto.Date);
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
            
            var income = new Income
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

            _context.Incomes.Add(income);
            await _context.SaveChangesAsync();

            await _audit.LogAsync(new AuditLog
            {
                UserId = userId,
                Action = AuditActionEnum.CreateIncome,
                EntityType = "Income",
                EntityId = income.Id.ToString(),
                NewValues = JsonSerializer.Serialize(income)
            });

            _cacheInvalidatorService.InvalidateIncomeOverview(userId, income.Date);
            _cacheInvalidatorService.InvalidateDashboard(userId, income.Date);

            return new IncomeDto
            {
                Id = income.Id,
                Name = income.Name,
                Amount = income.Amount,
                Date = income.Date,
                CategoryId = category.Id,
                CategoryName = category.Name,
                IsInternalTransfer = income.IsInternalTransfer,
            };
        }

        public async Task<bool> UpdateIncomeAsync(string userId, Guid id, UpdateIncomeDto dto)
        {
            _logger.LogInformation("Updating income {Id} for user {UserId}", id, userId);

            var income = await _context.Incomes.FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);
            if (income == null) return false;

            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId);
            if (!categoryExists)
                throw new InvalidOperationException("Invalid category ID provided");

            var oldDate = income.Date;
            var oldValues = JsonSerializer.Serialize(income);

            income.Name = dto.Name;
            income.Amount = dto.Amount;
            income.Date = dto.Date;
            income.Description = dto.Description;
            income.IsInternalTransfer = dto.IsInternalTransfer;
            income.CategoryId = dto.CategoryId;

            await _context.SaveChangesAsync();

            await _audit.LogAsync(userId, AuditActionEnum.UpdateIncome, "Income", income.Id.ToString(), oldValues, JsonSerializer.Serialize(income));

            _cacheInvalidatorService.InvalidateExpenseOverview(userId, oldDate);
            _cacheInvalidatorService.InvalidateIncomeOverview(userId, income.Date);
            _cacheInvalidatorService.InvalidateDashboard(userId, income.Date);

            return true;
        }

        public async Task<bool> DeleteIncomeAsync(string userId, Guid id)
        {
            _logger.LogInformation("Deleting income {Id} for user {UserId}", id, userId);

            var income = await _context.Incomes.FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);
            if (income == null) return false;

            var oldValues = JsonSerializer.Serialize(income);

            _context.Incomes.Remove(income);
            await _context.SaveChangesAsync();

            await _audit.LogAsync(userId, AuditActionEnum.DeleteIncome, "Income", income.Id.ToString(), oldValues, null);

            _cacheInvalidatorService.InvalidateIncomeOverview(userId, income.Date);
            _cacheInvalidatorService.InvalidateDashboard(userId, income.Date);

            return true;
        }
    }
}
