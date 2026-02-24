import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadBuilderProject, clearMessages } from '../../store/slices/buildersSlice';
import type { AppDispatch, RootState } from '../../store/store';
import { Upload, Briefcase, MapPin, AlignLeft, CheckCircle2, AlertCircle, X } from 'lucide-react';

const ProjectUpload = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Residential');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, successMessage } = useSelector((state: RootState) => state.builders);
    const { user } = useSelector((state: RootState) => state.auth);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async (e: FormEvent) => {
        e.preventDefault();
        if (!image || !user?.companyID) return;

        dispatch(clearMessages());
        // Using the existing slice but we could also use contentCMSService directly
        // I will keep using the slice but let's ensure it has the right fields
        const result = await dispatch(uploadBuilderProject({
            data: { title, description, category, companyID: user.companyID },
            file: image
        }));

        if (uploadBuilderProject.fulfilled.match(result)) {
            setTitle('');
            setDescription('');
            setCategory('Residential');
            setImage(null);
            setPreview(null);
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }} className="animate-fade-in">
            <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 4px 25px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ padding: '0.75rem', backgroundColor: '#fff7ed', color: '#ea580c', borderRadius: '12px' }}>
                        <Briefcase size={28} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Upload New Project</h2>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>Showcase your latest construction or design work</p>
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

                <form onSubmit={handleUpload} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#475569' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Briefcase size={16} /> Project Title</div>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="e.g. Modern Residential Complex"
                                style={{ padding: '0.875rem', borderRadius: '12px', border: '1px solid #e2e8f0', width: '100%' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#475569' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> Category</div>
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                style={{ padding: '0.875rem', borderRadius: '12px', border: '1px solid #e2e8f0', width: '100%', backgroundColor: 'white' }}
                            >
                                <option value="Residential">Residential</option>
                                <option value="Commercial">Commercial</option>
                                <option value="Industrial">Industrial</option>
                                <option value="Interior">Interior Design</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#475569' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlignLeft size={16} /> Description</div>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                rows={6}
                                placeholder="Provide details about the project scope, materials used, etc..."
                                style={{ padding: '0.875rem', borderRadius: '12px', border: '1px solid #e2e8f0', width: '100%', resize: 'none' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#475569' }}>Project Showcase Image</label>
                            <div style={{
                                border: '2px dashed #e2e8f0',
                                borderRadius: '16px',
                                padding: preview ? '1rem' : '3rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                position: 'relative',
                                backgroundColor: '#f8fafc',
                                minHeight: '350px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden'
                            }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 2 }}
                                />
                                {preview ? (
                                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                        <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setPreview(null); setImage(null); }}
                                            style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', backgroundColor: 'white', borderRadius: '50%', padding: '0.4rem', border: 'none', cursor: 'pointer', zIndex: 3, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                                        >
                                            <X size={18} color="#ef4444" />
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ color: '#94a3b8' }}>
                                        <Upload size={48} style={{ margin: '0 auto 1rem' }} />
                                        <p style={{ fontWeight: '700', color: '#475569' }}>Upload Project Image</p>
                                        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Recommended: 1200 x 800px or larger</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !image}
                            style={{
                                padding: '1rem',
                                backgroundColor: (loading || !image) ? '#94a3b8' : '#ea580c',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: (loading || !image) ? 'not-allowed' : 'pointer',
                                fontWeight: '700',
                                fontSize: '1.125rem',
                                marginTop: 'auto',
                                boxShadow: '0 4px 12px rgba(234, 88, 12, 0.2)',
                                transition: 'all 0.2s'
                            }}
                        >
                            {loading ? 'Uploading Project...' : 'Publish Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectUpload;
