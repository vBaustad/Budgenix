using Budgenix.Models.Shared;

namespace Budgenix.Dtos.Recurring
{
    public class RecurringItemDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime StartDate { get; set; }
        public RecurrenceTypeEnum Frequency { get; set; }
        public DateTime? NextOccurrenceDate { get; set; }
    }
}
