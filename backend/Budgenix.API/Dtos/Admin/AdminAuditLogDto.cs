public class AdminAuditLogDto
{
    public string Id { get; set; }
    public string UserId { get; set; }
    public string Action { get; set; }
    public string? EntityType { get; set; }
    public string? EntityId { get; set; }
    public string? TargetUserId { get; set; }
    public string? OldValues { get; set; }
    public string? NewValues { get; set; }
    public string? Metadata { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public bool Success { get; set; }
    public string? ErrorMessage { get; set; }
    public DateTime Timestamp { get; set; }
}
