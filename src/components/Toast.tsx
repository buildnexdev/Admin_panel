import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle, XCircle, X } from 'lucide-react';
import type { RootState } from '../store/store';
import { clearMessages } from '../store/slices/buildersSlice';
import { clearAuthError } from '../store/slices/authSlice';

const Toast = () => {
    const dispatch = useDispatch();
    const { successMessage: buildersSuccess, error: buildersError } = useSelector((state: RootState) => state.builders);
    const { error: authError } = useSelector((state: RootState) => state.auth);
    const { error: menuError } = useSelector((state: RootState) => state.menu);

    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'success' | 'error'>('success');

    useEffect(() => {
        const msg = buildersSuccess || buildersError || authError || menuError;
        if (msg) {
            setMessage(msg);
            setType(buildersSuccess ? 'success' : 'error');
            setIsVisible(true);

            const timer = setTimeout(() => {
                handleClose();
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [buildersSuccess, buildersError, authError, menuError]);

    const handleClose = () => {
        setIsVisible(false);
        // Delay clearing the actual state to allow exit animation if any (though we're using basic visibility here)
        setTimeout(() => {
            dispatch(clearMessages());
            dispatch(clearAuthError());
            // menuSlice doesn't have a clearError yet, but we'll stick to builders/auth for now
        }, 300);
    };

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            backgroundColor: 'white',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            border: `1px solid ${type === 'success' ? '#def7ec' : '#fde2e2'}`,
            borderLeft: `5px solid ${type === 'success' ? '#10b981' : '#ef4444'}`,
            minWidth: '300px',
            maxWidth: '450px',
            animation: 'slideIn 0.3s ease-out'
        }}>
            <div style={{ color: type === 'success' ? '#10b981' : '#ef4444' }}>
                {type === 'success' ? <CheckCircle size={24} /> : <XCircle size={24} />}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: '#111827', fontSize: '0.95rem' }}>
                    {type === 'success' ? 'Success' : 'Error'}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.125rem' }}>
                    {message}
                </div>
            </div>
            <button
                onClick={handleClose}
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
                <X size={18} />
            </button>
            <style>
                {`
                    @keyframes slideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                `}
            </style>
        </div>
    );
};

export default Toast;
