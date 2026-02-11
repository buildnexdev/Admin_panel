import { useState, type FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadSchoolContent, clearMessages } from '../../store/slices/schoolSlice';
import type { AppDispatch, RootState } from '../../store/store';

const UploadContent = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [category, setCategory] = useState('announcement');

    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, successMessage } = useSelector((state: RootState) => state.school);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        dispatch(clearMessages());

        await dispatch(uploadSchoolContent({ title, body, category }));

        // Reset form on success would be handled by a useEffect ideally or check result here
        if (!error) {
            setTitle('');
            setBody('');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>Upload New Content</h3>

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

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
                    >
                        <option value="announcement">Announcement</option>
                        <option value="news">News</option>
                        <option value="event">Event</option>
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Body</label>
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                        rows={6}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        marginTop: '1rem',
                        padding: '0.75rem',
                        backgroundColor: loading ? '#93c5fd' : '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: '500'
                    }}
                >
                    {loading ? 'Uploading...' : 'Publish Content'}
                </button>
            </form>
        </div>
    );
};

export default UploadContent;
