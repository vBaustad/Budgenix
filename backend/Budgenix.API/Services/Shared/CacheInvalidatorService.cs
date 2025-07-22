using Microsoft.Extensions.Caching.Memory;

namespace Budgenix.Services.Shared
{
    public class CacheInvalidatorService : ICacheInvalidatorService
    {
        private readonly IMemoryCache _cache;
        private readonly ILogger<CacheInvalidatorService> _logger;

        public CacheInvalidatorService(IMemoryCache cache, ILogger<CacheInvalidatorService> logger)
        {
            _cache = cache;
            _logger = logger;
        }

        public void InvalidateDashboard(string userId, DateTime date)
        {
            var thisMonth = $"dashboard:{userId}:{date.Month}:{date.Year}";
            var lastMonth = $"dashboard:{userId}:{date.AddMonths(-1).Month}:{date.AddMonths(-1).Year}";
            _cache.Remove(thisMonth);
            _cache.Remove(lastMonth);
            _logger.LogInformation("Invalidated dashboard: {0}, {1}", thisMonth, lastMonth);
        }

        public void InvalidateExpenseOverview(string userId, DateTime date)
        {
            var thisMonth = $"expense-overview:{userId}:{date.Month}:{date.Year}";
            var lastMonth = $"expense-overview:{userId}:{date.AddMonths(-1).Month}:{date.AddMonths(-1).Year}";
            _cache.Remove(thisMonth);
            _cache.Remove(lastMonth);
            _logger.LogInformation("Invalidated expense overview: {0}, {1}", thisMonth, lastMonth);
        }

        public void InvalidateIncomeOverview(string userId, DateTime date)
        {
            var thisMonth = $"income-overview:{userId}:{date.Month}:{date.Year}";
            var lastMonth = $"income-overview:{userId}:{date.AddMonths(-1).Month}:{date.AddMonths(-1).Year}";
            _cache.Remove(thisMonth);
            _cache.Remove(lastMonth);
            _logger.LogInformation("Invalidated income overview: {0}, {1}", thisMonth, lastMonth);
        }

        public void InvalidateBudgets(string userId)
        {
            var key = $"budgets:{userId}";
            _cache.Remove(key);
            _logger.LogInformation("Invalidated budgets cache: {0}", key);
        }

        public void InvalidateGoals(string userId, Guid? goalId = null)
        {
            _cache.Remove($"goals:{userId}");
            if (goalId != null)
                _cache.Remove($"goal:{userId}:{goalId}");
        }

        public void InvalidateCashflow(string userId)
        {
            _cache.Remove($"cashflow:{userId}");
        }

    }

}
