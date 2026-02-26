
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Camera, FolderOpen, School, Hammer } from 'lucide-react';

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

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
