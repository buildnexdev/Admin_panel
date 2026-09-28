import { useState, useEffect, type FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser, clearAuthError } from '../../store/slices/authSlice';
import type { RootState, AppDispatch } from '../../store/store';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import BrandLogo from '../../components/BrandLogo';

const Login = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState({ phone: false, password: false });
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

    const from = (location.state as any)?.from?.pathname || '/';

    useEffect(() => {
        if (isAuthenticated) navigate(from, { replace: true });
    }, [isAuthenticated, navigate, from]);

    useEffect(() => {
        dispatch(clearAuthError());
    }, [dispatch]);

    const phoneError = touched.phone && phone.length !== 10 ? 'Enter a valid 10-digit mobile number' : '';
    const passwordError = touched.password && !password ? 'Password is required' : '';

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setTouched({ phone: true, password: true });
        if (phone.length !== 10 || !password) return;
        try {
            await dispatch(loginUser({ phone, password })).unwrap();
        } catch {
            /* error shown from store */
        }
    };

    return (
        <div className="lg">
            <div className="lg-shell">
                {/* Left brand panel */}
                <aside className="lg-left">
                    <div className="lg-left__brand">
                        <span className="lg-left__logo"><BrandLogo height={36} /></span>
                        <div>
                            <strong>BuildNexDev</strong>
                            <span>Admin Panel</span>
                        </div>
                    </div>

                    <div className="lg-left__art" aria-hidden>
                        <svg viewBox="0 0 420 360" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="lgSky" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#D1FAE5" />
                                    <stop offset="100%" stopColor="#A7F3D0" />
                                </linearGradient>
                                <linearGradient id="lgBuild" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#1B7A4E" />
                                    <stop offset="100%" stopColor="#0A2214" />
                                </linearGradient>
                            </defs>
                            <rect width="420" height="360" fill="url(#lgSky)" rx="24" />
                            <circle cx="340" cy="70" r="36" fill="#FDE68A" opacity="0.9" />
                            <circle cx="340" cy="70" r="28" fill="#FBBF24" />
                            <path d="M0 250 Q80 210 160 240 T320 230 T420 250 V360 H0 Z" fill="#6EE7B7" opacity="0.45" />
                            <path d="M0 280 Q100 240 200 270 T420 280 V360 H0 Z" fill="#34D399" opacity="0.35" />
                            <rect x="70" y="140" width="70" height="150" rx="6" fill="url(#lgBuild)" />
                            <rect x="155" y="100" width="90" height="190" rx="6" fill="url(#lgBuild)" />
                            <rect x="260" y="160" width="80" height="130" rx="6" fill="url(#lgBuild)" />
                            <g fill="#A7F3D0" opacity="0.85">
                                <rect x="82" y="158" width="14" height="14" rx="2" /><rect x="104" y="158" width="14" height="14" rx="2" />
                                <rect x="82" y="186" width="14" height="14" rx="2" /><rect x="104" y="186" width="14" height="14" rx="2" />
                                <rect x="82" y="214" width="14" height="14" rx="2" /><rect x="104" y="214" width="14" height="14" rx="2" />
                                <rect x="170" y="120" width="16" height="16" rx="2" /><rect x="198" y="120" width="16" height="16" rx="2" /><rect x="226" y="120" width="16" height="16" rx="2" />
                                <rect x="170" y="152" width="16" height="16" rx="2" /><rect x="198" y="152" width="16" height="16" rx="2" /><rect x="226" y="152" width="16" height="16" rx="2" />
                                <rect x="170" y="184" width="16" height="16" rx="2" /><rect x="198" y="184" width="16" height="16" rx="2" /><rect x="226" y="184" width="16" height="16" rx="2" />
                                <rect x="274" y="178" width="14" height="14" rx="2" /><rect x="298" y="178" width="14" height="14" rx="2" />
                                <rect x="274" y="206" width="14" height="14" rx="2" /><rect x="298" y="206" width="14" height="14" rx="2" />
                            </g>
                            <rect x="185" y="250" width="28" height="40" rx="3" fill="#0A2214" />
                            <circle cx="60" cy="90" r="8" fill="#fff" opacity="0.7" />
                            <circle cx="100" cy="60" r="5" fill="#fff" opacity="0.55" />
                            <circle cx="390" cy="140" r="6" fill="#fff" opacity="0.5" />
                        </svg>
                    </div>

                    <p className="lg-left__foot">© {new Date().getFullYear()} BuildNexDev</p>
                </aside>

                {/* Wave divider */}
                <div className="lg-wave" aria-hidden>
                    <svg viewBox="0 0 80 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0 C28 90 52 150 40 250 C28 350 55 430 40 520 C30 560 20 580 0 600 L80 600 L80 0 Z" fill="#0F2E1C" />
                    </svg>
                </div>

                {/* Right form panel */}
                <main className="lg-right">
                    <div className="lg-form">
                        <h1>Login</h1>

                        {error && (
                            <div className="lg-alert" role="alert">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleLogin} noValidate>
                            <div className="lg-field">
                                <label htmlFor="login-phone">Phone</label>
                                <input
                                    id="login-phone"
                                    type="tel"
                                    inputMode="numeric"
                                    autoComplete="tel"
                                    placeholder="Enter your phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                                    aria-invalid={!!phoneError}
                                    className={phoneError ? 'has-error' : ''}
                                    autoFocus
                                />
                                {phoneError && <p className="lg-err">{phoneError}</p>}
                            </div>

                            <div className="lg-field">
                                <label htmlFor="login-password">Password</label>
                                <div className="lg-pw">
                                    <input
                                        id="login-password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                                        aria-invalid={!!passwordError}
                                        className={passwordError ? 'has-error' : ''}
                                    />
                                    <button
                                        type="button"
                                        className="lg-eye"
                                        onClick={() => setShowPassword((v) => !v)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {passwordError && <p className="lg-err">{passwordError}</p>}
                                <a
                                    className="lg-forgot"
                                    href="mailto:buildnexdev@gmail.com?subject=Password%20reset%20request"
                                >
                                    Forgot Password?
                                </a>
                            </div>

                            <button type="submit" className="lg-submit" disabled={loading}>
                                {loading ? (
                                    <><Loader2 size={18} className="lg-spin" /> Logging in…</>
                                ) : (
                                    'Login'
                                )}
                            </button>
                        </form>

                        <p className="lg-help">
                            Have a problem? Contact us at{' '}
                            <a href="mailto:buildnexdev@gmail.com">buildnexdev@gmail.com</a>
                        </p>
                    </div>
                </main>
            </div>

            <style>{`
                .lg {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1.5rem;
                    font-family: 'Inter', system-ui, sans-serif;
                    background: #0A2214;
                    background-image:
                        radial-gradient(ellipse at 20% 20%, rgba(27, 122, 78, 0.28), transparent 50%),
                        radial-gradient(ellipse at 80% 80%, rgba(110, 231, 183, 0.14), transparent 45%);
                }

                .lg-shell {
                    position: relative;
                    display: grid;
                    grid-template-columns: 1.05fr 0.95fr;
                    width: min(960px, 100%);
                    min-height: 560px;
                    border-radius: 18px;
                    overflow: hidden;
                    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
                    animation: lgIn 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) both;
                }

                /* Left — white brand panel */
                .lg-left {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    gap: 1.5rem;
                    padding: 1.75rem 2rem 1.4rem;
                    background: #fff;
                }
                .lg-left__brand {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .lg-left__logo {
                    width: 48px; height: 48px;
                    border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    background: #F0FDF4;
                    border: 1px solid #D1FAE5;
                    padding: 6px;
                }
                .lg-left__logo img { max-width: 100%; max-height: 100%; object-fit: contain; }
                .lg-left__brand strong {
                    display: block;
                    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
                    font-size: 1.05rem;
                    font-weight: 800;
                    color: #0A2214;
                    letter-spacing: -0.02em;
                }
                .lg-left__brand span {
                    font-size: 0.78rem;
                    color: #64748B;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                }
                .lg-left__art {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .lg-left__art svg {
                    width: 100%;
                    max-width: 380px;
                    height: auto;
                    border-radius: 16px;
                    animation: lgFloat 5s ease-in-out infinite;
                }
                .lg-left__foot {
                    margin: 0;
                    font-size: 0.75rem;
                    color: #94A3B8;
                }

                /* Wave */
                .lg-wave {
                    position: absolute;
                    top: 0; bottom: 0;
                    left: 48%;
                    width: 90px;
                    z-index: 2;
                    pointer-events: none;
                    transform: translateX(-40%);
                }
                .lg-wave svg { width: 100%; height: 100%; display: block; }

                /* Right — forest form panel */
                .lg-right {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2.5rem 2.75rem;
                    background: #0F2E1C;
                }
                .lg-form { width: 100%; max-width: 320px; }
                .lg-form h1 {
                    margin: 0 0 1.75rem;
                    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
                    font-size: 2.35rem;
                    font-weight: 700;
                    color: #fff;
                    letter-spacing: -0.02em;
                }

                .lg-alert {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.5rem;
                    padding: 0.7rem 0.85rem;
                    margin-bottom: 1.1rem;
                    border-radius: 10px;
                    background: rgba(254, 226, 226, 0.15);
                    border: 1px solid rgba(252, 165, 165, 0.4);
                    color: #FECACA;
                    font-size: 0.84rem;
                    line-height: 1.4;
                }

                .lg-field { margin-bottom: 1.15rem; }
                .lg-field label {
                    display: block;
                    margin-bottom: 0.45rem;
                    font-size: 0.88rem;
                    font-weight: 500;
                    color: #D1FAE5;
                }
                .lg-field input,
                .lg-pw input {
                    width: 100%;
                    height: 46px;
                    box-sizing: border-box;
                    padding: 0 1.25rem;
                    border: 1.5px solid rgba(110, 231, 183, 0.28);
                    border-radius: 999px;
                    background: rgba(10, 34, 20, 0.45);
                    color: #fff;
                    font-family: inherit;
                    font-size: 0.92rem;
                    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
                }
                .lg-pw input { padding-right: 2.75rem; }
                .lg-field input::placeholder,
                .lg-pw input::placeholder { color: #86A89A; }
                .lg-field input:focus,
                .lg-pw input:focus {
                    outline: none;
                    border-color: #6EE7B7;
                    background: rgba(10, 34, 20, 0.65);
                    box-shadow: 0 0 0 3px rgba(110, 231, 183, 0.22);
                }
                .lg-field input.has-error,
                .lg-pw input.has-error { border-color: #F87171; }

                .lg-pw { position: relative; }
                .lg-eye {
                    position: absolute;
                    right: 0.65rem;
                    top: 50%;
                    transform: translateY(-50%);
                    display: flex;
                    padding: 0.35rem;
                    border: none;
                    border-radius: 999px;
                    background: none;
                    color: #86A89A;
                    cursor: pointer;
                }
                .lg-eye:hover { color: #6EE7B7; }

                .lg-err { margin: 0.35rem 0 0; font-size: 0.78rem; color: #FCA5A5; }

                .lg-forgot {
                    display: block;
                    margin-top: 0.55rem;
                    text-align: right;
                    font-size: 0.82rem;
                    color: #6EE7B7;
                    text-decoration: underline;
                    text-underline-offset: 2px;
                }
                .lg-forgot:hover { color: #A7F3D0; }

                .lg-submit {
                    width: 100%;
                    height: 48px;
                    margin-top: 0.85rem;
                    border: none;
                    border-radius: 999px;
                    background: #1B7A4E;
                    color: #fff;
                    font-family: inherit;
                    font-size: 0.98rem;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: 0 10px 24px rgba(27, 122, 78, 0.35);
                    transition: transform 0.15s, background 0.15s, box-shadow 0.15s;
                }
                .lg-submit:hover:not(:disabled) {
                    background: #14603C;
                    transform: translateY(-1px);
                    box-shadow: 0 14px 28px rgba(27, 122, 78, 0.45);
                }
                .lg-submit:disabled { opacity: 0.75; cursor: wait; }
                .lg-spin { animation: lgSpin 0.8s linear infinite; }

                .lg-help {
                    margin: 2rem 0 0;
                    text-align: center;
                    font-size: 0.78rem;
                    color: #86A89A;
                    line-height: 1.5;
                }
                .lg-help a { color: #6EE7B7; text-decoration: underline; text-underline-offset: 2px; }

                @keyframes lgIn { from { opacity: 0; transform: translateY(18px) scale(0.98); } to { opacity: 1; transform: none; } }
                @keyframes lgFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
                @keyframes lgSpin { to { transform: rotate(360deg); } }

                @media (max-width: 820px) {
                    .lg-shell { grid-template-columns: 1fr; min-height: auto; }
                    .lg-left { display: none; }
                    .lg-wave { display: none; }
                    .lg-right { padding: 2.25rem 1.5rem; }
                    .lg-form h1 { font-size: 2rem; }
                }

                @media (prefers-reduced-motion: reduce) {
                    .lg-shell, .lg-left__art svg { animation: none; }
                }
            `}</style>
        </div>
    );
};
export default Login;
