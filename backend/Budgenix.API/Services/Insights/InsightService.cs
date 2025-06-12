using Budgenix.Data;
using Budgenix.Dtos.Insights;
using Budgenix.Services.Insights;
using Microsoft.EntityFrameworkCore;

public class InsightService : IInsightService
{
    private readonly BudgenixDbContext _context;
    private readonly IEnumerable<IInsightRule> _rules;

    public InsightService(BudgenixDbContext context, IEnumerable<IInsightRule> rules)
    {
        _context = context;
        _rules = rules;
    }

    public async Task<List<InsightDto>> GenerateInsightsAsync(string userId, int month, int year)
    {
        var insights = new List<InsightDto>();

        if (new DateTime(year, month, 1) > DateTime.Today)
            return new List<InsightDto>();


        foreach (var rule in _rules)
        {
            var result = await rule.EvaluateAsync(_context, userId, month, year);
            if (result != null && result.Any())
            {                
                insights.AddRange(result);
            }

        }

        return insights;
    }
}
