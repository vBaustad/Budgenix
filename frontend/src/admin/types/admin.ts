import { AuditLogDto } from "./auditLogDto";

export interface AdminUserDto {
  id: string;
  email: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  emailConfirmed?: boolean;
  role: string;
  signupDate: string;
  lastLogin?: string;
  isActive: boolean;
  subscriptionTier: string;
  subscriptionIsActive?: boolean;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  billingCycle?: string;
  preferredCurrency?: string;
  referralCode?: string;
  country?: string;
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
