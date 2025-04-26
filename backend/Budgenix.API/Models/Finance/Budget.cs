using Budgenix.Models.Categories;
using Budgenix.Models.Shared;
using Budgenix.Models.Users;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Budgenix.Models.Finance
{
    public class Budget
    {
        public Guid Id { get; set; }
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = null!;

        [Required]
        public Guid CategoryId { get; set; }

        [Required]
        public Category Category { get; set; } = null!;

        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal AllocatedAmount { get; set; }

        public RecurrenceTypeEnum Recurrence { get; set; } = RecurrenceTypeEnum.Monthly;

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public BudgetTypeEnum Type { get; set; } = BudgetTypeEnum.Spending; // Spending or Saving

        [StringLength(500)]
        public string? Notes { get; set; }

        [Required]
        public string UserId { get; set; } = null!;
        [ForeignKey("UserId")]
        public ApplicationUser? User { get; set; }

        public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
    }
}
