const CompanyDetails = () => {
    return (
        <div style={{ padding: '0 0.5rem', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#eef2ff', color: '#6366f1', borderRadius: '12px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 21h18"></path>
                        <path d="M5 21V7l8-4v18"></path>
                        <path d="M19 21V11l-6-3"></path>
                        <path d="M9 9v12"></path>
                    </svg>
                </div>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
                        Company Details
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                        Manage your company information and profile
                    </p>
                </div>
            </div>

            <form style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Basic Information */}
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem' }}>Basic Information</h3>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Core company details and branding</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Company Name *</label>
                            <input type="text" defaultValue="BuildPro Construction Inc." style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Tagline</label>
                            <input type="text" defaultValue="Building Dreams, Creating Reality" style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Company Description</label>
                            <textarea rows={3} defaultValue="A leading construction company with over 20 years of experience in residential and commercial projects." style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155', resize: 'none' }} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Founded Year</label>
                                <input type="text" defaultValue="2004" style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Number of Employees</label>
                                <input type="text" defaultValue="250+" style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Completed Projects</label>
                                <input type="text" defaultValue="500+" style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>CEO / Managing Director</label>
                            <input type="text" defaultValue="Michael Johnson" style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }} />
                        </div>
                    </div>
                </div>

                {/* Legal Information */}
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#3b82f6', marginBottom: '0.25rem' }}>Legal Information</h3>
                    <p style={{ color: '#3b82f6', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Registration and licensing details</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Registration Number</label>
                            <input type="text" defaultValue="ABC123456789" style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', fontSize: '0.9rem', outline: 'none', color: 'white' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Tax ID / EIN</label>
                            <input type="text" defaultValue="XX-XXXXXXX" style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', fontSize: '0.9rem', outline: 'none', color: 'white' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>License Number</label>
                            <input type="text" defaultValue="CTL-2024-12345" style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Insurance Number</label>
                            <input type="text" defaultValue="INS-9876543" style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }} />
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem' }}>Social Media</h3>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Company social media profiles</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Facebook</label>
                            <input type="text" defaultValue="https://facebook.com/buildpro" style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Twitter</label>
                            <input type="text" defaultValue="https://twitter.com/buildpro" style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>LinkedIn</label>
                            <input type="text" defaultValue="https://linkedin.com/company/buildpro" style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Instagram</label>
                            <input type="text" defaultValue="https://instagram.com/buildpro" style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none', color: '#334155' }} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    <button type="button" style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer' }}>
                        Cancel
                    </button>
                    <button type="button" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer' }}>
                        Save Company Details
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompanyDetails;
