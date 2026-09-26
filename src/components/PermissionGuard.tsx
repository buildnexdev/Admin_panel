import { type ReactNode, type FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { hasPermission, type PermissionCode } from '../permissions/permissions';

interface PermissionGuardProps {
    children: ReactNode;
    /** Optional permission code(s). If omitted, only authentication is required. */
    permission?: PermissionCode | PermissionCode[];
    /** Fallback when denied (default: navigate home). */
    fallback?: ReactNode;
}

/**
 * Route guard: requires login, optionally a permission.
 * Replaces the misnamed BuildersProtectedRoute for CMS routes.
 */
const PermissionGuard: FC<PermissionGuardProps> = ({ children, permission, fallback }) => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const location = useLocation();

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (permission) {
        const auth = { role: user.role, permissions: (user as any).permissions || [] };
        const codes = Array.isArray(permission) ? permission : [permission];
        const ok = codes.some((c) => hasPermission(auth, c));
        if (!ok) {
            if (fallback !== undefined) return <>{fallback}</>;
            return (
                <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>
                    Unauthorized — you do not have access to this module.
                </div>
            );
        }
    }

    return <>{children}</>;
};

export default PermissionGuard;
