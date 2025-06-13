import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/utils/api';

export type User = {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  stateOrProvince: string | null;
  zipOrPostalCode: string | null;
  country: string | null;
  subscriptionTier: string;
  subscriptionIsActive: boolean;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;
  billingCycle: string;
  referralCode: string | null;
  currency: string;
};

const fetchUser = async (): Promise<User> => {
  const res = await apiFetch('/api/account/me');
  if (!res.ok) throw new Error('Failed to fetch user');
  return await res.json();
};

export function useUserQuery() {
  return useQuery<User>({
    queryKey: ['user'],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5,
  });
}
