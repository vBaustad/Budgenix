using Budgenix.Dtos.Insights;

namespace Budgenix.Services.Insights
{
    // IInsightService.cs
    public interface IInsightService
    {
        Task<List<InsightDto>> GenerateInsightsAsync(string userId, int month, int year);
    }

}
