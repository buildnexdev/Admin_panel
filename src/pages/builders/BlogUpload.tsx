import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs, addBlog, updateBlog, clearMessages } from '../../store/slices/buildersSlice';
import type { AppDispatch, RootState } from '../../store/store';
import { Img_Url } from '../../services/api';
import { Plus, X } from 'lucide-react';

const BlogUpload = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { blogs, loading, successMessage, error } = useSelector((state: RootState) => state.builders);
    const [showAddForm, setShowAddForm] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);

    useEffect(() => {
        dispatch(clearMessages());
    }, [dispatch]);

    useEffect(() => {
        if (user?.companyID) {
            dispatch(fetchBlogs(user.companyID));
        }
    }, [dispatch, user?.companyID]);

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverImage(file);
            setCoverPreview(URL.createObjectURL(file));
        } else {
            setCoverImage(null);
            setCoverPreview(null);
        }
    };

    const handleAddBlog = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        const result = await dispatch(addBlog({
            title: title.trim(),
            description: description.trim(),
            link: link.trim(),
            imageFile: coverImage
        }));
        if (addBlog.fulfilled.match(result)) {
            setTitle('');
            setDescription('');
            setLink('');
            setCoverImage(null);
            setCoverPreview(null);
            setShowAddForm(false);
        }
    };

    const handleToggleActive = (id: number, currentActive: boolean) => {
        if (!user?.companyID) return;
        dispatch(updateBlog({ id, companyID: user.companyID, isActive: !currentActive }));
    };

    const getBlogImageUrl = (blog: any) => {
        const path = blog.imageUrl || blog.image_url || blog.image || blog.imagePath || blog.cover_image || blog.coverImage || '';
        if (!path) return '';
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        const base = Img_Url.endsWith('/') ? Img_Url : Img_Url + '/';
        const p = path.startsWith('/') ? path.slice(1) : path;
        return base + p;
    };

    const getBlogLink = (blog: any) => blog.link || blog.linkUrl || blog.url || blog.blogLink || '';

    const cardRadius = 12;

    return (
        <div style={{ padding: '0 0.5rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
                        Blog Management
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                        Publish and manage blog posts
                    </p>
                </div>
                <button
                    onClick={() => setShowAddForm((v) => !v)}
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
                    <Plus size={18} /> Add Blog
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

            {showAddForm && (
                <form onSubmit={handleAddBlog} style={{
                    marginBottom: '2rem',
                    padding: '1.5rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>Add New Blog Post</h2>
                        <button type="button" onClick={() => setShowAddForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#64748b' }}>
                            <X size={20} />
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '480px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.35rem' }}>Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Blog post title"
                                required
                                style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.95rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.35rem' }}>Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Brief description or content"
                                rows={3}
                                style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.95rem', resize: 'vertical' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.35rem' }}>Link</label>
                            <input
                                type="url"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="https://..."
                                style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.95rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.35rem' }}>Cover image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleCoverChange}
                                style={{ width: '100%', padding: '0.5rem', fontSize: '0.9rem' }}
                            />
                            {coverPreview && (
                                <img src={coverPreview} alt="Cover preview" style={{ marginTop: '0.5rem', maxWidth: '160px', maxHeight: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button type="submit" disabled={loading} style={{
                                padding: '0.6rem 1.25rem',
                                backgroundColor: '#0f172a',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '500',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1
                            }}>
                                {loading ? 'Adding...' : 'Add Blog'}
                            </button>
                            <button type="button" onClick={() => setShowAddForm(false)} style={{
                                padding: '0.6rem 1.25rem',
                                backgroundColor: '#f1f5f9',
                                color: '#475569',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.5rem'
            }}>
                {blogs && blogs.length > 0 ? (
                    blogs.map((blog: any) => {
                        const imageUrl = getBlogImageUrl(blog);
                        return (
                            <div key={blog.id} style={{
                                backgroundColor: 'white',
                                borderRadius: cardRadius,
                                overflow: 'hidden',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.05)',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                {/* Top: cover image */}
                                <div style={{ width: '100%', height: '200px', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={blog.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
                                            No image
                                        </div>
                                    )}
                                </div>

                                {/* Content: title, description, link */}
                                <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1E293B', margin: 0, lineHeight: 1.3 }}>
                                        {blog.title}
                                    </h3>
                                    <p style={{ color: '#4A5568', fontSize: '0.9375rem', lineHeight: 1.55, margin: 0, flex: 1 }}>
                                        {blog.content || blog.description || 'No description.'}
                                    </p>
                                    {getBlogLink(blog) && (
                                        <div style={{ marginTop: '0.25rem' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '0.25rem' }}>Link</span>
                                            <a href={getBlogLink(blog)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.875rem', color: '#2563eb', wordBreak: 'break-all' }}>
                                                {getBlogLink(blog)}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Active / Inactive */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '1rem 1.5rem',
                                    borderTop: '1px solid #f1f5f9'
                                }}>
                                    <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>
                                        {(blog.isActive ?? true) ? 'Active' : 'Inactive'}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleToggleActive(blog.id, !!blog.isActive)}
                                        disabled={loading}
                                        style={{
                                            width: '44px',
                                            height: '24px',
                                            borderRadius: '12px',
                                            border: 'none',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            backgroundColor: (blog.isActive ?? true) ? '#22c55e' : '#e2e8f0',
                                            position: 'relative',
                                            transition: 'background-color 0.2s'
                                        }}
                                        aria-label={(blog.isActive ?? true) ? 'Set inactive' : 'Set active'}
                                    >
                                        <span style={{
                                            position: 'absolute',
                                            top: '2px',
                                            left: (blog.isActive ?? true) ? '22px' : '2px',
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            backgroundColor: 'white',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                                            transition: 'left 0.2s'
                                        }} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={{ gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                        <p style={{ color: '#64748b', fontWeight: '500' }}>No blog posts yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogUpload;
