import { useState } from 'react';
import { Tag, Edit, Trash2, Plus } from 'lucide-react';

const Categories = () => {
    const categories = [
        { id: 1, name: 'Residential', description: 'Residential construction projects', tag: 'residential', tagColor: '#a855f7', tagBg: '#faf5ff', count: 45 },
        { id: 2, name: 'Commercial', description: 'Commercial building projects', tag: 'commercial', tagColor: '#3b82f6', tagBg: '#eff6ff', count: 32 },
        { id: 3, name: 'Industrial', description: 'Industrial facilities', tag: 'industrial', tagColor: '#f97316', tagBg: '#fff7ed', count: 18 },
        { id: 4, name: 'Infrastructure', description: 'Infrastructure development', tag: 'infrastructure', tagColor: '#14b8a6', tagBg: '#f0fdfa', count: 25 },
        { id: 5, name: 'Renovation', description: 'Renovation and remodeling', tag: 'renovation', tagColor: '#ec4899', tagBg: '#fdf2f8', count: 15 },
        { id: 6, name: 'Interior Design', description: 'Interior design projects', tag: 'interior', tagColor: '#06b6d4', tagBg: '#ecfeff', count: 10 },
    ];

    return (
        <div style={{ padding: '0 0.5rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
                        Manage Categories
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                        Organize your projects with categories
                    </p>
                </div>
                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#0f172a',
                    color: 'white',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                }}>
                    <Plus size={18} /> Add Category
                </button>
            </div>

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.5rem'
            }}>
                {categories.map(cat => (
                    <div key={cat.id} style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <Tag size={20} color="#94a3b8" style={{ transform: 'rotate(-45deg)' }} />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>{cat.name}</h3>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>{cat.description}</p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <span style={{
                                backgroundColor: cat.tagBg,
                                color: cat.tagColor,
                                padding: '0.2rem 0.8rem',
                                borderRadius: '16px',
                                fontSize: '0.75rem',
                                fontWeight: '600'
                            }}>
                                {cat.tag}
                            </span>
                            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>{cat.count} projects</span>
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            borderTop: '1px solid #f8fafc',
                            paddingTop: '1rem'
                        }}>
                            <button style={{
                                flex: 1,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem',
                                backgroundColor: '#f8fafc',
                                border: '1px solid #f1f5f9',
                                borderRadius: '8px',
                                color: '#475569',
                                fontWeight: '500',
                                fontSize: '0.875rem',
                                cursor: 'pointer'
                            }}>
                                <Edit size={16} /> Edit
                            </button>
                            <button style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '0.5rem 1rem',
                                backgroundColor: '#fef2f2',
                                border: '1px solid #fee2e2',
                                borderRadius: '8px',
                                color: '#ef4444',
                                cursor: 'pointer'
                            }}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Categories;
