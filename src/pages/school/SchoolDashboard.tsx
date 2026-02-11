import { Link, Outlet } from 'react-router-dom';
import { FileText, Image, ChevronRight } from 'lucide-react';

const SchoolDashboard = () => {
    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937' }}>School Website Management</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <Link to="/school/upload-content" style={{ textDecoration: 'none' }}>
                    <div style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', backgroundColor: '#dbeafe', borderRadius: '50%' }}>
                            <FileText size={24} color="#2563eb" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>Upload Content</h3>
                            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Manage text and announcements</p>
                        </div>
                        <ChevronRight size={20} color="#9ca3af" style={{ marginLeft: 'auto' }} />
                    </div>
                </Link>
                <Link to="/school/upload-image" style={{ textDecoration: 'none' }}>
                    <div style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', backgroundColor: '#dcfce7', borderRadius: '50%' }}>
                            <Image size={24} color="#16a34a" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>Upload Images</h3>
                            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Gallery and Event photos</p>
                        </div>
                        <ChevronRight size={20} color="#9ca3af" style={{ marginLeft: 'auto' }} />
                    </div>
                </Link>
            </div>
            <Outlet />
        </div>
    );
};

export default SchoolDashboard;
