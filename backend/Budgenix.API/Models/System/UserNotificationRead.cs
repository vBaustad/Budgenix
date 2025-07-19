namespace Budgenix.Models.System
{
    public class UserNotificationRead
    {
        public Guid Id { get; set; }
        public string UserId { get; set; } = null!;
        public string NotificationId { get; set; } = null!;
        public DateTime ReadAt { get; set; } = DateTime.UtcNow;
    }
}
