using System.ComponentModel.DataAnnotations;

namespace Budgenix.Models
{
    public class Expense
    {
        public Guid Id { get; set; } // Unique identifier for the expense

        [Required, StringLength(100)]
        public required string Name { get; set; }
        [Required, StringLength(250)]
        public required string Description { get; set; }
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public required decimal Amount { get; set; }
        [Required]
        public required DateTime Date { get; set; }
        [Required]
        public Guid CategoryId { get; set; }
        [Required]
        public required Category Category { get; set; }
        public bool IsRecurring { get; set; }
        public RecurrenceType RecurrenceFrequency { get; set; }
        [StringLength(500)]
        public string? Notes { get; set; }
    }
}
