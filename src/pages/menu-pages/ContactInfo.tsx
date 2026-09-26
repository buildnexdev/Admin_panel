import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Phone, Mail, MessageSquare, Search, RefreshCw, Inbox, Building2, Clock, AtSign,
} from 'lucide-react';
import type { RootState } from '../../store/store';
import { contentCMSService } from '../../services/api';
import PageShell, { DataTable, StatGrid, ErrorState, SectionCard } from '../../components/PageShell';

type Message = {
    id?: number;
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
    createdAt?: string;
    created_at?: string;
};

const asArray = (res: any): Message[] => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.data?.data)) return res.data.data;
    return [];
};

const startOfToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
};

export default function ContactInfo() {
    const { user } = useSelector((state: RootState) => state.auth);
    const companyID = user?.companyID;

    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [q, setQ] = useState('');
    const [open, setOpen] = useState<Message | null>(null);

    const load = useCallback(async () => {
        if (!companyID) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await contentCMSService.getContactMessages(companyID);
            setMessages(asArray(res));
        } catch (e: any) {
            setError(e?.response?.data?.message || e?.message || 'Unable to load enquiries.');
        } finally {
            setLoading(false);
        }
    }, [companyID]);

    useEffect(() => { load(); }, [load]);

    const dateOf = (m: Message) => m.createdAt || m.created_at;

    const filtered = useMemo(
        () =>
            messages.filter((m) =>
                `${m.name || ''} ${m.email || ''} ${m.subject || ''} ${m.message || ''}`
                    .toLowerCase()
                    .includes(q.toLowerCase()),
            ),
        [messages, q],
    );

    const todayCount = messages.filter((m) => {
        const d = dateOf(m);
        return d ? new Date(d).getTime() >= startOfToday() : false;
    }).length;
    const uniqueSenders = new Set(messages.map((m) => (m.email || m.name || '').toLowerCase()).filter(Boolean)).size;

    return (
        <PageShell
            title="Contact & enquiries"
            subtitle="Every message submitted through your public website, isolated to your company."
            icon={<Phone size={22} />}
            accent="cyan"
            actions={
                <button className="ui-btn ui-btn--secondary" type="button" onClick={load}>
                    <RefreshCw size={16} className={loading ? 'dash-spin' : ''} /> Refresh
                </button>
            }
        >
            <StatGrid
                items={[
                    { label: 'Total enquiries', value: messages.length, tone: 'cyan', icon: <Inbox size={17} /> },
                    { label: 'Received today', value: todayCount, tone: 'emerald', icon: <Clock size={17} /> },
                    { label: 'Unique senders', value: uniqueSenders, tone: 'violet', icon: <AtSign size={17} /> },
                    { label: 'Company', value: user?.companyName || '—', tone: 'indigo', icon: <Building2 size={17} /> },
                ]}
            />

            <div className="toolbar">
                <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
                    <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        className="ui-input"
                        style={{ paddingLeft: '2.4rem' }}
                        placeholder="Search name, email, subject or message…"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                </div>
                <span className="ui-badge ui-badge--primary">{filtered.length} shown</span>
            </div>

            {error ? (
                <ErrorState message={error} onRetry={load} />
            ) : (
                <DataTable
                    loading={loading}
                    headers={['From', 'Email', 'Subject', 'Received', '']}
                    rows={filtered.map((m, i) => [
                        <strong key="n">{m.name || 'Anonymous'}</strong>,
                        <a key="e" href={`mailto:${m.email || ''}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>
                            {m.email || '—'}
                        </a>,
                        m.subject || '—',
                        <span key="d" style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                            {dateOf(m) ? new Date(dateOf(m)!).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                        </span>,
                        <button
                            key={`b-${i}`}
                            type="button"
                            className="ui-btn ui-btn--secondary ui-btn--sm"
                            onClick={() => setOpen(m)}
                        >
                            <MessageSquare size={14} /> Read
                        </button>,
                    ])}
                    empty="No enquiries yet. Messages from your website contact form will appear here."
                />
            )}

            {open && (
                <div className="ci-overlay" onClick={() => setOpen(null)}>
                    <div className="ci-modal" onClick={(e) => e.stopPropagation()}>
                        <span className="ci-modal__bar" />
                        <h3>{open.subject || 'Enquiry'}</h3>
                        <p className="ci-modal__meta">
                            <span><strong>{open.name || 'Anonymous'}</strong></span>
                            {open.email && (
                                <a href={`mailto:${open.email}`}>
                                    <Mail size={13} /> {open.email}
                                </a>
                            )}
                        </p>
                        <p className="ci-modal__body">{open.message || 'No message content.'}</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <button type="button" className="ui-btn ui-btn--secondary" onClick={() => setOpen(null)}>Close</button>
                            {open.email && (
                                <a className="ui-btn ui-btn--primary" href={`mailto:${open.email}?subject=Re: ${encodeURIComponent(open.subject || 'Your enquiry')}`}>
                                    <Mail size={15} /> Reply
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div style={{ marginTop: '1.25rem' }}>
                <SectionCard title="Where these come from" icon={<Inbox size={15} />} accent="cyan">
                    <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        Your public site posts to <code>POST /content/contact</code> with your company ID. This page reads
                        them back through <code>GET /content/contact/{'{companyID}'}</code>, so nothing here is sample data —
                        if the table is empty, no one has submitted the form yet.
                    </p>
                </SectionCard>
            </div>

            <style>{`
                .ci-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 10000;
                    background: rgba(22, 24, 43, 0.5);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    animation: fadeIn 0.2s ease both;
                }
                .ci-modal {
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                    max-width: 520px;
                    background: var(--surface);
                    border-radius: var(--radius-xl);
                    padding: 1.6rem;
                    box-shadow: 0 30px 60px -12px rgba(22, 24, 43, 0.35);
                    animation: popIn 0.28s var(--ease-spring) both;
                }
                .ci-modal__bar {
                    position: absolute;
                    inset: 0 0 auto 0;
                    height: 4px;
                    background: linear-gradient(90deg, #22D3EE, #0891B2, #7C3AED);
                }
                .ci-modal h3 {
                    margin: 0 0 0.5rem;
                    font-size: 1.15rem;
                    font-weight: 800;
                }
                .ci-modal__meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.75rem;
                    margin: 0 0 1rem;
                    padding-bottom: 0.85rem;
                    border-bottom: 1px solid var(--border);
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                }
                .ci-modal__meta a {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.3rem;
                    color: var(--primary);
                    font-weight: 600;
                    text-decoration: none;
                }
                .ci-modal__body {
                    margin: 0 0 1.35rem;
                    font-size: 0.92rem;
                    line-height: 1.65;
                    color: var(--text-primary);
                    white-space: pre-wrap;
                    word-break: break-word;
                }
            `}</style>
        </PageShell>
    );
}
