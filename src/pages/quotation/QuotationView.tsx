import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getQuotation } from "../../store/slices/quotationSlice";
import { recordQuotationView, getQuotationViewCount } from "../../services/api";
import type { RootState } from "../../store/store";
import { Eye } from "lucide-react";
import BrandLogo, { BrandTagline } from "../../components/BrandLogo";

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
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', system-ui, sans-serif", background: "var(--background)" }}>
        <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>Loading quotation...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', system-ui, sans-serif", background: "var(--background)" }}>
        <div style={{ textAlign: "center", color: "var(--danger)", padding: "24px" }}>Error: {error}</div>
      </div>
    );
  }
  if (!data) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', system-ui, sans-serif", background: "var(--background)" }}>
        <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>No quotation found.</div>
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
        background: "linear-gradient(160deg, var(--background) 0%, #E8EEF7 100%)",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        padding: "28px 16px",
      }}
    >
      <div
        style={{
          maxWidth: "560px",
          margin: "0 auto",
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "0 8px 30px rgba(22, 24, 43, 0.1)",
          overflow: "hidden",
          border: "1px solid var(--border)",
        }}
      >
        <div style={{
          padding: "1.5rem 1.5rem 1.25rem",
          borderBottom: "1px solid var(--border)",
          background: "linear-gradient(180deg, #fff 0%, var(--background) 100%)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "1rem" }}>
            <BrandLogo height={52} />
            {viewCount != null && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                <Eye size={14} /> {viewCount} views
              </div>
            )}
          </div>
          <div style={{ maxWidth: 240, marginBottom: "0.85rem" }}>
            <BrandTagline />
          </div>
          <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.02em" }}>
            Project Quotation
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            {companyName ? `Prepared by ${companyName}` : "Your quote details"}
          </p>
        </div>

        <div style={{ padding: "24px" }}>
          <div
            style={{
              marginBottom: "16px",
              padding: "16px",
              backgroundColor: "var(--background)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
              Client Name
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>{clientName || "—"}</div>
          </div>

          <div
            style={{
              marginBottom: "16px",
              padding: "16px",
              backgroundColor: "var(--background)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
              Project Details
            </div>
            <p style={{ whiteSpace: "pre-wrap", margin: 0, fontSize: "0.95rem", color: "#334155", lineHeight: 1.6 }}>{projectDetails || "—"}</p>
          </div>

          <div
            style={{
              padding: "20px",
              background: "linear-gradient(135deg, var(--text-primary) 0%, #132F52 100%)",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(148,163,184,0.95)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
              Total Price
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              ₹{typeof price === "number" ? price.toLocaleString("en-IN") : price}
            </div>
          </div>
        </div>

        <div style={{ padding: "14px 20px", textAlign: "center", borderTop: "1px solid var(--border)", background: "var(--background)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
          © {new Date().getFullYear()} BuildNexDev — Building Digital Growth
        </div>
      </div>
    </div>
  );
}

export default QuotationView;
