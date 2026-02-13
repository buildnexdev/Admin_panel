import { School, Camera, Hammer, Upload, Image as ImageIcon } from 'lucide-react';

const Dashboard = () => {
    const stats = [
        { name: 'School', icon: <School size={32} />, color: '#3b82f6', bgColor: '#dbeafe' },
        { name: 'Photography', icon: <Camera size={32} />, color: '#8b5cf6', bgColor: '#ede9fe' },
        { name: 'Builders', icon: <Hammer size={32} />, color: '#f59e0b', bgColor: '#fef3c7' },
    ];

    return (
        <div style={{ maxWidth: '1200px' }}>
            {/* Welcome Section */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>
                    Welcome to Admin Panel
                </h1>
                <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                    Manage your websites and content from one central dashboard.
                </p>
            </div>

            {/* Quick Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        style={{
                            backgroundColor: 'white',
                            padding: '1.5rem',
                            borderRadius: '8px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                        }}
                    >
                        <div style={{
                            backgroundColor: stat.bgColor,
                            color: stat.color,
                            padding: '1rem',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {stat.icon}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
                                {stat.name}
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Manage content</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Brand Details Section - Placeholder for future content */}
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '2rem'
            }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                    Brand Details
                </h2>
                <div style={{
                    padding: '3rem 2rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '6px',
                    border: '2px dashed #d1d5db',
                    textAlign: 'center'
                }}>
                    <ImageIcon size={48} style={{ margin: '0 auto 1rem', color: '#9ca3af' }} />
                    <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                        Brand details will be displayed here
                    </p>
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                        This section is ready for your brand information
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                    Quick Actions
                </h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.25rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: '0.875rem',
                        transition: 'background-color 0.2s'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                    >
                        <Upload size={18} />
                        Upload Content
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
