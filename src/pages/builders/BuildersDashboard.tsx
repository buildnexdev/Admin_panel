import { Link, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { ChevronRight, Lock, Image as ImageIcon, Briefcase, BookOpen, Mail, Layout } from 'lucide-react';

const BuildersDashboard = () => {
    const location = useLocation();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const isAuthorized = isAuthenticated && user?.category === 'Builders';

    const cmsItems = [
        {
            title: 'Project Portfolio',
            desc: 'Manage completed and ongoing projects',
            icon: <Briefcase size={24} />,
            path: '/builders/upload-project',
            color: '#ea580c',
            bgColor: '#ffedd5'
        },
        {
            title: 'Home Banners',
            desc: 'Update the main website carousel',
            icon: <ImageIcon size={24} />,
            path: '/builders/upload-home-banners',
            color: '#166534',
            bgColor: '#dcfce7'
        },
        {
            title: 'Our Services',
            desc: 'Manage business service offerings',
            icon: <Layout size={24} />,
            path: '/builders/services',
            color: '#1e40af',
            bgColor: '#dbeafe'
        },
        {
            title: 'Blog Posts',
            desc: 'Write and publish industry articles',
            icon: <BookOpen size={24} />,
            path: '/builders/blog',
            color: '#9d174d',
            bgColor: '#fce7f3'
        },
        {
            title: 'Customer Inquiries',
            desc: 'View messages from contact form',
            icon: <Mail size={24} />,
            path: '/builders/contact',
            color: '#115e59',
            bgColor: '#ccfbf1'
        },
    ];

    // Show the grid ONLY if we are at the base path /builders
    const isRoot = location.pathname === '/builders' || location.pathname === '/builders/';

    return (
        <div className="animate-fade-in">


            {isRoot ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    {cmsItems.map((item, idx) => (
                        <Link key={idx} to={item.path} style={{ textDecoration: 'none' }}>
                            <div style={{
                                padding: '1.5rem',
                                backgroundColor: 'white',
                                borderRadius: '20px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                                border: '1px solid #f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.25rem',
                                position: 'relative',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'pointer'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
                                    e.currentTarget.style.borderColor = item.color + '40';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.02)';
                                    e.currentTarget.style.borderColor = '#f1f5f9';
                                }}
                            >
                                {!isAuthorized && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        padding: '0.25rem 0.625rem',
                                        backgroundColor: '#fffbeb',
                                        borderRadius: '99px',
                                        fontSize: '0.7rem',
                                        color: '#92400e',
                                        fontWeight: '700',
                                        border: '1px solid #fef3c7'
                                    }}>
                                        <Lock size={12} /> RESTRICTED
                                    </div>
                                )}
                                <div style={{
                                    padding: '1rem',
                                    backgroundColor: item.bgColor,
                                    color: item.color,
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {item.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.125rem' }}>{item.title}</h3>
                                    <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0, lineHeight: '1.4' }}>{item.desc}</p>
                                </div>
                                <ChevronRight size={18} color="#cbd5e1" />
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div style={{ backgroundColor: '#f8fafc', borderRadius: '24px', padding: '2rem', border: '1px solid #f1f5f9' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <Link to="/builders" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: '600', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> Back to CMS Overview
                        </Link>
                    </div>
                    <Outlet />
                </div>
            )}
        </div>
    );
};

export default BuildersDashboard;
