import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getQuotation } from "../../store/slices/quotationSlice";
import { recordQuotationView, getQuotationViewCount } from "../../services/api";
import type { RootState } from "../../store/store";
import { FileText, Eye } from "lucide-react";

/**
 * Public page: client opens /quotation/:token to view their quotation (no login required).
 */
function QuotationView() {
  const { token } = useParams<{ token: string }>();
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.quotation);
  const [viewCount, setViewCount] = useState<number | null>(null);

  const viewRecorded = useRef(false);
  useEffect(() => {
    if (!token) return;
    if (!viewRecorded.current) {
      viewRecorded.current = true;
      recordQuotationView(token);
    }
    dispatch(getQuotation(token) as any);
  }, [token, dispatch]);

  useEffect(() => {
    if (!token || !data) return;
    getQuotationViewCount(token).then(setViewCount);
  }, [token, data]);

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ textAlign: "center", color: "#64748b" }}>Loading quotation...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ textAlign: "center", color: "#dc2626", padding: "24px" }}>Error: {error}</div>
      </div>
    );
  }
  if (!data) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ textAlign: "center", color: "#64748b" }}>No quotation found.</div>
      </div>
    );
  }

  const clientName = data.client_name ?? "";
  const projectDetails = data.project_details ?? "";
  const price = data.price ?? 0;
  const companyName = data.company_name ?? "";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)",
        fontFamily: "system-ui, sans-serif",
        padding: "24px 16px",
      }}
    >
      <div
        style={{
          maxWidth: "560px",
          margin: "0 auto",
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(15, 23, 42, 0.08)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "28px 24px", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FileText size={24} color="#fff" />
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "700", color: "#0f172a" }}>Quotation</h1>
                <p style={{ margin: "4px 0 0", fontSize: "0.875rem", color: "#64748b" }}>
                  {companyName ? `From ${companyName} · Your quote details` : "Your quote details"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "24px" }}>
          <div
            style={{
              marginBottom: "20px",
              padding: "16px",
              backgroundColor: "#f8fafc",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ fontSize: "0.75rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
              Client Name
            </div>
            <div style={{ fontSize: "1rem", fontWeight: "600", color: "#0f172a" }}>{clientName || "—"}</div>
          </div>

          <div
            style={{
              marginBottom: "20px",
              padding: "16px",
              backgroundColor: "#f8fafc",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ fontSize: "0.75rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
              Project Details
            </div>
            <p style={{ whiteSpace: "pre-wrap", margin: 0, fontSize: "0.95rem", color: "#334155", lineHeight: 1.6 }}>{projectDetails || "—"}</p>
          </div>

          <div
            style={{
              padding: "20px",
              backgroundColor: "#0f172a",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "0.75rem", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
              Total Price
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#fff" }}>
              ₹{typeof price === "number" ? price.toLocaleString("en-IN") : price}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuotationView;
