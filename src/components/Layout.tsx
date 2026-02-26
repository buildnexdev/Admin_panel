import { useEffect, useState, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutDashboard, Camera, FolderOpen, School, Hammer, LayoutGrid, Circle, Briefcase, Image as ImageIcon, BookOpen } from 'lucide-react';
import { logoutUser } from '../store/slices/authSlice';
import type { AppDispatch, RootState } from '../store/store';

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Sidebar items mapping with submenus
    const navItems = [
        {
            name: 'School',
            path: '/school',
            icon: <School size={20} />,
            category: 'School',
            subItems: [
                { name: 'Dashboard', path: '/school', icon: <LayoutGrid size={16} /> },
                { name: 'Content', path: '/school/upload-content', icon: <Circle size={8} /> },
                { name: 'Library', path: '/school/upload-image', icon: <Circle size={8} /> },
            ]
        },
        {
            name: 'Photography',
            path: '/photography',
            icon: <Camera size={20} />,
            category: 'Photography',
            subItems: [
                { name: 'Gallery', path: '/photography/upload-gallery', icon: <Circle size={8} /> },
            ]
        },
        {
            name: 'Builders',
            path: '/builders',
            icon: <Hammer size={20} />,
            category: 'Builders',
            subItems: [
                { name: 'Portfolio', path: '/builders/upload-project', icon: <Briefcase size={16} /> },
                { name: 'Banners', path: '/builders/upload-home-banners', icon: <ImageIcon size={16} /> },
                { name: 'Services', path: '/builders/services', icon: <Circle size={8} /> },
                { name: 'Blog', path: '/builders/blog', icon: <BookOpen size={16} /> },
            ]
        },
    ];

    const filteredNavItems = navItems.filter(item =>
        user?.role === "0" || user?.category === item.category
    );

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getUserInitials = (name: string) => {
        if (!name) return 'A';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                backgroundColor: '#ffffff',
                borderRight: '1px solid #f1f5f9',
                padding: '2rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'sticky',
                top: 0,
                height: '100vh',
                zIndex: 40,
                boxShadow: '4px 0 24px rgba(0,0,0,0.02)'
            }}>
                <Link to="/" style={{
                    marginBottom: '3rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: '#6366f1',
                    textDecoration: 'none'
                }}>
                    <div style={{
                        padding: '0.6rem',
                        backgroundColor: '#6366f1',
                        color: 'white',
                        borderRadius: '14px',
                        boxShadow: '0 8px 16px rgba(99, 102, 241, 0.25)'
                    }}>
                        <FolderOpen size={26} />
                    </div>
                    <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.03em' }}>
                        Admin<span style={{ color: '#6366f1' }}>Flow</span>
                    </span>
                </Link>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', marginLeft: '0.75rem' }}>
                        Management Modules
                    </p>
                    {filteredNavItems.map((item) => {
                        const isModuleActive = location.pathname.startsWith(item.path);

                        return (
                            <div key={item.path} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.85rem',
                                        padding: '0.875rem 1rem',
                                        borderRadius: '14px',
                                        color: isModuleActive ? '#6366f1' : '#475569',
                                        backgroundColor: isModuleActive ? '#f5f7ff' : 'transparent',
                                        fontWeight: isModuleActive ? '750' : '600',
                                        cursor: 'default',
                                        fontSize: '0.925rem'
                                    }}
                                >
                                    <span style={{ opacity: isModuleActive ? 1 : 0.6 }}>{item.icon}</span>
                                    <span>{item.name}</span>
                                </div>

                                {/* Submenu Items */}
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '6px',
                                    paddingLeft: '1.25rem',
                                    marginTop: '2px',
                                    borderLeft: '2px solid #f1f5f9',
                                    marginLeft: '1.9rem'
                                }}>
                                    {item.subItems.map((sub) => {
                                        const isSubActive = location.pathname === sub.path;
                                        return (
                                            <Link
                                                key={sub.path}
                                                to={sub.path}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.8rem',
                                                    padding: '0.65rem 1rem',
                                                    borderRadius: '10px',
                                                    color: isSubActive ? '#6366f1' : '#64748b',
                                                    backgroundColor: isSubActive ? '#f5f7ff' : 'transparent',
                                                    textDecoration: 'none',
                                                    fontSize: '0.85rem',
                                                    fontWeight: isSubActive ? '700' : '500',
                                                    transition: 'all 0.2s',
                                                }}
                                                onMouseEnter={(e) => !isSubActive && (e.currentTarget.style.backgroundColor = '#f8fafc')}
                                                onMouseLeave={(e) => !isSubActive && (e.currentTarget.style.backgroundColor = 'transparent')}
                                            >
                                                <span style={{ opacity: isSubActive ? 1 : 0.4 }}>{sub.icon}</span>
                                                <span>{sub.name}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </nav>
            </aside>

            {/* Content Wrapper */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                {/* Top Header */}
                <header style={{
                    height: '80px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 2.5rem',
                    zIndex: 30
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{
                            width: '44px',
                            height: '44px',
                            backgroundColor: '#f5f7ff',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#6366f1',
                            border: '1px solid #eef2ff'
                        }}>
                            {user?.category === 'Photography' ? <Camera size={24} /> :
                                user?.category === 'School' ? <School size={24} /> :
                                    <Hammer size={24} />}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1e293b', margin: 0, letterSpacing: '-0.02em' }}>
                                {user?.category || 'General'} <span style={{ color: '#6366f1' }}>Management</span>
                            </h2>
                            <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Personalized Dashboard
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ textAlign: 'right', display: 'none', '@media (min-width: 768px)': { display: 'block' } } as any}>
                            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', color: '#1e293b' }}>{user?.name || 'Administrator'}</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#6366f1', fontWeight: '700', textTransform: 'uppercase' }}>{user?.category || 'Super Admin'}</p>
                        </div>
                        <div style={{ position: 'relative' }} ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '16px',
                                    backgroundColor: '#6366f1',
                                    color: 'white',
                                    border: '3px solid #eef2ff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1rem',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)'
                                }}
                            >
                                {getUserInitials(user?.name || 'Admin')}
                            </button>

                            {isDropdownOpen && (
                                <div style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 12px)',
                                    right: 0,
                                    width: '220px',
                                    backgroundColor: 'white',
                                    borderRadius: '20px',
                                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                    border: '1px solid #f1f5f9',
                                    padding: '0.75rem',
                                    zIndex: 50
                                }}>
                                    <div style={{ padding: '0.75rem', borderBottom: '1px solid #f1f5f9', marginBottom: '0.5rem' }}>
                                        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '700', color: '#1e293b' }}>{user?.name}</p>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{user?.phoneNumber}</p>
                                    </div>
                                    <Link to="/settings" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', color: '#475569', textDecoration: 'none', fontSize: '0.875rem', borderRadius: '10px', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <Circle size={8} fill="#6366f1" /> Settings
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.75rem',
                                            color: '#ef4444',
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            fontSize: '0.875rem',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            fontWeight: '600'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <Circle size={8} fill="#ef4444" /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main style={{ flex: 1, overflowY: 'auto', padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1 }}>
                        <Outlet />
                    </div>

                    {/* Footer */}
                    <footer style={{
                        marginTop: '4rem',
                        padding: '2rem 0',
                        borderTop: '1px solid #f1f5f9',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: '#94a3b8',
                        fontSize: '0.875rem'
                    }}>
                        <div>
                            © 2026 AdminFlow Pro. All rights reserved.
                        </div>
                        <div style={{ display: 'flex', gap: '1.5rem', fontWeight: '600' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} /> System Status: Operational
                            </span>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
};

export default Layout;
