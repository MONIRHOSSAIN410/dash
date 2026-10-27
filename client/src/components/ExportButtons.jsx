import { useState } from "react";
import { FileSpreadsheet, FileText } from "lucide-react";
import api from "../api/axios.js";

export default function ExportButtons({ params }) {
  const [busy, setBusy] = useState(null);

  const download = async (type) => {
    setBusy(type);
    try {
      const res = await api.get(`/export/${type}`, { params, responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const a = Object.assign(document.createElement("a"), {
        href: url,
        download: `sales-report-${params.from}_${params.to}.${type === "excel" ? "xlsx" : "pdf"}`,
      });
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("এক্সপোর্ট ব্যর্থ হয়েছে");
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <button className="btn-ghost" onClick={() => download("excel")} disabled={!!busy}>
        <FileSpreadsheet size={16} className="text-emerald-600" /> {busy === "excel" ? "..." : "Excel"}
      </button>
      <button className="btn-ghost" onClick={() => download("pdf")} disabled={!!busy}>
        <FileText size={16} className="text-red-600" /> {busy === "pdf" ? "..." : "PDF"}
      </button>
    </>
  );
}
