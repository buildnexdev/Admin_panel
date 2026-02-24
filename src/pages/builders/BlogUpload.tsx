import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs, deleteBlog } from '../../store/slices/buildersSlice';
import { contentCMSService } from '../../services/api';
import type { AppDispatch, RootState } from '../../store/store';
import { BookOpen, Upload, CheckCircle2, AlertCircle, Calendar, User, Trash2, Edit2, X } from 'lucide-react';

const BlogUpload = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { blogs } = useSelector((state: RootState) => state.builders);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author] = useState(user?.name || '');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (user?.companyID) {
            dispatch(fetchBlogs(user.companyID));
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
        setContent('');
        setImage(null);
        setPreview(null);
        setEditingId(null);
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

            if (editingId) {
                await contentCMSService.updateBlog(editingId, formData);
                setMessage({ type: 'success', text: 'Blog post updated successfully!' });
            } else {
                await contentCMSService.addBlog(formData);
                setMessage({ type: 'success', text: 'Blog post published successfully!' });
            }
            resetForm();
            dispatch(fetchBlogs(user.companyID));
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to process blog' });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (blog: any) => {
        setEditingId(blog.id);
        setTitle(blog.title);
        setContent(blog.content);
        setPreview(blog.image_url);
        setImage(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Delete this blog post?') && user?.companyID) {
            dispatch(deleteBlog({ id, companyID: user.companyID }));
        }
    };

    return (
        <div style={{ width: '100%' }} className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: '2rem', alignItems: 'start' }}>

                {/* Create Blog Post Section */}
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ padding: '0.625rem', backgroundColor: editingId ? '#fdf2f8' : '#f0fdf4', color: editingId ? '#db2777' : '#166534', borderRadius: '12px' }}>
                            {editingId ? <Edit2 size={24} /> : <BookOpen size={24} />}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                                {editingId ? 'Edit Blog Post' : 'Create Blog Post'}
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '0.8125rem', margin: 0 }}>
                                {editingId ? 'Update your published article' : 'Publish a new article to your website'}
                            </p>
                        </div>
                    </div>

                    {message && (
                        <div style={{ padding: '0.875rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2', color: message.type === 'success' ? '#166534' : '#991b1b', border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`, fontSize: '0.875rem' }}>
                            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            <span>{message.text}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#475569' }}>Post Title</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Enter title..." style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9375rem' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#475569' }}>Content</label>
                            <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={6} placeholder="Write content..." style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', resize: 'none', fontSize: '0.9375rem' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#475569' }}>
                                {editingId ? 'Change Cover Image (Optional)' : 'Cover Image'}
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
                                        <p style={{ fontWeight: '600', fontSize: '0.8125rem' }}>Click to upload</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="submit"
                                disabled={loading || (!editingId && !image)}
                                style={{
                                    flex: 1, padding: '0.875rem', backgroundColor: loading ? '#94a3b8' : (editingId ? '#db2777' : '#db2777'),
                                    color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer'
                                }}
                            >
                                {loading ? 'Processing...' : (editingId ? 'Update Post' : 'Publish Blog Post')}
                            </button>
                            {editingId && (
                                <button type="button" onClick={resetForm} style={{ padding: '0.875rem 1.5rem', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', fontWeight: '700' }}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* List Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Active Blog Posts</h2>
                        <div style={{ padding: '0.4rem 0.8rem', backgroundColor: '#f1f5f9', borderRadius: '20px', color: '#475569', fontSize: '0.75rem', fontWeight: '700' }}>
                            {blogs?.length || 0} Total
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                        {blogs && blogs.length > 0 ? (
                            blogs.map((blog: any) => (
                                <div key={blog.id} style={{ backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                                    {blog.image_url && (
                                        <div style={{ height: '140px' }}>
                                            <img src={blog.image_url} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                    <div style={{ padding: '1.25rem' }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>{blog.title}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#94a3b8', fontSize: '0.7rem', marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                                <User size={12} /> {blog.author}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                                <Calendar size={12} /> {new Date(blog.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #f8fafc' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => handleEdit(blog)} style={{ color: '#6366f1', padding: '0.4rem', borderRadius: '8px', backgroundColor: '#f1f5f9', border: 'none', cursor: 'pointer' }}>
                                                    <Edit2 size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(blog.id)} style={{ color: '#ef4444', padding: '0.4rem', borderRadius: '8px', backgroundColor: '#fef2f2', border: 'none', cursor: 'pointer' }}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                                <BookOpen size={40} style={{ margin: '0 auto 1rem', color: '#cbd5e1' }} />
                                <p style={{ color: '#64748b', fontWeight: '600' }}>No articles published yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogUpload;
