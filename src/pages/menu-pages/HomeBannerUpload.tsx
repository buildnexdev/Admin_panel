import { useEffect, useState, type ChangeEvent } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBanners, updateBanner, addSingleBanner, deleteBanner } from '../../store/slices/buildersSlice';
import { Img_Url, contentCMSService } from '../../services/api';
import type { AppDispatch, RootState } from '../../store/store';
import ConfirmModal from '../../components/ConfirmModal';
import { Plus, Upload, X, Edit2, Trash2 } from 'lucide-react';

const MAX_PUBLISHED_BANNERS = 5;
const CATEGORY = 'HomeBanner';

function isBannerActive(banner: any): boolean {
    if (banner.isActive === true || banner.isActive === 1) return true;
    if (banner.isActive === '1') return true;
    return false;
}

const HomeBannerUpload = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { banners, loading } = useSelector((state: RootState) => state.builders);
    const { user } = useSelector((state: RootState) => state.auth);
    const companyID = user?.companyID;

    const [showUpload, setShowUpload] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    // Edit state
    const [showEditForm, setShowEditForm] = useState(false);
    const [editBannerId, setEditBannerId] = useState<number | null>(null);
    const [editImageFile, setEditImageFile] = useState<File | null>(null);
    const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; banner: any }>({ open: false, banner: null });

    useEffect(() => {
        if (showEditForm) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => document.body.classList.remove('modal-open');
    }, [showEditForm]);

    const activeCount = (banners || []).filter(isBannerActive).length;
    const canUpload = activeCount < MAX_PUBLISHED_BANNERS;
    const remainingSlots = Math.max(0, MAX_PUBLISHED_BANNERS - activeCount);

    useEffect(() => {
        if (companyID) {
            dispatch(fetchBanners({ companyID, category: CATEGORY }));
        }
    }, [dispatch, companyID]);

    const handleActiveToggle = (banner: any) => {
        if (!companyID) return;
        const nextActive = !isBannerActive(banner);
        dispatch(updateBanner({ id: banner.id, companyID, category: CATEGORY, data: { isActive: nextActive ? 1 : 0 } }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length) return;
        const list = Array.from(files);
        const allowed = list.slice(0, remainingSlots - selectedFiles.length);
        const combined = [...selectedFiles, ...allowed].slice(0, remainingSlots);
        setSelectedFiles(combined);
        setPreviews(combined.map((f) => URL.createObjectURL(f)));
        e.target.value = '';
    };

    const removeFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    /** Upload one banner at a time (POST /banners with upload.single('image')) */
    const handleSelectAndUpload = async () => {
        if (!companyID || selectedFiles.length === 0) return;
        for (const file of selectedFiles) {
            const result = await dispatch(addSingleBanner({ file, companyID }));
            if (addSingleBanner.rejected.match(result)) break;
        }
        setShowUpload(false);
        setSelectedFiles([]);
        setPreviews([]);
    };

    const handleEditClick = (banner: any) => {
        setEditBannerId(banner.id);
        setEditImagePreview(Img_Url + (banner.imageUrl || banner.image_url));
        setEditImageFile(null);
        setShowEditForm(true);
        setShowUpload(false);
    };

    const handleDeleteClick = (banner: any) => {
        if (!companyID) return;
        setConfirmDelete({ open: true, banner });
    };
    const handleConfirmDelete = () => {
        if (confirmDelete.banner && companyID) {
            dispatch(deleteBanner({ id: confirmDelete.banner.id, companyID, category: CATEGORY }));
        }
        setConfirmDelete({ open: false, banner: null });
    };

    const handleUpdateBanner = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyID || !editBannerId) return;

        const result = await dispatch(updateBanner({
            id: editBannerId,
            companyID,
            category: CATEGORY,
            data: {}, // No title or description anymore
            imageFile: editImageFile
        }));

        if (updateBanner.fulfilled.match(result)) {
            setShowEditForm(false);
            setEditBannerId(null);
        }
    };

    return (
        <div style={{ padding: '0 0.5rem', maxWidth: '1400px', margin: '0 auto' }}>
            <ConfirmModal
                open={confirmDelete.open}
                title="Delete banner"
                message="Are you sure you want to delete this banner?"
                confirmLabel="Delete"
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDelete({ open: false, banner: null })}
            />
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
                        Banner Management
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                        Manage homepage sliding banners {activeCount > 0 && `(${activeCount}/${MAX_PUBLISHED_BANNERS} active)`}
                    </p>
                </div>
                {canUpload && !showEditForm && (
                    <button
                        type="button"
                        onClick={() => setShowUpload(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: '#0f172a',
                            color: 'white',
                            padding: '0.6rem 1.2rem',
                            borderRadius: '8px',
                            border: 'none',
                            fontWeight: '500',
                            fontSize: '0.9rem',
                            cursor: 'pointer'
                        }}
                    >
                        <Plus size={18} /> Upload New Banner
                    </button>
                )}
            </div>

            {/* Edit Modal – portal so scroll works */}
            {showEditForm && createPortal(
                <div
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)',
                        padding: '2rem 1rem', overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch',
                        display: 'flex', justifyContent: 'center', alignItems: 'flex-start', boxSizing: 'border-box',
                    }}
                    onClick={() => setShowEditForm(false)}
                >
                    <div style={{ width: '100%', maxWidth: '500px', backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', margin: 'auto', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(to right, #f8fafc, #ffffff)' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Edit Banner</h2>
                            <button type="button" onClick={() => setShowEditForm(false)} style={{ padding: '0.5rem', border: 'none', background: '#f1f5f9', borderRadius: '50%', cursor: 'pointer', color: '#64748b', display: 'flex' }}><X size={18} /></button>
                        </div>
                        <div style={{ padding: '2rem' }}>
                            <form onSubmit={handleUpdateBanner} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.75rem' }}>Banner Image</label>
                                    <div style={{
                                        width: '100%',
                                        aspectRatio: '16/9',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        border: '2px solid #f1f5f9',
                                        backgroundColor: '#f8fafc',
                                        marginBottom: '1rem',
                                        position: 'relative'
                                    }}>
                                        {editImagePreview ? (
                                            <img src={editImagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                                <Upload size={32} />
                                            </div>
                                        )}
                                    </div>

                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        padding: '0.75rem',
                                        backgroundColor: '#eff6ff',
                                        color: '#2563eb',
                                        borderRadius: '10px',
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        border: '1px solid #dbeafe',
                                        transition: 'all 0.2s'
                                    }}>
                                        <Plus size={18} />
                                        Change Image
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const f = e.target.files?.[0];
                                                if (f) {
                                                    setEditImageFile(f);
                                                    setEditImagePreview(URL.createObjectURL(f));
                                                }
                                            }}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        style={{
                                            flex: 2,
                                            padding: '0.875rem',
                                            backgroundColor: '#0f172a',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontWeight: '600',
                                            fontSize: '0.95rem',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowEditForm(false)}
                                        style={{
                                            flex: 1,
                                            padding: '0.875rem',
                                            backgroundColor: '#f1f5f9',
                                            color: '#475569',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '12px',
                                            fontWeight: '600',
                                            fontSize: '0.95rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Upload section (opens when button clicked) */}
            {canUpload && showUpload && (
                <div style={{
                    marginBottom: '2rem',
                    padding: '1.5rem',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>Upload new banners</h2>
                        <button
                            type="button"
                            onClick={() => { setShowUpload(false); setSelectedFiles([]); setPreviews([]); }}
                            style={{ padding: '0.4rem', border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>
                        You can add up to {remainingSlots} more banner(s). Select image(s) then click Upload & Save.
                    </p>
                    <div>
                        <div
                            onClick={() => document.getElementById('banner-file-input')?.click()}
                            style={{
                                border: '2px dashed #cbd5e1',
                                borderRadius: '12px',
                                padding: '2rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                backgroundColor: '#f8fafc',
                                marginBottom: '1rem'
                            }}
                        >
                            <Upload size={32} style={{ color: '#94a3b8', marginBottom: '0.5rem' }} />
                            <p style={{ color: '#475569', fontWeight: '500', margin: 0 }}>Click to select images (max {remainingSlots})</p>
                            <input
                                id="banner-file-input"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                        {previews.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                                {previews.map((url, i) => (
                                    <div key={i} style={{ position: 'relative', aspectRatio: '16/10', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                        <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button
                                            type="button"
                                            onClick={() => removeFile(i)}
                                            style={{ position: 'absolute', top: '4px', right: '4px', padding: '2px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', cursor: 'pointer' }}
                                        >
                                            <X size={14} color="#ef4444" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <button
                                type="button"
                                onClick={handleSelectAndUpload}
                                disabled={loading || selectedFiles.length === 0}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.6rem 1.2rem',
                                    backgroundColor: (loading || selectedFiles.length === 0) ? '#94a3b8' : '#0f172a',
                                    color: 'white', border: 'none', borderRadius: '8px', fontWeight: '500', fontSize: '0.9rem',
                                    cursor: (loading || selectedFiles.length === 0) ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {loading ? 'Uploading...' : 'Upload & Save Banners'}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowUpload(false); setSelectedFiles([]); setPreviews([]); }}
                                style={{
                                    padding: '0.6rem 1.2rem',
                                    backgroundColor: '#f1f5f9',
                                    color: '#475569',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '500',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                gap: '1.5rem'
            }}>
                {banners && banners.length > 0 ? (
                    banners.map((banner: any, index: number) => (
                        <div key={banner.id} style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            border: '1px solid #000',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <div style={{ height: '200px', position: 'relative' }}>
                                <img
                                    src={Img_Url + (banner.imageUrl || banner.image_url)}
                                    alt="Banner"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    left: '1rem',
                                    backgroundColor: isBannerActive(banner) ? '#22c55e' : '#94a3b8',
                                    color: 'white',
                                    padding: '0.2rem 0.8rem',
                                    borderRadius: '16px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600'
                                }}>
                                    {isBannerActive(banner) ? 'Active' : 'Inactive'}
                                </div>
                            </div>

                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                                    Banner #{index + 1}
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <span style={{ color: '#64748b', fontWeight: '500' }}>Active:</span>
                                            <button
                                                type="button"
                                                role="switch"
                                                aria-checked={isBannerActive(banner)}
                                                onClick={() => handleActiveToggle(banner)}
                                                style={{
                                                    width: '44px',
                                                    height: '24px',
                                                    borderRadius: '12px',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    backgroundColor: isBannerActive(banner) ? '#22c55e' : '#e2e8f0',
                                                    position: 'relative',
                                                    flexShrink: 0
                                                }}
                                            >
                                                <span style={{
                                                    position: 'absolute',
                                                    top: '2px',
                                                    left: isBannerActive(banner) ? '22px' : '2px',
                                                    width: '20px',
                                                    height: '20px',
                                                    borderRadius: '50%',
                                                    backgroundColor: 'white',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                                    transition: 'left 0.2s ease'
                                                }} />
                                            </button>
                                            <span style={{ color: isBannerActive(banner) ? '#22c55e' : '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>
                                                {isBannerActive(banner) ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        <button
                                            onClick={() => handleEditClick(banner)}
                                            style={{ padding: '0.4rem 0.8rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#475569', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: '500' }}
                                        >
                                            <Edit2 size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(banner)}
                                            style={{ padding: '0.4rem 0.8rem', border: '1px solid #fee2e2', backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: '500' }}
                                        >
                                            <Trash2 size={14} /> Trash
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                        <p style={{ color: '#64748b', fontWeight: '500' }}>No active banners found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomeBannerUpload;
