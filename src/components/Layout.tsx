import { useState, Suspense, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    Tag, Image as ImageIcon, Briefcase, FileText,
    Building, Phone, DollarSign, FolderOpen, ChevronDown, ChevronUp, LogOut, Loader2, LayoutGrid,
    User, Sparkles, Menu, X as XIcon
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import { fetchMenu } from '../store/slices/menuSlice';
import type { AppDispatch, RootState } from '../store/store';
import Toast from './Toast';

export const GlobalLoader = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
        <Loader2 size={40} className="animate-spin" color="var(--primary-color)" />
        <style>
            {`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}
        </style>
    </div>
);

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const menuConfig = useSelector((state: RootState) => state.menu.config);
    const isAdmin = user?.role === 'admin';
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({ Projects: true });
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const closeSidebar = () => setSidebarOpen(false);

    const toggleMenu = (name: string) => {
        setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
    };

    useEffect(() => {
        if (user?.companyID && !menuConfig) {
            dispatch(fetchMenu(user.companyID));
        }
    }, [dispatch, user?.companyID, menuConfig]);

    const contentNav = [
        {
            name: 'Projects',
            icon: <FolderOpen size={20} />,
            configKey: 'projects',
            subItems: [
                { name: 'Upload Project', path: '/upload-project' },
                { name: 'Manage Projects', path: '/manage-projects' }
            ]
        },
        { name: 'Categories', path: '/categories', icon: <Tag size={20} />, configKey: 'categories' },
        { name: 'Banners', path: '/upload-home-banners', icon: <ImageIcon size={20} />, configKey: 'banners' },
        { name: 'Project Gallery', path: '/project-gallery', icon: <LayoutGrid size={20} />, configKey: 'projectGallery' },
        { name: 'Services', path: '/services', icon: <Briefcase size={20} />, configKey: 'service' },
        { name: 'Blog', path: '/blog', icon: <FileText size={20} />, configKey: 'blog' },
        { name: 'Quotations', path: '/quotation', icon: <DollarSign size={20} />, configKey: 'quotation' },
    ];
    const businessNav = [
        { name: 'Company Details', path: '/company-details', icon: <Building size={20} />, configKey: 'company' },
        { name: 'Contact Info', path: '/contact-info', icon: <Phone size={20} />, configKey: 'contact' },
        { name: 'Revenue Report', path: '/revenue-report', icon: <DollarSign size={20} />, configKey: 'revenueReport' },
    ];

    // Helper: returns true if the section should be visible based on API config
    const isVisible = (key: string | null | undefined) => {
        if (key == null) return true;
        if (!menuConfig) return false;
        // Check if value is not 0 (works for numbers like 1 or strings like "1")
        return menuConfig[key] != 0;
    };

    const contentNavFiltered = contentNav.filter(item => isVisible(item.configKey));
    const businessNavFiltered = businessNav.filter(item => isVisible(item.configKey));

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--bg-dark)', overflow: 'hidden', position: 'relative' }}>
            <Toast />

            {/* ── Mobile overlay backdrop ── */}
            {sidebarOpen && (
                <div
                    onClick={closeSidebar}
                    style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)',
                        zIndex: 45, backdropFilter: 'blur(2px)'
                    }}
                />
            )}

            {/* ── Sidebar ── */}
            <aside style={{
                width: '260px',
                backgroundColor: 'var(--sidebar-bg)',
                borderRight: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                zIndex: 50,
                boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
                // Mobile: fixed, slides in/out
                position: 'fixed' as const,
                top: 0,
                left: 0,
                transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                // Desktop: always visible via media query override below
            }}
                className="layout-sidebar">
                <div style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid var(--border-color)',
                    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, transparent 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <Link to="/" style={{ textDecoration: 'none' }} onClick={closeSidebar}>
                        <span style={{
                            fontSize: '1.4rem', fontWeight: '800', color: 'white',
                            letterSpacing: '-0.02em',
                            background: 'linear-gradient(90deg, #fff 0%, #60a5fa 100%)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                        }}>
                            BuildnexDev
                        </span>
                    </Link>
                    {/* Close button – mobile only */}
                    <button
                        onClick={closeSidebar}
                        className="sidebar-close-btn"
                        style={{
                            background: 'none', border: 'none', color: 'var(--text-muted)',
                            cursor: 'pointer', padding: '0.25rem', display: 'none'
                        }}
                        aria-label="Close menu"
                    >
                        <XIcon size={22} />
                    </button>
                </div>

                <nav style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 1rem', marginBottom: '1rem' }}>
                        Content Engine
                    </div>
                    {contentNavFiltered.map((item: any) => {
                        const hasSubItems = !!item.subItems;
                        let isActive = location.pathname === item.path || (item.path !== '/' && !!item.path && location.pathname.startsWith(item.path));
                        if (hasSubItems) isActive = item.subItems.some((sub: any) => location.pathname === sub.path || location.pathname.startsWith(sub.path));

                        const linkStyle = {
                            display: 'flex', alignItems: 'center', gap: '0.85rem',
                            padding: '0.85rem 1.25rem', borderRadius: '14px',
                            color: isActive ? '#fff' : 'var(--text-muted)',
                            backgroundColor: isActive ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                            textDecoration: 'none', fontWeight: isActive ? '600' : '500',
                            fontSize: '0.95rem',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            border: isActive ? '1px solid rgba(37, 99, 235, 0.4)' : '1px solid transparent',
                            marginBottom: '6px',
                            boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.2)' : 'none',
                        };

                        if (hasSubItems) {
                            const isOpen = openMenus[item.name];
                            return (
                                <div key={item.name}>
                                    <div
                                        onClick={() => toggleMenu(item.name)}
                                        style={{ ...linkStyle, cursor: 'pointer', justifyContent: 'space-between' }}
                                        className="sidebar-item-hover"
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                            <span style={{ color: isActive ? 'var(--primary-color)' : 'inherit' }}>{item.icon}</span>
                                            <span>{item.name}</span>
                                        </div>
                                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </div>
                                    {isOpen && (
                                        <div style={{ marginTop: '4px', marginLeft: '0.75rem', paddingLeft: '1.5rem', borderLeft: '2px solid rgba(37, 99, 235, 0.2)' }}>
                                            {item.subItems.map((sub: any) => {
                                                const isSubActive = location.pathname === sub.path || location.pathname.startsWith(sub.path);
                                                return (
                                                    <Link
                                                        key={sub.name}
                                                        to={sub.path}
                                                        onClick={closeSidebar}
                                                        style={{
                                                            display: 'block', padding: '0.65rem 1rem', borderRadius: '10px',
                                                            color: isSubActive ? 'var(--secondary-color)' : 'var(--text-muted)',
                                                            textDecoration: 'none', fontSize: '0.9rem',
                                                            fontWeight: isSubActive ? '600' : '400', transition: 'all 0.2s',
                                                        }}
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <Link key={item.name} to={item.path} onClick={closeSidebar} style={linkStyle} className="sidebar-item-hover">
                                <span style={{ color: isActive ? 'var(--primary-color)' : 'inherit' }}>{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}

                    {businessNavFiltered.length > 0 && (
                        <div style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 1rem', marginBottom: '1rem' }}>
                                Enterprise
                            </div>
                            {businessNavFiltered.map((item: any) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={closeSidebar}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.85rem',
                                            padding: '0.85rem 1.25rem', borderRadius: '14px',
                                            color: isActive ? '#fff' : 'var(--text-muted)',
                                            backgroundColor: isActive ? 'rgba(14, 165, 233, 0.1)' : 'transparent',
                                            textDecoration: 'none', fontWeight: isActive ? '600' : '500',
                                            fontSize: '0.95rem', marginBottom: '6px', transition: 'all 0.3s',
                                            border: isActive ? '1px solid rgba(14, 165, 233, 0.2)' : '1px solid transparent',
                                        }}
                                    >
                                        <span style={{ color: isActive ? 'var(--secondary-color)' : 'inherit' }}>{item.icon}</span>
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </nav>

                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                    <button
                        onClick={() => { dispatch(logoutUser()); navigate('/'); }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.85rem',
                            padding: '0.85rem 1.25rem',
                            borderRadius: '14px',
                            color: 'var(--accent-rose)',
                            backgroundColor: 'rgba(244, 63, 94, 0.05)',
                            border: '1px solid rgba(244, 63, 94, 0.1)',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            width: '100%',
                            textAlign: 'left',
                            transition: 'all 0.3s',
                        }}
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="layout-main" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-content)' }}>
                <header style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '1rem 1.5rem',
                    backgroundColor: '#fff',
                    borderBottom: '1px solid var(--border-color)', minHeight: '64px',
                    position: 'sticky', top: 0, zIndex: 30,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        {/* Hamburger – shown only on mobile via CSS */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="hamburger-btn"
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: 'var(--text-main)', padding: '0.3rem',
                                display: 'none', alignItems: 'center'
                            }}
                            aria-label="Open menu"
                        >
                            <Menu size={24} />
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '600' }}>
                            <Sparkles size={18} color="var(--primary-color)" />
                            <span className="header-tagline" style={{ color: 'var(--text-main)' }}>
                                Customize your website architecture
                            </span>
                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.6rem 1.25rem',
                        borderRadius: '100px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                    }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' }}>
                            {user?.name || 'Admin'}
                        </span>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 0 10px var(--primary-glow)'
                        }}>
                            <User size={20} />
                        </div>
                    </div>
                </header>
                <div style={{ flex: 1, padding: '0.75rem 0.75rem' }} className="animate-slide-up layout-content">
                    <Suspense fallback={<GlobalLoader />}>
                        <Outlet />
                    </Suspense>
                </div>

                {/* Footer */}
                <footer style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', backgroundColor: '#fff', position: 'sticky', bottom: 0, zIndex: 20, flexShrink: 0 }}>
                    &copy; {new Date().getFullYear()} BuildnexDev. All rights reserved.
                </footer>
            </main>

            {/* ─── Global mobile responsive styles ─── */}
            <style>{`
                body.modal-open {
                    overflow: hidden !important;
                }
                body.modal-open .layout-main {
                    overflow: hidden !important;
                }
                /* Desktop: sidebar always visible, not fixed */
                @media (min-width: 769px) {
                    .layout-sidebar {
                        position: sticky !important;
                        transform: translateX(0) !important;
                        flex-shrink: 0;
                    }
                    .layout-main {
                        margin-left: 0;
                    }
                    .hamburger-btn {
                        display: none !important;
                    }
                    .sidebar-close-btn {
                        display: none !important;
                    }
                }
                /* Mobile: hamburger visible, sidebar hidden by default */
                @media (max-width: 768px) {
                    .hamburger-btn {
                        display: flex !important;
                    }
                    .sidebar-close-btn {
                        display: flex !important;
                    }
                    .layout-main {
                        width: 100%;
                    }
                    .header-tagline {
                        display: none !important;
                    }
                    .layout-content {
                        padding: 1.25rem 1rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Layout;
