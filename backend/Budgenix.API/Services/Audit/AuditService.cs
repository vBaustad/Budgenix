using Budgenix.Data;
using Budgenix.Models.Audit;
using Budgenix.Services.Audit;
using Budgenix.Dtos.Admin; // ✅ For AdminAuditLogDto
using Microsoft.EntityFrameworkCore;

namespace Budgenix.Services.Audit
{
    public class AuditService : IAuditService
    {
        private readonly BudgenixDbContext _context;
        private readonly IHttpContextAccessor _http;

        public AuditService(BudgenixDbContext context, IHttpContextAccessor http)
        {
            _context = context;
            _http = http;
        }

        public async Task LogAsync(AuditLog log)
        {
            _context.AuditLogs.Add(log);
            await _context.SaveChangesAsync();
        }

        public async Task LogAsync(
            string userId,
            AuditActionEnum action,
            string? entityType = null,
            string? entityId = null,
            string? targetUserId = null,
            string? oldValues = null,
            string? newValues = null,
            string? metadata = null,
            bool success = true,
            string? errorMessage = null)
        {
            var httpContext = _http.HttpContext;

            var audit = new AuditLog
            {
                UserId = userId,
                Action = action,
                EntityType = entityType,
                EntityId = entityId,
                TargetUserId = targetUserId,
                OldValues = oldValues,
                NewValues = newValues,
                Metadata = metadata,
                IpAddress = httpContext?.Connection?.RemoteIpAddress?.ToString(),
                UserAgent = httpContext?.Request?.Headers["User-Agent"].ToString(),
                Success = success,
                ErrorMessage = errorMessage,
                Timestamp = DateTime.UtcNow
            };

            await LogAsync(audit);
        }

        public async Task<List<AdminAuditLogDto>> GetLogsForUserAsync(string userId)
        {
            var logs = await _context.AuditLogs
                .Where(x => x.UserId == userId || x.TargetUserId == userId)
                .OrderByDescending(x => x.Timestamp)
                .Take(100)
                .ToListAsync();

            return logs.Select(x => new AdminAuditLogDto
            {
                Action = x.Action.ToString(),
                EntityType = x.EntityType,
                EntityId = x.EntityId,
                Timestamp = x.Timestamp,
                Success = x.Success,
                Metadata = x.Metadata
            }).ToList();
        }
    }
}
