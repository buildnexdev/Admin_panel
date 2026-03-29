import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Building, Phone, MapPin, Info, Save, PlusCircle, Edit3, ArrowLeft, Globe, ArrowRight } from 'lucide-react';
import { fetchCompanyDetails, updateCompanyDetails, createCompanyDetails, fetchAllCompanies, type CompanyData } from '../../services/companyApi';
import type { RootState } from '../../store/store';

type ViewMode = 'list' | 'add' | 'edit';

const CompanyDetails = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const isAdmin = user?.role === 'admin';

    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [companies, setCompanies] = useState<CompanyData[]>([]);
    const [currentData, setCurrentData] = useState<Partial<CompanyData>>({});
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

    useEffect(() => {
        if (isAdmin) {
            loadCompanies();
        }
    }, [isAdmin]);

    const loadCompanies = async () => {
        try {
            setLoading(true);
            const res = await fetchAllCompanies();
            if (res.success) {
                setCompanies(res.data);
            }
        } catch (err) {
            setToast({ show: true, message: 'Failed to load companies', type: 'error' });
        } finally {
            setLoading(false);
        }
    };


    const handleAddClick = () => {
        setCurrentData({
            name: '',
            discription: '',
            location: '',
            category: 'Builders',
            productType: 'Construction',
            isActive: 1
        });
        setViewMode('add');
    };

    const handleEditClick = (company: CompanyData) => {
        setCurrentData(company);
        setViewMode('edit');
    };

    const handleBackToList = () => {
        setViewMode('list');
        loadCompanies();
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            let res;
            if (viewMode === 'add') {
                res = await createCompanyDetails(currentData);
            } else {
                res = await updateCompanyDetails(currentData.companyID!, currentData);
            }

            if (res.success) {
                setToast({ show: true, message: viewMode === 'add' ? 'Company added' : 'Updated successfully', type: 'success' });
                setTimeout(() => {
                    setToast(prev => ({ ...prev, show: false }));
                    handleBackToList();
                }, 1500);
            }
        } catch (err) {
            setToast({ show: true, message: 'Failed to save', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (!isAdmin) return (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b', fontSize: '1.1rem' }}>
            <Building size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
            <p>Access restricted to administrators only.</p>
        </div>
    );

    if (loading && viewMode === 'list') return <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>Loading...</div>;

    // ─── LIST VIEW ────────────────────────────────────────────────────────
    if (viewMode === 'list') return (
        <div style={{ padding: '0 0.5rem', maxWidth: '1200px', margin: '0 auto' }}>
            {toast.show && (
                <div style={{
                    position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 99999,
                    padding: '0.8rem 1.2rem', borderRadius: '12px',
                    backgroundColor: toast.type === 'success' ? '#059669' : '#dc2626', color: 'white',
                    display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}>
                    {toast.message}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.4rem' }}>Companies</h1>
                    <p style={{ color: '#64748b' }}>Manage your multiple enterprise locations and profiles</p>
                </div>
                <button 
                    onClick={handleAddClick}
                    style={{ 
                        padding: '0.8rem 1.5rem', backgroundColor: '#0f172a', color: 'white', border: 'none', 
                        borderRadius: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'
                    }}
                >
                    <PlusCircle size={18} /> Add New Company
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                {companies.map(company => (
                    <div 
                        key={company.companyID}
                        style={{ 
                            backgroundColor: 'white', padding: '1.5rem', borderRadius: '20px', 
                            border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                            transition: 'all 0.2s ease', cursor: 'default'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ backgroundColor: '#f8fafc', padding: '0.8rem', borderRadius: '16px', color: '#6366f1' }}>
                                <Building size={24} />
                            </div>
                            <button 
                                onClick={() => handleEditClick(company)}
                                style={{ padding: '0.5rem', color: '#64748b', cursor: 'pointer', border: 'none', background: 'none' }}
                            >
                                <Edit3 size={18} />
                            </button>
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>{company.name}</h3>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {company.discription}
                        </p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#475569', fontSize: '0.85rem' }}>
                                <MapPin size={14} /> {company.address || company.location || 'No address set'}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#475569', fontSize: '0.85rem' }}>
                                <Globe size={14} /> {company.category} • {company.productType}
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => handleEditClick(company)}
                            style={{ 
                                width: '100%', marginTop: '1.5rem', padding: '0.75rem', backgroundColor: '#f8fafc', 
                                border: '1.5px solid #eef2ff', borderRadius: '12px', color: '#6366f1', 
                                fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                            }}
                        >
                            View Details <ArrowRight size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    // ─── FORM VIEW (ADD/EDIT) ──────────────────────────────────────────
    return (
        <div style={{ padding: '0 0.5rem', maxWidth: '1000px', margin: '0 auto' }}>
            {toast.show && (
                <div style={{
                    position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 99999,
                    padding: '0.8rem 1.2rem', borderRadius: '12px',
                    backgroundColor: toast.type === 'success' ? '#059669' : '#dc2626', color: 'white',
                    display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}>
                    {toast.message}
                </div>
            )}

            <button 
                onClick={handleBackToList}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', border: 'none', background: 'none', cursor: 'pointer', marginBottom: '1.5rem', padding: 0 }}
            >
                <ArrowLeft size={18} /> Back to Companies
            </button>

            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.4rem' }}>
                    {viewMode === 'add' ? 'Add New Company' : 'Edit Company Profile'}
                </h1>
                <p style={{ color: '#64748b' }}>Fill in the details below to complete the company profile</p>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Information Card */}
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>Company Name *</label>
                            <input 
                                type="text" value={currentData.name || ''} 
                                onChange={e => setCurrentData({ ...currentData, name: e.target.value })} 
                                placeholder="e.g. Smart Research Solution" required
                                style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1.5px solid #eef2ff', backgroundColor: '#fcfdff', fontSize: '0.95rem' }} 
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>Business Category</label>
                            <input 
                                type="text" value={currentData.category || ''} 
                                onChange={e => setCurrentData({ ...currentData, category: e.target.value })} 
                                style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1.5px solid #eef2ff', backgroundColor: '#fcfdff', fontSize: '0.95rem' }} 
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>Short Description</label>
                        <textarea 
                            rows={3} value={currentData.discription || ''} 
                            onChange={e => setCurrentData({ ...currentData, discription: e.target.value })} 
                            placeholder="Brief overview of the company..." required
                            style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1.5px solid #eef2ff', backgroundColor: '#fcfdff', fontSize: '0.95rem' }} 
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>Structure Type</label>
                            <input 
                                type="text" value={currentData.productType || ''} 
                                onChange={e => setCurrentData({ ...currentData, productType: e.target.value })} 
                                placeholder="e.g. Service, Retail"
                                style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1.5px solid #eef2ff', backgroundColor: '#fcfdff', fontSize: '0.95rem' }} 
                            />
                        </div>
                    </div>
                </div>

                {/* Contact & Location Card */}
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>Phone 1</label>
                            <input 
                                type="text" value={currentData.contactno1 || ''} 
                                onChange={e => setCurrentData({ ...currentData, contactno1: Number(e.target.value) || undefined })} 
                                style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1.5px solid #eef2ff', backgroundColor: '#fcfdff' }} 
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>Phone 2</label>
                            <input 
                                type="text" value={currentData.contactno2 || ''} 
                                onChange={e => setCurrentData({ ...currentData, contactno2: Number(e.target.value) || undefined })} 
                                style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1.5px solid #eef2ff', backgroundColor: '#fcfdff' }} 
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>Google Map Location (Link)</label>
                            <input 
                                type="text" value={currentData.location || ''} 
                                onChange={e => setCurrentData({ ...currentData, location: e.target.value })} 
                                style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1.5px solid #eef2ff', backgroundColor: '#fcfdff' }} 
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>Physical Address</label>
                        <textarea 
                            rows={2} value={currentData.address || ''} 
                            onChange={e => setCurrentData({ ...currentData, address: e.target.value })} 
                            style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1.5px solid #eef2ff', backgroundColor: '#fcfdff' }} 
                        />
                    </div>
                </div>

                {/* Additional Details Card */}
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Globe size={20} color="#6366f1" /> Business & Pricing
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>Website Link</label>
                            <input 
                                type="url" value={currentData.website || ''} 
                                onChange={e => setCurrentData({ ...currentData, website: e.target.value })} 
                                placeholder="https://example.com"
                                style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1.5px solid #eef2ff', backgroundColor: '#fcfdff' }} 
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>Selling Price</label>
                            <input 
                                type="text" value={currentData.sellingPrice || ''} 
                                onChange={e => setCurrentData({ ...currentData, sellingPrice: e.target.value })} 
                                placeholder="e.g. 500-2000"
                                style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1.5px solid #eef2ff', backgroundColor: '#fcfdff' }} 
                            />
                        </div>
                    </div>
                </div>

                {/* Company Administrator Card */}
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Info size={20} color="#f59e0b" /> Administrator Details
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>Admin Name</label>
                            <input 
                                type="text" value={currentData.adminName || ''} 
                                onChange={e => setCurrentData({ ...currentData, adminName: e.target.value })} 
                                placeholder="Owner or Manager Name"
                                style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1.5px solid #eef2ff', backgroundColor: '#fcfdff' }} 
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>Admin Phone</label>
                            <input 
                                type="text" value={currentData.adminPhone || ''} 
                                onChange={e => setCurrentData({ ...currentData, adminPhone: Number(e.target.value) || undefined })} 
                                placeholder="Direct contact number"
                                style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1.5px solid #eef2ff', backgroundColor: '#fcfdff' }} 
                            />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>Admin Location</label>
                            <input 
                                type="text" value={currentData.adminLocation || ''} 
                                onChange={e => setCurrentData({ ...currentData, adminLocation: e.target.value })} 
                                placeholder="City or Branch"
                                style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1.5px solid #eef2ff', backgroundColor: '#fcfdff' }} 
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>Admin Category</label>
                            <input 
                                type="text" value={currentData.adminCategory || ''} 
                                onChange={e => setCurrentData({ ...currentData, adminCategory: e.target.value })} 
                                placeholder="Designation or Level"
                                style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1.5px solid #eef2ff', backgroundColor: '#fcfdff' }} 
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', marginBottom: '3rem' }}>
                    <button 
                        type="button" onClick={handleBackToList}
                        style={{ padding: '0.8rem 2rem', border: '1px solid #cbd5e1', backgroundColor: 'transparent', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" disabled={saving}
                        style={{ 
                            padding: '0.8rem 3rem', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '12px', 
                            fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem'
                        }}
                    >
                        <Save size={18} /> {saving ? 'Saving...' : (viewMode === 'add' ? 'Add Company' : 'Update Profile')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompanyDetails;
