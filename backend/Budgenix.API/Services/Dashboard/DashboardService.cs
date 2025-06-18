using Budgenix.Data;
using Budgenix.Dtos.Dashboard;
using Budgenix.Models.Finance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace Budgenix.Services.Dashboard
{
    public interface IDashboardService
    {
        Task<DashboardSummaryDto> GetDashboardSummaryAsync(string userId, int month, int year);
    }

    public class DashboardService : IDashboardService
    {
        private readonly BudgenixDbContext _context;
        private readonly IMemoryCache _cache;
        private readonly ILogger<DashboardService> _logger;

        public DashboardService(BudgenixDbContext context, IMemoryCache cache, ILogger<DashboardService> logger)
        {
            _context = context;
            _cache = cache;
            _logger = logger;
        }

        public async Task<DashboardSummaryDto> GetDashboardSummaryAsync(string userId, int month, int year)
        {
            var cacheKey = $"dashboard:{userId}:{month}:{year}";
            _logger.LogInformation("Dashboard summary requested for User {UserId}, {Month}/{Year}", userId, month, year);

            if (_cache.TryGetValue(cacheKey, out DashboardSummaryDto cachedSummary))
            {
                _logger.LogInformation("Dashboard summary served from cache for User {UserId}, {Month}/{Year}", userId, month, year);
                return cachedSummary;
            }

            var stopwatch = System.Diagnostics.Stopwatch.StartNew();

            try
            {
                var now = DateTime.Today;
                var firstOfMonth = new DateTime(year, month, 1);
                var lastMonth = firstOfMonth.AddMonths(-1);

                var expenses = await _context.Expenses
                    .Where(e => e.UserId == userId &&
                        (e.Date.Month == month && e.Date.Year == year ||
                         e.Date.Month == lastMonth.Month && e.Date.Year == lastMonth.Year))
                    .Include(e => e.Category)
                    .ToListAsync();

                var totalSpent = expenses
                    .Where(e => e.Date.Month == month && e.Date.Year == year)
                    .Sum(e => e.Amount);

                var lastMonthSpent = expenses
                    .Where(e => e.Date.Month == lastMonth.Month && e.Date.Year == lastMonth.Year)
                    .Sum(e => e.Amount);

                var incomes = await _context.Incomes
                    .Where(e => e.UserId == userId && e.Date.Month == month && e.Date.Year == year)
                    .ToListAsync();

                var incomeReceived = incomes.Sum(e => e.Amount);

                var activeBudgets = await _context.Budgets
                    .Where(b => b.UserId == userId && b.IsActive && b.StartDate <= now && (b.EndDate == null || b.EndDate >= now))
                    .ToListAsync();

                var allocatedTotal = activeBudgets.Sum(b => b.AllocatedAmount);

                var spentPerCategory = expenses
                    .Where(e => e.Date.Month == month && e.Date.Year == year)
                    .GroupBy(e => e.Category.Name)
                    .Select(g => new { CategoryName = g.Key, Total = g.Sum(e => e.Amount) })
                    .OrderByDescending(g => g.Total)
                    .ToList();

                var topCategory = spentPerCategory.FirstOrDefault();

                var goals = await _context.Goals
                    .Where(g => g.UserId == userId)
                    .ToListAsync();

                var totalGoals = goals.Count;
                var nearCompleted = goals.Count(g => g.TargetAmount > 0 && g.CurrentAmount / g.TargetAmount >= 0.9m);
                var totalSavings = goals.Sum(g => g.CurrentAmount);

                var summary = new DashboardSummaryDto
                {
                    TotalSpentThisMonth = totalSpent,
                    IncomeReceivedThisMonth = incomeReceived,
                    TotalSavings = totalSavings,
                    ActiveBudgets = activeBudgets.Count,
                    BudgetAllocatedTotal = allocatedTotal,
                    BudgetSpentTotal = totalSpent,
                    SpendingIsUp = totalSpent > lastMonthSpent,
                    SpendingVsLastMonthDiff = Math.Abs(totalSpent - lastMonthSpent),
                    TopSpendingCategory = topCategory?.CategoryName,
                    TopSpendingAmount = topCategory?.Total ?? 0,
                    TotalGoals = totalGoals,
                    GoalsNearCompletion = nearCompleted
                };

                stopwatch.Stop();
                _logger.LogInformation("Dashboard summary computed for User {UserId}, {Month}/{Year} in {ElapsedMs} ms",
                    userId, month, year, stopwatch.ElapsedMilliseconds);

                _cache.Set(cacheKey, summary, TimeSpan.FromSeconds(60));

                return summary;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error computing dashboard summary for User {UserId}, {Month}/{Year}", userId, month, year);
                throw;
            }
        }
    }
}
