using Budgenix.Models.Finance;
using Budgenix.Models.Shared;

namespace Budgenix.Dtos.Cashflow
{
    public class UpdateCashflowItemDto
    {
        public string Name { get; set; } = null!;
        public decimal Amount { get; set; }
        public RecurrenceTypeEnum Frequency { get; set; }
        public CashflowItemType Type { get; set; }
        public Guid? CategoryId { get; set; }
        public string? Person { get; set; }
    }
}
