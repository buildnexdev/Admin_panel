import { DollarSign, TrendingUp, TrendingDown, Calendar, Download, Plus } from 'lucide-react';

const RevenueReport = () => {
    return (
        <div style={{ padding: '0 0.5rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
                        Revenue Report
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                        Track your financial performance
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <select style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#334155', fontWeight: '500', fontSize: '0.9rem', outline: 'none', cursor: 'pointer' }}>
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                    </select>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backgroundColor: '#0f172a',
                        color: 'white',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: '500',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                    }}>
                        <Plus size={18} /> Add Entry
                    </button>
                </div>
            </div>

            {/* Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Total Revenue */}
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: '500' }}>Total Revenue</p>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#0f172a', margin: '0 0 0.5rem 0' }}>$870,000</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#22c55e', fontSize: '0.8rem', fontWeight: '600' }}>
                            <TrendingUp size={14} /> <span>2026</span>
                        </div>
                    </div>
                    <div style={{ backgroundColor: '#dcfce7', color: '#22c55e', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <DollarSign size={24} />
                    </div>
                </div>

                {/* Total Expenses */}
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: '500' }}>Total Expenses</p>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#0f172a', margin: '0 0 0.5rem 0' }}>$540,000</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', fontSize: '0.8rem', fontWeight: '600' }}>
                            <TrendingDown size={14} /> <span>2026</span>
                        </div>
                    </div>
                    <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <DollarSign size={24} />
                    </div>
                </div>

                {/* Net Profit */}
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: '500' }}>Net Profit</p>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#0f172a', margin: '0 0 0.5rem 0' }}>$330,000</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#3b82f6', fontSize: '0.8rem', fontWeight: '600' }}>
                            <span>37.9% margin</span>
                        </div>
                    </div>
                    <div style={{ backgroundColor: '#eff6ff', color: '#3b82f6', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TrendingUp size={24} />
                    </div>
                </div>

                {/* Total Projects */}
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: '500' }}>Total Projects</p>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#0f172a', margin: '0 0 0.5rem 0' }}>23</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#9333ea', fontSize: '0.8rem', fontWeight: '600' }}>
                            <span>Avg: $435,000</span>
                        </div>
                    </div>
                    <div style={{ backgroundColor: '#f3e8ff', color: '#9333ea', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Calendar size={24} />
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem' }}>Monthly Breakdown</h3>
                        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Detailed revenue and expense tracking</p>
                    </div>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backgroundColor: 'white',
                        color: '#475569',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontWeight: '500',
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                    }}>
                        <Download size={16} /> Export
                    </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Month</th>
                                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Revenue</th>
                                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Expenses</th>
                                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Profit</th>
                                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Margin</th>
                                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Projects</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid #f8fafc' }}>
                                <td style={{ padding: '1rem', color: '#334155' }}>February 2026</td>
                                <td style={{ padding: '1rem', color: '#22c55e', fontWeight: '500' }}>$450,000</td>
                                <td style={{ padding: '1rem', color: '#ef4444', fontWeight: '500' }}>$280,000</td>
                                <td style={{ padding: '1rem', color: '#3b82f6', fontWeight: '500' }}>$170,000</td>
                                <td style={{ padding: '1rem', color: '#22c55e', fontWeight: '500' }}>37.8%</td>
                                <td style={{ padding: '1rem', color: '#475569' }}>12</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f8fafc' }}>
                                <td style={{ padding: '1rem', color: '#334155' }}>January 2026</td>
                                <td style={{ padding: '1rem', color: '#22c55e', fontWeight: '500' }}>$420,000</td>
                                <td style={{ padding: '1rem', color: '#ef4444', fontWeight: '500' }}>$260,000</td>
                                <td style={{ padding: '1rem', color: '#3b82f6', fontWeight: '500' }}>$160,000</td>
                                <td style={{ padding: '1rem', color: '#22c55e', fontWeight: '500' }}>38.1%</td>
                                <td style={{ padding: '1rem', color: '#475569' }}>11</td>
                            </tr>
                            <tr style={{ backgroundColor: '#f8fafc', fontWeight: '600' }}>
                                <td style={{ padding: '1rem', color: '#0f172a' }}>Total</td>
                                <td style={{ padding: '1rem', color: '#22c55e' }}>$870,000</td>
                                <td style={{ padding: '1rem', color: '#ef4444' }}>$540,000</td>
                                <td style={{ padding: '1rem', color: '#3b82f6' }}>$330,000</td>
                                <td style={{ padding: '1rem', color: '#0f172a' }}>37.9%</td>
                                <td style={{ padding: '1rem', color: '#0f172a' }}>23</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RevenueReport;
