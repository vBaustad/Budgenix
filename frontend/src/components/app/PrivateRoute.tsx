import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PrivateRoute() {
  const { isLoading, isLoggedIn } = useAuth();

  if (isLoading || isLoggedIn === null) {
    return null; // or a loader
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
