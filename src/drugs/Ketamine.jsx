import { useState } from "react";
import { useWidth, SectionTitle, Card } from "../shared";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";

const COLOR = "#38bdf8";

const ketTimeline = [
  { time: "0min", nmda: 100, dissociation: 100, analgesie: 100 },
  { time: "2min", nmda: 40, dissociation: 150, analgesie: 300 },
  { time: "5min", nmda: 20, dissociation: 400, analgesie: 480 },
  { time: "10min", nmda: 15, dissociation: 480, analgesie: 500 },
  { time: "20min", nmda: 20, dissociation: 400, analgesie: 420 },
  { time: "30min", nmda: 35, dissociation: 280, analgesie: 300 },
  { time: "45min", nmda: 60, dissociation: 160, analgesie: 180 },
  { time: "60min", nmda: 80, dissociation: 120, analgesie: 140 },
  { time: "90min", nmda: 95, dissociation: 105, analgesie: 110 },
  { time: "2h", nmda: 100, dissociation: 100, analgesie: 100 },
];

const ketRecoveryData = [
  { time: "Fin effets", cognition: 68, energie: 80, nmda: 42 },
  { time: "4h", cognition: 82, energie: 88, nmda: 72 },
  { time: "8h", cognition: 90, energie: 94, nmda: 88 },
  { time: "24h", cognition: 97, energie: 100, nmda: 97 },
  { time: "J+3", cognition: 100, energie: 100, nmda: 100 },
  { time: "J+7", cognition: 100, energie: 100, nmda: 100 },
];

const toleranceData = [
  { day: "J0 (prise)", tolerance: 100 },
  { day: "J1", tolerance: 70 },
  { day: "J3", tolerance: 45 },
  { day: "J5", tolerance: 25 },
  { day: "J7", tolerance: 12 },
  { day: "J10", tolerance: 4 },
  { day: "J14", tolerance: 0 },
];

const NAV = [
  { id: "overview", label: "Présentation" },
  { id: "immediate", label: "Effets immédiats" },
  { id: "systems", label: "Systèmes affectés" },
  { id: "timeline", label: "Timeline" },
  { id: "hormones", label: "Neurochimie" },
  { id: "khole", label: "K-hole" },
  { id: "stop", label: "Sécurité" },
  { id: "sources", label: "Sources" },
];

function KetTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0d0d1a", border: `1px solid ${COLOR}33`, borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      <div style={{ color: "#94a3b8", marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color }}>{p.name}: {p.value}%</div>
      ))}
    </div>
  );
}

function TolTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0d0d1a", border: `1px solid ${COLOR}33`, borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      <div style={{ color: "#94a3b8", marginBottom: 6 }}>{label}</div>
      <div style={{ color: COLOR }}>Tolérance résiduelle: {payload[0]?.value}%</div>
    </div>
  );
}

function Sources({ desk }) {
  const refs = [
    { authors: "Nutt DJ et al.", title: "Drug harms in the UK: a multicriteria decision analysis", journal: "The Lancet", year: "2010", url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(10)61462-6/fulltext" },
    { authors: "Chu PSK et al.", title: "Ketamine bladder syndrome: a systematic review", journal: "Addiction — Wiley", year: "2025", url: "https://doi.org/10.1111/add.70052" },
    { authors: "Jhang JF et al.", title: "ICI-RS 2025 — Consensus on Ketamine Cystitis Management", journal: "Neurourology and Urodynamics", year: "2025", url: "https://doi.org/10.1002/nau.25612" },
    { authors: "FDA", title: "FDA approves esketamine nasal spray (Spravato) for treatment-resistant depression", journal: "U.S. Food and Drug Administration", year: "2019", url: "https://www.fda.gov/news-events/press-announcements/fda-approves-new-nasal-spray-medication-treatment-resistant-depression" },
    { authors: "Zanos P et al.", title: "NMDAR inhibition-independent antidepressant actions of ketamine metabolites", journal: "Nature", year: "2016", url: "https://www.nature.com/articles/nature17998" },
    { authors: "Morgan CJ et al.", title: "Long-term effects of ketamine: evidence for a role of a NMDA receptor subtype", journal: "British Journal of Pharmacology", year: "2012", url: "https://pubmed.ncbi.nlm.nih.gov/22122630/" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle color={COLOR}>Sources & Références scientifiques</SectionTitle>
      <div style={{ background: `${COLOR}10`, border: `1px solid ${COLOR}33`, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 8 }}>PEER-REVIEWED · FDA · ADDICTION · NATURE</div>
        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          La kétamine fait l'objet d'une recherche active sur ses propriétés antidépressives (esketamine FDA 2019)
          et sur les risques de cystite kétaminique. Les données 2025 confirment la gravité de cette complication.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {refs.map((r, i) => (
          <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" style={{
            display: "block", background: "#0d0d1a", border: `1px solid ${COLOR}22`,
            borderRadius: 10, padding: "14px 18px", textDecoration: "none", transition: "border-color 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = COLOR + "55"}
          onMouseLeave={e => e.currentTarget.style.borderColor = COLOR + "22"}
          >
            <div style={{ fontSize: 12, color: "#e2e8f0", marginBottom: 4 }}>
              {r.authors} · <span style={{ color: COLOR }}>{r.journal}</span> · {r.year}
            </div>
            <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5, fontStyle: "italic" }}>{r.title}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function Ketamine({ onBack }) {
  const [section, setSection] = useState("overview");
  const w = useWidth();
  const desk = w >= 768;

  const renderSection = () => {
    switch (section) {
      case "overview": return <Overview desk={desk} />;
      case "immediate": return <Immediate desk={desk} />;
      case "systems": return <Systems desk={desk} />;
      case "timeline": return <Timeline desk={desk} />;
      case "hormones": return <Neurochimie desk={desk} />;
      case "khole": return <KHole desk={desk} />;
      case "stop": return <Safety desk={desk} />;
      case "sources": return <Sources desk={desk} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060610", fontFamily: "'Georgia','Times New Roman',serif", color: "#e2e8f0" }}>
      <div style={{
        background: "linear-gradient(180deg, #001520 0%, #060610 100%)",
        padding: desk ? "40px 48px 32px" : "24px 20px 20px",
        borderBottom: "1px solid #1e1e3a",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${COLOR}15 0%, transparent 70%)` }} />
        <button onClick={onBack} style={{
          background: "none", border: "1px solid #1e1e3a", borderRadius: 8,
          color: "#64748b", cursor: "pointer", padding: "6px 14px", fontSize: 12,
          fontFamily: "monospace", marginBottom: 20, display: "flex", alignItems: "center", gap: 6,
        }}>← Retour</button>
        <div style={{ maxWidth: 800, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <span style={{ fontSize: 42 }}>🌊</span>
            <div>
              <div style={{ fontSize: 10, color: COLOR, letterSpacing: 4, fontFamily: "monospace", marginBottom: 4 }}>DISSOCIATIF · ANTAGONISTE NMDA · ANESTHÉSIQUE</div>
              <h1 style={{ fontSize: desk ? 32 : 22, fontWeight: "bold", color: "#e2e8f0", margin: 0 }}>Kétamine</h1>
            </div>
          </div>
          <p style={{ color: "#94a3b8", fontSize: desk ? 14 : 12, lineHeight: 1.7, maxWidth: 620, margin: "0 0 16px" }}>
            Antagoniste des récepteurs NMDA — utilisée en anesthésie depuis 1970 et comme
            antidépresseur d'action rapide (Spravato®, FDA 2019). Dissocie la perception du corps et de l'environnement.
            Durée courte de <strong style={{ color: "#e2e8f0" }}>45–90 minutes</strong>, dépendance psychologique possible avec usage fréquent.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[
              { label: "Dose récréative", val: "50–150 mg (sniff)" },
              { label: "Durée", val: "45–90 min" },
              { label: "K-hole", val: "{'>'} 200 mg" },
              { label: "Demi-vie", val: "2.5–3h" },
            ].map((item) => (
              <div key={item.label} style={{ background: COLOR + "15", border: `1px solid ${COLOR}33`, borderRadius: 8, padding: "6px 14px" }}>
                <div style={{ fontSize: 10, color: "#64748b", fontFamily: "monospace" }}>{item.label}</div>
                <div style={{ fontSize: 13, color: COLOR, fontWeight: "bold" }}>{item.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "#0a0a14", borderBottom: "1px solid #1e1e3a", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 0, maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>
          {NAV.map((n) => (
            <button key={n.id} onClick={() => setSection(n.id)} style={{
              background: "none", border: "none", borderBottom: section === n.id ? `2px solid ${COLOR}` : "2px solid transparent",
              color: section === n.id ? COLOR : "#64748b",
              padding: "14px 16px", cursor: "pointer", fontSize: 12,
              fontFamily: "monospace", whiteSpace: "nowrap", transition: "color 0.2s",
            }}>
              {n.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: desk ? "36px 48px 60px" : "24px 16px 40px" }}>
        {renderSection()}
      </div>
    </div>
  );
}

function Overview({ desk }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle color={COLOR}>Qu'est-ce que la kétamine ?</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
        <Card color={COLOR}>
          <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>DÉCOUVERTE & HISTOIRE</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { year: "1962", fact: "Synthétisée par Calvin Stevens chez Parke-Davis comme alternative sûre à la phencyclidine (PCP)" },
              { year: "1970", fact: "Approuvée par la FDA comme anesthésique humain — largement utilisée au Vietnam" },
              { year: "1980s–90s", fact: "Diffusion récréative dans la scène rave britannique et américaine ('Special K')" },
              { year: "2000", fact: "Classée Schedule III (USA) — usage médical maintenu, contrôle renforcé" },
              { year: "2019", fact: "Esketamine (Spravato®) approuvée FDA pour dépression résistante — révolution psychiatrique" },
            ].map((e) => (
              <div key={e.year} style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 50, fontSize: 11, color: COLOR, fontFamily: "monospace", flexShrink: 0 }}>{e.year}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{e.fact}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card color={COLOR}>
          <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>MÉCANISME D'ACTION</div>
          <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: "0 0 12px" }}>
            La kétamine est un <strong style={{ color: "#e2e8f0" }}>antagoniste non compétitif des récepteurs NMDA</strong>
            (N-méthyl-D-aspartate), bloquant le canal ionique de l'intérieur pendant l'activation.
            Cela perturbe la transmission glutamatergique — d'où la dissociation, l'analgésie et
            l'effet antidépresseur rapide via la cascade AMPA/BDNF.
          </p>
          <div style={{ background: "#060610", borderRadius: 8, padding: "10px 14px", border: `1px solid ${COLOR}22` }}>
            <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace", marginBottom: 4 }}>CIBLES PRINCIPALES</div>
            <div style={{ fontSize: 12, color: "#e2e8f0" }}>NMDA (antagoniste) {'>'} opioïdes μ/σ {'>'} D2 (faible) {'>'} mAChR (faible)</div>
          </div>
        </Card>
      </div>
      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>KÉTAMINE vs AUTRES DISSOCIATIFS</div>
        <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr" : "1fr", gap: 10 }}>
          {[
            { param: "Durée", ket: "45–90 min", pcp: "4–8h", dxm: "3–6h" },
            { param: "Puissance", ket: "Élevée", pcp: "Très élevée", dxm: "Modérée" },
            { param: "Usage médical", ket: "Oui (anesthésie, dépression)", pcp: "Non (trop toxique)", dxm: "Antitussif" },
            { param: "Risque violence", ket: "Très faible", pcp: "Élevé (agitation)", dxm: "Faible" },
            { param: "Cystite", ket: "Oui (usage chronique)", pcp: "Non documenté", dxm: "Non documenté" },
            { param: "Dépendance", ket: "Psychologique", pcp: "Forte", dxm: "Modérée" },
          ].map((row) => (
            <div key={row.param} style={{ background: "#060610", borderRadius: 8, padding: "10px 12px", border: "1px solid #1e1e3a" }}>
              <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace", marginBottom: 6 }}>{row.param}</div>
              <div style={{ fontSize: 12, color: COLOR }}>Kétamine: {row.ket}</div>
              <div style={{ fontSize: 12, color: "#ef4444" }}>PCP: {row.pcp}</div>
              <div style={{ fontSize: 12, color: "#f97316" }}>DXM: {row.dxm}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Immediate({ desk }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle color={COLOR}>Effets immédiats selon la dose</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
        {[
          {
            title: "Basse dose · 20–50 mg (sniff)",
            items: [
              "Légère déréalisation, sensation de flottement",
              "Analgésie légère — corps moins sensible",
              "Euphorie douce, légèreté mentale",
              "Légères distorsions visuelles",
              "Durée : 20–40 minutes",
            ],
          },
          {
            title: "Dose récréative · 50–150 mg",
            items: [
              "Dissociation modérée — sentiment de sortir de son corps",
              "Visuels géométriques, tunnel visuel",
              "Distorsion profonde du temps et de l'espace",
              "Analgésie marquée — insensibilité physique",
              "Durée : 45–90 minutes",
            ],
          },
          {
            title: "Haute dose · 150–250 mg · K-hole approche",
            items: [
              "Dissociation totale du corps",
              "Incapacité à se déplacer ou parler",
              "Expériences de type NDE (Near Death Experience)",
              "Voyages dans des 'réalités alternatives'",
              "Amnésie partielle possible",
            ],
          },
          {
            title: "K-hole · > 250 mg",
            items: [
              "Dissolution complète du sens du moi",
              "Incapacité totale à interagir avec la réalité",
              "Expériences mystiques ou terrifiantes intenses",
              "Corps totalement anesthésié — immobilité",
              "Récupération 30–60 min après la fin",
            ],
          },
        ].map((phase) => (
          <Card key={phase.title} color={COLOR}>
            <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>{phase.title}</div>
            <ul style={{ margin: 0, padding: "0 0 0 16px", display: "flex", flexDirection: "column", gap: 6 }}>
              {phase.items.map((item) => (
                <li key={item} style={{ color: "#94a3b8", fontSize: 13 }}>{item}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>VOIE D'ADMINISTRATION — IMPACT</div>
        <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr" : "1fr", gap: 10 }}>
          {[
            { route: "Insufflation (sniff)", onset: "5–15 min", biodispo: "~40–45%", note: "La plus répandue récréativement" },
            { route: "Intraveineux", onset: "30 sec–2 min", biodispo: "100%", note: "Usage médical — puissance maximale" },
            { route: "Intramusculaire", onset: "3–5 min", biodispo: "~93%", note: "Usage médical / thérapeutique" },
            { route: "Oral", onset: "15–30 min", biodispo: "~17%", note: "Dose × 3 nécessaire, durée plus longue" },
          ].map((r) => (
            <div key={r.route} style={{ background: "#060610", borderRadius: 8, padding: "10px 12px", border: `1px solid ${COLOR}22` }}>
              <div style={{ fontSize: 11, color: "#e2e8f0", fontWeight: "bold", marginBottom: 6 }}>{r.route}</div>
              <div style={{ fontSize: 11, color: COLOR, fontFamily: "monospace" }}>Onset: {r.onset}</div>
              <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>Biodispo: {r.biodispo}</div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>{r.note}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Systems({ desk }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionTitle color={COLOR}>Systèmes biologiques affectés</SectionTitle>
      {[
        {
          system: "Récepteurs NMDA — Glutamate",
          icon: "🧊",
          detail: "La kétamine bloque le canal ionique des récepteurs NMDA en se fixant à l'intérieur (blocage 'open-channel'). Cela réduit la transmission glutamatergique — le principal neurotransmetteur excitateur du cerveau. C'est ce mécanisme qui génère la dissociation, l'analgésie, l'anesthésie et, paradoxalement, l'effet antidépresseur rapide via un rebond glutamatergique.",
          stats: [
            { label: "Cible principale", val: "Canal NMDA" },
            { label: "Glutamate", val: "Inhibition aiguë" },
            { label: "Rebond AMPA", val: "→ Antidépresseur" },
          ],
        },
        {
          system: "Cascade BDNF — Antidépresseur",
          icon: "🌱",
          detail: "L'effet antidépresseur de la kétamine repose sur un mécanisme indirect : le blocage NMDA provoque un rebond de glutamate sur les récepteurs AMPA → activation mTOR → synthèse rapide de BDNF (Brain-Derived Neurotrophic Factor). Cette cascade restaure les connexions synaptiques détruites par la dépression chronique — en quelques heures au lieu de semaines avec les ISRS.",
          stats: [
            { label: "BDNF", val: "+++ (rapide)" },
            { label: "Délai antidépresseur", val: "2–4 heures" },
            { label: "Durée effet", val: "1–2 semaines" },
          ],
        },
        {
          system: "Récepteurs opioïdes μ",
          icon: "💊",
          detail: "La kétamine présente une affinité modérée pour les récepteurs opioïdes μ — ce qui contribue à son effet analgésique (en plus du blocage NMDA). Cette composante opioïde est aussi impliquée dans le potentiel de dépendance psychologique avec usage répété.",
          stats: [
            { label: "Analgésie", val: "Très marquée" },
            { label: "Récepteurs μ", val: "Agonisme partiel" },
            { label: "Tolérance croisée", val: "Opioïdes (partielle)" },
          ],
        },
        {
          system: "Cystite kétaminique — Rein & Vessie",
          icon: "⚠️",
          detail: "L'usage chronique intensif de kétamine détruit l'urothélium (muqueuse de la vessie) via des métabolites toxiques. La cystite kétaminique est irréversible en stade avancé : douleurs pelviennes permanentes, miction toutes les 10 minutes, fibrose de la vessie. Peut nécessiter une cystectomie (ablation chirurgicale). C'est le risque organique majeur de la kétamine.",
          stats: [
            { label: "Seuil à risque", val: "Usage quotidien {'>'} quelques semaines" },
            { label: "Réversibilité", val: "Partielle si arrêt précoce" },
            { label: "Stade avancé", val: "Irréversible" },
          ],
        },
      ].map((sys) => (
        <Card key={sys.system} color={sys.system.includes("Cystite") ? "#ef4444" : COLOR}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 22 }}>{sys.icon}</span>
            <div style={{ fontSize: 14, fontWeight: "bold", color: "#e2e8f0" }}>{sys.system}</div>
          </div>
          <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: "0 0 14px" }}>{sys.detail}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {sys.stats.map((st) => (
              <div key={st.label} style={{ background: "#060610", borderRadius: 8, padding: "6px 12px", border: `1px solid ${sys.system.includes("Cystite") ? "#ef444422" : COLOR + "22"}` }}>
                <div style={{ fontSize: 10, color: "#64748b", fontFamily: "monospace" }}>{st.label}</div>
                <div style={{ fontSize: 13, color: sys.system.includes("Cystite") ? "#ef4444" : COLOR, fontWeight: "bold" }}>{st.val}</div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function Timeline({ desk }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle color={COLOR}>Timeline</SectionTitle>

      <div style={{ fontSize: 11, color: COLOR, letterSpacing: 3, fontFamily: "monospace", marginBottom: 16, paddingBottom: 8, borderBottom: `1px solid ${COLOR}22` }}>PARTIE 1 — EFFETS ACTIFS (30 min – 2h)</div>

      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>BLOCAGE NMDA, DISSOCIATION & ANALGÉSIE (% baseline)</div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={ketTimeline}>
            <defs>
              <linearGradient id="ket-nmdaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLOR} stopOpacity={0.4} />
                <stop offset="95%" stopColor={COLOR} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ket-dissGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ket-analGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
            <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 11 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} unit="%" />
            <Tooltip content={<KetTooltip />} />
            <ReferenceLine y={100} stroke="#334155" strokeDasharray="4 4" />
            <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
            <Area type="monotone" dataKey="nmda" name="Activité NMDA (inversé)" stroke={COLOR} fill="url(#ket-nmdaGrad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="dissociation" name="Dissociation" stroke="#9333ea" fill="url(#ket-dissGrad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="analgesie" name="Analgésie" stroke="#22c55e" fill="url(#ket-analGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 11, color: "#475569", textAlign: "center", marginTop: 8, fontFamily: "monospace" }}>
          Pic de dissociation à 10–20 min · retour baseline en ~2h (voie intranasale)
        </div>
      </Card>
      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>TOLÉRANCE — DISPARITION POST-PRISE (% tolérance résiduelle)</div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={toleranceData}>
            <defs>
              <linearGradient id="ket-tolGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLOR} stopOpacity={0.5} />
                <stop offset="95%" stopColor={COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
            <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} unit="%" domain={[0, 100]} />
            <Tooltip content={<TolTooltip />} />
            <Area type="monotone" dataKey="tolerance" name="Tolérance" stroke={COLOR} fill="url(#ket-tolGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 11, color: "#475569", textAlign: "center", marginTop: 8, fontFamily: "monospace" }}>
          La tolérance se développe rapidement avec usage régulier — disparaît en ~14 jours
        </div>
      </Card>
      <div style={{ fontSize: 11, color: "#22c55e", letterSpacing: 3, fontFamily: "monospace", marginBottom: 16, marginTop: 8, paddingBottom: 8, borderBottom: "1px solid #22c55e22" }}>PARTIE 2 — ARRÊT & RÉCUPÉRATION</div>

      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>RÉCUPÉRATION — COGNITION, ÉNERGIE & NMDA (% baseline)</div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={ketRecoveryData}>
            <defs>
              <linearGradient id="ket-cogRecGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLOR} stopOpacity={0.4} />
                <stop offset="95%" stopColor={COLOR} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ket-enRecGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
            <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 11 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} unit="%" domain={[40, 110]} />
            <Tooltip content={<KetTooltip />} />
            <ReferenceLine y={100} stroke="#334155" strokeDasharray="4 4" />
            <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
            <Area type="monotone" dataKey="cognition" name="Cognition" stroke={COLOR} fill="url(#ket-cogRecGrad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="energie" name="Énergie" stroke="#22c55e" fill="url(#ket-enRecGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 11, color: "#475569", textAlign: "center", marginTop: 8, fontFamily: "monospace" }}>
          Récupération rapide en ≈ 24–72h · la cystite (usage chronique) est irréversible
        </div>
      </Card>
    </div>
  );
}

function Neurochimie({ desk }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle color={COLOR}>Neurochimie de la kétamine</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
        {[
          { hormone: "Glutamate / NMDA", icon: "🧊", effect: "Blocage du canal NMDA → inhibition de la transmission glutamatergique. Mécanisme central de la dissociation et de l'analgésie. C'est aussi le point de départ de la cascade antidépressive.", impact: "Dissociation + analgésie profonde", color: COLOR },
          { hormone: "AMPA (rebond glutamate)", icon: "⚡", effect: "Le blocage NMDA entraîne un rebond de glutamate sur les récepteurs AMPA non bloqués → activation de mTOR → synthèse BDNF accélérée. Ce mécanisme indirect est responsable de l'effet antidépresseur rapide.", impact: "→ Antidépresseur via BDNF (heures)", color: "#22c55e" },
          { hormone: "BDNF (plasticité)", icon: "🌱", effect: "Augmentation rapide du BDNF post-kétamine — restaure la densité synaptique dans le cortex préfrontal et l'hippocampe dégradée par la dépression chronique. Fenêtre de neuroplasticité de 24–72h post-session.", impact: "Neuroplasticité restaurée", color: "#3b82f6" },
          { hormone: "Opioïdes μ (faible)", icon: "💊", effect: "Affinité modérée pour les récepteurs opioïdes μ — contribue à l'analgésie complémentaire et à la composante euphorisante. Peut générer une tolérance croisée légère avec les opioïdes.", impact: "Analgésie + légère euphorie", color: "#f97316" },
          { hormone: "Dopamine", icon: "💫", effect: "La kétamine augmente indirectement la dopamine dans le nucleus accumbens — d'où l'euphorie et le potentiel de dépendance psychologique. Effet plus modéré que la cocaïne ou l'amphétamine.", impact: "Dopamine ↑ modéré (NAc)", color: "#eab308" },
          { hormone: "Acétylcholine (mAChR)", icon: "🔄", effect: "Légère affinité antagoniste pour les récepteurs muscariniques — contribue aux effets dissociatifs et aux perturbations de la mémoire de travail observées après la prise.", impact: "Mémoire de travail ↓", color: "#9333ea" },
        ].map((h) => (
          <Card key={h.hormone} color={h.color}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 18 }}>{h.icon}</span>
              <div style={{ fontSize: 13, fontWeight: "bold", color: "#e2e8f0" }}>{h.hormone}</div>
            </div>
            <p style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.6, margin: "0 0 10px" }}>{h.effect}</p>
            <div style={{ background: "#060610", borderRadius: 6, padding: "6px 10px", display: "inline-block" }}>
              <span style={{ fontSize: 11, color: h.color, fontFamily: "monospace" }}>{h.impact}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function KHole({ desk }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle color={COLOR}>Le K-hole — Dissociation totale</SectionTitle>
      <div style={{ background: `${COLOR}10`, border: `1px solid ${COLOR}33`, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 8 }}>QU'EST-CE QUE LE K-HOLE ?</div>
        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          Le K-hole est un état de dissociation totale survenant à hautes doses (généralement {'>'} 200–250mg insufflés).
          La personne est <strong style={{ color: "#e2e8f0" }}>consciente mais incapable d'interagir avec la réalité</strong> —
          immobile, muette, "absente". L'expérience intérieure peut aller de la paix profonde à la terreur absolue.
          Pour les observateurs extérieurs, la personne semble inconsciente. Ce n'est pas une overdose —
          mais c'est un état de vulnérabilité extrême.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
        <Card color={COLOR}>
          <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>EXPÉRIENCE INTÉRIEURE</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              "Sentiment de quitter son corps complètement",
              "Dissolution du sens du moi (ego death)",
              "Perception d'autres dimensions ou réalités",
              "Expériences de type NDE (Near Death Experience)",
              "Le temps n'existe plus — secondes = éternité",
              "Euphorie intense ou terreur absolue selon le set",
            ].map((s) => (
              <div key={s} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <div style={{ color: COLOR, fontSize: 14, flexShrink: 0 }}>·</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{s}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card color="#ef4444">
          <div style={{ fontSize: 12, color: "#ef4444", fontFamily: "monospace", marginBottom: 10 }}>RISQUES DU K-HOLE</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { rule: "Vomissement + K-hole", desc: "Danger vital — incapable de se mettre en PLS seul, risque d'asphyxie" },
              { rule: "Hypothermie", desc: "Corps immobile, insensible au froid — risque en extérieur" },
              { rule: "Blessures physiques", desc: "Chutes sans douleur — fractures non ressenties" },
              { rule: "Agression / vol", desc: "Vulnérabilité totale — incapacité de se défendre" },
              { rule: "Traumatisme psychologique", desc: "Expérience terrifiante pouvant laisser des séquelles durables" },
            ].map((r) => (
              <div key={r.rule} style={{ borderLeft: "2px solid #ef444444", paddingLeft: 12 }}>
                <div style={{ fontSize: 12, color: "#e2e8f0" }}>{r.rule}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>GESTION D'UN K-HOLE CHEZ QUELQU'UN D'AUTRE</div>
        <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 12 }}>
          {[
            { action: "Position latérale de sécurité (PLS)", desc: "Immédiatement — risque de vomissement et d'asphyxie" },
            { action: "Ne pas laisser seul", desc: "Surveillance constante jusqu'au retour de conscience interactive" },
            { action: "Parler doucement", desc: "Voix calme, rassurante — peut entendre même dans le K-hole" },
            { action: "Ne pas donner d'eau", desc: "Risque de fausse route — attendre qu'il soit pleinement conscient" },
            { action: "Ne pas stimuler violemment", desc: "Pas de gifles, pas de bruit fort — aggrave l'anxiété" },
            { action: "Appeler le 15 si doute", desc: "Convulsions, cyanose, arrêt respiratoire = urgence vitale" },
          ].map((a) => (
            <div key={a.action} style={{ background: "#060610", borderRadius: 8, padding: "10px 12px", border: `1px solid ${COLOR}22` }}>
              <div style={{ fontSize: 12, color: "#e2e8f0", fontWeight: "bold", marginBottom: 4 }}>{a.action}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{a.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Safety({ desk }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle color={COLOR}>Sécurité & Réduction des risques</SectionTitle>
      <div style={{ background: "#ef444410", border: "1px solid #ef444433", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, color: "#ef4444", fontFamily: "monospace", marginBottom: 8 }}>RISQUE MAJEUR : CYSTITE KÉTAMINIQUE IRRÉVERSIBLE</div>
        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          La cystite kétaminique est le risque organique le plus grave et le plus sous-estimé de la kétamine.
          Contrairement à la plupart des autres substances, ce n'est <strong style={{ color: "#e2e8f0" }}>pas la dose unitaire qui compte
          mais la fréquence d'usage</strong>. Un usage quotidien pendant quelques semaines suffit à initier
          des dommages irréversibles de la vessie. Aucun antidote, aucune réparation chirurgicale complète
          n'existe en stade avancé.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
        <Card color={COLOR}>
          <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>RÉDUCTION DES RISQUES</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { rule: "Espacement strict des prises", desc: "Minimum 2–4 semaines entre les sessions — protège la vessie" },
              { rule: "Ne jamais snifer seul", desc: "Trip sitter sobre indispensable — K-hole imprévisible" },
              { rule: "Toujours en position allongée", desc: "Prévient les chutes pendant la dissociation" },
              { rule: "Estomac vide", desc: "Réduit le risque de vomissement en K-hole" },
              { rule: "Doser avec précision", desc: "Peser la poudre — passage dose récréative → K-hole est rapide" },
              { rule: "Surveiller les symptômes urinaires", desc: "Brûlures, urgences fréquentes = stopper immédiatement" },
            ].map((r) => (
              <div key={r.rule} style={{ borderLeft: `2px solid ${COLOR}44`, paddingLeft: 12, paddingBottom: 8 }}>
                <div style={{ fontSize: 12, color: "#e2e8f0" }}>{r.rule}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card color="#ef4444">
          <div style={{ fontSize: 12, color: "#ef4444", fontFamily: "monospace", marginBottom: 10 }}>CONTRE-INDICATIONS & MÉLANGES DANGEREUX</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { ci: "Alcool", why: "Dépression respiratoire combinée — risque vital, synergie dépresseurs SNC" },
              { ci: "Benzodiazépines", why: "Synergie dépresseurs SNC — sédation excessive, apnée" },
              { ci: "Opioïdes", why: "Double dépression respiratoire — dangereux même à doses thérapeutiques" },
              { ci: "Hypertension non contrôlée", why: "La kétamine augmente la TA et la FC — risque cardiovasculaire" },
              { ci: "Antécédents psychotiques", why: "Dissociatifs peuvent déclencher ou aggraver une psychose" },
              { ci: "Pathologie vésicale existante", why: "Aggravation quasi-certaine et rapide" },
            ].map((c) => (
              <div key={c.ci} style={{ borderLeft: "2px solid #ef444444", paddingLeft: 12 }}>
                <div style={{ fontSize: 12, color: "#e2e8f0" }}>{c.ci}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{c.why}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>KÉTAMINE THÉRAPEUTIQUE — ESKETAMINE (SPRAVATO®)</div>
        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: "0 0 14px" }}>
          L'eskétamine (énantiomère S de la kétamine) est approuvée FDA depuis 2019 pour la
          <strong style={{ color: "#e2e8f0" }}> dépression résistante au traitement</strong> et les idées suicidaires aiguës.
          Administrée en spray nasal sous supervision médicale (40–84mg), elle agit en quelques heures
          vs 2–6 semaines pour les antidépresseurs classiques. Le protocole encadré minimise les risques
          d'abus et de cystite grâce à l'espacement des sessions.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {[
            { label: "Indication FDA", val: "Dépression résistante" },
            { label: "Délai d'action", val: "2–4 heures" },
            { label: "Fréquence thérap.", val: "2×/semaine au départ" },
          ].map((st) => (
            <div key={st.label} style={{ background: "#060610", borderRadius: 8, padding: "6px 12px", border: `1px solid ${COLOR}22` }}>
              <div style={{ fontSize: 10, color: "#64748b", fontFamily: "monospace" }}>{st.label}</div>
              <div style={{ fontSize: 13, color: COLOR, fontWeight: "bold" }}>{st.val}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
