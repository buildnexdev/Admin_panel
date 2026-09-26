import { useMemo, useState } from 'react';
import { Plus, Download, Wallet, TrendingUp, TrendingDown, AlertTriangle, Search } from 'lucide-react';
import PageShell, { DataTable, StatGrid, StatusBadge, SectionCard } from '../../components/PageShell';

const LEDGER = [
    { id: 'INV-8841', party: 'Nova Retail', type: 'Invoice', amount: 125000, date: '2026-09-12', status: 'Paid' },
    { id: 'INV-8842', party: 'Skyline Homes', type: 'Invoice', amount: 78500, date: '2026-09-14', status: 'Pending' },
    { id: 'EXP-220', party: 'AWS Cloud', type: 'Expense', amount: 18200, date: '2026-09-10', status: 'Paid' },
    { id: 'INV-8840', party: 'Pixel Studio', type: 'Invoice', amount: 42000, date: '2026-09-08', status: 'Overdue' },
    { id: 'EXP-221', party: 'Adobe Creative Cloud', type: 'Expense', amount: 4800, date: '2026-09-05', status: 'Paid' },
    { id: 'INV-8839', party: 'Waas Photography', type: 'Invoice', amount: 36000, date: '2026-09-02', status: 'Paid' },
];

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const MONTHS = [
    { label: 'May', income: 52, expense: 28 },
    { label: 'Jun', income: 64, expense: 31 },
    { label: 'Jul', income: 71, expense: 34 },
    { label: 'Aug', income: 58, expense: 30 },
    { label: 'Sep', income: 83, expense: 39 },
];

export default function AccountsPage() {
    const [rows] = useState(LEDGER);
    const [q, setQ] = useState('');
    const [type, setType] = useState('all');

    const filtered = useMemo(
        () =>
            rows
                .filter((r) => (type === 'all' ? true : r.type.toLowerCase() === type))
                .filter((r) => `${r.id} ${r.party}`.toLowerCase().includes(q.toLowerCase())),
        [rows, q, type]
    );

    const invoiced = rows.filter(r => r.type === 'Invoice').reduce((s, r) => s + r.amount, 0);
    const collected = rows.filter(r => r.type === 'Invoice' && r.status === 'Paid').reduce((s, r) => s + r.amount, 0);
    const expenses = rows.filter(r => r.type === 'Expense').reduce((s, r) => s + r.amount, 0);
    const overdue = rows.filter(r => r.status === 'Overdue').reduce((s, r) => s + r.amount, 0);

    return (
        <PageShell
            title="Accounts"
            subtitle="Invoices, expenses and payment health for the current period."
            icon={<Wallet size={22} />}
            accent="emerald"
            actions={
                <>
                    <button className="ui-btn ui-btn--secondary" type="button"><Download size={16} /> Export</button>
                    <button className="ui-btn ui-btn--primary" type="button"><Plus size={16} /> New entry</button>
                </>
            }
        >
            <StatGrid
                items={[
                    { label: 'Total invoiced', value: inr(invoiced), tone: 'indigo', icon: <Wallet size={17} /> },
                    { label: 'Collected', value: inr(collected), tone: 'emerald', icon: <TrendingUp size={17} />, trend: '+12%' },
                    { label: 'Expenses', value: inr(expenses), tone: 'amber', icon: <TrendingDown size={17} />, trend: '+4%', trendDown: true },
                    { label: 'Overdue', value: inr(overdue), tone: 'rose', icon: <AlertTriangle size={17} /> },
                ]}
            />

            <SectionCard title="Income vs expenses (last 5 months)" icon={<TrendingUp size={15} />} accent="emerald">
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.1rem', height: 170, padding: '0 0.25rem' }}>
                    {MONTHS.map((m, i) => (
                        <div key={m.label} style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 6, height: 130 }}>
                                <span
                                    title={`Income ₹${m.income}K`}
                                    style={{
                                        width: '38%',
                                        height: `${m.income}%`,
                                        borderRadius: '6px 6px 0 0',
                                        background: 'var(--gradient-forest)',
                                        animation: `fadeInUp 0.6s var(--ease-out) ${i * 0.08}s both`,
                                    }}
                                />
                                <span
                                    title={`Expense ₹${m.expense}K`}
                                    style={{
                                        width: '38%',
                                        height: `${m.expense}%`,
                                        borderRadius: '6px 6px 0 0',
                                        background: 'var(--gradient-gold)',
                                        animation: `fadeInUp 0.6s var(--ease-out) ${i * 0.08 + 0.05}s both`,
                                    }}
                                />
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{m.label}</span>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.85rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--gradient-forest)' }} /> Income
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--gradient-gold)' }} /> Expense
                    </span>
                </div>
            </SectionCard>

            <div className="toolbar">
                <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
                    <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        className="ui-input"
                        style={{ paddingLeft: '2.4rem' }}
                        placeholder="Search by reference or party…"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                </div>
                <select className="ui-select" style={{ maxWidth: 170 }} value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="all">All entries</option>
                    <option value="invoice">Invoices</option>
                    <option value="expense">Expenses</option>
                </select>
            </div>

            <DataTable
                headers={['Reference', 'Party', 'Type', 'Amount', 'Date', 'Status']}
                rows={filtered.map((r) => [
                    <span key="id" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--primary)' }}>{r.id}</span>,
                    <strong key="p">{r.party}</strong>,
                    <span key="t" className={r.type === 'Invoice' ? 'ui-badge ui-badge--info' : 'ui-badge ui-badge--warning'}>{r.type}</span>,
                    <span key="a" style={{ fontWeight: 700, color: r.type === 'Invoice' ? 'var(--accent-emerald)' : 'var(--accent-orange)' }}>
                        {r.type === 'Invoice' ? '+' : '−'}{inr(r.amount)}
                    </span>,
                    new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                    <StatusBadge key="s" status={r.status} />,
                ])}
                empty="No ledger entries match this filter."
            />
        </PageShell>
    );
}
