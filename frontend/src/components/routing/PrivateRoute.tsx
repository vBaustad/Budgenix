import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';

export default function PrivateRoute() {
  const { user, isLoading } = useUser();
  const { authChecked } = useAuth();

  if (!authChecked || isLoading) {
    return (
      <div className="p-4 text-center text-base-content/70">
        Checking authentication...
      </div>
    );
  }

  if (!user) {
    console.warn('[PrivateRoute] No user found, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
