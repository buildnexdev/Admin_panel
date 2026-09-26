import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { hasPermission, hasAnyPermission, isSuperAdmin, isCompanyAdmin, type PermissionCode } from './permissions';

/** Hook: permission checks for the current auth user. */
export function usePermission() {
    const user = useSelector((state: RootState) => state.auth.user);
    const permissions = (user as any)?.permissions as PermissionCode[] | undefined;

    const auth = useMemo(
        () => ({ role: user?.role, permissions: permissions || [] }),
        [user?.role, permissions]
    );

    return {
        auth,
        user,
        isSuperAdmin: isSuperAdmin(auth),
        isCompanyAdmin: isCompanyAdmin(auth),
        can: (code: PermissionCode) => hasPermission(auth, code),
        canAny: (codes: PermissionCode[]) => hasAnyPermission(auth, codes),
    };
}
