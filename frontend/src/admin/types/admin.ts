import { AuditLogDto } from "./auditLogDto";

export interface AdminUserDto {
  id: string;
  email: string;
  role: string;
  signupDate: string;
  lastLogin?: string;
  isActive: boolean;
  subscriptionTier: string;
}


export interface AdminUserDetailsDto extends AdminUserDto {
  stats: {
    expenses: number;
    income: number;
    budgets: number;
    goals: number;
  };
  recentLogs: AuditLogDto[];
}

export interface AdminDeleteResultDto {
  success: boolean;
  deletedItemsCount?: number;
}
