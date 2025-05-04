using Budgenix.API.Models.Users;
using Budgenix.Models.Users;
using System.ComponentModel.DataAnnotations;

namespace Budgenix.Dtos.Users
{
    public class RegisterDto
    {
        [Required]
        [MinLength(3)]
        public string UserName { get; set; } = null!;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = null!;

        [Required]
        [MaxLength(100)]
        public required string FirstName { get; set; }  // Required: first name

        [Required]
        [MaxLength(100)]
        public required string LastName { get; set; }   // Required: last name

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

        public bool SubscriptionIsActive { get; set; } = false; // default false

        public BillingCycleEnum BillingCycle { get; set; } = BillingCycleEnum.Monthly; // default Monthly

        // Stripe & PayPal (optional, set later or during registration)
        public string? StripeCustomerId { get; set; }
        public string? PayPalSubscriptionId { get; set; }
    }
}
