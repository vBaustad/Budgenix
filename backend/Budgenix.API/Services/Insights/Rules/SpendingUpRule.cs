using Budgenix.Data;
using Budgenix.Dtos.Insights;
using Budgenix.Models.Finance;
using Microsoft.EntityFrameworkCore;

namespace Budgenix.Services.Insights.Rules
{
    public class SpendingUpRule : IInsightRule
    {
        public async Task<List<InsightDto>> EvaluateAsync(BudgenixDbContext context, string userId, int month, int year)
        {
            var insights = new List<InsightDto>();

            var currentMonthSpent = await context.Expenses
                .Where(e => e.UserId == userId && e.Date.Month == month && e.Date.Year == year)
                .SumAsync(e => (decimal?)e.Amount) ?? 0;

            var lastMonthDate = new DateTime(year, month, 1).AddMonths(-1);
            var lastMonthSpent = await context.Expenses
                .Where(e => e.UserId == userId && e.Date.Month == lastMonthDate.Month && e.Date.Year == lastMonthDate.Year)
                .SumAsync(e => (decimal?)e.Amount) ?? 0;

            if (lastMonthSpent == 0) return insights; // No comparison possible

            var percentUp = ((currentMonthSpent - lastMonthSpent) / lastMonthSpent) * 100;

            if (percentUp >= 10) // You can adjust threshold here
            {
                insights.Add(new InsightDto
                {
                    Icon = "addForm",
                    Title = $"Spending up {percentUp:F0}%",
                    Message = $"You've spent {percentUp:F0}% more than in {lastMonthDate:MMMM}.",
                    Status = "warning",
                    Category = InsightCategoryEnum.Expenses
                });
            }

            return insights;
        }
    }
}
