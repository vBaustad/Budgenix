namespace Budgenix.Services.Shared
{
    public interface ICacheInvalidatorService
    {
        void InvalidateDashboard(string userId, DateTime date);
        void InvalidateExpenseOverview(string userId, DateTime date);
        void InvalidateIncomeOverview(string userId, DateTime date);
        void InvalidateBudgets(string userId);
        void InvalidateGoals(string userId, Guid? goalId = null);
        void InvalidateCashflow(string userId);
    }
}
