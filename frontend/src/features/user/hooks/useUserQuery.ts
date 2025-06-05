import { useQuery } from '@tanstack/react-query';

export type User = {
  id: string;
  userName: string;
  email: string;
  subscriptionTier: string;
  subscriptionIsActive: boolean;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;
  billingCycle: string;
  referralCode: string;
  currency: string;
};

const fetchUser = async (): Promise<User> => {
  const res = await fetch('/api/account/me', { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch user');
  const data = await res.json();
  return data;
};


export function useUserQuery() {
  return useQuery<User>({
    queryKey: ['user'],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5,
  });
}