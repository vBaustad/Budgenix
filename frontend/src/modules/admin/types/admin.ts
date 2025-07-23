import { AuditLogDto } from './auditLogDto';

// Manual Subscription Override DTO
export interface ManualSubscriptionOverrideDto {
  id: string;
  userId: string;
  tier: string;
  startDate: string;
  endDate: string;
  grantedBy: string;
}

// Used for POSTing a new override
export interface GrantSubscriptionOverrideDto {
  userId: string;
  tier: string;
  startDate: string;
  endDate: string;
  sendEmail?: boolean;
  customMessage?: string;   
}

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
  manualOverrides?: ManualSubscriptionOverrideDto[];
}

export interface AdminDeleteResultDto {
  success: boolean;
  deletedItemsCount?: number;
}
