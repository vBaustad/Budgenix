using Budgenix.Models.Users;
using System.ComponentModel.DataAnnotations;

namespace Budgenix.Dtos.Admin
{
    public class GrantSubscriptionOverrideDto
    {
        [Required]
        public string UserId { get; set; } = default!;

        [Required]
        public SubscriptionTypeEnum Tier { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public string? CustomMessage { get; set; }

        public bool SendEmail { get; set; } = false;
    }
}
