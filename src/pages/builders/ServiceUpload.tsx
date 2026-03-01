import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServices, addService, updateService, clearMessages } from '../../store/slices/buildersSlice';
import type { AppDispatch, RootState } from '../../store/store';
import { Img_Url } from '../../services/api';
import { Layout, Plus, X } from 'lucide-react';

const ServiceUpload = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { services, loading, successMessage, error } = useSelector((state: RootState) => state.builders);
    const [showAddForm, setShowAddForm] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    useEffect(() => {
        dispatch(clearMessages());
    }, [dispatch]);

    useEffect(() => {
        if (user?.companyID) {
            dispatch(fetchServices(user.companyID));
        }
    }, [dispatch, user?.companyID]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        } else {
            setPhoto(null);
            setPhotoPreview(null);
        }
    };

    const handleAddService = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        const result = await dispatch(addService({ name: name.trim(), description: description.trim(), imageFile: photo }));
        if (addService.fulfilled.match(result)) {
            setName('');
            setDescription('');
            setPhoto(null);
            setPhotoPreview(null);
            setShowAddForm(false);
        }
    };

    const handleToggleActive = (id: number, currentActive: boolean) => {
        if (!user?.companyID) return;
        dispatch(updateService({ id, companyID: user.companyID, isActive: !currentActive }));
    };

    const getServiceImageUrl = (service: any) => {
        const path = service.imageUrl || service.image_url || service.image || service.imagePath || '';
        if (!path) return '';
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        return Img_Url + path;
    };

    const serviceCardRadius = 12;

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
                <button
                    onClick={() => setShowAddForm((v) => !v)}
                    style={{
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
                    }}
                >
                    <Plus size={18} /> Add Service
                </button>
            </div>

            {successMessage && (
                <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '8px', fontSize: '0.9rem' }}>
                    {successMessage}
                </div>
            )}
            {error && (
                <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontSize: '0.9rem' }}>
                    {error}
                </div>
            )}

            {showAddForm && (
                <form onSubmit={handleAddService} style={{
                    marginBottom: '2rem',
                    padding: '1.5rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>Add New Service</h2>
                        <button type="button" onClick={() => setShowAddForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#64748b' }}>
                            <X size={20} />
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '480px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.35rem' }}>Service name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Interior Design"
                                required
                                style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.95rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.35rem' }}>Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Brief description of the service"
                                rows={3}
                                style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.95rem', resize: 'vertical' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.35rem' }}>Photo</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                style={{ width: '100%', padding: '0.5rem', fontSize: '0.9rem' }}
                            />
                            {photoPreview && (
                                <img src={photoPreview} alt="Preview" style={{ marginTop: '0.5rem', maxWidth: '160px', maxHeight: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button type="submit" disabled={loading} style={{
                                padding: '0.6rem 1.25rem',
                                backgroundColor: '#0f172a',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '500',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1
                            }}>
                                {loading ? 'Adding...' : 'Add Service'}
                            </button>
                            <button type="button" onClick={() => setShowAddForm(false)} style={{
                                padding: '0.6rem 1.25rem',
                                backgroundColor: '#f1f5f9',
                                color: '#475569',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.5rem'
            }}>
                {services && services.length > 0 ? (
                    services.map((service: any) => {
                        const imageUrl = getServiceImageUrl(service);
                        return (
                        <div key={service.id} style={{
                            backgroundColor: 'white',
                            borderRadius: serviceCardRadius,
                            overflow: 'hidden',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.05)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            {/* Top: full-width image (same base URL as banners so image loads) */}
                            <div style={{ width: '100%', height: '200px', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt={service.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                        <Layout size={48} />
                                    </div>
                                )}
                            </div>

                            {/* Content: icon, title, description */}
                            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1E293B', margin: 0, lineHeight: 1.3 }}>
                                    {service.title}
                                </h3>
                                <p style={{ color: '#4A5568', fontSize: '0.9375rem', lineHeight: 1.55, margin: 0, flex: 1 }}>
                                    {service.description || 'No description.'}
                                </p>
                            </div>

                            {/* Active / Inactive */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1rem 1.5rem',
                                borderTop: '1px solid #f1f5f9'
                            }}>
                                <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>
                                    {(service.isActive ?? true) ? 'Active' : 'Inactive'}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleToggleActive(service.id, !!service.isActive)}
                                    disabled={loading}
                                    style={{
                                        width: '44px',
                                        height: '24px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        backgroundColor: (service.isActive ?? true) ? '#22c55e' : '#e2e8f0',
                                        position: 'relative',
                                        transition: 'background-color 0.2s'
                                    }}
                                    aria-label={(service.isActive ?? true) ? 'Set inactive' : 'Set active'}
                                >
                                    <span style={{
                                        position: 'absolute',
                                        top: '2px',
                                        left: (service.isActive ?? true) ? '22px' : '2px',
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        backgroundColor: 'white',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                                        transition: 'left 0.2s'
                                    }} />
                                </button>
                            </div>
                        </div>
                    ); })
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
