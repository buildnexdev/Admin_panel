import { Link, Outlet } from 'react-router-dom';
import { Hammer, ChevronRight } from 'lucide-react';

const BuildersDashboard = () => {
    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937' }}>Builders Website Management</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <Link to="/builders/upload-project" style={{ textDecoration: 'none' }}>
                    <div style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', backgroundColor: '#ffedd5', borderRadius: '50%' }}>
                            <Hammer size={24} color="#ea580c" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>Upload New Project</h3>
                            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Add completed or ongoing projects</p>
                        </div>
                        <ChevronRight size={20} color="#9ca3af" style={{ marginLeft: 'auto' }} />
                    </div>
                </Link>
            </div>
            <Outlet />
        </div>
    );
};

export default BuildersDashboard;
