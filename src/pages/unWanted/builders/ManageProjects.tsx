import { useEffect, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, deleteProject, updateProject } from '../../../store/slices/buildersSlice';
import type { AppDispatch, RootState } from '../../../store/store';
import { Briefcase, Edit2, Trash2, X } from 'lucide-react';
import ConfirmModal from '../../../components/ConfirmModal';
import { Img_Url } from '../../../services/api';

const ManageProjects = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { projects } = useSelector((state: RootState) => state.builders);
    const { user } = useSelector((state: RootState) => state.auth);

    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; project: any }>({
        open: false,
        project: null,
    });
    const [editOpen, setEditOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
        isActive: 1,
    });

    useEffect(() => {
        if (user?.companyID) {
            dispatch(fetchProjects(user.companyID));
        }
    }, [dispatch, user?.companyID]);

    const getImageUrl = (project: any) => {
        const path = project.imageUrl || project.image_url || project.image || '';
        if (!path) return '';
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        const base = Img_Url.endsWith('/') ? Img_Url : Img_Url + '/';
        return base + (path.startsWith('/') ? path.slice(1) : path);
    };

    const openEdit = (project: any) => {
        setEditId(project.id);
        setForm({
            title: project.title || '',
            description: project.description || '',
            category: project.category || '',
            isActive: project.isActive === 0 || project.isActive === '0' || project.isActive === false ? 0 : 1,
        });
        setFormError(null);
        setEditOpen(true);
    };

    const closeEdit = () => {
        setEditOpen(false);
        setEditId(null);
        setFormError(null);
    };

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        if (!user?.companyID || !editId) return;
        if (!form.title.trim()) {
            setFormError('Title is required');
            return;
        }
        setSaving(true);
        setFormError(null);
        try {
            const result = await dispatch(
                updateProject({
                    id: editId,
                    companyID: user.companyID,
                    data: {
                        title: form.title.trim(),
                        description: form.description.trim(),
                        category: form.category.trim(),
                        isActive: form.isActive,
                    },
                }) as any
            );
            if (updateProject.fulfilled.match(result)) {
                closeEdit();
            } else {
                setFormError((result as any).payload || 'Update failed');
            }
        } catch (err: any) {
            setFormError(err?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    const handleConfirmDelete = () => {
        if (confirmDelete.project && user?.companyID) {
            dispatch(deleteProject({ id: confirmDelete.project.id, companyID: user.companyID }));
        }
    };

    return (
        <div style={{ padding: '0 0.5rem', maxWidth: '1400px', margin: '0 auto' }}>
            <ConfirmModal
                open={confirmDelete.open}
                title="Delete project"
                message={
                    confirmDelete.project
                        ? `Are you sure you want to delete project "${confirmDelete.project.title}"?`
                        : ''
                }
                confirmLabel="Delete"
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDelete({ open: false, project: null })}
            />

            <div style={{ marginBottom: '2.5rem' }}>
                <h1 className="page-title-xl">Manage Projects</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    View and manage all uploaded projects
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {projects && projects.length > 0 ? (
                    projects.map((project: any) => (
                        <div
                            key={project.id}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                border: '1px solid var(--surface-secondary)',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                            }}
                        >
                            <div style={{ height: '180px', position: 'relative', background: 'var(--background)' }}>
                                {getImageUrl(project) ? (
                                    <img
                                        src={getImageUrl(project)}
                                        alt={project.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{ height: '100%', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}>
                                        <Briefcase size={36} />
                                    </div>
                                )}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '0.75rem',
                                        left: '0.75rem',
                                        padding: '0.3rem 0.8rem',
                                        backgroundColor: 'rgba(255,255,255,0.95)',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        color: 'var(--text-primary)',
                                    }}
                                >
                                    {project.category || 'Uncategorized'}
                                </div>
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                                    {project.title}
                                </h3>
                                <p
                                    style={{
                                        fontSize: '0.85rem',
                                        color: 'var(--text-secondary)',
                                        display: '-webkit-box',
                                        WebkitLineClamp: '2',
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        marginBottom: '1rem',
                                        lineHeight: '1.5',
                                    }}
                                >
                                    {project.description}
                                </p>

                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        paddingTop: '1rem',
                                        borderTop: '1px solid var(--background)',
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => openEdit(project)}
                                            style={{
                                                padding: '0.4rem 0.8rem',
                                                border: '1px solid var(--border)',
                                                backgroundColor: 'var(--background)',
                                                color: 'var(--text-secondary)',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.25rem',
                                                fontSize: '0.8rem',
                                                fontWeight: '500',
                                            }}
                                        >
                                            <Edit2 size={14} /> Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setConfirmDelete({ open: true, project })}
                                            style={{
                                                padding: '0.4rem 0.8rem',
                                                border: '1px solid var(--danger-light)',
                                                backgroundColor: 'var(--danger-light)',
                                                color: '#ef4444',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.25rem',
                                                fontSize: '0.8rem',
                                                fontWeight: '500',
                                            }}
                                        >
                                            <Trash2 size={14} /> Trash
                                        </button>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {project.created_at || project.createdAt
                                            ? new Date(project.created_at || project.createdAt).toLocaleDateString()
                                            : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div
                        style={{
                            gridColumn: '1 / -1',
                            padding: '4rem 2rem',
                            textAlign: 'center',
                            backgroundColor: 'var(--background)',
                            borderRadius: '24px',
                            border: '2px dashed var(--border)',
                        }}
                    >
                        <Briefcase size={40} style={{ margin: '0 auto 1rem', color: 'var(--border-strong)' }} />
                        <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>No projects found.</p>
                    </div>
                )}
            </div>

            {editOpen &&
                createPortal(
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
                        onClick={closeEdit}
                    >
                        <form
                            onSubmit={handleSave}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                width: '100%',
                                maxWidth: 460,
                                background: '#fff',
                                borderRadius: 14,
                                padding: '1.5rem',
                                border: '1px solid var(--border)',
                                boxShadow: '0 24px 48px rgba(10, 34, 20, 0.2)',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h2 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)' }}>Edit project</h2>
                                <button type="button" onClick={closeEdit} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                    <X size={18} />
                                </button>
                            </div>
                            {formError && (
                                <p style={{ margin: '0 0 0.75rem', color: '#be123c', fontSize: '0.85rem' }}>{formError}</p>
                            )}
                            <label className="ui-label" htmlFor="mp-title">Title</label>
                            <input
                                id="mp-title"
                                className="ui-input"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                required
                            />
                            <label className="ui-label" htmlFor="mp-desc" style={{ marginTop: '0.75rem', display: 'block' }}>
                                Description
                            </label>
                            <textarea
                                id="mp-desc"
                                className="ui-input"
                                rows={3}
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                style={{ resize: 'vertical' }}
                            />
                            <label className="ui-label" htmlFor="mp-cat" style={{ marginTop: '0.75rem', display: 'block' }}>
                                Category
                            </label>
                            <input
                                id="mp-cat"
                                className="ui-input"
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                            />
                            <label className="ui-label" htmlFor="mp-active" style={{ marginTop: '0.75rem', display: 'block' }}>
                                Status
                            </label>
                            <select
                                id="mp-active"
                                className="ui-input"
                                value={form.isActive}
                                onChange={(e) => setForm({ ...form, isActive: Number(e.target.value) })}
                            >
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
                            </select>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '1.25rem' }}>
                                <button type="button" className="ui-btn ui-btn--secondary" onClick={closeEdit}>
                                    Cancel
                                </button>
                                <button type="submit" className="ui-btn ui-btn--primary" disabled={saving}>
                                    {saving ? 'Saving…' : 'Save changes'}
                                </button>
                            </div>
                        </form>
                    </div>,
                    document.body
                )}
        </div>
    );
};

export default ManageProjects;
