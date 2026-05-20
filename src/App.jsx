import { useState } from "react";
import Home from "./Home";
import Compare from "./Compare";
import Alcool from "./drugs/Alcool";
import Heroine from "./drugs/Heroine";
import Crack from "./drugs/Crack";
import Cocaine from "./drugs/Cocaine";
import Methamphetamine from "./drugs/Methamphetamine";
import Tabac from "./drugs/Tabac";
import Cannabis from "./drugs/Cannabis";
import Benzodiazepines from "./drugs/Benzodiazepines";
import Cathinones from "./drugs/Cathinones";
import Amphetamines from "./drugs/Amphetamines";
import Champignons from "./drugs/Champignons";
import LSD from "./drugs/LSD";
import TwoCB from "./drugs/TwoCB";
import Ketamine from "./drugs/Ketamine";

const DRUGS = {
  alcool: Alcool,
  heroine: Heroine,
  crack: Crack,
  cocaine: Cocaine,
  meth: Methamphetamine,
  tabac: Tabac,
  cannabis: Cannabis,
  benzos: Benzodiazepines,
  cathinones: Cathinones,
  amphetamines: Amphetamines,
  champignons: Champignons,
  lsd: LSD,
  twocb: TwoCB,
  ketamine: Ketamine,
};

const DRUG_LIST = [
  { id: "alcool", name: "Alcool", icon: "🍷", color: "#ef4444" },
  { id: "heroine", name: "Héroïne", icon: "💉", color: "#a855f7" },
  { id: "crack", name: "Crack", icon: "💨", color: "#f97316" },
  { id: "meth", name: "Méth.", icon: "⚡", color: "#06b6d4" },
  { id: "cocaine", name: "Cocaïne", icon: "🤍", color: "#3b82f6" },
  { id: "tabac", name: "Tabac", icon: "🚬", color: "#f59e0b" },
  { id: "cannabis", name: "Cannabis", icon: "🌿", color: "#22c55e" },
  { id: "benzos", name: "Benzos", icon: "💊", color: "#6366f1" },
  { id: "cathinones", name: "Cathinones", icon: "🩷", color: "#ec4899" },
  { id: "amphetamines", name: "Amphet.", icon: "⚡", color: "#eab308" },
  { id: "champignons", name: "Champig.", icon: "🍄", color: "#9333ea" },
  { id: "lsd", name: "LSD", icon: "🌀", color: "#14b8a6" },
  { id: "twocb", name: "2C-B", icon: "🔮", color: "#d946ef" },
  { id: "ketamine", name: "Kétamine", icon: "🌊", color: "#38bdf8" },
];

function DrugNavBar({ current, onSelect }) {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
      background: "#070714ee", borderTop: "1px solid #1e1e3a",
      backdropFilter: "blur(12px)",
      overflowX: "auto",
    }}>
      <div style={{ display: "flex", gap: 2, padding: "6px 8px", minWidth: "max-content" }}>
        {DRUG_LIST.map((d) => (
          <button
            key={d.id}
            onClick={() => onSelect(d.id)}
            style={{
              background: current === d.id ? d.color + "22" : "none",
              border: current === d.id ? `1px solid ${d.color}55` : "1px solid transparent",
              borderRadius: 8, padding: "5px 10px", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              transition: "all 0.15s", minWidth: 54,
            }}
            onMouseEnter={e => { if (current !== d.id) e.currentTarget.style.background = d.color + "11"; }}
            onMouseLeave={e => { if (current !== d.id) e.currentTarget.style.background = "none"; }}
          >
            <span style={{ fontSize: 16 }}>{d.icon}</span>
            <span style={{
              fontSize: 9, fontFamily: "monospace",
              color: current === d.id ? d.color : "#475569",
              whiteSpace: "nowrap",
            }}>{d.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState(null);

  if (page === "compare") {
    return <Compare onBack={() => setPage(null)} />;
  }

  if (page && DRUGS[page]) {
    const DrugPage = DRUGS[page];
    return (
      <>
        <div style={{ paddingBottom: 64 }}>
          <DrugPage onBack={() => setPage(null)} />
        </div>
        <DrugNavBar current={page} onSelect={setPage} />
      </>
    );
  }

  return <Home onSelect={setPage} onCompare={() => setPage("compare")} />;
}
