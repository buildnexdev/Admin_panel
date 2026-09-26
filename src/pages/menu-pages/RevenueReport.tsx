import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    DollarSign, TrendingUp, BarChart3, RefreshCw, Download, FileText, Target,
} from 'lucide-react';
import type { RootState } from '../../store/store';
import { getQuotationList } from '../../services/api';
import PageShell, { DataTable, StatGrid, ErrorState, SectionCard } from '../../components/PageShell';

type Quote = {
    token?: string;
    client_name?: string;
    clientName?: string;
    project_details?: string;
    price?: number | string;
    created_at?: string;
    createdAt?: string;
};

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const inr = (n: number) =>
    n >= 10000000 ? `₹${(n / 10000000).toFixed(2)}Cr`
        : n >= 100000 ? `₹${(n / 100000).toFixed(2)}L`
            : `₹${Math.round(n).toLocaleString('en-IN')}`;

export default function RevenueReport() {
    const { user } = useSelector((state: RootState) => state.auth);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [year, setYear] = useState(new Date().getFullYear());

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const list = await getQuotationList({ userId: user?.userId });
            setQuotes(Array.isArray(list) ? list : []);
        } catch (e: any) {
            setError(e?.response?.data?.message || e?.message || 'Unable to load quotation data.');
        } finally {
            setLoading(false);
        }
    }, [user?.userId]);

    useEffect(() => { load(); }, [load]);

    const priceOf = (q: Quote) => Number(q.price ?? 0) || 0;
    const dateOf = (q: Quote) => q.created_at || q.createdAt;

    const years = useMemo(() => {
        const set = new Set<number>([new Date().getFullYear()]);
        quotes.forEach((q) => {
            const d = dateOf(q);
            if (d) set.add(new Date(d).getFullYear());
        });
        return [...set].sort((a, b) => b - a);
    }, [quotes]);

    const inYear = useMemo(
        () => quotes.filter((q) => {
            const d = dateOf(q);
            return d ? new Date(d).getFullYear() === year : false;
        }),
        [quotes, year],
    );

    const monthly = useMemo(() => {
        const totals = new Array(12).fill(0);
        inYear.forEach((q) => {
            const d = dateOf(q);
            if (d) totals[new Date(d).getMonth()] += priceOf(q);
        });
        const max = Math.max(1, ...totals);
        return totals.map((v, i) => ({ label: MONTH_LABELS[i], value: v, pct: Math.round((v / max) * 100) }));
    }, [inYear]);

    const total = inYear.reduce((s, q) => s + priceOf(q), 0);
    const avg = inYear.length ? total / inYear.length : 0;
    const best = monthly.reduce((a, b) => (b.value > a.value ? b : a), monthly[0] ?? { label: '—', value: 0, pct: 0 });
    const undated = quotes.length - inYear.length;

    const exportCsv = () => {
        const rows = [
            ['Client', 'Project', 'Amount', 'Date'],
            ...inYear.map((q) => [
                q.client_name || q.clientName || '',
                (q.project_details || '').replace(/[\r\n,]+/g, ' '),
                String(priceOf(q)),
                dateOf(q) || '',
            ]),
        ];
        const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
        const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = `revenue-${year}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <PageShell
            title="Revenue report"
            subtitle="Quotation value across the year, calculated from live quotation records."
            icon={<DollarSign size={22} />}
            accent="amber"
            actions={
                <>
                    <select className="ui-select" style={{ maxWidth: 120 }} value={year} onChange={(e) => setYear(Number(e.target.value))}>
                        {years.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <button className="ui-btn ui-btn--secondary" type="button" onClick={load}>
                        <RefreshCw size={16} className={loading ? 'dash-spin' : ''} /> Refresh
                    </button>
                    <button className="ui-btn ui-btn--primary" type="button" onClick={exportCsv} disabled={!inYear.length}>
                        <Download size={16} /> Export CSV
                    </button>
                </>
            }
        >
            <StatGrid
                items={[
                    { label: `Total value (${year})`, value: inr(total), tone: 'emerald', icon: <TrendingUp size={17} /> },
                    { label: 'Quotations raised', value: inYear.length, tone: 'indigo', icon: <FileText size={17} /> },
                    { label: 'Average value', value: inr(avg), tone: 'violet', icon: <Target size={17} /> },
                    { label: `Best month (${best?.label ?? '—'})`, value: inr(best?.value ?? 0), tone: 'amber', icon: <BarChart3 size={17} /> },
                ]}
            />

            {error ? (
                <ErrorState message={error} onRetry={load} />
            ) : (
                <>
                    <SectionCard title={`Monthly quotation value — ${year}`} icon={<BarChart3 size={15} />} accent="amber">
                        {loading ? (
                            <div className="ui-skeleton" style={{ height: 190 }} />
                        ) : (
                            <>
                                <div className="rev-chart">
                                    {monthly.map((m, i) => (
                                        <div key={m.label} className="rev-col" title={`${m.label}: ${inr(m.value)}`}>
                                            <div className="rev-col__track">
                                                <span
                                                    className="rev-col__bar"
                                                    style={{
                                                        height: `${Math.max(2, m.pct)}%`,
                                                        animationDelay: `${i * 0.04}s`,
                                                    }}
                                                />
                                            </div>
                                            <span className="rev-col__label">{m.label}</span>
                                        </div>
                                    ))}
                                </div>
                                {total === 0 && (
                                    <p style={{ margin: '0.85rem 0 0', fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                                        No quotation value recorded for {year} yet
                                        {undated > 0 ? ` (${undated} quotation${undated > 1 ? 's' : ''} fall outside this year).` : '.'}
                                    </p>
                                )}
                            </>
                        )}
                    </SectionCard>

                    <DataTable
                        loading={loading}
                        headers={['Client', 'Project', 'Amount', 'Date']}
                        rows={inYear
                            .slice()
                            .sort((a, b) => new Date(dateOf(b) || 0).getTime() - new Date(dateOf(a) || 0).getTime())
                            .map((q) => [
                                <strong key="c">{q.client_name || q.clientName || 'Client'}</strong>,
                                <span key="p" style={{ color: 'var(--text-secondary)' }}>
                                    {(q.project_details || '—').slice(0, 70)}
                                </span>,
                                <span key="a" style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>{inr(priceOf(q))}</span>,
                                dateOf(q) ? new Date(dateOf(q)!).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—',
                            ])}
                        empty={`No quotations recorded for ${year}.`}
                    />
                </>
            )}

            <style>{`
                .rev-chart {
                    display: flex;
                    align-items: flex-end;
                    gap: 0.5rem;
                    height: 200px;
                }
                .rev-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.4rem; height: 100%; }
                .rev-col__track {
                    flex: 1;
                    width: 100%;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    background: var(--surface-secondary);
                    border-radius: 8px 8px 4px 4px;
                    overflow: hidden;
                }
                .rev-col__bar {
                    display: block;
                    width: 72%;
                    border-radius: 6px 6px 0 0;
                    background: var(--gradient-gold);
                    animation: fadeInUp 0.6s var(--ease-out) both;
                    transition: filter 0.2s;
                }
                .rev-col:hover .rev-col__bar { filter: brightness(1.1) saturate(1.2); }
                .rev-col__label { font-size: 0.72rem; font-weight: 600; color: var(--text-secondary); }
                @media (max-width: 600px) {
                    .rev-chart { height: 160px; gap: 0.25rem; }
                    .rev-col__label { font-size: 0.6rem; }
                }
            `}</style>
        </PageShell>
    );
}
