using Budgenix.Models.Shared;
using Budgenix.Models.Users;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Budgenix.Models.Categories;

namespace Budgenix.Models.Finance
{
    public class CashflowItem : BaseEntity
    {
        public Guid Id { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; } = null!;

        [Required, Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }

        [Required]
        public RecurrenceTypeEnum Frequency { get; set; } = RecurrenceTypeEnum.Monthly;

        public CashflowItemType Type { get; set; } = CashflowItemType.Expense;

        public Guid? CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public Category? Category { get; set; }

        public string? Person {  get; set; }
        public string? UserId { get; set; }
        [ForeignKey("UserId")]
        public ApplicationUser? User { get; set; }
    }

    public enum CashflowItemType
    {
        Income,
        Expense
    }

}
