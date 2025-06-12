import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

export default function PrivateRoute() {
  const { user, isLoading } = useUser();

  if (isLoading) {
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
