import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useSelector } from 'react-redux';
import { contentCMSService } from '../../services/api';
import type { RootState } from '../../store/store';
import { BookOpen, Upload, CheckCircle2, AlertCircle, X } from 'lucide-react';

const BlogUpload = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState(user?.name || '');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user?.companyID) return;

        setLoading(true);
        setMessage(null);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('author', author);
            formData.append('companyID', user.companyID.toString());
            if (image) formData.append('image', image);

            await contentCMSService.addBlog(formData);
            setMessage({ type: 'success', text: 'Blog post published successfully!' });
            setTitle('');
            setContent('');
            setImage(null);
            setPreview(null);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to publish blog' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }} className="animate-fade-in">
            <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 4px 25px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ padding: '0.75rem', backgroundColor: '#fdf2f8', color: '#db2777', borderRadius: '12px' }}>
                        <BookOpen size={28} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Create Blog Post</h2>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>Share updates, news and articles with your audience</p>
                    </div>
                </div>

                {message && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
                        color: message.type === 'success' ? '#166534' : '#991b1b',
                        border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                    }}>
                        {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>{message.text}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#475569' }}>Post Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="Enter an engaging title..."
                                style={{ padding: '0.875rem', borderRadius: '12px', border: '1px solid #e2e8f0', width: '100%' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#475569' }}>Author Name</label>
                            <input
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                required
                                style={{ padding: '0.875rem', borderRadius: '12px', border: '1px solid #e2e8f0', width: '100%' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#475569' }}>Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                rows={10}
                                placeholder="Write your blog content here..."
                                style={{ padding: '0.875rem', borderRadius: '12px', border: '1px solid #e2e8f0', width: '100%', resize: 'none' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#475569' }}>Cover Image</label>
                            <div style={{
                                border: '2px dashed #e2e8f0',
                                borderRadius: '16px',
                                padding: preview ? '1rem' : '3rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                position: 'relative',
                                backgroundColor: '#f8fafc',
                                minHeight: '300px',
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
                                        <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setPreview(null); setImage(null); }}
                                            style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', backgroundColor: 'white', borderRadius: '50%', padding: '0.25rem', border: 'none', cursor: 'pointer', zIndex: 3, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                                        >
                                            <X size={16} color="#ef4444" />
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ color: '#94a3b8' }}>
                                        <Upload size={40} style={{ margin: '0 auto 1rem' }} />
                                        <p style={{ fontWeight: '600' }}>Click to upload</p>
                                        <p style={{ fontSize: '0.75rem' }}>High resolution landscape image recommended</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '1rem',
                                backgroundColor: loading ? '#94a3b8' : '#db2777',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontWeight: '700',
                                fontSize: '1rem',
                                marginTop: 'auto',
                                boxShadow: '0 4px 12px rgba(219, 39, 119, 0.2)'
                            }}
                        >
                            {loading ? 'Publishing...' : 'Publish Blog Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BlogUpload;
