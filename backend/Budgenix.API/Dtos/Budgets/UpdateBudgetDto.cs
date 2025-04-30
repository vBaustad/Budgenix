using Budgenix.Models.Finance;
using Budgenix.Models.Shared;
using System.ComponentModel.DataAnnotations;

namespace Budgenix.Dtos.Budgets
{
    public class UpdateBudgetDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name can't be longer than 100 characters")]
        public required string Name { get; set; }

        [Required(ErrorMessage = "CategoryId is required")]
        public Guid CategoryId { get; set; }

        [Required(ErrorMessage = "AllocatedAmount is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal AllocatedAmount { get; set; }

        public RecurrenceTypeEnum Recurrence { get; set; } = RecurrenceTypeEnum.Monthly;

        [Required(ErrorMessage = "StartDate is required")]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public BudgetTypeEnum Type { get; set; } = BudgetTypeEnum.Spending;

        [StringLength(500, ErrorMessage = "Notes can't be longer than 500 characters")]
        public string? Notes { get; set; }

    }
}
