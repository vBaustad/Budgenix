using Budgenix.Models.Shared;

namespace Budgenix.Dtos.Recurring
{
    public class RecurringItemDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Amount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public RecurrenceTypeEnum Frequency { get; set; }
        public bool IsActive { get; set; }
        public RecurringItemType Type { get; set; }
        public Guid? CategoryId { get; set; }
        public string? CategoryName { get; set; }

        public DateTime? LastSkippedDate { get; set; }
        public DateTime? LastTriggeredDate { get; set; }
        public DateTime? LastMatchedDate { get; set; }
        public DateTime? LastMissedDate { get; set; }

        public Guid? LastMatchedTransactionId { get; set; }

        public DateTime? NextOccurrenceDate { get; set; }
        public DateTime? NextExpectedDate { get; set; }

        public bool IsFulfilledForCurrentPeriod { get; set; }
    }
}
