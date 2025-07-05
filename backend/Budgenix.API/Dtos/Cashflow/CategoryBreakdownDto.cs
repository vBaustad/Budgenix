using Budgenix.Models.Finance;

namespace Budgenix.Dtos.Cashflow
{
    public class CategoryBreakdownDto
    {
        public Guid? CategoryId { get; set; }
        public decimal MonthlyTotal { get; set; }
        public decimal AnnualTotal { get; set; }
        public CashflowItemType Type { get; set; }
    }

}
