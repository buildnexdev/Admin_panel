import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import { fetchMenu } from '../../store/slices/menuSlice';
import './Dashboard.css';

const SERVICES = [
    { id: '01', title: 'Web Applications', desc: 'Complex, scalable web apps built with modern stacks. React, Node, cloud-ready.', tag: 'Full Stack' },
    { id: '02', title: 'Website Design', desc: 'Conversion-focused websites with cinematic UI and pixel-perfect execution.', tag: 'UI/UX' },
    { id: '03', title: 'Mobile Apps', desc: 'iOS & Android apps with fluid interfaces and native performance.', tag: 'Mobile' },
    { id: '04', title: 'SaaS Products', desc: 'End-to-end product development — wireframe to launch-ready platform.', tag: 'Product' },
    { id: '05', title: 'API & Backend', desc: 'Robust REST APIs, microservices, and database architecture that scales.', tag: 'Backend' },
    { id: '06', title: 'UI/UX Design', desc: 'Research-driven design systems and prototypes that users love.', tag: 'Design' },
];

const SOCIALS = [
    {
        name: 'Instagram', handle: '@buildnex.dev', href: 'https://www.instagram.com/buildnexdev?igsh=MTQzenF4cXpkOTMwag==',
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" /></svg>,
    },
    {
        name: 'LinkedIn', handle: 'BuildNex', href: 'https://www.linkedin.com/in/buildnex-dev-3518a93ab',
        icon: <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>,
    },
    {
        name: 'GitHub', handle: 'buildnexdev', href: 'https://github.com/buildnexdev',
        icon: <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>,
    },
    {
        name: 'Portfolio', handle: 'buildnexdev.co.in', href: 'https://buildnexdev.co.in/',
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    },
];

const STATS = [
    { value: '50+', label: 'Projects' },
    { value: '30+', label: 'Clients' },
    { value: '5★', label: 'Rating' },
    { value: '3yr', label: 'Experience' },
];

/* ── Geometric logo: interlocking squares with emerald accent ── */
const BnxLogo = () => (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* back square — offset */}
        <rect x="10" y="10" width="24" height="24" rx="4" fill="rgba(37, 99, 235, 0.08)" stroke="#2563EB" strokeWidth="1.5" />
        {/* front square — offset */}
        <rect x="4" y="4" width="24" height="24" rx="4" fill="#ffffff" stroke="#2563EB" strokeWidth="2" />
        {/* inner accent square */}
        <rect x="9" y="9" width="14" height="14" rx="2.5" fill="#2563EB" />
        {/* white B letter */}
        <text x="11.5" y="21" fontFamily="'Bebas Neue',sans-serif" fontSize="12" fill="#ffffff" letterSpacing="0">B</text>
        {/* corner dot */}
        <circle cx="39" cy="5" r="3" fill="#2563EB" />
        <circle cx="39" cy="5" r="5" fill="none" stroke="#2563EB" strokeWidth="1" opacity="0.35" />
    </svg>
);

const ArrowDiag = () => (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" width="12" height="12">
        <path d="M2 12L12 2M12 2H5M12 2v7" />
    </svg>
);

export default function Dashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const name = user?.name?.split(' ')[0] || 'there';
    const [activeService, setActiveService] = useState(0);

    // Fetch menu items on first load
    useEffect(() => {
        if (user?.companyID) {
            dispatch(fetchMenu(user.companyID));
        }
    }, [dispatch, user?.companyID]);

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Morning';
        if (h < 18) return 'Afternoon';
        return 'Evening';
    };

    return (
        <div className="bnx-wrap">

            {/* TICKER */}
            <div className="bnx-ticker">
                <div className="bnx-ticker-track">
                    {[...Array(2)].flatMap((_, ri) =>
                        ['Web Apps', 'Mobile', 'SaaS Platforms', 'UI/UX', 'Backend', 'Websites', 'APIs', 'Design Systems'].map((t, i) => (
                            <span key={`${ri}-${i}`} className="bnx-ticker-item">
                                <span className="bnx-ticker-dot" />{t}
                            </span>
                        ))
                    )}
                </div>
            </div>

            {/* BODY */}
            <div className="bnx-body">

                {/* ── LEFT ── */}
                <div className="bnx-left">

                    {/* Brand */}
                    <div className="bnx-brand-header">
                        <BnxLogo />
                        <div>
                            <div className="bnx-brand-name">
                                <span className="bnx-name-build">BUILD</span><span className="bnx-name-nex">NEX</span>
                            </div>
                            <div className="bnx-brand-sub">Digital Product Studio</div>
                        </div>
                    </div>

                    <div className="bnx-rule" />

                    {/* Greeting */}
                    <div>
                        <div className="bnx-eyebrow">Good {greeting()}, {name}</div>
                        <p className="bnx-tagline">
                            We craft digital experiences that convert visitors into customers — and turn ideas into shipped products.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="bnx-stats-row">
                        {STATS.map((s, i) => (
                            <div key={i} className="bnx-stat">
                                <span className="bnx-stat-val">{s.value}</span>
                                <span className="bnx-stat-lbl">{s.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="bnx-rule" />

                    {/* Socials */}
                    <div className="bnx-section-label">Connect with us</div>
                    <div className="bnx-socials">
                        {SOCIALS.map((s) => (
                            <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className="bnx-social-pill">
                                <span className="bnx-social-icon">{s.icon}</span>
                                <span className="bnx-social-info">
                                    <span className="bnx-social-name">{s.name}</span>
                                    <span className="bnx-social-handle">{s.handle}</span>
                                </span>
                                <span className="bnx-social-arrow"><ArrowDiag /></span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* ── RIGHT ── */}
                <div className="bnx-right">
                    <div className="bnx-section-label">What we build</div>

                    <div className="bnx-services">
                        {SERVICES.map((svc, i) => (
                            <div
                                key={svc.id}
                                className={`bnx-svc-row${activeService === i ? ' active' : ''}`}
                                onMouseEnter={() => setActiveService(i)}
                                style={{ animationDelay: `${i * 0.07}s` }}
                            >
                                <span className="bnx-svc-num">{svc.id}</span>
                                <div className="bnx-svc-body">
                                    <div className="bnx-svc-title">{svc.title}</div>
                                    <div className="bnx-svc-desc">{svc.desc}</div>
                                </div>
                                <span className="bnx-svc-tag">{svc.tag}</span>
                            </div>
                        ))}
                    </div>

                    <a href="mailto:buildnexdev@gmail.com" className="bnx-cta">
                        <div className="bnx-cta-left">
                            <span className="bnx-cta-label">Ready to build something great?</span>
                            <span className="bnx-cta-email">buildnexdev@gmail.com</span>
                        </div>
                        <span className="bnx-cta-icon"><ArrowDiag /></span>
                    </a>
                </div>

            </div>
        </div>
    );
}
