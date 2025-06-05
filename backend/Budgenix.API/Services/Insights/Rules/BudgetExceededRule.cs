using Budgenix.Data;
using Budgenix.Dtos.Insights;
using Budgenix.Models.Shared;
using Microsoft.EntityFrameworkCore;

public class BudgetExceededRule : IInsightRule
{
    public async Task<List<InsightDto>> EvaluateAsync(BudgenixDbContext context, string userId, int month, int year)
    {
        var insights = new List<InsightDto>();

        var budgets = await context.Budgets
            .Include(b => b.Category)
            .Where(b => b.UserId == userId &&
                        b.Recurrence == RecurrenceTypeEnum.Monthly &&
                        b.StartDate <= new DateTime(year, month, 1) &&
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

            if (spent > budget.AllocatedAmount)
            {
                insights.Add(new InsightDto
                {
                    Icon = "alert",
                    Title = $"{budget.Category?.Name} budget exceeded",
                    Message = $"You've spent {spent - budget.AllocatedAmount:C0} more than planned in {budget.Category?.Name}.",
                    Status = "warning",
                    Category = InsightCategoryEnum.Budget
                });
            }
        }

        return insights;
    }
}
