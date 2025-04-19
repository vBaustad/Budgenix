using System.ComponentModel.DataAnnotations;

namespace Budgenix.Models
{
    public class Income
    {
        public Guid Id { get; set; } // Unique identifier for the Income

        [Required, StringLength(100)]
        public required string Name { get; set; }
        [Required, StringLength(250)]
        public required string Description { get; set; }        
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public required decimal Amount { get; set; }
        public required DateTime Date { get; set; }
        [Required]
        public required Category Category { get; set; }
        public required bool IsRecurring { get; set; }
        public required RecurrenceType RecurrenceFrequency { get; set; }
        [StringLength(500)]
        public string? Notes { get; set; }
    }
}
