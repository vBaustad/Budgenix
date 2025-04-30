using Budgenix.Models.Shared;
using System.ComponentModel.DataAnnotations;

namespace Budgenix.Dtos.Expenses
{

    //Output
    public class ExpenseDto
    {
        public Guid Id { get; set; }

        [Required]
        [MaxLength(100)]
        public required string Name { get; set; }
        [Required]
        public required string Description { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        [Required]
        public required string CategoryName { get; set; }
        public bool IsRecurring { get; set; }
        public RecurrenceTypeEnum RecurrenceFrequency { get; set; }
        public string? Notes { get; set; }
    }
}
