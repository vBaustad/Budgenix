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

        // Admin
        AdminDeleteUser,
        AdminResetPassword,
        AdminPromoteToAdmin,
        AdminChangeSubscription,

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
