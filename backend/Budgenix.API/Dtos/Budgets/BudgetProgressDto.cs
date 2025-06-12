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

        public decimal AllocatedAmount { get; set; }

        public decimal TotalSpent { get; set; }

        public decimal RemainingAmount => AllocatedAmount - TotalSpent;

        public double PercentUsed => AllocatedAmount == 0 ? 0 : (double)(TotalSpent / AllocatedAmount) * 100;

        public RecurrenceTypeEnum Recurrence { get; set; }


        public bool IsOverBudget => TotalSpent > AllocatedAmount;
    }
}
