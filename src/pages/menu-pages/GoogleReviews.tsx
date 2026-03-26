import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews, addReview, updateReview, deleteReview, clearReviewMessages } from '../../store/slices/reviewSlice';
import type { AppDispatch, RootState } from '../../store/store';
import type { ReviewData } from '../../services/reviewApi';
import ConfirmModal from '../../components/ConfirmModal';
import { Plus, X, Edit2, Trash2, Star, MessageSquare, User, Link2, ImagePlus, ExternalLink } from 'lucide-react';

/* ──────────────────── helpers ──────────────────── */
const renderStars = (rating: number, size = 16, interactive = false, onSelect?: (r: number) => void) => {
    return (
        <div style={{ display: 'flex', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    size={size}
                    fill={i <= rating ? '#FBBC04' : 'none'}
                    color={i <= rating ? '#FBBC04' : '#cbd5e1'}
                    strokeWidth={1.5}
                    style={{ cursor: interactive ? 'pointer' : 'default', transition: 'all 0.2s' }}
                    onClick={() => interactive && onSelect?.(i)}
                    onMouseEnter={(e) => interactive && ((e.currentTarget.style.transform = 'scale(1.2)'))}
                    onMouseLeave={(e) => interactive && ((e.currentTarget.style.transform = 'scale(1)'))}
                />
            ))}
        </div>
    );
};

const googleColors = ['#4285F4', '#EA4335', '#FBBC04', '#34A853', '#FF6D01', '#46BDC6', '#7B1FA2'];
const getAvatarColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return googleColors[Math.abs(hash) % googleColors.length];
};



/* ──────────────────── main component ──────────────────── */
const GoogleReviews = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { reviews, loading, successMessage, error } = useSelector((state: RootState) => state.reviews);

    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const [reviewerName, setReviewerName] = useState('');
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [socialLink, setSocialLink] = useState('');
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; review: any }>({ open: false, review: null });
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

    useEffect(() => {
        if (showForm) document.body.classList.add('modal-open');
        else document.body.classList.remove('modal-open');
        return () => document.body.classList.remove('modal-open');
    }, [showForm]);

    useEffect(() => { dispatch(clearReviewMessages()); }, [dispatch]);

    useEffect(() => {
        if (user?.companyID) dispatch(fetchReviews(user.companyID));
    }, [dispatch, user?.companyID]);

    useEffect(() => {
        if (successMessage) {
            setToast({ show: true, message: successMessage, type: 'success' });
            const t = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
            return () => clearTimeout(t);
        }
    }, [successMessage]);

    useEffect(() => {
        if (error) {
            setToast({ show: true, message: error, type: 'error' });
            const t = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
            return () => clearTimeout(t);
        }
    }, [error]);

    const resetForm = () => {
        setReviewerName(''); setRating(5); setReviewText(''); setSocialLink('');
        setShowForm(false); setEditMode(false); setEditId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewerName.trim() || !user?.companyID) return;

        const payload: ReviewData = {
            reviewerName: reviewerName.trim(),
            rating,
            reviewText: reviewText.trim(),
            socialLink: socialLink.trim() || undefined,
            companyID: user.companyID,
            userId: user.userId,
        };

        if (editMode && editId) {
            const res = await dispatch(updateReview({ id: editId, data: payload }));
            if (updateReview.fulfilled.match(res)) {
                resetForm();
                dispatch(fetchReviews(user.companyID));
            }
        } else {
            const res = await dispatch(addReview(payload));
            if (addReview.fulfilled.match(res)) {
                resetForm();
                dispatch(fetchReviews(user.companyID));
            }
        }
    };

    const handleEdit = (review: any) => {
        setEditMode(true); setEditId(review.id);
        setReviewerName(review.reviewerName || review.reviewer_name || '');
        setRating(review.rating || 5);
        setReviewText(review.reviewText || review.review_text || '');
        setSocialLink(review.socialLink || review.social_link || '');
        setShowForm(true);
    };

    const handleDeleteClick = (review: any) => setConfirmDelete({ open: true, review });
    const handleConfirmDelete = () => {
        if (confirmDelete.review) dispatch(deleteReview(confirmDelete.review.id));
        setConfirmDelete({ open: false, review: null });
    };

    /* ──── Stats ──── */
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0 ? (reviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / totalReviews).toFixed(1) : '0.0';
    const ratingBreakdown = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter((r: any) => r.rating === star).length,
        pct: totalReviews > 0 ? (reviews.filter((r: any) => r.rating === star).length / totalReviews) * 100 : 0
    }));

    return (
        <div style={{ padding: '0 0.5rem', maxWidth: '1400px', margin: '0 auto' }}>

            {/* Toast Notification */}
            {toast.show && (
                <div style={{
                    position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 99999,
                    padding: '0.875rem 1.5rem', borderRadius: '12px',
                    backgroundColor: toast.type === 'success' ? '#059669' : '#dc2626',
                    color: 'white', fontWeight: '500', fontSize: '0.9rem',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                    animation: 'slideInRight 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                    {toast.type === 'success' ? '✓' : '✕'} {toast.message}
                </div>
            )}

            <ConfirmModal
                open={confirmDelete.open}
                title="Delete Review"
                message={confirmDelete.review ? `Delete review by "${confirmDelete.review.reviewerName || confirmDelete.review.reviewer_name}"?` : ''}
                confirmLabel="Delete"
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDelete({ open: false, review: null })}
            />

            {/* ───── Header ───── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '10px',
                            background: 'linear-gradient(135deg, #4285F4, #34A853)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(66,133,244,0.3)'
                        }}>
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        </div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>
                            Google Reviews
                        </h1>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', marginLeft: '3.25rem' }}>
                        Manage and showcase customer reviews
                    </p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: 'linear-gradient(135deg, #4285F4, #1a73e8)',
                        color: 'white', padding: '0.7rem 1.4rem', borderRadius: '10px',
                        border: 'none', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(66,133,244,0.35)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(66,133,244,0.45)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(66,133,244,0.35)'; }}
                >
                    <Plus size={18} /> Add Review
                </button>
            </div>

            {/* ───── Stats Overview ───── */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'auto 1fr',
                gap: '2rem', marginBottom: '2.5rem',
                backgroundColor: 'white', borderRadius: '16px', padding: '2rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.04)',
            }}>
                {/* Left: big average */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 1rem' }}>
                    <span style={{ fontSize: '3.5rem', fontWeight: '700', color: '#1a1a1a', lineHeight: 1 }}>{avgRating}</span>
                    <div style={{ margin: '0.5rem 0' }}>{renderStars(Math.round(Number(avgRating)), 20)}</div>
                    <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{totalReviews} review{totalReviews !== 1 ? 's' : ''}</span>
                </div>
                {/* Right: breakdown bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
                    {ratingBreakdown.map(({ star, count, pct }) => (
                        <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569', width: '12px', textAlign: 'right' }}>{star}</span>
                            <Star size={13} fill="#FBBC04" color="#FBBC04" />
                            <div style={{ flex: 1, height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${pct}%`, height: '100%', borderRadius: '4px',
                                    background: star >= 4 ? 'linear-gradient(90deg, #34A853, #0F9D58)' :
                                        star === 3 ? 'linear-gradient(90deg, #FBBC04, #F9AB00)' :
                                            'linear-gradient(90deg, #EA4335, #D93025)',
                                    transition: 'width 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
                                }} />
                            </div>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', width: '24px' }}>{count}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ───── Add/Edit Modal ───── */}
            {showForm && createPortal(
                <div
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(6px)',
                        padding: '2rem 1rem', overflowY: 'auto', overflowX: 'hidden',
                        WebkitOverflowScrolling: 'touch',
                        display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
                        animation: 'fadeIn 0.3s ease-out',
                    }}
                    onClick={resetForm}
                >
                    <div
                        style={{
                            width: '100%', maxWidth: '520px', backgroundColor: 'white', borderRadius: '20px',
                            boxShadow: '0 25px 60px -12px rgba(0,0,0,0.3)', margin: 'auto', flexShrink: 0,
                            animation: 'slideUp 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal header */}
                        <div style={{
                            padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            background: 'linear-gradient(135deg, #f8f9ff, #f0f4ff)',
                            borderRadius: '20px 20px 0 0',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '8px',
                                    background: 'linear-gradient(135deg, #4285F4, #34A853)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Star size={18} color="white" fill="white" />
                                </div>
                                <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                                    {editMode ? 'Edit Review' : 'Add New Review'}
                                </h2>
                            </div>
                            <button type="button" onClick={resetForm} style={{
                                background: 'none', border: 'none', cursor: 'pointer', padding: '0.35rem',
                                color: '#64748b', borderRadius: '8px', display: 'flex',
                                transition: 'all 0.2s'
                            }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fee2e2'; e.currentTarget.style.color = '#ef4444'; }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal body */}
                        <div style={{ padding: '2rem' }}>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {/* Reviewer Name */}
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
                                        <User size={14} /> Reviewer Name
                                    </label>
                                    <input
                                        type="text" value={reviewerName} onChange={e => setReviewerName(e.target.value)}
                                        placeholder="Enter reviewer's name" required
                                        style={{
                                            width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                                            border: '1.5px solid #e2e8f0', fontSize: '0.95rem',
                                            transition: 'all 0.2s', outline: 'none',
                                        }}
                                        onFocus={e => { e.currentTarget.style.borderColor = '#4285F4'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(66,133,244,0.1)'; }}
                                        onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                                    />
                                </div>

                                {/* Star Rating */}
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
                                        <Star size={14} /> Rating
                                    </label>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '1rem',
                                        padding: '0.75rem 1rem', borderRadius: '10px',
                                        backgroundColor: '#fefce8', border: '1.5px solid #fde68a'
                                    }}>
                                        {renderStars(rating, 28, true, setRating)}
                                        <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#92400e' }}>{rating}.0</span>
                                    </div>
                                </div>

                                {/* Review Text */}
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
                                        <MessageSquare size={14} /> Review Text
                                    </label>
                                    <textarea
                                        value={reviewText} onChange={e => setReviewText(e.target.value)}
                                        placeholder="Write the review content..."
                                        rows={4}
                                        style={{
                                            width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                                            border: '1.5px solid #e2e8f0', fontSize: '0.95rem', resize: 'vertical',
                                            transition: 'all 0.2s', outline: 'none', fontFamily: 'inherit',
                                        }}
                                        onFocus={e => { e.currentTarget.style.borderColor = '#4285F4'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(66,133,244,0.1)'; }}
                                        onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                                    />
                                </div>

                                {/* Social Media Link */}
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
                                        <Link2 size={14} /> Social Media Link
                                    </label>
                                    <input
                                        type="url" value={socialLink} onChange={e => setSocialLink(e.target.value)}
                                        placeholder="https://g.co/kgs/reviewer-profile"
                                        style={{
                                            width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                                            border: '1.5px solid #e2e8f0', fontSize: '0.95rem',
                                            transition: 'all 0.2s', outline: 'none',
                                        }}
                                        onFocus={e => { e.currentTarget.style.borderColor = '#4285F4'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(66,133,244,0.1)'; }}
                                        onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                                    />
                                </div>

                                {/* Buttons */}
                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                    <button type="submit" disabled={loading} style={{
                                        flex: 2, padding: '0.875rem',
                                        background: 'linear-gradient(135deg, #4285F4, #1a73e8)',
                                        color: 'white', border: 'none', borderRadius: '12px',
                                        fontWeight: '600', fontSize: '0.95rem',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        opacity: loading ? 0.7 : 1,
                                        boxShadow: '0 4px 14px rgba(66,133,244,0.3)',
                                        transition: 'all 0.3s',
                                    }}>
                                        {loading ? (editMode ? 'Saving...' : 'Adding...') : (editMode ? 'Save Changes' : 'Add Review')}
                                    </button>
                                    <button type="button" onClick={resetForm} style={{
                                        flex: 1, padding: '0.875rem',
                                        backgroundColor: '#f1f5f9', color: '#475569',
                                        border: '1px solid #e2e8f0', borderRadius: '12px',
                                        fontWeight: '600', cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* ───── Reviews Grid ───── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '1.25rem'
            }}>
                {reviews && reviews.length > 0 ? (
                    reviews.map((review: any, index: number) => {
                        const name = review.reviewerName || review.reviewer_name || 'Anonymous';
                        const text = review.reviewText || review.review_text || '';
                        const reviewSocialLink = review.socialLink || review.social_link || '';
                        const avatarColor = getAvatarColor(name);

                        return (
                            <div
                                key={review.id || index}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    border: '1px solid #e8ecf1',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                    display: 'flex', flexDirection: 'column',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`,
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)';
                                    e.currentTarget.style.borderColor = '#4285F4';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                                    e.currentTarget.style.borderColor = '#e8ecf1';
                                }}
                            >
                                {/* Card top: Google branding bar */}
                                <div style={{
                                    height: '4px',
                                    background: 'linear-gradient(90deg, #4285F4 25%, #EA4335 25%, #EA4335 50%, #FBBC04 50%, #FBBC04 75%, #34A853 75%)',
                                }} />

                                {/* Reviewer info */}
                                <div style={{ padding: '1.25rem 1.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                    {/* Avatar */}
                                    <div style={{
                                        width: '44px', height: '44px', borderRadius: '50%',
                                        backgroundColor: avatarColor, flexShrink: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.1rem', fontWeight: '700', color: 'white',
                                        boxShadow: `0 3px 8px ${avatarColor}40`,
                                    }}>
                                        {name.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h3 style={{
                                            fontSize: '1rem', fontWeight: '600', color: '#1a1a1a',
                                            margin: 0, lineHeight: 1.3,
                                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                        }}>
                                            {name}
                                        </h3>
                                        {reviewSocialLink && (
                                            <a
                                                href={reviewSocialLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    fontSize: '0.78rem', color: '#4285F4', textDecoration: 'none',
                                                    display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                                                    fontWeight: '500', transition: 'color 0.2s',
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.color = '#1a73e8'; e.currentTarget.style.textDecoration = 'underline'; }}
                                                onMouseLeave={e => { e.currentTarget.style.color = '#4285F4'; e.currentTarget.style.textDecoration = 'none'; }}
                                            >
                                                <ExternalLink size={11} /> View Profile
                                            </a>
                                        )}
                                    </div>
                                    {/* Google "G" icon */}
                                    <div style={{
                                        width: '28px', height: '28px', borderRadius: '6px',
                                        backgroundColor: '#f8f9fa', border: '1px solid #e8ecf1',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        <svg viewBox="0 0 24 24" width="16" height="16">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC04" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Stars */}
                                <div style={{ padding: '0 1.5rem 0.5rem' }}>
                                    {renderStars(review.rating || 0, 18)}
                                </div>

                                {/* Review text */}
                                <div style={{ padding: '0 1.5rem 1.25rem', flex: 1 }}>
                                    <p style={{
                                        color: '#374151', fontSize: '0.9375rem', lineHeight: 1.6,
                                        margin: 0, display: '-webkit-box',
                                        WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                    }}>
                                        {text || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No review text provided.</span>}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                                    padding: '0.75rem 1.25rem', borderTop: '1px solid #f1f5f9',
                                    gap: '0.5rem',
                                }}>
                                    <button
                                        onClick={() => handleEdit(review)}
                                        style={{
                                            padding: '0.4rem 0.85rem', border: '1px solid #e2e8f0',
                                            backgroundColor: '#f8fafc', color: '#475569', borderRadius: '8px',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center',
                                            gap: '0.3rem', fontSize: '0.8rem', fontWeight: '500',
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#eff6ff'; e.currentTarget.style.borderColor = '#93c5fd'; e.currentTarget.style.color = '#2563eb'; }}
                                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; }}
                                    >
                                        <Edit2 size={13} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(review)}
                                        style={{
                                            padding: '0.4rem 0.85rem', border: '1px solid #fecaca',
                                            backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: '8px',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center',
                                            gap: '0.3rem', fontSize: '0.8rem', fontWeight: '500',
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fee2e2'; e.currentTarget.style.borderColor = '#f87171'; }}
                                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fef2f2'; e.currentTarget.style.borderColor = '#fecaca'; }}
                                    >
                                        <Trash2 size={13} /> Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={{
                        gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center',
                        backgroundColor: '#f8fafc', borderRadius: '20px',
                        border: '2px dashed #cbd5e1',
                    }}>
                        <div style={{
                            width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 1.25rem',
                            background: 'linear-gradient(135deg, #4285F4, #34A853)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 8px 24px rgba(66,133,244,0.25)',
                        }}>
                            <Star size={32} color="white" fill="white" />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>
                            No reviews yet
                        </h3>
                        <p style={{ color: '#64748b', fontWeight: '400', maxWidth: '320px', margin: '0 auto' }}>
                            Add your first Google review to showcase customer feedback.
                        </p>
                    </div>
                )}
            </div>

            {/* Inline keyframe animations */}
            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px) scale(0.96); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(100px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};

export default GoogleReviews;
