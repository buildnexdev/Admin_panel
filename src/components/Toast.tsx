import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import type { RootState } from '../store/store';
import { clearMessages } from '../store/slices/buildersSlice';
import { clearAuthError } from '../store/slices/authSlice';
import { clearQuotationMessages } from '../store/slices/quotationSlice';

const Toast = () => {
    const dispatch = useDispatch();
    const { successMessage: buildersSuccess, error: buildersError } = useSelector((state: RootState) => state.builders);
    const { error: authError } = useSelector((state: RootState) => state.auth);
    const { error: menuError } = useSelector((state: RootState) => state.menu);
    const { successMessage: quotationSuccess, error: quotationError } = useSelector((state: RootState) => state.quotation);

    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'success' | 'error'>('success');

    useEffect(() => {
        const msg = buildersSuccess || quotationSuccess || buildersError || quotationError || authError || menuError;
        if (msg) {
            setMessage(msg);
            setType(buildersSuccess || quotationSuccess ? 'success' : 'error');
            setIsVisible(true);
        }
    }, [buildersSuccess, quotationSuccess, buildersError, quotationError, authError, menuError]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            dispatch(clearMessages());
            dispatch(clearAuthError());
            dispatch(clearQuotationMessages());
        }, 200);
    };

    if (!isVisible) return null;

    const modal = (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 10001,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                boxSizing: 'border-box',
            }}
            onClick={handleClose}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    padding: '1.5rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    border: `1px solid ${type === 'success' ? '#d1fae5' : '#fecaca'}`,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ color: type === 'success' ? '#10b981' : '#ef4444' }}>
                    {type === 'success' ? <CheckCircle size={48} /> : <XCircle size={48} />}
                </div>
                <div style={{ fontWeight: '700', color: '#111827', fontSize: '1.125rem' }}>
                    {type === 'success' ? 'Success' : 'Error'}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.95rem', textAlign: 'center' }}>
                    {message}
                </div>
                <button
                    type="button"
                    onClick={handleClose}
                    style={{
                        marginTop: '0.5rem',
                        padding: '0.6rem 1.5rem',
                        backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                    }}
                >
                    OK
                </button>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
};

export default Toast;
