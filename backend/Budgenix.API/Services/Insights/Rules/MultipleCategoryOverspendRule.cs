using Budgenix.Data;
using Budgenix.Dtos.Insights;
using Budgenix.Models.Finance;
using Microsoft.EntityFrameworkCore;

namespace Budgenix.Services.Insights.Rules
{
    public class MultipleCategoryOverspendRule : IInsightRule
    {
        public async Task<List<InsightDto>> EvaluateAsync(BudgenixDbContext context, string userId, int month, int year)
        {
            var insights = new List<InsightDto>();

            var budgets = await context.Budgets
                .Where(b => b.UserId == userId &&
                            b.Type == BudgetTypeEnum.Spending &&
                            (b.EndDate == null || b.EndDate >= DateTime.Today))
                .Include(b => b.Expenses)
                .Include(b => b.Category)
                .ToListAsync();

            foreach (var budget in budgets)
            {
                var spent = budget.Expenses
                    .Where(e => e.Date.Month == month && e.Date.Year == year)
                    .Sum(e => e.Amount);

                if (spent > budget.AllocatedAmount)
                {
                    var overspent = spent - budget.AllocatedAmount;

                    insights.Add(new InsightDto
                    {
                        Icon = "warning",
                        Title = $"{budget.Category.Name} budget exceeded",
                        Message = $"You spent {overspent:C0} more than the allocated budget for {budget.Category.Name}.",
                        Status = "warning",
                        Category = InsightCategoryEnum.Expenses
                    });
                }
            }

            return insights;
        }
    }
}
