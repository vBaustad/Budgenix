using Budgenix.Models.Shared;
using System.ComponentModel.DataAnnotations;

namespace Budgenix.Dtos.Expenses
{
    public class UpdateExpenseDto
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name can't be longer than 100 characters")]
        public required string Name { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [StringLength(250, ErrorMessage = "Description can't be longer than 250 characters")]
        public required string Description { get; set; }

        [Required(ErrorMessage = "Amount is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "Date is required")]
        public DateTime Date { get; set; }

        [Required(ErrorMessage = "CategoryId is required")]
        public Guid CategoryId { get; set; }

        public bool IsRecurring { get; set; } = false;
        public RecurrenceTypeEnum RecurrenceFrequency { get; set; } = RecurrenceTypeEnum.None;

        [StringLength(500, ErrorMessage = "Notes can't be longer than 500 characters")]
        public string? Notes { get; set; }
    }
}
