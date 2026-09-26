import { useMemo, useState } from 'react';
import { Plus, Filter, CheckSquare, Clock, CircleCheck, AlertOctagon, Search } from 'lucide-react';
import PageShell, { DataTable, StatGrid, StatusBadge } from '../../components/PageShell';

const TASKS = [
    { id: 'T-101', title: 'Update home banners', assignee: 'Sneha Patel', priority: 'High', status: 'In Progress', due: '2026-09-20' },
    { id: 'T-102', title: 'Prepare client quotation', assignee: 'Rahul Mehta', priority: 'High', status: 'Pending', due: '2026-09-19' },
    { id: 'T-103', title: 'Review blog draft', assignee: 'Aisha Khan', priority: 'Low', status: 'Review', due: '2026-09-22' },
    { id: 'T-104', title: 'Close monthly accounts', assignee: 'Vikram Shah', priority: 'Medium', status: 'Done', due: '2026-09-15' },
    { id: 'T-105', title: 'Shoot gallery photos for Skyline', assignee: 'Sneha Patel', priority: 'Medium', status: 'In Progress', due: '2026-09-24' },
    { id: 'T-106', title: 'Follow up on pending invoices', assignee: 'Vikram Shah', priority: 'High', status: 'Pending', due: '2026-09-18' },
];

const PRIORITY_CLASS: Record<string, string> = {
    High: 'ui-badge ui-badge--danger',
    Medium: 'ui-badge ui-badge--warning',
    Low: 'ui-badge ui-badge--info',
};

export default function TasksPage() {
    const [status, setStatus] = useState('all');
    const [q, setQ] = useState('');
    const [tasks] = useState(TASKS);

    const filtered = useMemo(
        () =>
            tasks
                .filter((t) => (status === 'all' ? true : t.status.toLowerCase() === status))
                .filter((t) => `${t.id} ${t.title} ${t.assignee}`.toLowerCase().includes(q.toLowerCase())),
        [tasks, status, q]
    );

    const done = tasks.filter((t) => t.status === 'Done').length;
    const progress = Math.round((done / tasks.length) * 100);

    return (
        <PageShell
            title="Task board"
            subtitle="Assign work, track progress, and keep the team moving in one place."
            icon={<CheckSquare size={22} />}
            accent="emerald"
            actions={<button className="ui-btn ui-btn--primary" type="button"><Plus size={16} /> New task</button>}
        >
            <StatGrid
                items={[
                    { label: 'Open tasks', value: tasks.length - done, tone: 'violet', icon: <CheckSquare size={17} /> },
                    { label: 'In progress', value: tasks.filter((t) => t.status === 'In Progress').length, tone: 'amber', icon: <Clock size={17} /> },
                    { label: 'Completed', value: done, tone: 'emerald', icon: <CircleCheck size={17} />, trend: `${progress}%` },
                    { label: 'Overdue', value: 0, tone: 'rose', icon: <AlertOctagon size={17} /> },
                ]}
            />

            <div className="ui-card card-rise" style={{ padding: '1.1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '0.88rem' }}>Sprint completion</strong>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{progress}%</span>
                </div>
                <div style={{ height: 10, borderRadius: 999, background: 'var(--surface-secondary)', overflow: 'hidden' }}>
                    <span style={{
                        display: 'block',
                        height: '100%',
                        width: `${progress}%`,
                        borderRadius: 999,
                        background: 'var(--gradient-forest)',
                        animation: 'growWidth 0.9s var(--ease-out) both',
                    }} />
                </div>
            </div>

            <div className="toolbar">
                <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
                    <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        className="ui-input"
                        style={{ paddingLeft: '2.4rem' }}
                        placeholder="Search tasks or assignees…"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                </div>
                <Filter size={16} color="var(--text-secondary)" />
                <select className="ui-select" style={{ maxWidth: 190 }} value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="all">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                </select>
            </div>

            <DataTable
                headers={['ID', 'Task', 'Assignee', 'Priority', 'Status', 'Due']}
                rows={filtered.map((t) => [
                    <span key="id" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--primary)' }}>{t.id}</span>,
                    <strong key="t">{t.title}</strong>,
                    t.assignee,
                    <span key="p" className={PRIORITY_CLASS[t.priority]}>{t.priority}</span>,
                    <StatusBadge key="s" status={t.status} />,
                    new Date(t.due).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                ])}
                empty="No tasks match this filter."
            />
        </PageShell>
    );
}
