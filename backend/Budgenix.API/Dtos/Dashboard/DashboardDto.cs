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
    }
}
