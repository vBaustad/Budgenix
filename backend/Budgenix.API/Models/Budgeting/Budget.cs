using Budgenix.Models.Shared;
using Budgenix.Models.Transactions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Budgenix.Models.Budgeting
{
    public class Budget
    {
        public Guid Id { get; set; }

        [Required]
        public required string Category { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal AllocatedAmount { get; set; }

        public RecurrenceTypeEnum Recurrence { get; set; } = RecurrenceTypeEnum.Monthly;

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public BudgetTypeEnum Type { get; set; } = BudgetTypeEnum.Spending; // Spending or Saving

        [StringLength(500)]
        public string? Notes { get; set; }

        public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
    }
}
