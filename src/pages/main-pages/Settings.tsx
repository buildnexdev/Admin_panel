import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Building2, Lock, Save, Bell, Palette, Shield, Users, Ticket,
    CheckSquare, Wallet, FileBarChart, UserCog, Settings as SettingsIcon,
    CheckCircle2, AlertTriangle,
} from 'lucide-react';
import type { RootState } from '../../store/store';
import PageShell, { SectionCard } from '../../components/PageShell';
import { UserloginService } from '../../services/api';

const MODULES = [
    { name: 'Staff', path: '/staff', icon: Users, tone: 'rose' },
    { name: 'Roles', path: '/roles', icon: UserCog, tone: 'violet' },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare, tone: 'emerald' },
    { name: 'Tickets', path: '/tickets', icon: Ticket, tone: 'pink' },
    { name: 'Accounts', path: '/accounts', icon: Wallet, tone: 'amber' },
    { name: 'Reports', path: '/reports', icon: FileBarChart, tone: 'sky' },
];

export default function SettingsPage() {
    const { user } = useSelector((state: RootState) => state.auth);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [prefs, setPrefs] = useState({ emailNotif: true, ticketAlert: true, compactNav: false });

    const handlePasswordChange = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (passwordData.newPassword.length < 8) {
            setError('New password must be at least 8 characters long.');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New password and confirmation do not match.');
            return;
        }

        setLoading(true);
        try {
            await UserloginService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            setSuccess('Password updated successfully.');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || 'Could not update password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageShell
            title="Settings"
            subtitle="Account security, notification preferences, and shortcuts to every module."
            icon={<SettingsIcon size={22} />}
            accent="indigo"
        >
            <div className="settings-mods stagger">
                {MODULES.map((m) => {
                    const Icon = m.icon;
                    return (
                        <Link key={m.path} to={m.path} className={`settings-mod settings-mod--${m.tone}`}>
                            <span className="settings-mod__icon"><Icon size={17} /></span>
                            {m.name}
                        </Link>
                    );
                })}
            </div>

            <div className="settings-grid">
                <SectionCard title="Company profile" icon={<Building2 size={15} />} accent="indigo">
                    <div className="settings-info">
                        <div>
                            <span>Group</span>
                            <strong>{user?.category || 'Standard'} Group</strong>
                        </div>
                        <div>
                            <span>Phone</span>
                            <strong>{user?.phoneNumber || '—'}</strong>
                        </div>
                        <div>
                            <span>Role</span>
                            <strong style={{ textTransform: 'capitalize' }}>{user?.role || 'Admin'}</strong>
                        </div>
                        <div>
                            <span>Company</span>
                            <strong>{user?.companyName || 'BuildNexDev'}</strong>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard title="Security" icon={<Lock size={15} />} accent="rose">
                    {success && (
                        <div className="settings-alert settings-alert--ok">
                            <CheckCircle2 size={16} /> {success}
                        </div>
                    )}
                    {error && (
                        <div className="settings-alert settings-alert--err">
                            <AlertTriangle size={16} /> {error}
                        </div>
                    )}
                    <form onSubmit={handlePasswordChange} style={{ display: 'grid', gap: '0.85rem' }}>
                        <div>
                            <label className="ui-label" htmlFor="cur-pw">Current password</label>
                            <input
                                id="cur-pw"
                                className="ui-input"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="ui-label" htmlFor="new-pw">New password</label>
                            <input
                                id="new-pw"
                                className="ui-input"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            />
                            <p style={{ margin: '0.3rem 0 0', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                                Use at least 8 characters with a mix of letters and numbers.
                            </p>
                        </div>
                        <div>
                            <label className="ui-label" htmlFor="cf-pw">Confirm password</label>
                            <input
                                id="cf-pw"
                                className="ui-input"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            />
                        </div>
                        <button className="ui-btn ui-btn--primary" type="submit" disabled={loading}>
                            <Save size={16} /> {loading ? 'Saving…' : 'Update password'}
                        </button>
                    </form>
                </SectionCard>

                <SectionCard title="Notifications & appearance" icon={<Bell size={15} />} accent="amber">
                    {[
                        { key: 'emailNotif' as const, label: 'Email notifications', hint: 'Daily summary of activity', icon: Shield },
                        { key: 'ticketAlert' as const, label: 'Ticket alerts', hint: 'Ping me on new support tickets', icon: Ticket },
                        { key: 'compactNav' as const, label: 'Compact sidebar', hint: 'Show icons only by default', icon: Palette },
                    ].map((item) => (
                        <label key={item.key} className="pref-row">
                            <span className="pref-row__main">
                                <span className="pref-row__icon"><item.icon size={15} /></span>
                                <span>
                                    <strong>{item.label}</strong>
                                    <small>{item.hint}</small>
                                </span>
                            </span>
                            <span className={`pref-toggle${prefs[item.key] ? ' pref-toggle--on' : ''}`}>
                                <input
                                    type="checkbox"
                                    checked={prefs[item.key]}
                                    onChange={(e) => setPrefs({ ...prefs, [item.key]: e.target.checked })}
                                />
                                <span className="pref-toggle__knob" />
                            </span>
                        </label>
                    ))}
                </SectionCard>
            </div>

            <style>{`
                .settings-mods {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                    gap: 0.65rem;
                    margin-bottom: 1.25rem;
                }
                .settings-mod {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    padding: 0.8rem 0.95rem;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    text-decoration: none;
                    color: var(--text-primary);
                    font-weight: 600;
                    font-size: 0.88rem;
                    box-shadow: var(--shadow-sm);
                    transition: transform 0.2s var(--ease-out), box-shadow 0.2s;
                }
                .settings-mod:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
                .settings-mod:hover .settings-mod__icon { transform: rotate(-8deg) scale(1.08); }
                .settings-mod__icon {
                    width: 32px; height: 32px;
                    border-radius: 9px;
                    display: flex; align-items: center; justify-content: center;
                    color: #fff;
                    background: var(--gradient-brand);
                    transition: transform 0.25s var(--ease-spring);
                    flex-shrink: 0;
                }
                .settings-mod--rose .settings-mod__icon { background: var(--gradient-sunset); }
                .settings-mod--violet .settings-mod__icon { background: var(--gradient-candy); }
                .settings-mod--emerald .settings-mod__icon { background: var(--gradient-forest); }
                .settings-mod--pink .settings-mod__icon { background: linear-gradient(135deg, #F472B6, #DB2777); }
                .settings-mod--amber .settings-mod__icon { background: var(--gradient-gold); }
                .settings-mod--sky .settings-mod__icon { background: linear-gradient(135deg, #38BDF8, #0284C7); }

                .settings-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1rem;
                    align-items: start;
                }
                .settings-info { display: flex; flex-direction: column; gap: 0.9rem; }
                .settings-info span {
                    display: block;
                    font-size: 0.7rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.07em;
                    color: var(--text-muted);
                    margin-bottom: 0.15rem;
                }
                .settings-info strong { font-size: 0.95rem; color: var(--text-primary); }

                .settings-alert {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                    padding: 0.7rem 0.9rem;
                    border-radius: var(--radius-md);
                    font-size: 0.85rem;
                    animation: fadeInDown 0.3s var(--ease-out) both;
                }
                .settings-alert--ok { background: var(--success-light); color: #047857; border: 1px solid #A7F3D0; }
                .settings-alert--err { background: var(--danger-light); color: #BE123C; border: 1px solid #FECDD3; }

                .pref-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 1rem;
                    padding: 0.8rem 0;
                    border-bottom: 1px solid var(--border);
                    cursor: pointer;
                }
                .pref-row:last-child { border-bottom: none; }
                .pref-row__main { display: inline-flex; align-items: center; gap: 0.65rem; }
                .pref-row__icon {
                    width: 30px; height: 30px;
                    border-radius: 9px;
                    display: flex; align-items: center; justify-content: center;
                    background: var(--primary-light);
                    color: var(--primary);
                    flex-shrink: 0;
                }
                .pref-row strong { display: block; font-size: 0.88rem; color: var(--text-primary); }
                .pref-row small { font-size: 0.74rem; color: var(--text-muted); }

                .pref-toggle {
                    position: relative;
                    width: 42px;
                    height: 24px;
                    border-radius: 999px;
                    background: var(--border-strong);
                    flex-shrink: 0;
                    transition: background 0.22s;
                }
                .pref-toggle--on { background: var(--gradient-forest); }
                .pref-toggle input { position: absolute; inset: 0; opacity: 0; cursor: pointer; margin: 0; }
                .pref-toggle__knob {
                    position: absolute;
                    top: 3px; left: 3px;
                    width: 18px; height: 18px;
                    border-radius: 50%;
                    background: #fff;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.25);
                    transition: transform 0.22s var(--ease-spring);
                }
                .pref-toggle--on .pref-toggle__knob { transform: translateX(18px); }
            `}</style>
        </PageShell>
    );
}
