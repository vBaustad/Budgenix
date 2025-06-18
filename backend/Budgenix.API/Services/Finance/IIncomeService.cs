using Budgenix.Dtos.Incomes;

namespace Budgenix.Services.Finance
{
    public interface IIncomeService
    {
        Task<List<IncomeDto>> GetIncomesAsync(
            string userId,
            DateTime? from = null,
            DateTime? to = null,
            List<Guid>? categoryIds = null,
            string? sort = null
        );

        Task<IncomeDto?> GetIncomeByIdAsync(string userId, Guid id);

        Task<decimal> GetTotalAsync(string userId);

        Task<List<string>> GetUsedCategoriesAsync(string userId);

        Task<IncomeOverviewDto> GetOverviewAsync(string userId, int month, int year);

        Task<List<IncomeMonthlySummaryDto>> GetMonthlySummaryAsync(string userId, int months);

        Task<IncomeDto> AddIncomeAsync(string userId, CreateIncomeDto dto);

        Task<bool> UpdateIncomeAsync(string userId, Guid id, UpdateIncomeDto dto);

        Task<bool> DeleteIncomeAsync(string userId, Guid id);
    }
}
