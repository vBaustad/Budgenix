// src/context/UserContext.tsx

import { createContext, useContext } from 'react';
import { useUserQuery, User } from '@/features/user/hooks/useUserQuery';

type UserContextType = {
  user: User | undefined;
  isLoading: boolean;
  refetchUser: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, refetch } = useUserQuery();

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        refetchUser: refetch,
      }}
    >
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
