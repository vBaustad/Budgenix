using Budgenix.Dtos.Budgets;
using Budgenix.Models.Finance;

namespace Budgenix.Services.Budgets
{
    public interface IBudgetService
    {
        Task<IEnumerable<BudgetDto>> GetBudgetsAsync(string userId, string? category, BudgetTypeEnum? type, string sort, int skip, int take);
        Task<BudgetDto?> GetBudgetByIdAsync(string userId, Guid id);
        Task<IEnumerable<BudgetProgressDto>> GetAllBudgetProgressAsync(string userId);
        Task<BudgetProgressDto?> GetBudgetProgressAsync(string userId, Guid budgetId);
        Task<BudgetDto> CreateBudgetAsync(string userId, CreateBudgetDto dto);
        Task<BudgetDto?> UpdateBudgetAsync(string userId, UpdateBudgetDto dto);
        Task<bool> DeleteBudgetAsync(string userId, Guid id);
    }
}
