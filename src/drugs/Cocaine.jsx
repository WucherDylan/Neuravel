import { useState } from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts";
import { useWidth, SectionTitle, Card } from "../shared";

const COLOR = "#3b82f6";

const NAV = [
  { id: "overview", label: "Vue d'ensemble", icon: "⚡" },
  { id: "immediate", label: "Effets immédiats", icon: "🤍" },
  { id: "systems", label: "Systèmes affectés", icon: "🧬" },
  { id: "timeline", label: "Timeline récupération", icon: "📅" },
  { id: "hormones", label: "Dopamine & Hormones", icon: "📈" },
  { id: "heart", label: "Cœur & Nez", icon: "🫀" },
  { id: "stop", label: "Récupération", icon: "🌱" },
];

const dopamineData = [
  { time: "Baseline", normal: 100, drug: 100 },
  { time: "5 min", normal: 100, drug: 280 },
  { time: "20 min", normal: 100, drug: 260 },
  { time: "45 min", normal: 100, drug: 160 },
  { time: "90 min", normal: 100, drug: 65 },
  { time: "3h", normal: 100, drug: 72 },
  { time: "24h", normal: 100, drug: 82 },
  { time: "1 sem", normal: 100, drug: 90 },
  { time: "1 mois", normal: 100, drug: 96 },
];

const cortisolData = [
  { time: "Avant", normal: 14, drug: 14 },
  { time: "Usage", normal: 14, drug: 38 },
  { time: "1h", normal: 14, drug: 45 },
  { time: "3h", normal: 14, drug: 36 },
  { time: "6h", normal: 14, drug: 28 },
  { time: "12h", normal: 14, drug: 22 },
  { time: "J2", normal: 14, drug: 18 },
  { time: "J3", normal: 14, drug: 15 },
];

const systems = [
  {
    icon: "🧠", title: "Cerveau & Dopamine", color: "#3b82f6",
    impacts: [
      { label: "Mécanisme central", value: "Blocage DAT", desc: "La cocaïne bloque le transporteur de la dopamine (DAT) — la dopamine s'accumule dans la fente synaptique sans être recaptée. +250-300% au nucleus accumbens." },
      { label: "Noradrénaline (NET)", value: "Bloqué ↑", desc: "Blocage du transporteur de la noradrénaline → activation sympathique intense : vigilance, énergie, vasoconstriction." },
      { label: "Sérotonine (SERT)", value: "Bloqué ↑", desc: "Euphorie, confiance, sociabilité — mais la chute post-usage entraîne humeur déprimée, irritabilité." },
      { label: "Cortex préfrontal", value: "Altéré", desc: "Usage chronique → réduction du volume du CPF. Impulsivité, mauvaise prise de décision, contrôle émotionnel réduit." },
      { label: "Mémoire de travail", value: "↓ chronique", desc: "Hippocampe et circuits frontaux impactés avec usage régulier. Altérations cognitives mesurables." },
    ]
  },
  {
    icon: "❤️", title: "Cœur & Vasculaire", color: "#f87171",
    impacts: [
      { label: "Vasospasme coronarien", value: "Risque fatal", desc: "Noradrénaline ↑↑ → spasme des artères coronaires → ischémie myocardique. Possible même sans antécédents, même jeune." },
      { label: "Tachycardie", value: "+40-60 bpm", desc: "Activation sympathique massive. Combinée à l'hypertension, la charge cardiaque est extrême." },
      { label: "Infarctus du myocarde", value: "×6 risque", desc: "La cocaïne est la substance illicite la plus fréquemment associée aux urgences cardiovasculaires." },
      { label: "Mort subite cardiaque", value: "Risque réel", desc: "Arythmies ventriculaires fatales — surtout combinée avec alcool (formation de cocaéthylène, +20% de cardiotoxicité)." },
      { label: "Cocaéthylène (alcool+coke)", value: "×1.2 toxique", desc: "Le foie synthétise ce métabolite quand cocaïne et alcool sont combinés. Plus cardiotoxique que les deux séparément." },
    ]
  },
  {
    icon: "👃", title: "Muqueuse nasale", color: "#fb923c",
    impacts: [
      { label: "Vasoconstriction locale", value: "↑↑↑", desc: "Sniffée, la cocaïne cause une ischémie locale intense. La muqueuse nasale est privée de sang à répétition." },
      { label: "Nécrose muqueuse", value: "Usage régulier", desc: "Vasoconstriction chronique → mort cellulaire progressive. Septum perforé dans 5-10% des usagers réguliers." },
      { label: "Perforation du septum", value: "Irréversible", desc: "Destruction du cartilage séparant les narines. Interventions chirurgicales complexes, résultats partiels." },
      { label: "Destruction osseuse", value: "Avancé", desc: "Usage très prolongé → destruction de l'os du palais et des structures nasales. Défiguration visible." },
      { label: "Perte de l'odorat", value: "Chronique", desc: "Anosmie progressive avec l'usage — peut être partielle ou totale, parfois irréversible." },
    ]
  },
  {
    icon: "🧪", title: "Hormones & Métabolisme", color: "#34d399",
    impacts: [
      { label: "Cortisol", value: "×3 pic", desc: "Activation HPA intense pendant et après l'usage. Cortisol élevé → inflammation, anxiété, stockage graisseux." },
      { label: "Testostérone", value: "↓↓ chronique", desc: "Usage régulier → hypogonadisme. Dysfonction érectile fréquente malgré l'impression de libido augmentée en aigu." },
      { label: "Insuline", value: "Résistance", desc: "Cortisol chronique + malnutrition → résistance insulinique, risque diabète." },
      { label: "Adrénaline", value: "↑↑↑ pic", desc: "Blocage NET → accumulation adrénaline. Réaction fight-or-flight permanente pendant l'intoxication." },
      { label: "Mélatonine", value: "↓ nuit", desc: "Stimulation sympathique nocturne → insomnie, architecture de sommeil détruite." },
    ]
  },
];

const timeline = [
  { day: "Usage", icon: "🤍", color: "#3b82f6", phase: "Intoxication", items: ["Onset nasal : 3-5 minutes", "Euphorie, confiance, énergie, sociabilité", "Analgésie locale nasale", "Tachycardie, hypertension, mydriase", "High de 30-60 minutes"] },
  { day: "1-2h", icon: "📉", color: "#f97316", phase: "Comedown", items: ["Euphorie qui s'estompe", "Fatigue, irritabilité, anxiété", "Craving modéré", "Possible paranoïa légère", "Envie de refaire ou de boire"] },
  { day: "24-48h", icon: "😤", color: "#ef4444", phase: "Crash", items: ["Humeur déprimée, anhedonia", "Fatigue intense", "Manque de concentration", "Insomnie ou hypersomnie", "Appétit perturbé"] },
  { day: "1 sem", icon: "🌥️", color: "#6366f1", phase: "Récupération précoce", items: ["Humeur qui se stabilise", "Énergie qui revient", "Sommeil qui s'améliore", "Craving réduit", "Dopamine en reconstruction"] },
  { day: "1 mois", icon: "🌤️", color: "#22d3ee", phase: "Stabilisation", items: ["Dopamine proche de baseline", "Anxiété résiduelle possible", "Plaisirs naturels qui reviennent", "Fonctions cognitives améliorées"] },
  { day: "3-6 mois", icon: "🌱", color: "#22c55e", phase: "Récupération", items: ["Circuits dopamine reconstruits", "Fonctions cognitives normalisées", "Risque rechute qui décline", "Pleine récupération physique"] },
];

const stopBenefits = [
  { period: "24-72h", color: "#f97316", benefits: ["Paramètres cardiovasculaires normalisés", "Sommeil qui revient"] },
  { period: "1-2 semaines", color: "#fbbf24", benefits: ["Humeur stabilisée", "Énergie restaurée", "Muqueuse nasale qui guérit"] },
  { period: "1 mois", color: "#84cc16", benefits: ["Dopamine proche de baseline", "Plaisirs naturels restaurés", "Concentration améliorée"] },
  { period: "3-6 mois", color: "#22c55e", benefits: ["Récupération cognitive complète", "Testostérone normalisée", "Risque cardiovasculaire qui baisse"] },
  { period: "1 an+", color: "#06b6d4", benefits: ["Récupération cérébrale substantielle", "Risque de rechute significativement réduit", "Vie normale totalement possible"] },
];

const DopaTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px" }}>
      <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontSize: 12, marginBottom: 2 }}>
          {p.name === "normal" ? "🟢 Dopamine saine" : "🔵 Cocaïne"}: <strong>{p.value}%</strong>
        </div>
      ))}
    </div>
  );
};

const CortTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px" }}>
      <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontSize: 12, marginBottom: 2 }}>
          {p.name === "normal" ? "🟢 Normal" : "🔵 Post-cocaïne"}: <strong>{p.value} µg/dL</strong>
        </div>
      ))}
    </div>
  );
};

export default function Cocaine({ onBack }) {
  const [activeNav, setActiveNav] = useState("overview");
  const [activeSystem, setActiveSystem] = useState(0);
  const [activeDay, setActiveDay] = useState(0);
  const w = useWidth();
  const desk = w >= 768;

  return (
    <div style={{ minHeight: "100vh", background: "#060610", fontFamily: "'Georgia','Times New Roman',serif", color: "#e2e8f0" }}>

      <div style={{
        background: "linear-gradient(180deg, #00081a 0%, #060610 100%)",
        padding: desk ? "48px 48px 36px" : "28px 20px 20px",
        borderBottom: "1px solid #0f1e3a",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, #3b82f618 0%, transparent 70%)" }} />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid #0f1e3a", borderRadius: 8, color: "#64748b", padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "monospace", marginBottom: 16 }}>
            ← Choisir une substance
          </button>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: COLOR, marginBottom: 10, fontFamily: "monospace" }}>GUIDE SCIENTIFIQUE · #5 OMS · 27/100</div>
          <h1 style={{
            fontSize: desk ? 38 : 26, fontWeight: "bold", margin: "0 0 10px", lineHeight: 1.2,
            background: "linear-gradient(135deg, #fff 40%, #3b82f6)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Cocaïne — bloqueur de dopamine
          </h1>
          <p style={{ fontSize: desk ? 15 : 13, color: "#64748b", margin: 0, lineHeight: 1.7, maxWidth: 600 }}>
            Blocage triple des transporteurs DAT/NET/SERT — euphorie, énergie, cardiotoxicité et destruction nasale.
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
              <div style={{ background: "#00081a", border: `1px solid ${COLOR}33`, borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 11, color: COLOR, letterSpacing: 2, fontFamily: "monospace", marginBottom: 16 }}>PROFIL PHARMACOLOGIQUE</div>
                {[
                  { label: "Classe", value: "Stimulant — anesthésique local (ester)" },
                  { label: "Mécanisme", value: "Blocage DAT + NET + SERT" },
                  { label: "Voie principale", value: "Intra-nasale (sniff)" },
                  { label: "Onset", value: "3-5 minutes (nasal), 30-60s (IV)" },
                  { label: "Durée du high", value: "30-60 minutes" },
                  { label: "Dépendance physique", value: "Moins marquée qu'héroïne — surtout psychologique" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, paddingBottom: 10, borderBottom: i < 5 ? `1px solid ${COLOR}22` : "none" }}>
                    <span style={{ fontSize: 12, color: "#64748b", flexShrink: 0, width: "40%" }}>{item.label}</span>
                    <span style={{ fontSize: 12, color: "#e2e8f0", textAlign: "right" }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { val: "+280%", label: "Dopamine nucleus accumbens", sub: "pic après prise nasale", color: COLOR },
                  { val: "30-60 min", label: "Durée du high", sub: "vs 5-15 min pour le crack", color: "#60a5fa" },
                  { val: "×6", label: "Risque infarctus", sub: "vs non-consommateur", color: "#ef4444" },
                  { val: "5-10%", label: "Perforation septum", sub: "avec usage régulier", color: "#fb923c" },
                  { val: "Cocaéthylène", label: "Combiné avec alcool", sub: "métabolite cardiotoxique", color: "#fbbf24" },
                  { val: "3-6 mois", label: "Récupération complète", sub: "circuits dopamine", color: "#22c55e" },
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
                  { myth: "La coke c'est pas vraiment addictif physiquement", reality: "La dépendance psychologique peut être aussi paralysante. Et le manque — dysphorie, fatigue, dépression — est très réel." },
                  { myth: "Un peu de coke ne fait pas de mal au cœur", reality: "Des infarctus ont été documentés chez des usagers occasionnels de moins de 30 ans. Il n'y a pas de dose sûre." },
                  { myth: "Combiner coke et alcool c'est mieux que seul", reality: "Faux — le foie synthétise du cocaéthylène, 20% plus cardiotoxique que la cocaïne seule. Durée d'action plus longue." },
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
            <SectionTitle color={COLOR}>Effets immédiats — de la prise au crash</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 14 }}>
              {[
                { time: "0–5 min", color: COLOR, icon: "✨", title: "Onset (nasal)", events: ["Anesthésie locale nasale immédiate", "Absorption par la muqueuse nasale vers le sang", "Vasoconstriction locale et systémique", "Activation sympathique qui commence", "Onset plus lent que fumé ou IV"] },
                { time: "5–20 min", color: "#60a5fa", icon: "🚀", title: "Euphorie & Énergie", events: ["Dopamine +280% → euphorie, confiance, énergie", "Sociabilité, volubilité augmentées", "Sensation de lucidité et compétence extrêmes", "Anorexie, libido augmentée", "Grandiose, sentiment de toute-puissance"] },
                { time: "20–60 min", color: "#818cf8", icon: "⚡", title: "Plateau", events: ["Effets cardiovasculaires au maximum", "Tachycardie 100-140 bpm, hypertension", "Hyperthermie légère", "Possible anxiété, paranoïa si dose élevée", "Début de la tolérance sur la session"] },
                { time: "1–2h", color: "#f97316", icon: "📉", title: "Comedown", events: ["Euphorie qui s'effondre rapidement", "Fatigue, irritabilité, anxiété croissante", "Craving — envie de redoser", "Possibilité de paranoïa, suspicion", "Humeur déprimée — 'le blues de la coke'"] },
                { time: "2–24h", color: "#ef4444", icon: "💤", title: "Crash", events: ["Dépression, anhedonia, léthargie", "Appétit de retour après jeûne forcé", "Insomnie malgré l'épuisement", "Irritabilité, sensibilité émotionnelle", "Craving résiduel"] },
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
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 16 }}>FACTEURS DE RISQUE RECHUTE</div>
                {[
                  { step: "Triggers environnementaux (lieux, personnes)", color: "#ef4444" },
                  { step: "Stress professionnel ou relationnel", color: "#f97316" },
                  { step: "Alcool — baisse inhibition + cocaéthylène", color: "#fbbf24" },
                  { step: "PAWS — anhedonia semaines post-arrêt", color: "#a855f7" },
                  { step: "Sentiment que 'une fois ne changera rien'", color: "#6366f1" },
                  { step: "Réseau social impliqué dans la consommation", color: "#22d3ee" },
                  { step: "Suivi psychologique → protection", color: "#22c55e" },
                ].map((item, i, arr) => (
                  <div key={i} style={{ display: "flex", alignItems: "stretch" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 28 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, flexShrink: 0, marginTop: 10 }} />
                      {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: item.color, opacity: 0.2, minHeight: 16 }} />}
                    </div>
                    <div style={{ padding: "6px 12px", fontSize: 12, color: i === arr.length - 1 ? "#22c55e" : "#94a3b8", fontWeight: i === arr.length - 1 ? "bold" : "normal" }}>
                      {item.step}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeNav === "hormones" && (
          <div>
            <SectionTitle color={COLOR}>Dopamine & Cortisol</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 24, marginBottom: 24 }}>
              <Card color={COLOR}>
                <div style={{ fontSize: 11, color: COLOR, letterSpacing: 2, fontFamily: "monospace", marginBottom: 6 }}>DOPAMINE — USAGE ET RÉCUPÉRATION</div>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 16, lineHeight: 1.5 }}>Pic à +280% suivi d'un crash sous baseline. Récupération en quelques semaines avec abstinence.</div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={dopamineData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <defs>
                      <linearGradient id="coc-normalGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="coc-drugGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLOR} stopOpacity={0.4} /><stop offset="95%" stopColor={COLOR} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" tick={{ fontSize: 8, fill: "#475569" }} />
                    <YAxis tick={{ fontSize: 9, fill: "#475569" }} />
                    <Tooltip content={<DopaTip />} />
                    <ReferenceLine y={100} stroke="#475569" strokeDasharray="3 3" />
                    <Area type="monotone" dataKey="normal" stroke="#22c55e" fill="url(#coc-normalGrad)" strokeWidth={2} name="normal" dot={false} />
                    <Area type="monotone" dataKey="drug" stroke={COLOR} fill="url(#coc-drugGrad)" strokeWidth={2} name="drug" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
              <Card color="#ef4444">
                <div style={{ fontSize: 11, color: "#ef4444", letterSpacing: 2, fontFamily: "monospace", marginBottom: 6 }}>CORTISOL POST-COCAÏNE (µg/dL)</div>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 16, lineHeight: 1.5 }}>Pic de cortisol ×3 pendant et après l'usage. Anxiété, inflammation, stockage graisseux.</div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={cortisolData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <defs>
                      <linearGradient id="coc-cortNorm" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="coc-cortDrug" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" tick={{ fontSize: 8, fill: "#475569" }} />
                    <YAxis tick={{ fontSize: 9, fill: "#475569" }} />
                    <Tooltip content={<CortTip />} />
                    <ReferenceLine y={20} stroke="#475569" strokeDasharray="3 3" label={{ value: "Seuil normal", fontSize: 9, fill: "#475569" }} />
                    <Area type="monotone" dataKey="normal" stroke="#22c55e" fill="url(#coc-cortNorm)" strokeWidth={2} name="normal" dot={false} />
                    <Area type="monotone" dataKey="drug" stroke="#ef4444" fill="url(#coc-cortDrug)" strokeWidth={2} name="drug" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </div>
            <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>TABLEAU HORMONAL — USAGE COCAÏNE</div>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr" : "1fr", gap: 10 }}>
              {[
                { hormone: "Dopamine", effet: "+280% pic", duree: "30-60 min", impact: "Euphorie, confiance, crashs répétés → dépression", color: COLOR },
                { hormone: "Noradrénaline", effet: "↑↑↑", duree: "Intoxication", impact: "Tachycardie, hypertension, vasospasme coronarien", color: "#f87171" },
                { hormone: "Cortisol", effet: "×3", duree: "24-48h", impact: "Stress, anxiété, graisses abdominales, inflammation", color: "#ef4444" },
                { hormone: "Testostérone", effet: "↓ chronique", duree: "Usage régulier", impact: "Dysfonction érectile (paradoxal avec libido augmentée en aigu)", color: "#fb923c" },
                { hormone: "Sérotonine", effet: "↑ aigu/↓ crash", duree: "Variable", impact: "Euphorie puis dépression — humeur instable", color: "#818cf8" },
                { hormone: "Adrénaline", effet: "↑↑↑", duree: "Intoxication", impact: "Réponse fight-or-flight permanente, anxiété, paranoïa", color: "#fbbf24" },
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

        {activeNav === "heart" && (
          <div>
            <SectionTitle color={COLOR}>Cœur & Nez — dommages spécifiques</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 20, marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>LE CŒUR — CARDIOTOXICITÉ</div>
                <div style={{ background: "#14001a", border: "2px solid #ef444488", borderRadius: 14, padding: 20, marginBottom: 14 }}>
                  <div style={{ fontSize: 13, color: "#ef4444", fontWeight: "bold", marginBottom: 8 }}>⚠️ Urgence cardiovasculaire sous cocaïne</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>Douleur thoracique sous cocaïne = urgence médicale. Appeler le 15 immédiatement. Ne pas attendre — les jeunes usagers ont des infarctus sans antécédents.</div>
                </div>
                {[
                  { title: "Triple mécanisme cardiotoxique", desc: "1) Noradrénaline ↑↑ → vasospasme coronarien\n2) Tachycardie → demande O₂ accrue\n3) Hypertension → surcharge ventriculaire", color: "#ef4444" },
                  { title: "L'effet 'bêta-bloquant inversé'", desc: "Les médecins évitent les bêta-bloquants en urgence coke — peuvent aggraver le vasospasme coronarien. Traitement spécifique requis (benzodiazépines, phentolamine).", color: "#f97316" },
                  { title: "Cocaéthylène — le danger combiné", desc: "Cocaïne + alcool → le foie produit du cocaéthylène. Demi-vie 5× plus longue que la cocaïne. 20% plus cardiotoxique. La combinaison est sous-estimée.", color: "#fbbf24" },
                ].map((item, i) => (
                  <div key={i} style={{ background: "#0d0d1a", border: `1px solid ${item.color}33`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: "bold", color: item.color, marginBottom: 6 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6, whiteSpace: "pre-line" }}>{item.desc}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>LE NEZ — DESTRUCTION PROGRESSIVE</div>
                {[
                  { stage: "Usage occasionnel", color: "#22c55e", desc: "Congestion nasale, irritation muqueuse, saignements mineurs. Réversible avec l'arrêt." },
                  { stage: "Usage régulier (mois)", color: "#fbbf24", desc: "Rhinite chronique, perte partielle d'odorat, formation de croûtes. Partiellement réversible." },
                  { stage: "Usage intensif (années)", color: "#f97316", desc: "Nécrose de la muqueuse, début de perforation du septum. Difficile à réparer." },
                  { stage: "Usage lourd prolongé", color: "#ef4444", desc: "Perforation septale, destruction cartilage. Interventions chirurgicales complexes, résultats partiels." },
                  { stage: "Cas extrêmes", color: "#dc2626", desc: "Destruction osseuse du palais et de l'ethmoïde. Défiguration visible. Reconstruction difficile." },
                ].map((stage, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: stage.color, flexShrink: 0, marginTop: 4 }} />
                      {i < 4 && <div style={{ width: 2, flex: 1, background: stage.color, opacity: 0.2, minHeight: 20 }} />}
                    </div>
                    <div style={{ flex: 1, background: "#0d0d1a", border: `1px solid ${stage.color}22`, borderRadius: 10, padding: 12 }}>
                      <div style={{ fontSize: 11, color: stage.color, fontFamily: "monospace", fontWeight: "bold", marginBottom: 4 }}>{stage.stage}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.4 }}>{stage.desc}</div>
                    </div>
                  </div>
                ))}
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
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>STRATÉGIES DE RÉCUPÉRATION</div>
                {[
                  { icon: "🏥", tip: "Addictologie et TCC", desc: "La thérapie cognitivo-comportementale est l'approche la plus validée. Identifie et modifie les patterns de pensée addictifs." },
                  { icon: "☎️", tip: "Drogues Info Service : 0800 23 13 13", desc: "Ligne gratuite, anonyme, 7j/7. Écoute et orientation." },
                  { icon: "🚫", tip: "Éviter l'alcool", desc: "Alcool + cocaïne → cocaéthylène. Même après l'arrêt, l'alcool est un trigger puissant de rechute." },
                  { icon: "💪", tip: "Exercice cardiovasculaire", desc: "Aide à rétablir la dopamine naturelle. Le sport est un des antidépresseurs naturels les plus puissants." },
                  { icon: "🌱", tip: "Changer l'environnement social", desc: "Couper temporairement les contacts liés à la consommation est difficile mais souvent nécessaire." },
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
          BASÉ SUR DES DONNÉES SCIENTIFIQUES PEER-REVIEWED · NIH/NIDA · WHO · Kloner et al., JACC
        </div>
      </div>
    </div>
  );
}
