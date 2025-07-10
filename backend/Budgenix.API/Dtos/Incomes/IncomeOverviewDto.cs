using Budgenix.Dtos.Recurring;

namespace Budgenix.Dtos.Incomes
{
    public class IncomeOverviewDto
    {
        public decimal TotalIncome { get; set; }
        public decimal LastMonthIncome { get; set; }
        public List<DailyIncomeDto> DailyTotals { get; set; } = new();
        public decimal AnnualIncome { get; set; }
        public decimal AvgMonthly { get; set; }
    }
}
