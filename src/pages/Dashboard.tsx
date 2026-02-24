import { School, Camera, Hammer, Upload, Image as ImageIcon, ChevronRight, Activity, Users, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);

    const stats = [
        { name: 'School', icon: <School size={24} />, color: '#6366f1', bgColor: '#e0e7ff', path: '/school', category: 'School' },
        { name: 'Photography', icon: <Camera size={24} />, color: '#a855f7', bgColor: '#f3e8ff', path: '/photography', category: 'Photography' },
        { name: 'Builders', icon: <Hammer size={24} />, color: '#f59e0b', bgColor: '#fef3c7', path: '/builders', category: 'Builders' },
    ];

    // Filter cards based on user category
    // If user category is null (SuperAdmin?), show all. Otherwise only show matched category.
    const filteredStats = stats.filter(stat => !user?.category || stat.category === user.category);

    const metrics = [
        { label: 'Total Visits', value: '12.5k', change: '+12%', icon: <Activity size={20} /> },
        { label: 'Active Users', value: '1,280', change: '+5%', icon: <Users size={20} /> },
        { label: 'Revenue', value: '$8,450', change: '+18%', icon: <CreditCard size={20} /> },
    ];

    return (
        <div style={{ width: '100%' }} className="animate-fade-in">


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

        </div>
    );
};

export default Dashboard;
