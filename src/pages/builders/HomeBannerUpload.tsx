import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBanners, deleteBanner } from '../../store/slices/buildersSlice';
import { Img_Url } from '../../services/api';
import type { AppDispatch, RootState } from '../../store/store';
import { Plus, Edit, Trash2 } from 'lucide-react';

const HomeBannerUpload = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { banners } = useSelector((state: RootState) => state.builders);
    const { user } = useSelector((state: RootState) => state.auth);
    const companyID = user?.companyID;

    useEffect(() => {
        if (companyID) {
            dispatch(fetchBanners({ companyID, category: 'HomeBanner' }));
        }
    }, [dispatch, companyID]);

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this banner?') && companyID) {
            dispatch(deleteBanner({ id, companyID, category: 'HomeBanner' }));
        }
    };

    return (
        <div style={{ padding: '0 0.5rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
                        Banner Management
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                        Manage homepage sliding banners
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
                    <Plus size={18} /> Upload New Banner
                </button>
            </div>

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                gap: '1.5rem'
            }}>
                {banners && banners.length > 0 ? (
                    banners.map((banner: any, index: number) => (
                        <div key={banner.id} style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            border: '1px solid #f1f5f9',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <div style={{ height: '200px', position: 'relative' }}>
                                <img
                                    src={Img_Url + (banner.imageUrl || banner.image_url)}
                                    alt="Banner"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    left: '1rem',
                                    backgroundColor: '#22c55e',
                                    color: 'white',
                                    padding: '0.2rem 0.8rem',
                                    borderRadius: '16px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600'
                                }}>
                                    Active
                                </div>
                            </div>

                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem' }}>
                                    {banner.title || `Banner #${index + 1}`}
                                </h3>
                                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                    {banner.description || 'Homepage hero section banner image'}
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <span style={{ color: '#64748b', fontWeight: '500' }}>Status:</span>
                                        <span style={{ color: '#22c55e', fontWeight: '600' }}>Active</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <span style={{ color: '#64748b', fontWeight: '500' }}>Link:</span>
                                        <span style={{ color: '#3b82f6' }}>{banner.link || '/sale'}</span>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    borderTop: '1px solid #f8fafc',
                                    paddingTop: '1rem',
                                    marginTop: 'auto'
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
                                        onClick={() => handleDelete(banner.id)}
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
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                        <p style={{ color: '#64748b', fontWeight: '500' }}>No active banners found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomeBannerUpload;
