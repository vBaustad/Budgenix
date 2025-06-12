using Budgenix.API.Models.Users;
using Budgenix.Models.Users;
using System.ComponentModel.DataAnnotations;

namespace Budgenix.Dtos.Users
{
    public class RegisterDto
    {
        [Required]
        [MinLength(3)]
        public required string UserName { get; set; }

        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        [MinLength(6)]
        public required string Password { get; set; }

        [Required]
        [MaxLength(100)]
        public required string FirstName { get; set; } 

        [Required]
        [MaxLength(100)]
        public required string LastName { get; set; } 

        // Address info (optional)
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? City { get; set; }
        public string? StateOrProvince { get; set; }
        public string? ZipOrPostalCode { get; set; }
        public string? Country { get; set; }

        // Subscription fields
        [Required]
        public SubscriptionTypeEnum SubscriptionTier { get; set; } = SubscriptionTypeEnum.Free;  // default to Free
        public BillingCycleEnum BillingCycle { get; set; } = BillingCycleEnum.Monthly; // default Monthly

        // Referral input
        [MaxLength(50)]
        public string? ReferralCodeUsed { get; set; }

        // Stripe & PayPal (optional, set later or during registration)
        public string? StripeCustomerId { get; set; }
        public string? PayPalSubscriptionId { get; set; }
    }
}
