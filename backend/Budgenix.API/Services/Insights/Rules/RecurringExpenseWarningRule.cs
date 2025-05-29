using Budgenix.Data;
using Budgenix.Dtos.Insights;
using Microsoft.EntityFrameworkCore;

namespace Budgenix.Services.Insights.Rules
{
    public class RecurringExpenseWarningRule : IInsightRule
    {
        public async Task<List<InsightDto>> EvaluateAsync(BudgenixDbContext context, string userId, int month, int year)
        {
            var insights = new List<InsightDto>();

            var recurringExpenses = await context.RecurringItems
                .Where(r => r.UserId == userId &&
                            r.Type == "Expense" &&
                            r.IsActive &&
                            r.StartDate <= new DateTime(year, month, DateTime.DaysInMonth(year, month)) &&
                            (r.EndDate == null || r.EndDate >= new DateTime(year, month, 1)))
                .ToListAsync();

            var totalRecurring = recurringExpenses.Sum(r => r.Amount);

            if (totalRecurring > 3000) // Arbitrary warning threshold
            {
                insights.Add(new InsightDto
                {
                    Icon = "recurring",
                    Title = "High recurring expenses",
                    Message = $"Your recurring expenses total {totalRecurring:C0} this month.",
                    Status = "warning",
                    Category = InsightCategoryEnum.Expenses
                });
            }

            return insights;
        }
    }
}
