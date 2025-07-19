namespace Budgenix.Models.System
{
    public class SystemNotification
    {
        public string Id { get; set; } = Guid.NewGuid().ToString(); // or semantic ID like "cashflow-v1"

        // Replace direct text with localization keys
        public string TitleKey { get; set; } = null!;
        public string MessageKey { get; set; } = null!;

        // keep raw values during transition or fallback rendering
        public string? Title { get; set; }
        public string? Message { get; set; }

        public string Tag { get; set; } = "info"; // "major", "minor", "hotfix", etc.
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;
    }
}
