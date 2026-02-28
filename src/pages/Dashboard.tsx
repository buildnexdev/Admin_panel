import {
    LayoutDashboard, Tag, Image as ImageIcon, Briefcase, FileText,
    School, Camera, Building, Phone, DollarSign, FolderOpen, MoreHorizontal,
    Search, Filter, Globe, Database, ShieldCheck, TrendingUp, CheckCircle2, AlertCircle, Clock, Eye, MessageSquare, ChevronDown, ChevronRight
} from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

const Dashboard = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    const stats = [
        { name: 'Total Projects', value: '145', trend: '+12.5%', color: '#3b82f6', bgColor: '#eff6ff', icon: <FolderOpen size={20} /> },
        { name: 'Active Banners', value: '28', trend: '+5.2%', color: '#22c55e', bgColor: '#f0fdf4', icon: <ImageIcon size={20} /> },
        { name: 'Blog Posts', value: '89', trend: '+23.1%', color: '#a855f7', bgColor: '#faf5ff', icon: <FileText size={20} /> },
        { name: 'Monthly Revenue', value: '$45.2K', trend: '+18.3%', color: '#f97316', bgColor: '#fff7ed', icon: <DollarSign size={20} /> },
        { name: 'Total Visitors', value: '12.4K', trend: '+8.7%', color: '#ec4899', bgColor: '#fdf2f8', icon: <Eye size={20} /> },
        { name: 'Services', value: '34', trend: '+3.2%', color: '#8b5cf6', bgColor: '#f5f3ff', icon: <Briefcase size={20} /> },
        { name: 'Photography', value: '256', trend: '+15.8%', color: '#06b6d4', bgColor: '#ecfeff', icon: <ImageIcon size={20} /> },
        { name: 'Inquiries', value: '67', trend: '+9.4%', color: '#14b8a6', bgColor: '#f0fdfa', icon: <MessageSquare size={20} /> },
    ];

    const quickStats = [
        { name: 'Pending Reviews', value: '12', color: '#f97316' },
        { name: 'Draft Projects', value: '8', color: '#64748b' },
        { name: 'Active Campaigns', value: '5', color: '#22c55e' },
        { name: 'New Messages', value: '23', color: '#3b82f6' },
    ];

    return (
        <div style={{ padding: '0 0.5rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
                    Dashboard
                </h1>
                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                    Welcome back! Here's your business overview.
                </p>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.25rem',
                marginBottom: '1.25rem'
            }}>
                {stats.map((stat, idx) => (
                    <div key={idx} style={{
                        backgroundColor: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ fontSize: '0.85rem', fontWeight: '500', color: '#64748b', marginBottom: '0.75rem' }}>
                                    {stat.name}
                                </h3>
                                <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                                    {stat.value}
                                </div>
                            </div>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                backgroundColor: stat.bgColor,
                                color: stat.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {stat.icon}
                            </div>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {stat.trend} <span style={{ color: '#94a3b8', fontWeight: '400' }}>this month</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem'
            }}>
                {quickStats.map((stat, idx) => (
                    <div key={idx} style={{
                        backgroundColor: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: stat.color, marginBottom: '0.25rem' }}>
                            {stat.value}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>
                            {stat.name}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Sections */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '1.5rem'
            }}>
                {/* Recent Activity Placeholder */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid #f1f5f9',
                    minHeight: '200px'
                }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem' }}>Recent Activity</h3>
                    <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Latest updates across all modules</p>
                </div>

                {/* Quick Actions Placeholder */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid #f1f5f9',
                    minHeight: '200px'
                }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem' }}>Quick Actions</h3>
                    <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Common tasks</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
