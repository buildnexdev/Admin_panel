import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
    open: boolean;
    title?: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal = ({ open, title = 'Confirm', message, confirmLabel = 'Delete', onConfirm, onCancel }: ConfirmModalProps) => {
    if (!open) return null;

    const handleConfirm = () => {
        onConfirm();
        onCancel();
    };

    const modal = (
        <div
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 10000,
                backgroundColor: 'rgba(22, 24, 43, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                boxSizing: 'border-box',
                backdropFilter: 'blur(4px)',
                animation: 'fadeIn 0.2s ease both',
            }}
            onClick={onCancel}
        >
            <div
                style={{
                    position: 'relative',
                    overflow: 'hidden',
                    width: '100%',
                    maxWidth: '420px',
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: '0 30px 60px -12px rgba(22, 24, 43, 0.35)',
                    padding: '1.5rem',
                    border: '1px solid var(--border)',
                    animation: 'popIn 0.28s var(--ease-spring) both',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <span style={{
                    position: 'absolute',
                    inset: '0 0 auto 0',
                    height: 4,
                    background: 'var(--gradient-sunset)',
                }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{
                        color: '#fff',
                        flexShrink: 0,
                        width: 44,
                        height: 44,
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--gradient-sunset)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 20px rgba(225, 29, 72, 0.3)',
                    }}>
                        <AlertTriangle size={22} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{
                            margin: 0,
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}>{title}</h3>
                        <p style={{ margin: '0.65rem 0 0', fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{message}</p>
                        <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1.25rem', justifyContent: 'flex-end' }}>
                            <button
                                type="button"
                                onClick={onCancel}
                                className="ui-btn ui-btn--secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                className="ui-btn"
                                style={{
                                    background: 'var(--gradient-sunset)',
                                    color: 'white',
                                    boxShadow: '0 10px 22px rgba(225, 29, 72, 0.28)',
                                }}
                            >
                                {confirmLabel}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
};

export default ConfirmModal;
