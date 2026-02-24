import { School, Camera, Hammer, Upload, Image as ImageIcon, ChevronRight, Activity, Users, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const stats = [
        { name: 'School', icon: <School size={24} />, color: '#6366f1', bgColor: '#e0e7ff', path: '/school' },
        { name: 'Photography', icon: <Camera size={24} />, color: '#a855f7', bgColor: '#f3e8ff', path: '/photography' },
        { name: 'Builders', icon: <Hammer size={24} />, color: '#f59e0b', bgColor: '#fef3c7', path: '/builders' },
    ];

    const metrics = [
        { label: 'Total Visits', value: '12.5k', change: '+12%', icon: <Activity size={20} /> },
        { label: 'Active Users', value: '1,280', change: '+5%', icon: <Users size={20} /> },
        { label: 'Revenue', value: '$8,450', change: '+18%', icon: <CreditCard size={20} /> },
    ];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }} className="animate-fade-in">
            {/* Header Section */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '2.5rem',
                gap: '2rem'
            }}>
                <div>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '800',
                        letterSpacing: '-0.025em',
                        color: '#1e293b',
                        marginBottom: '0.5rem'
                    }}>
                        Console <span style={{ color: '#6366f1' }}>Overview</span>
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.125rem' }}>
                        Welcome back! Here's what's happening with your projects today.
                    </p>
                </div>
                <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    backgroundColor: 'white',
                    padding: '0.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}>
                    <button style={{
                        padding: '0.625rem 1.25rem',
                        backgroundColor: '#6366f1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                    }}>
                        Generate Report
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>
                {metrics.map((metric, idx) => (
                    <div key={idx} style={{
                        backgroundColor: 'white',
                        padding: '1.5rem',
                        borderRadius: '20px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                        border: '1px solid #f1f5f9',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', marginBottom: '0.5rem' }}>{metric.label}</p>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b' }}>{metric.value}</h3>
                            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '700', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '99px', marginTop: '0.5rem', display: 'inline-block' }}>
                                {metric.change}
                            </span>
                        </div>
                        <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '12px', color: '#6366f1' }}>
                            {metric.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Sections Grid */}
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '1.5rem' }}>Management Modules</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        onClick={() => navigate(stat.path)}
                        style={{
                            backgroundColor: 'white',
                            padding: '2rem',
                            borderRadius: '24px',
                            boxShadow: '0 4px 25px rgba(0,0,0,0.03)',
                            border: '1px solid #f1f5f9',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.06)';
                            e.currentTarget.style.borderColor = stat.color + '40';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 25px rgba(0,0,0,0.03)';
                            e.currentTarget.style.borderColor = '#f1f5f9';
                        }}
                    >
                        <div style={{
                            width: '56px',
                            height: '56px',
                            backgroundColor: stat.bgColor,
                            color: stat.color,
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {stat.icon}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>
                                {stat.name} Module
                            </h3>
                            <p style={{ fontSize: '0.9375rem', color: '#64748b', lineHeight: '1.5' }}>
                                Manage and update all {stat.name.toLowerCase()} related content and assets.
                            </p>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: stat.color,
                            fontWeight: '600',
                            fontSize: '0.875rem'
                        }}>
                            Access Dashboard <ChevronRight size={16} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Brand Details Section */}
            <div style={{
                backgroundColor: 'white',
                padding: '2.5rem',
                borderRadius: '24px',
                boxShadow: '0 4px 25px rgba(0,0,0,0.03)',
                border: '1px solid #f1f5f9'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>
                        Brand Infrastructure
                    </h2>
                    <span style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: '600', backgroundColor: '#e0e7ff', padding: '4px 12px', borderRadius: '99px' }}>
                        System Online
                    </span>
                </div>
                <div style={{
                    padding: '4rem 2rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '16px',
                    border: '2px dashed #e2e8f0',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{ width: '64px', height: '64px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                        <ImageIcon size={32} color="#94a3b8" />
                    </div>
                    <div>
                        <p style={{ color: '#1e293b', fontSize: '1.125rem', fontWeight: '600' }}>
                            No brand assets uploaded yet
                        </p>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                            Upload your logo and brand guidelines to customize the panel.
                        </p>
                    </div>
                    <button style={{
                        marginTop: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#6366f1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
                    }}>
                        <Upload size={18} />
                        Upload Assets
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
