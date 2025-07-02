using Budgenix.Dtos.Admin;
using Budgenix.Models.Audit;

namespace Budgenix.Services.Audit
{
    public interface IAuditService
    {
        Task LogAsync(AuditLog log);

        Task LogAsync(string userId, AuditActionEnum action, string? entityType = null, string? entityId = null,
                      string? targetUserId = null, string? oldValues = null, string? newValues = null,
                      string? metadata = null, bool success = true, string? errorMessage = null);

        Task<List<AdminAuditLogDto>> GetLogsForUserAsync(string userId);
    }
}
