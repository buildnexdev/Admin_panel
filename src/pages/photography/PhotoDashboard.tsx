import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import type { AppDispatch, RootState } from '../../store/store';
import { Image, ChevronRight, LogOut, Lock } from 'lucide-react';

const PhotoDashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    const isAuthorized = isAuthenticated && user?.category === 'Photography';

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate('/login');
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Photography Website Management</h2>
                {isAuthenticated && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Welcome, {user?.name || 'Admin'}</span>
                        <button
                            onClick={handleLogout}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.875rem'
                            }}
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <Link to="/photography/upload-gallery" style={{ textDecoration: 'none' }}>
                    <div style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
                        {!isAuthorized && (
                            <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', backgroundColor: '#fef3c7', borderRadius: '4px', fontSize: '0.75rem', color: '#92400e', fontWeight: '500' }}>
                                <Lock size={12} />
                                Login Required
                            </div>
                        )}
                        <div style={{ padding: '0.75rem', backgroundColor: '#f3e8ff', borderRadius: '50%' }}>
                            <Image size={24} color="#9333ea" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>Upload to Gallery</h3>
                            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Add new photos to portfolio</p>
                        </div>
                        <ChevronRight size={20} color="#9ca3af" style={{ marginLeft: 'auto' }} />
                    </div>
                </Link>
            </div>
            <Outlet />
        </div>
    );
};

export default PhotoDashboard;
