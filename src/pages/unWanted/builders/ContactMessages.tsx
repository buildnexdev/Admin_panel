import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { contentCMSService } from '../../../services/api';
import type { RootState } from '../../../store/store';
import { Mail, RefreshCw, Clock, User, MessageSquare } from 'lucide-react';

interface ContactMessage {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
    isRead: boolean;
}

const ContactMessages = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchMessages = async () => {
        if (!user?.companyID) return;
        setLoading(true);
        try {
            const response = await contentCMSService.getContactMessages(user.companyID);
            if (response.success) {
                setMessages(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch messages', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [user?.companyID]);

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }} className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '12px' }}>
                        <Mail size={28} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Customer Inquiries</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>View and manage messages from your website contact form</p>
                    </div>
                </div>
                <button
                    onClick={fetchMessages}
                    disabled={loading}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.625rem 1rem',
                        backgroundColor: 'white',
                        border: '1px solid var(--border)',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        color: 'var(--text-secondary)'
                    }}
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {loading && messages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading messages...</div>
                ) : messages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'white', borderRadius: '24px', border: '1px solid var(--surface-secondary)', color: 'var(--text-muted)' }}>
                        <MessageSquare size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                        <p>No messages received yet.</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} style={{
                            backgroundColor: 'white',
                            padding: '1.5rem',
                            borderRadius: '20px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                            border: '1px solid var(--surface-secondary)',
                            display: 'grid',
                            gridTemplateColumns: '250px 1fr',
                            gap: '2rem'
                        }}>
                            <div style={{ borderRight: '1px solid var(--surface-secondary)', paddingRight: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                    <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--surface-secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <User size={16} color="var(--text-secondary)" />
                                    </div>
                                    <span style={{ fontWeight: '700', color: '#1e293b' }}>{msg.name}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                    <Mail size={16} />
                                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{msg.email}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                    <Clock size={16} />
                                    <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>{msg.subject || 'No Subject'}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: '1.6', margin: 0 }}>
                                    {msg.message}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ContactMessages;
