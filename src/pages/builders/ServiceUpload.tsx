import { useState, type FormEvent } from 'react';
import { useSelector } from 'react-redux';
import { contentCMSService } from '../../services/api';
import type { RootState } from '../../store/store';
import { Settings, CheckCircle2, AlertCircle } from 'lucide-react';

const ServiceUpload = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [iconName, setIconName] = useState('Settings');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user?.companyID) return;

        setLoading(true);
        setMessage(null);

        try {
            await contentCMSService.addService({
                title,
                description,
                iconName,
                companyID: user.companyID
            });
            setMessage({ type: 'success', text: 'Service added successfully!' });
            setTitle('');
            setDescription('');
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to add service' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto' }} className="animate-fade-in">
            <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 4px 25px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ padding: '0.75rem', backgroundColor: '#e0e7ff', color: '#6366f1', borderRadius: '12px' }}>
                        <Settings size={28} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Add Website Service</h2>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>Describe the services you offer to your clients</p>
                    </div>
                </div>

                {message && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
                        color: message.type === 'success' ? '#166534' : '#991b1b',
                        border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                    }}>
                        {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>{message.text}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#475569' }}>Service Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="e.g. Interior Design, Structural Engineering"
                            style={{ padding: '0.875rem', borderRadius: '12px', border: '1px solid #e2e8f0', width: '100%' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#475569' }}>Service Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={4}
                            placeholder="Briefly explain what this service entails..."
                            style={{ padding: '0.875rem', borderRadius: '12px', border: '1px solid #e2e8f0', width: '100%', resize: 'none' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#475569' }}>Preferred Icon Name</label>
                        <select
                            value={iconName}
                            onChange={(e) => setIconName(e.target.value)}
                            style={{ padding: '0.875rem', borderRadius: '12px', border: '1px solid #e2e8f0', width: '100%', backgroundColor: 'white' }}
                        >
                            <option value="Settings">General Settings</option>
                            <option value="Home">Home / Residential</option>
                            <option value="Building">Commercial Building</option>
                            <option value="Hammer">Construction</option>
                            <option value="Palmtree">Landscaping</option>
                        </select>
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
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
                        }}
                    >
                        {loading ? 'Adding Service...' : 'Publish Service'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ServiceUpload;
