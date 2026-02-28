import { User, Mail, Phone, Lock, Home } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

const Profile = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <div style={{ padding: '0 0.5rem', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', color: '#3b82f6', borderRadius: '12px' }}>
                    <User size={24} />
                </div>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
                        My Profile
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                        Manage your personal account settings
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '2rem', alignItems: 'start' }}>
                {/* Profile Card */}
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#f8fafc', border: '4px solid #eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#cbd5e1' }}>
                        <User size={64} />
                    </div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>
                        {user?.name || 'Admin User'}
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        {user?.role || 'Administrator'}
                    </p>

                    <div style={{ width: '100%', borderTop: '1px solid #f8fafc', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569', fontSize: '0.9rem' }}>
                            <Mail size={16} color="#94a3b8" />
                            <span>{(user as any)?.email || 'admin@buildnexdev.com'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569', fontSize: '0.9rem' }}>
                            <Phone size={16} color="#94a3b8" />
                            <span>{(user as any)?.phone || '+1 (555) 000-0000'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569', fontSize: '0.9rem' }}>
                            <Home size={16} color="#94a3b8" />
                            <span>{(user as any)?.category || 'General'}</span>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Personal Details */}
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem' }}>Personal Information</h3>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Update your personal details here</p>

                        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Full Name</label>
                                    <input type="text" defaultValue={user?.name || "Admin User"} style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Phone Number</label>
                                    <input type="text" defaultValue={(user as any)?.phone || ""} style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Email Address</label>
                                    <input type="email" defaultValue={(user as any)?.email || "admin@buildnexdev.com"} style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                                <button type="button" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer' }}>
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Change Password */}
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                            <Lock size={20} color="#0f172a" />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>Change Password</h3>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem', marginLeft: '2.25rem' }}>Ensure your account stays secure</p>

                        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Current Password</label>
                                <input type="password" placeholder="••••••••" style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>New Password</label>
                                    <input type="password" placeholder="New password" style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Confirm Password</label>
                                    <input type="password" placeholder="Confirm new password" style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                                <button type="button" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe', borderRadius: '8px', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer' }}>
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
