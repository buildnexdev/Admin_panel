import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember, clearTeamMessages } from '../../store/slices/teamSlice';
import type { AppDispatch, RootState } from '../../store/store';
import ConfirmModal from '../../components/ConfirmModal';
import { Plus, X, Edit2, Trash2, User, Briefcase, Phone, MessageSquare, Tag, ImagePlus, UserPlus } from 'lucide-react';

const TeamMembers = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { members, loading, successMessage, error } = useSelector((state: RootState) => state.team);

    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const [name, setName] = useState('');
    const [designation, setDesignation] = useState('');
    const [bio, setBio] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [tags, setTags] = useState('');

    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; member: any }>({ open: false, member: null });
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        if (showForm) document.body.classList.add('modal-open');
        else document.body.classList.remove('modal-open');
        return () => document.body.classList.remove('modal-open');
    }, [showForm]);

    useEffect(() => {
        if (user?.companyID) dispatch(fetchTeamMembers(user.companyID));
    }, [dispatch, user?.companyID]);

    useEffect(() => {
        if (successMessage) {
            setToast({ show: true, message: successMessage, type: 'success' });
            const t = setTimeout(() => {
                setToast(prev => ({ ...prev, show: false }));
                dispatch(clearTeamMessages());
            }, 3000);
            return () => clearTimeout(t);
        }
    }, [successMessage, dispatch]);

    useEffect(() => {
        if (error) {
            setToast({ show: true, message: error, type: 'error' });
            const t = setTimeout(() => {
                setToast(prev => ({ ...prev, show: false }));
                dispatch(clearTeamMessages());
            }, 4000);
            return () => clearTimeout(t);
        }
    }, [error, dispatch]);

    const resetForm = () => {
        setName(''); setDesignation(''); setBio(''); setPhoneNumber(''); setTags('');
        setShowForm(false); setEditMode(false); setEditId(null);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !designation.trim() || !user?.companyID) return;

        const formData = new FormData();
        formData.append('name', name.trim());
        formData.append('designation', designation.trim());
        formData.append('bio', bio.trim());
        formData.append('phoneNumber', phoneNumber.trim());
        formData.append('tags', tags.trim());
        formData.append('companyID', user.companyID.toString());

        if (editMode && editId) {
            const res = await dispatch(updateTeamMember({ id: editId, data: formData }));
            if (updateTeamMember.fulfilled.match(res)) resetForm();
        } else {
            const res = await dispatch(addTeamMember(formData));
            if (addTeamMember.fulfilled.match(res)) resetForm();
        }
    };

    const handleEdit = (member: any) => {
        setEditMode(true); setEditId(member.id);
        setName(member.name || '');
        setDesignation(member.designation || '');
        setBio(member.bio || '');
        setPhoneNumber(member.phoneNumber || '');
        setTags(member.tags || '');
        setShowForm(true);
    };

    const handleDeleteClick = (member: any) => setConfirmDelete({ open: true, member });
    const handleConfirmDelete = () => {
        if (confirmDelete.member) dispatch(deleteTeamMember(confirmDelete.member.id));
        setConfirmDelete({ open: false, member: null });
    };

    return (
        <div style={{ padding: '0 0.5rem', maxWidth: '1400px', margin: '0 auto' }}>
            {toast.show && (
                <div style={{
                    position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 99999,
                    padding: '0.875rem 1.5rem', borderRadius: '12px',
                    backgroundColor: toast.type === 'success' ? '#059669' : '#dc2626',
                    color: 'white', fontWeight: '500', fontSize: '0.9rem',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                    {toast.type === 'success' ? '✓' : '✕'} {toast.message}
                </div>
            )}

            <ConfirmModal
                open={confirmDelete.open}
                title="Remove Team Member"
                message={confirmDelete.member ? `Are you sure you want to remove "${confirmDelete.member.name}"?` : ''}
                confirmLabel="Remove"
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDelete({ open: false, member: null })}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '10px',
                            background: 'linear-gradient(135deg, #0f172a, #334155)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(15,23,42,0.2)'
                        }}>
                            <UserPlus size={22} color="white" />
                        </div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>
                            SRS Team Management
                        </h1>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', marginLeft: '3.25rem' }}>
                        Add and manage your leadership and team members
                    </p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: '#0f172a',
                        color: 'white', padding: '0.7rem 1.4rem', borderRadius: '10px',
                        border: 'none', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                >
                    <Plus size={18} /> Add Member
                </button>
            </div>

            {/* Members Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.5rem'
            }}>
                {members && members.length > 0 ? (
                    members.map((member: any, index: number) => (
                        <div
                            key={member.id}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                                transition: 'all 0.3s ease',
                                display: 'flex', flexDirection: 'column'
                            }}
                        >
                            <div style={{ height: '140px', position: 'relative', overflow: 'hidden', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ 
                                    padding: '1.5rem 1.25rem', 
                                    textAlign: 'center'
                                }}>
                                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>{member.name}</h3>
                                    <p style={{ margin: '0.4rem 0 0', color: '#64748b', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{member.designation}</p>
                                </div>
                            </div>

                            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {member.bio && (
                                    <p style={{ 
                                        margin: 0, fontSize: '0.875rem', color: '#475569', 
                                        lineHeight: 1.5, display: '-webkit-box', 
                                        WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' 
                                    }}>
                                        {member.bio}
                                    </p>
                                )}
                                
                                {member.phoneNumber && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                                        <Phone size={14} /> {member.phoneNumber}
                                    </div>
                                )}

                                {member.tags && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                        {member.tags.split(',').map((tag: string, i: number) => (
                                            <span key={i} style={{ 
                                                fontSize: '0.7rem', fontWeight: '600', 
                                                padding: '0.2rem 0.6rem', backgroundColor: '#f1f5f9', 
                                                color: '#334155', borderRadius: '100px' 
                                            }}>
                                                {tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                )}


                                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                                    <button 
                                        onClick={() => handleEdit(member)}
                                        style={{ 
                                            padding: '0.4rem 0.8rem', border: '1px solid #e2e8f0', 
                                            borderRadius: '8px', cursor: 'pointer', display: 'flex', 
                                            alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem',
                                            backgroundColor: 'white', color: '#475569'
                                        }}
                                    >
                                        <Edit2 size={14} /> Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteClick(member)}
                                        style={{ 
                                            padding: '0.4rem 0.8rem', border: '1px solid #fee2e2', 
                                            borderRadius: '8px', cursor: 'pointer', display: 'flex', 
                                            alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem',
                                            backgroundColor: '#fef2f2', color: '#ef4444'
                                        }}
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ 
                        gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center', 
                        backgroundColor: '#f8fafc', borderRadius: '20px', border: '2px dashed #cbd5e1' 
                    }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 1rem', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={32} color="#94a3b8" />
                        </div>
                        <h3>No team members yet</h3>
                        <p style={{ color: '#64748b' }}>Click "Add Member" to build your team page content.</p>
                    </div>
                )}
            </div>

            {/* Form Modal */}
            {showForm && createPortal(
                <div 
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)',
                        padding: '2rem 1rem', overflowY: 'auto', display: 'flex', justifyContent: 'center'
                    }}
                    onClick={resetForm}
                >
                    <div 
                        style={{
                            width: '100%', maxWidth: '600px', backgroundColor: 'white', borderRadius: '24px',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', margin: 'auto'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>{editMode ? 'Edit Member' : 'Add New Member'}</h2>
                            <button onClick={resetForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={24} /></button>
                        </div>

                        <div style={{ padding: '2rem' }}>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Full Name *</label>
                                        <input 
                                            type="text" value={name} onChange={e => setName(e.target.value)} required
                                            placeholder="e.g. Soban Prabhu"
                                            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid #e2e8f0', outline: 'none' }} 
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Designation *</label>
                                        <input 
                                            type="text" value={designation} onChange={e => setDesignation(e.target.value)} required
                                            placeholder="e.g. PROPRIETOR"
                                            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid #e2e8f0', outline: 'none' }} 
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Phone Number</label>
                                        <input 
                                            type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                                            placeholder="e.g. +91 9876543210"
                                            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid #e2e8f0', outline: 'none' }} 
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Skills / Tags</label>
                                        <input 
                                            type="text" value={tags} onChange={e => setTags(e.target.value)}
                                            placeholder="Separate with commas"
                                            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid #e2e8f0', outline: 'none' }} 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Biography / Content</label>
                                    <textarea 
                                        value={bio} onChange={e => setBio(e.target.value)} rows={4}
                                        placeholder="Briefly describe roles and experience..."
                                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid #e2e8f0', outline: 'none', resize: 'vertical' }} 
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button 
                                        type="submit" disabled={loading}
                                        style={{ 
                                            flex: 1, padding: '0.875rem', backgroundColor: '#0f172a', color: 'white', 
                                            border: 'none', borderRadius: '12px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                        }}
                                    >
                                        {loading ? 'Saving...' : (editMode ? 'Update Member' : 'Add Member')}
                                    </button>
                                    <button 
                                        type="button" onClick={resetForm}
                                        style={{ 
                                            flex: 0.5, padding: '0.875rem', backgroundColor: '#f1f5f9', color: '#475569', 
                                            border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default TeamMembers;
