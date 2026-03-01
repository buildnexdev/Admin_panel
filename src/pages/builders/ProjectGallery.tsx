import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, addSingleProject, updateProject, clearMessages } from '../../store/slices/buildersSlice';
import { Img_Url } from '../../services/api';
import type { AppDispatch, RootState } from '../../store/store';
import { Plus, X } from 'lucide-react';

const PROJECT_CATEGORIES = ['Residential', 'Commercial', 'Industrial'] as const;

function isProjectActive(project: any): boolean {
    if (project.isActive === true || project.isActive === 1) return true;
    if (project.isActive === '1') return true;
    return false;
}

const ProjectGallery = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { projects, loading, successMessage, error } = useSelector((state: RootState) => state.builders);
    const { user } = useSelector((state: RootState) => state.auth);
    const companyID = user?.companyID;

    const [showUpload, setShowUpload] = useState(false);
    const [category, setCategory] = useState<string>(PROJECT_CATEGORIES[0]);
    const [title, setTitle] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        dispatch(clearMessages());
    }, [dispatch]);

    useEffect(() => {
        if (companyID) {
            dispatch(fetchProjects({ companyID }));
        }
    }, [dispatch, companyID]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        } else {
            setImage(null);
            setPreview(null);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!companyID || !title.trim() || !image) return;
        const result = await dispatch(addSingleProject({
            category,
            title: title.trim(),
            file: image,
            companyID
        }));
        if (addSingleProject.fulfilled.match(result)) {
            setTitle('');
            setCategory(PROJECT_CATEGORIES[0]);
            setImage(null);
            setPreview(null);
            setShowUpload(false);
        }
    };

    const handleToggleActive = (project: any) => {
        if (!companyID) return;
        dispatch(updateProject({ id: project.id, companyID, isActive: !isProjectActive(project) }));
    };

    const getProjectImageUrl = (project: any) => {
        const path = project.imageUrl || project.image_url || project.image || project.imagePath || '';
        if (!path) return '';
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        const base = Img_Url.endsWith('/') ? Img_Url : Img_Url + '/';
        const p = path.startsWith('/') ? path.slice(1) : path;
        return base + p;
    };

    return (
        <div style={{ padding: '0 0.5rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
                        Project Gallery
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                        Upload projects by category (Residential, Commercial, Industrial)
                    </p>
                </div>
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
                    <Plus size={18} /> Upload New Project
                </button>
            </div>

            {successMessage && (
                <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '8px', fontSize: '0.9rem' }}>
                    {successMessage}
                </div>
            )}
            {error && (
                <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontSize: '0.9rem' }}>
                    {error}
                </div>
            )}

            {/* Upload section */}
            {showUpload && (
                <div style={{
                    marginBottom: '2rem',
                    padding: '1.5rem',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>Upload new project</h2>
                        <button
                            type="button"
                            onClick={() => { setShowUpload(false); setTitle(''); setImage(null); setPreview(null); }}
                            style={{ padding: '0.4rem', border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '480px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.35rem' }}>Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.95rem' }}
                            >
                                {PROJECT_CATEGORIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.35rem' }}>Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Project title"
                                required
                                style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.95rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.35rem' }}>Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                                style={{ width: '100%', padding: '0.5rem', fontSize: '0.9rem' }}
                            />
                            {preview && (
                                <img src={preview} alt="Preview" style={{ marginTop: '0.5rem', maxWidth: '200px', maxHeight: '140px', objectFit: 'cover', borderRadius: '8px' }} />
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button type="submit" disabled={loading} style={{
                                padding: '0.6rem 1.25rem',
                                backgroundColor: loading ? '#94a3b8' : '#0f172a',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '500',
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}>
                                {loading ? 'Uploading...' : 'Upload Project'}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowUpload(false); setTitle(''); setImage(null); setPreview(null); }}
                                style={{
                                    padding: '0.6rem 1.25rem',
                                    backgroundColor: '#f1f5f9',
                                    color: '#475569',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.5rem'
            }}>
                {projects && projects.length > 0 ? (
                    projects.map((project: any) => {
                        const imageUrl = getProjectImageUrl(project);
                        return (
                            <div key={project.id} style={{
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                border: '1px solid #000',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <div style={{ height: '200px', position: 'relative', backgroundColor: '#f1f5f9' }}>
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={project.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
                                            No image
                                        </div>
                                    )}
                                    <div style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        left: '1rem',
                                        backgroundColor: isProjectActive(project) ? '#22c55e' : '#94a3b8',
                                        color: 'white',
                                        padding: '0.2rem 0.8rem',
                                        borderRadius: '16px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600'
                                    }}>
                                        {isProjectActive(project) ? 'Active' : 'Inactive'}
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        backgroundColor: 'rgba(15,23,42,0.85)',
                                        color: 'white',
                                        padding: '0.25rem 0.6rem',
                                        borderRadius: '8px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600'
                                    }}>
                                        {project.category || 'Project'}
                                    </div>
                                </div>

                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>
                                        {project.title}
                                    </h3>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                                        <span style={{ color: '#64748b', fontWeight: '500', fontSize: '0.875rem' }}>Active:</span>
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={isProjectActive(project)}
                                            onClick={() => handleToggleActive(project)}
                                            style={{
                                                width: '44px',
                                                height: '24px',
                                                borderRadius: '12px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                backgroundColor: isProjectActive(project) ? '#22c55e' : '#e2e8f0',
                                                position: 'relative',
                                                flexShrink: 0
                                            }}
                                        >
                                            <span style={{
                                                position: 'absolute',
                                                top: '2px',
                                                left: isProjectActive(project) ? '22px' : '2px',
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                backgroundColor: 'white',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                                transition: 'left 0.2s ease'
                                            }} />
                                        </button>
                                        <span style={{ color: isProjectActive(project) ? '#22c55e' : '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>
                                            {isProjectActive(project) ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={{ gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                        <p style={{ color: '#64748b', fontWeight: '500' }}>No projects yet. Upload a project using the button above.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectGallery;
