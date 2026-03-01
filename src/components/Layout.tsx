import { useState, Suspense } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Tag, Image as ImageIcon, Briefcase, FileText,
    Building, Phone, DollarSign, FolderOpen, ChevronDown, ChevronUp, LogOut, Loader2
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import type { AppDispatch, RootState } from '../store/store';

export const GlobalLoader = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
        <Loader2 size={40} className="animate-spin" color="#6366f1" />
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
    const isAdmin = user?.role === 'admin';
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({ Projects: true });

    const toggleMenu = (name: string) => {
        setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const allNavItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        {
            name: 'Projects',
            icon: <FolderOpen size={20} />,
            subItems: [
                { name: 'Upload Project', path: '/builders/upload-project' },
                { name: 'Manage Projects', path: '/builders/manage-projects' }
            ]
        },
        { name: 'Categories', path: '/builders/categories', icon: <Tag size={20} /> },
        { name: 'Banners', path: '/builders/upload-home-banners', icon: <ImageIcon size={20} /> },
        { name: 'Project Gallery', path: '/builders/project-gallery', icon: <ImageIcon size={20} /> },
        { name: 'Services', path: '/builders/services', icon: <Briefcase size={20} /> },
        { name: 'Blog', path: '/builders/blog', icon: <FileText size={20} /> },
        { name: 'Company Details', path: '/company-details', icon: <Building size={20} /> },
        { name: 'Contact Info', path: '/contact-info', icon: <Phone size={20} /> },
        { name: 'Revenue Report', path: '/revenue-report', icon: <DollarSign size={20} /> },
    ];

    const navItems = isAdmin
        ? allNavItems
        : allNavItems.filter((item) => {
            if (item.path === '/company-details' || item.path === '/contact-info' || item.path === '/revenue-report' || item.path === '/builders/categories') return false;
            if (item.name === 'Projects') return false;
            return true;
          });

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                backgroundColor: '#ffffff',
                borderRight: '1px solid #f1f5f9',
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                zIndex: 40,
                boxShadow: '2px 0 8px rgba(0,0,0,0.02)'
            }}>
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid #f8fafc',
                    marginBottom: '1rem'
                }}>
                    <Link to="/" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        textDecoration: 'none'
                    }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
                            BuildnexDev
                        </span>
                    </Link>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0 1rem', overflowY: 'auto' }}>
                    {navItems.map((item) => {
                        const hasSubItems = !!item.subItems;
                        // For direct match (or root)
                        let isActive = location.pathname === item.path || (item.path !== '/' && !!item.path && location.pathname.startsWith(item.path));
                        if (hasSubItems) {
                            isActive = item.subItems!.some(sub => location.pathname === sub.path || location.pathname.startsWith(sub.path));
                        }

                        if (hasSubItems) {
                            const isOpen = openMenus[item.name];
                            return (
                                <div key={item.name} style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div
                                        onClick={() => toggleMenu(item.name)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '8px',
                                            color: isActive ? '#3b82f6' : '#475569',
                                            backgroundColor: isActive ? '#eff6ff' : 'transparent',
                                            fontWeight: isActive ? '600' : '500',
                                            cursor: 'pointer',
                                            fontSize: '0.925rem',
                                            transition: 'all 0.2s',
                                            marginBottom: '2px'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span style={{ color: isActive ? '#3b82f6' : '#64748b' }}>{item.icon}</span>
                                            <span>{item.name}</span>
                                        </div>
                                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </div>

                                    {/* Submenu Items */}
                                    {isOpen && (
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '2px',
                                            marginTop: '2px',
                                            marginBottom: '8px'
                                        }}>
                                            {item.subItems!.map((sub) => {
                                                const isSubActive = location.pathname === sub.path || location.pathname.startsWith(sub.path);
                                                return (
                                                    <Link
                                                        key={sub.name}
                                                        to={sub.path}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            padding: '0.65rem 1rem 0.65rem 3.25rem',
                                                            borderRadius: '8px',
                                                            color: isSubActive ? '#3b82f6' : '#64748b',
                                                            backgroundColor: isSubActive ? '#eff6ff' : 'transparent',
                                                            textDecoration: 'none',
                                                            fontSize: '0.875rem',
                                                            fontWeight: isSubActive ? '500' : '400',
                                                            transition: 'all 0.2s',
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
                            <Link
                                key={item.name}
                                to={item.path as string}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '8px',
                                    color: isActive ? '#3b82f6' : '#475569',
                                    backgroundColor: isActive ? '#eff6ff' : 'transparent',
                                    textDecoration: 'none',
                                    fontWeight: isActive ? '600' : '500',
                                    fontSize: '0.925rem',
                                    transition: 'all 0.2s',
                                    marginBottom: '2px'
                                }}
                            >
                                <span style={{ color: isActive ? '#3b82f6' : '#64748b' }}>{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Section */}
                <div style={{ padding: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button onClick={() => { dispatch(logoutUser()); navigate('/'); }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: '#ef4444', backgroundColor: 'transparent', border: 'none', fontWeight: '500', fontSize: '0.925rem', cursor: 'pointer', transition: 'all 0.2s', width: '100%', textAlign: 'left' }}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
                <header style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#ffffff', borderBottom: '1px solid #f1f5f9', minHeight: '56px' }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: '500', color: '#0f172a' }}>
                        {user?.name || 'User'}
                    </span>
                </header>
                <div style={{ flex: 1, padding: '2rem' }}>
                    <Suspense fallback={<GlobalLoader />}>
                        <Outlet />
                    </Suspense>
                </div>

                {/* Footer */}
                <footer style={{ padding: '1rem 2rem', borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.875rem', textAlign: 'center', backgroundColor: '#ffffff' }}>
                    &copy; {new Date().getFullYear()} BuildnexDev. All rights reserved.
                </footer>
            </main>
        </div>
    );
};

export default Layout;
