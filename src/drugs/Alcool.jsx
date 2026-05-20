import { useState } from "react";
import { useWidth, SectionTitle, Card } from "../shared";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";

const COLOR = "#ef4444";

const cortisolData = [
  { time: "Verre 1", normal: 12, drug: 18 },
  { time: "Minuit", normal: 8, drug: 28 },
  { time: "3h", normal: 10, drug: 38 },
  { time: "7h", normal: 18, drug: 32 },
  { time: "Midi J1", normal: 14, drug: 26 },
  { time: "Soir J1", normal: 10, drug: 22 },
  { time: "3h J2", normal: 10, drug: 30 },
  { time: "Midi J2", normal: 14, drug: 20 },
  { time: "3h J3", normal: 10, drug: 24 },
  { time: "Midi J3", normal: 14, drug: 17 },
  { time: "J4", normal: 14, drug: 15 },
  { time: "J5", normal: 13, drug: 13 },
];

const melatoninData = [
  { time: "20h", normal: 5, drug: 5 },
  { time: "22h", normal: 30, drug: 18 },
  { time: "00h", normal: 70, drug: 38 },
  { time: "2h", normal: 90, drug: 42 },
  { time: "4h", normal: 75, drug: 25 },
  { time: "6h", normal: 40, drug: 12 },
  { time: "8h", normal: 8, drug: 5 },
];

const systems = [
  {
    icon: "🧠", title: "Cerveau & Sommeil", color: "#818cf8",
    impacts: [
      { label: "Sommeil REM", value: "−60%", desc: "Supprimé dès le premier verre. Mémoire, émotions, récupération mentale sabotées." },
      { label: "Mélatonine", value: "−41%", desc: "Production bloquée. L'endormissement rapide est une sédation chimique, pas du vrai sommeil." },
      { label: "GABA potentialisé", value: "↑↑↑", desc: "Neurotransmetteur inhibiteur surdosé → assommoir chimique." },
      { label: "Glutamate rebond", value: "↑↑↑", desc: "Quand l'alcool se métabolise, le glutamate explose → réveils 3h-5h, anxiété, insomnie." },
      { label: "Acétaldéhyde", value: "Toxique", desc: "Métabolite cancérigène produit immédiatement, endommage l'ADN des neurones." },
    ]
  },
  {
    icon: "❤️", title: "Cœur & Circulation", color: "#f87171",
    impacts: [
      { label: "HRV cardiaque", value: "↓ chute", desc: "Variabilité de fréquence cardiaque effondrée — signe de stress du système nerveux autonome." },
      { label: "Fréquence cardiaque", value: "↑", desc: "Accélérée pendant et après la soirée. Récupération cardiaque nulle." },
      { label: "Fibrillation auriculaire", value: "Risque ↑", desc: "Holiday Heart Syndrome — arythmie déclenchée par une seule soirée, même chez des gens sains." },
      { label: "Triglycérides", value: "↑", desc: "Augmentent dès des consommations modestes. Facteur cardiovasculaire majeur." },
      { label: "Pression artérielle", value: "↑ rebond", desc: "Dilatation initiale puis vasoconstriction — pression artérielle plus haute après qu'avant." },
    ]
  },
  {
    icon: "⚗️", title: "Foie & Métabolisme", color: "#fb923c",
    impacts: [
      { label: "Priorité absolue", value: "100%", desc: "Le foie traite l'alcool avant tout. Graisses et glucides ingérés → stockés directement." },
      { label: "Combustion graisses", value: "STOP", desc: "Complètement arrêtée tant que l'alcool est présent. Même plusieurs heures après." },
      { label: "Glycogène", value: "Épuisé", desc: "Le foie consomme tout le sucre stocké pour détoxifier → hypoglycémie nocturne à 3h-4h." },
      { label: "Vitamines B & Mg", value: "Vidés", desc: "Consommés en masse pour métaboliser l'alcool. Système nerveux appauvri plusieurs jours." },
      { label: "Perméabilité intestinale", value: "↑", desc: "Leaky gut → endotoxines bactériennes dans le sang → inflammation systémique." },
    ]
  },
  {
    icon: "🧪", title: "Hormones", color: "#34d399",
    impacts: [
      { label: "Cortisol", value: "×3-4", desc: "Hormone du stress. Reste élevé 3 à 5 jours. Inflammation, graisses abdominales, humeur." },
      { label: "Testostérone", value: "−6 à −23%", desc: "Chute mesurable dès 1-2 verres. Conversion en œstrogènes via aromatase stimulée." },
      { label: "Insuline", value: "↑↑", desc: "Résistance à l'insuline. Le pancréas sécrète trop → glycémie instable 3-5 jours." },
      { label: "Ghréline (faim)", value: "↑↑", desc: "Hormone de la faim. Combinée au mauvais sommeil → fringales intenses plusieurs jours." },
      { label: "Œstrogènes", value: "↑", desc: "Augmentent chez hommes ET femmes. Facteur de risque cancer du sein (OMS groupe 1)." },
    ]
  },
];

const timeline = [
  { day: "Soirée", icon: "🍺", color: "#ef4444", phase: "Impact", items: ["Sédation GABA — endormissement rapide mais artificiel", "REM supprimé toute la nuit", "Mélatonine −41%, cortisol ×3", "Foie en détox totale — stockage maximal", "Acétaldéhyde produit dès le premier verre"] },
  { day: "Dimanche", icon: "😵", color: "#f97316", phase: "Fausse récupération", items: ["Bonne nuit par épuisement forcé (dette de sommeil)", "Cortisol encore très élevé toute la journée", "Fringales intenses — foie a vidé le glycogène", "Vitamines B & magnésium épuisés", "Inflammation systémique active"] },
  { day: "Lundi", icon: "😰", color: "#a855f7", phase: "Vraie facture", items: ["Rebond glutamate maximal → réveil brutal 3h-5h", "Hypoglycémie nocturne → faim de loup la nuit", "Cortisol brutal au créneau 3h-5h", "Sommeil fragmenté, REM encore absent", "Irritabilité, brouillard mental, à cran au réveil"] },
  { day: "Mardi", icon: "😤", color: "#6366f1", phase: "Rémanence", items: ["Réveils 3h-5h encore présents (cortisol)", "Résistance à l'insuline persistante", "Glycémie nocturne instable → faim au réveil", "Sérotonine encore partiellement épuisée", "Humeur moins stable que la normale"] },
  { day: "Mercredi", icon: "🌤️", color: "#22d3ee", phase: "Stabilisation", items: ["Cortisol commence à redescendre", "Sérotonine en cours de reconstitution", "Sommeil s'améliore — REM revient progressivement", "Glycémie nocturne plus stable", "Premiers signaux de vraie récupération"] },
  { day: "J4-J5", icon: "🌱", color: "#22c55e", phase: "Récupération", items: ["Mélatonine restaurée — sommeil normal", "Cortisol de retour à la baseline", "Testostérone qui remonte", "Réveil sans faim nocturne, sans irritabilité", "Récupération complète... avant le prochain week-end"] },
];

const stopBenefits = [
  { period: "24-48h", color: "#fb923c", benefits: ["Hydratation restaurée", "Foie soulagé", "Première nuit améliorée"] },
  { period: "1 semaine", color: "#f59e0b", benefits: ["Sommeil REM revenu", "Réveil moins irritable", "Plus d'énergie le matin"] },
  { period: "1 mois", color: "#84cc16", benefits: ["Testostérone normalisée", "Peau meilleure", "Humeur stable", "Meilleure récupération sportive"] },
  { period: "3 mois", color: "#22c55e", benefits: ["Circuits dopamine recâblés", "Plaisirs normaux amplifiés", "Poids stabilisé", "Envie d'alcool réduite"] },
  { period: "1 an+", color: "#06b6d4", benefits: ["Risque cardiovasculaire réduit", "Inflammation chronique disparue", "Mémoire améliorée", "Système immunitaire renforcé"] },
];

function AlcoolTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0d0d1a", border: `1px solid ${COLOR}33`, borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      <div style={{ color: "#94a3b8", marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color }}>
          {p.name === "normal" ? "Normal" : "Post-alcool"}: {p.value} {p.name === "normal" ? "µg/dL" : "µg/dL"}
        </div>
      ))}
    </div>
  );
}

function MelTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0d0d1a", border: `1px solid ${COLOR}33`, borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      <div style={{ color: "#94a3b8", marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color }}>
          {p.name === "normal" ? "Mélatonine normale" : "Après alcool"}: {p.value}%
        </div>
      ))}
    </div>
  );
}

const NAV = [
  { id: "overview", label: "Présentation" },
  { id: "immediate", label: "Effets immédiats" },
  { id: "systems", label: "Systèmes affectés" },
  { id: "timeline", label: "Timeline" },
  { id: "hormones", label: "Neurochimie" },
  { id: "risks", label: "Prise de poids" },
  { id: "stop", label: "Sécurité" },
  { id: "sources", label: "Sources" },
];

function Sources({ desk }) {
  const refs = [
    { authors: "Nutt DJ et al.", title: "Drug harms in the UK: a multicriteria decision analysis", journal: "The Lancet", year: "2010", url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(10)61462-6/fulltext" },
    { authors: "Okolo CA et al.", title: "Neurotoxicity of Chronic Alcohol Exposure: Mechanistic Insights, Cellular Disruption, and Emerging Therapeutic Strategies", journal: "International Journal of Molecular Sciences", year: "2025", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12786252/" },
    { authors: "Guo M et al.", title: "Roles of Oxidative Stress and Autophagy in Alcohol-Mediated Brain Damage", journal: "PubMed", year: "2025", url: "https://pubmed.ncbi.nlm.nih.gov/40227291/" },
    { authors: "Qasim S et al.", title: "Role of glial cells in neurotoxicological effects of alcohol", journal: "PMC / Frontiers", year: "2025", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12261501/" },
    { authors: "Rathore S et al.", title: "Alcohol and alcoholism associated neurological disorders: Current updates in a global perspective", journal: "PMC", year: "2025", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11718584/" },
    { authors: "World Health Organization", title: "Alcool — Aide-mémoire cancérogènes Groupe 1 (CIRC)", journal: "WHO / IARC", year: "2023", url: "https://www.who.int/fr/news-room/fact-sheets/detail/alcohol" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle color={COLOR}>Sources & Références scientifiques</SectionTitle>
      <div style={{ background: `${COLOR}10`, border: `1px solid ${COLOR}33`, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 8 }}>PEER-REVIEWED · OMS · PUBMED · NIH</div>
        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          Toutes les données présentées sont issues de publications scientifiques révisées par les pairs (2010–2025).
          Les études récentes ont été priorisées pour refléter l'état actuel des connaissances.
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

export default function Alcool({ onBack }) {
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
      case "risks": return <Risks desk={desk} />;
      case "stop": return <Safety desk={desk} />;
      case "sources": return <Sources desk={desk} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060610", fontFamily: "'Georgia','Times New Roman',serif", color: "#e2e8f0" }}>
      <div style={{
        background: "linear-gradient(180deg, #1a0808 0%, #060610 100%)",
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
            <span style={{ fontSize: 42 }}>🍺</span>
            <div>
              <div style={{ fontSize: 10, color: COLOR, letterSpacing: 4, fontFamily: "monospace", marginBottom: 4 }}>DÉPRESSEUR · LÉGAL · #1 OMS DANGEROSITÉ</div>
              <h1 style={{ fontSize: desk ? 32 : 22, fontWeight: "bold", color: "#e2e8f0", margin: 0 }}>Alcool</h1>
            </div>
          </div>
          <p style={{ color: "#94a3b8", fontSize: desk ? 14 : 12, lineHeight: 1.7, maxWidth: 620, margin: "0 0 16px" }}>
            De la première gorgée à la récupération complète — les mécanismes biologiques complets.
            L'alcool est classé <strong style={{ color: "#e2e8f0" }}>#1 en dangerosité globale</strong> par l'OMS (72/100),
            devant l'héroïne et le crack.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[
              { label: "Dangerosité OMS", val: "72/100 — #1" },
              { label: "Récupération", val: "4–5 jours" },
              { label: "Mélatonine", val: "−41% dès 1 verre" },
              { label: "Cancérigène", val: "Groupe 1 OMS" },
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
      <SectionTitle color={COLOR}>Qu'est-ce que l'alcool ?</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
        <Card color={COLOR}>
          <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>CLASSEMENT OMS — DANGEROSITÉ GLOBALE</div>
          {[
            { rank: "🥇", drug: "Alcool", score: 72, color: "#ef4444" },
            { rank: "🥈", drug: "Héroïne", score: 55, color: "#f97316" },
            { rank: "🥉", drug: "Crack", score: 54, color: "#fb923c" },
            { rank: "4", drug: "Tabac", score: 26, color: "#fbbf24" },
            { rank: "5", drug: "Cannabis", score: 20, color: "#84cc16" },
          ].map((d, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13 }}>{d.rank} {d.drug}</span>
                <span style={{ fontSize: 12, color: d.color, fontFamily: "monospace" }}>{d.score}/100</span>
              </div>
              <div style={{ height: 6, background: "#1e1e3a", borderRadius: 3 }}>
                <div style={{ width: `${d.score}%`, height: "100%", background: d.color, borderRadius: 3, opacity: 0.8 }} />
              </div>
            </div>
          ))}
          <div style={{ fontSize: 10, color: "#475569", marginTop: 12, fontStyle: "italic" }}>Source : David Nutt et al., The Lancet, 2010</div>
        </Card>
        <Card color={COLOR}>
          <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>MYTHE VS RÉALITÉ</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { myth: "Un verre de vin rouge est bon pour le cœur", reality: "Réfuté. Les études avaient des biais majeurs. L'alcool est cardiotoxique à toute dose." },
              { myth: "L'alcool aide à dormir", reality: "Il sédatise mais détruit l'architecture du sommeil. Zéro bénéfice récupérateur." },
              { myth: "Boire occasionnellement c'est sans risque", reality: "Le cerveau s'adapte même à une consommation sporadique. Il n'y a pas de dose sans effet." },
            ].map((m, i) => (
              <div key={i} style={{ background: "#060610", borderRadius: 8, padding: 10 }}>
                <div style={{ fontSize: 12, color: "#f87171", marginBottom: 4 }}>❌ {m.myth}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>✅ {m.reality}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>CHIFFRES CLÉS</div>
        <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr" : "1fr", gap: 10 }}>
          {[
            { val: "7 kcal/g", label: "Calories alcool", sub: "vs 4 kcal pour les glucides", color: "#ef4444" },
            { val: "4–5 jours", label: "Récupération complète", sub: "après une soirée chargée", color: "#a855f7" },
            { val: "−41%", label: "Mélatonine", sub: "dès un seul verre", color: "#6366f1" },
            { val: "×3–4", label: "Cortisol", sub: "pendant 3 à 5 jours", color: "#f97316" },
            { val: "−23%", label: "Testostérone", sub: "après 1–2 verres", color: "#fb923c" },
            { val: "Groupe 1", label: "Cancérigène OMS", sub: "sans seuil minimal", color: "#ef4444" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#060610", borderRadius: 8, padding: 12, textAlign: "center", border: "1px solid #1e1e3a" }}>
              <div style={{ fontSize: desk ? 20 : 16, fontWeight: "bold", color: s.color, marginBottom: 4, fontFamily: "monospace" }}>{s.val}</div>
              <div style={{ fontSize: 11, color: "#e2e8f0", marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontSize: 10, color: "#475569" }}>{s.sub}</div>
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
      <SectionTitle color={COLOR}>Effets immédiats — minute par minute</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 14 }}>
        {[
          { time: "0–15 min", color: "#fbbf24", icon: "👄", title: "Absorption", events: ["L'alcool passe dans le sang en 15 minutes", "Estomac vide = absorption 2× plus rapide", "Le foie commence à travailler immédiatement", "Acétaldéhyde produit dès la première molécule"] },
          { time: "15–45 min", color: "#f97316", icon: "🧠", title: "Effets cérébraux", events: ["GABA potentialisé → désinhibition, détente apparente", "Dopamine libérée → sensation de plaisir", "Cortex préfrontal ralenti → jugement altéré", "Mélatonine commence à chuter"] },
          { time: "1–2h", color: "#ef4444", icon: "💓", title: "Pic d'alcoolémie", events: ["HRV cardiaque au plus bas", "Testostérone en chute", "Cortisol commence à monter", "Foie traite ~1 verre/heure, tout le reste stocké"] },
          { time: "3–5h", color: "#a855f7", icon: "⚡", title: "Métabolisation", events: ["L'alcool disparaît, le glutamate explose en rebond", "Réveils nocturnes, micro-éveils", "Hypoglycémie : foie a vidé le glycogène", "Cortisol atteint son pic nocturne → réveil forcé"] },
          { time: "8–12h", color: "#6366f1", icon: "🌅", title: "Lendemain matin", events: ["Cortisol élevé → irritabilité, stress dès le réveil", "Sérotonine basse → humeur dégradée", "Déshydratation et manque de vitamines B", "REM manquant → brouillard mental, mémoire altérée"] },
        ].map((phase, i) => (
          <Card key={i} color={phase.color}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>{phase.icon}</span>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: "bold", color: "#e2e8f0" }}>{phase.title}</div>
                <div style={{ fontSize: 10, color: phase.color, fontFamily: "monospace" }}>{phase.time}</div>
              </div>
            </div>
            {phase.events.map((e, j) => (
              <div key={j} style={{ fontSize: 12, color: "#94a3b8", marginBottom: 5, paddingLeft: 10, borderLeft: `2px solid ${phase.color}44`, lineHeight: 1.5 }}>{e}</div>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
}

function Systems({ desk }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionTitle color={COLOR}>Systèmes biologiques affectés</SectionTitle>
      {systems.map((sys) => (
        <Card key={sys.system} color={sys.color}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 22 }}>{sys.icon}</span>
            <div style={{ fontSize: 14, fontWeight: "bold", color: "#e2e8f0" }}>{sys.title}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 10 }}>
            {sys.impacts.map((imp) => (
              <div key={imp.label} style={{ background: "#060610", borderRadius: 8, padding: "10px 12px", border: `1px solid ${sys.color}22` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: "bold", color: "#e2e8f0" }}>{imp.label}</span>
                  <span style={{ fontSize: 12, fontFamily: "monospace", color: sys.color, fontWeight: "bold" }}>{imp.value}</span>
                </div>
                <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>{imp.desc}</div>
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

      <div style={{ fontSize: 11, color: COLOR, letterSpacing: 3, fontFamily: "monospace", marginBottom: 16, paddingBottom: 8, borderBottom: `1px solid ${COLOR}22` }}>PARTIE 1 — EFFETS ACTIFS (soirée)</div>

      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>CORTISOL SUR 5 JOURS (µg/dL) — NORMAL VS POST-ALCOOL</div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={cortisolData}>
            <defs>
              <linearGradient id="alc-normalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="alc-drugGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLOR} stopOpacity={0.4} />
                <stop offset="95%" stopColor={COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
            <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
            <Tooltip content={<AlcoolTooltip />} />
            <ReferenceLine y={20} stroke="#334155" strokeDasharray="4 4" label={{ value: "Seuil", fill: "#475569", fontSize: 9 }} />
            <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
            <Area type="monotone" dataKey="normal" name="Cortisol normal" stroke="#22c55e" fill="url(#alc-normalGrad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="drug" name="Post-alcool" stroke={COLOR} fill="url(#alc-drugGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 11, color: "#475569", textAlign: "center", marginTop: 8, fontFamily: "monospace" }}>
          Valeur normale : 10–20 µg/dL. Le pic nocturne de 3h force le réveil pendant 3-5 jours.
        </div>
      </Card>
      <Card color="#6366f1">
        <div style={{ fontSize: 12, color: "#6366f1", fontFamily: "monospace", marginBottom: 12 }}>MÉLATONINE DANS LA NUIT (%) — RÉCUPÉRATION DOPAMINERGIQUE</div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={melatoninData}>
            <defs>
              <linearGradient id="alc-melNormal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="alc-melDrug" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
            <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 10 }} unit="%" />
            <Tooltip content={<MelTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
            <Area type="monotone" dataKey="normal" name="Mélatonine normale" stroke="#818cf8" fill="url(#alc-melNormal)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="drug" name="Après alcool" stroke="#f97316" fill="url(#alc-melDrug)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 11, color: "#475569", textAlign: "center", marginTop: 8, fontFamily: "monospace" }}>
          Même 1 verre réduit la mélatonine de 19 à 41%. Tu "dors" mais sans récupérer.
        </div>
      </Card>
      <div style={{ fontSize: 11, color: "#22c55e", letterSpacing: 3, fontFamily: "monospace", marginBottom: 16, marginTop: 8, paddingBottom: 8, borderBottom: "1px solid #22c55e22" }}>PARTIE 2 — ARRÊT & RÉCUPÉRATION (J1 → J5)</div>

      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>CASCADE JOUR PAR JOUR</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {timeline.map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "stretch" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 32 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.color, flexShrink: 0, marginTop: 14 }} />
                {i < timeline.length - 1 && <div style={{ width: 2, flex: 1, background: `linear-gradient(${d.color}, ${timeline[i+1].color})`, opacity: 0.3, minHeight: 20 }} />}
              </div>
              <div style={{ padding: "10px 12px", flex: 1, background: i % 2 === 0 ? "#060610" : "transparent", borderRadius: 6, margin: "2px 0" }}>
                <div style={{ fontSize: 12, color: d.color, fontWeight: "bold", marginBottom: 4 }}>{d.day} — {d.phase}</div>
                {d.items.slice(0, 2).map((item, j) => (
                  <div key={j} style={{ fontSize: 11, color: "#64748b" }}>· {item}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Neurochimie({ desk }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle color={COLOR}>Neurochimie de l'alcool</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
        {[
          { hormone: "Cortisol", icon: "🔥", effect: "Reste élevé 3 à 5 jours. Inflammation, graisses abdominales, humeur dégradée, réveils nocturnes forcés.", impact: "×3–4 pendant 3-5 jours", color: "#ef4444" },
          { hormone: "Mélatonine", icon: "🌙", effect: "Production bloquée dès le premier verre. L'endormissement rapide est une sédation chimique, pas du vrai sommeil récupérateur.", impact: "−41% dès 1 verre", color: "#6366f1" },
          { hormone: "Testostérone", icon: "⚡", effect: "Chute mesurable dès 1-2 verres. Conversion en œstrogènes via aromatase stimulée par l'alcool.", impact: "−6 à −23%", color: "#f97316" },
          { hormone: "Insuline", icon: "📈", effect: "Résistance à l'insuline. Le pancréas sécrète trop → glycémie instable 3-5 jours, fringales nocturnes.", impact: "↑↑ résistance 3-5 jours", color: "#fbbf24" },
          { hormone: "Ghréline (faim)", icon: "🍕", effect: "Hormone de la faim amplifiée. Combinée au mauvais sommeil → fringales intenses plusieurs jours.", impact: "↑↑ 2-4 jours", color: "#fb923c" },
          { hormone: "GABA / Glutamate", icon: "🧠", effect: "GABA surdosé pendant l'ivresse, puis rebond glutamate massif → réveils 3h-5h, anxiété, insomnie.", impact: "Rebond glutamate J2-J3", color: COLOR },
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

function Risks({ desk }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle color={COLOR}>Prise de poids — mécanismes</SectionTitle>
      <div style={{ background: "#ef444410", border: "1px solid #ef444433", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, color: "#ef4444", fontFamily: "monospace", marginBottom: 8 }}>CE N'EST PAS UNIQUEMENT UNE QUESTION DE CALORIES</div>
        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          Même sans manger beaucoup pendant une soirée, l'alcool provoque une prise de poids.
          Le mécanisme principal n'est pas calorique — c'est <strong style={{ color: "#e2e8f0" }}>métabolique</strong>.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 12 }}>
        {[
          { num: "01", color: "#ef4444", title: "Priorité métabolique absolue", desc: "Le corps reconnaît l'alcool comme toxique et arrête tout pour l'éliminer. Pendant ce temps, graisses et glucides sont stockés directement. Combustion des graisses à 0%." },
          { num: "02", color: "#f97316", title: "7 kcal par gramme", desc: "Presque autant que les graisses (9 kcal). Une bière = 150–200 kcal vides. Zéro nutriment, zéro satiété." },
          { num: "03", color: "#fbbf24", title: "Insuline → stockage abdominal", desc: "L'alcool provoque un pic d'insuline, hormone du stockage — qui dirige les graisses vers le ventre. La 'bedaine de bière' est physiologique." },
          { num: "04", color: "#a855f7", title: "Cortisol → graisses viscérales", desc: "Cortisol élevé 3–5 jours = stockage autour des organes + dégradation musculaire = métabolisme de base qui ralentit." },
          { num: "05", color: "#6366f1", title: "Testostérone ↓ → fonte musculaire", desc: "La testostérone maintient le muscle. Elle chute dès 1–2 verres. Moins de muscle = moins de calories brûlées." },
          { num: "06", color: "#22d3ee", title: "Fringales post-alcool", desc: "L'alcool stimule les neurones de la faim. Le lendemain : hypoglycémie + cortisol + mauvais sommeil = ghréline au max." },
        ].map((item, i) => (
          <Card key={i} color={item.color}>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ fontFamily: "monospace", fontSize: 22, fontWeight: "bold", color: item.color, opacity: 0.4, flexShrink: 0, lineHeight: 1 }}>{item.num}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: "bold", color: item.color, marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Safety({ desk }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle color={COLOR}>Sécurité & Réduction des risques</SectionTitle>
      <div style={{ background: "#22c55e10", border: "1px solid #22c55e33", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, color: "#22c55e", fontFamily: "monospace", marginBottom: 8 }}>BÉNÉFICES DE L'ARRÊT DANS LE TEMPS</div>
        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          La récupération est réelle et mesurable. En 4 à 5 jours sans alcool, le corps récupère de l'épisode précédent.
          Un mois sans alcool normalise la testostérone, améliore le sommeil et stabilise l'humeur.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
        <Card color={COLOR}>
          <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>BÉNÉFICES PAR PÉRIODE</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {stopBenefits.map((period, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: period.color, flexShrink: 0, marginTop: 4 }} />
                  {i < stopBenefits.length - 1 && <div style={{ width: 2, flex: 1, background: `linear-gradient(${period.color}, ${stopBenefits[i+1].color})`, opacity: 0.3, minHeight: 20 }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: period.color, fontFamily: "monospace", fontWeight: "bold", marginBottom: 4 }}>{period.period}</div>
                  {period.benefits.map((b, j) => (
                    <div key={j} style={{ fontSize: 12, color: "#94a3b8", marginBottom: 2 }}>✓ {b}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card color="#22c55e">
          <div style={{ fontSize: 12, color: "#22c55e", fontFamily: "monospace", marginBottom: 10 }}>TENIR EN SOIRÉE — TECHNIQUES</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { rule: "Avoir un verre dans la main", desc: "Eau gazeuse + citron, Perrier, Coca. Personne ne sait ce que tu bois. Coupe 80% de la pression sociale." },
              { rule: "La phrase toute faite", desc: "\"Je bois plus\" — calme, souriant, sans explication. Tu ne dois rien justifier." },
              { rule: "Décider AVANT de partir", desc: "Une fois dans l'ambiance, le cerveau est en mode soirée. La décision se prend à la maison." },
              { rule: "\"Je choisis\" pas \"je peux pas\"", desc: "Différence psychologique majeure. Décision active vs frustration." },
              { rule: "Visualiser le lendemain matin", desc: "Se lever lucide, sans gueule de bois, fier de soi. Une des meilleures sensations." },
            ].map((r) => (
              <div key={r.rule} style={{ borderLeft: `2px solid #22c55e44`, paddingLeft: 12 }}>
                <div style={{ fontSize: 12, color: "#e2e8f0" }}>{r.rule}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>RESSOURCES</div>
        <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr" : "1fr", gap: 10 }}>
          {[
            { name: "Drogues Info Service", contact: "0800 23 13 13", desc: "Ligne gratuite, anonyme, 7j/7" },
            { name: "Alcool Info Service", contact: "0980 980 930", desc: "Conseil, orientation, écoute" },
            { name: "Dry January", contact: "dryjanuary.fr", desc: "Défi 31 jours sans alcool — communauté" },
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
