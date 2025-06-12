using Budgenix.Data;
using Budgenix.Dtos.Insights;
using Budgenix.Models.Finance;
using Microsoft.EntityFrameworkCore;

namespace Budgenix.Services.Insights.Rules
{
    public class GoalProgressRule : IInsightRule
    {
        public async Task<List<InsightDto>> EvaluateAsync(BudgenixDbContext context, string userId, int month, int year)
        {
            var insights = new List<InsightDto>();

            var goals = await context.Budgets
                .Where(b =>
                    b.UserId == userId &&
                    b.Type == BudgetTypeEnum.Saving &&
                    b.StartDate <= DateTime.Now &&
                    (b.EndDate == null || b.EndDate >= DateTime.Now))
                .ToListAsync();

            foreach (var goal in goals)
            {
                var savedAmount = await context.Expenses
                    .Where(e =>
                        e.UserId == userId &&
                        e.CategoryId == goal.CategoryId &&
                        e.Date.Year == year &&
                        e.Date.Month == month)
                    .SumAsync(e => (decimal?)e.Amount) ?? 0;

                var progressPercent = (savedAmount / goal.AllocatedAmount) * 100;

                if (progressPercent >= 40) // Only show insights for meaningful progress
                {
                    insights.Add(new InsightDto
                    {
                        Icon = "goal",
                        Title = $"{goal.Name} {Math.Floor(progressPercent)}% complete",
                        Message = $"You’re on track to reach your savings goal in your {goal.Recurrence.ToString().ToLower()} plan",
                        Status = "positive",
                        Category = InsightCategoryEnum.Goals
                    });
                }
            }

            return insights;
        }
    }
}
