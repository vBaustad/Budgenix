using Budgenix.Models.Finance;
using Budgenix.Models.Shared;
using System.ComponentModel.DataAnnotations;

namespace Budgenix.Dtos.Budgets
{

    //Output
    public class BudgetDto
    {
        public Guid Id { get; set; }

        [Required]
        [MaxLength(100)]
        public required string Name { get; set; }

        [Required]
        public required string CategoryName { get; set; }
        public decimal AllocatedAmount { get; set; }
        public RecurrenceTypeEnum Recurrence { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public BudgetTypeEnum Type { get; set; }
        public string? Notes { get; set; }
    }
}
