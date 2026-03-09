import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServices, addService, updateService, deleteService, clearMessages } from '../../store/slices/buildersSlice';
import type { AppDispatch, RootState } from '../../store/store';
import { Img_Url, contentCMSService } from '../../services/api';
import { Layout, Plus, X, Edit2, Trash2 } from 'lucide-react';

const ServiceUpload = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { services, loading, successMessage, error } = useSelector((state: RootState) => state.builders);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editServiceId, setEditServiceId] = useState<number | null>(null);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    useEffect(() => {
        if (showAddForm) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => document.body.classList.remove('modal-open');
    }, [showAddForm]);

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
        if (!name.trim() || !user?.companyID) return;

        if (editMode && editServiceId) {
            const result = await dispatch(updateService({
                id: editServiceId,
                companyID: user.companyID,
                data: { name: name.trim(), description: description.trim() },
                imageFile: photo
            }) as any);
            if (updateService.fulfilled.match(result)) {
                resetForm();
            }
            return;
        }

        const result = await dispatch(addService({ name: name.trim(), description: description.trim(), imageFile: photo }));
        if (addService.fulfilled.match(result)) {
            resetForm();
        }
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setPhoto(null);
        setPhotoPreview(null);
        setShowAddForm(false);
        setEditMode(false);
        setEditServiceId(null);
    };

    const handleEditClick = (service: any) => {
        setEditMode(true);
        setEditServiceId(service.id);
        setName(service.title || service.name || '');
        setDescription(service.description || '');
        setPhotoPreview(getServiceImageUrl(service));
        setShowAddForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = (service: any) => {
        if (!user?.companyID) return;
        if (window.confirm(`Are you sure you want to delete service "${service.title || service.name}"?`)) {
            dispatch(deleteService({ id: service.id, companyID: user.companyID }));
        }
    };

    const handleToggleActive = (service: any) => {
        if (!user?.companyID) return;
        dispatch(updateService({
            id: service.id,
            companyID: user.companyID,
            data: { isActive: service.isActive ? 0 : 1 }
        }) as any);
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


            {/* Add/Edit Modal – portal so scroll works */}
            {showAddForm && createPortal(
                <div
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)',
                        padding: '2rem 1rem', overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch',
                        display: 'flex', justifyContent: 'center', alignItems: 'flex-start', boxSizing: 'border-box',
                    }}
                    onClick={resetForm}
                >
                    <div style={{ width: '100%', maxWidth: '600px', backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', margin: 'auto', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(to right, #f8fafc, #ffffff)' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>{editMode ? 'Edit Service' : 'Add New Service'}</h2>
                            <button type="button" onClick={resetForm} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#64748b' }}><X size={20} /></button>
                        </div>
                        <div style={{ padding: '2rem' }}>
                            <form onSubmit={handleAddService} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Service name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Interior Design"
                                        required
                                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '0.95rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Brief description of the service"
                                        rows={4}
                                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '0.95rem', resize: 'vertical' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Photo</label>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        {photoPreview && (
                                            <div style={{ width: '100px', height: '100px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0', flexShrink: 0 }}>
                                                <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            style={{ fontSize: '0.85rem', color: '#64748b' }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="submit" disabled={loading} style={{
                                        flex: 2,
                                        padding: '0.875rem',
                                        backgroundColor: '#0f172a',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontWeight: '600',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        opacity: loading ? 0.7 : 1
                                    }}>
                                        {loading ? (editMode ? 'Saving...' : 'Adding...') : (editMode ? 'Save Changes' : 'Add Service')}
                                    </button>
                                    <button type="button" onClick={resetForm} style={{
                                        flex: 1,
                                        padding: '0.875rem',
                                        backgroundColor: '#f1f5f9',
                                        color: '#475569',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>,
                document.body
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

                                {/* Active / Inactive / Edit / Delete */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '1rem 1.5rem',
                                    borderTop: '1px solid #f1f5f9'
                                }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => handleEditClick(service)}
                                            style={{ padding: '0.4rem 0.8rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#475569', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: '500' }}
                                        >
                                            <Edit2 size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(service)}
                                            style={{ padding: '0.4rem 0.8rem', border: '1px solid #fee2e2', backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: '500' }}
                                        >
                                            <Trash2 size={14} /> Trash
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => handleToggleActive(service)}
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
                            </div>
                        );
                    })
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
