import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Camera, FolderOpen, School, Hammer, Search, Activity } from 'lucide-react';

const Layout = () => {
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'School', path: '/school', icon: <School size={20} /> },
        { name: 'Photography', path: '/photography', icon: <Camera size={20} /> },
        { name: 'Builders', path: '/builders', icon: <Hammer size={20} /> },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            {/* Sidebar */}
            <aside style={{
                width: '250px',
                backgroundColor: '#1f2937',
                color: 'white',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'sticky',
                top: 0,
                height: '100vh',
                overflowY: 'auto'
            }}>
                <div style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FolderOpen size={28} />
                    <span>Admin Panel</span>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, height: '100vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                {/* Top Header */}
                <header style={{
                    backgroundColor: 'white',
                    padding: '0.75rem 2rem',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input
                            type="text"
                            placeholder="Search everything..."
                            style={{
                                width: '100%',
                                padding: '0.6rem 1rem 0.6rem 2.5rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '10px',
                                fontSize: '0.875rem',
                                outline: 'none',
                                background: '#f9fafb'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ position: 'relative', cursor: 'pointer', color: '#6b7280' }}>
                            <Activity size={20} />
                            <span style={{ position: 'absolute', top: '-5px', right: '-5px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '2px solid white' }}></span>
                        </div>

                        <div style={{ height: '24px', width: '1px', backgroundColor: '#e5e7eb' }}></div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', margin: 0 }}>Super Admin</p>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Master Control</p>
                            </div>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                SA
                            </div>
                        </div>
                    </div>
                </header>

                <div style={{ padding: '2rem' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
