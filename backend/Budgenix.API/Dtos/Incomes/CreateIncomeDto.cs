using System.ComponentModel.DataAnnotations;
using Budgenix.Models;
using Budgenix.Models.Shared;

namespace Budgenix.Dtos.Incomes
{
    public class CreateIncomeDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = null!;
        [Required]
        [StringLength(250)]
        public string Description { get; set; } = null!;
        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public Guid CategoryId { get; set; }
        
        public bool IsRecurring { get; set; } = false;
        public RecurrenceTypeEnum RecurrenceFrequency { get; set; } = RecurrenceTypeEnum.None;
        [StringLength(500)]
        public string? Notes { get; set; }
    }
}
