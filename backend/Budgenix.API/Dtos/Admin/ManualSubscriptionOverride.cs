using Budgenix.Models.Users;

namespace Budgenix.Dtos.Admin
{
    public class ManualSubscriptionOverrideDto
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public SubscriptionTypeEnum Tier { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? CustomMessage { get; set; }
        public bool SentEmail { get; set; }
        public string? CreatedByAdminId { get; set; }
        public DateTime CreatedAt { get; set; }
    }

}
