import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadHomeBanners, clearMessages, fetchBanners, deleteBanner } from '../../store/slices/buildersSlice';
import { contentCMSService } from '../../services/api';
import type { AppDispatch, RootState } from '../../store/store';
import { X, Image as ImageIcon, CheckCircle2, Upload, Calendar, Trash2, Edit2 } from 'lucide-react';

const HomeBannerUpload = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, successMessage, banners } = useSelector((state: RootState) => state.builders);
    const { user } = useSelector((state: RootState) => state.auth);

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [editingBanner, setEditingBanner] = useState<any | null>(null);

    useEffect(() => {
        if (user?.companyID) {
            dispatch(fetchBanners(user.companyID));
        }
    }, [dispatch, user?.companyID]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            if (!editingBanner && files.length + selectedFiles.length > 5) {
                alert('You can only upload a maximum of 5 images.');
                return;
            }
            const newFiles = editingBanner ? [files[0]] : [...selectedFiles, ...files].slice(0, 5);
            setSelectedFiles(newFiles);
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setPreviews(newPreviews);
        }
    };

    const removeFile = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user?.companyID) return;

        dispatch(clearMessages());

        if (editingBanner) {
            // Update individual banner
            const formData = new FormData();
            if (selectedFiles[0]) formData.append('image', selectedFiles[0]);
            formData.append('title', ''); // Banners in this schema might not have titles, but schema supports it
            formData.append('subtitle', '');

            try {
                await contentCMSService.updateBanner(editingBanner.id, formData);
                dispatch(fetchBanners(user.companyID));
                setEditingBanner(null);
                setSelectedFiles([]);
                setPreviews([]);
            } catch (err) { }
        } else {
            // Bulk upload
            if (selectedFiles.length === 0) return;
            await dispatch(uploadHomeBanners(selectedFiles));
            setSelectedFiles([]);
            setPreviews([]);
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Delete this banner?') && user?.companyID) {
            dispatch(deleteBanner({ id, companyID: user.companyID }));
        }
    };

    return (
        <div style={{ width: '100%' }} className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: '2rem', alignItems: 'start' }}>

                {/* Upload Section */}
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ padding: '0.625rem', backgroundColor: '#f0fdf4', color: '#166534', borderRadius: '12px' }}>
                            <ImageIcon size={24} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                                {editingBanner ? 'Change Banner Image' : 'Add New Banners'}
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '0.8125rem', margin: 0 }}>
                                {editingBanner ? 'Replace the image for this banner' : 'Upload up to 5 images for your homepage'}
                            </p>
                        </div>
                    </div>

                    {successMessage && (
                        <div style={{ padding: '0.875rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', fontSize: '0.875rem' }}>
                            <CheckCircle2 size={18} />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ border: '2px dashed #e2e8f0', borderRadius: '16px', padding: '2.5rem', textAlign: 'center', cursor: 'pointer', position: 'relative', backgroundColor: '#f8fafc' }}>
                            <input type="file" multiple={!editingBanner} accept="image/*" onChange={handleFileChange} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }} />
                            <div style={{ color: '#94a3b8' }}>
                                <Upload size={40} style={{ margin: '0 auto 1rem' }} />
                                <p style={{ fontWeight: '700', color: '#475569', fontSize: '0.875rem' }}>
                                    {editingBanner ? 'Click to select replacement image' : 'Drop images here or click to browse'}
                                </p>
                            </div>
                        </div>

                        {previews.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem' }}>
                                {previews.map((url, index) => (
                                    <div key={index} style={{ position: 'relative', height: '80px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                        <img src={url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button type="button" onClick={() => removeFile(index)} style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: 'white', borderRadius: '50%', padding: '2px', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                            <X size={12} color="#ef4444" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="submit"
                                disabled={loading || selectedFiles.length === 0}
                                style={{
                                    flex: 1, padding: '1rem', backgroundColor: (loading || selectedFiles.length === 0) ? '#94a3b8' : '#10b981',
                                    color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s'
                                }}
                            >
                                {loading ? 'Processing...' : (editingBanner ? 'Update Image' : 'Publish Banners')}
                            </button>
                            {editingBanner && (
                                <button type="button" onClick={() => { setEditingBanner(null); setSelectedFiles([]); setPreviews([]); }} style={{ padding: '1rem', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '12px', fontWeight: '700' }}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* List Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Active Banners</h2>
                        <div style={{ padding: '0.4rem 0.8rem', backgroundColor: '#f1f5f9', borderRadius: '20px', color: '#475569', fontSize: '0.75rem', fontWeight: '700' }}>
                            {banners?.length || 0} Images
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                        {banners && banners.length > 0 ? (
                            banners.map((banner: any) => (
                                <div key={banner.id} style={{ backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                                    <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                                        <img src={banner.image_url} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.75rem' }}>
                                            <Calendar size={14} />
                                            {new Date(banner.created_at).toLocaleDateString()}
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => { setEditingBanner(banner); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ color: '#6366f1', padding: '0.4rem', borderRadius: '8px', backgroundColor: '#f1f5f9', border: 'none', cursor: 'pointer' }}>
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(banner.id)} style={{ color: '#ef4444', padding: '0.4rem', borderRadius: '8px', backgroundColor: '#fef2f2', border: 'none', cursor: 'pointer' }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                                <ImageIcon size={48} style={{ margin: '0 auto 1rem', color: '#cbd5e1' }} />
                                <p style={{ color: '#64748b', fontWeight: '600' }}>No active banners found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeBannerUpload;
