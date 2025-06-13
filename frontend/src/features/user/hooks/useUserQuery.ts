import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

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

export function useUserQuery() {
  const { isLoggedIn, authChecked } = useAuth();

  return useQuery<User>({
    queryKey: ['user'],
    queryFn: async () => {
      return await apiFetch('/api/account/me');
    },
    enabled: authChecked && isLoggedIn,
    staleTime: 0,  // force no caching for now
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}
