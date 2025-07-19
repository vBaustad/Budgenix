using Budgenix.Models.Users;

namespace Budgenix.Dtos.Admin
{
    public class AdminUserDto
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string? UserName { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public bool EmailConfirmed { get; set; }
        public string Role { get; set; } = "User";
        public DateTime SignupDate { get; set; }
        public DateTime? LastLogin { get; set; }
        public bool IsActive { get; set; }
        public SubscriptionTypeEnum SubscriptionTier { get; set; }
        public bool SubscriptionIsActive { get; set; }
        public BillingCycleEnum? BillingCycle { get; set; }
        public DateTime? SubscriptionStartDate { get; set; }
        public DateTime? SubscriptionEndDate { get; set; }
        public string? Currency { get; set; }
        public string? ReferralCode { get; set; }
        public string? Country { get; set; }
    }
}
