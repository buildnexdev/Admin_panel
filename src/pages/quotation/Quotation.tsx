import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createQuotation, clearQuotationLink, fetchQuotationList, updateQuotation, deleteQuotation } from "../../store/slices/quotationSlice";
import { getQuotationViewCount } from "../../services/api";
import type { RootState } from "../../store/store";
import type { QuotationListItem } from "../../store/slices/quotationSlice";
import { Copy, Edit2, MessageCircle, MousePointerClick, Plus, RefreshCw, Trash2 } from "lucide-react";

const origin = typeof window !== "undefined" ? window.location.origin : "";

function QuotationPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { loading, error, lastCreatedToken, list, listLoading } = useSelector((state: RootState) => state.quotation);

  const [showForm, setShowForm] = useState(false);
  const [clientName, setClientName] = useState("");
  const [projectDetails, setProjectDetails] = useState("");
  const [price, setPrice] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappByToken, setWhatsappByToken] = useState<Record<string, string>>({});
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
  const [loadingCountToken, setLoadingCountToken] = useState<string | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [editToken, setEditToken] = useState<string | null>(null);


  useEffect(() => {
    dispatch(fetchQuotationList({ userId: user?.userId, category: user?.category ?? undefined }) as any);
  }, [dispatch, user?.userId, user?.category]);

  useEffect(() => {
    if (lastCreatedToken && showForm) {
      setShowForm(false);
      setClientName("");
      setProjectDetails("");
      setPrice("");
      setWhatsappNumber("");
      dispatch(clearQuotationLink());
    }
  }, [lastCreatedToken, showForm, dispatch]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(price.replace(/[^0-9.]/g, ""));
    if (!clientName.trim() || !projectDetails.trim() || isNaN(priceNum)) return;

    if (editMode && editToken) {
      const result = await dispatch(updateQuotation({
        token: editToken,
        data: {
          client_name: clientName.trim(),
          project_details: projectDetails.trim(),
          price: priceNum
        }
      }) as any);
      if (updateQuotation.fulfilled.match(result)) {
        resetForm();
      }
      return;
    }

    dispatch(
      createQuotation({
        client_name: clientName.trim(),
        project_details: projectDetails.trim(),
        price: priceNum,
        companyID: user?.companyID,
        userId: user?.userId,
        category: user?.category ?? undefined,
        company_name: "waasphotographyandevents",
      }) as any
    );
  };

  const handleEditClick = (row: QuotationListItem) => {
    setEditMode(true);
    setEditToken(row.token || String(row.id));
    setClientName(row.client_name);
    setProjectDetails(row.project_details || "");
    setPrice(String(row.price));
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (token: string) => {
    if (window.confirm("Are you sure you want to delete this quotation?")) {
      dispatch(deleteQuotation(token) as any);
    }
  };

  const handleCopyLink = (token: string) => {
    const link = `${origin}/waasphotographyandevents.quotationlink/${token}`;
    navigator.clipboard.writeText(link);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleSendWhatsApp = (token: string) => {
    const num = whatsappNumber.replace(/\D/g, "");
    const link = `${origin}/waasphotographyandevents.quotationlink/${token}`;
    if (!num) return;
    const msg = encodeURIComponent(`Hi, here is your quotation link: ${link}`);
    window.open(`https://wa.me/${num}?text=${msg}`, "_blank");
  };

  const resetForm = () => {
    setClientName("");
    setProjectDetails("");
    setPrice("");
    setWhatsappNumber("");
    setEditMode(false);
    setEditToken(null);
    dispatch(clearQuotationLink());
    setShowForm(false);
  };

  const fetchViewCountForToken = async (token: string) => {
    setLoadingCountToken(token);
    const count = await getQuotationViewCount(token);
    setViewCounts((prev) => ({ ...prev, [token]: count }));
    setLoadingCountToken(null);
  };

  const getToken = (row: QuotationListItem) => row.token ?? String(row.id);

  return (
    <div style={{ padding: "0 0.5rem", maxWidth: "960px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: "600", color: "#0f172a", margin: 0 }}>
          Quotations
        </h1>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.6rem 1.1rem",
            backgroundColor: "#0f172a",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          <Plus size={18} /> Create new quotation
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: "2rem", padding: "1.5rem", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <h2 style={{ fontSize: "1.15rem", fontWeight: "600", color: "#0f172a", marginBottom: "1rem" }}>
            {editMode ? "Edit quotation" : "New quotation"}
          </h2>
          <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {error && (
              <div style={{ padding: "0.75rem", backgroundColor: "#fef2f2", color: "#991b1b", borderRadius: "8px", fontSize: "0.9rem" }}>
                {error}
              </div>
            )}
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.35rem" }}>Client name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                placeholder="e.g. John Smith"
                style={{ width: "100%", padding: "0.65rem 0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "0.95rem" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.35rem" }}>Project / work details</label>
              <textarea
                value={projectDetails}
                onChange={(e) => setProjectDetails(e.target.value)}
                required
                rows={4}
                placeholder="Describe the project, scope, deliverables..."
                style={{ width: "100%", padding: "0.65rem 0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "0.95rem", resize: "vertical" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.35rem" }}>Price (₹)</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                placeholder="e.g. 50000"
                style={{ width: "100%", padding: "0.65rem 0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "0.95rem" }}
              />
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "0.75rem 1.25rem",
                  backgroundColor: loading ? "#94a3b8" : "#0f172a",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "0.95rem",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (editMode ? "Saving..." : "Creating...") : (editMode ? "Save changes" : "Create quotation")}
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: "0.75rem 1.25rem",
                  backgroundColor: "transparent",
                  color: "#64748b",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ overflowX: "auto", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
        {listLoading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>Loading quotations…</div>
        ) : list.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>No quotations yet. Click &quot;Create new quotation&quot; to add one.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#f1f5f9", borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "600", color: "#334155" }}>Client</th>
                <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "600", color: "#334155" }}>Price (₹)</th>
                <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "600", color: "#334155" }}>Link</th>
                <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "600", color: "#334155" }}>WhatsApp number</th>
                <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "600", color: "#334155" }}>Views</th>
                <th style={{ textAlign: "left", padding: "0.75rem", fontWeight: "600", color: "#334155" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((row) => {
                const token = getToken(row);
                const views = viewCounts[token] ?? row.view_count ?? row.viewCount ?? null;
                return (
                  <tr key={token} style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: "#fff" }}>
                    <td style={{ padding: "0.75rem", color: "#0f172a", verticalAlign: "top" }}>{row.client_name}</td>
                    <td style={{ padding: "0.75rem", color: "#475569", verticalAlign: "top" }}>{Number(row.price).toLocaleString()}</td>
                    <td style={{ padding: "0.75rem", verticalAlign: "top" }}>
                      <span
                        onClick={() => handleCopyLink(token)}
                        style={{ color: "#2563eb", cursor: "pointer", textDecoration: "underline", fontSize: "0.85rem", fontWeight: "500" }}
                        title="Click to copy link"
                      >
                        {copiedToken === token ? "Copied!" : "Quotation link"}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem", verticalAlign: "top" }}>
                      <input
                        type="text"
                        value={whatsappByToken[token] ?? ""}
                        onChange={(e) => setWhatsappByToken((prev) => ({ ...prev, [token]: e.target.value }))}
                        placeholder="e.g. 919876543210"
                        style={{ width: "100%", minWidth: "120px", padding: "0.4rem 0.5rem", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "0.85rem" }}
                        title="WhatsApp number for Send link"
                      />
                    </td>
                    <td style={{ padding: "0.75rem", verticalAlign: "top" }}>
                      {loadingCountToken === token ? (
                        "…"
                      ) : views !== null ? (
                        <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          <MousePointerClick size={14} style={{ color: "#2563eb" }} />
                          {views} time{views !== 1 ? "s" : ""}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fetchViewCountForToken(token)}
                          style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem", backgroundColor: "#eff6ff", color: "#2563eb", border: "none", borderRadius: "6px", cursor: "pointer" }}
                        >
                          <RefreshCw size={12} /> Load
                        </button>
                      )}
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={() => handleCopyLink(token)}
                          style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.4rem 0.65rem", backgroundColor: "#0f172a", color: "white", border: "none", borderRadius: "6px", fontSize: "0.8rem", cursor: "pointer" }}
                        >
                          <Copy size={14} /> {copiedToken === token ? "Copied!" : "Link"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSendWhatsApp(token)}
                          style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.4rem 0.65rem", backgroundColor: "#25D366", color: "white", border: "none", borderRadius: "6px", fontSize: "0.8rem", cursor: "pointer" }}
                        >
                          <MessageCircle size={14} /> Send
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditClick(row)}
                          style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.4rem 0.65rem", backgroundColor: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "0.8rem", cursor: "pointer" }}
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(token)}
                          style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.4rem 0.65rem", backgroundColor: "#fef2f2", color: "#ef4444", border: "1px solid #fee2e2", borderRadius: "6px", fontSize: "0.8rem", cursor: "pointer" }}
                        >
                          <Trash2 size={14} /> Trash
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default QuotationPage;
