using Budgenix.Models.Categories;
using Budgenix.Models.Finance;
using Budgenix.Models.Shared;
using Budgenix.Models.Users;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class Budget
{
    public Guid Id { get; set; }
    [Required, StringLength(100)]
    public string Name { get; set; } = null!;
    [Required]
    public Guid CategoryId { get; set; }
    [Required]
    public Category Category { get; set; } = null!;
    public decimal AllocatedAmount { get; set; }
    public RecurrenceTypeEnum Recurrence { get; set; } = RecurrenceTypeEnum.Monthly;
    [Required]
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public BudgetTypeEnum Type { get; set; } = BudgetTypeEnum.Spending;
    [StringLength(500)]
    public string? Notes { get; set; }
    public bool IsActive { get; set; } = true;

    // NEW FIELDS
    public bool AllowOverspend { get; set; } = false;
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;
    public DateTime? DateModified { get; set; }

    [Required]
    public string UserId { get; set; } = null!;
    [ForeignKey("UserId")]
    public ApplicationUser? User { get; set; }
}
