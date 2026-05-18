import { useState } from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts";
import { useWidth, SectionTitle, Card } from "../shared";

const COLOR = "#ec4899";

const NAV = [
  { id: "overview", label: "Vue d'ensemble", icon: "⚡" },
  { id: "immediate", label: "Effets immédiats", icon: "💊" },
  { id: "systems", label: "Systèmes affectés", icon: "🧬" },
  { id: "timeline", label: "Timeline récupération", icon: "📅" },
  { id: "hormones", label: "Dopamine & Sérotonine", icon: "📈" },
  { id: "chemsex", label: "Contextes & Dangers", icon: "⚠️" },
  { id: "stop", label: "Récupération", icon: "🌱" },
];

const dopaSerotData = [
  { time: "Baseline", normal: 100, dopamine: 100, serotonine: 100 },
  { time: "30 min", normal: 100, dopamine: 380, serotonine: 290 },
  { time: "1h", normal: 100, dopamine: 340, serotonine: 260 },
  { time: "2h", normal: 100, dopamine: 220, serotonine: 180 },
  { time: "3h", normal: 100, dopamine: 120, serotonine: 110 },
  { time: "5h", normal: 100, dopamine: 55, serotonine: 50 },
  { time: "24h", normal: 100, dopamine: 72, serotonine: 65 },
  { time: "J3", normal: 100, dopamine: 82, serotonine: 74 },
  { time: "1 sem", normal: 100, dopamine: 90, serotonine: 85 },
  { time: "1 mois", normal: 100, dopamine: 96, serotonine: 93 },
];

const cortisolData = [
  { time: "Avant", normal: 14, drug: 14 },
  { time: "Usage", normal: 14, drug: 42 },
  { time: "2h", normal: 14, drug: 50 },
  { time: "6h", normal: 14, drug: 38 },
  { time: "24h", normal: 14, drug: 30 },
  { time: "J2", normal: 14, drug: 24 },
  { time: "J3", normal: 14, drug: 20 },
  { time: "J5", normal: 14, drug: 16 },
];

const systems = [
  {
    icon: "🧠", title: "Cerveau & Neurotransmetteurs", color: "#ec4899",
    impacts: [
      { label: "Triple mécanisme", value: "DAT+NET+SERT", desc: "Comme la cocaïne mais aussi libérateur (comme la meth). Bloque ET inverse les transporteurs — dopamine, noradrénaline ET sérotonine libérées massivement." },
      { label: "Profil hybride", value: "Stimulant + Empathogène", desc: "La forte composante sérotoninergique (comme MDMA) crée des effets d'empathie et de connexion sociale absents de la cocaïne pure." },
      { label: "Redosage compulsif", value: "Durée courte = piège", desc: "Demi-vie 2-3h — effets qui chutent vite. Compulsion de redoser toutes les 2-3h, souvent toute la nuit. Binge de 12-48h possible." },
      { label: "Neurotoxicité 5-HT", value: "Usage lourd", desc: "La suractivation des neurones sérotoninergiques avec usage intensif crée un stress oxydatif similaire aux dommages MDMA/meth sur les axones SERT." },
      { label: "Psychose cathinone", value: "Possible", desc: "Paranoïa, hallucinations visuelles et tactiles avec binge prolongé. Peut ressembler à une psychose amphetaminique ou à la schizophrénie en aigu." },
    ]
  },
  {
    icon: "❤️", title: "Cœur & Circulation", color: "#f87171",
    impacts: [
      { label: "Tachycardie sévère", value: "+60-100 bpm", desc: "Double activation sympathique (noradrénaline + adrénaline). Fréquence cardiaque peut atteindre 160-180 bpm lors d'un binge." },
      { label: "Hypertension", value: "↑↑↑ sévère", desc: "Vasoconstriction généralisée + débit cardiaque augmenté. Risque d'AVC hémorragique, surtout en effort ou chaleur." },
      { label: "Arythmies", value: "Risque élevé", desc: "QT long possible selon les métabolites. Arythmies ventriculaires documentées. Risque aggravé par déshydratation et hyperthermie." },
      { label: "Cardiomyopathie", value: "Chronique", desc: "Usage répété → inflammation cardiaque chronique. Cardiotoxicité directe des cathinones documentée en autopsies." },
      { label: "Mort subite", value: "Cas documentés", desc: "Plusieurs décès documentés liés à la méphedrone et aux cathinones synthétiques — hyperthermie + arythmie fatale." },
    ]
  },
  {
    icon: "🌡️", title: "Température & Métabolisme", color: "#fb923c",
    impacts: [
      { label: "Hyperthermie", value: "Jusqu'à 41°C", desc: "Mécanisme double : activation sympathique + inhibition transpiration. L'effet entactogène (danse, clubs) majore le risque thermique." },
      { label: "Syndrome sérotoninergique", value: "Risque mortel", desc: "Combiné avec MDMA, ISRS, lithium, tramadol → accumulation sérotonine → hyperthermie, rigidité musculaire, convulsions. Urgence vitale." },
      { label: "Déshydratation sévère", value: "Binge", desc: "Hyperthermie + transpiration + activité physique + oubli de boire (ou boire trop avec risque d'hyponatrémie) → état critique." },
      { label: "Anorexie prolongée", value: "Binge", desc: "Suppression totale de la faim pendant l'épisode. Réalimentation post-binge nécessaire — malnutrition si pattern répété." },
      { label: "Hyponatrémie", value: "Si sur-hydratation", desc: "Comme avec MDMA : l'ADH est libérée → boire trop d'eau = dilution du sodium sanguin → œdème cérébral fatal possible." },
    ]
  },
  {
    icon: "🧪", title: "Hormones & Sexualité", color: "#34d399",
    impacts: [
      { label: "Libido", value: "↑↑↑ aigu", desc: "Effet entactogène + dopamine + sérotonine → hypersexualité intense en aigu. Fréquemment utilisé dans le contexte chemsex." },
      { label: "Cortisol", value: "×3-4", desc: "Activation HPA intense. Cortisol reste élevé 2-5 jours après usage. Anxiété, irritabilité, inflammation prolongées." },
      { label: "Testostérone", value: "↓ chronique", desc: "Usage répété → perturbation hormonale gonadique. Dysfonction érectile paradoxale malgré libido exacerbée en aigu." },
      { label: "Sérotonine baseline", value: "↓ post-usage", desc: "Déplétion sérotoninergique post-binge → dépression, anxiété, anhedonia. Similaire au 'crash' post-MDMA mais moins sévère." },
      { label: "Ocytocine", value: "↑ empathie", desc: "La composante sérotoninergique stimule la libération d'ocytocine (hormone du lien social). Explique l'effet empathogène et la recherche de connexion." },
    ]
  },
];

const timeline = [
  { day: "Usage", icon: "💊", color: "#ec4899", phase: "Intoxication", items: ["Onset oral : 15-45 min, insufflé : 5-10 min", "Euphorie + empathie + énergie (profil MDMA-like + stimulant)", "Hypersexualité, bavardage, sociabilité extrêmes", "Tachycardie, hypertension, hyperthermie", "Durée : 3-5h — redosage fréquent"] },
  { day: "Binge", icon: "🔄", color: "#f97316", phase: "Binge compulsif", items: ["Demi-vie courte → redosage toutes les 2-3h", "Chaque dose moins euphorisante", "Compulsion qui persiste malgré dégradation des effets", "Binge 12-48h possible (comme meth)", "Paranoïa et hallucinations qui s'installent"] },
  { day: "24-48h", icon: "💀", color: "#ef4444", phase: "Crash post-binge", items: ["Hypersomnie prolongée", "Dépression sévère, pleurs, anhedonia", "Anxiété intense — brain fog", "Corps épuisé, douleurs musculaires", "Faim intense après jeûne forcé"] },
  { day: "J3-J7", icon: "😤", color: "#a855f7", phase: "PAWS précoce", items: ["Humeur très instable", "Insomnie résiduelle", "Sérotonine encore basse — 'le blues'", "Craving psychologique intense", "Fatigue, difficultés de concentration"] },
  { day: "1-4 sem", icon: "🌥️", color: "#6366f1", phase: "Récupération", items: ["Dopamine et sérotonine en reconstruction", "Humeur qui se stabilise progressivement", "Anxiété et insomnie qui s'améliorent", "Plaisirs naturels qui reviennent", "Risque rechute si triggers présents"] },
  { day: "1-3 mois", icon: "🌱", color: "#22c55e", phase: "Récupération complète", items: ["Neurotransmetteurs proches de la normale", "Pleine récupération cognitive", "Motivations naturelles revenues", "Craving fortement réduit"] },
];

const stopBenefits = [
  { period: "24-72h", color: "#ef4444", benefits: ["Crash difficile — attendre", "Corps en détox active"] },
  { period: "1-2 semaines", color: "#f97316", benefits: ["Humeur se stabilise", "Sommeil qui revient", "Énergie progressivement"] },
  { period: "1 mois", color: "#fbbf24", benefits: ["Dopamine/sérotonine en reconstruction", "Plaisirs naturels restaurés", "Anxiété réduite"] },
  { period: "2-3 mois", color: "#22c55e", benefits: ["Récupération neurobiologique complète", "Qualité de vie normalisée", "Craving très faible"] },
];

const DopaSerotTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const labels = { normal: "🟢 Baseline", dopamine: "🔴 Dopamine", serotonine: "🟣 Sérotonine" };
  return (
    <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px" }}>
      <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontSize: 12, marginBottom: 2 }}>
          {labels[p.name] ?? p.name}: <strong>{p.value}%</strong>
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
          {p.name === "normal" ? "🟢 Normal" : "🔴 Post-cathinone"}: <strong>{p.value} µg/dL</strong>
        </div>
      ))}
    </div>
  );
};

export default function Cathinones({ onBack }) {
  const [activeNav, setActiveNav] = useState("overview");
  const [activeSystem, setActiveSystem] = useState(0);
  const [activeDay, setActiveDay] = useState(0);
  const w = useWidth();
  const desk = w >= 768;

  return (
    <div style={{ minHeight: "100vh", background: "#060610", fontFamily: "'Georgia','Times New Roman',serif", color: "#e2e8f0" }}>

      <div style={{
        background: "linear-gradient(180deg, #1a0514 0%, #060610 100%)",
        padding: desk ? "48px 48px 36px" : "28px 20px 20px",
        borderBottom: "1px solid #2d0a20",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, #ec489918 0%, transparent 70%)" }} />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid #2d0a20", borderRadius: 8, color: "#64748b", padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "monospace", marginBottom: 16 }}>
            ← Choisir une substance
          </button>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: COLOR, marginBottom: 10, fontFamily: "monospace" }}>GUIDE SCIENTIFIQUE · NOUVELLES SUBSTANCES PSYCHOACTIVES</div>
          <h1 style={{
            fontSize: desk ? 38 : 26, fontWeight: "bold", margin: "0 0 10px", lineHeight: 1.2,
            background: "linear-gradient(135deg, #fff 40%, #ec4899)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Cathinones — 3-MMC, 4-MMC & dérivés
          </h1>
          <p style={{ fontSize: desk ? 15 : 13, color: "#64748b", margin: 0, lineHeight: 1.7, maxWidth: 600 }}>
            Stimulants-empathogènes synthétiques — hybride cocaïne/MDMA avec compulsion de redosage et risque d'hyperthermie fatale.
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
              <div style={{ background: "#1a0514", border: `1px solid ${COLOR}33`, borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 11, color: COLOR, letterSpacing: 2, fontFamily: "monospace", marginBottom: 16 }}>PROFIL COMPARÉ — 3-MMC VS 4-MMC</div>
                {[
                  { label: "4-MMC (méphédrone)", value: "Banni EU 2010 · Précurseur du groupe" },
                  { label: "3-MMC", value: "Légal dans plusieurs pays (RC) · Remplaçant 4-MMC" },
                  { label: "Mécanisme", value: "Triple libérateur+inhibiteur DAT/NET/SERT" },
                  { label: "Profil d'effet", value: "Cocaïne + MDMA — stimulant ET empathogène" },
                  { label: "Durée active", value: "3-5h (vs MDMA 4-6h, cocaïne 1h)" },
                  { label: "Demi-vie", value: "2-3h → redosage compulsif quasi-inévitable" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, paddingBottom: 10, borderBottom: i < 5 ? `1px solid ${COLOR}22` : "none" }}>
                    <span style={{ fontSize: 12, color: "#64748b", flexShrink: 0, width: "38%" }}>{item.label}</span>
                    <span style={{ fontSize: 12, color: "#e2e8f0", textAlign: "right" }}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { val: "+380%", label: "Dopamine pic", sub: "libération massive + blocage recaptage", color: COLOR },
                  { val: "+290%", label: "Sérotonine pic", sub: "composante MDMA-like forte", color: "#818cf8" },
                  { val: "2-3h", label: "Demi-vie", sub: "redosage compulsif toutes les 3h", color: "#f97316" },
                  { val: "41°C", label: "Hyperthermie max", sub: "risque mortel en contexte festif", color: "#ef4444" },
                  { val: "Syndrome 5-HT", label: "Si combiné ISRS/MDMA", sub: "urgence médicale fatale possible", color: "#dc2626" },
                  { val: "1-3 mois", label: "Récupération", sub: "dopamine + sérotonine baseline", color: "#22c55e" },
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
              <div style={{ fontSize: 11, color: COLOR, letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>CATHINONES VS SUBSTANCES CONNUES</div>
              <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr" : "1fr", gap: 14 }}>
                {[
                  { title: "Versus Cocaïne", desc: "Les cathinones sont à la fois inhibiteurs ET libérateurs (contrairement à la cocaïne qui ne bloque que le recaptage). Résultat : plus sérotoninergiques, plus empathogènes, souvent perçues comme 'plus douces' — mais compulsion de redosage plus forte à cause de la demi-vie courte." },
                  { title: "Versus MDMA", desc: "Profil similaire mais demi-vie 2× plus courte. Moins de déplétion sérotoninergique par usage que MDMA pur, mais la compulsion de redosage compense. Les binges de 24-48h avec cathinones peuvent causer autant de dommages sérotoninergiques." },
                  { title: "Le piège du 'légal'", desc: "3-MMC est une 'research chemical' légale dans certains pays. Légal ne signifie pas sûr — les données toxicologiques à long terme n'existent pas. Plusieurs analogues légaux ont causé des décès avant d'être bannis." },
                ].map((m, i) => (
                  <div key={i} style={{ background: "#060610", borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 12, color: COLOR, marginBottom: 6, fontWeight: "bold" }}>{m.title}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{m.desc}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeNav === "immediate" && (
          <div>
            <SectionTitle color={COLOR}>Effets immédiats — du rush au binge</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 14 }}>
              {[
                { time: "15–45 min (oral)", color: COLOR, icon: "✨", title: "Onset", events: ["Montée progressive — euphorie + chaleur", "Empathie, envie de connexion sociale", "Énergie et confiance qui montent", "Hypersexualité — libido fortement augmentée", "Pupilles dilatées, tachycardie, bouche sèche"] },
                { time: "45 min – 2h", color: "#f472b6", icon: "🌊", title: "Plateau", events: ["Euphorie maximale — états de bien-être intenses", "Bavardage, sociabilité, empathie décuplées", "Sensations tactiles amplifiées", "Musique intensifiée (effet entactogène)", "Hyperthermie possible en environnement chaud"] },
                { time: "2–4h", color: "#fb923c", icon: "📉", title: "Descente", events: ["Effets qui chutent — plus vite que MDMA", "Légère anxiété, inconfort croissant", "Craving : envie intense de redoser", "Conscience que la prochaine dose sera moins bonne", "Début du piège binge"] },
                { time: "Redosage", color: "#ef4444", icon: "🔄", title: "Binge", events: ["Chaque dose moins euphorisante — tolérance rapide", "Stimulation cardiovasculaire cumulée", "Paranoïa légère à modérée qui s'installe", "Binge peut durer 12-48h", "Corps épuisé mais esprit encore actif"] },
                { time: "Post-binge 24-72h", color: "#7c3aed", icon: "💤", title: "Crash", events: ["Hypersomnie, dépression profonde, larmes", "Anhedonia — rien ne fait plaisir", "Corps douloureux, mâchoire serrée (bruxisme)", "Anxiété et paranoïa résiduelles", "Sérotonine et dopamine au plus bas"] },
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
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 16 }}>CASCADE POST-BINGE</div>
                {[
                  { step: "Binge 12-48h de cathinones", color: COLOR },
                  { step: "Dopamine épuisée — récepteurs saturés", color: "#f97316" },
                  { step: "Sérotonine effondrée — crash émotionnel", color: "#818cf8" },
                  { step: "Cortisol ×4 — inflammation systémique", color: "#ef4444" },
                  { step: "Hypersomnie 16-24h", color: "#a855f7" },
                  { step: "Dépression 3-7 jours", color: "#6366f1" },
                  { step: "Neurotransmetteurs en reconstruction", color: "#22d3ee" },
                  { step: "Récupération complète 1-3 mois", color: "#22c55e" },
                ].map((item, i, arr) => (
                  <div key={i} style={{ display: "flex", alignItems: "stretch" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 28 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, flexShrink: 0, marginTop: 10 }} />
                      {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: item.color, opacity: 0.2, minHeight: 14 }} />}
                    </div>
                    <div style={{ padding: "6px 12px", fontSize: 12, color: i === 0 || i === arr.length - 1 ? item.color : "#94a3b8", fontWeight: i === 0 || i === arr.length - 1 ? "bold" : "normal" }}>
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
            <SectionTitle color={COLOR}>Dopamine & Sérotonine — le profil double</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 24, marginBottom: 24 }}>
              <Card color={COLOR}>
                <div style={{ fontSize: 11, color: COLOR, letterSpacing: 2, fontFamily: "monospace", marginBottom: 6 }}>DOPAMINE & SÉROTONINE — USAGE ET RÉCUPÉRATION</div>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 16, lineHeight: 1.5 }}>Double pic DA (+380%) et 5-HT (+290%). Les deux systèmes crashent post-binge. Récupération en 4-8 semaines.</div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={dopaSerotData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <defs>
                      <linearGradient id="cat-normGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="cat-dopaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLOR} stopOpacity={0.4} /><stop offset="95%" stopColor={COLOR} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="cat-serotGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} /><stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" tick={{ fontSize: 8, fill: "#475569" }} />
                    <YAxis tick={{ fontSize: 9, fill: "#475569" }} />
                    <Tooltip content={<DopaSerotTip />} />
                    <ReferenceLine y={100} stroke="#475569" strokeDasharray="3 3" />
                    <Area type="monotone" dataKey="normal" stroke="#22c55e" fill="url(#cat-normGrad)" strokeWidth={1.5} name="normal" dot={false} />
                    <Area type="monotone" dataKey="dopamine" stroke={COLOR} fill="url(#cat-dopaGrad)" strokeWidth={2} name="dopamine" dot={false} />
                    <Area type="monotone" dataKey="serotonine" stroke="#818cf8" fill="url(#cat-serotGrad)" strokeWidth={2} name="serotonine" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 8, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10 }}><div style={{ width: 16, height: 2, background: "#22c55e" }} /><span style={{ color: "#64748b" }}>Baseline</span></div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10 }}><div style={{ width: 16, height: 2, background: COLOR }} /><span style={{ color: "#64748b" }}>Dopamine</span></div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10 }}><div style={{ width: 16, height: 2, background: "#818cf8" }} /><span style={{ color: "#64748b" }}>Sérotonine</span></div>
                </div>
              </Card>
              <Card color="#ef4444">
                <div style={{ fontSize: 11, color: "#ef4444", letterSpacing: 2, fontFamily: "monospace", marginBottom: 6 }}>CORTISOL POST-CATHINONE (µg/dL)</div>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 16, lineHeight: 1.5 }}>Cortisol ×3-4 pendant et après usage. Anxiété, inflammation, burn-out persistants plusieurs jours.</div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={cortisolData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <defs>
                      <linearGradient id="cat-cortNorm" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="cat-cortDrug" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#475569" }} />
                    <YAxis tick={{ fontSize: 9, fill: "#475569" }} />
                    <Tooltip content={<CortTip />} />
                    <ReferenceLine y={20} stroke="#475569" strokeDasharray="3 3" label={{ value: "Seuil", fontSize: 9, fill: "#475569" }} />
                    <Area type="monotone" dataKey="normal" stroke="#22c55e" fill="url(#cat-cortNorm)" strokeWidth={2} name="normal" dot={false} />
                    <Area type="monotone" dataKey="drug" stroke="#ef4444" fill="url(#cat-cortDrug)" strokeWidth={2} name="drug" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>TABLEAU HORMONAL — CATHINONES</div>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr" : "1fr", gap: 10 }}>
              {[
                { hormone: "Dopamine", effet: "+380% pic", duree: "3-5h puis crash", impact: "Euphorie intense, énergie, confiance — puis anhedonia sévère post-binge", color: COLOR },
                { hormone: "Sérotonine", effet: "+290% pic", duree: "3-5h puis crash", impact: "Empathie, connexion sociale, plaisir tactile — puis dépression plusieurs jours", color: "#818cf8" },
                { hormone: "Noradrénaline", effet: "↑↑↑", duree: "Usage", impact: "Tachycardie, hypertension, vigilance, vasoconstriction", color: "#f87171" },
                { hormone: "Cortisol", effet: "×3-4", duree: "2-5 jours", impact: "Anxiété, inflammation, graisses abdominales, immunodépression", color: "#ef4444" },
                { hormone: "Ocytocine", effet: "↑ (5-HT induit)", duree: "Usage", impact: "Lien social, empathie, hypersexualité — fausses intimités perçues", color: "#f472b6" },
                { hormone: "Testostérone", effet: "↓ chronique", duree: "Usage régulier", impact: "Paradoxe : libido aiguë ↑↑ mais fonctions sexuelles ↓ à long terme", color: "#fb923c" },
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

        {activeNav === "chemsex" && (
          <div>
            <SectionTitle color={COLOR}>Contextes d'usage & Dangers spécifiques</SectionTitle>

            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 20, marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>CHEMSEX — CONTEXTE FRÉQUENT</div>
                <div style={{ background: "#1a0514", border: `1px solid ${COLOR}33`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
                  <div style={{ fontSize: 13, color: COLOR, fontWeight: "bold", marginBottom: 8 }}>Qu'est-ce que le chemsex ?</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>Usage de drogues dans un contexte sexuel planifié — souvent 3-MMC, GHB/GBL, méthamphétamine, parfois cocaïne. Les cathinones sont devenues la substance de chemsex la plus répandue en Europe.</div>
                </div>
                {[
                  { num: "01", color: COLOR, title: "Hypersexualité chimiquement induite", desc: "L'effet empathogène + dopamine + sérotonine crée une hypersexualité intense mais artificielle. Les comportements pris sous cathinones peuvent être éloignés des valeurs réelles de la personne en état normal." },
                  { num: "02", color: "#f97316", title: "Risques IST amplifiés", desc: "Usage en binge, oubli de protection, partenaires multiples, comportements impulsifs sous influence → risque VIH, hépatite C et autres IST fortement augmenté." },
                  { num: "03", color: "#ef4444", title: "Combinaisons dangereuses", desc: "3-MMC + GHB/GBL = combo chemsex classique mais dose-fenêtre GHB très étroite. 3-MMC + méth = surcharge cardiovasculaire et neurologique. 3-MMC + ISRS = risque syndrome sérotoninergique." },
                  { num: "04", color: "#dc2626", title: "Consentement sous influence", desc: "Le jugement et la capacité de consentement éclairé sont altérés sous cathinones. Les décisions prises en état intoxiqué peuvent avoir des conséquences durables (santé, relations, légales)." },
                ].map((item, i) => (
                  <div key={i} style={{ background: "#0d0d1a", border: `1px solid ${item.color}22`, borderRadius: 12, padding: 14, marginBottom: 10 }}>
                    <div style={{ display: "flex", gap: 10 }}>
                      <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: "bold", color: item.color, opacity: 0.4, flexShrink: 0, lineHeight: 1.2 }}>{item.num}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: "bold", color: item.color, marginBottom: 5 }}>{item.title}</div>
                        <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{item.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>RÉDUCTION DES RISQUES — SI USAGE MAINTENU</div>
                {[
                  { icon: "🌡️", tip: "Température — le risque mortel #1", desc: "En club/fête : faire des pauses au frais régulièrement. Boire de l'eau (pas trop — max 500ml/h). Si température > 39°C, aller aux urgences." },
                  { icon: "🚫", tip: "Ne jamais combiner avec ISRS", desc: "Syndrome sérotoninergique (SS) : hyperthermie + rigidité + confusion = urgence vitale. Si vous prenez un ISRS, les cathinones sont contre-indiquées." },
                  { icon: "⏱️", tip: "Espacer les épisodes", desc: "Minimum 1 mois entre les épisodes permet à la sérotonine et la dopamine de se reconstituer. Les binges rapprochés accumulent les dommages." },
                  { icon: "🏥", tip: "Signe d'overdose — agir vite", desc: "Convulsions, confusion extrême, perte de conscience, température > 40°C → appeler le 15 immédiatement. Ne pas avoir peur de signaler — urgence médicale d'abord." },
                  { icon: "🧪", tip: "Test des substances (harm reduction)", desc: "Les 3-MMC/4-MMC sont souvent adultérés (cocaïne, lévamisole, substances inconnues). Les services de testing (association Techno+ en France) permettent d'identifier le contenu réel." },
                  { icon: "💬", tip: "Chemsex Santé — ressources", desc: "En France : AIDES, chemsex.fr, Warning+. Espace de parole sans jugement pour les personnes concernées par le chemsex." },
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
                  { icon: "🍽️", tip: "Réalimentation ciblée", desc: "Post-binge : aliments riches en tryptophane (dinde, banane, noix, œufs) pour reconstruire la sérotonine. Glucides complexes pour la dopamine." },
                  { icon: "😴", tip: "Prioriser le sommeil récupérateur", desc: "La sérotonine se reconstruit principalement la nuit. Heures fixes, pas d'écrans, magnésium pour faciliter l'endormissement." },
                  { icon: "🏃", tip: "Exercice modéré (pas intensif)", desc: "Marche, natation douce — stimule BDNF et reconstruction neuronale. Éviter l'effort intense dans les 2 premières semaines post-crash." },
                  { icon: "🧠", tip: "Réduction des triggers environnementaux", desc: "Applications de musique, contextes festifs, contacts liés à l'usage — les éviter pendant la période de craving intense (1-4 semaines)." },
                  { icon: "💬", tip: "Soutien communautaire", desc: "Techno+ France, association AIDES (si contexte chemsex), CSAPA — sans jugement. Parler de son usage est la première étape." },
                ].map((t, i) => (
                  <div key={i} style={{ background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 12, padding: 14, marginBottom: 10, display: "flex", gap: 12 }}>
                    <div style={{ fontSize: 22, flexShrink: 0 }}>{t.icon}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: "bold", color: "#e2e8f0", marginBottom: 4 }}>{t.tip}</div>
                      <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{t.desc}</div>
                    </div>
                  </div>
                ))}
                <Card color={COLOR}>
                  <div style={{ fontSize: 12, color: COLOR, fontWeight: "bold", marginBottom: 8 }}>🧠 La récupération sérotoninergique</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>La sérotonine met plus longtemps à se reconstituer que la dopamine. Le "blues" post-cathinone peut durer 1-4 semaines. Ce n'est pas une dépression permanente — c'est une déplétion neurochimique temporaire. Elle se résout toujours avec le temps et un mode de vie sain.</div>
                </Card>
              </div>
            </div>
          </div>
        )}

      </div>

      <div style={{ padding: "20px 48px 36px", borderTop: "1px solid #1e1e3a", textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "#334155", letterSpacing: 1, fontFamily: "monospace" }}>
          BASÉ SUR DES DONNÉES SCIENTIFIQUES · Baumann et al., Neuropsychopharmacology · EMCDDA Reports · Schifano et al., J. Substance Use
        </div>
      </div>
    </div>
  );
}
