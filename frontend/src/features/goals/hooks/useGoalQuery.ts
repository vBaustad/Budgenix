import { useQuery } from '@tanstack/react-query';
import { GoalDto } from '@/types/finance/goal';
import { useAuth } from '@/context/AuthContext';
import { fetchGoals } from '../services/GoalsService';

type Params = {
  activeOnly?: boolean;
};

export function useGoalsQuery({ activeOnly }: Params = {}) {
  const { isLoggedIn } = useAuth();

  return useQuery<GoalDto[]>({
    queryKey: ['goals', activeOnly],
    queryFn: () => fetchGoals(activeOnly),
    staleTime: 1000 * 60 * 5,  // 5 min cache
    enabled: isLoggedIn,
  });
}


