using System;
using System.ComponentModel.DataAnnotations;

namespace Budgenix.Models.Audit
{
    public class AuditLog
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string UserId { get; set; } = null!; // Who performed the action

        public string? TargetUserId { get; set; } // Who was affected, if different

        [Required]
        public AuditActionEnum Action { get; set; } = AuditActionEnum.Unknown;

        [MaxLength(100)]
        public string? EntityType { get; set; } // e.g., "Expense", "Goal", "User"

        public string? EntityId { get; set; } // ID of the affected entity (Guid or string)

        public string? OldValues { get; set; } // JSON serialized old data (for update/delete)

        public string? NewValues { get; set; } // JSON serialized new data (for create/update)

        public string? Metadata { get; set; } // Optional extra context (e.g., frontend screen info)

        public string? IpAddress { get; set; } // Capture for logging/debugging

        public string? UserAgent { get; set; } // Helps trace browser/device

        public bool Success { get; set; } = true; // Whether the action succeeded

        public string? ErrorMessage { get; set; } // Optional error detail

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}



