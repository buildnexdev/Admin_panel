import { type ReactNode, type FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

interface BuildersProtectedRouteProps {
    children: ReactNode;
}

const BuildersProtectedRoute: FC<BuildersProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const location = useLocation();

    if (!isAuthenticated || user?.category !== 'Builders') {
        // Save the location they were trying to access
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default BuildersProtectedRoute;
