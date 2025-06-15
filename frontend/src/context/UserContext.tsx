import { createContext, useContext, useMemo, useEffect } from 'react';
import { useUserQuery, User } from '@/features/user/hooks/useUserQuery';

type UserContextType = {
  user: User | undefined;
  cachedUser: User | undefined;
  isLoading: boolean;
  refetchUser: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, refetch } = useUserQuery();

  useEffect(() => {
    if (user) {
      localStorage.setItem('budgenix_user', JSON.stringify(user));
    }
  }, [user]);

  const cachedUser = useMemo(() => {
    const stored = localStorage.getItem('budgenix_user');
    return stored ? (JSON.parse(stored) as User) : undefined;
  }, []);

  const value = useMemo(() => ({
    user,
    cachedUser,
    isLoading,
    refetchUser: refetch,
  }), [user, cachedUser, isLoading, refetch]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}


export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
