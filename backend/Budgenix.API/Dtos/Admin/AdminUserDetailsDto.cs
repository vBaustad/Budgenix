namespace Budgenix.Dtos.Admin
{
    public class AdminUserDetailsDto : AdminUserDto
    {
        public UserStatsDto Stats { get; set; } = new();
        public List<AdminAuditLogDto> RecentActivity { get; set; } = new();
        public List<ManualSubscriptionOverrideDto> ManualOverrides { get; set; } = new();

    }
}
