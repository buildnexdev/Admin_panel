import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadBuilderProject, clearMessages, fetchProjects, deleteProject } from '../../store/slices/buildersSlice';
import { contentCMSService } from '../../services/api';
import type { AppDispatch, RootState } from '../../store/store';
import { Upload, Briefcase, MapPin, AlignLeft, CheckCircle2, AlertCircle, X, ExternalLink, Calendar, Trash2, Edit2 } from 'lucide-react';

const ProjectUpload = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Residential');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, successMessage, projects } = useSelector((state: RootState) => state.builders);
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (user?.companyID) {
            dispatch(fetchProjects(user.companyID));
        }
    }, [dispatch, user?.companyID]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setCategory('Residential');
        setImage(null);
        setPreview(null);
        setEditingId(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user?.companyID) return;

        dispatch(clearMessages());

        if (editingId) {
            // UPDATE LOGIC
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('category', category);
            if (image) formData.append('image', image);

            try {
                await contentCMSService.updateProject(editingId, formData);
                dispatch(fetchProjects(user.companyID));
                resetForm();
            } catch (err: any) {
                // Error handled by local state if needed
            }
        } else {
            // CREATE LOGIC
            if (!image) return;
            const result = await dispatch(uploadBuilderProject({
                data: { title, description, category, companyID: user.companyID },
                file: image
            }));
            if (uploadBuilderProject.fulfilled.match(result)) {
                resetForm();
            }
        }
    };

    const handleEdit = (project: any) => {
        setEditingId(project.id);
        setTitle(project.title);
        setDescription(project.description);
        setCategory(project.category);
        setPreview(project.image_url);
        setImage(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this project?') && user?.companyID) {
            dispatch(deleteProject({ id, companyID: user.companyID }));
        }
    };

    return (
        <div style={{ width: '100%' }} className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: '2rem', alignItems: 'start' }}>

                {/* Form Section */}
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ padding: '0.625rem', backgroundColor: editingId ? '#eef2ff' : '#fff7ed', color: editingId ? '#4f46e5' : '#ea580c', borderRadius: '12px' }}>
                            {editingId ? <Edit2 size={24} /> : <Briefcase size={24} />}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                                {editingId ? 'Edit Project' : 'Upload New Project'}
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '0.8125rem', margin: 0 }}>
                                {editingId ? 'Update details of your existing project' : 'Showcase your latest construction or design work'}
                            </p>
                        </div>
                    </div>

                    {successMessage && (
                        <div style={{ padding: '0.875rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', fontSize: '0.875rem' }}>
                            <CheckCircle2 size={18} />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#475569' }}>Project Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="Enter project title..."
                                style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.875rem' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#475569' }}>Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: 'white', fontSize: '0.875rem' }}
                            >
                                <option value="Residential">Residential</option>
                                <option value="Commercial">Commercial</option>
                                <option value="Industrial">Industrial</option>
                                <option value="Interior">Interior Design</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#475569' }}>Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                rows={4}
                                placeholder="Describe the project..."
                                style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', resize: 'none', fontSize: '0.875rem' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#475569' }}>
                                {editingId ? 'Change Image (Optional)' : 'Project Image'}
                            </label>
                            <div style={{ border: '2px dashed #e2e8f0', borderRadius: '12px', padding: preview ? '0.5rem' : '2rem', textAlign: 'center', cursor: 'pointer', position: 'relative', backgroundColor: '#f8fafc', minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <input type="file" accept="image/*" onChange={handleImageChange} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 2 }} />
                                {preview ? (
                                    <div style={{ width: '100%', position: 'relative' }}>
                                        <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '140px', objectFit: 'cover', borderRadius: '8px' }} />
                                        <button type="button" onClick={() => { setPreview(null); setImage(null); }} style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: 'white', borderRadius: '50%', padding: '2px', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                            <X size={14} color="#ef4444" />
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ color: '#94a3b8' }}>
                                        <Upload size={32} style={{ margin: '0 auto 0.5rem' }} />
                                        <p style={{ fontWeight: '700', fontSize: '0.8125rem', margin: 0 }}>Click to Upload</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="submit"
                                disabled={loading || (!editingId && !image)}
                                style={{
                                    flex: 1,
                                    padding: '0.875rem',
                                    backgroundColor: (loading || (!editingId && !image)) ? '#94a3b8' : (editingId ? '#4f46e5' : '#ea580c'),
                                    color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s'
                                }}
                            >
                                {loading ? 'Processing...' : (editingId ? 'Update Project' : 'Publish Project')}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    style={{ padding: '0.875rem 1.5rem', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* List Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Active Projects</h2>
                        <div style={{ padding: '0.4rem 0.8rem', backgroundColor: '#f1f5f9', borderRadius: '20px', color: '#475569', fontSize: '0.75rem', fontWeight: '700' }}>
                            {projects?.length || 0} Total
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', maxHeight: 'calc(100vh - 250px)', overflowY: 'auto', paddingRight: '0.5rem' }}>
                        {projects && projects.length > 0 ? (
                            projects.map((project: any) => (
                                <div key={project.id} style={{ backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                                    <div style={{ height: '150px', position: 'relative' }}>
                                        <img src={project.image_url} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', padding: '0.3rem 0.6rem', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '20px', fontSize: '0.65rem', fontWeight: '700', color: '#ea580c' }}>
                                            {project.category}
                                        </div>
                                    </div>
                                    <div style={{ padding: '1rem' }}>
                                        <h3 style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.4rem' }}>{project.title}</h3>
                                        <p style={{ fontSize: '0.8125rem', color: '#64748b', mb: '1rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1rem' }}>{project.description}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #f8fafc' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => handleEdit(project)} style={{ padding: '0.4rem', border: 'none', backgroundColor: '#f1f5f9', color: '#6366f1', borderRadius: '8px', cursor: 'pointer' }}>
                                                    <Edit2 size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(project.id)} style={{ padding: '0.4rem', border: 'none', backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: '8px', cursor: 'pointer' }}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{new Date(project.created_at).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                                <Briefcase size={40} style={{ margin: '0 auto 1rem', color: '#cbd5e1' }} />
                                <p style={{ color: '#64748b', fontWeight: '600' }}>No projects found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectUpload;
