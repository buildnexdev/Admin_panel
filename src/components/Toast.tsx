import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createPortal } from 'react-dom';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import type { RootState } from '../store/store';
import { clearMessages } from '../store/slices/buildersSlice';
import { clearAuthError } from '../store/slices/authSlice';
import { clearQuotationMessages } from '../store/slices/quotationSlice';
import { clearSrsMessages } from '../store/slices/srsImagesSlice';

const AUTO_DISMISS_MS = 5000;

const Toast = () => {
    const dispatch = useDispatch();
    const { successMessage: buildersSuccess, error: buildersError } = useSelector((state: RootState) => state.builders);
    const { error: authError } = useSelector((state: RootState) => state.auth);
    const { error: menuError } = useSelector((state: RootState) => state.menu);
    const { successMessage: quotationSuccess, error: quotationError } = useSelector((state: RootState) => state.quotation);
    const { successMessage: srsSuccess, error: srsError } = useSelector((state: RootState) => state.srsImages);

    const [isVisible, setIsVisible] = useState(false);
    const [closing, setClosing] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'success' | 'error'>('success');
    const timer = useRef<number | undefined>(undefined);

    const handleClose = useCallback(() => {
        window.clearTimeout(timer.current);
        setClosing(true);
        window.setTimeout(() => {
            setIsVisible(false);
            setClosing(false);
            dispatch(clearMessages());
            dispatch(clearAuthError());
            dispatch(clearQuotationMessages());
            dispatch(clearSrsMessages());
        }, 250);
    }, [dispatch]);

    useEffect(() => {
        const msg = buildersSuccess || quotationSuccess || srsSuccess || buildersError || quotationError || srsError || authError || menuError;
        if (!msg) return;
        setMessage(msg);
        setType(buildersSuccess || quotationSuccess || srsSuccess ? 'success' : 'error');
        setIsVisible(true);
        setClosing(false);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(handleClose, AUTO_DISMISS_MS);
        return () => window.clearTimeout(timer.current);
    }, [buildersSuccess, quotationSuccess, srsSuccess, buildersError, quotationError, srsError, authError, menuError, handleClose]);

    if (!isVisible) return null;

    const isSuccess = type === 'success';

    const toast = (
        <div className={`bnx-toast-wrap${closing ? ' bnx-toast-wrap--out' : ''}`} role="status" aria-live="polite">
            <div className={`bnx-toast bnx-toast--${isSuccess ? 'success' : 'error'}`}>
                <span className="bnx-toast__bar" />
                <span className="bnx-toast__icon">
                    {isSuccess ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                </span>
                <div className="bnx-toast__body">
                    <strong>{isSuccess ? 'Success' : 'Something went wrong'}</strong>
                    <p>{message}</p>
                </div>
                <button type="button" className="bnx-toast__close" onClick={handleClose} aria-label="Dismiss notification">
                    <X size={15} />
                </button>
                <span className="bnx-toast__progress" />
            </div>

            <style>{`
                .bnx-toast-wrap {
                    position: fixed;
                    top: 1rem;
                    right: 1rem;
                    z-index: 10001;
                    max-width: min(400px, calc(100vw - 2rem));
                    animation: bnxToastIn 0.35s cubic-bezier(0.34, 1.4, 0.64, 1) both;
                }
                .bnx-toast-wrap--out { animation: bnxToastOut 0.25s ease both; }
                .bnx-toast {
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                    padding: 0.9rem 1rem 0.9rem 1.2rem;
                    border-radius: var(--radius-lg);
                    background: var(--surface);
                    border: 1px solid var(--border);
                    box-shadow: 0 18px 40px rgba(22, 24, 43, 0.16);
                }
                .bnx-toast__bar {
                    position: absolute;
                    left: 0; top: 0; bottom: 0;
                    width: 5px;
                }
                .bnx-toast--success .bnx-toast__bar { background: var(--gradient-forest); }
                .bnx-toast--error .bnx-toast__bar { background: var(--gradient-sunset); }
                .bnx-toast__icon {
                    flex-shrink: 0;
                    width: 34px; height: 34px;
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    color: #fff;
                }
                .bnx-toast--success .bnx-toast__icon { background: var(--gradient-forest); }
                .bnx-toast--error .bnx-toast__icon { background: var(--gradient-sunset); }
                .bnx-toast__body { flex: 1; min-width: 0; }
                .bnx-toast__body strong {
                    display: block;
                    font-family: var(--font-display);
                    font-size: 0.92rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 0.15rem;
                }
                .bnx-toast__body p {
                    margin: 0;
                    font-size: 0.85rem;
                    line-height: 1.45;
                    color: var(--text-secondary);
                    word-break: break-word;
                }
                .bnx-toast__close {
                    flex-shrink: 0;
                    background: var(--surface-secondary);
                    border: none;
                    border-radius: 7px;
                    padding: 0.3rem;
                    color: var(--text-muted);
                    cursor: pointer;
                    display: flex;
                    transition: background 0.18s, color 0.18s;
                }
                .bnx-toast__close:hover { background: var(--border); color: var(--text-primary); }
                .bnx-toast__progress {
                    position: absolute;
                    left: 0; bottom: 0;
                    height: 3px;
                    width: 100%;
                    transform-origin: left;
                    animation: bnxToastProgress ${AUTO_DISMISS_MS}ms linear forwards;
                }
                .bnx-toast--success .bnx-toast__progress { background: var(--gradient-forest); }
                .bnx-toast--error .bnx-toast__progress { background: var(--gradient-sunset); }

                @keyframes bnxToastIn {
                    from { opacity: 0; transform: translateX(28px) scale(0.96); }
                    to { opacity: 1; transform: translateX(0) scale(1); }
                }
                @keyframes bnxToastOut {
                    to { opacity: 0; transform: translateX(28px) scale(0.96); }
                }
                @keyframes bnxToastProgress {
                    from { transform: scaleX(1); }
                    to { transform: scaleX(0); }
                }
                @media (max-width: 520px) {
                    .bnx-toast-wrap { left: 0.75rem; right: 0.75rem; max-width: none; }
                }
            `}</style>
        </div>
    );

    return createPortal(toast, document.body);
};

export default Toast;
