import { useState, useEffect, type FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser, clearAuthError } from '../../store/slices/authSlice';
import type { RootState, AppDispatch } from '../../store/store';
import { Lock, Eye, EyeOff, User, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import loginBg from '../../assets/login-bg.png';

const Login = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

    const from = (location.state as any)?.from?.pathname || '/';

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    useEffect(() => {
        dispatch(clearAuthError());
    }, [dispatch]);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(loginUser({ phone, password })).unwrap();
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            backgroundColor: '#ffffff', // Clean white background as requested
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
        }}>
            {/* Left Side: Visual/Brand - Always visible and responsive */}
            <div style={{
                flex: 1.2,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '4rem',
                color: 'white',
                background: `#0f172a url(${loginBg}) no-repeat center center`,
                backgroundSize: 'cover',
                overflow: 'hidden'
            }} className="login-side-visual">
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.7) 100%)',
                    zIndex: 1
                }} />
                
                <div style={{ position: 'relative', zIndex: 2, maxWidth: '500px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem', animation: 'fadeInDown 0.8s ease-out' }}>
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '0.75rem', borderRadius: '14px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <ShieldCheck size={32} color="white" />
                        </div>
                        <span style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.02em' }}>BuildnexDev</span>
                    </div>
                    
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.04em', animation: 'fadeInLeft 1s ease-out 0.2s both' }} className="visual-h1">
                        Empowering Your <span style={{ color: '#6366f1' }}>Digital Future.</span>
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.85)', marginBottom: '3rem', lineHeight: 1.6, animation: 'fadeInLeft 1s ease-out 0.4s both' }} className="visual-p">
                        Manage your enterprise, projects, and users with ease using the most advanced administration suite ever built.
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fadeInUp 1s ease-out 0.6s both' }} className="visual-features">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem', color: 'rgba(255,255,255,0.95)' }}>
                            <CheckCircle2 size={20} color="#6366f1" /> Fully Encrypted Data Transmission
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem', color: 'rgba(255,255,255,0.95)' }}>
                            <CheckCircle2 size={20} color="#6366f1" /> Advanced Analytics Dashboard
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem', color: 'rgba(255,255,255,0.95)' }}>
                            <CheckCircle2 size={20} color="#6366f1" /> Multi-Company Infrastructure
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form - seamless background, no card/box */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff', // Background matches the page for seamless look
                padding: '2rem'
            }} className="login-form-area">
                <div style={{ 
                    maxWidth: '420px', 
                    width: '100%', 
                    animation: 'fadeInScale 0.8s ease-out'
                }}>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '2.75rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.75rem', letterSpacing: '-0.04em', lineHeight: 1.2 }}>
                            Welcome Back
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
                            Please sign in to your BuildnexDev account.
                        </p>
                    </div>

                    {error && (
                        <div style={{
                            padding: '1rem',
                            backgroundColor: '#fef2f2',
                            color: '#ef4444',
                            borderRadius: '12px',
                            fontSize: '0.875rem',
                            marginBottom: '1.5rem',
                            border: '1px solid #fee2e2',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            animation: 'shake 0.4s ease-in-out'
                        }}>
                            <ShieldCheck size={18} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="staggered-item" style={{ animationDelay: '0.1s' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '800', color: '#475569', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Phone Number</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
                                    <User size={18} />
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Enter your 10-digit phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    style={{
                                        width: '100%',
                                        padding: '1.125rem 1.125rem 1.125rem 3.5rem',
                                        borderRadius: '14px',
                                        border: '2px solid #f1f5f9',
                                        backgroundColor: '#f8fafc',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'all 0.2s',
                                        boxSizing: 'border-box'
                                    }}
                                    className="login-input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="staggered-item" style={{ animationDelay: '0.2s' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '800', color: '#475569', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '1.125rem 3.5rem 1.125rem 3.5rem',
                                        borderRadius: '14px',
                                        border: '2px solid #f1f5f9',
                                        backgroundColor: '#f8fafc',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'all 0.2s',
                                        boxSizing: 'border-box'
                                    }}
                                    className="login-input"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '1.25rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: '#94a3b8',
                                        cursor: 'pointer',
                                        padding: 0,
                                        display: 'flex'
                                    }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '1.25rem',
                                backgroundColor: loading ? '#94a3b8' : '#0f172a',
                                color: 'white',
                                border: 'none',
                                borderRadius: '14px',
                                fontWeight: '800',
                                fontSize: '1.1rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                transition: 'all 0.3s',
                                boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.2)',
                                marginTop: '0.5rem',
                                animation: 'fadeInUp 0.8s ease-out 0.3s both',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}
                            className="login-btn"
                        >
                            {loading ? 'Processing...' : (
                                <>
                                    Sign In <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>
                    
                    <p style={{ marginTop: '3.5rem', textAlign: 'center', fontSize: '1rem', color: '#64748b', animation: 'fadeInUp 0.8s ease-out 0.4s both' }}>
                        New here? <a href="https://buildnexdev.co.in/" style={{ color: '#6366f1', fontWeight: '800', textDecoration: 'none' }}>Contact support for access</a>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.98) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInLeft {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .staggered-item {
                    animation: fadeInUp 0.6s ease-out both;
                }
                .login-input {
                    transition: all 0.3s !important;
                }
                .login-input:focus {
                    background-color: #ffffff !important;
                    border-color: #6366f1 !important;
                    box-shadow: 0 0 0 5px rgba(99, 102, 241, 0.1) !important;
                }
                .login-btn:hover:not(:disabled) {
                    background-color: #1e293b !important;
                    transform: translateY(-2px);
                    box-shadow: 0 15px 20px -5px rgba(15, 23, 42, 0.3) !important;
                }
                @media (max-width: 900px) {
                    .login-side-visual {
                        display: block !important;
                        flex: none !important;
                        min-height: 400px !important;
                        padding: 3rem 1.5rem !important;
                        text-align: center !important;
                    }
                    .login-side-visual .visual-h1 {
                        font-size: 2.5rem !important;
                    }
                    .login-side-visual .visual-features {
                        align-items: center !important;
                        max-width: 380px !important;
                        margin: 0 auto !important;
                        text-align: left !important;
                    }
                    .login-form-area {
                        padding: 3rem 1.5rem !important;
                        background-color: #ffffff !important;
                    }
                    div[style*="display: flex"] {
                        flex-direction: column !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Login;
