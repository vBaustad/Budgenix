using Budgenix.Models.Shared;
using System.ComponentModel.DataAnnotations;

namespace Budgenix.Dtos.Recurring
{
    public class CreateRecurringItemDto
    {
        [Required(ErrorMessage = "Name is required.")]
        [MaxLength(100, ErrorMessage = "Name cannot exceed 100 characters.")]
        public string Name { get; set; } = null!;

        [MaxLength(250, ErrorMessage = "Description cannot exceed 250 characters.")]
        public string? Description { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than zero.")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "Start date is required.")]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [Required(ErrorMessage = "Frequency is required.")]
        public RecurrenceTypeEnum Frequency { get; set; }

        [Required(ErrorMessage = "Type is required.")]
        public RecurringItemType Type { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;

        public Guid? CategoryId { get; set; }
    }
}
