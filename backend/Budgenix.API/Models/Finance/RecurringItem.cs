using Budgenix.Models.Categories;
using Budgenix.Models.Shared;
using Budgenix.Models.Users;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Budgenix.Models.Finance
{
    public class RecurringItem : BaseEntity
    {

        public Guid Id { get; set; }
        [Required]
        [MaxLength(100)]
        public required string Name { get; set; }
        
        [MaxLength(250)]
        public string? Description { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than zero.")]
        public decimal Amount { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [Required]
        public RecurrenceTypeEnum Frequency { get; set; }

        [Required]
        public RecurringItemType Type { get; set; }

        public Guid? CategoryId { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;
        public DateTime? LastSkippedDate { get; set; }
        public DateTime? LastTriggeredDate { get; set; }

        [ForeignKey("CategoryId")]
        public Category? Category { get; set; }


        public string? UserId { get; set; }
        [ForeignKey("UserId")]
        public ApplicationUser? User { get; set; }

        // Optional: Foreign key to user/household if needed
    }
}
