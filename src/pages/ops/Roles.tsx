import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw, Shield, Save, UserCog } from 'lucide-react';
import apiClient from '../../services/apiClient';
import PageShell, { ErrorState, EmptyState } from '../../components/PageShell';
import { usePermission } from '../../permissions/usePermission';

type Permission = { PermissionId: number; Code: string; Module: string; Action: string };
type Role = {
    RoleId: number;
    Code: string;
    Name: string;
    Description?: string;
    IsSystem?: number;
    permissionIds?: number[];
};

/** User Access Control — permission matrix backed by /rbac APIs. */
export default function RolesPage() {
    const { can } = usePermission();
    const canEdit = can('RBAC_EDIT') || can('USER_MANAGE');

    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
    const [draftPermIds, setDraftPermIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [rolesRes, permsRes] = await Promise.all([
                apiClient.get('rbac/roles'),
                apiClient.get('rbac/permissions'),
            ]);
            const roleList: Role[] = rolesRes.data?.data ?? rolesRes.data ?? [];
            const permList: Permission[] = permsRes.data?.data ?? permsRes.data ?? [];
            setRoles(Array.isArray(roleList) ? roleList : []);
            setPermissions(Array.isArray(permList) ? permList : []);
            if (!selectedRoleId && roleList.length) {
                const first = roleList[0];
                setSelectedRoleId(first.RoleId);
                setDraftPermIds(first.permissionIds || []);
            }
        } catch (e: any) {
            setError(e.response?.data?.message || e.message || 'Unable to load RBAC data');
        } finally {
            setLoading(false);
        }
    }, [selectedRoleId]);

    useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const selectedRole = useMemo(
        () => roles.find((r) => r.RoleId === selectedRoleId) || null,
        [roles, selectedRoleId]
    );

    const modules = useMemo(() => {
        const map = new Map<string, Permission[]>();
        permissions.forEach((p) => {
            const list = map.get(p.Module) || [];
            list.push(p);
            map.set(p.Module, list);
        });
        return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
    }, [permissions]);

    const selectRole = (role: Role) => {
        setSelectedRoleId(role.RoleId);
        setDraftPermIds(role.permissionIds || []);
        setMessage(null);
    };

    const togglePerm = (id: number) => {
        if (!canEdit) return;
        setDraftPermIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const save = async () => {
        if (!selectedRoleId || !canEdit) return;
        setSaving(true);
        setMessage(null);
        try {
            await apiClient.put(`rbac/roles/${selectedRoleId}`, { permissionIds: draftPermIds });
            setMessage('Permissions saved');
            const rolesRes = await apiClient.get('rbac/roles');
            const roleList: Role[] = rolesRes.data?.data ?? [];
            setRoles(Array.isArray(roleList) ? roleList : []);
        } catch (e: any) {
            setError(e.response?.data?.message || e.message || 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <PageShell
            title="User Access Control"
            subtitle="Assign module permissions to roles. Super Admin bypasses all checks."
            icon={<UserCog size={22} />}
            accent="brand"
            actions={
                <>
                    <button className="ui-btn ui-btn--secondary" type="button" onClick={load}>
                        <RefreshCw size={16} /> Refresh
                    </button>
                    {canEdit && (
                        <button className="ui-btn ui-btn--primary" type="button" onClick={save} disabled={saving || !selectedRoleId}>
                            <Save size={16} /> {saving ? 'Saving…' : 'Save permissions'}
                        </button>
                    )}
                </>
            }
        >
            {error && <ErrorState message={error} onRetry={load} />}
            {message && <p className="ui-label" style={{ color: 'var(--success)', marginBottom: '1rem' }}>{message}</p>}

            {loading ? (
                <div className="ui-skeleton" style={{ height: 240 }} />
            ) : roles.length === 0 ? (
                <EmptyState title="No roles found" message="Run the RBAC migration to seed system roles." />
            ) : (
                <div className="uac-layout">
                    <aside className="uac-roles ui-card">
                        <h3><Shield size={16} /> Roles</h3>
                        <ul>
                            {roles.map((r) => (
                                <li key={r.RoleId}>
                                    <button
                                        type="button"
                                        className={r.RoleId === selectedRoleId ? 'is-active' : ''}
                                        onClick={() => selectRole(r)}
                                    >
                                        <strong>{r.Name}</strong>
                                        <span>{r.Code}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    <section className="uac-matrix ui-card">
                        <header>
                            <h3>{selectedRole?.Name || 'Select a role'}</h3>
                            <p>{selectedRole?.Description || 'Toggle permissions for this role.'}</p>
                        </header>
                        <div className="uac-table-wrap">
                            <table className="uac-table">
                                <thead>
                                    <tr>
                                        <th>Module</th>
                                        <th>Permission</th>
                                        <th>Action</th>
                                        <th>Allow</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modules.map(([module, perms]) =>
                                        perms.map((p, idx) => (
                                            <tr key={p.PermissionId}>
                                                <td>{idx === 0 ? module : ''}</td>
                                                <td><code>{p.Code}</code></td>
                                                <td>{p.Action}</td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={draftPermIds.includes(p.PermissionId)}
                                                        onChange={() => togglePerm(p.PermissionId)}
                                                        disabled={!canEdit}
                                                        aria-label={p.Code}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            )}

            <style>{`
                .uac-layout { display: grid; grid-template-columns: 240px minmax(0,1fr); gap: 1rem; }
                .uac-roles, .uac-matrix { padding: 1.1rem; }
                .uac-roles h3, .uac-matrix h3 {
                    margin: 0 0 0.85rem; display: flex; align-items: center; gap: 0.4rem;
                    font-size: 0.95rem; color: var(--text-primary);
                }
                .uac-roles ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.35rem; }
                .uac-roles button {
                    width: 100%; text-align: left; border: 1px solid var(--border);
                    background: var(--surface-secondary); border-radius: 10px; padding: 0.65rem 0.75rem;
                    cursor: pointer; font-family: inherit;
                }
                .uac-roles button strong { display: block; color: var(--text-primary); font-size: 0.9rem; }
                .uac-roles button span { font-size: 0.72rem; color: var(--text-muted); letter-spacing: 0.04em; }
                .uac-roles button.is-active { border-color: var(--primary); background: var(--primary-light); }
                .uac-matrix header p { margin: 0 0 1rem; color: var(--text-secondary); font-size: 0.86rem; }
                .uac-table-wrap { overflow: auto; max-height: 60vh; border: 1px solid var(--border); border-radius: 10px; }
                .uac-table { width: 100%; border-collapse: collapse; font-size: 0.86rem; }
                .uac-table th, .uac-table td { padding: 0.65rem 0.75rem; border-bottom: 1px solid var(--border); text-align: left; }
                .uac-table th { background: var(--surface-secondary); position: sticky; top: 0; }
                .uac-table code { font-size: 0.78rem; color: var(--primary); }
                @media (max-width: 800px) { .uac-layout { grid-template-columns: 1fr; } }
            `}</style>
        </PageShell>
    );
}
