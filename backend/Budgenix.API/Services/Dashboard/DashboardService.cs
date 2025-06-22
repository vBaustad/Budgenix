using Budgenix.Data;
using Budgenix.Dtos.Dashboard;
using Budgenix.Models.Shared;
using Budgenix.Services.Dashboard;
using Budgenix.Services.Finance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

public class DashboardService : IDashboardService
{
    private readonly BudgenixDbContext _context;
    private readonly IExpenseService _expenseService;
    private readonly IIncomeService _incomeService;
    private readonly IMemoryCache _cache;
    private readonly ILogger<DashboardService> _logger;

    public DashboardService(
        BudgenixDbContext context,
        IExpenseService expenseService,
        IIncomeService incomeService,
        IMemoryCache cache,
        ILogger<DashboardService> logger)
    {
        _context = context;
        _expenseService = expenseService;
        _incomeService = incomeService;
        _cache = cache;
        _logger = logger;
    }

    public async Task<DashboardSummaryDto> GetDashboardSummaryAsync(string userId, int month, int year)
    {
        var cacheKey = $"dashboard:{userId}:{month}:{year}";
        if (_cache.TryGetValue(cacheKey, out DashboardSummaryDto cached))
        {
            _logger.LogInformation("Dashboard summary served from cache for {UserId} {Month}/{Year}", userId, month, year);
            return cached;
        }

        _logger.LogInformation("Generating dashboard summary for {UserId} {Month}/{Year}", userId, month, year);

        var expenseOverview = await _expenseService.GetOverviewAsync(userId, month, year);
        var incomeOverview = await _incomeService.GetOverviewAsync(userId, month, year);

        var activeBudgets = await _context.Budgets
            .Where(b => b.UserId == userId && b.IsActive)
            .ToListAsync();

        var goals = await _context.Goals
            .Where(g => g.UserId == userId)
            .ToListAsync();

        var daysInMonth = DateTime.DaysInMonth(year, month);
        var averageDailySpend = expenseOverview.TotalExpense / daysInMonth;
        var daysOver = expenseOverview.DailyTotals.Count(d => d.Total > averageDailySpend);

        var topCategory = await _context.Expenses
            .Where(e => e.UserId == userId && e.Date.Month == month && e.Date.Year == year)
            .GroupBy(e => e.Category.Name)
            .Select(g => new { CategoryName = g.Key, Total = g.Sum(e => e.Amount) })
            .OrderByDescending(g => g.Total)
            .FirstOrDefaultAsync();

        var lastIncome = await _context.Incomes
            .Where(i => i.UserId == userId)
            .OrderByDescending(i => i.Date)
            .FirstOrDefaultAsync();

        var totalSavings = goals.Sum(g => g.CurrentAmount);
        var totalTarget = goals.Sum(g => g.TargetAmount > 0 ? g.TargetAmount : 0);
        var savingsProgress = totalTarget > 0 ? (totalSavings / totalTarget) * 100 : 0;

        var nextGoal = goals
            .Where(g => g.TargetDate != null)
            .OrderBy(g => g.TargetDate)
            .FirstOrDefault();

        var summary = new DashboardSummaryDto
        {
            TotalSpentThisMonth = expenseOverview.TotalExpense,
            IncomeReceivedThisMonth = incomeOverview.TotalIncome,
            BudgetSpentTotal = expenseOverview.TotalExpense,
            BudgetAllocatedTotal = activeBudgets.Sum(b => b.AllocatedAmount),
            ActiveBudgets = activeBudgets.Count,
            SpendingIsUp = expenseOverview.TotalExpense > expenseOverview.LastMonthExpense,
            SpendingVsLastMonthDiff = Math.Abs(expenseOverview.TotalExpense - expenseOverview.LastMonthExpense),
            TopSpendingCategory = topCategory?.CategoryName,
            TopSpendingAmount = topCategory?.Total ?? 0,
            AverageDailySpend = averageDailySpend,
            DaysOverDailyAverage = daysOver,
            UpcomingExpensesCount = await _context.RecurringItems
                .CountAsync(r => r.UserId == userId && r.Type == RecurringItemType.Expense && r.IsActive),
            UpcomingIncomeCount = await _context.RecurringItems
                .CountAsync(r => r.UserId == userId && r.Type == RecurringItemType.Income && r.IsActive),
            LastIncomeAmount = lastIncome?.Amount ?? 0,
            LastIncomeSource = lastIncome?.Name,
            TotalSavings = totalSavings,
            SavingsGoalProgressPercent = savingsProgress,
            TotalGoals = goals.Count,
            GoalsNearCompletion = goals.Count(g => g.TargetAmount > 0 && g.CurrentAmount / g.TargetAmount >= 0.9m),
            NextGoalName = nextGoal?.Name,
            NextGoalDueDate = nextGoal?.TargetDate?.ToString("o"),
            LastUpdated = DateTime.UtcNow.ToString("o")
        };

        _cache.Set(cacheKey, summary, TimeSpan.FromMinutes(5));
        return summary;
    }
}
