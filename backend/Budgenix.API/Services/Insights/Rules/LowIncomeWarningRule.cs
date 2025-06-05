using Budgenix.Data;
using Budgenix.Dtos.Insights;
using Microsoft.EntityFrameworkCore;

namespace Budgenix.Services.Insights.Rules
{
    public class LowIncomeWarningRule : IInsightRule
    {
        public async Task<List<InsightDto>> EvaluateAsync(BudgenixDbContext context, string userId, int month, int year)
        {
            var insights = new List<InsightDto>();

            var currentMonthIncome = await context.Incomes
                .Where(i => i.UserId == userId && i.Date.Month == month && i.Date.Year == year)
                .SumAsync(i => (decimal?)i.Amount) ?? 0;

            var previous = new DateTime(year, month, 1).AddMonths(-1);
            var lastMonthIncome = await context.Incomes
                .Where(i => i.UserId == userId && i.Date.Month == previous.Month && i.Date.Year == previous.Year)
                .SumAsync(i => (decimal?)i.Amount) ?? 0;

            if (lastMonthIncome > 0 && currentMonthIncome < lastMonthIncome * 0.75m)
            {
                insights.Add(new InsightDto
                {
                    Icon = "income",
                    Title = "Income significantly reduced",
                    Message = $"This month’s income is down {Math.Round((1 - (currentMonthIncome / lastMonthIncome)) * 100)}% compared to last month.",
                    Status = "warning",
                    Category = InsightCategoryEnum.Income
                });
            }

            return insights;
        }
    }
}
