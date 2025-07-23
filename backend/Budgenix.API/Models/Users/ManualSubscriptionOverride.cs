namespace Budgenix.Models.Users
{
    public class ManualSubscriptionOverride
    {
        public Guid Id { get; set; }
        public string UserId { get; set; } = default!;
        public SubscriptionTypeEnum Tier { get; set; }
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
        public DateTime EndDate { get; set; }
        public string? CustomMessage { get; set; }
        public bool SentEmail { get; set; } = false;
        public string? CreatedByAdminId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual ApplicationUser User { get; set; } = default!;
    }

}
