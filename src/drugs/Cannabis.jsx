import { useState } from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts";
import { useWidth, SectionTitle, Card } from "../shared";

const COLOR = "#22c55e";

const NAV = [
  { id: "overview", label: "Vue d'ensemble", icon: "⚡" },
  { id: "immediate", label: "Effets immédiats", icon: "🌿" },
  { id: "systems", label: "Systèmes affectés", icon: "🧬" },
  { id: "timeline", label: "Timeline récupération", icon: "📅" },
  { id: "hormones", label: "Endocannabinoïdes & Hormones", icon: "📈" },
  { id: "brain", label: "Cerveau & Mémoire", icon: "🧠" },
  { id: "stop", label: "Récupération", icon: "🌱" },
];

const dopamineData = [
  { time: "Baseline", normal: 100, drug: 100 },
  { time: "Aigu", normal: 100, drug: 130 },
  { time: "2h", normal: 100, drug: 110 },
  { time: "6h", normal: 100, drug: 98 },
  { time: "Chron. 1m", normal: 100, drug: 82 },
  { time: "Chron. 6m", normal: 100, drug: 75 },
  { time: "Arrêt 1m", normal: 100, drug: 85 },
  { time: "Arrêt 3m", normal: 100, drug: 93 },
  { time: "Arrêt 6m", normal: 100, drug: 98 },
];

const endoData = [
  { time: "Normal", cb1: 100, thc: 0 },
  { time: "Usage 1 sem", cb1: 85, thc: 100 },
  { time: "Usage 1 mois", cb1: 65, thc: 100 },
  { time: "Usage 1 an", cb1: 45, thc: 100 },
  { time: "Arrêt 1 sem", cb1: 50, thc: 20 },
  { time: "Arrêt 1 mois", cb1: 70, thc: 5 },
  { time: "Arrêt 3 mois", cb1: 88, thc: 0 },
  { time: "Arrêt 6 mois", cb1: 97, thc: 0 },
];

const systems = [
  {
    icon: "🧠", title: "Cerveau & Cognition", color: "#22c55e",
    impacts: [
      { label: "Récepteurs CB1", value: "Agoniste THC", desc: "THC se fixe aux récepteurs CB1 (cerveau) — normalement activés par les endocannabinoïdes naturels (anandamide). Modulation inhibitrice GABA et glutamate." },
      { label: "Mémoire de travail", value: "−25 à −40%", desc: "CB1 dense dans l'hippocampe → mémoire à court terme et encodage altérés pendant l'intoxication. Moins prononcé à CBD élevé." },
      { label: "Cerveau en développement", value: "⚠️ Critique", desc: "CB1 rôle central dans le câblage cérébral jusqu'à 25 ans. Usage précoce (<16 ans) : altérations structurelles mesurables en IRM." },
      { label: "Dopamine baseline", value: "↓ chronique", desc: "Usage lourd et régulier → réduction dopamine baseline et densité CB1. Syndrome amotivationnel. Réversible avec abstinence." },
      { label: "Risque psychose", value: "×2 si prédisposé", desc: "THC peut précipiter une psychose chez les génétiquement prédisposés (COMTval158, gène AKT1). Cannabis fort (>15% THC) = risque plus élevé." },
    ]
  },
  {
    icon: "🫁", title: "Poumons (fumé)", color: "#fb923c",
    impacts: [
      { label: "Inhalation fumée", value: "3-5× pire", desc: "Fumer du cannabis expose à 3-5× plus de CO et de goudrons que le tabac à volume égal. La technique d'inhalation prolonge l'exposition." },
      { label: "Bronchite chronique", value: "Risque ↑", desc: "Même sans tabac associé, le cannabis fumé augmente le risque de bronchite chronique et de toux persistante." },
      { label: "Cancer poumon (fumé)", value: "Association", desc: "L'association tabac+cannabis est nettement cancérigène. Cannabis seul : moins évident mais possible avec usage très intense." },
      { label: "Vaporisation", value: "Réduction risques", desc: "Vaporiser le cannabis à 180-200°C délivre le THC sans combustion. Réduit significativement les composés irritants et cancérigènes." },
      { label: "EVALI (e-cigarette)", value: "Produits coupés", desc: "Cannabis coupé avec huiles de vitamine E acétate → pneumonie lipidique grave. Risque avec produits non contrôlés." },
    ]
  },
  {
    icon: "❤️", title: "Cœur & Circulation", color: "#f87171",
    impacts: [
      { label: "Tachycardie aiguë", value: "+20-50 bpm", desc: "THC → activation sympathique → FC augmentée 20-50 bpm dans les 15 premières minutes. Revient à la normale en 2-3h." },
      { label: "Hypothension orthostatique", value: "Vasodilation", desc: "THC provoque une vasodilatation périphérique. Debout rapidement → vertiges, syncope possible." },
      { label: "Risque IM", value: "×5 dans 1h", desc: "Risque d'infarctus multiplié par 5 dans l'heure suivant la consommation chez les patients cardiaques. Population générale : faible." },
      { label: "HRV (variabilité FC)", value: "↓ aiguë", desc: "Perturbation du système nerveux autonome pendant l'intoxication. Revient à la normale." },
      { label: "Usage jeune/cœur sain", value: "Faible risque", desc: "Chez les jeunes et sains, le risque cardiovasculaire aigu du cannabis est faible. Différent chez les plus de 50 ans." },
    ]
  },
  {
    icon: "🧪", title: "Hormones & Fertilité", color: "#34d399",
    impacts: [
      { label: "Testostérone", value: "↓ usage lourd", desc: "Usage quotidien intensif → réduction testostérone. Usage occasionnel : effet minime à absent." },
      { label: "GnRH (fertilité)", value: "↓ axe HHG", desc: "CB1 dans l'hypothalamus → perturbation axe hypothalamo-hypophyso-gonadique. Cycle menstruel altéré, fertilité réduite." },
      { label: "Prolactine", value: "↑ usage lourd", desc: "Perturbation hormonale avec usage intensif. Galactorrhée possible chez femmes." },
      { label: "Appétit (ghréline)", value: "↑↑ aigu", desc: "'Munchies' — THC active les récepteurs CB1 dans l'hypothalamus et potentialise la ghréline → faim intense aigu." },
      { label: "Anxiété/cortisol", value: "Biphasique", desc: "Faibles doses THC → anxiolytique. Fortes doses ou prédisposition → anxiété et cortisol élevé. CBD antagonise cet effet." },
    ]
  },
];

const timeline = [
  { day: "Usage", icon: "🌿", color: "#22c55e", phase: "Intoxication", items: ["Onset fumé : 5-10 min, oral : 30-90 min", "Euphorie, relaxation, rires, créativité", "Altération perception du temps", "Mémoire à court terme altérée", "Faim intense ('munchies'), yeux rouges"] },
  { day: "2-4h", icon: "🌊", color: "#84cc16", phase: "Descente", items: ["Effets qui s'estompent progressivement", "Possible légère fatigue, somnolence", "Faim prolongée", "Retour à la conscience normale", "Pas de crash sévère (contrairement stimulants)"] },
  { day: "24-72h", icon: "😤", color: "#fbbf24", phase: "Post-usage", items: ["Léger brouillard cognitif possible", "Insomnie possible (rebond sommeil REM)", "Irritabilité chez usagers dépendants", "THC stocké dans les graisses — détectable 30 jours", "Fonctions normales pour l'essentiel"] },
  { day: "1-4 sem", icon: "🌥️", color: "#f97316", phase: "Sevrage (dépendants)", items: ["Irritabilité, agitation", "Insomnie — sommeil REM perturbé", "Perte d'appétit transitoire", "Anxiété légère à modérée", "Craving psychologique"] },
  { day: "1-3 mois", icon: "🌤️", color: "#6366f1", phase: "Récupération", items: ["Récepteurs CB1 qui se normalisent", "Mémoire et cognition qui reviennent", "Dopamine baseline remonte", "Sommeil qui s'améliore", "Clarté mentale retrouvée"] },
  { day: "3-6 mois", icon: "🌱", color: "#22c55e", phase: "Récupération complète", items: ["Fonctions cognitives normalisées", "Système endocannabinoïde récupéré", "Réduction des envies chroniques", "Plaisirs naturels pleinement restaurés"] },
];

const stopBenefits = [
  { period: "24-72h", color: "#fbbf24", benefits: ["Sevrage doux (non-dépendants)", "Sommeil REM qui revient"] },
  { period: "1-4 semaines", color: "#f97316", benefits: ["Irritabilité qui diminue", "Appétit normalisé", "Clarté mentale progressivement"] },
  { period: "1-3 mois", color: "#84cc16", benefits: ["Mémoire de travail améliorée", "Concentration restaurée", "Récepteurs CB1 normalisés"] },
  { period: "3-6 mois", color: "#22c55e", benefits: ["Récupération cognitive complète", "Dopamine baseline restaurée", "Motivations naturelles revenues"] },
];

const DopaTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px" }}>
      <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontSize: 12, marginBottom: 2 }}>
          {p.name === "normal" ? "🟢 Dopamine saine" : "🟩 Cannabis"}: <strong>{p.value}%</strong>
        </div>
      ))}
    </div>
  );
};

const EndoTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px" }}>
      <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontSize: 12, marginBottom: 2 }}>
          {p.name === "cb1" ? "🟢 Sensibilité CB1" : "🟩 THC actif"}: <strong>{p.value}%</strong>
        </div>
      ))}
    </div>
  );
};

export default function Cannabis({ onBack }) {
  const [activeNav, setActiveNav] = useState("overview");
  const [activeSystem, setActiveSystem] = useState(0);
  const [activeDay, setActiveDay] = useState(0);
  const w = useWidth();
  const desk = w >= 768;

  return (
    <div style={{ minHeight: "100vh", background: "#060610", fontFamily: "'Georgia','Times New Roman',serif", color: "#e2e8f0" }}>

      <div style={{
        background: "linear-gradient(180deg, #041408 0%, #060610 100%)",
        padding: desk ? "48px 48px 36px" : "28px 20px 20px",
        borderBottom: "1px solid #0a2010",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, #22c55e18 0%, transparent 70%)" }} />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid #0a2010", borderRadius: 8, color: "#64748b", padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "monospace", marginBottom: 16 }}>
            ← Choisir une substance
          </button>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: COLOR, marginBottom: 10, fontFamily: "monospace" }}>GUIDE SCIENTIFIQUE · #7 OMS · 20/100</div>
          <h1 style={{
            fontSize: desk ? 38 : 26, fontWeight: "bold", margin: "0 0 10px", lineHeight: 1.2,
            background: "linear-gradient(135deg, #fff 40%, #22c55e)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Cannabis — système endocannabinoïde
          </h1>
          <p style={{ fontSize: desk ? 15 : 13, color: "#64748b", margin: 0, lineHeight: 1.7, maxWidth: 600 }}>
            THC agit sur un système neuromodulateur essentiel. Risques variables selon âge, fréquence et génétique.
          </p>
        </div>
      </div>

      <div style={{
        overflowX: "auto", display: "flex", gap: 8,
        padding: desk ? "14px 48px" : "10px 16px",
        borderBottom: "1px solid #1e1e3a", scrollbarWidth: "none",
        justifyContent: desk ? "center" : "flex-start",
      }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setActiveNav(n.id)} style={{
            flexShrink: 0, padding: desk ? "7px 16px" : "6px 12px",
            borderRadius: 20, border: "1px solid",
            borderColor: activeNav === n.id ? COLOR : "#1e1e3a",
            background: activeNav === n.id ? COLOR + "22" : "transparent",
            color: activeNav === n.id ? COLOR : "#64748b",
            fontSize: desk ? 12 : 11, cursor: "pointer", whiteSpace: "nowrap",
            fontFamily: "monospace", letterSpacing: 0.5,
          }}>
            {n.icon} {n.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: desk ? "36px 48px" : "20px 16px" }}>

        {activeNav === "overview" && (
          <div>
            <SectionTitle color={COLOR}>Vue d'ensemble</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 24, marginBottom: 24 }}>
              <div style={{ background: "#041408", border: `1px solid ${COLOR}33`, borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 11, color: COLOR, letterSpacing: 2, fontFamily: "monospace", marginBottom: 16 }}>PROFIL PHARMACOLOGIQUE</div>
                {[
                  { label: "Principes actifs", value: "THC (psychoactif), CBD (non-psychoactif)" },
                  { label: "Mécanisme THC", value: "Agoniste partiel CB1 (cerveau) et CB2 (immun.)" },
                  { label: "Onset fumé", value: "5-10 min (oral : 30-90 min — variable)" },
                  { label: "Durée du high", value: "2-4 heures (oral : 4-8h)" },
                  { label: "Dépendance", value: "9% des usagers (vs 23% héroïne, 32% tabac)" },
                  { label: "Taux dépendance", value: "Plus élevé si usage précoce et quotidien" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, paddingBottom: 10, borderBottom: i < 5 ? `1px solid ${COLOR}22` : "none" }}>
                    <span style={{ fontSize: 12, color: "#64748b", flexShrink: 0, width: "38%" }}>{item.label}</span>
                    <span style={{ fontSize: 12, color: "#e2e8f0", textAlign: "right" }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { val: "9%", label: "Taux de dépendance", sub: "parmi les usagers", color: COLOR },
                  { val: "×2", label: "Risque psychose", sub: "si prédisposition génétique", color: "#f97316" },
                  { val: "−30%", label: "Mémoire de travail", sub: "pendant intoxication", color: "#fbbf24" },
                  { val: "25 ans", label: "Maturité cérébrale", sub: "usage avant = risque plus élevé", color: "#ef4444" },
                  { val: "30 jours", label: "Détectable dans les urines", sub: "usage régulier", color: "#6366f1" },
                  { val: "3-6 mois", label: "Récupération cognitive", sub: "après arrêt usage régulier", color: "#22c55e" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 12, padding: 14, textAlign: "center" }}>
                    <div style={{ fontSize: desk ? 18 : 14, fontWeight: "bold", color: s.color, marginBottom: 4, fontFamily: "monospace" }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: "#e2e8f0", marginBottom: 3 }}>{s.label}</div>
                    <div style={{ fontSize: 10, color: "#475569" }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
            <Card color={COLOR}>
              <div style={{ fontSize: 11, color: COLOR, letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>MYTHE VS RÉALITÉ</div>
              <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr" : "1fr", gap: 14 }}>
                {[
                  { myth: "Le cannabis n'est pas addictif", reality: "9% des usagers développent une dépendance. Le taux monte à 17% pour ceux qui commencent à l'adolescence, et 50% pour les usagers quotidiens." },
                  { myth: "Le cannabis est sans danger pour le cerveau", reality: "L'usage régulier avant 25 ans perturbe le câblage cérébral en cours. Des altérations structurelles sont mesurables en IRM chez les usagers précoces." },
                  { myth: "Le CBD annule tous les effets négatifs du THC", reality: "Le CBD module certains effets du THC mais n'annule pas tout. Les produits forts en THC seul restent plus risqués que des produits équilibrés." },
                ].map((m, i) => (
                  <div key={i} style={{ background: "#060610", borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 12, color: "#f87171", marginBottom: 6 }}>❌ {m.myth}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>✅ {m.reality}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeNav === "immediate" && (
          <div>
            <SectionTitle color={COLOR}>Effets immédiats — du flash à la descente</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 14 }}>
              {[
                { time: "5–15 min (fumé)", color: COLOR, icon: "🌿", title: "Onset", events: ["THC absorbé par les poumons → cerveau en 5-10 min", "CB1 activés dans le cortex, striatum, hippocampe", "Vasodilatation → yeux rouges", "Tachycardie : +20-50 bpm les 15 premières minutes", "Hypotension orthostatique possible"] },
                { time: "15 min – 1h", color: "#84cc16", icon: "😄", title: "Effets psychoactifs", events: ["Euphorie, rires, détente", "Créativité, associations d'idées inattendues", "Perception altérée du temps (semble plus lent)", "Intensification sensorielle (musique, nourriture)", "Sociabilité ou introspection selon la personne"] },
                { time: "1–2h", color: "#fbbf24", icon: "🍕", title: "Plateau", events: ["'Munchies' — faim intense (CB1 hypothalamiques)", "Mémoire à court terme altérée", "Possible anxiété/paranoïa si dose élevée ou prédisposition", "Concentration difficile, logique ralentie", "Expérience variable selon le set et setting"] },
                { time: "2–4h", color: "#f97316", icon: "💤", title: "Descente", events: ["Effets qui s'estompent progressivement", "Possible légère fatigue, somnolence", "Retour à la conscience normale", "Pas de crash sévère ni dysphorie intense", "Appétit encore élevé"] },
                { time: "Différences THC vs CBD", color: "#6366f1", icon: "⚖️", title: "THC vs CBD", events: ["THC seul : plus euphorisant, plus anxiogène, plus psychotomimétique", "CBD seul : anxiolytique, anti-inflammatoire, non-psychoactif", "Ratio équilibré THC/CBD : moins d'anxiété et paranoïa", "Terpènes et effets 'entourage' modulateurs", "Cannabis fort (>15% THC) : risque psychiatrique plus élevé"] },
              ].map((phase, i) => (
                <div key={i} style={{ background: "#0d0d1a", border: `1px solid ${phase.color}22`, borderRadius: 12, padding: 16 }}>
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
                </div>
              ))}
            </div>
          </div>
        )}

        {activeNav === "systems" && (
          <div>
            <SectionTitle color={COLOR}>Systèmes biologiques affectés</SectionTitle>
            <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
              {systems.map((s, i) => (
                <button key={i} onClick={() => setActiveSystem(i)} style={{
                  padding: "8px 18px", borderRadius: 20,
                  border: `1.5px solid ${activeSystem === i ? s.color : "#1e1e3a"}`,
                  background: activeSystem === i ? s.color + "22" : "transparent",
                  color: activeSystem === i ? s.color : "#64748b",
                  fontSize: 13, cursor: "pointer", whiteSpace: "nowrap",
                }}>
                  {s.icon} {s.title}
                </button>
              ))}
            </div>
            <div style={{ background: "#0d0d1a", border: `1px solid ${systems[activeSystem].color}33`, borderRadius: 14, padding: 24 }}>
              <div style={{ fontSize: 18, fontWeight: "bold", color: systems[activeSystem].color, marginBottom: 20 }}>
                {systems[activeSystem].icon} {systems[activeSystem].title}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 12 }}>
                {systems[activeSystem].impacts.map((imp, i) => (
                  <div key={i} style={{ padding: 14, background: "#060610", borderRadius: 10, borderLeft: `3px solid ${systems[activeSystem].color}66` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: "bold", color: "#e2e8f0" }}>{imp.label}</span>
                      <span style={{ fontSize: 12, fontFamily: "monospace", color: systems[activeSystem].color, fontWeight: "bold" }}>{imp.value}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{imp.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeNav === "timeline" && (
          <div>
            <SectionTitle color={COLOR}>Timeline de récupération</SectionTitle>
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: desk ? "wrap" : "nowrap", overflowX: desk ? "visible" : "auto", paddingBottom: 4 }}>
              {timeline.map((d, i) => (
                <button key={i} onClick={() => setActiveDay(i)} style={{
                  flexShrink: 0, padding: "8px 14px", borderRadius: 10,
                  border: `1.5px solid ${activeDay === i ? d.color : "#1e1e3a"}`,
                  background: activeDay === i ? d.color + "22" : "transparent",
                  color: activeDay === i ? d.color : "#64748b",
                  fontSize: 12, cursor: "pointer", textAlign: "center",
                }}>
                  <div style={{ fontSize: 18 }}>{d.icon}</div>
                  <div style={{ whiteSpace: "nowrap" }}>{d.day}</div>
                </button>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 24 }}>
              <div style={{ background: "#0d0d1a", border: `1px solid ${timeline[activeDay].color}33`, borderRadius: 14, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 22 }}>{timeline[activeDay].icon}</div>
                    <div style={{ fontSize: 18, fontWeight: "bold", color: timeline[activeDay].color }}>{timeline[activeDay].day}</div>
                  </div>
                  <div style={{ background: timeline[activeDay].color + "22", border: `1px solid ${timeline[activeDay].color}44`, borderRadius: 20, padding: "4px 14px", fontSize: 11, color: timeline[activeDay].color, fontFamily: "monospace" }}>
                    {timeline[activeDay].phase}
                  </div>
                </div>
                {timeline[activeDay].items.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10, padding: 10, background: "#060610", borderRadius: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: timeline[activeDay].color, flexShrink: 0, marginTop: 5 }} />
                    <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{item}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 16 }}>FACTEURS MODULANT LES RISQUES</div>
                {[
                  { factor: "Âge de début (< 16 ans)", impact: "Risque ×3", color: "#ef4444", desc: "Cerveau en développement — impact structurel plus important" },
                  { factor: "Fréquence (quotidien)", impact: "Risque ×5", color: "#f97316", desc: "Usage quotidien vs occasionnel — différence majeure sur tous les risques" },
                  { factor: "Concentration THC (>15%)", impact: "Risque ×2", color: "#fbbf24", desc: "Cannabis fort = plus dopaminergique, plus psychotomimétique" },
                  { factor: "Ratio CBD:THC élevé", impact: "Protecteur", color: "#22c55e", desc: "CBD module les effets anxiogènes et psychotomimétiques du THC" },
                  { factor: "Prédisposition génétique", impact: "Variable", color: "#a855f7", desc: "Variants COMT, AKT1 — déterminent la vulnérabilité à la psychose" },
                ].map((item, i) => (
                  <div key={i} style={{ background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 10, padding: 12, marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: "bold", color: "#e2e8f0" }}>{item.factor}</span>
                      <span style={{ fontSize: 12, fontFamily: "monospace", color: item.color, fontWeight: "bold" }}>{item.impact}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeNav === "hormones" && (
          <div>
            <SectionTitle color={COLOR}>Endocannabinoïdes & Hormones</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 24, marginBottom: 24 }}>
              <Card color={COLOR}>
                <div style={{ fontSize: 11, color: COLOR, letterSpacing: 2, fontFamily: "monospace", marginBottom: 6 }}>DOPAMINE — USAGE CHRONIQUE ET RÉCUPÉRATION</div>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 16, lineHeight: 1.5 }}>Usage occasionnel : effet minimal sur baseline. Usage quotidien : baseline réduite, récupération en quelques mois.</div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={dopamineData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <defs>
                      <linearGradient id="can-normalGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="can-drugGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#84cc16" stopOpacity={0.4} /><stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" tick={{ fontSize: 8, fill: "#475569" }} />
                    <YAxis tick={{ fontSize: 9, fill: "#475569" }} domain={[60, 140]} />
                    <Tooltip content={<DopaTip />} />
                    <ReferenceLine y={100} stroke="#475569" strokeDasharray="3 3" />
                    <Area type="monotone" dataKey="normal" stroke="#22c55e" fill="url(#can-normalGrad)" strokeWidth={2} name="normal" dot={false} />
                    <Area type="monotone" dataKey="drug" stroke="#84cc16" fill="url(#can-drugGrad)" strokeWidth={2} name="drug" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
              <Card color="#34d399">
                <div style={{ fontSize: 11, color: "#34d399", letterSpacing: 2, fontFamily: "monospace", marginBottom: 6 }}>RÉCEPTEURS CB1 — DÉSENSIBILISATION ET RÉCUPÉRATION</div>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 16, lineHeight: 1.5 }}>Usage chronique → CB1 se désensibilisent (downrégulation). 3-6 mois d'abstinence → retour à la normale.</div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={endoData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <defs>
                      <linearGradient id="can-cb1Grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} /><stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="can-thcGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3} /><stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" tick={{ fontSize: 8, fill: "#475569" }} />
                    <YAxis tick={{ fontSize: 9, fill: "#475569" }} />
                    <Tooltip content={<EndoTip />} />
                    <Area type="monotone" dataKey="cb1" stroke="#34d399" fill="url(#can-cb1Grad)" strokeWidth={2} name="cb1" dot={false} />
                    <Area type="monotone" dataKey="thc" stroke="#84cc16" fill="url(#can-thcGrad)" strokeWidth={2} name="thc" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </div>
            <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>TABLEAU HORMONAL — USAGE CANNABIS</div>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr" : "1fr", gap: 10 }}>
              {[
                { hormone: "Endocannabinoïdes (CB1)", effet: "Désensibilisés", duree: "Usage chronique", impact: "Anhedonia, syndrome amotivationnel — récupère en 3-6 mois", color: COLOR },
                { hormone: "Dopamine", effet: "↓ baseline chron.", duree: "Usage quotidien", impact: "Moins de motivation naturelle, plaisirs normaux diminués", color: "#84cc16" },
                { hormone: "Ghréline (appétit)", effet: "↑↑ aigu", duree: "Intoxication", impact: "'Munchies' — faim intense. Prise de poids avec usage régulier", color: "#fbbf24" },
                { hormone: "Testostérone", effet: "↓ usage lourd", duree: "Usage quotidien+", impact: "Hypogonadisme léger avec usage très intensif", color: "#fb923c" },
                { hormone: "Cortisol", effet: "Biphasique", duree: "Variable", impact: "Bas à faible dose THC, élevé à dose forte ou en sevrage", color: "#f97316" },
                { hormone: "Sérotonine", effet: "Modulation CB1", duree: "Usage", impact: "Anxiété ou anxiolyse selon dose et génétique de l'usager", color: "#6366f1" },
              ].map((h, i) => (
                <div key={i} style={{ background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 10, padding: 14, borderLeft: `3px solid ${h.color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: "bold", color: h.color }}>{h.hormone}</span>
                    <span style={{ fontSize: 12, fontFamily: "monospace", color: "#e2e8f0", fontWeight: "bold" }}>{h.effet}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>{h.impact}</div>
                  <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace" }}>Durée : {h.duree}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeNav === "brain" && (
          <div>
            <SectionTitle color={COLOR}>Cerveau & Mémoire — risques à long terme</SectionTitle>
            <div style={{ background: "#001408", border: `2px solid ${COLOR}44`, borderRadius: 14, padding: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: COLOR, fontWeight: "bold", marginBottom: 8 }}>🧠 Le système endocannabinoïde — pourquoi c'est important</div>
              <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>Les endocannabinoïdes (anandamide, 2-AG) sont des neuromodulateurs essentiels au développement cérébral, à la plasticité synaptique, à la gestion du stress et au sommeil. Le THC les imite — et perturbe ce système lorsqu'il est inondé de façon chronique.</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>EFFETS SUR LE CERVEAU EN DÉVELOPPEMENT</div>
                {[
                  { age: "< 14 ans", risk: "Très élevé", color: "#ef4444", desc: "Perturbation du câblage cortical en pleine formation. Réduction volume cortex préfrontal et hippocampe mesurable en IRM. Risque psychose fortement augmenté." },
                  { age: "14-18 ans", risk: "Élevé", color: "#f97316", desc: "Développement cérébral toujours actif. Altérations cognitives mesurables dans les études longitudinales. Taux de dépendance 3× plus élevé." },
                  { age: "18-25 ans", risk: "Modéré", color: "#fbbf24", desc: "Cortex préfrontal finalise son câblage jusqu'à 25 ans. Usage quotidien dans cette période encore impactant." },
                  { age: "> 25 ans", risk: "Plus faible", color: "#22c55e", desc: "Cerveau adulte plus résilient. Risques existent toujours (dépendance, cognition si quotidien), mais moins critiques." },
                ].map((item, i) => (
                  <div key={i} style={{ background: "#0d0d1a", border: `1px solid ${item.color}33`, borderRadius: 12, padding: 14, marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: "bold", color: "#e2e8f0" }}>Usage débuté {item.age}</span>
                      <span style={{ fontSize: 11, fontFamily: "monospace", color: item.color, fontWeight: "bold" }}>{item.risk}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>DÉFICITS COGNITIFS — USAGE RÉGULIER</div>
                {[
                  { func: "Mémoire de travail", impact: "−25 à −40%", color: "#ef4444", desc: "Encodage et rappel immédiat altérés pendant intoxication et avec usage chronique" },
                  { func: "Attention soutenue", impact: "−20%", color: "#f97316", desc: "Difficultés à rester concentré sur une tâche longue" },
                  { func: "Vitesse de traitement", impact: "−15%", color: "#fbbf24", desc: "Pensée plus lente, temps de réaction allongé" },
                  { func: "Fonctions exécutives", impact: "−18%", color: "#a855f7", desc: "Planification, flexibilité cognitive, inhibition réduite" },
                  { func: "Mémoire verbale", impact: "−22%", color: "#6366f1", desc: "Difficulté à se souvenir de conversations récentes" },
                ].map((item, i) => (
                  <div key={i} style={{ background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 10, padding: 12, marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: "bold", color: "#e2e8f0" }}>{item.func}</span>
                      <span style={{ fontSize: 12, fontFamily: "monospace", color: item.color, fontWeight: "bold" }}>{item.impact}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{item.desc}</div>
                  </div>
                ))}
                <Card color={COLOR}>
                  <div style={{ fontSize: 11, color: COLOR, fontWeight: "bold", marginBottom: 6 }}>✓ La récupération est rapide</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.6 }}>Contrairement à la meth, les déficits cognitifs du cannabis se normalisent généralement en 1 à 3 mois d'abstinence chez l'adulte. Chez les adolescents, la récupération est moins complète. La réversibilité est un facteur d'espoir mais pas une raison de minimiser les risques.</div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeNav === "stop" && (
          <div>
            <SectionTitle color={COLOR}>Récupération — bénéfices & stratégies</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 24 }}>
              <div>
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>BÉNÉFICES DANS LE TEMPS</div>
                {stopBenefits.map((period, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: period.color, flexShrink: 0, marginTop: 4 }} />
                      {i < stopBenefits.length - 1 && <div style={{ width: 2, flex: 1, background: `linear-gradient(${period.color}, ${stopBenefits[i+1].color})`, opacity: 0.3, minHeight: 30 }} />}
                    </div>
                    <div style={{ flex: 1, background: "#0d0d1a", border: `1px solid ${period.color}22`, borderRadius: 10, padding: 12 }}>
                      <div style={{ fontSize: 11, color: period.color, fontFamily: "monospace", fontWeight: "bold", marginBottom: 6 }}>{period.period}</div>
                      {period.benefits.map((b, j) => (
                        <div key={j} style={{ fontSize: 12, color: "#94a3b8", marginBottom: 3 }}>✓ {b}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>STRATÉGIES</div>
                {[
                  { icon: "🎯", tip: "Définir pourquoi", desc: "La motivation intrinsèque (performances, mémoire, budget, santé) est plus durable que la pression externe." },
                  { icon: "📉", tip: "Réduction progressive", desc: "Réduire la fréquence et la quantité graduellement réduit les symptômes de sevrage et facilite l'arrêt." },
                  { icon: "🌙", tip: "Hygiène du sommeil", desc: "L'insomnie de sevrage est temporaire. Exercice, heures fixes, éviter écrans — le sommeil revient en 2-4 semaines." },
                  { icon: "🏃", tip: "Exercice physique", desc: "Libère des endocannabinoïdes naturels (anandamide) — soulagement naturel du sevrage. Addictif dans le bon sens." },
                  { icon: "🧠", tip: "TCC si dépendance avérée", desc: "Thérapie cognitivo-comportementale efficace pour les usages problématiques. CSAPA ou thérapeute spécialisé." },
                ].map((t, i) => (
                  <div key={i} style={{ background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 12, padding: 14, marginBottom: 10, display: "flex", gap: 12 }}>
                    <div style={{ fontSize: 22, flexShrink: 0 }}>{t.icon}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: "bold", color: "#e2e8f0", marginBottom: 4 }}>{t.tip}</div>
                      <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{t.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      <div style={{ padding: "20px 48px 36px", borderTop: "1px solid #1e1e3a", textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "#334155", letterSpacing: 1, fontFamily: "monospace" }}>
          BASÉ SUR DES DONNÉES SCIENTIFIQUES PEER-REVIEWED · NIH/NIDA · Di Forti et al., Lancet Psychiatry · Gruber et al., Neuropsychopharmacology
        </div>
      </div>
    </div>
  );
}
