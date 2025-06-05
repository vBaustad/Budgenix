using Budgenix.Data;
using Budgenix.Dtos.Insights;
using Microsoft.EntityFrameworkCore;

namespace Budgenix.Services.Insights.Rules
{
    public class LowIncomeCoverageRule : IInsightRule
    {
        private readonly IUserService _userService;

        public LowIncomeCoverageRule(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<List<InsightDto>> EvaluateAsync(BudgenixDbContext context, string userId, int month, int year)
        {
            var insights = new List<InsightDto>();

            var income = await context.Incomes
                .Where(i => i.UserId == userId && i.Date.Month == month && i.Date.Year == year)
                .SumAsync(i => (decimal?)i.Amount) ?? 0;

            var upcomingRecurring = await context.RecurringItems
                .Where(r => r.UserId == userId &&
                            r.Type == "Expense" &&
                            r.IsActive &&
                            r.StartDate <= new DateTime(year, month, DateTime.DaysInMonth(year, month)))
                .SumAsync(r => (decimal?)r.Amount) ?? 0;

            var user = await _userService.GetCurrentUserAsync();
            var currency = user?.PreferredCurrency ?? "USD";

            if (income < upcomingRecurring)
            {
                insights.Add(new InsightDto
                {
                    Icon = "warning",
                    Title = "Insufficient income for recurring expenses",
                    Message = $"Your income this month ({CurrencyFormatter.Format(income, currency)}) may not cover your upcoming recurring costs ({CurrencyFormatter.Format(upcomingRecurring, currency)}).",
                    Status = "warning",
                    Category = InsightCategoryEnum.Income
                });
            }

            return insights;
        }
    }
}
