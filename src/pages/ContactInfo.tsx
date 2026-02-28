import { Eye, Trash2, Phone, Mail, MapPin, Link as LinkIcon, AlertCircle } from 'lucide-react';

const ContactInfo = () => {
    return (
        <div style={{ padding: '0 0.5rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
                    Contact Details
                </h1>
                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                    Manage contact details and inquiries
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem', alignItems: 'start' }}>
                {/* Left Form */}
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem' }}>Contact Details</h3>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Update your contact information</p>

                    <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Main Phone *</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                                    <Phone size={18} />
                                </div>
                                <input type="text" defaultValue="+1 (555) 123-4567" style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Alternative Phone</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                                    <Phone size={18} />
                                </div>
                                <input type="text" defaultValue="+1 (555) 123-4568" style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Main Email *</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                                    <Mail size={18} />
                                </div>
                                <input type="email" defaultValue="info@company.com" style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Support Email</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                                    <Mail size={18} />
                                </div>
                                <input type="email" defaultValue="support@company.com" style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Address *</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                                    <MapPin size={18} />
                                </div>
                                <input type="text" defaultValue="123 Business Street, Suite 100, New York, NY 10001" style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Google Maps URL</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                                    <LinkIcon size={18} />
                                </div>
                                <input type="url" defaultValue="https://maps.google.com/?q-New York" style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Emergency Contact</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                                    <AlertCircle size={18} />
                                </div>
                                <input type="text" placeholder="+1 (555) 999-9999" style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <button type="button" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer' }}>
                                Save Details
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Recent Inquiries */}
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem' }}>Recent Inquiries</h3>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>3 total messages</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Card 1 */}
                        <div style={{ border: '1px solid #f1f5f9', borderRadius: '12px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#0f172a' }}>John Smith</h4>
                                    <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#3b82f6', fontWeight: '600' }}>new</span>
                                </div>
                                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: '#475569' }}>Project Inquiry</p>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>2/27/2026</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center' }}>
                                    <Eye size={18} />
                                </button>
                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div style={{ border: '1px solid #f1f5f9', borderRadius: '12px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#0f172a' }}>Sarah Johnson</h4>
                                    <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem', borderRadius: '12px', backgroundColor: '#fef3c7', color: '#d97706', fontWeight: '600' }}>read</span>
                                </div>
                                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: '#475569' }}>Quote Request</p>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>2/26/2026</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center' }}>
                                    <Eye size={18} />
                                </button>
                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div style={{ border: '1px solid #f1f5f9', borderRadius: '12px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#0f172a' }}>Mike Davis</h4>
                                    <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem', borderRadius: '12px', backgroundColor: '#dcfce7', color: '#16a34a', fontWeight: '600' }}>replied</span>
                                </div>
                                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: '#475569' }}>General Question</p>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>2/25/2026</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center' }}>
                                    <Eye size={18} />
                                </button>
                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                    </div>
                    <button style={{ width: '100%', marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f8fafc', color: '#3b82f6', border: '1px solid #eff6ff', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                        View All Messages
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContactInfo;
