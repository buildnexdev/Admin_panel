import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadBuilderProject, clearMessages } from '../../store/slices/buildersSlice';
import type { AppDispatch, RootState } from '../../store/store';
import { Upload } from 'lucide-react';

const ProjectUpload = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, successMessage } = useSelector((state: RootState) => state.builders);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async (e: FormEvent) => {
        e.preventDefault();
        if (!image) return;

        dispatch(clearMessages());
        const result = await dispatch(uploadBuilderProject({
            data: { title, description, location },
            file: image
        }));

        if (uploadBuilderProject.fulfilled.match(result)) {
            setTitle('');
            setDescription('');
            setLocation('');
            setImage(null);
            setPreview(null);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>Upload New Project</h3>

            {successMessage && (
                <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '4px', backgroundColor: '#dcfce7', color: '#166534' }}>
                    {successMessage}
                </div>
            )}

            {error && (
                <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '4px', backgroundColor: '#fee2e2', color: '#991b1b' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleUpload} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Project Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                            placeholder="e.g. Downtown City Center"
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={5}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label style={{ display: 'block', fontWeight: '500', color: '#374151' }}>Project Image</label>
                    <div style={{ border: '2px dashed #9ca3af', borderRadius: '8px', padding: '2rem', textAlign: 'center', cursor: 'pointer', position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', backgroundColor: '#f9fafb' }}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                        />
                        {preview ? (
                            <img src={preview} alt="Preview" style={{ maxHeight: '100%', maxWidth: '100%', borderRadius: '4px', objectFit: 'contain' }} />
                        ) : (
                            <div style={{ color: '#6b7280' }}>
                                <Upload size={48} style={{ margin: '0 auto 1rem' }} />
                                <p>Click or drag to upload image</p>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !image}
                    style={{
                        gridColumn: '1 / -1',
                        marginTop: '1rem',
                        padding: '0.75rem',
                        backgroundColor: (loading || !image) ? '#ea580c' : '#ea580c',
                        opacity: (loading || !image) ? 0.7 : 1,
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: (loading || !image) ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1rem'
                    }}
                >
                    {loading ? 'Uploading...' : 'Publish Project'}
                </button>
            </form>
        </div>
    );
};

export default ProjectUpload;
