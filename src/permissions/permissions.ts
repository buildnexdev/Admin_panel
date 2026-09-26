/**
 * Central permission helpers.
 * Super Admin bypasses all checks. Codes look like MODULE_ACTION (e.g. STAFF_VIEW).
 */

export type PermissionCode = string;

export interface AuthLike {
    role?: string | null;
    permissions?: PermissionCode[] | null;
}

/** True when role is platform super admin. */
export function isSuperAdmin(auth: AuthLike | null | undefined): boolean {
    return String(auth?.role || '').toLowerCase() === 'super_admin';
}

/** True when role is company or platform admin. */
export function isCompanyAdmin(auth: AuthLike | null | undefined): boolean {
    const r = String(auth?.role || '').toLowerCase();
    return r === 'admin' || r === 'company_admin' || r === 'super_admin';
}

/**
 * Check a permission code against the authenticated user.
 * Falls back to role heuristics until full RBAC seed is loaded.
 */
export function hasPermission(auth: AuthLike | null | undefined, code: PermissionCode): boolean {
    if (!auth) return false;
    if (isSuperAdmin(auth)) return true;

    const list = auth.permissions || [];
    if (list.includes('*') || list.includes(code)) return true;

    // Legacy role bridge until Wave C permissions are fully seeded
    const r = String(auth.role || '').toLowerCase();
    if (r === 'admin' || r === 'company_admin') {
        if (code.startsWith('COMPANY_') && code !== 'COMPANY_CREATE' && code !== 'COMPANY_LIST_ALL') {
            return true;
        }
        if (!code.startsWith('COMPANY_LIST_ALL') && !code.startsWith('RBAC_') && code !== 'COMPANY_CREATE') {
            return true;
        }
        if (code.startsWith('RBAC_') || code === 'USER_MANAGE') return true;
    }
    if (r === 'manager' || r === 'staff' || r === 'user') {
        return code.endsWith('_VIEW') || code.endsWith('_EXPORT');
    }
    return false;
}

export function hasAnyPermission(auth: AuthLike | null | undefined, codes: PermissionCode[]): boolean {
    return codes.some((c) => hasPermission(auth, c));
}
