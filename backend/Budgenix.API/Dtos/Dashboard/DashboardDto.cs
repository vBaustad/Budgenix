namespace Budgenix.Dtos.Dashboard
{
    public class DashboardSummaryDto
    {
        public decimal TotalSpentThisMonth { get; set; }
        public decimal IncomeReceivedThisMonth { get; set; }
        public decimal TotalSavings { get; set; }
        public int ActiveBudgets { get; set; }
        public decimal BudgetAllocatedTotal { get; set; }
        public decimal BudgetSpentTotal { get; set; }
        public decimal SpendingVsLastMonthDiff { get; set; }
        public bool SpendingIsUp { get; set; }
        public string? TopSpendingCategory { get; set; }
        public decimal TopSpendingAmount { get; set; }
        public int TotalGoals { get; set; }
        public int GoalsNearCompletion { get; set; }
        public int BudgetsNearLimit { get; set; }
        public int BudgetsOverLimit { get; set; }
        public string? LowestRemainingBudgetName { get; set; }
        public decimal LowestRemainingBudgetAmount { get; set; }
        public decimal AverageDailySpend { get; set; }
        public int DaysOverDailyAverage { get; set; }
        public int UpcomingExpensesCount { get; set; }
        public int UpcomingIncomeCount { get; set; }
        public decimal LastIncomeAmount { get; set; }
        public string? LastIncomeSource { get; set; }
        public decimal SavingsGoalProgressPercent { get; set; }
        public string? NextGoalName { get; set; }
        public string? NextGoalDueDate { get; set; }
        public decimal MonthlyCashflowBalance { get; set; }
        public decimal MonthlyCashflowIncome { get; set; }
        public decimal MonthlyCashflowExpenses { get; set; }

        public string LastUpdated { get; set; } = DateTime.UtcNow.ToString("o");
        public int AlertsCount { get; set; }
    }
}
