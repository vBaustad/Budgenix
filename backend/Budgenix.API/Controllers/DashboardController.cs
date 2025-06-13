using Microsoft.AspNetCore.Mvc;
using Budgenix.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Budgenix.Services;
using AutoMapper;
using Budgenix.Helpers.Query;
using Budgenix.Dtos.Expenses;
using Budgenix.Models.Finance;
using Budgenix.Models.Shared;
using Microsoft.Extensions.Localization;
using Budgenix.Services.Recurring;
using Budgenix.Dtos.Recurring;
using Budgenix.Models.Categories;

namespace Budgenix.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly BudgenixDbContext _context;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly RecurringItemService _recurringService;

        public DashboardController(IUserService userService, BudgenixDbContext context, IMapper mapper, RecurringItemService recurringService)
        {
            _context = context;
            _userService = userService;
            _mapper = mapper;
            _recurringService = recurringService;
        }

        [HttpGet("summary")]
        public async Task<ActionResult<DashboardSummaryDto>> GetDashboardSummary([FromQuery] int month, [FromQuery] int year)
        {
            var userId = _userService.GetUserId();
            var now = DateTime.Today;
            var firstOfMonth = new DateTime(year, month, 1);
            var lastMonth = firstOfMonth.AddMonths(-1);

            var totalSpent = await _context.Expenses
                .Where(e => e.UserId == userId && e.Date.Month == month && e.Date.Year == year)
                .SumAsync(e => (decimal?)e.Amount) ?? 0;

            var lastMonthSpent = await _context.Expenses
                .Where(e => e.UserId == userId && e.Date.Month == lastMonth.Month && e.Date.Year == lastMonth.Year)
                .SumAsync(e => (decimal?)e.Amount) ?? 0;

            var incomeReceived = await _context.Incomes
                .Where(e => e.UserId == userId && e.Date.Month == month && e.Date.Year == year)
                .SumAsync(e => (decimal?)e.Amount) ?? 0;

            var activeBudgets = await _context.Budgets
                .Where(b => b.UserId == userId && b.IsActive && b.StartDate <= now && (b.EndDate == null || b.EndDate >= now))
                .ToListAsync();

            var allocatedTotal = activeBudgets.Sum(b => b.AllocatedAmount);

            var spentPerBudget = await _context.Expenses
                .Where(e => e.UserId == userId && e.Date.Month == month && e.Date.Year == year)
                .GroupBy(e => e.CategoryId)
                .Select(g => new { CategoryId = g.Key, Total = g.Sum(e => e.Amount) })
                .ToListAsync();

            var spentTotal = spentPerBudget.Sum(x => x.Total);

            var topCategory = spentPerBudget
                .OrderByDescending(x => x.Total)
                .FirstOrDefault();

            var topCategoryName = topCategory != null
                ? await _context.Categories.Where(c => c.Id == topCategory.CategoryId).Select(c => c.Name).FirstOrDefaultAsync()
                : null;

            var goals = await _context.Goals
                .Where(g => g.UserId == userId)
                .ToListAsync();

            var totalGoals = goals.Count;
            var nearCompleted = goals.Count(g => g.CurrentAmount / g.TargetAmount >= 0.9m);
            var totalSavings = goals.Sum(g => g.CurrentAmount);

            return Ok(new DashboardSummaryDto
            {
                TotalSpentThisMonth = totalSpent,
                IncomeReceivedThisMonth = incomeReceived,
                TotalSavings = totalSavings,
                ActiveBudgets = activeBudgets.Count,
                BudgetAllocatedTotal = allocatedTotal,
                BudgetSpentTotal = spentTotal,
                SpendingIsUp = totalSpent > lastMonthSpent,
                SpendingVsLastMonthDiff = Math.Abs(totalSpent - lastMonthSpent),
                TopSpendingCategory = topCategoryName,
                TopSpendingAmount = topCategory?.Total ?? 0,
                TotalGoals = totalGoals,
                GoalsNearCompletion = nearCompleted
            });
        }
    }

    public class DashboardSummaryDto
    {
        public decimal TotalSpentThisMonth { get; set; }
        public decimal IncomeReceivedThisMonth { get; set; }
        public decimal TotalSavings { get; set; }
        public int ActiveBudgets { get; set; }
        public decimal BudgetAllocatedTotal { get; set; }
        public decimal BudgetSpentTotal { get; set; }
        public decimal SpendingVsLastMonthDiff { get; set; }
        public bool SpendingIsUp { get; set; }
        public string? TopSpendingCategory { get; set; }
        public decimal TopSpendingAmount { get; set; }
        public int TotalGoals { get; set; }
        public int GoalsNearCompletion { get; set; }
    }
}
