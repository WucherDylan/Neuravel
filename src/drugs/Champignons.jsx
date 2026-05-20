import { useState } from "react";
import { useWidth, SectionTitle, Card } from "../shared";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend, BarChart, Bar,
} from "recharts";

const COLOR = "#9333ea";

// Serotonin / 5-HT2A activation timeline
const serotoninData = [
  { time: "0h", serotonin: 100, perception: 100 },
  { time: "0.5h", serotonin: 180, perception: 140 },
  { time: "1h", serotonin: 280, perception: 320 },
  { time: "1.5h", serotonin: 340, perception: 480 },
  { time: "2h", serotonin: 360, perception: 520 },
  { time: "3h", serotonin: 320, perception: 450 },
  { time: "4h", serotonin: 240, perception: 320 },
  { time: "5h", serotonin: 160, perception: 200 },
  { time: "6h", serotonin: 120, perception: 140 },
  { time: "8h", serotonin: 105, perception: 110 },
  { time: "12h", serotonin: 100, perception: 100 },
];

const recoveryData = [
  { time: "Fin trip", bdnf: 150, humeur: 118, energie: 85 },
  { time: "J+1", bdnf: 168, humeur: 128, energie: 95 },
  { time: "J+3", bdnf: 155, humeur: 120, energie: 100 },
  { time: "J+7", bdnf: 138, humeur: 112, energie: 100 },
  { time: "J+14", bdnf: 118, humeur: 107, energie: 100 },
  { time: "J+21", bdnf: 108, humeur: 103, energie: 100 },
  { time: "J+30", bdnf: 100, humeur: 100, energie: 100 },
];

// Default Mode Network suppression
const dmnData = [
  { phase: "Repos", dmn: 100, connectivity: 100 },
  { phase: "Début", dmn: 70, connectivity: 130 },
  { phase: "Pic", dmn: 30, connectivity: 200 },
  { phase: "Plateau", dmn: 35, connectivity: 185 },
  { phase: "Descente", dmn: 60, connectivity: 145 },
  { phase: "Fin", dmn: 85, connectivity: 115 },
  { phase: "Lendemain", dmn: 100, connectivity: 105 },
];

// Therapeutic studies outcomes
const therapyData = [
  { condition: "Dépression résistante", response: 71, remission: 54 },
  { condition: "Dépression terminale", response: 80, remission: 60 },
  { condition: "Addiction tabac", response: 67, remission: 0 },
  { condition: "Alcoolisme", response: 59, remission: 0 },
  { condition: "Anxiété existentielle", response: 76, remission: 55 },
];

const NAV = [
  { id: "overview", label: "Présentation" },
  { id: "immediate", label: "Effets immédiats" },
  { id: "systems", label: "Systèmes affectés" },
  { id: "timeline", label: "Timeline" },
  { id: "hormones", label: "Neurochimie" },
  { id: "therapy", label: "Thérapie" },
  { id: "stop", label: "Sécurité" },
  { id: "sources", label: "Sources" },
];

function SeroTooltip({ active, payload, label }) {
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

function RecTooltip({ active, payload, label }) {
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

function DMNTooltip({ active, payload, label }) {
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

function TherapyTooltip({ active, payload, label }) {
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

function Sources({ desk }) {
  const refs = [
    { authors: "Nutt DJ et al.", title: "Drug harms in the UK: a multicriteria decision analysis", journal: "The Lancet", year: "2010", url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(10)61462-6/fulltext" },
    { authors: "COMPASS Pathways", title: "Phase 3 Trial of COMP360 for Treatment-Resistant Depression — Primary Endpoint Achieved", journal: "COMPASS Pathways Clinical Trial", year: "2025", url: "https://compasspathways.com/compass-pathways-announces-positive-results-from-phase-3-trial/" },
    { authors: "Carhart-Harris R et al.", title: "Trial of Psilocybin versus Escitalopram for Depression", journal: "New England Journal of Medicine", year: "2021", url: "https://www.nejm.org/doi/full/10.1056/nejmoa2032994" },
    { authors: "Ly C et al.", title: "Psychedelics Promote Structural and Functional Neural Plasticity", journal: "Cell Reports", year: "2018", url: "https://pubmed.ncbi.nlm.nih.gov/29898390/" },
    { authors: "Daws RE et al.", title: "Increased global integration in the brain after psilocybin therapy for depression", journal: "Nature Medicine", year: "2022", url: "https://www.nature.com/articles/s41591-022-01744-z" },
    { authors: "FDA", title: "Breakthrough Therapy Designation — Psilocybin for treatment-resistant depression", journal: "U.S. Food and Drug Administration", year: "2018", url: "https://www.fda.gov/patients/fast-track-breakthrough-therapy-accelerated-approval-priority-review/breakthrough-therapy" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle color={COLOR}>Sources & Références scientifiques</SectionTitle>
      <div style={{ background: `${COLOR}10`, border: `1px solid ${COLOR}33`, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 8 }}>PEER-REVIEWED · COMPASS · NEJM · NATURE</div>
        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          La psilocybine est l'une des substances les plus activement étudiées en psychiatrie aujourd'hui.
          En juin 2025, COMPASS Pathways a annoncé des résultats positifs de Phase 3 pour la dépression résistante.
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

export default function Champignons({ onBack }) {
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
      case "therapy": return <Therapy desk={desk} />;
      case "stop": return <Safety desk={desk} />;
      case "sources": return <Sources desk={desk} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060610", fontFamily: "'Georgia','Times New Roman',serif", color: "#e2e8f0" }}>
      <div style={{
        background: "linear-gradient(180deg, #150a2e 0%, #060610 100%)",
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
            <span style={{ fontSize: 42 }}>🍄</span>
            <div>
              <div style={{ fontSize: 10, color: COLOR, letterSpacing: 4, fontFamily: "monospace", marginBottom: 4 }}>PSYCHÉDÉLIQUE · AGONISTE 5-HT2A</div>
              <h1 style={{ fontSize: desk ? 32 : 22, fontWeight: "bold", color: "#e2e8f0", margin: 0 }}>Champignons psilocybe</h1>
            </div>
          </div>
          <p style={{ color: "#94a3b8", fontSize: desk ? 14 : 12, lineHeight: 1.7, maxWidth: 620, margin: "0 0 16px" }}>
            Psilocybine et psilocine — psychédéliques naturels produits par plus de 200 espèces de champignons.
            Parmi les substances les plus étudiées en psychiatrie moderne pour le traitement
            de la dépression résistante, de l'anxiété et des addictions.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[
              { label: "Dangerosité OMS", val: "Très faible" },
              { label: "Durée trip", val: "4–6 heures" },
              { label: "Dépendance physique", val: "Nulle" },
              { label: "Demi-vie psilocine", val: "~2h" },
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
      <SectionTitle color={COLOR}>Qu'est-ce que la psilocybine ?</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
        <Card color={COLOR}>
          <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>MÉCANISME D'ACTION</div>
          <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            La psilocybine est une prodrogue convertie en <strong style={{ color: "#e2e8f0" }}>psilocine</strong> par déphosphorylation hépatique.
            La psilocine agit comme <strong style={{ color: "#e2e8f0" }}>agoniste partiel des récepteurs 5-HT2A</strong> — les mêmes
            récepteurs ciblés par la sérotonine — principalement dans le cortex préfrontal.
            Elle perturbe le <em>Default Mode Network</em> (DMN), réseau cérébral lié au sens du moi.
          </p>
        </Card>
        <Card color={COLOR}>
          <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>ESPÈCES & DOSAGE</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { form: "Psilocybe cubensis", note: "Espèce la plus courante · 1–2g séché = dose modérée" },
              { form: "Psilocybe semilanceata", note: "'Liberty Cap' européen · plus puissant à poids égal" },
              { form: "Psilocybe azurescens", note: "L'une des plus puissantes connues" },
              { form: "Microdosage (0.1–0.3g)", note: "Sous-perceptuel · protocole Fadiman 1 jour/3" },
            ].map((f) => (
              <div key={f.form} style={{ borderLeft: `2px solid ${COLOR}44`, paddingLeft: 12 }}>
                <div style={{ fontSize: 12, color: "#e2e8f0" }}>{f.form}</div>
                <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>{f.note}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>PROFIL DE SÉCURITÉ — COMPARAISON OMS</div>
        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: "0 0 16px" }}>
          La psilocybine est considérée comme l'une des substances psychoactives les plus sûres
          sur le plan physiologique. Elle ne provoque ni dépendance physique, ni toxicité organique,
          ni overdose létale dans des conditions normales. Les risques sont essentiellement
          <strong style={{ color: "#e2e8f0" }}> psychologiques</strong> (bad trip, décompensation psychiatrique).
        </p>
        <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr 1fr" : "1fr 1fr", gap: 10 }}>
          {[
            { label: "Dépendance physique", val: "Nulle", ok: true },
            { label: "Toxicité organique", val: "Nulle", ok: true },
            { label: "Overdose létale", val: "Non documentée", ok: true },
            { label: "Tolérance croisée", val: "LSD/DMT (rapide)", ok: false },
          ].map((item) => (
            <div key={item.label} style={{ background: "#060610", borderRadius: 8, padding: "10px 12px", border: `1px solid ${item.ok ? "#22c55e" : "#f97316"}22` }}>
              <div style={{ fontSize: 10, color: "#64748b", fontFamily: "monospace", marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 13, color: item.ok ? "#22c55e" : "#f97316", fontWeight: "bold" }}>{item.val}</div>
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
      <SectionTitle color={COLOR}>Effets immédiats</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
        {[
          {
            title: "0–30 min · Onset",
            items: [
              "Légère nausée transitoire (passage intestinal)",
              "Fourmillements, yawning (bâillements)",
              "Légère anxiété d'anticipation",
              "Premiers changements perceptuels subtils",
              "Pupilles qui commencent à se dilater",
            ],
          },
          {
            title: "1–2h · Montée",
            items: [
              "Distorsions visuelles : halos, géométries",
              "Intensification émotionnelle forte",
              "Synesthésie (sons = couleurs)",
              "Pensées qui s'accélèrent ou s'ouvrent",
              "Sens du temps profondément altéré",
            ],
          },
          {
            title: "2–4h · Pic",
            items: [
              "Dissolution de l'ego (hautes doses)",
              "Expériences mystiques ou océaniques",
              "Révélations émotionnelles et introspection profonde",
              "Visuels fermés et ouverts intenses",
              "Connexion émotionnelle accrue aux autres",
            ],
          },
          {
            title: "4–6h · Descente",
            items: [
              "Retour progressif à l'identité normale",
              "Sérénité, épuisement doux",
              "Integration des expériences vécues",
              "Appétit qui revient",
              "Clarté mentale parfois remarquable",
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
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 8 }}>EFFET "SET AND SETTING" — DÉTERMINANT MAJEUR</div>
        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          Contrairement aux autres drogues, l'expérience psilocybine est <strong style={{ color: "#e2e8f0" }}>massivement influencée par
          l'état d'esprit (set) et l'environnement (setting)</strong>. Un cadre sûr, une intention claire
          et un guide de confiance transforment le risque de bad trip. C'est pourquoi les protocoles
          thérapeutiques contrôlent méticuleusement ces variables.
        </p>
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
          system: "Cortex préfrontal & 5-HT2A",
          icon: "🧠",
          detail: "La psilocine se lie aux récepteurs 5-HT2A du cortex préfrontal, perturbant la hiérarchie prédictive normale du cerveau. Le cerveau 'surprend' ses propres modèles internes → hallucinations et insights. Densité 5-HT2A élevée dans les couches V-VI du cortex — siège de la conscience.",
          stats: [
            { label: "Affinité 5-HT2A", val: "Haute (Ki ~6nM)" },
            { label: "DMN suppression", val: "−60 à −70%" },
            { label: "Connectivité globale", val: "+80–100%" },
          ],
        },
        {
          system: "Default Mode Network (DMN)",
          icon: "🌐",
          detail: "Le DMN est le réseau neuronal du 'moi' — ruminations, identité, narratif de soi. La psilocybine le supprime drastiquement et augmente la connectivité entre régions normalement disjointes (entropie cérébrale). L'effet est structurellement similaire à la méditation profonde de longue date.",
          stats: [
            { label: "Activité DMN", val: "−60% au pic" },
            { label: "Entropie neurale", val: "+200%" },
            { label: "Durée effet DMN", val: "pendant trip" },
          ],
        },
        {
          system: "Système sérotoninergique",
          icon: "⚗️",
          detail: "Pas de libération de sérotonine (contrairement au MDMA) — activation directe des récepteurs. Pas de déplétion en sérotonine après le trip. La tolérance aux effets psychédéliques se développe en 1–3 jours (tolérance croisée avec LSD) mais disparaît en quelques jours. Aucune neurotoxicité sérotoninergique documentée.",
          stats: [
            { label: "Libération sérotonine", val: "Non (agonisme direct)" },
            { label: "Neurotoxicité", val: "Non documentée" },
            { label: "Tolérance", val: "Rapide, réversible" },
          ],
        },
        {
          system: "Corps & Physiologie",
          icon: "💓",
          detail: "Effets physiques modérés : légère tachycardie (+10–20 bpm), mydriase, légère élévation tensionnelle. Nausées possibles au début (effets sur 5-HT3 gastrique). Aucun effet cardiotoxique significatif. Le principal risque physique est accidentel (comportement désorienté en bad trip).",
          stats: [
            { label: "FC", val: "+10–20 bpm" },
            { label: "Toxicité hépatique", val: "Nulle" },
            { label: "Mortalité directe", val: "Aucune documentée" },
          ],
        },
      ].map((sys) => (
        <Card key={sys.system} color={COLOR}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 22 }}>{sys.icon}</span>
            <div style={{ fontSize: 14, fontWeight: "bold", color: "#e2e8f0" }}>{sys.system}</div>
          </div>
          <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: "0 0 14px" }}>{sys.detail}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {sys.stats.map((st) => (
              <div key={st.label} style={{ background: "#060610", borderRadius: 8, padding: "6px 12px", border: `1px solid ${COLOR}22` }}>
                <div style={{ fontSize: 10, color: "#64748b", fontFamily: "monospace" }}>{st.label}</div>
                <div style={{ fontSize: 13, color: COLOR, fontWeight: "bold" }}>{st.val}</div>
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

      <div style={{ fontSize: 11, color: COLOR, letterSpacing: 3, fontFamily: "monospace", marginBottom: 16, paddingBottom: 8, borderBottom: `1px solid ${COLOR}22` }}>PARTIE 1 — EFFETS ACTIFS (4–6h)</div>

      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>ACTIVATION 5-HT2A & PERCEPTION (% baseline)</div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={serotoninData}>
            <defs>
              <linearGradient id="cham-seroGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLOR} stopOpacity={0.4} />
                <stop offset="95%" stopColor={COLOR} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="cham-percGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
            <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 11 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} unit="%" />
            <Tooltip content={<SeroTooltip />} />
            <ReferenceLine y={100} stroke="#334155" strokeDasharray="4 4" />
            <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
            <Area type="monotone" dataKey="serotonin" name="Activation 5-HT2A" stroke={COLOR} fill="url(#cham-seroGrad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="perception" name="Intensité perception" stroke="#22c55e" fill="url(#cham-percGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 11, color: "#475569", textAlign: "center", marginTop: 8, fontFamily: "monospace" }}>
          L'intensité perceptuelle dépasse l'activation biologique — amplification corticale
        </div>
      </Card>
      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>DEFAULT MODE NETWORK vs CONNECTIVITÉ GLOBALE</div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={dmnData}>
            <defs>
              <linearGradient id="cham-dmnGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="cham-connGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLOR} stopOpacity={0.4} />
                <stop offset="95%" stopColor={COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
            <XAxis dataKey="phase" tick={{ fill: "#64748b", fontSize: 11 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} unit="%" />
            <Tooltip content={<DMNTooltip />} />
            <ReferenceLine y={100} stroke="#334155" strokeDasharray="4 4" />
            <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
            <Area type="monotone" dataKey="dmn" name="Activité DMN (ego)" stroke="#ef4444" fill="url(#cham-dmnGrad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="connectivity" name="Connectivité globale" stroke={COLOR} fill="url(#cham-connGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 11, color: "#475569", textAlign: "center", marginTop: 8, fontFamily: "monospace" }}>
          Dissolution de l'ego = DMN supprimé + connectivité maximale
        </div>
      </Card>
      <div style={{ fontSize: 11, color: "#22c55e", letterSpacing: 3, fontFamily: "monospace", marginBottom: 16, marginTop: 8, paddingBottom: 8, borderBottom: "1px solid #22c55e22" }}>PARTIE 2 — ARRÊT & RÉCUPÉRATION (J+1 → J+30)</div>

      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>RÉCUPÉRATION — BDNF, HUMEUR & ÉNERGIE (% baseline)</div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={recoveryData}>
            <defs>
              <linearGradient id="cham-bdnfGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLOR} stopOpacity={0.4} />
                <stop offset="95%" stopColor={COLOR} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="cham-humGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
            <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 11 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} unit="%" domain={[80, 180]} />
            <Tooltip content={<RecTooltip />} />
            <ReferenceLine y={100} stroke="#334155" strokeDasharray="4 4" />
            <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
            <Area type="monotone" dataKey="bdnf" name="BDNF (neuroplasticité)" stroke={COLOR} fill="url(#cham-bdnfGrad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="humeur" name="Humeur / afterglow" stroke="#22c55e" fill="url(#cham-humGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 11, color: "#475569", textAlign: "center", marginTop: 8, fontFamily: "monospace" }}>
          Fenêtre de neuroplasticité maximale J+1 à J+7 — retour baseline en ≈ 30 jours
        </div>
      </Card>
    </div>
  );
}

function Neurochimie({ desk }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle color={COLOR}>Neurochimie & Hormones</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
        {[
          { hormone: "5-HT2A (sérotonine)", icon: "🔮", effect: "Agonisme direct — activation des récepteurs sans libération de sérotonine. Pas de déplétion post-trip.", impact: "Intensité psychédélique", color: COLOR },
          { hormone: "Glutamate", icon: "⚡", effect: "Augmentation du glutamate cortical via les interneurones — amplification de l'activité corticale.", impact: "Hallucinations, pensées", color: "#f97316" },
          { hormone: "Dopamine", icon: "💫", effect: "Légère augmentation indirecte dans le système mésolimbique. Pas le mécanisme principal (contrairement aux stimulants).", impact: "Euphorie modérée", color: "#22c55e" },
          { hormone: "Cortisol", icon: "🔥", effect: "Élévation modérée aiguë liée à l'activation émotionnelle. Redescend rapidement. Les études montrent une réduction du cortisol chronique post-thérapie.", impact: "+40–80% pendant trip", color: "#eab308" },
          { hormone: "BDNF (facteur neurotrophique)", icon: "🌱", effect: "Augmentation du BDNF après psilocybine — favorise la neuroplasticité et la formation de nouvelles connexions synaptiques. Mécanisme probable de l'effet antidépresseur durable.", impact: "+jusqu'à +100%", color: "#3b82f6" },
          { hormone: "Ocytocine", icon: "💜", effect: "Augmentation de l'ocytocine dans certaines études — lié à l'augmentation de l'empathie et de la connexion sociale ressentie pendant le trip.", impact: "Connexion sociale ↑", color: "#ec4899" },
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
      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>FENÊTRE DE NEUROPLASTICITÉ</div>
        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          La psilocybine ouvre une <strong style={{ color: "#e2e8f0" }}>fenêtre de plasticité synaptique</strong> de 2–3 semaines
          après la prise. Durant cette période, les patterns cognitifs et émotionnels
          sont plus malléables — d'où l'importance du suivi thérapeutique post-séance.
          C'est le fondement biologique de l'intégration psychothérapeutique.
        </p>
      </Card>
    </div>
  );
}

function Therapy({ desk }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle color={COLOR}>Thérapie assistée par psilocybine</SectionTitle>
      <div style={{ background: `${COLOR}10`, border: `1px solid ${COLOR}33`, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 8 }}>RÉVOLUTION EN PSYCHIATRIE</div>
        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          La psilocybine est en 2024 en phase III d'essais cliniques pour la dépression résistante
          aux traitements (États-Unis, Australie, UK). L'Australie a légalisé son usage thérapeutique
          supervisé en juillet 2023. La FDA lui a accordé le statut de <em>Breakthrough Therapy</em>
          pour la dépression résistante et le trouble dépressif majeur.
        </p>
      </div>
      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>RÉSULTATS ÉTUDES CLINIQUES (% patients améliorés)</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={therapyData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} unit="%" domain={[0, 100]} />
            <YAxis type="category" dataKey="condition" tick={{ fill: "#94a3b8", fontSize: 10 }} width={140} />
            <Tooltip content={<TherapyTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
            <Bar dataKey="response" name="Réponse thérapeutique" fill={COLOR} radius={[0, 4, 4, 0]} />
            <Bar dataKey="remission" name="Rémission complète" fill="#22c55e" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 11, color: "#475569", textAlign: "center", marginTop: 8, fontFamily: "monospace" }}>
          Sources : COMPASS Pathways, Johns Hopkins, Imperial College London · 2020–2024
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
        <Card color={COLOR}>
          <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>PROTOCOLE THÉRAPEUTIQUE</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { step: "1. Préparation (2–3 sessions)", desc: "Anamnèse, intentions thérapeutiques, alliance avec guide" },
              { step: "2. Séance psilocybine", desc: "25mg en contexte clinique, 6–8h accompagnement continu" },
              { step: "3. Intégration (2–4 semaines)", desc: "Psychothérapie intensive pour ancrer les insights" },
              { step: "4. Suivi long terme", desc: "Mesures d'outcomes à 1, 3, 6 et 12 mois" },
            ].map((s) => (
              <div key={s.step} style={{ borderLeft: `2px solid ${COLOR}44`, paddingLeft: 12 }}>
                <div style={{ fontSize: 12, color: "#e2e8f0" }}>{s.step}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card color={COLOR}>
          <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>CONTRE-INDICATIONS ABSOLUES</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { ci: "Antécédents de psychose", why: "Schizophrénie, trouble bipolaire type I — décompensation possible" },
              { ci: "Antécédents familiaux psychose", why: "Risque génétique de déclenchement" },
              { ci: "Lithium & MAOIs", why: "Risque convulsions (lithium), syndrome sérotoninergique (MAOIs)" },
              { ci: "Maladies cardiaques", why: "Tachycardie et légère élévation tensionnelle" },
            ].map((c) => (
              <div key={c.ci} style={{ borderLeft: "2px solid #ef444444", paddingLeft: 12 }}>
                <div style={{ fontSize: 12, color: "#e2e8f0" }}>{c.ci}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{c.why}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Safety({ desk }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle color={COLOR}>Sécurité & Réduction des risques</SectionTitle>
      <div style={{ background: "#22c55e10", border: "1px solid #22c55e33", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, color: "#22c55e", fontFamily: "monospace", marginBottom: 8 }}>PAS DE SEVRAGE — PAS DE DÉPENDANCE PHYSIQUE</div>
        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          La psilocybine ne crée <strong style={{ color: "#e2e8f0" }}>aucune dépendance physique</strong> et son arrêt
          n'entraîne aucun syndrome de sevrage. La tolérance se développe si rapidement
          que l'usage quotidien devient lui-même auto-limitant. Les risques sont réels
          mais d'une nature fondamentalement différente des autres substances de cette liste.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
        <Card color="#ef4444">
          <div style={{ fontSize: 12, color: "#ef4444", fontFamily: "monospace", marginBottom: 10 }}>RISQUES RÉELS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { risk: "Bad trip", desc: "Anxiété, terreur, paranoïa — surtout en mauvais set & setting ou haute dose" },
              { risk: "HPPD", desc: "Troubles perceptuels persistants (flashbacks) — rare, ~0.5% des usagers" },
              { risk: "Décompensation psy", desc: "Déclenchement possible chez prédisposés (psychose latente)" },
              { risk: "Accidents comportementaux", desc: "Comportements dangereux pendant le trip (chutes, circulation)" },
              { risk: "Erreur d'identification", desc: "Confusion avec espèces toxiques — Amanita phalloides mortelle" },
            ].map((r) => (
              <div key={r.risk} style={{ borderLeft: "2px solid #ef444444", paddingLeft: 12 }}>
                <div style={{ fontSize: 12, color: "#e2e8f0" }}>{r.risk}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card color="#22c55e">
          <div style={{ fontSize: 12, color: "#22c55e", fontFamily: "monospace", marginBottom: 10 }}>RÉDUCTION DES RISQUES</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { rule: "Identifier l'espèce", desc: "Ne jamais consommer sans identification mycologique certaine" },
              { rule: "Commencer bas", desc: "1g sec pour une première expérience — dose modérée 2–3g" },
              { rule: "Trip sitter", desc: "Personne sobre présente, de confiance — intervention en cas de détresse" },
              { rule: "Cadre sécurisé", desc: "Domicile connu, intérieur, sans engagement ultérieur obligatoire" },
              { rule: "Ne pas mélanger", desc: "Éviter alcool, lithium, MAOIs, autres psychédéliques" },
            ].map((r) => (
              <div key={r.rule} style={{ borderLeft: "2px solid #22c55e44", paddingLeft: 12 }}>
                <div style={{ fontSize: 12, color: "#e2e8f0" }}>{r.rule}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>RESSOURCES & ACCOMPAGNEMENT</div>
        <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr" : "1fr", gap: 10 }}>
          {[
            { name: "Psychedelic Support", contact: "psychedelic.support", desc: "Guides préparés pour trip sitting et intégration" },
            { name: "Zendo Project", contact: "zendoproject.org", desc: "Soutien en cas de crise psychédélique" },
            { name: "Tripsit", contact: "tripsit.me", desc: "Aide en ligne during difficult trips, harm reduction" },
          ].map((r) => (
            <div key={r.name} style={{ background: "#060610", borderRadius: 8, padding: "12px 14px", border: `1px solid ${COLOR}22` }}>
              <div style={{ fontSize: 12, color: "#e2e8f0", fontWeight: "bold", marginBottom: 4 }}>{r.name}</div>
              <div style={{ fontSize: 11, color: COLOR, fontFamily: "monospace", marginBottom: 4 }}>{r.contact}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
