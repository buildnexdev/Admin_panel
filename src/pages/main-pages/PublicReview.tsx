import { useState } from 'react';
import axios from 'axios';
import { Star, MessageSquare, User, Link2, CheckCircle2, ChevronRight } from 'lucide-react';
import { API_URL } from '../../services/api';
import BrandLogo, { BrandTagline, BrandWordmark } from '../../components/BrandLogo';

const PublicReview = () => {
    const [step, setStep] = useState(1);
    const [rating, setRating] = useState(5);
    const [reviewerName, setReviewerName] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [socialLink, setSocialLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const companyID = 1;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post(`${API_URL}content/reviews`, {
                reviewerName,
                rating,
                reviewText,
                socialLink,
                companyID,
            });
            setSubmitted(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(160deg, var(--background) 0%, #E8EEF7 100%)', padding: '1.5rem',
                fontFamily: "'DM Sans', system-ui, sans-serif"
            }}>
                <div style={{
                    width: '100%', maxWidth: '440px', backgroundColor: 'white', padding: '2.5rem 2rem',
                    borderRadius: '16px', boxShadow: '0 12px 40px rgba(22, 24, 43,0.1)', textAlign: 'center',
                    border: '1px solid var(--border)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                        <BrandLogo height={52} showWordmark />
                    </div>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#ecfdf5',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem',
                        border: '1px solid #A7F3D0'
                    }}>
                        <CheckCircle2 size={36} color="var(--success)" />
                    </div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.65rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Thank You!
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                        Your feedback has been submitted successfully to BuildNexDev. We appreciate your support!
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-primary"
                        style={{ width: '100%' }}
                    >
                        Submit Another Review
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(145deg, #071526 0%, var(--text-primary) 45%, #132F52 100%)',
            padding: '1.5rem',
            fontFamily: "'DM Sans', system-ui, sans-serif"
        }}>
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none',
                opacity: 0.08,
                backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
                backgroundSize: '28px 28px'
            }} />

            <div style={{
                width: '100%', maxWidth: '480px', backgroundColor: 'white', borderRadius: '16px',
                boxShadow: '0 24px 48px rgba(0,0,0,0.35)', overflow: 'hidden', zIndex: 1,
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{
                    padding: '1.75rem 1.75rem 1.35rem',
                    background: 'linear-gradient(180deg, #fff 0%, var(--background) 100%)',
                    borderBottom: '1px solid var(--border)',
                    textAlign: 'center'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                        <BrandLogo height={56} showWordmark />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.85rem' }}>
                        <div style={{ maxWidth: 220, width: '100%' }}>
                            <BrandTagline />
                        </div>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.925rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        Share your experience with our services
                    </p>
                </div>

                <div style={{ padding: '1.75rem' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <div style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: step >= 1 ? 'var(--primary)' : 'var(--border)' }} />
                            <div style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: step >= 2 ? 'var(--primary)' : 'var(--border)' }} />
                        </div>

                        {step === 1 ? (
                            <div>
                                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.1rem' }}>
                                    How would you rate us?
                                </h2>
                                <div style={{
                                    display: 'flex', justifyContent: 'center', gap: '8px', padding: '1.35rem 0',
                                    backgroundColor: 'var(--background)', borderRadius: '12px', marginBottom: '1.35rem',
                                    border: '1px solid var(--border)'
                                }}>
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s} type="button" onClick={() => setRating(s)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                        >
                                            <Star
                                                size={38}
                                                fill={s <= rating ? '#F59E0B' : 'none'}
                                                color={s <= rating ? '#F59E0B' : 'var(--border-strong)'}
                                                strokeWidth={1.5}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    style={{
                                        width: '100%', padding: '0.95rem', borderRadius: '10px', border: 'none',
                                        background: 'var(--text-primary)',
                                        color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                        fontFamily: 'inherit'
                                    }}
                                >
                                    Continue <ChevronRight size={18} />
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                                <div>
                                    <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <User size={14} /> Full Name
                                    </label>
                                    <input
                                        type="text" value={reviewerName} onChange={e => setReviewerName(e.target.value)}
                                        placeholder="e.g. John Doe" required
                                        className="field-input"
                                    />
                                </div>
                                <div>
                                    <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <MessageSquare size={14} /> Your Feedback
                                    </label>
                                    <textarea
                                        value={reviewText} onChange={e => setReviewText(e.target.value)}
                                        placeholder="Tell us what you liked about our work..." required rows={4}
                                        className="field-textarea"
                                    />
                                </div>
                                <div>
                                    <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Link2 size={14} /> Social Link (Optional)
                                    </label>
                                    <input
                                        type="url" value={socialLink} onChange={e => setSocialLink(e.target.value)}
                                        placeholder="LinkedIn, Instagram or Portfolio URL"
                                        className="field-input"
                                    />
                                </div>

                                {error && (
                                    <div style={{ color: '#ef4444', backgroundColor: 'var(--danger-light)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem', border: '1px solid var(--danger-light)' }}>
                                        {error}
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                                    <button type="button" onClick={() => setStep(1)} className="btn-ghost" style={{ flex: 1, padding: '0.9rem' }}>
                                        Back
                                    </button>
                                    <button
                                        type="submit" disabled={loading}
                                        className="btn-primary"
                                        style={{ flex: 2, padding: '0.9rem', opacity: loading ? 0.8 : 1 }}
                                    >
                                        {loading ? 'Submitting...' : 'Post Review'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                <div style={{ padding: '1rem', textAlign: 'center', backgroundColor: 'var(--background)', borderTop: '1px solid var(--border)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0, fontWeight: 500 }}>
                        Powered by <BrandWordmark size="0.8rem" />
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PublicReview;
