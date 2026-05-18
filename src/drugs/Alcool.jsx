import { useState } from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts";
import { useWidth, SectionTitle, Card } from "../shared";

const COLOR = "#ef4444";

const NAV = [
  { id: "overview", label: "Vue d'ensemble", icon: "⚡" },
  { id: "immediate", label: "Effets immédiats", icon: "🍺" },
  { id: "systems", label: "Systèmes affectés", icon: "🧬" },
  { id: "timeline", label: "Timeline 5 jours", icon: "📅" },
  { id: "cortisol", label: "Cortisol & Hormones", icon: "📈" },
  { id: "weight", label: "Prise de poids", icon: "⚖️" },
  { id: "stop", label: "Arrêter l'alcool", icon: "🌱" },
];

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

const CortisolTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px" }}>
      <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontSize: 12, marginBottom: 2 }}>
          {p.name === "normal" ? "🟢 Cortisol normal" : "🔴 Post-alcool"}: <strong>{p.value} µg/dL</strong>
        </div>
      ))}
    </div>
  );
};

const MelTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px" }}>
      <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontSize: 12, marginBottom: 2 }}>
          {p.name === "normal" ? "🟢 Mélatonine normale" : "🔴 Après alcool"}: <strong>{p.value}%</strong>
        </div>
      ))}
    </div>
  );
};

export default function Alcool({ onBack }) {
  const [activeNav, setActiveNav] = useState("overview");
  const [activeSystem, setActiveSystem] = useState(0);
  const [activeDay, setActiveDay] = useState(0);
  const w = useWidth();
  const desk = w >= 768;

  return (
    <div style={{ minHeight: "100vh", background: "#060610", fontFamily: "'Georgia','Times New Roman',serif", color: "#e2e8f0" }}>

      <div style={{
        background: "linear-gradient(180deg, #0f0520 0%, #060610 100%)",
        padding: desk ? "48px 48px 36px" : "28px 20px 20px",
        borderBottom: "1px solid #1e1e3a",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, #ef444418 0%, transparent 70%)" }} />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid #1e1e3a", borderRadius: 8, color: "#64748b", padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "monospace", marginBottom: 16 }}>
            ← Choisir une substance
          </button>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: COLOR, marginBottom: 10, fontFamily: "monospace" }}>GUIDE SCIENTIFIQUE · #1 OMS</div>
          <h1 style={{
            fontSize: desk ? 38 : 26, fontWeight: "bold", margin: "0 0 10px", lineHeight: 1.2,
            background: "linear-gradient(135deg, #fff 40%, #ef4444)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Alcool — ce que votre corps vit vraiment
          </h1>
          <p style={{ fontSize: desk ? 15 : 13, color: "#64748b", margin: 0, lineHeight: 1.7, maxWidth: 600 }}>
            De la première gorgée à la récupération complète — les mécanismes biologiques complets.
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
              <div style={{ background: "#0f0520", border: "1px solid #ef444433", borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 11, color: COLOR, letterSpacing: 2, fontFamily: "monospace", marginBottom: 16 }}>CLASSEMENT OMS — DANGEROSITÉ GLOBALE</div>
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
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { val: "7 kcal/g", label: "Calories alcool", sub: "vs 4 kcal pour les glucides", color: "#ef4444" },
                  { val: "4–5 jours", label: "Récupération complète", sub: "après une soirée chargée", color: "#a855f7" },
                  { val: "−41%", label: "Mélatonine", sub: "dès un seul verre", color: "#6366f1" },
                  { val: "×3–4", label: "Cortisol", sub: "pendant 3 à 5 jours", color: "#f97316" },
                  { val: "−23%", label: "Testostérone", sub: "après 1–2 verres", color: "#fb923c" },
                  { val: "Groupe 1", label: "Cancérigène OMS", sub: "sans seuil minimal", color: "#ef4444" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 12, padding: 14, textAlign: "center" }}>
                    <div style={{ fontSize: desk ? 22 : 18, fontWeight: "bold", color: s.color, marginBottom: 4, fontFamily: "monospace" }}>{s.val}</div>
                    <div style={{ fontSize: 12, color: "#e2e8f0", marginBottom: 3 }}>{s.label}</div>
                    <div style={{ fontSize: 10, color: "#475569" }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
            <Card color={COLOR}>
              <div style={{ fontSize: 11, color: COLOR, letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>MYTHE VS RÉALITÉ</div>
              <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr" : "1fr", gap: 14 }}>
                {[
                  { myth: "Un verre de vin rouge est bon pour le cœur", reality: "Réfuté. Les études avaient des biais majeurs. L'alcool est cardiotoxique à toute dose." },
                  { myth: "L'alcool aide à dormir", reality: "Il sédatise mais détruit l'architecture du sommeil. Zéro bénéfice récupérateur." },
                  { myth: "Boire occasionnellement c'est sans risque", reality: "Le cerveau s'adapte même à une consommation sporadique. Il n'y a pas de dose sans effet." },
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
            <SectionTitle color={COLOR}>Effets immédiats — minute par minute</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 14 }}>
              {[
                { time: "0–15 min", color: "#fbbf24", icon: "👄", title: "Absorption", events: ["L'alcool passe dans le sang en 15 minutes", "Estomac vide = absorption 2× plus rapide", "Le foie commence à travailler immédiatement", "Acétaldéhyde produit dès la première molécule"] },
                { time: "15–45 min", color: "#f97316", icon: "🧠", title: "Effets cérébraux", events: ["GABA potentialisé → désinhibition, détente apparente", "Dopamine libérée → sensation de plaisir", "Cortex préfrontal ralenti → jugement altéré", "Mélatonine commence à chuter"] },
                { time: "1–2h", color: "#ef4444", icon: "💓", title: "Pic d'alcoolémie", events: ["HRV cardiaque au plus bas", "Testostérone en chute", "Cortisol commence à monter", "Foie traite ~1 verre/heure, tout le reste stocké"] },
                { time: "3–5h", color: "#a855f7", icon: "⚡", title: "Métabolisation", events: ["L'alcool disparaît, le glutamate explose en rebond", "Réveils nocturnes, micro-éveils", "Hypoglycémie : foie a vidé le glycogène", "Cortisol atteint son pic nocturne → réveil forcé"] },
                { time: "8–12h", color: "#6366f1", icon: "🌅", title: "Lendemain matin", events: ["Cortisol élevé → irritabilité, stress dès le réveil", "Sérotonine basse → humeur dégradée", "Déshydratation et manque de vitamines B", "REM manquant → brouillard mental, mémoire altérée"] },
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
                      <span style={{ fontSize: 13, fontFamily: "monospace", color: systems[activeSystem].color, fontWeight: "bold" }}>{imp.value}</span>
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
            <SectionTitle color={COLOR}>Timeline complète — 5 jours</SectionTitle>
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
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 16 }}>LA CASCADE COMPLÈTE</div>
                {[
                  { step: "Soirée alcool", color: "#ef4444" },
                  { step: "Foie en détox → stockage total", color: "#f97316" },
                  { step: "Rebond glutamate + hypoglycémie", color: "#a855f7" },
                  { step: "Réveils 3h–5h + faim nocturne", color: "#6366f1" },
                  { step: "Cortisol élevé 3–5 jours", color: "#818cf8" },
                  { step: "Ghréline ↑ → faim de loup au réveil", color: "#22d3ee" },
                  { step: "Récupération complète J4–J5", color: "#22c55e" },
                ].map((item, i, arr) => (
                  <div key={i} style={{ display: "flex", alignItems: "stretch" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 28 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, flexShrink: 0, marginTop: 12 }} />
                      {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: `linear-gradient(${item.color}, ${arr[i+1].color})`, opacity: 0.3, minHeight: 20 }} />}
                    </div>
                    <div style={{ padding: "8px 12px", fontSize: 13, color: i === 0 || i === arr.length - 1 ? item.color : "#94a3b8", fontWeight: i === 0 || i === arr.length - 1 ? "bold" : "normal" }}>
                      {item.step}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeNav === "cortisol" && (
          <div>
            <SectionTitle color={COLOR}>Cortisol & Mélatonine — graphiques</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 24, marginBottom: 24 }}>
              <Card color="#ef4444">
                <div style={{ fontSize: 11, color: "#ef4444", letterSpacing: 2, fontFamily: "monospace", marginBottom: 6 }}>CORTISOL SUR 5 JOURS (µg/dL)</div>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 16, lineHeight: 1.5 }}>Valeur normale : 10–20 µg/dL. Après alcool, le pic nocturne de 3h force le réveil.</div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={cortisolData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <defs>
                      <linearGradient id="alc-normalGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="alc-drugGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" tick={{ fontSize: 8, fill: "#475569" }} />
                    <YAxis tick={{ fontSize: 9, fill: "#475569" }} />
                    <Tooltip content={<CortisolTip />} />
                    <ReferenceLine y={20} stroke="#475569" strokeDasharray="3 3" label={{ value: "Seuil", fontSize: 9, fill: "#475569" }} />
                    <Area type="monotone" dataKey="normal" stroke="#22c55e" fill="url(#alc-normalGrad)" strokeWidth={2} name="normal" dot={false} />
                    <Area type="monotone" dataKey="drug" stroke="#ef4444" fill="url(#alc-drugGrad)" strokeWidth={2} name="drug" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}><div style={{ width: 16, height: 2, background: "#22c55e" }} /><span style={{ color: "#64748b" }}>Normal</span></div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}><div style={{ width: 16, height: 2, background: "#ef4444" }} /><span style={{ color: "#64748b" }}>Post-alcool</span></div>
                </div>
              </Card>
              <Card color="#6366f1">
                <div style={{ fontSize: 11, color: "#6366f1", letterSpacing: 2, fontFamily: "monospace", marginBottom: 6 }}>MÉLATONINE DANS LA NUIT (%)</div>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 16, lineHeight: 1.5 }}>Même 1 verre la réduit de 19 à 41%. Tu "dors" mais sans récupérer.</div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={melatoninData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <defs>
                      <linearGradient id="alc-melNormal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} /><stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="alc-melDrug" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} /><stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#475569" }} />
                    <YAxis tick={{ fontSize: 9, fill: "#475569" }} />
                    <Tooltip content={<MelTip />} />
                    <Area type="monotone" dataKey="normal" stroke="#818cf8" fill="url(#alc-melNormal)" strokeWidth={2} name="normal" dot={false} />
                    <Area type="monotone" dataKey="drug" stroke="#f97316" fill="url(#alc-melDrug)" strokeWidth={2} name="drug" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}><div style={{ width: 16, height: 2, background: "#818cf8" }} /><span style={{ color: "#64748b" }}>Normale</span></div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}><div style={{ width: 16, height: 2, background: "#f97316" }} /><span style={{ color: "#64748b" }}>Après alcool</span></div>
                </div>
              </Card>
            </div>
            <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>TABLEAU HORMONAL — 1 SEUL VERRE</div>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr" : "1fr", gap: 10 }}>
              {[
                { hormone: "Cortisol", effet: "×3–4", duree: "3–5 jours", impact: "Inflammation, graisse abdominale, stress", color: "#ef4444" },
                { hormone: "Mélatonine", effet: "−19 à −41%", duree: "1 nuit", impact: "Sommeil REM supprimé, récupération nulle", color: "#6366f1" },
                { hormone: "Testostérone", effet: "−6 à −23%", duree: "24–48h", impact: "Fonte musculaire, libido, énergie", color: "#f97316" },
                { hormone: "Insuline", effet: "↑↑ résistance", duree: "3–5 jours", impact: "Glycémie instable, fringales nocturnes", color: "#fbbf24" },
                { hormone: "Ghréline (faim)", effet: "↑↑", duree: "2–4 jours", impact: "Faim de loup, fringales incontrôlables", color: "#fb923c" },
                { hormone: "Œstrogènes", effet: "↑", duree: "Variable", impact: "Risque cancer du sein (OMS groupe 1)", color: "#a855f7" },
              ].map((h, i) => (
                <div key={i} style={{ background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 10, padding: 14, borderLeft: `3px solid ${h.color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 14, fontWeight: "bold", color: h.color }}>{h.hormone}</span>
                    <span style={{ fontSize: 13, fontFamily: "monospace", color: "#e2e8f0", fontWeight: "bold" }}>{h.effet}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>{h.impact}</div>
                  <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace" }}>Durée : {h.duree}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeNav === "weight" && (
          <div>
            <SectionTitle color={COLOR}>Pourquoi l'alcool fait grossir</SectionTitle>
            <Card color="#fb923c">
              <div style={{ fontSize: 13, color: "#fb923c", marginBottom: 10, fontWeight: "bold" }}>⚠️ Ce n'est pas uniquement une question de calories</div>
              <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>Même sans manger beaucoup pendant une soirée, l'alcool provoque une prise de poids. Le mécanisme principal n'est pas calorique — c'est métabolique.</div>
            </Card>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 12, marginTop: 20, marginBottom: 20 }}>
              {[
                { num: "01", color: "#ef4444", title: "Priorité métabolique absolue", desc: "Le corps reconnaît l'alcool comme toxique et arrête tout pour l'éliminer. Pendant ce temps, graisses et glucides sont stockés directement. Combustion des graisses à 0%." },
                { num: "02", color: "#f97316", title: "7 kcal par gramme", desc: "Presque autant que les graisses (9 kcal). Une bière = 150–200 kcal vides. Zéro nutriment, zéro satiété." },
                { num: "03", color: "#fbbf24", title: "Insuline → stockage abdominal", desc: "L'alcool provoque un pic d'insuline, hormone du stockage — qui dirige les graisses vers le ventre. La \"bedaine de bière\" est physiologique." },
                { num: "04", color: "#a855f7", title: "Cortisol → graisses viscérales", desc: "Cortisol élevé 3–5 jours = stockage autour des organes + dégradation musculaire = métabolisme de base qui ralentit." },
                { num: "05", color: "#6366f1", title: "Testostérone ↓ → fonte musculaire", desc: "La testostérone maintient le muscle. Elle chute dès 1–2 verres. Moins de muscle = moins de calories brûlées." },
                { num: "06", color: "#22d3ee", title: "Fringales post-alcool", desc: "L'alcool stimule les neurones de la faim. Le lendemain : hypoglycémie + cortisol + mauvais sommeil = ghréline au max." },
              ].map((item, i) => (
                <div key={i} style={{ background: "#0d0d1a", border: `1px solid ${item.color}22`, borderRadius: 12, padding: 16 }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ fontFamily: "monospace", fontSize: 22, fontWeight: "bold", color: item.color, opacity: 0.4, flexShrink: 0, lineHeight: 1 }}>{item.num}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: "bold", color: item.color, marginBottom: 6 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{item.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Card color="#22c55e">
              <div style={{ fontSize: 11, color: "#22c55e", letterSpacing: 2, fontFamily: "monospace", marginBottom: 10 }}>LE PIÈGE DU SPORTIF</div>
              <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>Tu peux faire du sport toute la semaine et ne pas perdre de poids si tu bois le week-end. Le week-end efface littéralement le travail de la semaine en bloquant ton métabolisme pendant 4–5 jours.</div>
            </Card>
          </div>
        )}

        {activeNav === "stop" && (
          <div>
            <SectionTitle color={COLOR}>Arrêter l'alcool — bénéfices & stratégies</SectionTitle>
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
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>TENIR EN SOIRÉE — TECHNIQUES</div>
                {[
                  { icon: "🥃", tip: "Avoir un verre dans la main", desc: "Eau gazeuse + citron, Perrier, Coca. Personne ne sait ce que tu bois. Coupe 80% de la pression sociale." },
                  { icon: "🗣️", tip: "La phrase toute faite", desc: "\"Je bois plus\" — calme, souriant, sans explication. Tu ne dois rien justifier." },
                  { icon: "🧠", tip: "Décider AVANT de partir", desc: "Une fois dans l'ambiance, le cerveau est en mode soirée. La décision se prend à la maison." },
                  { icon: "💪", tip: "\"Je choisis\" pas \"je peux pas\"", desc: "Différence psychologique majeure. Décision active vs frustration." },
                  { icon: "🌅", tip: "Visualiser le lendemain matin", desc: "Se lever lucide, sans gueule de bois, fier de soi. Une des meilleures sensations." },
                ].map((t, i) => (
                  <div key={i} style={{ background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 12, padding: 14, marginBottom: 10, display: "flex", gap: 12 }}>
                    <div style={{ fontSize: 22, flexShrink: 0 }}>{t.icon}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: "bold", color: "#e2e8f0", marginBottom: 4 }}>{t.tip}</div>
                      <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{t.desc}</div>
                    </div>
                  </div>
                ))}
                <Card color="#22c55e">
                  <div style={{ fontSize: 12, color: "#22c55e", fontWeight: "bold", marginBottom: 8 }}>🧠 Le cerveau et la récompense</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>L'alcool est dans ton circuit de récompense parce que tu l'as associé à des contextes depuis l'adolescence. Retirer l'alcool 3 à 4 fois suffit à recâbler l'association. C'est une question de semaines, pas d'années.</div>
                </Card>
              </div>
            </div>
          </div>
        )}

      </div>

      <div style={{ padding: "20px 48px 36px", borderTop: "1px solid #1e1e3a", textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "#334155", letterSpacing: 1, fontFamily: "monospace" }}>
          BASÉ SUR DES DONNÉES SCIENTIFIQUES PEER-REVIEWED · OMS · The Lancet · MIT · NIH
        </div>
      </div>
    </div>
  );
}
