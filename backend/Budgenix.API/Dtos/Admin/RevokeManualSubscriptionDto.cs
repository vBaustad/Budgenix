namespace Budgenix.Dtos.Admin
{
    public class RevokeManualSubscriptionDto
    {
        public Guid OverrideId { get; set; }
        public string? Reason { get; set; }
    }

}
