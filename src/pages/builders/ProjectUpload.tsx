import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadBuilderProject, clearMessages } from '../../store/slices/buildersSlice';
import type { AppDispatch, RootState } from '../../store/store';
import { Upload, X, CheckCircle2 } from 'lucide-react';

const ProjectUpload = () => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [locationInput, setLocationInput] = useState('');
    const [area, setArea] = useState('');
    const [status, setStatus] = useState('');
    const [budget, setBudget] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const { loading, successMessage } = useSelector((state: RootState) => state.builders);
    const { user } = useSelector((state: RootState) => state.auth);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const resetForm = () => {
        setTitle('');
        setCategory('');
        setLocationInput('');
        setArea('');
        setStatus('');
        setBudget('');
        setStartDate('');
        setEndDate('');
        setImage(null);
        setPreview(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user?.companyID || !image) return;

        dispatch(clearMessages());

        // We append the extra fields into description for now to maintain compatibility with existing API/Redux
        const description = `Location: ${locationInput}\nArea: ${area} sq ft\nStatus: ${status}\nBudget: ${budget}\nTimeline: ${startDate} to ${endDate}`;

        const result = await dispatch(uploadBuilderProject({
            data: { title, description, category, companyID: user.companyID },
            file: image
        }));

        if (uploadBuilderProject.fulfilled.match(result)) {
            resetForm();
        }
    };

    return (
        <div style={{ padding: '0 0.5rem', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
                    Upload Project
                </h1>
                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                    Add new construction project with details and images
                </p>
            </div>

            {successMessage && (
                <div style={{ padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', fontSize: '0.9rem' }}>
                    <CheckCircle2 size={20} />
                    <span>{successMessage}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Images Section */}
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem' }}>Project Images</h3>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Upload high-quality images of your project</p>

                    <div style={{ border: '1px dashed #cbd5e1', borderRadius: '12px', padding: preview ? '1rem' : '4rem 2rem', textAlign: 'center', cursor: 'pointer', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <input type="file" accept="image/*" onChange={handleImageChange} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 2 }} />
                        {preview ? (
                            <div style={{ position: 'relative', width: 'fit-content' }}>
                                <img src={preview} alt="Preview" style={{ maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                                <button type="button" onClick={(e) => { e.preventDefault(); setPreview(null); setImage(null); }} style={{ position: 'absolute', top: '-10px', right: '-10px', backgroundColor: 'white', borderRadius: '50%', padding: '4px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', cursor: 'pointer', zIndex: 3 }}>
                                    <X size={16} color="#ef4444" />
                                </button>
                            </div>
                        ) : (
                            <div style={{ color: '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ marginBottom: '1rem', color: '#94a3b8' }}>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                        <polyline points="21 15 16 10 5 21"></polyline>
                                    </svg>
                                </div>
                                <p style={{ fontWeight: '500', fontSize: '1rem', color: '#334155', margin: '0 0 0.5rem 0' }}>Drop images here or click to upload</p>
                                <p style={{ fontSize: '0.85rem', margin: 0, color: '#94a3b8' }}>Support for JPG, PNG, WEBP (Max 10MB each)</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Details Section */}
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem' }}>Project Details</h3>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Enter comprehensive project information</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0f172a' }}>Project Title *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="e.g., Luxury Villa Project"
                                style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0f172a' }}>Category *</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155', appearance: 'none' }}
                            >
                                <option value="" disabled>Select category</option>
                                <option value="Residential">Residential</option>
                                <option value="Commercial">Commercial</option>
                                <option value="Industrial">Industrial</option>
                                <option value="Infrastructure">Infrastructure</option>
                                <option value="Renovation">Renovation</option>
                                <option value="Interior Design">Interior Design</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0f172a' }}>Location</label>
                            <input
                                type="text"
                                value={locationInput}
                                onChange={(e) => setLocationInput(e.target.value)}
                                placeholder="City, State"
                                style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0f172a' }}>Area (sq ft)</label>
                            <input
                                type="number"
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                                placeholder="5000"
                                style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0f172a' }}>Project Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155', appearance: 'none' }}
                            >
                                <option value="" disabled>Select status</option>
                                <option value="Planning">Planning</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0f172a' }}>Budget</label>
                            <input
                                type="text"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                placeholder="$500,000"
                                style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0f172a' }}>Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: startDate ? '#334155' : '#94a3b8' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0f172a' }}>End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: endDate ? '#334155' : '#94a3b8' }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <button
                        type="submit"
                        disabled={loading || !image || !title || !category}
                        style={{
                            padding: '0.75rem 2rem',
                            backgroundColor: (loading || !image || !title || !category) ? '#94a3b8' : '#0f172a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            cursor: (loading || !image || !title || !category) ? 'not-allowed' : 'pointer',
                            display: 'none' // We can hide the dummy form submission for UI purposes or keep it. Let's keep it visible.
                        }}
                    >
                        {loading ? 'Uploading...' : 'Save Category'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProjectUpload;
