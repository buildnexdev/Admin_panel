import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Camera, FolderOpen, School, Hammer, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import type { AppDispatch, RootState } from '../store/store';

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);

    const navItems = [
        { name: 'Console', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'School', path: '/school', icon: <School size={20} /> },
        { name: 'Photography', path: '/photography', icon: <Camera size={20} /> },
        { name: 'Builders', path: '/builders', icon: <Hammer size={20} /> },
    ];

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate('/login');
    };

    // Don't show sidebar/header on login page
    if (location.pathname === '/login') {
        return <Outlet />;
    }

    // Get initials for avatar
    const getUserInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* Sidebar */}
            <aside style={{
                width: '280px',
                backgroundColor: '#ffffff',
                borderRight: '1px solid #f1f5f9',
                padding: '2rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'sticky',
                top: 0,
                height: '100vh',
                zIndex: 10
            }}>
                <div style={{
                    marginBottom: '3rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: '#6366f1'
                }}>
                    <div style={{
                        padding: '0.5rem',
                        backgroundColor: '#6366f1',
                        color: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
                    }}>
                        <FolderOpen size={24} />
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', letterSpacing: '-0.025em' }}>
                        Admin<span style={{ color: '#6366f1' }}>Flow</span>
                    </span>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', marginLeft: '0.5rem' }}>
                        Menu
                    </p>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.875rem 1rem',
                                    borderRadius: '12px',
                                    color: isActive ? '#6366f1' : '#64748b',
                                    backgroundColor: isActive ? '#f5f7ff' : 'transparent',
                                    textDecoration: 'none',
                                    whiteSpace: 'nowrap',
                                    fontWeight: isActive ? '700' : '500',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <span style={{ opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
                                <span>{item.name}</span>
                                {isActive && <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#6366f1' }} />}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.875rem 1rem',
                            borderRadius: '12px',
                            color: '#ef4444',
                            backgroundColor: 'white',
                            border: '1px solid #fee2e2',
                            width: '100%',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Global Header */}
                <header style={{
                    height: '80px',
                    backgroundColor: 'white',
                    borderBottom: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 2.5rem',
                    position: 'sticky',
                    top: 0,
                    zIndex: 9
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', margin: 0, letterSpacing: '-0.025em' }}>
                            {user?.category ? `${user.category} Group` : 'Standard Admin'}
                        </h2>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '700', color: '#1e293b' }}>{user?.name || 'Admin User'}</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{user?.role || 'Administrator'}</p>
                        </div>
                        <div style={{
                            width: '45px',
                            height: '45px',
                            backgroundColor: '#6366f1',
                            borderRadius: '14px',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: '1rem',
                            boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)'
                        }}>
                            {user ? getUserInitials(user.name) : 'A'}
                        </div>
                    </div>
                </header>

                <main style={{ padding: '2.5rem', overflowY: 'auto', flex: 1 }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
