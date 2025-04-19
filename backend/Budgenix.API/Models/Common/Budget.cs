using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Budgenix.Models
{
    public class Budget
    {
        public Guid Id { get; set; }

        [Required]
        public required string Category { get; set; }
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal AllocatedAmount { get; set; }
        [Range(1, 12, ErrorMessage = "Month must be between 1 and 12")]
        public int Month {  get; set; }
        [Range(2000, 2100, ErrorMessage = "Year must be a valid 4-digit number")]
        public int Year { get; set; }
        [StringLength(500)]
        public string? Notes { get; set; }
        public BudgetType Type { get; set; } = BudgetType.Fixed;

        // This is optional, but can be useful for unique constraints
        [NotMapped]
        public string UniqueKey => $"{Category.ToLowerInvariant()}_{Month}_{Year}";

        public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
    }
}
