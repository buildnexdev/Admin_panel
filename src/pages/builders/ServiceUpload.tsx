import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServices, deleteService } from '../../store/slices/buildersSlice';
import type { AppDispatch, RootState } from '../../store/store';
import { Briefcase, PenTool, Layout, Droplet, Monitor, Home, Edit, Trash2, Plus } from 'lucide-react';

const ServiceUpload = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { services } = useSelector((state: RootState) => state.builders);

    useEffect(() => {
        if (user?.companyID) {
            dispatch(fetchServices(user.companyID));
        }
    }, [dispatch, user?.companyID]);

    const handleDelete = async (id: number) => {
        if (window.confirm('Delete this service?') && user?.companyID) {
            dispatch(deleteService({ id, companyID: user.companyID }));
        }
    };

    // Helper to render icon based on category or name
    const renderIcon = (serviceTitle: string, index: number) => {
        const title = serviceTitle.toLowerCase();
        if (title.includes('design')) return <PenTool size={24} color="#3b82f6" />;
        if (title.includes('management')) return <Layout size={24} color="#f97316" />;
        if (title.includes('plumb') || title.includes('water')) return <Droplet size={24} color="#06b6d4" />;
        if (title.includes('electric') || title.includes('tech')) return <Monitor size={24} color="#10b981" />;
        if (title.includes('interior') || title.includes('home')) return <Home size={24} color="#ec4899" />;
        return <Briefcase size={24} color="#8b5cf6" />;
    };

    const getIconBgColor = (serviceTitle: string, index: number) => {
        const title = serviceTitle.toLowerCase();
        if (title.includes('design')) return '#eff6ff';
        if (title.includes('management')) return '#fff7ed';
        if (title.includes('plumb') || title.includes('water')) return '#ecfeff';
        if (title.includes('electric') || title.includes('tech')) return '#d1fae5';
        if (title.includes('interior') || title.includes('home')) return '#fce7f3';
        return '#f3e8ff';
    };

    return (
        <div style={{ padding: '0 0.5rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
                        Services Management
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                        List of services you offer
                    </p>
                </div>
                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#0f172a',
                    color: 'white',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                }}>
                    <Plus size={18} /> Add Service
                </button>
            </div>

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.5rem'
            }}>
                {services && services.length > 0 ? (
                    services.map((service: any, index: number) => (
                        <div key={service.id} style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid #f1f5f9',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{
                                    backgroundColor: getIconBgColor(service.title, index),
                                    padding: '0.75rem',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {renderIcon(service.title, index)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                                        {service.title}
                                    </h3>
                                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>
                                        {/* Since actual category isn't consistently in the model, we show a general label based on title */}
                                        {service.category || (service.title.toLowerCase().includes('design') ? 'Design' : 'Construction')}
                                    </span>
                                </div>
                            </div>

                            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1, lineHeight: '1.5' }}>
                                {service.description}
                            </p>

                            <div style={{
                                display: 'flex',
                                gap: '0.5rem',
                                borderTop: '1px solid #f8fafc',
                                paddingTop: '1rem'
                            }}>
                                <button style={{
                                    flex: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem',
                                    backgroundColor: '#f8fafc',
                                    border: '1px solid #f1f5f9',
                                    borderRadius: '8px',
                                    color: '#475569',
                                    fontWeight: '500',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer'
                                }}>
                                    <Edit size={16} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: '0.5rem 1rem',
                                        backgroundColor: '#fef2f2',
                                        border: '1px solid #fee2e2',
                                        borderRadius: '8px',
                                        color: '#ef4444',
                                        cursor: 'pointer'
                                    }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                        <p style={{ color: '#64748b', fontWeight: '500' }}>No services published yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceUpload;
