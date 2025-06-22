using Budgenix.Models.Categories;
using Budgenix.Models.Shared;
using Budgenix.Models.Users;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class RecurringItem : BaseEntity
{
    public Guid Id { get; set; }

    [Required, MaxLength(100)]
    public required string Name { get; set; }

    [MaxLength(250)]
    public string? Description { get; set; }

    [Required, Range(0.01, double.MaxValue)]
    public decimal Amount { get; set; }

    [Required]
    public DateTime StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    [Required]
    public RecurrenceTypeEnum Frequency { get; set; }

    [Required]
    public RecurringItemType Type { get; set; }

    public Guid? CategoryId { get; set; }
    [ForeignKey("CategoryId")]
    public Category? Category { get; set; }

    public string? UserId { get; set; }
    [ForeignKey("UserId")]
    public ApplicationUser? User { get; set; }

    [Required]
    public bool IsActive { get; set; } = true;

    public bool IsFulfilledForCurrentPeriod { get; set; } = false;

    public DateTime? NextExpectedDate { get; set; }

    public DateTime? LastMatchedDate { get; set; }
    public DateTime? LastMissedDate { get; set; }

    public DateTime? LastTriggeredDate { get; set; }
    public DateTime? LastSkippedDate { get; set; }

    public Guid? LastMatchedTransactionId { get; set; } // optional: bank match trace
}
