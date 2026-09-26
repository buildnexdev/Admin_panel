import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    User, Phone, Lock, Building2, Shield, BadgeCheck, Save,
    CheckCircle2, AlertTriangle, Settings as SettingsIcon, LayoutGrid,
} from 'lucide-react';
import type { RootState } from '../../store/store';
import PageShell, { SectionCard } from '../../components/PageShell';
import { UserloginService } from '../../services/api';

export default function Profile() {
    const { user } = useSelector((state: RootState) => state.auth);
    const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [saving, setSaving] = useState(false);
    const [ok, setOk] = useState<string | null>(null);
    const [err, setErr] = useState<string | null>(null);

    const initial = (user?.name || 'A').trim().charAt(0).toUpperCase();

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setOk(null);
        setErr(null);

        if (form.newPassword.length < 8) {
            setErr('New password must be at least 8 characters long.');
            return;
        }
        if (form.newPassword !== form.confirmPassword) {
            setErr('New password and confirmation do not match.');
            return;
        }

        setSaving(true);
        try {
            await UserloginService.changePassword({
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
            });
            setOk('Your password has been updated.');
            setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (e: any) {
            setErr(e?.response?.data?.message || e?.message || 'Could not update your password.');
        } finally {
            setSaving(false);
        }
    };

    const details = [
        { label: 'Full name', value: user?.name || '—', icon: User },
        { label: 'Phone number', value: String(user?.phoneNumber || '—'), icon: Phone },
        { label: 'Company', value: user?.companyName || '—', icon: Building2 },
        { label: 'Role', value: user?.role || '—', icon: Shield },
        { label: 'Group', value: user?.category || 'Standard', icon: LayoutGrid },
        { label: 'Account ID', value: user?.userId ? `#${user.userId}` : '—', icon: BadgeCheck },
    ];

    return (
        <PageShell
            title="My profile"
            subtitle="Your account details as stored on the server, plus password management."
            icon={<User size={22} />}
            accent="emerald"
            actions={<Link to="/settings" className="ui-btn ui-btn--secondary"><SettingsIcon size={16} /> Settings</Link>}
        >
            <div className="profile-banner">
                <span className="profile-banner__glow" />
                <div className="profile-banner__avatar">{initial}</div>
                <div className="profile-banner__meta">
                    <h2>{user?.name || 'Admin user'}</h2>
                    <p>
                        <span className="profile-chip">{user?.role || 'User'}</span>
                        <span className="profile-chip profile-chip--ghost">
                            <Building2 size={13} /> {user?.companyName || 'Company'}
                        </span>
                        <span className="profile-chip profile-chip--ok">
                            <CheckCircle2 size={13} /> Active
                        </span>
                    </p>
                </div>
            </div>

            <div className="profile-grid">
                <SectionCard title="Account details" icon={<BadgeCheck size={15} />} accent="emerald">
                    <div className="profile-details">
                        {details.map((d) => {
                            const Icon = d.icon;
                            return (
                                <div key={d.label} className="profile-detail">
                                    <span className="profile-detail__icon"><Icon size={15} /></span>
                                    <span>
                                        <small>{d.label}</small>
                                        <strong>{d.value}</strong>
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <p className="profile-note">
                        Name, phone and company are managed by your administrator. Ask them to update these values.
                    </p>
                </SectionCard>

                <SectionCard title="Change password" icon={<Lock size={15} />} accent="rose">
                    {ok && <div className="profile-alert profile-alert--ok"><CheckCircle2 size={16} /> {ok}</div>}
                    {err && <div className="profile-alert profile-alert--err"><AlertTriangle size={16} /> {err}</div>}

                    <form onSubmit={submit} style={{ display: 'grid', gap: '0.85rem' }}>
                        <div>
                            <label className="ui-label" htmlFor="p-cur">Current password</label>
                            <input
                                id="p-cur"
                                className="ui-input"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={form.currentPassword}
                                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="ui-label" htmlFor="p-new">New password</label>
                            <input
                                id="p-new"
                                className="ui-input"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={form.newPassword}
                                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="ui-label" htmlFor="p-cf">Confirm new password</label>
                            <input
                                id="p-cf"
                                className="ui-input"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={form.confirmPassword}
                                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                            />
                        </div>
                        <button className="ui-btn ui-btn--primary" type="submit" disabled={saving}>
                            <Save size={16} /> {saving ? 'Updating…' : 'Update password'}
                        </button>
                    </form>
                </SectionCard>
            </div>

            <style>{`
                .profile-banner {
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    gap: 1.15rem;
                    padding: 1.5rem 1.75rem;
                    margin-bottom: 1.25rem;
                    border-radius: var(--radius-xl);
                    color: #fff;
                    background: linear-gradient(120deg, #0A2214 0%, #0F2E1C 35%, var(--primary) 70%, #0E9F8E 100%);
                    background-size: 180% 180%;
                    animation: gradientShift 14s ease infinite, fadeInUp 0.45s var(--ease-out) both;
                    box-shadow: 0 18px 44px rgba(27, 122, 78, 0.28);
                }
                .profile-banner__glow {
                    position: absolute;
                    width: 240px; height: 240px;
                    border-radius: 50%;
                    background: rgba(110, 231, 183, 0.35);
                    filter: blur(55px);
                    right: -50px; top: -90px;
                    animation: floatY 9s ease-in-out infinite;
                }
                .profile-banner__avatar {
                    position: relative;
                    z-index: 1;
                    width: 74px; height: 74px;
                    flex-shrink: 0;
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-family: var(--font-display);
                    font-size: 1.9rem;
                    font-weight: 800;
                    background: rgba(255,255,255,0.18);
                    border: 2px solid rgba(255,255,255,0.35);
                    backdrop-filter: blur(6px);
                }
                .profile-banner__meta { position: relative; z-index: 1; min-width: 0; }
                .profile-banner__meta h2 {
                    margin: 0 0 0.5rem;
                    font-size: 1.4rem;
                    font-weight: 800;
                    color: #fff;
                    letter-spacing: -0.02em;
                }
                .profile-banner__meta p { margin: 0; display: flex; flex-wrap: wrap; gap: 0.4rem; }
                .profile-chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.3rem;
                    padding: 0.28rem 0.65rem;
                    border-radius: 999px;
                    font-size: 0.74rem;
                    font-weight: 700;
                    text-transform: capitalize;
                    background: rgba(255,255,255,0.22);
                    border: 1px solid rgba(255,255,255,0.3);
                }
                .profile-chip--ghost { background: rgba(255,255,255,0.12); }
                .profile-chip--ok { background: rgba(74, 222, 128, 0.25); border-color: rgba(74, 222, 128, 0.45); }

                .profile-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 1rem;
                    align-items: start;
                }
                .profile-details { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .profile-detail { display: flex; align-items: flex-start; gap: 0.6rem; }
                .profile-detail__icon {
                    width: 30px; height: 30px;
                    flex-shrink: 0;
                    border-radius: 9px;
                    display: flex; align-items: center; justify-content: center;
                    background: var(--primary-light);
                    color: var(--primary);
                }
                .profile-detail small {
                    display: block;
                    font-size: 0.7rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                    color: var(--text-muted);
                }
                .profile-detail strong {
                    font-size: 0.92rem;
                    color: var(--text-primary);
                    text-transform: capitalize;
                    word-break: break-word;
                }
                .profile-note {
                    margin: 1.1rem 0 0;
                    padding-top: 0.9rem;
                    border-top: 1px dashed var(--border);
                    font-size: 0.78rem;
                    color: var(--text-muted);
                }
                .profile-alert {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                    padding: 0.7rem 0.9rem;
                    border-radius: var(--radius-md);
                    font-size: 0.85rem;
                    animation: fadeInDown 0.3s var(--ease-out) both;
                }
                .profile-alert--ok { background: var(--success-light); color: #047857; border: 1px solid #A7F3D0; }
                .profile-alert--err { background: var(--danger-light); color: #BE123C; border: 1px solid #FECDD3; }

                @media (max-width: 620px) {
                    .profile-banner { flex-direction: column; text-align: center; padding: 1.35rem; }
                    .profile-banner__meta p { justify-content: center; }
                    .profile-details { grid-template-columns: 1fr; }
                }
            `}</style>
        </PageShell>
    );
}
