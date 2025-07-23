using Budgenix.Models.Users;

namespace Budgenix.Dtos.Users
{
    public class UserDto
    {
        public string Id { get; set; } = "";
        public string UserName { get; set; } = "";
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public string Email { get; set; } = "";
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? City { get; set; }
        public string? StateOrProvince { get; set; }
        public string? ZipOrPostalCode { get; set; }
        public string? Country { get; set; }
        public SubscriptionTypeEnum SubscriptionTier { get; set; }
        public bool SubscriptionIsActive { get; set; }
        public DateTime? SubscriptionStartDate { get; set; }
        public DateTime? SubscriptionEndDate { get; set; }
        public DateTime? OverrideSubscriptionEndDate { get; set; }

        public BillingCycleEnum BillingCycle { get; set; }
        public string? ReferralCode { get; set; }
        public string Currency { get; set; } = "USD";
        public bool IsAdmin { get; set; }
    }
}
