using Budgenix.Data;
using Budgenix.Dtos.Insights;
using Microsoft.EntityFrameworkCore;

namespace Budgenix.Services.Insights.Rules
{
    public class IncomeFluctuationRule : IInsightRule
    {
        public async Task<List<InsightDto>> EvaluateAsync(BudgenixDbContext context, string userId, int month, int year)
        {
            var insights = new List<InsightDto>();

            var currentIncome = await context.Incomes
                .Where(i => i.UserId == userId && i.Date.Month == month && i.Date.Year == year)
                .SumAsync(i => (decimal?)i.Amount) ?? 0;

            var lastMonthDate = new DateTime(year, month, 1).AddMonths(-1);
            var previousIncome = await context.Incomes
                .Where(i => i.UserId == userId && i.Date.Month == lastMonthDate.Month && i.Date.Year == lastMonthDate.Year)
                .SumAsync(i => (decimal?)i.Amount) ?? 0;

            if (previousIncome == 0) return insights;

            var diff = currentIncome - previousIncome;
            var percent = (diff / previousIncome) * 100;

            if (Math.Abs(percent) >= 10)
            {
                insights.Add(new InsightDto
                {
                    Icon = "income",
                    Title = percent > 0 ? $"Income up {percent:F0}%" : $"Income down {Math.Abs(percent):F0}%",
                    Message = percent > 0
                        ? $"You've earned {percent:F0}% more than last month."
                        : $"Your income has dropped {Math.Abs(percent):F0}% compared to last month.",
                    Status = percent > 0 ? "positive" : "warning",
                    Category = InsightCategoryEnum.Income
                });
            }

            return insights;
        }
    }
}
