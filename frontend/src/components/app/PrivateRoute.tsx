import { useAuth } from '../../context/AuthContext'; // adjust path if needed
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }: { children: ReactNode }) {
    const { isLoggedIn, isLoading } = useAuth();
  
    if (isLoading) {
      return <div>Loading...</div>; // or loading spinner
    }
  
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
  
    return children;
  }
  