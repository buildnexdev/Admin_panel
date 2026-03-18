import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSrsImages, createSrsImages, updateSrsImage, deleteSrsImage, clearSrsMessages } from '../../store/slices/srsImagesSlice';
import { Img_Url } from '../../services/api';
import type { AppDispatch, RootState } from '../../store/store';
import ConfirmModal from '../../components/ConfirmModal';
import { Plus, Upload, X, Edit2, Trash2 } from 'lucide-react';

const MAX_IMAGES = 5;
const MAX_IMAGES_EDIT = 5;

const SrsImages = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { list, loading, successMessage, error } = useSelector((state: RootState) => state.srsImages);
    const { user } = useSelector((state: RootState) => state.auth);
    const companyID = user?.companyID;

    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const [showEdit, setShowEdit] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [editNewFiles, setEditNewFiles] = useState<File[]>([]);
    const [editNewPreviews, setEditNewPreviews] = useState<string[]>([]);
    const [editExistingImageUrls, setEditExistingImageUrls] = useState<string[]>([]);

    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });

    useEffect(() => {
        document.body.classList.toggle('modal-open', showForm || showEdit);
        return () => document.body.classList.remove('modal-open');
    }, [showForm, showEdit]);

    useEffect(() => {
        if (companyID) dispatch(fetchSrsImages({ companyID }));
    }, [dispatch, companyID]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files;
        if (!selected?.length) return;
        const arr = Array.from(selected);
        const combined = [...files, ...arr].slice(0, MAX_IMAGES);
        setFiles(combined);
        setPreviews(combined.map((f) => URL.createObjectURL(f)));
        e.target.value = '';
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setLocation('');
        setFiles([]);
        setPreviews((prev) => {
            prev.forEach((p) => URL.revokeObjectURL(p));
            return [];
        });
        setShowForm(false);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        if (files.length === 0) return;

        const result = await dispatch(createSrsImages({
            title: title.trim(),
            description: description.trim(),
            location: location.trim(),
            files,
        }));

        if (createSrsImages.fulfilled.match(result)) {
            dispatch(fetchSrsImages({ companyID }));
            resetForm();
        }
    };

    const openEdit = (row: any) => {
        setEditId(row.id);
        setEditTitle(row.title ?? '');
        setEditDescription(row.disc ?? row.description ?? '');
        setEditLocation(row.location ?? '');
        setEditNewFiles([]);
        setEditNewPreviews([]);
        setEditExistingImageUrls(imageUrls(row));
        setShowEdit(true);
    };

    const maxNewInEdit = MAX_IMAGES_EDIT - editExistingImageUrls.length;
    const removeEditExisting = (index: number) => {
        setEditExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
    };
    const handleEditNewFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files;
        if (!selected?.length) return;
        const arr = Array.from(selected);
        const combined = [...editNewFiles, ...arr].slice(0, maxNewInEdit);
        setEditNewFiles(combined);
        setEditNewPreviews(combined.map((f) => URL.createObjectURL(f)));
        e.target.value = '';
    };
    const removeEditNew = (index: number) => {
        setEditNewFiles((prev) => prev.filter((_, i) => i !== index));
        setEditNewPreviews((prev) => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleUpdateSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (editId == null) return;
        const totalImages = editExistingImageUrls.length + editNewFiles.length;
        if (totalImages === 0) return;
        const result = await dispatch(updateSrsImage({
            id: editId,
            title: editTitle.trim() || undefined,
            disc: editDescription.trim() || undefined,
            description: editDescription.trim() || undefined,
            location: editLocation.trim() || undefined,
            keptImages: editExistingImageUrls,
            newFiles: editNewFiles,
        }));
        if (updateSrsImage.fulfilled.match(result)) {
            dispatch(fetchSrsImages({ companyID }));
            setShowEdit(false);
            setEditId(null);
        }
    };

    const handleConfirmDelete = () => {
        if (confirmDelete.id != null) dispatch(deleteSrsImage(confirmDelete.id));
        setConfirmDelete({ open: false, id: null });
    };

    const displayList = Array.isArray(list) ? list : [];

    const cellText = (val: any) => (val != null && String(val).trim() !== '' ? String(val) : '-');
    const descText = (row: any) => {
        const d = row.disc ?? row.description;
        if (d == null || String(d).trim() === '') return '-';
        const s = String(d);
        return s.length > 60 ? s.slice(0, 60) + '…' : s;
    };
    const imageUrls = (row: any): string[] => {
        if (row.imageUrl) return [row.imageUrl];
        if (row.image_url) return [row.image_url];
        if (Array.isArray(row.images)) return row.images;
        return [];
    };

    return (
        <div style={{ padding: '0 0.5rem', maxWidth: '1200px', margin: '0 auto' }}>
            <ConfirmModal
                open={confirmDelete.open}
                title="Delete SRS image"
                message="Are you sure you want to delete this record?"
                confirmLabel="Delete"
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDelete({ open: false, id: null })}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
                        SRS Images
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                        Upload title, description, location and up to {MAX_IMAGES} images per record
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 1.25rem',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: 'var(--primary-color)',
                        color: '#fff',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                    }}
                >
                    <Plus size={18} />
                    Add new
                </button>
            </div>

            {error && (
                <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: '8px', fontSize: '0.9rem' }}>
                    {error}
                </div>
            )}

            {/* List table */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.8rem', fontWeight: '600', color: '#64748b' }}>Title</th>
                            <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.8rem', fontWeight: '600', color: '#64748b' }}>Description</th>
                            <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.8rem', fontWeight: '600', color: '#64748b' }}>Location</th>
                            <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.8rem', fontWeight: '600', color: '#64748b' }}>Image</th>
                            <th style={{ textAlign: 'right', padding: '0.75rem 1rem', fontSize: '0.8rem', fontWeight: '600', color: '#64748b' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && displayList.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading...</td>
                            </tr>
                        ) : displayList.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No SRS images yet. Add one to get started.</td>
                            </tr>
                        ) : (
                            displayList.map((row: any) => {
                                const imgs = imageUrls(row);
                                return (
                                    <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.9rem', color: '#0f172a' }}>{cellText(row.title)}</td>
                                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#475569', maxWidth: '200px' }}>{descText(row)}</td>
                                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#475569' }}>{cellText(row.location)}</td>
                                        <td style={{ padding: '0.75rem 1rem' }}>
                                            {imgs.length > 0 ? (
                                                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                                                    {imgs.slice(0, 3).map((url: string, i: number) => (
                                                        <img key={i} src={url.startsWith('http') ? url : Img_Url + url} alt="" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6 }} />
                                                    ))}
                                                    {imgs.length > 3 && <span style={{ fontSize: '0.8rem', color: '#64748b' }}>+{imgs.length - 3}</span>}
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                                            <button type="button" onClick={() => openEdit(row)} style={{ ...iconBtnStyle, marginRight: '0.5rem' }} title="Edit"><Edit2 size={16} /></button>
                                            <button type="button" onClick={() => setConfirmDelete({ open: true, id: row.id })} style={{ ...iconBtnStyle, color: '#dc2626' }} title="Delete"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Upload modal */}
            {showForm && (
                <>
                    {createPortal(
                        <div
                            style={{
                                position: 'fixed',
                                inset: 0,
                                zIndex: 9999,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '1rem',
                                overflowY: 'auto',
                                boxSizing: 'border-box',
                            }}
                            onClick={() => setShowForm(false)}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    maxWidth: '520px',
                                    backgroundColor: '#fff',
                                    borderRadius: '16px',
                                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                                    padding: '1.5rem',
                                    margin: 'auto',
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#0f172a' }}>Add SRS Images</h3>
                                    <button type="button" onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#64748b' }}><X size={22} /></button>
                                </div>
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.35rem' }}>Title *</label>
                                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Title" style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.35rem' }}>Description</label>
                                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.35rem' }}>Location</label>
                                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.35rem' }}>Images (max {MAX_IMAGES}) *</label>
                                        <input type="file" accept="image/*" multiple onChange={handleFileChange} style={{ display: 'none' }} id="srs-file-input" />
                                        <label htmlFor="srs-file-input" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px dashed #cbd5e1', cursor: 'pointer', fontSize: '0.9rem', color: '#475569' }}>
                                            <Upload size={18} /> Choose files
                                        </label>
                                        {previews.length > 0 && (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                                                {previews.map((url, i) => (
                                                    <div key={i} style={{ position: 'relative' }}>
                                                        <img src={url} alt="" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }} />
                                                        <button type="button" onClick={() => removeFile(i)} style={{ position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: '50%', border: 'none', backgroundColor: '#ef4444', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={12} /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <p style={{ marginTop: '0.35rem', fontSize: '0.8rem', color: '#64748b' }}>{files.length} / {MAX_IMAGES} selected</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                                        <button type="button" onClick={() => setShowForm(false)} style={{ ...btnStyle, backgroundColor: '#e2e8f0', color: '#475569' }}>Cancel</button>
                                        <button type="submit" disabled={loading || !title.trim() || files.length === 0} style={{ ...btnStyle, opacity: (loading || !title.trim() || files.length === 0) ? 0.6 : 1 }}>
                                            {loading ? 'Uploading…' : 'Upload'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>,
                        document.body
                    )}
                </>
            )}

            {/* Edit modal */}
            {showEdit && editId != null && (
                <>
                    {createPortal(
                        <div
                            style={{
                                position: 'fixed',
                                inset: 0,
                                zIndex: 9999,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '1rem',
                                overflowY: 'auto',
                                boxSizing: 'border-box',
                            }}
                            onClick={() => setShowEdit(false)}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    maxWidth: '520px',
                                    backgroundColor: '#fff',
                                    borderRadius: '16px',
                                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                                    padding: '1.5rem',
                                    margin: 'auto',
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#0f172a' }}>Edit SRS Image</h3>
                                    <button type="button" onClick={() => setShowEdit(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#64748b' }}><X size={22} /></button>
                                </div>
                                <form onSubmit={handleUpdateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.35rem' }}>Title</label>
                                        <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Title" style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.35rem' }}>Description</label>
                                        <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Description" rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.35rem' }}>Location</label>
                                        <input type="text" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} placeholder="Location" style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.35rem' }}>Images (max {MAX_IMAGES_EDIT} total)</label>
                                        {editExistingImageUrls.length > 0 && (
                                            <div style={{ marginBottom: '0.75rem' }}>
                                                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '0.35rem' }}>Existing – click × to remove</span>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                    {editExistingImageUrls.map((url, i) => (
                                                        <div key={i} style={{ position: 'relative' }}>
                                                            <img src={url.startsWith('http') ? url : Img_Url + url} alt="" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }} />
                                                            <button type="button" onClick={() => removeEditExisting(i)} style={{ position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: '50%', border: 'none', backgroundColor: '#ef4444', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Remove"><X size={12} /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '0.35rem' }}>Add images (up to {maxNewInEdit} more)</span>
                                        <input type="file" accept="image/*" multiple onChange={handleEditNewFilesChange} style={{ display: 'none' }} id="srs-edit-file" />
                                        <label htmlFor="srs-edit-file" style={{ display: editNewFiles.length >= maxNewInEdit ? 'none' : 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px dashed #cbd5e1', cursor: 'pointer', fontSize: '0.9rem', color: '#475569' }}>
                                            <Upload size={18} /> Choose images
                                        </label>
                                        {editNewPreviews.length > 0 && (
                                            <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                {editNewPreviews.map((url, i) => (
                                                    <div key={i} style={{ position: 'relative' }}>
                                                        <img src={url} alt="" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }} />
                                                        <button type="button" onClick={() => removeEditNew(i)} style={{ position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: '50%', border: 'none', backgroundColor: '#ef4444', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Remove"><X size={12} /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <p style={{ marginTop: '0.35rem', fontSize: '0.8rem', color: '#64748b' }}>{editExistingImageUrls.length + editNewFiles.length} / {MAX_IMAGES_EDIT} images</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                                        <button type="button" onClick={() => setShowEdit(false)} style={{ ...btnStyle, backgroundColor: '#e2e8f0', color: '#475569' }}>Cancel</button>
                                        <button type="submit" disabled={loading || editExistingImageUrls.length + editNewFiles.length === 0} style={{ ...btnStyle, opacity: (loading || editExistingImageUrls.length + editNewFiles.length === 0) ? 0.6 : 1 }}>{loading ? 'Saving…' : 'Update'}</button>
                                    </div>
                                </form>
                            </div>
                        </div>,
                        document.body
                    )}
                </>
            )}
        </div>
    );
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.65rem 0.9rem',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    fontSize: '0.9rem',
    outline: 'none',
    color: '#334155',
    boxSizing: 'border-box',
};

const btnStyle: React.CSSProperties = {
    padding: '0.6rem 1.25rem',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
    backgroundColor: 'var(--primary-color)',
    color: '#fff',
};

const iconBtnStyle: React.CSSProperties = {
    padding: '0.4rem',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: '#64748b',
    cursor: 'pointer',
};

export default SrsImages;
