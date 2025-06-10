import { AuthProvider } from './AuthContext';
import { UserProvider } from './UserContext';

export const UserLayer = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <UserProvider>
      {children}
    </UserProvider>
  </AuthProvider>
);
