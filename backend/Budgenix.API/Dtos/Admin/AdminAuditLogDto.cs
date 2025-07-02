namespace Budgenix.Dtos.Admin
{
    public class AdminAuditLogDto
    {
        public string Action { get; set; } = "";
        public string? EntityType { get; set; }
        public string? EntityId { get; set; }
        public DateTime Timestamp { get; set; }
        public bool Success { get; set; }
        public string? Metadata { get; set; }
    }
}
