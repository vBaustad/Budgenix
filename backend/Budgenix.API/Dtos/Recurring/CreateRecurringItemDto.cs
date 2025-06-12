using Budgenix.Models.Shared;
using System.ComponentModel.DataAnnotations;

namespace Budgenix.Dtos.Recurring
{
    public class CreateRecurringItemDto
    {
        [Required]
        public string Name { get; set; } = null!;

        [MaxLength(250)]
        public string? Description { get; set; }

        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [Required]
        public RecurrenceTypeEnum Frequency { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;

        [Required]
        public RecurringItemType Type { get; set; }

        public Guid? CategoryId { get; set; }
    }
}
