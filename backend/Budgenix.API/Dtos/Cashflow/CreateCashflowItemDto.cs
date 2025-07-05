using Budgenix.Models.Finance;
using Budgenix.Models.Shared;

namespace Budgenix.Dtos.Cashflow
{
    public class CreateCashflowItemDto
    {
        public string Name { get; set; } = null!;
        public decimal Amount { get; set; }
        public RecurrenceTypeEnum Frequency { get; set; } = RecurrenceTypeEnum.Monthly;
        public CashflowItemType Type { get; set; } = CashflowItemType.Expense;
        public Guid? CategoryId { get; set; }
        public string? Person { get; set; }
    }
}
