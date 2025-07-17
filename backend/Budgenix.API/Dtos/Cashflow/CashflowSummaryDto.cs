using Microsoft.AspNetCore.Mvc;

namespace Budgenix.Dtos.Cashflow
{
    public class CashflowSummaryDto
    {
        public decimal MonthlyIncome { get; set; }
        public decimal MonthlyExpenses { get; set; }
        public decimal MonthlySavings { get; set; }
        public decimal MonthlyBalance { get; set; }

        public decimal AnnualIncome { get; set; }
        public decimal AnnualExpenses { get; set; }
        public decimal AnnualSavings { get; set; }
        public decimal AnnualBalance { get; set; }

        public List<CategoryBreakdownDto> CategoryBreakdown { get; set; }
    }
}

