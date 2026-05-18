import { useState } from "react";
import { useWidth, Card } from "./shared";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ReferenceLine,
} from "recharts";

// Données comparatives — scénario : usage régulier / dépendance installée (6–12 mois d'usage)
// Récupération = retour à la baseline du système dopaminergique après arrêt complet
const DRUG_DATA = {
  alcool: {
    name: "Alcool", icon: "🍷", color: "#ef4444", score: 72,
    dureeEffets: "2–6 heures",
    dopaminePeak: "+40–80%",
    dependancePhysique: "Élevée",
    sevrageMortel: true,
    // GABA-A et D2 se normalisent en 3-12 mois selon la sévérité (pas 2 semaines = gueule de bois)
    recuperationDopamine: "3–12 mois",
    risqueOD: "Élevé (dépression SNC)",
    mecanisme: "GABA, NMDA, dopamine",
    radar: { danger: 72, addiction: 75, euphorie: 55, neurotox: 65, sevrage: 90, duree: 25 },
    recovery: [
      { t: "J1", v: 28 }, { t: "J3", v: 40 }, { t: "J7", v: 53 },
      { t: "M1", v: 67 }, { t: "M3", v: 80 }, { t: "M6", v: 91 }, { t: "An1", v: 98 },
    ],
  },
  heroine: {
    name: "Héroïne", icon: "💉", color: "#a855f7", score: 55,
    dureeEffets: "4–6 heures",
    dopaminePeak: "+200%",
    dependancePhysique: "Extrême",
    sevrageMortel: false,
    // MOR downrégulation + D2 indirect : 12-24 mois pour usage lourd
    recuperationDopamine: "12–24 mois",
    risqueOD: "Très élevé (dépression respi.)",
    mecanisme: "µ-opioïde (MOR)",
    radar: { danger: 70, addiction: 92, euphorie: 90, neurotox: 40, sevrage: 80, duree: 25 },
    recovery: [
      { t: "J1", v: 18 }, { t: "J3", v: 27 }, { t: "J7", v: 38 },
      { t: "M1", v: 50 }, { t: "M3", v: 63 }, { t: "M6", v: 75 }, { t: "An1", v: 87 },
    ],
  },
  crack: {
    name: "Crack", icon: "💨", color: "#f97316", score: 54,
    dureeEffets: "5–15 minutes",
    dopaminePeak: "+400–500%",
    dependancePhysique: "Modérée",
    sevrageMortel: false,
    // Binge compulsif → DAT downrégulé comme cocaïne mais plus sévère : 12-18 mois
    recuperationDopamine: "12–18 mois",
    risqueOD: "Élevé (arythmie, AVC)",
    mecanisme: "DAT blockade, noradrénaline",
    radar: { danger: 65, addiction: 95, euphorie: 95, neurotox: 50, sevrage: 55, duree: 5 },
    recovery: [
      { t: "J1", v: 32 }, { t: "J3", v: 42 }, { t: "J7", v: 52 },
      { t: "M1", v: 63 }, { t: "M3", v: 74 }, { t: "M6", v: 85 }, { t: "An1", v: 94 },
    ],
  },
  meth: {
    name: "Méthamphétamine", icon: "⚡", color: "#06b6d4", score: 33,
    dureeEffets: "8–24 heures",
    dopaminePeak: "+700–900%",
    dependancePhysique: "Élevée",
    sevrageMortel: false,
    // Neurotoxicité DAT/SERT réelle → 18-24 mois, parfois séquelles permanentes
    recuperationDopamine: "18–24 mois (partiel)",
    risqueOD: "Modéré (hyperthermie, AVC)",
    mecanisme: "DAT/NET/SERT reversal massif",
    radar: { danger: 55, addiction: 85, euphorie: 85, neurotox: 90, sevrage: 65, duree: 80 },
    recovery: [
      { t: "J1", v: 22 }, { t: "J3", v: 31 }, { t: "J7", v: 41 },
      { t: "M1", v: 52 }, { t: "M3", v: 63 }, { t: "M6", v: 74 }, { t: "An1", v: 83 },
    ],
  },
  cocaine: {
    name: "Cocaïne", icon: "🤍", color: "#3b82f6", score: 27,
    dureeEffets: "30–60 minutes",
    dopaminePeak: "+250–300%",
    dependancePhysique: "Modérée",
    sevrageMortel: false,
    // Bloqueur pur (pas de reversal), pas de neurotoxicité directe → récupération 6-12 mois
    recuperationDopamine: "6–12 mois",
    risqueOD: "Modéré (infarctus coronarien)",
    mecanisme: "DAT + NET + SERT blockade",
    radar: { danger: 45, addiction: 70, euphorie: 80, neurotox: 45, sevrage: 50, duree: 18 },
    recovery: [
      { t: "J1", v: 48 }, { t: "J3", v: 58 }, { t: "J7", v: 68 },
      { t: "M1", v: 79 }, { t: "M3", v: 89 }, { t: "M6", v: 97 }, { t: "An1", v: 100 },
    ],
  },
  tabac: {
    name: "Tabac", icon: "🚬", color: "#f59e0b", score: 26,
    dureeEffets: "20–40 minutes (nicotine)",
    dopaminePeak: "+25–40%",
    dependancePhysique: "Élevée",
    sevrageMortel: false,
    // nAChR se normalisent en 4-8 semaines après arrêt tabac
    recuperationDopamine: "4–8 semaines",
    risqueOD: "Faible aigu (haute dose chronique)",
    mecanisme: "Récepteurs nicotiniques nAChR",
    radar: { danger: 40, addiction: 80, euphorie: 18, neurotox: 50, sevrage: 55, duree: 10 },
    recovery: [
      { t: "J1", v: 55 }, { t: "J3", v: 65 }, { t: "J7", v: 76 },
      { t: "M1", v: 89 }, { t: "M3", v: 96 }, { t: "M6", v: 99 }, { t: "An1", v: 100 },
    ],
  },
  cannabis: {
    name: "Cannabis", icon: "🌿", color: "#22c55e", score: 20,
    dureeEffets: "2–4h (fumé) / 4–8h (oral)",
    dopaminePeak: "+20–40%",
    dependancePhysique: "Faible",
    sevrageMortel: false,
    // CB1 recovery + D2 baseline : 4-8 semaines pour usage quotidien
    recuperationDopamine: "4–8 semaines",
    risqueOD: "Quasi-nul",
    mecanisme: "CB1 / CB2 agoniste",
    radar: { danger: 28, addiction: 32, euphorie: 45, neurotox: 28, sevrage: 20, duree: 28 },
    recovery: [
      { t: "J1", v: 63 }, { t: "J3", v: 72 }, { t: "J7", v: 81 },
      { t: "M1", v: 91 }, { t: "M3", v: 97 }, { t: "M6", v: 100 }, { t: "An1", v: 100 },
    ],
  },
  benzos: {
    name: "Benzodiazépines", icon: "💊", color: "#6366f1", score: 15,
    dureeEffets: "4–12h (selon durée)",
    dopaminePeak: "+15–30% (indirect)",
    dependancePhysique: "Élevée",
    sevrageMortel: true,
    // GABA-A sensitisation avec sevrage progressif (Ashton) : 4-12 semaines
    recuperationDopamine: "4–12 semaines (avec sevrage progressif)",
    risqueOD: "Élevé si combiné (alcool++)",
    mecanisme: "GABA-A modulateur allostérique",
    radar: { danger: 35, addiction: 68, euphorie: 28, neurotox: 22, sevrage: 88, duree: 38 },
    recovery: [
      { t: "J1", v: 48 }, { t: "J3", v: 55 }, { t: "J7", v: 65 },
      { t: "M1", v: 80 }, { t: "M3", v: 91 }, { t: "M6", v: 97 }, { t: "An1", v: 100 },
    ],
  },
  cathinones: {
    name: "Cathinones", icon: "🩷", color: "#ec4899", score: 18,
    dureeEffets: "2–4 heures (demi-vie courte)",
    dopaminePeak: "+380%",
    dependancePhysique: "Modérée",
    sevrageMortel: false,
    // Triple mécanisme mais moins neurotoxique que meth ; comparable à MDMA : 3-6 mois
    recuperationDopamine: "3–6 mois",
    risqueOD: "Modéré (hyperthermie, card.)",
    mecanisme: "DAT/NET/SERT inhibiteur + libérateur",
    radar: { danger: 40, addiction: 65, euphorie: 80, neurotox: 55, sevrage: 42, duree: 15 },
    recovery: [
      { t: "J1", v: 55 }, { t: "J3", v: 64 }, { t: "J7", v: 73 },
      { t: "M1", v: 83 }, { t: "M3", v: 93 }, { t: "M6", v: 99 }, { t: "An1", v: 100 },
    ],
  },
  amphetamines: {
    name: "Amphétamines", icon: "⚡", color: "#eab308", score: 22,
    dureeEffets: "4–8 heures",
    dopaminePeak: "+300–420%",
    dependancePhysique: "Modérée",
    sevrageMortel: false,
    // Reversal DAT/NET mais moins neurotoxique que meth → 6-12 mois (pas 12-24)
    recuperationDopamine: "6–12 mois",
    risqueOD: "Modéré (AVC hypertensif)",
    mecanisme: "DAT/NET/SERT reversal",
    radar: { danger: 35, addiction: 60, euphorie: 72, neurotox: 42, sevrage: 45, duree: 42 },
    recovery: [
      { t: "J1", v: 45 }, { t: "J3", v: 55 }, { t: "J7", v: 65 },
      { t: "M1", v: 76 }, { t: "M3", v: 87 }, { t: "M6", v: 96 }, { t: "An1", v: 100 },
    ],
  },
  champignons: {
    name: "Champignons", icon: "🍄", color: "#9333ea", score: 6,
    dureeEffets: "4–6 heures",
    dopaminePeak: "+15–30% (indirect)",
    dependancePhysique: "Nulle",
    sevrageMortel: false,
    // Agonisme direct 5-HT2A, pas de neurotoxicité dopaminergique
    recuperationDopamine: "Aucune altération dopaminergique",
    risqueOD: "Quasi-nul (aucun documenté)",
    mecanisme: "5-HT2A agoniste partial",
    radar: { danger: 10, addiction: 5, euphorie: 62, neurotox: 5, sevrage: 0, duree: 32 },
    recovery: [
      { t: "J1", v: 97 }, { t: "J3", v: 99 }, { t: "J7", v: 100 },
      { t: "M1", v: 100 }, { t: "M3", v: 100 }, { t: "M6", v: 100 }, { t: "An1", v: 100 },
    ],
  },
  lsd: {
    name: "LSD", icon: "🌀", color: "#14b8a6", score: 7,
    dureeEffets: "8–16 heures",
    dopaminePeak: "+20–40% (indirect)",
    dependancePhysique: "Nulle",
    sevrageMortel: false,
    // Agonisme direct 5-HT2A, tolérance croisée rapide mais pas de toxicité dopaminergique
    recuperationDopamine: "Aucune altération dopaminergique",
    risqueOD: "Quasi-nul (aucun direct)",
    mecanisme: "5-HT2A + D1/D2 + α1 agoniste",
    radar: { danger: 12, addiction: 8, euphorie: 70, neurotox: 8, sevrage: 0, duree: 78 },
    recovery: [
      { t: "J1", v: 95 }, { t: "J3", v: 98 }, { t: "J7", v: 100 },
      { t: "M1", v: 100 }, { t: "M3", v: 100 }, { t: "M6", v: 100 }, { t: "An1", v: 100 },
    ],
  },
};

const SUBSTANCES_LIST = Object.entries(DRUG_DATA).map(([id, d]) => ({ id, ...d }));

const RADAR_DIMS = [
  { key: "danger", label: "Danger global" },
  { key: "addiction", label: "Addiction" },
  { key: "euphorie", label: "Euphorie" },
  { key: "neurotox", label: "Neurotoxicité" },
  { key: "sevrage", label: "Sévérité sevrage" },
  { key: "duree", label: "Durée d'action" },
];

function RadarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 8, padding: "8px 12px", fontSize: 12 }}>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color }}>{p.name}: {p.value}/100</div>
      ))}
    </div>
  );
}

function RecovTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 8, padding: "8px 12px", fontSize: 12 }}>
      <div style={{ color: "#94a3b8", marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color }}>{p.name}: {p.value}%</div>
      ))}
    </div>
  );
}

export default function Compare({ onBack }) {
  const [selA, setSelA] = useState(null);
  const [selB, setSelB] = useState(null);
  const w = useWidth();
  const desk = w >= 768;

  const drugA = selA ? DRUG_DATA[selA] : null;
  const drugB = selB ? DRUG_DATA[selB] : null;

  const radarData = RADAR_DIMS.map((dim) => ({
    dim: dim.label,
    [drugA?.name ?? "A"]: drugA?.radar[dim.key] ?? 0,
    [drugB?.name ?? "B"]: drugB?.radar[dim.key] ?? 0,
  }));

  // Merge recovery data for both drugs
  const recoveryData = ["J1", "J3", "J7", "M1", "M3", "M6", "An1"].map((t) => ({
    t,
    [drugA?.name ?? "A"]: drugA?.recovery.find((r) => r.t === t)?.v ?? 0,
    [drugB?.name ?? "B"]: drugB?.recovery.find((r) => r.t === t)?.v ?? 0,
  }));

  const TABLE_ROWS = [
    { label: "Score dangerosité OMS", keyA: (d) => `${d.score}/100`, keyB: (d) => `${d.score}/100` },
    { label: "Durée des effets", keyA: (d) => d.dureeEffets, keyB: (d) => d.dureeEffets },
    { label: "Pic dopamine", keyA: (d) => d.dopaminePeak, keyB: (d) => d.dopaminePeak },
    { label: "Mécanisme principal", keyA: (d) => d.mecanisme, keyB: (d) => d.mecanisme },
    { label: "Dépendance physique", keyA: (d) => d.dependancePhysique, keyB: (d) => d.dependancePhysique },
    { label: "Sevrage potentiellement fatal", keyA: (d) => d.sevrageMortel ? "⚠️ OUI" : "Non", keyB: (d) => d.sevrageMortel ? "⚠️ OUI" : "Non" },
    { label: "Risque overdose", keyA: (d) => d.risqueOD, keyB: (d) => d.risqueOD },
    { label: "Récupération dopaminergique", keyA: (d) => d.recuperationDopamine, keyB: (d) => d.recuperationDopamine },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#060610", fontFamily: "'Georgia','Times New Roman',serif", color: "#e2e8f0" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(180deg, #0a0a1e 0%, #060610 100%)",
        padding: desk ? "40px 48px 32px" : "24px 20px 20px",
        borderBottom: "1px solid #1e1e3a",
      }}>
        <button onClick={onBack} style={{
          background: "none", border: "1px solid #1e1e3a", borderRadius: 8,
          color: "#64748b", cursor: "pointer", padding: "6px 14px", fontSize: 12,
          fontFamily: "monospace", marginBottom: 20, display: "flex", alignItems: "center", gap: 6,
        }}>← Retour</button>
        <div style={{ fontSize: 10, color: "#7c3aed", letterSpacing: 4, fontFamily: "monospace", marginBottom: 8 }}>OUTIL COMPARATIF</div>
        <h1 style={{ fontSize: desk ? 28 : 20, fontWeight: "bold", color: "#e2e8f0", margin: "0 0 8px" }}>Comparer deux substances</h1>
        <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>Sélectionne deux substances pour les comparer sur leurs effets, leur toxicité et leur profil de récupération.</p>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: desk ? "36px 48px 60px" : "24px 16px 40px" }}>

        {/* Substance selectors */}
        <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 24, marginBottom: 36 }}>
          {[
            { label: "SUBSTANCE A", sel: selA, setSel: setSelA, other: selB },
            { label: "SUBSTANCE B", sel: selB, setSel: setSelB, other: selA },
          ].map(({ label, sel, setSel, other }) => {
            const chosen = sel ? DRUG_DATA[sel] : null;
            return (
              <div key={label}>
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 3, fontFamily: "monospace", marginBottom: 12 }}>{label}</div>
                {chosen ? (
                  <div style={{
                    background: chosen.color + "18", border: `2px solid ${chosen.color}66`,
                    borderRadius: 12, padding: "14px 18px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 28 }}>{chosen.icon}</span>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: "bold", color: chosen.color }}>{chosen.name}</div>
                        <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>Score OMS: {chosen.score}/100</div>
                      </div>
                    </div>
                    <button onClick={() => setSel(null)} style={{
                      background: "none", border: "1px solid #1e1e3a", borderRadius: 6,
                      color: "#475569", cursor: "pointer", padding: "4px 10px", fontSize: 11, fontFamily: "monospace",
                    }}>×</button>
                  </div>
                ) : (
                  <div style={{ background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 11, color: "#475569", fontFamily: "monospace", marginBottom: 10 }}>Choisir :</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                      {SUBSTANCES_LIST.map((s) => (
                        <button
                          key={s.id}
                          disabled={s.id === other}
                          onClick={() => setSel(s.id)}
                          style={{
                            background: s.id === other ? "#1e1e3a" : "#060610",
                            border: `1px solid ${s.id === other ? "#1e1e3a" : s.color + "44"}`,
                            borderRadius: 8, padding: "8px 6px", cursor: s.id === other ? "not-allowed" : "pointer",
                            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                            opacity: s.id === other ? 0.35 : 1,
                          }}
                        >
                          <span style={{ fontSize: 18 }}>{s.icon}</span>
                          <span style={{ fontSize: 9, color: s.color, fontFamily: "monospace", textAlign: "center", lineHeight: 1.2 }}>
                            {s.name.length > 10 ? s.name.slice(0, 9) + "…" : s.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Comparison content — only shown when both selected */}
        {drugA && drugB ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

            {/* Score banner */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center" }}>
              <div style={{ background: drugA.color + "15", border: `1px solid ${drugA.color}44`, borderRadius: 12, padding: 20, textAlign: "center" }}>
                <div style={{ fontSize: 32 }}>{drugA.icon}</div>
                <div style={{ fontSize: 18, fontWeight: "bold", color: drugA.color, margin: "6px 0 2px" }}>{drugA.name}</div>
                <div style={{ fontSize: 28, fontWeight: "bold", color: "#e2e8f0" }}>{drugA.score}<span style={{ fontSize: 14, color: "#64748b" }}>/100</span></div>
                <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace" }}>SCORE DANGEROSITÉ OMS</div>
              </div>
              <div style={{ fontSize: 22, color: "#1e1e3a", fontFamily: "monospace" }}>VS</div>
              <div style={{ background: drugB.color + "15", border: `1px solid ${drugB.color}44`, borderRadius: 12, padding: 20, textAlign: "center" }}>
                <div style={{ fontSize: 32 }}>{drugB.icon}</div>
                <div style={{ fontSize: 18, fontWeight: "bold", color: drugB.color, margin: "6px 0 2px" }}>{drugB.name}</div>
                <div style={{ fontSize: 28, fontWeight: "bold", color: "#e2e8f0" }}>{drugB.score}<span style={{ fontSize: 14, color: "#64748b" }}>/100</span></div>
                <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace" }}>SCORE DANGEROSITÉ OMS</div>
              </div>
            </div>

            {/* Radar chart */}
            <div style={{ background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 12, color: "#475569", letterSpacing: 3, fontFamily: "monospace", marginBottom: 16, textAlign: "center" }}>
                PROFIL COMPARATIF — 6 DIMENSIONS (0–100)
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                  <PolarGrid stroke="#1e1e3a" />
                  <PolarAngleAxis dataKey="dim" tick={{ fill: "#64748b", fontSize: desk ? 11 : 9 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#334155", fontSize: 9 }} />
                  <Tooltip content={<RadarTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                  <Radar name={drugA.name} dataKey={drugA.name} stroke={drugA.color} fill={drugA.color} fillOpacity={0.25} strokeWidth={2} />
                  <Radar name={drugB.name} dataKey={drugB.name} stroke={drugB.color} fill={drugB.color} fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 8 }}>
                {RADAR_DIMS.map((d) => (
                  <div key={d.key} style={{ fontSize: 10, color: "#334155", textAlign: "center", fontFamily: "monospace" }}>
                    {d.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison table */}
            <div style={{ background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ fontSize: 12, color: "#475569", letterSpacing: 3, fontFamily: "monospace", padding: "16px 20px 12px", borderBottom: "1px solid #1e1e3a" }}>
                TABLEAU COMPARATIF DÉTAILLÉ
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid #1e1e3a" }}>
                <div style={{ padding: "10px 16px", fontSize: 11, color: "#334155", fontFamily: "monospace" }}>CRITÈRE</div>
                <div style={{ padding: "10px 16px", fontSize: 11, color: drugA.color, fontFamily: "monospace", borderLeft: "1px solid #1e1e3a" }}>
                  {drugA.icon} {drugA.name}
                </div>
                <div style={{ padding: "10px 16px", fontSize: 11, color: drugB.color, fontFamily: "monospace", borderLeft: "1px solid #1e1e3a" }}>
                  {drugB.icon} {drugB.name}
                </div>
              </div>
              {TABLE_ROWS.map((row, i) => {
                const valA = row.keyA(drugA);
                const valB = row.keyA(drugB);
                return (
                  <div key={row.label} style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                    borderBottom: i < TABLE_ROWS.length - 1 ? "1px solid #0d0d1a" : "none",
                    background: i % 2 === 0 ? "#060610" : "transparent",
                  }}>
                    <div style={{ padding: "10px 16px", fontSize: 12, color: "#64748b" }}>{row.label}</div>
                    <div style={{ padding: "10px 16px", fontSize: 12, color: valA.includes("⚠️") ? "#ef4444" : "#e2e8f0", borderLeft: "1px solid #1e1e3a" }}>
                      {valA}
                    </div>
                    <div style={{ padding: "10px 16px", fontSize: 12, color: valB.includes("⚠️") ? "#ef4444" : "#e2e8f0", borderLeft: "1px solid #1e1e3a" }}>
                      {valB}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recovery timeline */}
            <div style={{ background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 12, color: "#475569", letterSpacing: 3, fontFamily: "monospace", marginBottom: 6 }}>
                COURBE DE RÉCUPÉRATION COMPARÉE (% système dopaminergique normalisé)
              </div>
              <div style={{ fontSize: 11, color: "#334155", fontFamily: "monospace", marginBottom: 16 }}>
                Scénario : usage régulier / dépendance installée (6–12 mois d'usage) · arrêt complet
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={recoveryData}>
                  <defs>
                    <linearGradient id="cmp-gradA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={drugA.color} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={drugA.color} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="cmp-gradB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={drugB.color} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={drugB.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
                  <XAxis dataKey="t" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} unit="%" domain={[0, 100]} />
                  <Tooltip content={<RecovTooltip />} />
                  <ReferenceLine y={100} stroke="#334155" strokeDasharray="4 4" />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                  <Area type="monotone" dataKey={drugA.name} stroke={drugA.color} fill="url(#cmp-gradA)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey={drugB.name} stroke={drugB.color} fill="url(#cmp-gradB)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ fontSize: 11, color: "#334155", textAlign: "center", marginTop: 8, fontFamily: "monospace" }}>
                100% = retour à la baseline dopaminergique avant usage
              </div>
            </div>

            {/* Dimension bars */}
            <div style={{ background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 12, color: "#475569", letterSpacing: 3, fontFamily: "monospace", marginBottom: 16 }}>
                COMPARAISON PAR DIMENSION
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {RADAR_DIMS.map((dim) => {
                  const vA = drugA.radar[dim.key];
                  const vB = drugB.radar[dim.key];
                  return (
                    <div key={dim.key}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <div style={{ fontSize: 12, color: "#94a3b8" }}>{dim.label}</div>
                        <div style={{ display: "flex", gap: 12 }}>
                          <span style={{ fontSize: 12, color: drugA.color, fontFamily: "monospace" }}>{drugA.icon} {vA}</span>
                          <span style={{ fontSize: 12, color: drugB.color, fontFamily: "monospace" }}>{drugB.icon} {vB}</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ height: 8, background: "#1e1e3a", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ width: `${vA}%`, height: "100%", background: drugA.color, borderRadius: 4, transition: "width 0.6s ease" }} />
                        </div>
                        <div style={{ height: 8, background: "#1e1e3a", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ width: `${vB}%`, height: "100%", background: drugB.color, borderRadius: 4, transition: "width 0.6s ease" }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#334155" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚖️</div>
            <div style={{ fontSize: 14, fontFamily: "monospace" }}>Sélectionne deux substances pour lancer la comparaison</div>
          </div>
        )}
      </div>
    </div>
  );
}
