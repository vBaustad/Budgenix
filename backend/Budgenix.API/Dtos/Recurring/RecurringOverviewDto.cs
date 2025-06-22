namespace Budgenix.Dtos.Recurring
{
    public class RecurringOverviewDto
    {
        public List<RecurringItemDto> UpcomingRecurringExpenses { get; set; } = new();
        public List<RecurringItemDto> UpcomingRecurringIncomes { get; set; } = new();

        public RecurringItemDto? NextRecurringExpense { get; set; }
        public RecurringItemDto? NextRecurringIncome { get; set; }

        public decimal MonthlyRecurringExpenseTotal { get; set; }
        public decimal MonthlyRecurringIncomeTotal { get; set; }

        public decimal PlannedNetResult => MonthlyRecurringIncomeTotal - MonthlyRecurringExpenseTotal;

        public RecurringItemDto? LastTriggeredRecurringExpense { get; set; }
        public RecurringItemDto? LastSkippedRecurringExpense { get; set; }

        public RecurringItemDto? LastTriggeredRecurringIncome { get; set; }
        public RecurringItemDto? LastSkippedRecurringIncome { get; set; }

        public string? PeriodLabel { get; set; }
        public int MatchedCount { get; set; }
        public int UnmatchedCount { get; set; }
        public decimal MatchedAmountTotal { get; set; }
        public decimal UnmatchedAmountTotal { get; set; }

        public Dictionary<string, decimal> CategoryExpenseTotals { get; set; } = new();
        public Dictionary<string, decimal> CategoryIncomeTotals { get; set; } = new();

        // NEW: upcoming totals that only consider future dates this month
        public decimal UpcomingRecurringExpenseTotal { get; set; }
        public decimal UpcomingRecurringIncomeTotal { get; set; }
    }
}
