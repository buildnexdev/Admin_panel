import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadHomeBanners, clearMessages, fetchBanners, deleteBanner } from '../../store/slices/buildersSlice';
import { contentCMSService } from '../../services/api';
import type { AppDispatch, RootState } from '../../store/store';
import { Upload, X, Image as ImageIcon, CheckCircle2, Calendar, Edit2, Trash2 } from 'lucide-react';
import { imageUploadToS3 } from '../../services/api';

const HomeBannerUpload = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, successMessage, error, banners } = useSelector((state: RootState) => state.builders);
    const { user } = useSelector((state: RootState) => state.auth);

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [fileNames, setFileNames] = useState<string[]>([]);
    const [editingBanner, setEditingBanner] = useState<any>(null);

    const companyID = user?.companyID;
    const userID = user?.userId;

    useEffect(() => {
        if (companyID) {
            dispatch(fetchBanners(companyID));
        }
    }, [dispatch, companyID]);

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this banner?') && companyID) {
            dispatch(deleteBanner({ id, companyID }));
        }
    };

    async function handleFileChange(e: ChangeEvent<HTMLInputElement>, docFor: string = 'HomeBanner') {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newFiles = Array.from(files);

        // Update local previews for UI immediately
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews].slice(0, 5));
        setSelectedFiles(prev => [...prev, ...newFiles].slice(0, 5));

        // If you want immediate upload to S3 for each file:
        for (const file of newFiles) {
            if (file.type.startsWith('image/') || file.type === 'application/pdf') {
                try {
                    const directoryPath = `uploadsA/Company/Company-${companyID}/Builder/${docFor}`;
                    const uploadResponse = await imageUploadToS3(file, directoryPath, user);

                    if (uploadResponse && uploadResponse !== 'Image Upload Failed') {
                        const fileName = uploadResponse.fileName;
                        setFileNames(prev => [...prev, fileName]);

                        console.log('File uploaded successfully:', uploadResponse);
                    } else {
                        console.error('File upload failed');
                    }
                } catch (error) {
                    console.error('Error uploading file:', error);
                }
            }
        }
    }

    const removeFile = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);

        // Also remove from fileNames
        const newFileNames = fileNames.filter((_, i) => i !== index);
        setFileNames(newFileNames);

        // Update previews
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user?.companyID) return;
        dispatch(clearMessages());
        if (fileNames.length === 0) {
            return;
        }
        if (!companyID || !userID) {
            alert('User or Company information missing. Please log in again.');
            return;
        }

        const imgdata = {
            fileNames,
            companyID,
            userID,
        };

        dispatch(uploadHomeBanners(imgdata));

        // Note: Success handling (clearing files) could be moved to a useEffect based on successMessage
        // or handled here if it's not and async action that might fail.
        // For now, keeping it as is but it might be better in .then() or useEffect.
        setSelectedFiles([]);
        setPreviews([]);
        setFileNames([]);
        setEditingBanner(null);
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

                    {error && (
                        <div style={{ padding: '1rem', backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: '4px', marginBottom: '1.5rem', border: '1px solid #fecaca' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '500', color: '#374151' }}>
                                Select Images (Max 5)
                            </label>
                            <div style={{ border: '2px dashed #d1d5db', borderRadius: '6px', padding: '2rem', textAlign: 'center', cursor: 'pointer', backgroundColor: '#f9fafb' }} onClick={() => document.getElementById('file-upload')?.click()}>
                                <Upload size={32} color="#9ca3af" style={{ marginBottom: '1rem' }} />
                                <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>Click to upload or drag and drop</p>
                                <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>PNG, JPG up to 5MB</p>
                                <input
                                    id="file-upload"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'HomeBanner')}
                                    style={{ display: 'none' }}
                                />
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
