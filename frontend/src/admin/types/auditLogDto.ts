export interface AuditLogDto {
  id: string;
  userId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  targetUserId?: string;
  oldValues?: string;
  newValues?: string;
  metadata?: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
  timestamp: string;
}
