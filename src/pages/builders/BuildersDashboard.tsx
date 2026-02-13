import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import type { AppDispatch, RootState } from '../../store/store';
import { Hammer, ChevronRight, LogOut, Lock } from 'lucide-react';

const BuildersDashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    const isAuthorized = isAuthenticated && user?.category === 'Builders';

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate('/login');
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Builders Website Management</h2>
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
                <Link to="/builders/upload-project" style={{ textDecoration: 'none' }}>
                    <div style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
                        {!isAuthorized && (
                            <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', backgroundColor: '#fef3c7', borderRadius: '4px', fontSize: '0.75rem', color: '#92400e', fontWeight: '500' }}>
                                <Lock size={12} />
                                Login Required
                            </div>
                        )}
                        <div style={{ padding: '0.75rem', backgroundColor: '#ffedd5', borderRadius: '50%' }}>
                            <Hammer size={24} color="#ea580c" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>Upload New Project</h3>
                            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Add completed or ongoing projects</p>
                        </div>
                        <ChevronRight size={20} color="#9ca3af" style={{ marginLeft: 'auto' }} />
                    </div>
                </Link>
                <Link to="/builders/upload-home-banners" style={{ textDecoration: 'none' }}>
                    <div style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
                        {!isAuthorized && (
                            <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', backgroundColor: '#fef3c7', borderRadius: '4px', fontSize: '0.75rem', color: '#92400e', fontWeight: '500' }}>
                                <Lock size={12} />
                                Login Required
                            </div>
                        )}
                        <div style={{ padding: '0.75rem', backgroundColor: '#dcfce7', borderRadius: '50%' }}>
                            <Hammer size={24} color="#166534" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>Upload Home Banners</h3>
                            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Add 5 images for home carousel</p>
                        </div>
                        <ChevronRight size={20} color="#9ca3af" />
                    </div>
                </Link>
            </div>
            <Outlet />
        </div>
    );
};

export default BuildersDashboard;
