using Budgenix.Models.Finance;
using Budgenix.Models.Shared;

namespace Budgenix.Dtos.Cashflow
{
    public class CashflowItemDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public RecurrenceTypeEnum Frequency { get; set; }
        public CashflowItemType Type { get; set; }
        public string? Person { get; set; }
        public Guid? CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public string? CategoryColor { get; set; }
    }

}
