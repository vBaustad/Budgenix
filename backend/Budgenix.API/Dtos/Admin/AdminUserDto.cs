using Budgenix.Models.Users;

namespace Budgenix.Dtos.Admin
{
    public class AdminUserDto
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public DateTime SignupDate { get; set; }
        public DateTime? LastLogin { get; set; }
        public bool IsActive { get; set; }
        public SubscriptionTypeEnum SubscriptionTier { get; set; }

    }
}
