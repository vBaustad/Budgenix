using Budgenix.Models.Finance;
using Budgenix.Models.Shared;
using System.ComponentModel.DataAnnotations;

namespace Budgenix.Dtos.Budgets
{
    public class BudgetProgressDto
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

        public decimal TotalSpent { get; set; }

        public decimal RemainingAmount => AllocatedAmount - TotalSpent;

        public double PercentUsed => AllocatedAmount == 0 ? 0 : (double)(TotalSpent / AllocatedAmount) * 100;

        public RecurrenceTypeEnum Recurrence { get; set; }

        public BudgetTypeEnum Type { get; set; }

        public bool IsActive { get; set; }

        public bool IsOverBudget => TotalSpent > AllocatedAmount;
    }
}
