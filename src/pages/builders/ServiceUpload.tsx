import { useState, useEffect, type FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearMessages, fetchServices, deleteService } from '../../store/slices/buildersSlice';
import { contentCMSService } from '../../services/api';
import type { AppDispatch, RootState } from '../../store/store';
import { Settings, CheckCircle2, AlertCircle, Trash2, Calendar, Layout, Edit2 } from 'lucide-react';

const ServiceUpload = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { services } = useSelector((state: RootState) => state.builders);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [iconName, setIconName] = useState('Settings');
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (user?.companyID) {
            dispatch(fetchServices(user.companyID));
        }
    }, [dispatch, user?.companyID]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setIconName('Settings');
        setEditingId(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user?.companyID) return;

        setLoading(true);
        setMessage(null);

        try {
            if (editingId) {
                await contentCMSService.updateService(editingId, { title, description, iconName });
                setMessage({ type: 'success', text: 'Service updated successfully!' });
            } else {
                await contentCMSService.addService({ title, description, iconName, companyID: user.companyID });
                setMessage({ type: 'success', text: 'Service added successfully!' });
            }
            resetForm();
            dispatch(fetchServices(user.companyID));
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to process request' });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (service: any) => {
        setEditingId(service.id);
        setTitle(service.title);
        setDescription(service.description);
        setIconName(service.iconName || 'Settings');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Delete this service?') && user?.companyID) {
            dispatch(deleteService({ id, companyID: user.companyID }));
        }
    };

    return (
        <div style={{ width: '100%' }} className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: '2rem', alignItems: 'start' }}>

                {/* Add Service Section */}
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ padding: '0.625rem', backgroundColor: editingId ? '#eef2ff' : '#f0fdf4', color: editingId ? '#6366f1' : '#166534', borderRadius: '12px' }}>
                            {editingId ? <Edit2 size={24} /> : <Layout size={24} />}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                                {editingId ? 'Edit Service' : 'Add New Service'}
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '0.8125rem', margin: 0 }}>
                                {editingId ? 'Update your service offering' : 'Create a new service offering for your clients'}
                            </p>
                        </div>
                    </div>

                    {message && (
                        <div style={{ padding: '0.875rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2', color: message.type === 'success' ? '#166534' : '#991b1b', border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`, fontSize: '0.875rem' }}>
                            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            <span>{message.text}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#475569' }}>Service Title</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Interior Design" style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9375rem' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#475569' }}>Description</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} placeholder="Describe this service..." style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', resize: 'none', fontSize: '0.9375rem' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#475569' }}>Icon Theme</label>
                            <select value={iconName} onChange={(e) => setIconName(e.target.value)} style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: 'white', fontSize: '0.9375rem' }}>
                                <option value="Settings">General Settings</option>
                                <option value="Home">Residential / Home</option>
                                <option value="Building">Commercial / Building</option>
                                <option value="Hammer">Construction</option>
                                <option value="Palmtree">Landscaping</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    flex: 1, padding: '0.875rem', backgroundColor: loading ? '#94a3b8' : (editingId ? '#6366f1' : '#166534'),
                                    color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s'
                                }}
                            >
                                {loading ? 'Processing...' : (editingId ? 'Update Service' : 'Publish Service')}
                            </button>
                            {editingId && (
                                <button type="button" onClick={resetForm} style={{ padding: '0.875rem 1.5rem', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', fontWeight: '700' }}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* List Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Active Services</h2>
                        <div style={{ padding: '0.4rem 0.8rem', backgroundColor: '#f1f5f9', borderRadius: '20px', color: '#475569', fontSize: '0.75rem', fontWeight: '700' }}>
                            {services?.length || 0} Total
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                        {services && services.length > 0 ? (
                            services.map((service: any) => (
                                <div key={service.id} style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                        <div style={{ padding: '0.5rem', backgroundColor: '#f8fafc', color: '#6366f1', borderRadius: '10px' }}>
                                            <Settings size={20} />
                                        </div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>{service.title}</h3>
                                    </div>
                                    <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.5', margin: '0 0 1rem 0', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{service.description}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #f8fafc' }}>
                                        <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>{new Date(service.created_at).toLocaleDateString()}</div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => handleEdit(service)} style={{ color: '#6366f1', padding: '0.4rem', borderRadius: '8px', backgroundColor: '#f1f5f9', border: 'none', cursor: 'pointer' }}>
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(service.id)} style={{ color: '#ef4444', padding: '0.4rem', borderRadius: '8px', backgroundColor: '#fef2f2', border: 'none', cursor: 'pointer' }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                                <Settings size={40} style={{ margin: '0 auto 1rem', color: '#cbd5e1' }} />
                                <p style={{ color: '#64748b', fontWeight: '600' }}>No services published yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceUpload;
