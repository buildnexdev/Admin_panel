import {
    School, Camera, Hammer, Upload, TrendingUp, Users, DollarSign, Activity,
    CheckCircle2, Clock, AlertCircle, ChevronRight, Search, Filter, MoreHorizontal,
    Globe, Database, ShieldCheck
} from 'lucide-react';
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import dashboardHero from '../assets/dashboard_hero.png';

const data = [
    { name: 'Jan', students: 400, bookings: 240, revenue: 2400 },
    { name: 'Feb', students: 300, bookings: 139, revenue: 2210 },
    { name: 'Mar', students: 200, bookings: 980, revenue: 2290 },
    { name: 'Apr', students: 278, bookings: 390, revenue: 2000 },
    { name: 'May', students: 189, bookings: 480, revenue: 2181 },
    { name: 'Jun', students: 239, bookings: 380, revenue: 2500 },
    { name: 'Jul', students: 349, bookings: 430, revenue: 2100 },
];

const pieData = [
    { name: 'School', value: 400, color: '#3b82f6' },
    { name: 'Photography', value: 300, color: '#8b5cf6' },
    { name: 'Builders', value: 300, color: '#f59e0b' },
];

const recentActivities = [
    { id: 1, user: 'Alex Johnson', action: 'Uploaded 5 banners', project: 'Builders Portal', time: '2 mins ago', status: 'completed' },
    { id: 2, user: 'Maria Garcia', action: 'New Student Enrollment', project: 'Global School', time: '15 mins ago', status: 'pending' },
    { id: 3, user: 'Steve Smith', action: 'Project Updated', project: 'Modern Villas', time: '1 hour ago', status: 'completed' },
    { id: 4, user: 'Sarah Wilson', action: 'New Gallery Added', project: 'Nature Photography', time: '3 hours ago', status: 'failed' },
    { id: 5, user: 'Robert Brown', action: 'Database Backup', project: 'System', time: '5 hours ago', status: 'completed' },
];

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);

    const stats = [
        { name: 'School Growth', icon: <School size={24} />, value: '+12.5%', color: '#3b82f6', bgColor: '#dbeafe', trend: 'up' },
        { name: 'Photography', icon: <Camera size={24} />, value: '85 New', color: '#8b5cf6', bgColor: '#ede9fe', trend: 'up' },
        { name: 'Build Projects', icon: <Hammer size={24} />, value: '24 Active', color: '#f59e0b', bgColor: '#fef3c7', trend: 'stable' },
        { name: 'Total Revenue', icon: <DollarSign size={24} />, value: '$45,285', color: '#10b981', bgColor: '#d1fae5', trend: 'up' },
    ];

    const domains = [
        { name: 'Global School', desc: 'Manage students, courses, and schedules.', icon: <School size={28} />, color: '#3b82f6', link: '/school' },
        { name: 'Focus Photography', desc: 'Gallery management and booking system.', icon: <Camera size={28} />, color: '#8b5cf6', link: '/photography' },
        { name: 'Elite Builders', desc: 'Project tracking and home banner updates.', icon: <Hammer size={28} />, color: '#f59e0b', link: '/builders' },
    ];

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem' }}>
            {/* Hero Section */}
            <div style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                marginBottom: '2.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                minHeight: '280px',
                display: 'flex',
                alignItems: 'center',
                background: `linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%), url(${dashboardHero})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>
                <div style={{ padding: '4rem', position: 'relative', zIndex: 1, color: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', background: 'rgba(255,255,255,0.1)', width: 'fit-content', padding: '4px 12px', borderRadius: '20px', fontSize: '0.875rem', backdropFilter: 'blur(4px)' }}>
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                        System Online
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.75rem', letterSpacing: '-0.025em' }}>
                        Dashboard Overview
                    </h1>
                    <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', lineHeight: '1.6' }}>
                        Welcome back! Your multi-domain control center is ready. Monitor growth, manage banners, and track performance across all platforms.
                    </p>
                </div>
            </div>

            {/* Performance Widgets */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2.5rem'
            }}>
                {stats.map((stat) => (
                    <div key={stat.name} style={{
                        backgroundColor: 'white',
                        padding: '1.5rem',
                        borderRadius: '20px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        border: '1px solid #f3f4f6',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{
                                backgroundColor: stat.bgColor,
                                color: stat.color,
                                padding: '0.8rem',
                                borderRadius: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {stat.icon}
                            </div>
                            <span style={{
                                fontSize: '0.9rem',
                                color: stat.trend === 'up' ? '#10b981' : '#6b7280',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 8px',
                                borderRadius: '8px',
                                background: stat.trend === 'up' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)'
                            }}>
                                {stat.trend === 'up' && <TrendingUp size={14} />}
                                {stat.value}
                            </span>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>
                                {stat.name}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                <span style={{ fontSize: '1.75rem', fontWeight: '800', color: '#111827' }}>
                                    {stat.name === 'Total Revenue' ? '$45,285' : Math.floor(Math.random() * 1000 + 500)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Domain Quick Access */}
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#111827' }}>Domain Management</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {domains.map((domain) => (
                        <div key={domain.name} style={{
                            backgroundColor: 'white',
                            padding: '1.5rem',
                            borderRadius: '20px',
                            border: '1px solid #f3f4f6',
                            display: 'flex',
                            gap: '1.25rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.02)';
                                e.currentTarget.style.borderColor = domain.color;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.borderColor = '#f3f4f6';
                            }}
                        >
                            <div style={{
                                color: domain.color,
                                padding: '1rem',
                                background: `${domain.color}15`,
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 'fit-content'
                            }}>
                                {domain.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827', marginBottom: '0.4rem' }}>{domain.name}</h4>
                                <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem' }}>{domain.desc}</p>
                                <div style={{ display: 'flex', alignItems: 'center', color: domain.color, fontWeight: '600', fontSize: '0.9rem' }}>
                                    Visit Portal <ChevronRight size={16} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Charts & Breakdown */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
                gap: '2rem',
                marginBottom: '2.5rem'
            }}>
                {/* Performance Chart */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: '24px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #f3f4f6'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#111827' }}>Enrollment vs Growth</h2>
                            <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>Visualizing student intake and portal bookings</p>
                        </div>
                        <div style={{ background: '#f9fafb', padding: '8px 12px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '600', color: '#6b7280' }}>
                            Last 6 Months
                        </div>
                    </div>
                    <div style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer>
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                                        padding: '16px'
                                    }}
                                />
                                <Area type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorStudents)" />
                                <Area type="monotone" dataKey="bookings" stroke="#8b5cf6" strokeWidth={4} strokeDasharray="5 5" fill="none" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status & Distribution */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: '24px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #f3f4f6',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#111827', marginBottom: '0.5rem' }}>Management Distribution</h2>
                    <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '2rem' }}>Domain resource allocation and activity level</p>

                    <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                        <div style={{ width: '50%', height: 250 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ width: '50%', paddingLeft: '2rem' }}>
                            {pieData.map((item) => (
                                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: item.color }}></div>
                                    <div>
                                        <p style={{ fontSize: '0.9rem', fontWeight: '700', color: '#111827', margin: 0 }}>{item.name}</p>
                                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>{Math.floor(item.value / 10)}% Allocation</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activities Table */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '24px',
                padding: '2rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                border: '1px solid #f3f4f6',
                marginBottom: '2.5rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827' }}>Recent Activities</h2>
                        <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>Real-time updates from your domain managers</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Search logs..."
                                style={{ padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
                            />
                        </div>
                        <button style={{ padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: '600', color: '#64748b' }}>
                            <Filter size={16} /> Filter
                        </button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>MANAGER</th>
                                <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>ACTION</th>
                                <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>PROJECT/DOMAIN</th>
                                <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>TIME</th>
                                <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>STATUS</th>
                                <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentActivities.map((activity) => (
                                <tr key={activity.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', color: '#64748b', fontSize: '0.75rem' }}>
                                                {activity.user.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <span style={{ fontWeight: '600', color: '#1e293b' }}>{activity.user}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem', color: '#475569', fontSize: '0.9rem' }}>{activity.action}</td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <span style={{ padding: '4px 10px', borderRadius: '6px', background: '#f8fafc', color: '#334155', fontSize: '0.8rem', fontWeight: '600', border: '1px solid #e2e8f0' }}>
                                            {activity.project}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Clock size={14} /> {activity.time}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            width: 'fit-content',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            textTransform: 'uppercase',
                                            backgroundColor: activity.status === 'completed' ? '#dcfce7' : activity.status === 'pending' ? '#fef3c7' : '#fee2e2',
                                            color: activity.status === 'completed' ? '#166534' : activity.status === 'pending' ? '#854d0e' : '#991b1b'
                                        }}>
                                            {activity.status === 'completed' ? <CheckCircle2 size={12} /> : activity.status === 'pending' ? <Clock size={12} /> : <AlertCircle size={12} />}
                                            {activity.status}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <button style={{ color: '#94a3b8', border: 'none', background: 'none', cursor: 'pointer' }}>
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* System Status Section */}
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#111827' }}>System Infrastructure</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {[
                        { name: 'Core Server', status: 'Optimal', icon: <Globe size={22} />, color: '#10b981', health: 99.8 },
                        { name: 'Database Clusters', status: 'Healthy', icon: <Database size={22} />, color: '#3b82f6', health: 100 },
                        { name: 'Security Firewall', status: 'Protected', icon: <ShieldCheck size={22} />, color: '#8b5cf6', health: 100 },
                    ].map((item) => (
                        <div key={item.name} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '20px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ color: item.color, padding: '10px', background: `${item.color}10`, borderRadius: '12px' }}>
                                    {item.icon}
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827', margin: 0 }}>{item.health}%</p>
                                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Uptime Score</p>
                                </div>
                            </div>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827', marginBottom: '0.25rem' }}>{item.name}</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: item.color, fontSize: '0.875rem', fontWeight: '600' }}>
                                <CheckCircle2 size={16} /> {item.status}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Actions Section */}
            <div style={{
                backgroundColor: '#0f172a',
                padding: '3rem',
                borderRadius: '32px',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '2rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0) 70%)', pointerEvents: 'none' }}></div>
                <div style={{ zIndex: 1 }}>
                    <h3 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.75rem' }}>Platform Maintenance</h3>
                    <p style={{ opacity: 0.7, fontSize: '1.1rem', maxWidth: '500px' }}>Access global configurations, user permissions, and deployment settings for all sub-domains.</p>
                </div>
                <div style={{ display: 'flex', gap: '1.25rem', zIndex: 1 }}>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '1.25rem 2.25rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        fontWeight: '700',
                        fontSize: '1.125rem',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#2563eb';
                            e.currentTarget.style.transform = 'translateY(-4px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#3b82f6';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <Upload size={22} />
                        Global Update
                    </button>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '1rem 1.75rem',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        fontWeight: '700',
                        fontSize: '1.125rem',
                        transition: 'all 0.3s ease',
                        backdropFilter: 'blur(10px)'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.transform = 'translateY(-4px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        View Clusters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
