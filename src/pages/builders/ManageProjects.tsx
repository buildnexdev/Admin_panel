import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, deleteProject } from '../../store/slices/buildersSlice';
import type { AppDispatch, RootState } from '../../store/store';
import { Briefcase, Edit2, Trash2 } from 'lucide-react';

const ManageProjects = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { projects } = useSelector((state: RootState) => state.builders);
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (user?.companyID) {
            dispatch(fetchProjects(user.companyID));
        }
    }, [dispatch, user?.companyID]);

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this project?') && user?.companyID) {
            dispatch(deleteProject({ id, companyID: user.companyID }));
        }
    };

    return (
        <div style={{ padding: '0 0.5rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
                    Manage Projects
                </h1>
                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                    View and manage all uploaded projects
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {projects && projects.length > 0 ? (
                    projects.map((project: any) => (
                        <div key={project.id} style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                            <div style={{ height: '180px', position: 'relative' }}>
                                <img src={project.image_url} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', padding: '0.3rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', color: '#0f172a' }}>
                                    {project.category}
                                </div>
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.4rem' }}>{project.title}</h3>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1rem', lineHeight: '1.5' }}>{project.description}</p>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #f8fafc' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button style={{ padding: '0.4rem 0.8rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#475569', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: '500' }}>
                                            <Edit2 size={14} /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(project.id)} style={{ padding: '0.4rem 0.8rem', border: '1px solid #fee2e2', backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: '500' }}>
                                            <Trash2 size={14} /> Trash
                                        </button>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                        {new Date(project.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                        <Briefcase size={40} style={{ margin: '0 auto 1rem', color: '#cbd5e1' }} />
                        <p style={{ color: '#64748b', fontWeight: '500' }}>No projects found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageProjects;
