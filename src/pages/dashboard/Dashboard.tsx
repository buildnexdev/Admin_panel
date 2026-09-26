import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    FolderOpen, Briefcase, FileText, DollarSign, LayoutGrid, ArrowUpRight,
    Mail, Users, Ticket, RefreshCw, Clock, Plus, Building2, CalendarDays,
} from 'lucide-react';
import type { AppDispatch, RootState } from '../../store/store';
import { fetchMenu } from '../../store/slices/menuSlice';
import { contentCMSService, getQuotationList } from '../../services/api';
import { CountUp, ErrorState } from '../../components/PageShell';
import './Dashboard.css';

const QUICK_LINKS = [
    { name: 'Upload Project', path: '/upload-project', icon: FolderOpen },
    { name: 'Create Quote', path: '/quotation-create', icon: DollarSign },
    { name: 'Banners', path: '/upload-home-banners', icon: LayoutGrid },
    { name: 'Write Blog', path: '/blog', icon: FileText },
    { name: 'Services', path: '/services', icon: Briefcase },
    { name: 'Staff', path: '/staff', icon: Users },
    { name: 'Tickets', path: '/tickets', icon: Ticket },
    { name: 'Enquiries', path: '/contact-info', icon: Mail },
];

type Counts = {
    projects: number;
    banners: number;
    services: number;
    blogs: number;
    quotations: number;
    messages: number;
    quoteValue: number;
    recentQuotes: { name: string; price: number; date?: string }[];
    recentProjects: { title: string; category?: string; date?: string }[];
};

const EMPTY: Counts = {
    projects: 0, banners: 0, services: 0, blogs: 0, quotations: 0, messages: 0,
    quoteValue: 0, recentQuotes: [], recentProjects: [],
};

const asArray = (res: any): any[] => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.data?.data)) return res.data.data;
    if (Array.isArray(res?.result)) return res.result;
    return [];
};

const inr = (n: number) =>
    n >= 10000000 ? `₹${(n / 10000000).toFixed(1)}Cr`
        : n >= 100000 ? `₹${(n / 100000).toFixed(1)}L`
            : n >= 1000 ? `₹${Math.round(n / 1000)}K`
                : `₹${n}`;

export default function Dashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const name = user?.name?.split(' ')[0] || 'there';
    const companyID = user?.companyID;

    const [counts, setCounts] = useState<Counts>(EMPTY);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (companyID) dispatch(fetchMenu(companyID));
    }, [dispatch, companyID]);

    const load = useCallback(async () => {
        if (!companyID) { setLoading(false); return; }
        setLoading(true);
        setError(null);
        try {
            const [projects, banners, services, blogs, quotes, messages] = await Promise.allSettled([
                contentCMSService.getProjects(companyID),
                contentCMSService.getBanners(companyID),
                contentCMSService.getServices(companyID),
                contentCMSService.getBlogs(companyID),
                getQuotationList({ userId: user?.userId }),
                contentCMSService.getContactMessages(companyID),
            ]);

            const projectList = projects.status === 'fulfilled' ? asArray(projects.value) : [];
            const bannerList = banners.status === 'fulfilled' ? asArray(banners.value) : [];
            const serviceList = services.status === 'fulfilled' ? asArray(services.value) : [];
            const blogList = blogs.status === 'fulfilled' ? asArray(blogs.value) : [];
            const quoteList = quotes.status === 'fulfilled' ? asArray(quotes.value) : [];
            const messageList = messages.status === 'fulfilled' ? asArray(messages.value) : [];

            const quoteValue = quoteList.reduce((sum, q) => sum + (Number(q.grandTotal ?? q.total ?? q.price) || 0), 0);
            const recentQuotes = quoteList.slice(0, 5).map((q) => ({
                name: q.clientName || q.name || q.customerName || 'Client',
                price: Number(q.grandTotal ?? q.total ?? q.price) || 0,
                date: q.createdOn || q.createdAt || q.date,
            }));
            const recentProjects = projectList.slice(0, 5).map((p) => ({
                title: p.title || p.projectName || p.name || 'Untitled',
                category: p.category || p.categoryName,
                date: p.createdOn || p.createdAt || p.date,
            }));

            setCounts({
                projects: projectList.length,
                banners: bannerList.length,
                services: serviceList.length,
                blogs: blogList.length,
                quotations: quoteList.length,
                messages: messageList.length,
                quoteValue,
                recentQuotes,
                recentProjects,
            });
        } catch (e: any) {
            setError(e?.message || 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    }, [companyID, user?.userId]);

    useEffect(() => { load(); }, [load]);

    const kpis = useMemo(() => [
        { label: 'PROJECTS', value: counts.projects, icon: <FolderOpen size={18} />, to: '/manage-projects', highlight: true },
        { label: 'QUOTATIONS', value: counts.quotations, icon: <DollarSign size={18} />, to: '/quotation', highlight: false },
        { label: 'SERVICES', value: counts.services, icon: <Briefcase size={18} />, to: '/services', highlight: false },
        { label: 'ENQUIRIES', value: counts.messages, icon: <Mail size={18} />, to: '/contact-info', highlight: false },
    ], [counts]);

    const contentMix = useMemo(() => {
        const rows = [
            { label: 'Projects', value: counts.projects },
            { label: 'Banners', value: counts.banners },
            { label: 'Services', value: counts.services },
            { label: 'Blogs', value: counts.blogs },
        ];
        const max = Math.max(1, ...rows.map((r) => r.value));
        return rows.map((r) => ({ ...r, pct: Math.round((r.value / max) * 100) }));
    }, [counts]);

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="dash page-enter">
            <div className="dash-intro">
                <div>
                    <p className="dash-intro__hello">{greeting()}, {name}</p>
                    <p className="dash-intro__sub">
                        {user?.companyName || 'Your company'} · live workspace overview
                    </p>
                </div>
                <button type="button" className="ui-btn ui-btn--secondary ui-btn--sm" onClick={load} disabled={loading}>
                    <RefreshCw size={14} className={loading ? 'dash-spin' : ''} /> Refresh
                </button>
            </div>

            {error && (
                <div style={{ marginBottom: '1rem' }}>
                    <ErrorState message={error} onRetry={load} />
                </div>
            )}

            <section className="dash-kpis">
                {kpis.map((k) => (
                    <Link key={k.label} to={k.to} className={`dash-kpi${k.highlight ? ' is-hot' : ''}`}>
                        <span className="dash-kpi__top">
                            <span className="dash-kpi__icon">{k.icon}</span>
                            <span className="dash-kpi__label">{k.label}</span>
                        </span>
                        <span className="dash-kpi__val">
                            {loading ? '—' : <CountUp value={k.value} />}
                        </span>
                    </Link>
                ))}
            </section>

            <section className="dash-grid">
                <div className="dash-card dash-card--wide">
                    <div className="dash-card__head">
                        <h3>Content mix</h3>
                    </div>
                    <div className="dash-bars">
                        {contentMix.map((row) => (
                            <div key={row.label} className="dash-bar">
                                <div className="dash-bar__top">
                                    <span>{row.label}</span>
                                    <strong>{loading ? '—' : row.value}</strong>
                                </div>
                                <div className="dash-bar__track">
                                    <span style={{ width: loading ? '8%' : `${Math.max(4, row.pct)}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dash-card">
                    <div className="dash-card__head">
                        <h3>Pipeline</h3>
                    </div>
                    <div className="dash-pipeline">
                        <Building2 size={18} />
                        <div>
                            <strong>{loading ? '—' : inr(counts.quoteValue)}</strong>
                            <p>Quotation value</p>
                        </div>
                    </div>
                    <div className="dash-pipeline dash-pipeline--muted">
                        <CalendarDays size={18} />
                        <div>
                            <strong>{loading ? '—' : counts.banners}</strong>
                            <p>Active banners</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="dash-grid">
                <div className="dash-card dash-card--wide">
                    <div className="dash-card__head">
                        <h3>Quick actions</h3>
                    </div>
                    <div className="dash-actions">
                        {QUICK_LINKS.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link key={item.path} to={item.path} className="dash-action">
                                    <span className="dash-action__icon"><Icon size={16} /></span>
                                    <span>{item.name}</span>
                                    <ArrowUpRight size={14} className="dash-action__arrow" />
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="dash-card">
                    <div className="dash-card__head">
                        <h3>Recent quotations</h3>
                        <Link to="/quotation-create" className="dash-card__link"><Plus size={12} /> New</Link>
                    </div>
                    <ul className="dash-list">
                        {loading ? (
                            <li className="dash-list__empty">Loading…</li>
                        ) : counts.recentQuotes.length === 0 ? (
                            <li className="dash-list__empty">No recent quotations.</li>
                        ) : (
                            counts.recentQuotes.map((q, i) => (
                                <li key={`${q.name}-${i}`}>
                                    <span className="dash-list__avatar">{q.name.charAt(0).toUpperCase()}</span>
                                    <span className="dash-list__body">
                                        <strong>{q.name}</strong>
                                        <span><Clock size={11} /> {q.date ? new Date(q.date).toLocaleDateString('en-IN') : 'Recent'}</span>
                                    </span>
                                    <em>{inr(q.price)}</em>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </section>

            <section className="dash-card">
                <div className="dash-card__head">
                    <h3>Latest projects</h3>
                    <Link to="/manage-projects" className="dash-card__link">View all</Link>
                </div>
                <div className="dash-projects">
                    {loading ? (
                        <p className="dash-list__empty">Loading…</p>
                    ) : counts.recentProjects.length === 0 ? (
                        <p className="dash-list__empty">No projects yet.</p>
                    ) : (
                        counts.recentProjects.map((p, i) => (
                            <div key={`${p.title}-${i}`} className="dash-project">
                                <span>{(p.category || 'General').toString()}</span>
                                <strong>{p.title}</strong>
                                <p>{p.date ? new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</p>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <footer className="dash-foot">
                <span>© {new Date().getFullYear()} BuildNexDev</span>
                <span>ADMIN PANEL · INTERNAL</span>
            </footer>
        </div>
    );
}
