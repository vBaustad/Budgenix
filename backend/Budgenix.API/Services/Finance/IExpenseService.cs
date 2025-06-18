using Budgenix.Dtos.Expenses;

namespace Budgenix.Services.Finance
{
    public interface IExpenseService
    {
        Task<List<ExpenseDto>> GetExpensesAsync(
            string userId,
            DateTime? from = null,
            DateTime? to = null,
            List<Guid>? categoryIds = null,
            string? sort = null
        );

        Task<ExpenseDto?> GetExpenseByIdAsync(string userId, Guid id);

        Task<decimal> GetTotalAsync(string userId);

        Task<List<string>> GetUsedCategoriesAsync(string userId);

        Task<ExpenseOverviewDto> GetOverviewAsync(string userId, int month, int year);

        Task<ExpenseDto> AddExpenseAsync(string userId, CreateExpenseDto dto);

        Task<bool> UpdateExpenseAsync(string userId, Guid id, UpdateExpenseDto dto);

        Task<bool> DeleteExpenseAsync(string userId, Guid id);
    }
}
