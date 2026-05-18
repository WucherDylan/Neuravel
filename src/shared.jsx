import { useState, useEffect } from "react";

export const useWidth = () => {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
};

export function SectionTitle({ children, color = "#ef4444" }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 22, fontWeight: "bold", color: "#e2e8f0", margin: "0 0 6px" }}>{children}</h2>
      <div style={{ width: 40, height: 2, background: color, borderRadius: 2 }} />
    </div>
  );
}

export function Card({ children, color }) {
  return (
    <div style={{ background: "#0d0d1a", border: `1px solid ${color}33`, borderRadius: 14, padding: 20 }}>
      {children}
    </div>
  );
}

export function ChartTip({ active, payload, label, line1, line2, unit = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px" }}>
      <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontSize: 12, marginBottom: 2 }}>
          {p.name === "normal" ? `🟢 ${line1}` : `🔴 ${line2}`}: <strong>{p.value}{unit}</strong>
        </div>
      ))}
    </div>
  );
}
