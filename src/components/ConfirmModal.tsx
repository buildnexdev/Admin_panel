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
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 10000,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                boxSizing: 'border-box',
            }}
            onClick={onCancel}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: '420px',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    padding: '1.5rem 1.5rem',
                    border: '1px solid #fecaca',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ color: '#f59e0b', flexShrink: 0 }}>
                        <AlertTriangle size={32} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#111827' }}>{title}</h3>
                        <p style={{ margin: '0.75rem 0 0', fontSize: '0.95rem', color: '#4b5563', lineHeight: 1.5 }}>{message}</p>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', justifyContent: 'flex-end' }}>
                            <button
                                type="button"
                                onClick={onCancel}
                                style={{
                                    padding: '0.6rem 1.25rem',
                                    backgroundColor: '#f3f4f6',
                                    color: '#374151',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '10px',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                style={{
                                    padding: '0.6rem 1.25rem',
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
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
