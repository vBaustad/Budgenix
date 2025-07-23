namespace Budgenix.Models.Audit
{
    public enum AuditActionEnum
    {
        // Expense
        CreateExpense,
        UpdateExpense,
        DeleteExpense,

        // Income
        CreateIncome,
        UpdateIncome,
        DeleteIncome,

        // Goals
        CreateGoal,
        UpdateGoal,
        DeleteGoal,

        // Budgets
        CreateBudget,
        UpdateBudget,
        DeleteBudget,

        // Recurring
        CreateRecurringItem,
        UpdateRecurringItem,
        DeleteRecurringItem,
        TriggerRecurringItem,
        SkipRecurringItem,

        // Cashflow
        CreateCashflowItem,
        UpdateCashflowItem,
        DeleteCashflowItem,

        // Admin
        AdminDeleteUser,
        AdminResetPassword,
        AdminPromoteToAdmin,
        AdminChangeSubscription,
        AdminGrantManualSubscription,
        AdminRevokeManualSubscription,

        // Authentication
        UserLogin,
        UserLogout,
        UserRegister,

        // Settings
        UpdateProfile,
        ChangePassword,

        // Other
        Unknown
    }

}
