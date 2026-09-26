import { useState, Suspense, useEffect, useMemo } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    Tag, Image as ImageIcon, Briefcase, FileText,
    Building, Phone, DollarSign, FolderOpen, ChevronDown, ChevronUp, LogOut, LayoutGrid,
    Menu, X as XIcon, Star, UserPlus, Users, UserCog, CheckSquare, Ticket,
    Wallet, FileBarChart, Settings as SettingsIcon, PanelLeftClose, PanelLeftOpen,
    Home, Bell, ClipboardList, Shield,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import { fetchMenu } from '../store/slices/menuSlice';
import type { AppDispatch, RootState } from '../store/store';
import BrandLogo from './BrandLogo';
import BrandSpinner from './BrandSpinner';
import Toast from './Toast';

interface NavItem {
    name: string;
    path?: string;
    icon: React.ReactNode;
    configKey: string | null;
    role?: string;
    subItems?: { name: string; path: string }[];
}

interface NavSection {
    id: string;
    label: string;
    icon: React.ReactNode;
    items: NavItem[];
}

export const GlobalLoader = () => (
    <BrandSpinner variant="inline" message="Loading page…" />
);

const SIDEBAR_EXPANDED = 260;
const SIDEBAR_COLLAPSED = 78;

const PAGE_TITLES: Record<string, string> = {
    '/': 'Admin dashboard',
    '/settings': 'Settings',
    '/profile': 'My profile',
    '/company-details': 'Company details',
    '/contact-info': 'Contact & enquiries',
    '/revenue-report': 'Revenue report',
    '/upload-project': 'Upload project',
    '/manage-projects': 'Manage projects',
    '/categories': 'Categories',
    '/project-gallery': 'Project gallery',
    '/upload-home-banners': 'Banners',
    '/services': 'Services',
    '/blog': 'Blog',
    '/quotation': 'Quotations',
    '/quotation-create': 'Create quotation',
    '/srs-images': 'SRS images',
    '/google-reviews': 'Google reviews',
    '/team-members': 'Team members',
    '/staff': 'Staff',
    '/roles': 'User Access Control',
    '/tasks': 'Tasks',
    '/tickets': 'Tickets',
    '/accounts': 'Accounts',
    '/reports': 'Reports',
};

function useLiveClock() {
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        const id = window.setInterval(() => setNow(new Date()), 1000);
        return () => window.clearInterval(id);
    }, []);
    return now.toLocaleString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
}

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const menuConfig = useSelector((state: RootState) => state.menu.config);
    const clock = useLiveClock();

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        content: true,
        operations: true,
        enterprise: true,
    });
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({ Projects: true, Quotations: true });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const closeSidebar = () => setSidebarOpen(false);

    const handleLogout = () => {
        setUserMenuOpen(false);
        dispatch(logoutUser());
        navigate('/');
    };

    useEffect(() => {
        if (user?.companyID && !menuConfig) {
            dispatch(fetchMenu(user.companyID));
        }
    }, [dispatch, user?.companyID, menuConfig]);

    useEffect(() => {
        setUserMenuOpen(false);
        setSidebarOpen(false);
    }, [location.pathname]);

    const isVisible = (key: string | null | undefined) => {
        if (key == null) return true;
        if (!menuConfig) return false;
        return menuConfig[key] != 0;
    };

    const sections: NavSection[] = useMemo(() => {
        const content: NavItem[] = [
            {
                name: 'Projects',
                icon: <FolderOpen size={18} strokeWidth={1.6} />,
                configKey: 'projects',
                subItems: [
                    { name: 'Upload Project', path: '/upload-project' },
                    { name: 'Manage Projects', path: '/manage-projects' },
                ],
            },
            { name: 'Categories', path: '/categories', icon: <Tag size={18} strokeWidth={1.6} />, configKey: 'categories' },
            { name: 'Banners', path: '/upload-home-banners', icon: <ImageIcon size={18} strokeWidth={1.6} />, configKey: 'banners' },
            { name: 'Project Gallery', path: '/project-gallery', icon: <LayoutGrid size={18} strokeWidth={1.6} />, configKey: 'projectGallery' },
            { name: 'Services', path: '/services', icon: <Briefcase size={18} strokeWidth={1.6} />, configKey: 'service' },
            { name: 'Blog', path: '/blog', icon: <FileText size={18} strokeWidth={1.6} />, configKey: 'blog' },
            {
                name: 'Quotations',
                icon: <DollarSign size={18} strokeWidth={1.6} />,
                configKey: 'quotation',
                subItems: [
                    { name: 'All Quotations', path: '/quotation' },
                    { name: 'Create Quotation', path: '/quotation-create' },
                ],
            },
            { name: 'SRS Images', path: '/srs-images', icon: <ImageIcon size={18} strokeWidth={1.6} />, configKey: 'srsImages' },
            { name: 'Google Reviews', path: '/google-reviews', icon: <Star size={18} strokeWidth={1.6} />, configKey: 'googlereview', role: 'admin' },
            { name: 'Team Members', path: '/team-members', icon: <UserPlus size={18} strokeWidth={1.6} />, configKey: 'srsteampage' },
        ];

        const operations: NavItem[] = [
            { name: 'Staff', path: '/staff', icon: <Users size={18} strokeWidth={1.6} />, configKey: null },
            { name: 'Roles', path: '/roles', icon: <UserCog size={18} strokeWidth={1.6} />, configKey: null },
            { name: 'Settings', path: '/settings', icon: <SettingsIcon size={18} strokeWidth={1.6} />, configKey: null },
        ];

        const enterprise: NavItem[] = [
            { name: 'Company Details', path: '/company-details', icon: <Building size={18} strokeWidth={1.6} />, configKey: 'company', role: 'admin' },
            { name: 'Contact Info', path: '/contact-info', icon: <Phone size={18} strokeWidth={1.6} />, configKey: 'contact' },
            { name: 'Revenue Report', path: '/revenue-report', icon: <DollarSign size={18} strokeWidth={1.6} />, configKey: 'revenueReport' },
        ];

        const filter = (items: NavItem[]) =>
            items.filter((item) => isVisible(item.configKey) && (!item.role || user?.role === item.role));

        return [
            { id: 'content', label: 'Content', icon: <ClipboardList size={14} strokeWidth={1.8} />, items: filter(content) },
            { id: 'operations', label: 'Operations', icon: <Shield size={14} strokeWidth={1.8} />, items: filter(operations) },
            { id: 'enterprise', label: 'Enterprise', icon: <SettingsIcon size={14} strokeWidth={1.8} />, items: filter(enterprise) },
        ].filter((s) => s.items.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menuConfig, user?.role]);

    const pageTitle = useMemo(() => {
        const exact = PAGE_TITLES[location.pathname];
        if (exact) return exact;
        const hit = Object.entries(PAGE_TITLES).find(([p]) => p !== '/' && location.pathname.startsWith(p));
        return hit?.[1] || user?.companyName || 'Admin dashboard';
    }, [location.pathname, user?.companyName]);

    const desktopCollapsed = sidebarCollapsed;
    const showLabels = !desktopCollapsed || sidebarOpen;
    const sidebarWidth = desktopCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;
    const initial = (user?.name || 'A').trim().charAt(0).toUpperCase();

    const isItemActive = (item: NavItem) => {
        if (item.subItems) {
            return item.subItems.some((sub) => location.pathname === sub.path || location.pathname.startsWith(sub.path));
        }
        return location.pathname === item.path || (!!item.path && item.path !== '/' && location.pathname.startsWith(item.path));
    };

    const renderNavItem = (item: NavItem) => {
        const active = isItemActive(item);

        if (item.subItems) {
            const isOpen = openMenus[item.name];
            return (
                <div key={item.name} className="ev-nav-group">
                    <button
                        type="button"
                        className={`ev-nav-link${active ? ' is-active' : ''}`}
                        onClick={() => {
                            if (!showLabels) {
                                setSidebarCollapsed(false);
                                setOpenMenus((p) => ({ ...p, [item.name]: true }));
                                return;
                            }
                            setOpenMenus((p) => ({ ...p, [item.name]: !p[item.name] }));
                        }}
                        title={!showLabels ? item.name : undefined}
                    >
                        <span className="ev-nav-icon">{item.icon}</span>
                        {showLabels && <span className="ev-nav-text">{item.name}</span>}
                        {showLabels && (
                            <span className="ev-nav-chev">
                                {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </span>
                        )}
                    </button>
                    {showLabels && isOpen && (
                        <div className="ev-nav-sub">
                            {item.subItems.map((sub) => {
                                const subActive = location.pathname === sub.path || location.pathname.startsWith(sub.path);
                                return (
                                    <Link
                                        key={sub.path}
                                        to={sub.path}
                                        onClick={closeSidebar}
                                        className={`ev-nav-sublink${subActive ? ' is-active' : ''}`}
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
                to={item.path!}
                onClick={closeSidebar}
                className={`ev-nav-link${active ? ' is-active' : ''}`}
                title={!showLabels ? item.name : undefined}
            >
                <span className="ev-nav-icon">{item.icon}</span>
                {showLabels && <span className="ev-nav-text">{item.name}</span>}
            </Link>
        );
    };

    return (
            <div className="ev-shell">
            <Toast />

            {sidebarOpen && <div className="ev-backdrop" onClick={closeSidebar} />}

            <aside
                className={`ev-sidebar${desktopCollapsed ? ' is-collapsed' : ''}${sidebarOpen ? ' is-open' : ''}`}
                style={{ width: sidebarWidth }}
            >
                <div className="ev-sidebar__brand">
                    <Link to="/" onClick={closeSidebar} className="ev-brand-link" title="Home">
                        <span className="ev-brand-mark">
                            <BrandLogo height={showLabels ? 34 : 30} />
                        </span>
                        {showLabels && (
                            <span className="ev-brand-text">
                                <span className="ev-brand-name">
                                    Build<span>Nex</span>Dev
                                </span>
                                <span className="ev-brand-sub">ADMIN PANEL</span>
                            </span>
                        )}
                    </Link>
                    <button
                        type="button"
                        className="ev-icon-btn ev-sidebar-close"
                        onClick={closeSidebar}
                        aria-label="Close menu"
                    >
                        <XIcon size={18} />
                    </button>
                </div>

                <nav className="ev-sidebar__nav">
                    {sections.map((section) => {
                        const open = openSections[section.id] !== false;
                        return (
                            <div key={section.id} className="ev-section">
                                <button
                                    type="button"
                                    className="ev-section__head"
                                    onClick={() => {
                                        if (!showLabels) {
                                            setSidebarCollapsed(false);
                                            setOpenSections((p) => ({ ...p, [section.id]: true }));
                                            return;
                                        }
                                        setOpenSections((p) => ({ ...p, [section.id]: !open }));
                                    }}
                                    title={!showLabels ? section.label : undefined}
                                >
                                    <span className="ev-section__icon">{section.icon}</span>
                                    {showLabels && <span className="ev-section__label">{section.label}</span>}
                                    {showLabels && (
                                        <span className="ev-section__chev">
                                            {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                                        </span>
                                    )}
                                </button>
                                {(open || !showLabels) && (
                                    <div className="ev-section__body">
                                        {section.items.map(renderNavItem)}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                <div className="ev-sidebar__foot">
                    {showLabels && <span className="ev-lan">BUILDNEXDEV</span>}
                    <button
                        type="button"
                        className="ev-collapse-btn"
                        onClick={() => setSidebarCollapsed((c) => !c)}
                        aria-label={desktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        title={desktopCollapsed ? 'Expand' : 'Collapse'}
                    >
                        {desktopCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
                        {showLabels && <span>Collapse</span>}
                    </button>
                </div>
            </aside>

            <div className="ev-main" style={{ marginLeft: 0 }}>
                <header className="ev-header">
                    <div className="ev-header__left">
                        <button
                            type="button"
                            className="ev-icon-btn ev-hamburger"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu size={20} />
                        </button>
                        <button
                            type="button"
                            className="ev-icon-btn ev-home-btn"
                            onClick={() => navigate('/')}
                            aria-label="Home"
                            title="Dashboard"
                        >
                            <Home size={18} strokeWidth={1.7} />
                        </button>
                        <h1 className="ev-header__title">{pageTitle}</h1>
                    </div>

                    <div className="ev-header__right">
                        <div className="ev-clock" title="Local time">
                            {clock}
                        </div>
                        <button type="button" className="ev-icon-btn ev-bell" aria-label="Notifications">
                            <Bell size={17} strokeWidth={1.7} />
                        </button>

                        <div className="ev-user">
                            <button
                                type="button"
                                className="ev-avatar"
                                onClick={() => setUserMenuOpen((o) => !o)}
                                aria-expanded={userMenuOpen}
                                aria-haspopup="menu"
                            >
                                {initial}
                            </button>

                            {userMenuOpen && (
                                <>
                                    <div className="ev-user-scrim" onClick={() => setUserMenuOpen(false)} />
                                    <div className="ev-user-menu" role="menu">
                                        <div className="ev-user-menu__meta">
                                            <strong>{user?.name || 'Admin'}</strong>
                                            <span>{user?.role || 'User'} · {user?.companyName || 'Company'}</span>
                                        </div>
                                        <Link to="/profile" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                                            Profile
                                        </Link>
                                        <Link to="/settings" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                                            Settings
                                        </Link>
                                        <button type="button" role="menuitem" className="ev-user-logout" onClick={handleLogout}>
                                            <LogOut size={15} /> Sign out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <div className="ev-content">
                    <Suspense fallback={<GlobalLoader />}>
                        <Outlet />
                    </Suspense>
                </div>
            </div>
            <style>{`
                .ev-shell {
                    display: flex;
                    height: 100vh;
                    background: #F3F6F4;
                    overflow: hidden;
                    font-family: var(--font-sans);
                }
                .ev-backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(10, 34, 20, 0.45);
                    z-index: 45;
                }

                .ev-sidebar {
                    position: fixed;
                    top: 0; left: 0; bottom: 0;
                    z-index: 50;
                    display: flex;
                    flex-direction: column;
                    background: #0A2214;
                    border-radius: 0 28px 28px 0;
                    color: #C5D4CC;
                    transition: width 0.25s ease, transform 0.3s ease;
                    transform: translateX(-105%);
                    overflow: hidden;
                }
                .ev-sidebar.is-open { transform: translateX(0); }

                .ev-sidebar__brand {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 0.5rem;
                    padding: 1.35rem 1.15rem 1.1rem;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    flex-shrink: 0;
                }
                .ev-brand-link {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    text-decoration: none;
                    color: inherit;
                    min-width: 0;
                    overflow: hidden;
                }
                .ev-brand-mark {
                    flex-shrink: 0;
                    width: 42px; height: 42px;
                    border-radius: 12px;
                    background: #fff;
                    display: flex; align-items: center; justify-content: center;
                    padding: 4px;
                }
                .ev-brand-mark img { max-width: 100%; max-height: 100%; object-fit: contain; }
                .ev-brand-text { display: flex; flex-direction: column; min-width: 0; }
                .ev-brand-name {
                    font-family: var(--font-display);
                    font-size: 1.1rem;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                    color: #fff;
                    line-height: 1.1;
                }
                .ev-brand-name span { color: #6EE7B7; }
                .ev-brand-sub {
                    margin-top: 0.2rem;
                    font-size: 0.62rem;
                    font-weight: 700;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: #7A9488;
                }

                .ev-sidebar__nav {
                    flex: 1;
                    overflow-y: auto;
                    overflow-x: hidden;
                    padding: 1rem 0.75rem 1.25rem;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255,255,255,0.12) transparent;
                }
                .ev-sidebar__nav::-webkit-scrollbar { width: 4px; }
                .ev-sidebar__nav::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.12);
                    border-radius: 99px;
                }

                .ev-section { margin-bottom: 1.1rem; }
                .ev-section__head {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.35rem 0.65rem;
                    margin-bottom: 0.3rem;
                    background: none;
                    border: none;
                    color: #7A9488;
                    cursor: pointer;
                    font-family: inherit;
                    text-align: left;
                }
                .ev-section__icon { display: flex; flex-shrink: 0; opacity: 0.9; color: #6EE7B7; }
                .ev-section__label {
                    flex: 1;
                    font-size: 0.66rem;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                }
                .ev-section__chev { display: flex; opacity: 0.7; }

                .ev-nav-link {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    width: 100%;
                    padding: 0.6rem 0.8rem;
                    margin-bottom: 2px;
                    border: none;
                    border-radius: 10px;
                    background: transparent;
                    color: #C5D4CC;
                    text-decoration: none;
                    font-family: inherit;
                    font-size: 0.9rem;
                    font-weight: 500;
                    cursor: pointer;
                    text-align: left;
                    transition: background 0.15s, color 0.15s;
                }
                .ev-nav-link:hover { background: rgba(255,255,255,0.07); color: #fff; }
                .ev-nav-link.is-active {
                    background: rgba(255,255,255,0.12);
                    color: #fff;
                    font-weight: 600;
                }
                .ev-nav-icon { display: flex; flex-shrink: 0; opacity: 0.9; }
                .ev-nav-link.is-active .ev-nav-icon { opacity: 1; color: #6EE7B7; }
                .ev-nav-text { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .ev-nav-chev { display: flex; opacity: 0.6; }

                .ev-nav-sub {
                    margin: 0.15rem 0 0.35rem 1.1rem;
                    padding-left: 0.8rem;
                    border-left: 1px solid rgba(255,255,255,0.1);
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                .ev-nav-sublink {
                    padding: 0.4rem 0.65rem;
                    border-radius: 8px;
                    color: #A8BDB4;
                    text-decoration: none;
                    font-size: 0.84rem;
                    font-weight: 500;
                }
                .ev-nav-sublink:hover { color: #fff; background: rgba(255,255,255,0.07); }
                .ev-nav-sublink.is-active { color: #6EE7B7; font-weight: 600; background: rgba(255,255,255,0.08); }

                .ev-sidebar__foot {
                    padding: 0.85rem;
                    border-top: 1px solid rgba(255,255,255,0.06);
                    display: flex;
                    flex-direction: column;
                    gap: 0.55rem;
                    flex-shrink: 0;
                }
                .ev-lan {
                    font-size: 0.62rem;
                    font-weight: 700;
                    letter-spacing: 0.14em;
                    color: #7A9488;
                    padding: 0 0.35rem;
                }
                .ev-collapse-btn {
                    display: none;
                    align-items: center;
                    justify-content: flex-start;
                    gap: 0.55rem;
                    width: 100%;
                    padding: 0.55rem 0.75rem;
                    border-radius: 10px;
                    border: 1px solid rgba(255,255,255,0.08);
                    background: rgba(255,255,255,0.04);
                    color: #C5D4CC;
                    font-family: inherit;
                    font-size: 0.8rem;
                    font-weight: 500;
                    cursor: pointer;
                }
                .ev-collapse-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }
                .ev-sidebar.is-collapsed .ev-collapse-btn { justify-content: center; }
                .ev-sidebar.is-collapsed .ev-brand-link { justify-content: center; }
                .ev-sidebar.is-collapsed .ev-nav-link { justify-content: center; padding: 0.65rem; }
                .ev-sidebar.is-collapsed .ev-section__head { justify-content: center; }

                .ev-main {
                    flex: 1;
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    overflow: hidden;
                    background: #F3F6F4;
                }
                .ev-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                    padding: 0.75rem 1.35rem;
                    margin: 12px 14px 0;
                    background: #fff;
                    border: 1px solid #DCE6E0;
                    border-radius: 14px;
                    box-shadow: 0 1px 3px rgba(18, 32, 26, 0.05);
                    flex-shrink: 0;
                    z-index: 30;
                }
                .ev-header__left {
                    display: flex;
                    align-items: center;
                    gap: 0.7rem;
                    min-width: 0;
                }
                .ev-header__title {
                    margin: 0;
                    font-family: var(--font-display);
                    font-size: 1.05rem;
                    font-weight: 700;
                    color: #12201A;
                    letter-spacing: -0.01em;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .ev-header__right {
                    display: flex;
                    align-items: center;
                    gap: 0.55rem;
                    flex-shrink: 0;
                }
                .ev-clock {
                    display: none;
                    padding: 0.4rem 0.9rem;
                    border-radius: 999px;
                    border: 1px solid #DCE6E0;
                    background: #F3F6F4;
                    font-size: 0.78rem;
                    font-weight: 600;
                    color: #3D4A44;
                    white-space: nowrap;
                }
                .ev-icon-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 38px; height: 38px;
                    border-radius: 10px;
                    border: 1.5px solid #DCE6E0;
                    background: #fff;
                    color: #12201A;
                    cursor: pointer;
                    transition: background 0.15s, border-color 0.15s, color 0.15s;
                    flex-shrink: 0;
                }
                .ev-icon-btn:hover { background: #EEF6F1; border-color: #1B7A4E; color: #1B7A4E; }
                .ev-home-btn { border-radius: 10px; }
                .ev-bell { border-radius: 50%; position: relative; }
                .ev-bell::after {
                    content: '';
                    position: absolute;
                    top: 8px; right: 8px;
                    width: 7px; height: 7px;
                    border-radius: 50%;
                    background: #1B7A4E;
                }
                .ev-hamburger { display: none; }
                .ev-sidebar-close { display: none; color: #fff; background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.12); }

                .ev-user { position: relative; }
                .ev-avatar {
                    width: 38px; height: 38px;
                    border-radius: 50%;
                    border: none;
                    background: #0A2214;
                    color: #fff;
                    font-weight: 700;
                    font-size: 0.9rem;
                    font-family: var(--font-display);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .ev-avatar:hover { opacity: 0.9; }
                .ev-user-scrim { position: fixed; inset: 0; z-index: 40; }
                .ev-user-menu {
                    position: absolute;
                    right: 0;
                    top: calc(100% + 10px);
                    min-width: 220px;
                    background: #fff;
                    border: 1px solid #DCE6E0;
                    border-radius: 12px;
                    box-shadow: 0 12px 32px rgba(18, 32, 26, 0.12);
                    padding: 0.45rem;
                    z-index: 50;
                    animation: fadeInUp 0.2s ease both;
                }
                .ev-user-menu__meta {
                    padding: 0.7rem 0.75rem;
                    border-bottom: 1px solid #DCE6E0;
                    margin-bottom: 0.3rem;
                }
                .ev-user-menu__meta strong {
                    display: block;
                    font-size: 0.9rem;
                    color: #12201A;
                }
                .ev-user-menu__meta span {
                    display: block;
                    margin-top: 3px;
                    font-size: 0.75rem;
                    color: #5B6B63;
                    text-transform: capitalize;
                }
                .ev-user-menu a,
                .ev-user-menu button {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    width: 100%;
                    padding: 0.6rem 0.75rem;
                    border: none;
                    border-radius: 8px;
                    background: transparent;
                    color: #3D4A44;
                    font-size: 0.875rem;
                    font-weight: 500;
                    font-family: inherit;
                    text-decoration: none;
                    cursor: pointer;
                    text-align: left;
                }
                .ev-user-menu a:hover,
                .ev-user-menu button:hover { background: #F3F6F4; color: #12201A; }
                .ev-user-logout { color: #BE123C !important; }

                .ev-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1.15rem 1.35rem 1.75rem;
                }

                @media (min-width: 769px) {
                    .ev-sidebar {
                        position: sticky;
                        top: 0;
                        height: 100vh;
                        transform: none !important;
                        flex-shrink: 0;
                    }
                    .ev-backdrop { display: none !important; }
                    .ev-hamburger { display: none !important; }
                    .ev-sidebar-close { display: none !important; }
                    .ev-collapse-btn { display: flex !important; }
                    .ev-clock { display: block; }
                }

                @media (max-width: 768px) {
                    .ev-hamburger { display: inline-flex !important; }
                    .ev-sidebar-close { display: inline-flex !important; }
                    .ev-collapse-btn { display: none !important; }
                    .ev-sidebar {
                        width: min(300px, 86vw) !important;
                        border-radius: 0 24px 24px 0;
                    }
                    .ev-header {
                        margin: 10px 8px 0;
                        padding: 0.7rem 0.85rem;
                        border-radius: 12px;
                    }
                    .ev-content { padding: 0.9rem 0.8rem 1.35rem; }
                    .ev-header__title { font-size: 0.95rem; }
                }
            `}</style>
        </div>
    );
};

export default Layout;
