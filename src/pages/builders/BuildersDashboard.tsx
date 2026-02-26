import { Outlet, useLocation } from 'react-router-dom';
import { Hammer } from 'lucide-react';

const BuildersDashboard = () => {
    const location = useLocation();

    // Show the welcome message ONLY if we are at the base path /builders
    const isRoot = location.pathname === '/builders' || location.pathname === '/builders/';

    return (
        <div className="animate-fade-in" style={{
            backgroundColor: isRoot ? 'white' : 'transparent',
            borderRadius: '24px',
            padding: isRoot ? '4rem 2rem' : '0',
            border: isRoot ? '1px solid #f1f5f9' : 'none'
        }}>
            {isRoot ? (
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#f5f7ff',
                        color: '#6366f1',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem auto',
                        boxShadow: '0 8px 16px rgba(99, 102, 241, 0.1)'
                    }}>
                        <Hammer size={40} />
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>
                        Builders <span style={{ color: '#6366f1' }}>Panel</span>
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '1.125rem', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6' }}>
                        Welcome to the Builders management console. Select a module from the sidebar's submenu to manage your projects, banners, services, or inquiries.
                    </p>
                </div>
            ) : (
                <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '2.5rem', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    <Outlet />
                </div>
            )}
        </div>
    );
};

export default BuildersDashboard;
