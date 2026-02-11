
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import type { AppDispatch } from '../store/store';
import { LayoutDashboard, Camera, FolderOpen, LogOut, ChevronRight, School, Hammer } from 'lucide-react';

const Layout = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'School', path: '/school', icon: <School size={20} /> },
        { name: 'Photography', path: '/photography', icon: <Camera size={20} /> },
        { name: 'Builders', path: '/builders', icon: <Hammer size={20} /> },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            {/* Sidebar */}
            <aside style={{ width: '250px', backgroundColor: '#1f2937', color: 'white', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FolderOpen size={28} />
                    <span>Admin Panel</span>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '6px',
                                    color: isActive ? 'white' : '#9ca3af',
                                    backgroundColor: isActive ? '#374151' : 'transparent',
                                    textDecoration: 'none',
                                    whiteSpace: 'nowrap',
                                    transition: 'background-color 0.2s, color 0.2s',
                                }}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                                {isActive && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
                            </Link>
                        );
                    })}
                </nav>

                <button
                    onClick={handleLogout}
                    style={{
                        marginTop: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        transition: 'color 0.2s',
                    }}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
