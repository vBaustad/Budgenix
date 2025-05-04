import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { JSX } from 'react';

type PrivateRouteProps = {
    children: JSX.Element;
};

export default function PrivateRoute({ children }: PrivateRouteProps) {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
