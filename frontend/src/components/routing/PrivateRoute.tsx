import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

export default function PrivateRoute() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    console.log('[PrivateRoute] Still loading user...');
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

  console.log('[PrivateRoute] Authenticated, rendering outlet');
  return <Outlet />;
}
