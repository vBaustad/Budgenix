using Budgenix.Models.Finance;
using Budgenix.Models.Shared;
using System.ComponentModel.DataAnnotations;

namespace Budgenix.Dtos.Budgets
{
    public class BudgetDto
    {
        public Guid Id { get; set; }

        [Required]
        [MaxLength(100)]
        public required string Name { get; set; }

        [Required]
        public Guid CategoryId { get; set; }

        [Required]
        public required string CategoryName { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal AllocatedAmount { get; set; }

        public RecurrenceTypeEnum Recurrence { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public BudgetTypeEnum Type { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        public bool IsActive { get; set; }
    }
}
