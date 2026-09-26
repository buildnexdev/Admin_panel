import { useMemo, useState } from 'react';
import { Plus, Ticket, Search, Inbox, Clock, CircleCheck, Timer } from 'lucide-react';
import PageShell, { DataTable, StatGrid, StatusBadge } from '../../components/PageShell';

const TICKETS = [
    { id: 'TK-2401', subject: 'Cannot upload banner images', requester: 'Client Portal', priority: 'High', status: 'Open', updated: '2h ago' },
    { id: 'TK-2402', subject: 'Quotation link expired', requester: 'Waas Photography', priority: 'Medium', status: 'In Progress', updated: '5h ago' },
    { id: 'TK-2403', subject: 'Need staff login reset', requester: 'Sneha Patel', priority: 'Low', status: 'Pending', updated: '1d ago' },
    { id: 'TK-2399', subject: 'Gallery images loading slowly', requester: 'Skyline Homes', priority: 'Medium', status: 'Open', updated: '1d ago' },
    { id: 'TK-2398', subject: 'Invoice PDF formatting', requester: 'Finance', priority: 'Medium', status: 'Closed', updated: '3d ago' },
];

const PRIORITY_CLASS: Record<string, string> = {
    High: 'ui-badge ui-badge--danger',
    Medium: 'ui-badge ui-badge--warning',
    Low: 'ui-badge ui-badge--info',
};

const FILTERS = ['All', 'Open', 'In Progress', 'Pending', 'Closed'];

export default function TicketsPage() {
    const [q, setQ] = useState('');
    const [tab, setTab] = useState('All');
    const [tickets] = useState(TICKETS);

    const filtered = useMemo(
        () =>
            tickets
                .filter((t) => (tab === 'All' ? true : t.status === tab))
                .filter((t) => `${t.id} ${t.subject} ${t.requester}`.toLowerCase().includes(q.toLowerCase())),
        [tickets, q, tab]
    );

    return (
        <PageShell
            title="Support tickets"
            subtitle="Every client and internal request, triaged by priority and status."
            icon={<Ticket size={22} />}
            accent="pink"
            actions={<button className="ui-btn ui-btn--primary" type="button"><Plus size={16} /> Create ticket</button>}
        >
            <StatGrid
                items={[
                    { label: 'Open', value: tickets.filter((t) => t.status === 'Open').length, tone: 'rose', icon: <Inbox size={17} /> },
                    { label: 'In progress', value: tickets.filter((t) => t.status === 'In Progress').length, tone: 'amber', icon: <Clock size={17} /> },
                    { label: 'Closed', value: tickets.filter((t) => t.status === 'Closed').length, tone: 'emerald', icon: <CircleCheck size={17} /> },
                    { label: 'Avg first response', value: '4h', tone: 'indigo', icon: <Timer size={17} /> },
                ]}
            />

            <div className="toolbar">
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                    {FILTERS.map((f) => (
                        <button
                            key={f}
                            type="button"
                            onClick={() => setTab(f)}
                            className={tab === f ? 'ui-btn ui-btn--primary ui-btn--sm' : 'ui-btn ui-btn--secondary ui-btn--sm'}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
                    <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        className="ui-input"
                        style={{ paddingLeft: '2.4rem' }}
                        placeholder="Search tickets…"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                </div>
            </div>

            <DataTable
                headers={['Ticket', 'Subject', 'Requester', 'Priority', 'Status', 'Updated']}
                rows={filtered.map((t) => [
                    <span key="id" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent-pink)' }}>{t.id}</span>,
                    <strong key="s">{t.subject}</strong>,
                    t.requester,
                    <span key="p" className={PRIORITY_CLASS[t.priority]}>{t.priority}</span>,
                    <StatusBadge key="st" status={t.status} />,
                    <span key="u" style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{t.updated}</span>,
                ])}
                empty="No tickets in this view — nice work."
            />
        </PageShell>
    );
}
