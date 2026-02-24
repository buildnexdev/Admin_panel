import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadHomeBanners, clearMessages } from '../../store/slices/buildersSlice';
import type { AppDispatch, RootState } from '../../store/store';
import { X, Image as ImageIcon, CheckCircle2, AlertCircle, Plus } from 'lucide-react';

const HomeBannerUpload = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, successMessage } = useSelector((state: RootState) => state.builders);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);

            if (files.length + selectedFiles.length > 5) {
                alert('You can only upload a maximum of 5 images.');
                return;
            }

            const newFiles = [...selectedFiles, ...files].slice(0, 5);
            setSelectedFiles(newFiles);

            // Generate previews
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setPreviews(newPreviews);
        }
    };

    const removeFile = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);

        // Update previews
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        dispatch(clearMessages());

        if (selectedFiles.length === 0) {
            return;
        }

        await dispatch(uploadHomeBanners(selectedFiles));
        setSelectedFiles([]);
        setPreviews([]);
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }} className="animate-fade-in">
            <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 4px 25px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ padding: '0.75rem', backgroundColor: '#f0fdf4', color: '#166534', borderRadius: '12px' }}>
                        <ImageIcon size={28} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Home Page Banners</h2>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>Add high-resolution images for the main website slider</p>
                    </div>
                </div>

                {successMessage && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        backgroundColor: '#f0fdf4',
                        color: '#166534',
                        border: '1px solid #bbf7d0'
                    }}>
                        <CheckCircle2 size={20} />
                        <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>{successMessage}</span>
                    </div>
                )}

                {error && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        backgroundColor: '#fef2f2',
                        color: '#991b1b',
                        border: '1px solid #fecaca'
                    }}>
                        <AlertCircle size={20} />
                        <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div
                        style={{
                            border: '2px dashed #e2e8f0',
                            borderRadius: '20px',
                            padding: '3rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            backgroundColor: '#f8fafc',
                            transition: 'all 0.2s',
                            marginBottom: '2rem'
                        }}
                        onClick={() => document.getElementById('file-upload')?.click()}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                    >
                        <div style={{
                            width: '64px',
                            height: '64px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                            color: '#6366f1'
                        }}>
                            <Plus size={32} />
                        </div>
                        <p style={{ color: '#1e293b', fontWeight: '700', fontSize: '1.125rem', marginBottom: '0.5rem' }}>Add up to 5 slider images</p>
                        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Drag and drop or click to browse files</p>
                        <input
                            id="file-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </div>

                    {previews.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                            {previews.map((preview, index) => (
                                <div key={index} style={{
                                    position: 'relative',
                                    aspectRatio: '16/10',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    border: '1px solid #f1f5f9',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                }}>
                                    <img src={preview} alt={`Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                                        style={{
                                            position: 'absolute',
                                            top: '0.5rem',
                                            right: '0.5rem',
                                            padding: '0.4rem',
                                            backgroundColor: 'rgba(255,255,255,0.9)',
                                            borderRadius: '50%',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <X size={14} color="#ef4444" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            type="submit"
                            disabled={loading || selectedFiles.length === 0}
                            style={{
                                padding: '1rem 2.5rem',
                                backgroundColor: loading || selectedFiles.length === 0 ? '#94a3b8' : '#6366f1',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: loading || selectedFiles.length === 0 ? 'not-allowed' : 'pointer',
                                fontWeight: '700',
                                fontSize: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                                transition: 'all 0.2s'
                            }}
                        >
                            {loading ? 'Uploading...' : 'Publish Banners'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HomeBannerUpload;
