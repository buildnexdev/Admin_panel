import { useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    ArrowLeft, Plus, Trash2, FileText, ListPlus, Calculator,
    AlertTriangle, CheckCircle2, Loader2,
} from 'lucide-react';
import type { RootState } from '../../store/store';
import { createQuotation } from '../../services/api';
import PageShell, { SectionCard } from '../../components/PageShell';

type LineItem = { id: number; description: string; qty: number; rate: number };

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

export default function QuotationCreate() {
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);

    const [clientName, setClientName] = useState('');
    const [company, setCompany] = useState(user?.companyName || '');
    const [notes, setNotes] = useState('');
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(18);
    const [items, setItems] = useState<LineItem[]>([{ id: 1, description: '', qty: 1, rate: 0 }]);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    const totals = useMemo(() => {
        const subtotal = items.reduce((sum, i) => sum + i.qty * i.rate, 0);
        const discountAmount = (subtotal * Math.min(Math.max(discount, 0), 100)) / 100;
        const taxable = subtotal - discountAmount;
        const taxAmount = (taxable * Math.min(Math.max(tax, 0), 100)) / 100;
        return { subtotal, discountAmount, taxable, taxAmount, grand: taxable + taxAmount };
    }, [items, discount, tax]);

    const updateItem = (id: number, patch: Partial<LineItem>) => {
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
    };

    const addItem = () => setItems((prev) => [...prev, { id: Date.now(), description: '', qty: 1, rate: 0 }]);

    const removeItem = (id: number) =>
        setItems((prev) => (prev.length === 1 ? prev : prev.filter((i) => i.id !== id)));

    const buildDetails = () => {
        const lines = items
            .filter((i) => i.description.trim())
            .map((i) => `• ${i.description} — ${i.qty} × ${inr(i.rate)} = ${inr(i.qty * i.rate)}`);
        const summary = [
            `Subtotal: ${inr(totals.subtotal)}`,
            discount > 0 ? `Discount (${discount}%): −${inr(totals.discountAmount)}` : null,
            tax > 0 ? `Tax (${tax}%): ${inr(totals.taxAmount)}` : null,
            `Total: ${inr(totals.grand)}`,
        ].filter(Boolean);
        return [lines.join('\n'), notes.trim(), summary.join(' | ')].filter(Boolean).join('\n\n');
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!clientName.trim()) {
            setError('Client name is required.');
            return;
        }
        if (!items.some((i) => i.description.trim() && i.qty > 0 && i.rate > 0)) {
            setError('Add at least one line item with a description, quantity and rate.');
            return;
        }

        setSaving(true);
        try {
            await createQuotation({
                client_name: clientName.trim(),
                project_details: buildDetails(),
                price: Math.round(totals.grand),
                companyID: user?.companyID,
                userId: user?.userId,
                category: user?.category ?? null,
                company_name: company.trim() || null,
            });
            setSaved(true);
            setTimeout(() => navigate('/quotation'), 900);
        } catch (e: any) {
            setError(e?.response?.data?.message || e?.message || 'Could not save the quotation.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <PageShell
            title="Create quotation"
            subtitle="Build a line-item quotation with discount and tax, then send it to your client."
            icon={<FileText size={22} />}
            accent="emerald"
            actions={
                <button className="ui-btn ui-btn--secondary" type="button" onClick={() => navigate('/quotation')}>
                    <ArrowLeft size={16} /> Back to list
                </button>
            }
        >
            {error && (
                <div className="qc-alert qc-alert--err"><AlertTriangle size={16} /> {error}</div>
            )}
            {saved && (
                <div className="qc-alert qc-alert--ok"><CheckCircle2 size={16} /> Quotation saved. Taking you back to the list…</div>
            )}

            <form onSubmit={handleSubmit}>
                <SectionCard title="Client details" icon={<FileText size={15} />} accent="indigo">
                    <div className="form-grid">
                        <div>
                            <label className="ui-label" htmlFor="qc-client">Client name *</label>
                            <input
                                id="qc-client"
                                className="ui-input"
                                required
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                placeholder="Who is this quotation for?"
                            />
                        </div>
                        <div>
                            <label className="ui-label" htmlFor="qc-company">Your company name</label>
                            <input
                                id="qc-company"
                                className="ui-input"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                placeholder="Shown on the client-facing quotation"
                            />
                        </div>
                        <div className="full">
                            <label className="ui-label" htmlFor="qc-notes">Scope &amp; notes</label>
                            <textarea
                                id="qc-notes"
                                className="ui-textarea"
                                rows={4}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Deliverables, timeline, payment terms…"
                            />
                        </div>
                    </div>
                </SectionCard>

                <SectionCard
                    title="Line items"
                    icon={<ListPlus size={15} />}
                    accent="violet"
                    right={
                        <button type="button" className="ui-btn ui-btn--secondary ui-btn--sm" onClick={addItem}>
                            <Plus size={14} /> Add item
                        </button>
                    }
                >
                    <div className="qi-head">
                        <span>Description</span>
                        <span>Qty</span>
                        <span>Rate</span>
                        <span style={{ textAlign: 'right' }}>Amount</span>
                        <span />
                    </div>
                    <div className="qi-list">
                        {items.map((item, idx) => (
                            <div key={item.id} className="qi-row row-fade" style={{ animationDelay: `${idx * 0.05}s` }}>
                                <input
                                    className="ui-input"
                                    placeholder="What are you quoting for?"
                                    value={item.description}
                                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                                />
                                <input
                                    className="ui-input"
                                    type="number"
                                    min={1}
                                    value={item.qty}
                                    onChange={(e) => updateItem(item.id, { qty: Number(e.target.value) || 1 })}
                                    aria-label="Quantity"
                                />
                                <input
                                    className="ui-input"
                                    type="number"
                                    min={0}
                                    value={item.rate}
                                    onChange={(e) => updateItem(item.id, { rate: Number(e.target.value) || 0 })}
                                    aria-label="Rate"
                                />
                                <div className="qi-amt">{inr(item.qty * item.rate)}</div>
                                <button
                                    type="button"
                                    className="ui-btn ui-btn--danger ui-btn--sm"
                                    onClick={() => removeItem(item.id)}
                                    aria-label="Remove line item"
                                    disabled={items.length === 1}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                <SectionCard title="Totals" icon={<Calculator size={15} />} accent="emerald">
                    <div className="qc-totals">
                        <div className="qc-inputs">
                            <div>
                                <label className="ui-label" htmlFor="qc-disc">Discount (%)</label>
                                <input
                                    id="qc-disc"
                                    className="ui-input"
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={discount}
                                    onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                                />
                            </div>
                            <div>
                                <label className="ui-label" htmlFor="qc-tax">Tax / GST (%)</label>
                                <input
                                    id="qc-tax"
                                    className="ui-input"
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={tax}
                                    onChange={(e) => setTax(Number(e.target.value) || 0)}
                                />
                            </div>
                        </div>

                        <div className="qc-summary">
                            <div><span>Subtotal</span><span>{inr(totals.subtotal)}</span></div>
                            <div><span>Discount ({discount}%)</span><span className="qc-minus">−{inr(totals.discountAmount)}</span></div>
                            <div><span>Tax ({tax}%)</span><span>{inr(totals.taxAmount)}</span></div>
                            <div className="qc-summary__grand"><span>Grand total</span><strong>{inr(totals.grand)}</strong></div>
                        </div>
                    </div>
                </SectionCard>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    <button type="button" className="ui-btn ui-btn--secondary" onClick={() => navigate('/quotation')}>
                        Cancel
                    </button>
                    <button type="submit" className="ui-btn ui-btn--primary" disabled={saving || saved}>
                        {saving ? <><Loader2 size={16} className="dash-spin" /> Saving…</> : saved ? 'Saved' : 'Save quotation'}
                    </button>
                </div>
            </form>

            <style>{`
                .qc-alert {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                    padding: 0.8rem 1rem;
                    border-radius: var(--radius-md);
                    font-size: 0.88rem;
                    animation: fadeInDown 0.3s var(--ease-out) both;
                }
                .qc-alert--ok { background: var(--success-light); color: #047857; border: 1px solid #A7F3D0; }
                .qc-alert--err { background: var(--danger-light); color: #BE123C; border: 1px solid #FECDD3; }

                .qi-head, .qi-row {
                    display: grid;
                    grid-template-columns: 2fr 0.6fr 0.9fr 0.9fr auto;
                    gap: 0.55rem;
                    align-items: center;
                }
                .qi-head {
                    margin-bottom: 0.5rem;
                    font-size: 0.7rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                    color: var(--text-muted);
                }
                .qi-list { display: flex; flex-direction: column; gap: 0.6rem; }
                .qi-amt {
                    font-weight: 700;
                    color: var(--text-primary);
                    text-align: right;
                    font-size: 0.9rem;
                }
                .qc-totals {
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) minmax(260px, 0.9fr);
                    gap: 1.5rem;
                    align-items: start;
                }
                .qc-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; }
                .qc-summary {
                    background: var(--surface-tinted);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    padding: 1rem 1.15rem;
                }
                .qc-summary > div {
                    display: flex;
                    justify-content: space-between;
                    gap: 1rem;
                    padding: 0.4rem 0;
                    font-size: 0.88rem;
                    color: var(--text-secondary);
                }
                .qc-minus { color: var(--accent-orange); font-weight: 600; }
                .qc-summary__grand {
                    margin-top: 0.4rem;
                    padding-top: 0.75rem !important;
                    border-top: 1px dashed var(--border-strong);
                    align-items: baseline;
                }
                .qc-summary__grand span { font-weight: 700; color: var(--text-primary); }
                .qc-summary__grand strong {
                    font-family: var(--font-display);
                    font-size: 1.45rem;
                    background: var(--gradient-forest);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                @media (max-width: 860px) {
                    .qc-totals { grid-template-columns: 1fr; }
                }
                @media (max-width: 720px) {
                    .qi-head { display: none; }
                    .qi-row {
                        grid-template-columns: 1fr 1fr auto;
                        padding: 0.75rem;
                        border: 1px solid var(--border);
                        border-radius: var(--radius-md);
                        background: var(--surface-tinted);
                    }
                    .qi-row .ui-input:first-child { grid-column: 1 / -1; }
                    .qi-amt { text-align: left; }
                }
            `}</style>
        </PageShell>
    );
}
