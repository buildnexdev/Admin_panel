import { useState, useEffect, type FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser, setDemoAuth } from '../store/slices/authSlice';
import type { RootState, AppDispatch } from '../store/store';
import { Lock, Eye, EyeOff, User, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

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

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const result = await dispatch(loginUser({ phone, password })).unwrap();
            if (result) {
                navigate(from, { replace: true });
            }
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    const handleDemoLogin = () => {
        dispatch(setDemoAuth());
        navigate('/', { replace: true });
    };

    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div className="animate-fade-in" style={{
                maxWidth: '450px',
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '24px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                padding: '3rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative background element */}
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    opacity: 0.1,
                    zIndex: -1
                }} />

                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '64px',
                        height: '64px',
                        backgroundColor: '#6366f1',
                        borderRadius: '18px',
                        marginBottom: '1.5rem',
                        boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)'
                    }}>
                        <ShieldCheck size={32} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>
                        Welcome Back
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.975rem' }}>
                        Enter your credentials to access your dashboard
                    </p>
                </div>

                {error && (
                    <div className="animate-fade-in" style={{
                        color: '#ef4444',
                        marginBottom: '1.5rem',
                        textAlign: 'left',
                        padding: '1rem',
                        backgroundColor: '#fef2f2',
                        borderRadius: '12px',
                        border: '1px solid #fee2e2',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}>
                        <div style={{ minWidth: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginLeft: '0.25rem' }}>Phone Number</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                                <User size={20} />
                            </div>
                            <input
                                type="tel"
                                placeholder="0000000000"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                style={{
                                    padding: '0.875rem 1rem 0.875rem 3rem',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    width: '100%',
                                    fontSize: '1rem',
                                    backgroundColor: 'white',
                                    transition: 'all 0.2s'
                                }}
                                pattern="[0-9]{10}"
                                maxLength={10}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginLeft: '0.25rem' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                                <Lock size={20} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    padding: '0.875rem 3rem 0.875rem 3rem',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    width: '100%',
                                    fontSize: '1rem',
                                    backgroundColor: 'white',
                                    transition: 'all 0.2s'
                                }}
                                minLength={8}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#94a3b8',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '4px'
                                }}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '1rem',
                            backgroundColor: loading ? '#94a3b8' : '#6366f1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: '700',
                            fontSize: '1rem',
                            marginTop: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
                        }}
                    >
                        {loading ? 'Sign In...' : (
                            <>
                                Sign In <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0', gap: '1rem' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                    <span style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500' }}>OR</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                </div>

                <button
                    onClick={handleDemoLogin}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        backgroundColor: '#f8fafc',
                        color: '#6366f1',
                        border: '2px solid #6366f1',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontWeight: '700',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#6366f1';
                        e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                        e.currentTarget.style.color = '#6366f1';
                    }}
                >
                    <Zap size={20} /> Access Dashboard (Demo)
                </button>

                <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                    Authorized personnel only. All access is logged.
                </p>
            </div>
        </div>
    );
};

export default Login;
