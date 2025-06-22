using Budgenix.Dtos.Expenses;
using Budgenix.Dtos.Recurring;

namespace Budgenix.Services.Recurring
{
    public interface IRecurringService
    {
        Task<List<RecurringItemDto>> GetAllAsync(string userId);
        Task<List<RecurringItemDto>> GetUpcomingAsync(string userId, int daysAhead = 30);
        Task<RecurringOverviewDto> GetOverviewAsync(string userId, int month, int year);
        Task<RecurringItemDto?> GetByIdAsync(string userId, Guid id);
        Task<RecurringItemDto> CreateAsync(string userId, CreateRecurringItemDto dto);
        Task<RecurringItemDto?> UpdateAsync(string userId, Guid id, UpdateRecurringItemDto dto);
        Task<bool> DeleteAsync(string userId, Guid id);
        Task<ExpenseDto?> TriggerAsync(string userId, Guid id);
        Task<bool> SkipAsync(string userId, Guid id, DateTime? occurrenceDate = null);
        // Future-proof: 
        // Task<bool> MatchAsync(string userId, Guid recurringItemId, Guid bankTransactionId);
    }
}
