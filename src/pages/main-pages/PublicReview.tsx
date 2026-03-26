import { useState } from 'react';
import axios from 'axios';
import { Star, MessageSquare, User, Link2, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { API_URL } from '../../services/api';

const PublicReview = () => {
    const [step, setStep] = useState(1);
    const [rating, setRating] = useState(5);
    const [reviewerName, setReviewerName] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [socialLink, setSocialLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    // Hardcoded for now based on user context (Admin Panel for Company ID 1)
    // In a real scenario, this would come from a URL param or token
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
                background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)', padding: '1.5rem'
            }}>
                <div style={{
                    width: '100%', maxWidth: '440px', backgroundColor: 'white', padding: '3rem 2rem',
                    borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', textAlign: 'center',
                    animation: 'scaleIn 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
                }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#ecfdf5',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
                    }}>
                        <CheckCircle2 size={44} color="#10b981" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.75rem' }}>
                        Thank You!
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                        Your feedback has been submitted successfully to BuildnexDev. We appreciate your support!
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid #e2e8f0',
                            backgroundColor: 'white', color: '#475569', fontWeight: '600', cursor: 'pointer'
                        }}
                    >
                        Submit Another Review
                    </button>
                </div>
                <style>{`
                    @keyframes scaleIn {
                        from { opacity: 0; transform: scale(0.9); }
                        to { opacity: 1; transform: scale(1); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)', padding: '1.5rem',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Background pattern */}
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none',
                opacity: 0.1, backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px'
            }} />

            <div style={{
                width: '100%', maxWidth: '480px', backgroundColor: 'white', borderRadius: '28px',
                boxShadow: '0 30px 60px rgba(0,0,0,0.3)', overflow: 'hidden', zIndex: 1,
                animation: 'slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
            }}>
                {/* Header Section */}
                <div style={{
                    padding: '2.5rem 2rem', background: 'linear-gradient(135deg, #4285F4, #34A853)',
                    color: 'white', position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: '-20%', right: '-10%', opacity: 0.1 }}>
                        <Sparkles size={160} />
                    </div>
                    <div style={{
                        width: '48px', height: '48px', backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '1rem', backdropFilter: 'blur(8px)'
                    }}>
                        <Star size={24} fill="white" color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0, letterSpacing: '-0.03em' }}>
                        BuildnexDev
                    </h1>
                    <p style={{ opacity: 0.9, fontSize: '0.95rem', marginTop: '0.4rem', fontWeight: '500' }}>
                        Share your experience with our services
                    </p>
                </div>

                {/* Form Section */}
                <div style={{ padding: '2rem' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Step Indicator */}
                        <div style={{ display: 'flex', gap: '4px', marginBottom: '0.5rem' }}>
                            <div style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: step >= 1 ? '#4285F4' : '#e2e8f0' }} />
                            <div style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: step >= 2 ? '#4285F4' : '#e2e8f0' }} />
                        </div>

                        {step === 1 ? (
                            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    How would you rate us?
                                </h2>
                                <div style={{
                                    display: 'flex', justifyContent: 'center', gap: '8px', padding: '1.5rem 0',
                                    backgroundColor: '#f8fafc', borderRadius: '20px', marginBottom: '1.5rem'
                                }}>
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s} type="button" onClick={() => setRating(s)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }}
                                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                        >
                                            <Star
                                                size={40}
                                                fill={s <= rating ? '#FBBC04' : 'none'}
                                                color={s <= rating ? '#FBBC04' : '#cbd5e1'}
                                                strokeWidth={1.5}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    style={{
                                        width: '100%', padding: '1rem', borderRadius: '14px', border: 'none',
                                        background: 'linear-gradient(135deg, #4285F4, #1a73e8)',
                                        color: 'white', fontWeight: '700', fontSize: '1rem', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                        boxShadow: '0 8px 16px rgba(66,133,244,0.3)'
                                    }}
                                >
                                    Continue <ChevronRight size={18} />
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fadeIn 0.3s ease-out' }}>
                                {/* Name */}
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
                                        <User size={14} /> Full Name
                                    </label>
                                    <input
                                        type="text" value={reviewerName} onChange={e => setReviewerName(e.target.value)}
                                        placeholder="e.g. John Doe" required
                                        style={{
                                            width: '100%', padding: '0.875rem 1rem', borderRadius: '12px',
                                            border: '1.5px solid #e2e8f0', fontSize: '1rem', backgroundColor: '#fcfdfe',
                                            transition: 'all 0.2s', outline: 'none'
                                        }}
                                    />
                                </div>

                                {/* Review Text */}
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
                                        <MessageSquare size={14} /> Your Feedback
                                    </label>
                                    <textarea
                                        value={reviewText} onChange={e => setReviewText(e.target.value)}
                                        placeholder="Tell us what you liked about our work..." required rows={4}
                                        style={{
                                            width: '100%', padding: '0.875rem 1rem', borderRadius: '12px',
                                            border: '1.5px solid #e2e8f0', fontSize: '1rem', backgroundColor: '#fcfdfe',
                                            resize: 'none', transition: 'all 0.2s', outline: 'none', fontFamily: 'inherit'
                                        }}
                                    />
                                </div>

                                {/* Social Link */}
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
                                        <Link2 size={14} /> Social Link (Optional)
                                    </label>
                                    <input
                                        type="url" value={socialLink} onChange={e => setSocialLink(e.target.value)}
                                        placeholder="LinkedIn, Instagram or Portfolio URL"
                                        style={{
                                            width: '100%', padding: '0.875rem 1rem', borderRadius: '12px',
                                            border: '1.5px solid #e2e8f0', fontSize: '1rem', backgroundColor: '#fcfdfe',
                                            transition: 'all 0.2s', outline: 'none'
                                        }}
                                    />
                                </div>

                                {error && (
                                    <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem', border: '1px solid #fee2e2' }}>
                                        {error}
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                    <button
                                        type="button" onClick={() => setStep(1)}
                                        style={{ flex: 1, padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#64748b', fontWeight: '600', cursor: 'pointer' }}
                                    >Back</button>
                                    <button
                                        type="submit" disabled={loading}
                                        style={{
                                            flex: 2, padding: '1rem', borderRadius: '14px', border: 'none',
                                            background: 'linear-gradient(135deg, #4285F4, #1a73e8)',
                                            color: 'white', fontWeight: '700', fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                                            boxShadow: '0 8px 16px rgba(66,133,244,0.3)', opacity: loading ? 0.8 : 1
                                        }}
                                    >
                                        {loading ? 'Submitting...' : 'Post Review'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer Attribution */}
                <div style={{ padding: '1.25rem', textAlign: 'center', backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0, fontWeight: '500' }}>
                        Powered by BuildnexDev Engineering
                    </p>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default PublicReview;
