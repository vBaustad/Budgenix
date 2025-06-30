import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

const RequireAdmin = ({ children }: { children: ReactNode }) => {
  const { user, authChecked } = useAuth();

  if (!authChecked) {
    return <div className="p-6">Checking permissions...</div>;
  }

  if (!user?.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default RequireAdmin;
