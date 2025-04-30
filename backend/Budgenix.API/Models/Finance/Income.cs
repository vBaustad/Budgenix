using Budgenix.Models.Shared;
using Budgenix.Models.Categories;
using System.ComponentModel.DataAnnotations;
using Budgenix.Models.Users;
using System.ComponentModel.DataAnnotations.Schema;

namespace Budgenix.Models.Finance
{
    public class Income
    {
        public Guid Id { get; set; }

        [Required, StringLength(100)]
        public required string Name { get; set; }
        [Required, StringLength(250)]
        public required string Description { get; set; }
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public required decimal Amount { get; set; }
        [Required]
        public required DateTime Date { get; set; }
        [Required]
        public Guid CategoryId { get; set; }
        [Required]
        public Category? Category { get; set; }
        public bool IsRecurring { get; set; }
        public RecurrenceTypeEnum RecurrenceFrequency { get; set; }
        [StringLength(500)]
        public string? Notes { get; set; }
        public string? UserId { get; set; }
        [ForeignKey("UserId")]
        public ApplicationUser? User { get; set; }
    }
}
