import { createContext, useContext, useMemo, useEffect, useState } from 'react';
import { useUserQuery, User } from '@/features/user/hooks/useUserQuery';

type UserContextType = {
  user: User | null | undefined;
  cachedUser: User | undefined;
  isLoading: boolean;
  refetchUser: () => void;
};


const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, refetch } = useUserQuery();
  const [cachedUser, setCachedUser] = useState<User | undefined>(undefined);


  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('budgenix_user', JSON.stringify(user));
        setCachedUser(user);
      } catch (err) {
        console.warn('Failed to cache user', err);
      }
    }
  }, [user]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('budgenix_user');
        if (stored) {
          setCachedUser(JSON.parse(stored));
        }
      } catch (err) {
        console.warn('Failed to parse cached user', err);
      }
    }
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
