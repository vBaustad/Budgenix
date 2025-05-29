using Budgenix.Data;
using Budgenix.Dtos.Insights;

public interface IInsightRule
{
    Task<List<InsightDto>> EvaluateAsync(BudgenixDbContext context, string userId, int month, int year);
}
