import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Plus, Search, RefreshCw, Users, ShieldCheck, UserCog, MapPin, Pencil, Power } from 'lucide-react';
import apiClient from '../../services/apiClient';
import PageShell, { DataTable, StatGrid, StatusBadge, ErrorState } from '../../components/PageShell';

type StaffRow = {
    userId: number;
    name: string;
    phoneNumber: string | number;
    role: string;
    companyID?: number;
    isActive?: number;
    location?: string;
    category?: string;
};

const AVATAR_TONES = [
    'var(--gradient-candy)',
    'var(--gradient-ocean)',
    'var(--gradient-forest)',
    'var(--gradient-gold)',
    'var(--gradient-sunset)',
];

const ROLE_OPTIONS = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'staff', label: 'Staff' },
];

const emptyCreate = { name: '', phoneNumber: '', password: '', role: 'staff' };
const emptyEdit = { name: '', role: 'staff', password: '' };

export default function StaffPage() {
    const [q, setQ] = useState('');
    const [staff, setStaff] = useState<StaffRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const [addOpen, setAddOpen] = useState(false);
    const [createForm, setCreateForm] = useState(emptyCreate);

    const [editOpen, setEditOpen] = useState(false);
    const [editing, setEditing] = useState<StaffRow | null>(null);
    const [editForm, setEditForm] = useState(emptyEdit);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.get('users/staff');
            const data = res.data?.data ?? res.data ?? [];
            setStaff(Array.isArray(data) ? data : []);
        } catch (e: any) {
            setError(e.response?.data?.message || e.message || 'Unable to load staff');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const filtered = useMemo(
        () =>
            staff.filter((s) =>
                `${s.name} ${s.phoneNumber} ${s.role} ${s.location || ''}`.toLowerCase().includes(q.toLowerCase())
            ),
        [staff, q]
    );

    const activeCount = staff.filter((s) => Number(s.isActive) !== 0).length;
    const adminCount = staff.filter((s) => String(s.role).toLowerCase() === 'admin').length;

    const closeAdd = () => {
        setAddOpen(false);
        setCreateForm(emptyCreate);
        setFormError(null);
    };

    const closeEdit = () => {
        setEditOpen(false);
        setEditing(null);
        setEditForm(emptyEdit);
        setFormError(null);
    };

    const openEdit = (row: StaffRow) => {
        setEditing(row);
        const role = String(row.role || 'staff').toLowerCase();
        setEditForm({
            name: row.name || '',
            role: ROLE_OPTIONS.some((r) => r.value === role) ? role : 'staff',
            password: '',
        });
        setFormError(null);
        setEditOpen(true);
    };

    const handleCreate = async (e: FormEvent) => {
        e.preventDefault();
        if (!createForm.name.trim() || !createForm.phoneNumber.trim() || !createForm.password) {
            setFormError('Name, phone, and password are required');
            return;
        }
        setSaving(true);
        setFormError(null);
        try {
            await apiClient.post('users/staff', {
                name: createForm.name.trim(),
                phoneNumber: createForm.phoneNumber.trim(),
                password: createForm.password,
                role: createForm.role,
            });
            closeAdd();
            await load();
        } catch (err: any) {
            setFormError(err.response?.data?.message || err.message || 'Could not create staff');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = async (e: FormEvent) => {
        e.preventDefault();
        if (!editing) return;
        if (!editForm.name.trim()) {
            setFormError('Name is required');
            return;
        }
        setSaving(true);
        setFormError(null);
        try {
            const payload: Record<string, unknown> = {
                name: editForm.name.trim(),
                role: editForm.role,
            };
            if (editForm.password) payload.password = editForm.password;
            await apiClient.put(`users/staff/${editing.userId}`, payload);
            closeEdit();
            await load();
        } catch (err: any) {
            setFormError(err.response?.data?.message || err.message || 'Could not update staff');
        } finally {
            setSaving(false);
        }
    };

    const toggleActive = async (row: StaffRow) => {
        const next = Number(row.isActive) === 0 ? 1 : 0;
        try {
            await apiClient.put(`users/staff/${row.userId}`, { isActive: next });
            await load();
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Could not update status');
        }
    };

    const modalShell = (children: ReactNode, onClose: () => void) => (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9000,
                background: 'rgba(10, 34, 20, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
            }}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: '100%',
                    maxWidth: 440,
                    background: '#fff',
                    borderRadius: 14,
                    padding: '1.5rem',
                    border: '1px solid var(--border)',
                    boxShadow: '0 24px 48px rgba(10, 34, 20, 0.2)',
                }}
            >
                {children}
            </div>
        </div>
    );

    return (
        <PageShell
            title="Staff directory"
            subtitle="Everyone with access to this company's workspace — served live and company-isolated."
            icon={<Users size={22} />}
            accent="emerald"
            actions={
                <>
                    <button className="ui-btn ui-btn--secondary" type="button" onClick={load}>
                        <RefreshCw size={16} className={loading ? 'dash-spin' : ''} /> Refresh
                    </button>
                    <button
                        className="ui-btn ui-btn--primary"
                        type="button"
                        onClick={() => {
                            setFormError(null);
                            setCreateForm(emptyCreate);
                            setAddOpen(true);
                        }}
                    >
                        <Plus size={16} /> Add staff
                    </button>
                </>
            }
        >
            <StatGrid
                items={[
                    { label: 'Total staff', value: staff.length, tone: 'violet', icon: <Users size={17} /> },
                    { label: 'Active now', value: activeCount, tone: 'emerald', icon: <ShieldCheck size={17} /> },
                    { label: 'Administrators', value: adminCount, tone: 'indigo', icon: <UserCog size={17} /> },
                    { label: 'Other roles', value: staff.length - adminCount, tone: 'amber', icon: <MapPin size={17} /> },
                ]}
            />

            <div className="toolbar">
                <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
                    <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        className="ui-input"
                        style={{ paddingLeft: '2.4rem' }}
                        placeholder="Search by name, phone, role or location…"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                </div>
                <span className="ui-badge ui-badge--primary">{filtered.length} shown</span>
            </div>

            {error ? (
                <ErrorState message={error} onRetry={load} />
            ) : (
                <DataTable
                    loading={loading}
                    headers={['Member', 'Phone', 'Role', 'Location', 'Status', 'Actions']}
                    rows={filtered.map((s, i) => [
                        <span key="n" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <span style={{
                                width: 32, height: 32, borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: AVATAR_TONES[i % AVATAR_TONES.length],
                                color: '#fff', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0,
                            }}>
                                {String(s.name || '?').trim().charAt(0).toUpperCase()}
                            </span>
                            <strong>{s.name}</strong>
                        </span>,
                        String(s.phoneNumber),
                        <span key="r" className="ui-badge ui-badge--info">{s.role}</span>,
                        s.location || '—',
                        <StatusBadge key="st" status={Number(s.isActive) === 0 ? 'Inactive' : 'Active'} />,
                        <span key="a" style={{ display: 'inline-flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                            <button
                                type="button"
                                className="ui-btn ui-btn--secondary"
                                style={{ padding: '0.3rem 0.55rem' }}
                                onClick={() => openEdit(s)}
                                title="Edit"
                            >
                                <Pencil size={14} />
                            </button>
                            <button
                                type="button"
                                className="ui-btn ui-btn--secondary"
                                style={{ padding: '0.3rem 0.55rem' }}
                                onClick={() => toggleActive(s)}
                                title={Number(s.isActive) === 0 ? 'Activate' : 'Deactivate'}
                            >
                                <Power size={14} />
                            </button>
                        </span>,
                    ])}
                    empty="No staff match your search for this company."
                />
            )}

            {addOpen &&
                modalShell(
                    <form onSubmit={handleCreate}>
                        <h2 style={{ margin: '0 0 1rem', fontSize: '1.15rem' }}>Add staff</h2>
                        {formError && <p style={{ margin: '0 0 0.75rem', color: '#be123c', fontSize: '0.85rem' }}>{formError}</p>}
                        <label className="ui-label" htmlFor="st-name">Name</label>
                        <input
                            id="st-name"
                            className="ui-input"
                            value={createForm.name}
                            onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                            required
                            autoFocus
                        />
                        <label className="ui-label" htmlFor="st-phone" style={{ marginTop: '0.75rem', display: 'block' }}>Phone</label>
                        <input
                            id="st-phone"
                            className="ui-input"
                            inputMode="numeric"
                            value={createForm.phoneNumber}
                            onChange={(e) =>
                                setCreateForm({
                                    ...createForm,
                                    phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 15),
                                })
                            }
                            required
                        />
                        <label className="ui-label" htmlFor="st-pw" style={{ marginTop: '0.75rem', display: 'block' }}>Password</label>
                        <input
                            id="st-pw"
                            className="ui-input"
                            type="password"
                            value={createForm.password}
                            onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                            required
                        />
                        <label className="ui-label" htmlFor="st-role" style={{ marginTop: '0.75rem', display: 'block' }}>Role</label>
                        <select
                            id="st-role"
                            className="ui-input"
                            value={createForm.role}
                            onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                        >
                            {ROLE_OPTIONS.map((r) => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '1.25rem' }}>
                            <button type="button" className="ui-btn ui-btn--secondary" onClick={closeAdd}>Cancel</button>
                            <button type="submit" className="ui-btn ui-btn--primary" disabled={saving}>
                                {saving ? 'Creating…' : 'Create'}
                            </button>
                        </div>
                    </form>,
                    closeAdd
                )}

            {editOpen &&
                editing &&
                modalShell(
                    <form onSubmit={handleEdit}>
                        <h2 style={{ margin: '0 0 1rem', fontSize: '1.15rem' }}>Edit staff</h2>
                        {formError && <p style={{ margin: '0 0 0.75rem', color: '#be123c', fontSize: '0.85rem' }}>{formError}</p>}
                        <label className="ui-label" htmlFor="ed-name">Name</label>
                        <input
                            id="ed-name"
                            className="ui-input"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            required
                            autoFocus
                        />
                        <label className="ui-label" htmlFor="ed-role" style={{ marginTop: '0.75rem', display: 'block' }}>Role</label>
                        <select
                            id="ed-role"
                            className="ui-input"
                            value={editForm.role}
                            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                        >
                            {ROLE_OPTIONS.map((r) => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                        <label className="ui-label" htmlFor="ed-pw" style={{ marginTop: '0.75rem', display: 'block' }}>
                            New password (optional)
                        </label>
                        <input
                            id="ed-pw"
                            className="ui-input"
                            type="password"
                            value={editForm.password}
                            onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                            placeholder="Leave blank to keep current"
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '1.25rem' }}>
                            <button type="button" className="ui-btn ui-btn--secondary" onClick={closeEdit}>Cancel</button>
                            <button type="submit" className="ui-btn ui-btn--primary" disabled={saving}>
                                {saving ? 'Saving…' : 'Save'}
                            </button>
                        </div>
                    </form>,
                    closeEdit
                )}
        </PageShell>
    );
}
