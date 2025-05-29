using Budgenix.Data;
using Budgenix.Dtos.Insights;
using Budgenix.Models.Finance;
using Microsoft.EntityFrameworkCore;

namespace Budgenix.Services.Insights.Rules
{
    public class BudgetUnderspentRule : IInsightRule
    {
        public async Task<List<InsightDto>> EvaluateAsync(BudgenixDbContext context, string userId, int month, int year)
        {
            var insights = new List<InsightDto>();

            var budgets = await context.Budgets
                .Include(b => b.Category)
                .Where(b => b.UserId == userId &&
                            b.Type == BudgetTypeEnum.Spending &&
                            b.StartDate <= new DateTime(year, month, DateTime.DaysInMonth(year, month)) &&
                            (b.EndDate == null || b.EndDate >= new DateTime(year, month, 1)))
                .ToListAsync();

            foreach (var budget in budgets)
            {
                var spent = await context.Expenses
                    .Where(e => e.UserId == userId &&
                                e.CategoryId == budget.CategoryId &&
                                e.Date.Month == month &&
                                e.Date.Year == year)
                    .SumAsync(e => (decimal?)e.Amount) ?? 0;

                if (spent < budget.AllocatedAmount * 0.75m) // Arbitrary 75% threshold
                {
                    insights.Add(new InsightDto
                    {
                        Icon = "budget",
                        Title = $"{budget.Name} budget on track",
                        Message = $"You've only used {spent:C0} of your {budget.AllocatedAmount:C0} budget in {budget.Category.Name}.",
                        Status = "positive",
                        Category = InsightCategoryEnum.Budget
                    });
                }
            }

            return insights;
        }
    }
}
