using Budgenix.Dtos.Dashboard;

namespace Budgenix.Services.Dashboard
{
    public interface IDashboardService
    {
        Task<DashboardSummaryDto> GetDashboardSummaryAsync(string userId, int month, int year);
    }
}
