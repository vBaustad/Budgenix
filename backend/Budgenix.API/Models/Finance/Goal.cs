using Budgenix.Models.Users;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Budgenix.Models.Finance
{
    public class Goal
    {
        public Guid Id { get; set; }

        [Required, StringLength(100)]
        public string Name { get; set; } = null!;

        [StringLength(250)]
        public string? Description { get; set; }

        [Range(0.01, double.MaxValue)]
        public decimal TargetAmount { get; set; }

        [Range(0.0, double.MaxValue)]
        public decimal CurrentAmount { get; set; } = 0;

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? TargetDate { get; set; }

        public bool IsActive { get; set; } = true;

        [Required]
        public string UserId { get; set; } = null!;

        [ForeignKey("UserId")]
        public ApplicationUser? User { get; set; }
    }
}
