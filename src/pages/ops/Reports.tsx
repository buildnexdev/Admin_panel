import PageShell, { StatGrid, SectionCard } from '../../components/PageShell';
import { BarChart3, TrendingUp, Users, FileText, FileBarChart, Download, Ticket, Wallet } from 'lucide-react';

const REPORTS = [
    { title: 'Revenue overview', desc: 'Monthly revenue against target', icon: TrendingUp, tone: 'emerald' },
    { title: 'Staff productivity', desc: 'Tasks completed per assignee', icon: Users, tone: 'violet' },
    { title: 'Ticket SLA', desc: 'Response and resolution times', icon: Ticket, tone: 'rose' },
    { title: 'Quotation conversion', desc: 'Quotes sent versus accepted', icon: FileText, tone: 'indigo' },
    { title: 'Expense breakdown', desc: 'Where the money went this month', icon: Wallet, tone: 'amber' },
    { title: 'Content activity', desc: 'Projects, blogs and banners added', icon: BarChart3, tone: 'cyan' },
];

const BARS = [
    { label: 'Projects', pct: 78, tone: 'violet' },
    { label: 'Quotations', pct: 62, tone: 'emerald' },
    { label: 'Support', pct: 91, tone: 'rose' },
    { label: 'Accounts', pct: 54, tone: 'amber' },
];

export default function ReportsPage() {
    return (
        <PageShell
            title="Reports & insights"
            subtitle="Business intelligence across sales, delivery, support and finance."
            icon={<FileBarChart size={22} />}
            accent="sky"
            actions={
                <>
                    <button className="ui-btn ui-btn--secondary" type="button"><Download size={16} /> Export all</button>
                    <button className="ui-btn ui-btn--primary" type="button">Generate report</button>
                </>
            }
        >
            <StatGrid
                items={[
                    { label: 'Revenue (MTD)', value: '₹8.7L', tone: 'emerald', icon: <TrendingUp size={17} />, trend: '+18%' },
                    { label: 'Quotes sent', value: 24, tone: 'indigo', icon: <FileText size={17} />, trend: '+6' },
                    { label: 'Win rate', value: '38%', tone: 'amber', icon: <BarChart3 size={17} /> },
                    { label: 'Open tickets', value: 7, tone: 'rose', icon: <Ticket size={17} />, trend: '−2', trendDown: false },
                ]}
            />

            <div className="reports-grid">
                {REPORTS.map((r, i) => {
                    const Icon = r.icon;
                    return (
                        <button
                            key={r.title}
                            type="button"
                            className={`report-card card-rise report-card--${r.tone}`}
                            style={{ animationDelay: `${i * 0.06}s` }}
                        >
                            <span className="report-card__icon"><Icon size={21} /></span>
                            <span className="report-card__title">{r.title}</span>
                            <span className="report-card__desc">{r.desc}</span>
                        </button>
                    );
                })}
            </div>

            <div style={{ marginTop: '1.25rem' }}>
                <SectionCard title="Performance snapshot" icon={<BarChart3 size={15} />} accent="sky">
                    <div className="bars">
                        {BARS.map((b, i) => (
                            <div key={b.label} className="bar-row">
                                <div className="bar-row__label">{b.label}</div>
                                <div className="bar-row__track">
                                    <div
                                        className={`bar-row__fill bar-row__fill--${b.tone}`}
                                        style={{ width: `${b.pct}%`, animationDelay: `${i * 0.1}s` }}
                                    />
                                </div>
                                <div className="bar-row__pct">{b.pct}%</div>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            </div>

            <style>{`
                .reports-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
                    gap: 0.9rem;
                }
                .report-card {
                    position: relative;
                    overflow: hidden;
                    text-align: left;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    padding: 1.2rem;
                    cursor: pointer;
                    font-family: inherit;
                    box-shadow: var(--shadow-sm);
                    transition: transform 0.22s var(--ease-out), box-shadow 0.22s;
                }
                .report-card::after {
                    content: '';
                    position: absolute;
                    right: -30px; bottom: -30px;
                    width: 88px; height: 88px;
                    border-radius: 50%;
                    background: var(--primary-light);
                    opacity: 0.5;
                    transition: transform 0.3s var(--ease-out);
                }
                .report-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
                .report-card:hover::after { transform: scale(1.4); }
                .report-card:hover .report-card__icon { transform: rotate(-8deg) scale(1.08); }
                .report-card__icon {
                    position: relative;
                    z-index: 1;
                    width: 44px; height: 44px;
                    border-radius: var(--radius-md);
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 0.85rem;
                    color: #fff;
                    background: var(--gradient-brand);
                    box-shadow: var(--shadow-color);
                    transition: transform 0.25s var(--ease-spring);
                }
                .report-card--emerald .report-card__icon { background: var(--gradient-forest); }
                .report-card--violet .report-card__icon { background: var(--gradient-candy); }
                .report-card--rose .report-card__icon { background: var(--gradient-sunset); }
                .report-card--indigo .report-card__icon { background: var(--gradient-ocean); }
                .report-card--amber .report-card__icon { background: var(--gradient-gold); }
                .report-card--cyan .report-card__icon { background: linear-gradient(135deg, #22D3EE, #0891B2); }
                .report-card--emerald::after { background: var(--accent-emerald-light); }
                .report-card--violet::after { background: var(--accent-violet-light); }
                .report-card--rose::after { background: var(--accent-rose-light); }
                .report-card--indigo::after { background: var(--accent-indigo-light); }
                .report-card--amber::after { background: var(--accent-amber-light); }
                .report-card--cyan::after { background: var(--accent-cyan-light); }
                .report-card__title {
                    position: relative;
                    z-index: 1;
                    display: block;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 0.25rem;
                }
                .report-card__desc {
                    position: relative;
                    z-index: 1;
                    display: block;
                    font-size: 0.82rem;
                    color: var(--text-secondary);
                }
                .bars { display: flex; flex-direction: column; gap: 0.9rem; }
                .bar-row { display: grid; grid-template-columns: 110px 1fr 48px; gap: 0.75rem; align-items: center; }
                .bar-row__label { font-size: 0.85rem; color: var(--text-secondary); font-weight: 600; }
                .bar-row__track { height: 10px; background: var(--surface-secondary); border-radius: 99px; overflow: hidden; }
                .bar-row__fill {
                    height: 100%;
                    border-radius: 99px;
                    background: var(--gradient-brand);
                    animation: growWidth 0.9s var(--ease-out) both;
                }
                .bar-row__fill--violet { background: var(--gradient-candy); }
                .bar-row__fill--emerald { background: var(--gradient-forest); }
                .bar-row__fill--rose { background: var(--gradient-sunset); }
                .bar-row__fill--amber { background: var(--gradient-gold); }
                .bar-row__pct { font-size: 0.82rem; font-weight: 800; color: var(--text-primary); text-align: right; }
                @media (max-width: 560px) {
                    .bar-row { grid-template-columns: 1fr; gap: 0.3rem; }
                    .bar-row__pct { text-align: left; }
                }
            `}</style>
        </PageShell>
    );
}
