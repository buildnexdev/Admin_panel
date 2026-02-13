import { useState, type FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginSchool } from '../../store/slices/schoolSlice';
import type { RootState, AppDispatch } from '../../store/store';
import { School, Eye, EyeOff } from 'lucide-react';

const SchoolLogin = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, error } = useSelector((state: RootState) => state.school);

    const from = (location.state as any)?.from?.pathname || '/school';

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const result = await dispatch(loginSchool({ phone, password })).unwrap();
            if (result) {
                navigate(from, { replace: true });
            }
        } catch (err) {
            console.error('School login failed:', err);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '2rem auto' }}>
            <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <School size={32} color="#3b82f6" />
                    <h2 style={{ textAlign: 'center', color: '#1f2937', margin: 0 }}>School Login</h2>
                </div>
                {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', padding: '0.75rem', backgroundColor: '#fee2e2', borderRadius: '4px' }}>{error}</div>}
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="tel"
                        placeholder="Phone Number (10 digits)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
                        pattern="[0-9]{10}"
                        maxLength={10}
                        required
                    />
                    <div style={{ position: 'relative' }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password (min 8 characters)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ padding: '0.75rem', paddingRight: '3rem', borderRadius: '4px', border: '1px solid #d1d5db', width: '100%', boxSizing: 'border-box' }}
                            minLength={8}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '0.75rem',
                            backgroundColor: loading ? '#93c5fd' : '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SchoolLogin;
