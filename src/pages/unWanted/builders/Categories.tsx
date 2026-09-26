import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useSelector } from 'react-redux';
import { Plus, Tag, Pencil, Trash2, RefreshCw } from 'lucide-react';
import apiClient from '../../../services/apiClient';
import type { RootState } from '../../../store/store';
import PageShell, { DataTable, ErrorState, StatusBadge } from '../../../components/PageShell';
import ConfirmModal from '../../../components/ConfirmModal';

type CategoryRow = {
    id: number;
    name: string;
    companyID?: number;
    isActive?: number;
    CreatedOn?: string;
};

const emptyForm = { name: '', isActive: 1 };

const Categories = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [rows, setRows] = useState<CategoryRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<CategoryRow | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [formError, setFormError] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; row: CategoryRow | null }>({
        open: false,
        row: null,
    });

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.get('category/');
            const data = res.data?.data ?? res.data ?? [];
            setRows(Array.isArray(data) ? data : []);
        } catch (e: any) {
            setError(e.response?.data?.message || e.message || 'Unable to load categories');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setFormError(null);
        setModalOpen(true);
    };

    const openEdit = (row: CategoryRow) => {
        setEditing(row);
        setForm({ name: row.name || '', isActive: Number(row.isActive) !== 0 ? 1 : 0 });
        setFormError(null);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditing(null);
        setForm(emptyForm);
        setFormError(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const name = form.name.trim();
        if (!name) {
            setFormError('Name is required');
            return;
        }
        setSaving(true);
        setFormError(null);
        try {
            if (editing) {
                await apiClient.put(`category/${editing.id}`, {
                    name,
                    isActive: form.isActive,
                });
            } else {
                if (!user?.companyID) {
                    setFormError('Missing company context — please re-login');
                    return;
                }
                await apiClient.post('category/', {
                    name,
                    isActive: form.isActive,
                    companyID: user.companyID,
                });
            }
            closeModal();
            await load();
        } catch (err: any) {
            setFormError(err.response?.data?.message || err.message || 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!confirmDelete.row) return;
        try {
            await apiClient.delete(`category/${confirmDelete.row.id}`);
            await load();
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Delete failed');
        }
    };

    return (
        <PageShell
            title="Categories"
            subtitle="Company-scoped project categories — create, edit, and remove."
            icon={<Tag size={22} />}
            accent="emerald"
            actions={
                <>
                    <button className="ui-btn ui-btn--secondary" type="button" onClick={load}>
                        <RefreshCw size={16} className={loading ? 'dash-spin' : ''} /> Refresh
                    </button>
                    <button className="ui-btn ui-btn--primary" type="button" onClick={openCreate}>
                        <Plus size={16} /> Add category
                    </button>
                </>
            }
        >
            <ConfirmModal
                open={confirmDelete.open}
                title="Delete category"
                message={
                    confirmDelete.row
                        ? `Delete category "${confirmDelete.row.name}"? This cannot be undone.`
                        : ''
                }
                confirmLabel="Delete"
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDelete({ open: false, row: null })}
            />

            {error ? (
                <ErrorState message={error} onRetry={load} />
            ) : (
                <DataTable
                    loading={loading}
                    headers={['Name', 'Status', 'Created', 'Actions']}
                    rows={rows.map((row) => [
                        <strong key="n">{row.name}</strong>,
                        <StatusBadge key="s" status={Number(row.isActive) === 0 ? 'Inactive' : 'Active'} />,
                        row.CreatedOn ? new Date(row.CreatedOn).toLocaleDateString() : '—',
                        <span key="a" style={{ display: 'inline-flex', gap: '0.4rem' }}>
                            <button
                                type="button"
                                className="ui-btn ui-btn--secondary"
                                style={{ padding: '0.35rem 0.65rem' }}
                                onClick={() => openEdit(row)}
                            >
                                <Pencil size={14} /> Edit
                            </button>
                            <button
                                type="button"
                                className="ui-btn"
                                style={{
                                    padding: '0.35rem 0.65rem',
                                    background: 'var(--danger-light)',
                                    color: '#be123c',
                                    border: '1px solid #fecdd3',
                                }}
                                onClick={() => setConfirmDelete({ open: true, row })}
                            >
                                <Trash2 size={14} />
                            </button>
                        </span>,
                    ])}
                    empty="No categories yet for this company."
                />
            )}

            {modalOpen && (
                <div
                    className="ui-modal-backdrop"
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
                    onClick={closeModal}
                >
                    <form
                        onSubmit={handleSubmit}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: '100%',
                            maxWidth: 420,
                            background: '#fff',
                            borderRadius: 14,
                            padding: '1.5rem',
                            border: '1px solid var(--border)',
                            boxShadow: '0 24px 48px rgba(10, 34, 20, 0.2)',
                        }}
                    >
                        <h2 style={{ margin: '0 0 1rem', fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                            {editing ? 'Edit category' : 'Add category'}
                        </h2>
                        {formError && (
                            <p style={{ margin: '0 0 0.75rem', color: '#be123c', fontSize: '0.85rem' }}>{formError}</p>
                        )}
                        <label className="ui-label" htmlFor="cat-name">Name</label>
                        <input
                            id="cat-name"
                            className="ui-input"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            autoFocus
                        />
                        <label className="ui-label" htmlFor="cat-active" style={{ marginTop: '0.85rem', display: 'block' }}>
                            Status
                        </label>
                        <select
                            id="cat-active"
                            className="ui-input"
                            value={form.isActive}
                            onChange={(e) => setForm({ ...form, isActive: Number(e.target.value) })}
                        >
                            <option value={1}>Active</option>
                            <option value={0}>Inactive</option>
                        </select>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '1.25rem' }}>
                            <button type="button" className="ui-btn ui-btn--secondary" onClick={closeModal}>
                                Cancel
                            </button>
                            <button type="submit" className="ui-btn ui-btn--primary" disabled={saving}>
                                {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </PageShell>
    );
};

export default Categories;
