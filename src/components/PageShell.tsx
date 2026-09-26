import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AlertTriangle, Inbox, RefreshCw } from 'lucide-react';

export type Accent =
    | 'brand' | 'violet' | 'indigo' | 'sky' | 'cyan' | 'emerald'
    | 'amber' | 'rose' | 'pink' | 'blue' | 'green' | 'default';

const ACCENT_GRADIENT: Record<string, string> = {
    brand: 'var(--gradient-forest)',
    violet: 'var(--gradient-candy)',
    indigo: 'var(--gradient-ocean)',
    blue: 'var(--gradient-ocean)',
    sky: 'linear-gradient(135deg, #38BDF8, #0284C7)',
    cyan: 'linear-gradient(135deg, #22D3EE, #0891B2)',
    emerald: 'var(--gradient-forest)',
    green: 'var(--gradient-forest)',
    amber: 'var(--gradient-gold)',
    rose: 'var(--gradient-sunset)',
    pink: 'var(--gradient-sunset)',
    default: 'var(--gradient-forest)',
};

type PageShellProps = {
    title: string;
    subtitle?: string;
    /** Icon shown in the gradient tile beside the title */
    icon?: ReactNode;
    /** Colour theme for the page accent */
    accent?: Accent;
    actions?: ReactNode;
    children: ReactNode;
    className?: string;
};

/** Shared responsive page wrapper with colourful header + entrance animation */
export default function PageShell({
    title,
    subtitle,
    icon,
    accent = 'brand',
    actions,
    children,
    className = '',
}: PageShellProps) {
    return (
        <div className={`page-shell page-enter ${className}`}>
            <div className="page-header">
                <div className="page-head-main">
                    {icon && (
                        <span className="page-head-icon" style={{ background: ACCENT_GRADIENT[accent] }}>
                            {icon}
                        </span>
                    )}
                    <div style={{ minWidth: 0 }}>
                        <h1 className="page-title">{title}</h1>
                        {subtitle && <p className="page-subtitle">{subtitle}</p>}
                    </div>
                </div>
                {actions && <div className="page-actions">{actions}</div>}
            </div>
            {children}
        </div>
    );
}

/** Small heading with a coloured bar — for sections inside a page */
export function SectionHeading({ title, hint, right }: { title: string; hint?: string; right?: ReactNode }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.9rem', flexWrap: 'wrap' }}>
            <div>
                <h2 className="section-heading" style={{ marginBottom: hint ? '0.15rem' : 0 }}>
                    <span className="section-heading__bar" />
                    {title}
                </h2>
                {hint && <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '1rem' }}>{hint}</p>}
            </div>
            {right}
        </div>
    );
}

export function DataTable({
    headers,
    rows,
    empty = 'No records yet.',
    loading = false,
}: {
    headers: string[];
    rows: ReactNode[][];
    empty?: ReactNode;
    loading?: boolean;
}) {
    return (
        <div className="ui-card table-wrap">
            <div className="table-scroll">
                <table className="data-table">
                    <thead>
                        <tr>
                            {headers.map((h) => (
                                <th key={h}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={`sk-${i}`}>
                                    {headers.map((h) => (
                                        <td key={h}>
                                            <div className="ui-skeleton" style={{ height: 14, width: `${55 + ((i * 13 + h.length * 7) % 40)}%` }} />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : rows.length === 0 ? (
                            <tr>
                                <td colSpan={headers.length} style={{ border: 'none' }}>
                                    <EmptyState message={empty} />
                                </td>
                            </tr>
                        ) : (
                            rows.map((cells, i) => (
                                <tr key={i} className="row-fade" style={{ animationDelay: `${i * 0.04}s` }}>
                                    {cells.map((cell, j) => (
                                        <td key={j}>{cell}</td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export type StatItem = {
    label: string;
    value: string | number;
    tone?: Accent;
    icon?: ReactNode;
    trend?: string;
    trendDown?: boolean;
};

export function StatGrid({ items }: { items: StatItem[] }) {
    return (
        <div className="stat-grid">
            {items.map((item, i) => (
                <div
                    key={item.label}
                    className={`stat-card stat-card--${item.tone || 'default'} card-rise`}
                    style={{ animationDelay: `${i * 0.06}s` }}
                >
                    {(item.icon || item.trend) && (
                        <div className="stat-card__head">
                            {item.icon ? <span className="stat-card__icon">{item.icon}</span> : <span />}
                            {item.trend && (
                                <span className={`stat-card__trend${item.trendDown ? ' stat-card__trend--down' : ''}`}>
                                    {item.trend}
                                </span>
                            )}
                        </div>
                    )}
                    <div className="stat-card__value">
                        <CountUp value={item.value} />
                    </div>
                    <div className="stat-card__label">{item.label}</div>
                </div>
            ))}
        </div>
    );
}

/** Animates numeric portions of a value (keeps any prefix/suffix such as ₹ or +) */
export function CountUp({ value, duration = 900 }: { value: string | number; duration?: number }) {
    const text = String(value);
    const match = text.match(/^(\D*?)([\d,.]+)(.*)$/);
    const target = match ? Number(match[2].replace(/,/g, '')) : NaN;
    const [display, setDisplay] = useState(Number.isFinite(target) ? 0 : null);
    const frame = useRef(0);

    useEffect(() => {
        if (!Number.isFinite(target)) return;
        const start = performance.now();
        const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(target * eased);
            if (p < 1) frame.current = requestAnimationFrame(tick);
        };
        frame.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame.current);
    }, [target, duration]);

    if (!match || display === null) return <>{text}</>;

    const decimals = match[2].includes('.') ? match[2].split('.')[1].length : 0;
    const shown = display.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    return <>{match[1]}{shown}{match[3]}</>;
}

export function StatusBadge({ status }: { status: string }) {
    const key = String(status || '').toLowerCase().replace(/\s+/g, '-');
    return <span className={`status-badge status-badge--${key}`}>{status}</span>;
}

export function EmptyState({
    message = 'Nothing here yet.',
    title = 'No records found',
    action,
}: {
    message?: ReactNode;
    title?: string;
    action?: ReactNode;
}) {
    return (
        <div className="empty-state">
            <div className="state-icon"><Inbox size={26} /></div>
            <div className="state-title">{title}</div>
            <div className="state-text">{message}</div>
            {action}
        </div>
    );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
    return (
        <div className="empty-state" style={{ borderColor: '#FECDD3' }}>
            <div className="state-icon state-icon--danger"><AlertTriangle size={26} /></div>
            <div className="state-title">Something went wrong</div>
            <div className="state-text">{message}</div>
            {onRetry && (
                <button type="button" className="ui-btn ui-btn--primary" onClick={onRetry}>
                    <RefreshCw size={15} /> Try again
                </button>
            )}
        </div>
    );
}

/** Coloured surface card with optional title/icon — for page sections */
export function SectionCard({
    title,
    icon,
    accent = 'brand',
    right,
    children,
    padded = true,
}: {
    title?: string;
    icon?: ReactNode;
    accent?: Accent;
    right?: ReactNode;
    children: ReactNode;
    padded?: boolean;
}) {
    return (
        <div className="ui-card card-rise" style={{ overflow: 'hidden', marginBottom: '1rem' }}>
            {title && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    padding: '0.9rem 1.1rem',
                    borderBottom: '1px solid var(--border)',
                    background: 'linear-gradient(180deg, var(--surface-tinted), var(--surface))',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                        {icon && (
                            <span style={{
                                width: 30, height: 30, borderRadius: 'var(--radius-md)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', background: ACCENT_GRADIENT[accent], flexShrink: 0,
                            }}>
                                {icon}
                            </span>
                        )}
                        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>{title}</h3>
                    </div>
                    {right}
                </div>
            )}
            <div style={{ padding: padded ? '1.1rem' : 0 }}>{children}</div>
        </div>
    );
}
