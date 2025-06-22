using Budgenix.Dtos.Recurring;

namespace Budgenix.Dtos.Expenses
{
    public class ExpenseOverviewDto
    {
        public decimal TotalExpense { get; set; }
        public decimal LastMonthExpense { get; set; }
        public decimal IncomeReceived { get; set; }

        public List<DailyExpenseDto> DailyTotals { get; set; } = new List<DailyExpenseDto>();
    }

}
