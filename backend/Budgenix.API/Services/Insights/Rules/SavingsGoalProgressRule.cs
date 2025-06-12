using Budgenix.Data;
using Budgenix.Dtos.Insights;
using Budgenix.Models.Finance;
using Microsoft.EntityFrameworkCore;

namespace Budgenix.Services.Insights.Rules
{
    public class SavingsGoalProgressRule : IInsightRule
    {
        public async Task<List<InsightDto>> EvaluateAsync(BudgenixDbContext context, string userId, int month, int year)
        {
            var insights = new List<InsightDto>();

            var savingsBudgets = await context.Budgets
                .Where(b => b.UserId == userId &&
                            b.Type == BudgetTypeEnum.Saving &&
                            (b.EndDate == null || b.EndDate >= DateTime.Today))
                .ToListAsync();

            foreach (var budget in savingsBudgets)
            {
                var totalSaved = await context.Expenses
                    .Where(e => e.UserId == userId &&
                                e.CategoryId == budget.CategoryId &&
                                e.Date.Month == month &&
                                e.Date.Year == year)
                    .SumAsync(e => (decimal?)e.Amount) ?? 0;

                if (budget.AllocatedAmount > 0)
                {
                    var percent = (totalSaved / budget.AllocatedAmount) * 100;
                    if (percent >= 40)
                    {
                        insights.Add(new InsightDto
                        {
                            Icon = "goal",
                            Title = $"{budget.Name} goal {Math.Floor(percent)}% complete",
                            Message = $"You’re on track to reach your savings goal of {budget.AllocatedAmount:C0}.",
                            Status = "positive",
                            Category = InsightCategoryEnum.Goals
                        });
                    }
                }
            }

            return insights;
        }
    }
}
