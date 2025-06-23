export type GoalDto = {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;  // ISO date string
  isActive: boolean;
  icon?: string;        // icon identifier (if you have icons in DB)
};

export type CreateGoalDto = {
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;  // ISO date string
  icon?: string;
};

export type UpdateGoalDto = {
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;  // ISO date string
  icon?: string;
};

export type GoalContributionDto = {
  amount: number;
};
