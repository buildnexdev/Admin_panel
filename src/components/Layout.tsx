import { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    Camera,
    School,
    Hammer,
    FolderOpen,
    LogOut,
    Settings,
    ChevronDown,
    LayoutGrid,
    Image as ImageIcon,
    Briefcase,
    BookOpen,
    Circle,
    HeartPulse
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
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

    if (location.pathname === '/login') {
        return <Outlet />;
    }

    const getUserInitials = (name: string) => {
        if (!name) return 'A';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
            {/* Sidebar */}
            <aside style={{
                width: '200px',
                backgroundColor: '#ffffff',
                borderRight: '1px solid #f1f5f9',
                padding: '2rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'sticky',
                top: 0,
                height: '100vh',
                zIndex: 10,
                overflowY: 'auto'
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
                </Link>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', marginLeft: '0.5rem' }}>
                        Management
                    </p>
                    {filteredNavItems.map((item) => {
                        const isModuleActive = location.pathname.startsWith(item.path);

                        return (
                            <div key={item.path} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '0.875rem 1rem',
                                        borderRadius: '12px',
                                        color: isModuleActive ? '#6366f1' : '#64748b',
                                        backgroundColor: isModuleActive ? '#f5f7ff' : 'transparent',
                                        fontWeight: isModuleActive ? '700' : '500',
                                        cursor: 'default',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <span style={{ opacity: isModuleActive ? 1 : 0.7 }}>{item.icon}</span>
                                    <span>{item.name}</span>
                                </div>

                                {/* Submenu Items */}
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px',
                                    paddingLeft: '1.25rem',
                                    marginTop: '4px',
                                    borderLeft: '2px solid #f1f5f9',
                                    marginLeft: '1.75rem'
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
                                                    gap: '0.75rem',
                                                    padding: '0.625rem 0.875rem',
                                                    borderRadius: '8px',
                                                    color: isSubActive ? '#6366f1' : '#64748b',
                                                    backgroundColor: isSubActive ? '#f5f7ff' : 'transparent',
                                                    textDecoration: 'none',
                                                    fontSize: '0.875rem',
                                                    fontWeight: isSubActive ? '600' : '500',
                                                    transition: 'all 0.2s',
                                                }}
                                                onMouseEnter={(e) => !isSubActive && (e.currentTarget.style.backgroundColor = '#f8fafc')}
                                                onMouseLeave={(e) => !isSubActive && (e.currentTarget.style.backgroundColor = 'transparent')}
                                            >
                                                <span style={{ opacity: isSubActive ? 1 : 0.5 }}>{sub.icon}</span>
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

            {/* Main Content Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
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

                    <div style={{ position: 'relative' }} ref={dropdownRef}>
                        <div
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                borderRadius: '12px',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '700', color: '#1e293b' }}>{user?.name || 'Admin User'}</p>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{user?.role === "0" ? 'Super Admin' : 'Administrator'}</p>
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
                            <ChevronDown size={16} color="#64748b" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        </div>

                        {isDropdownOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '0.5rem',
                                width: '220px',
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                                border: '1px solid #f1f5f9',
                                padding: '0.5rem',
                                overflow: 'hidden',
                                zIndex: 100
                            }}>
                                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', marginBottom: '0.5rem' }}>
                                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '700', color: '#1e293b' }}>Account Info</p>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{user?.phoneNumber}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        navigate('/settings');
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '10px',
                                        color: '#334155',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        width: '100%',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '0.875rem',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <Settings size={18} />
                                    <span>Settings</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        handleLogout();
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '10px',
                                        color: '#ef4444',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        width: '100%',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '0.875rem',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <LogOut size={18} />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <main style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
                    <Outlet />
                </main>

                <footer style={{
                    padding: '1.25rem 2rem',
                    backgroundColor: 'white',
                    borderTop: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2rem',
                    color: '#64748b',
                    fontSize: '0.8125rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>© 2026 BuildNexDev. All rights reserved.</span>
                    </div>

                    <div style={{ width: '1px', height: '14px', backgroundColor: '#e2e8f0' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontWeight: '700', color: '#1e293b' }}>
                        <div className="animate-heartbeat" style={{ color: '#ef4444', display: 'flex', alignItems: 'center' }}>
                            <HeartPulse size={18} />
                        </div>
                        <span style={{ letterSpacing: '-0.01em' }}>BuildNextDev</span>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Layout;
