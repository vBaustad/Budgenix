export interface AdminUserDto {
  id: string;
  email: string;
  signupDate: string;
  lastLogin?: string;
  isActive: boolean;
  subscriptionTier: string;
}

export interface AdminUserDetailsDto {
  id: string;
  email: string;
  signupDate: string;
  lastLogin?: string;
  isActive: boolean;
  subscriptionTier: string;
  stats: {
    expenses: number;
    income: number;
    budgets: number;
    goals: number;
  };
}

export interface AdminDeleteResultDto {
  success: boolean;
  deletedItemsCount?: number;
}
