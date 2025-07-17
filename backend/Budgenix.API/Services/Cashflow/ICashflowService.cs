using Budgenix.Dtos.Cashflow;
using Budgenix.Dtos;
using Budgenix.Dtos.Insights;

namespace Budgenix.Services.Finance
{
    public interface ICashflowService
    {
        Task<List<CashflowItemDto>> GetItemsAsync(string userId);
        Task<CashflowSummaryDto> GetSummaryAsync(string userId);
        Task<List<InsightDto>> GetInsightsAsync(string userId);

        Task<CashflowItemDto> AddItemAsync(string userId, CreateCashflowItemDto dto);

        Task<bool> UpdateItemAsync(string userId, Guid id, UpdateCashflowItemDto dto);

        Task<bool> DeleteItemAsync(string userId, Guid id);
    }
}