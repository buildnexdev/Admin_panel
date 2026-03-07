import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { Building2, Lock, Save, Globe, Phone, MapPin, Mail, Key } from 'lucide-react';

const Settings = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setSuccess(false), 3000);
        }, 1500);
    };

    return (
        <div className="animate-fade-in" style={{ width: '100%' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>
                    Account <span style={{ color: '#6366f1' }}>Settings</span>
                </h1>
                <p style={{ color: '#64748b' }}>Manage your company profile and security preferences.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
                {/* Company Details */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: '24px',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                        <div style={{ padding: '0.5rem', backgroundColor: '#eef2ff', color: '#6366f1', borderRadius: '10px' }}>
                            <Building2 size={20} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>Company Profile</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                <Globe size={18} />
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Group Name</p>
                                <p style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>{user?.category || 'Standard'} Group</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                <Phone size={18} />
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Phone Number</p>
                                <p style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>{user?.phoneNumber}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                <MapPin size={18} />
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Location</p>
                                <p style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>{user?.location}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                <Mail size={18} />
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Contact Person</p>
                                <p style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>{user?.name}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Password Change */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '2.5rem',
                    borderRadius: '24px',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                        <div style={{ padding: '0.5rem', backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: '10px' }}>
                            <Lock size={20} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>Update Password</h3>
                    </div>

                    <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Current Password</label>
                            <div style={{ position: 'relative' }}>
                                <Key size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="password"
                                    required
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem 0.75rem 2.75rem',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '0.9375rem',
                                        backgroundColor: '#f8fafc'
                                    }}
                                    placeholder="Enter current password"
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '0.9375rem',
                                        backgroundColor: '#f8fafc'
                                    }}
                                    placeholder="New password"
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Confirm Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '0.9375rem',
                                        backgroundColor: '#f8fafc'
                                    }}
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                marginTop: '1rem',
                                padding: '1rem',
                                backgroundColor: loading ? '#94a3b8' : '#6366f1',
                                color: 'white',
                                border: 'none',
                                borderRadius: '14px',
                                fontWeight: '700',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                transition: 'all 0.2s',
                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
                            }}
                        >
                            {loading ? 'Updating...' : <><Save size={20} /> Save Changes</>}
                        </button>

                        {success && (
                            <div style={{
                                padding: '1rem',
                                backgroundColor: '#ecfdf5',
                                color: '#059669',
                                borderRadius: '12px',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                textAlign: 'center'
                            }}>
                                Password successfully updated!
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
