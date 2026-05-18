import { useState } from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts";
import { useWidth, SectionTitle, Card } from "../shared";

const COLOR = "#f59e0b";

const NAV = [
  { id: "overview", label: "Vue d'ensemble", icon: "⚡" },
  { id: "immediate", label: "Effets immédiats", icon: "🚬" },
  { id: "systems", label: "Systèmes affectés", icon: "🧬" },
  { id: "timeline", label: "Timeline après arrêt", icon: "📅" },
  { id: "hormones", label: "Nicotine & Hormones", icon: "📈" },
  { id: "lungs", label: "Poumons & Cancer", icon: "🫁" },
  { id: "stop", label: "Arrêter de fumer", icon: "🌱" },
];

const nicotineData = [
  { time: "Avant", niveau: 2, satisfaction: 20 },
  { time: "Cigarette", niveau: 100, satisfaction: 90 },
  { time: "15 min", niveau: 60, satisfaction: 65 },
  { time: "30 min", niveau: 35, satisfaction: 40 },
  { time: "1h", niveau: 18, satisfaction: 25 },
  { time: "2h", niveau: 8, satisfaction: 10 },
  { time: "3h", niveau: 3, satisfaction: 5 },
];

const recoveryData = [
  { time: "20 min", coeur: 85, co: 100, circulation: 30 },
  { time: "12h", coeur: 95, co: 10, circulation: 35 },
  { time: "48h", coeur: 97, co: 5, circulation: 45 },
  { time: "2 sem", coeur: 100, co: 2, circulation: 70 },
  { time: "1 mois", coeur: 100, co: 1, circulation: 85 },
  { time: "3 mois", coeur: 100, co: 1, circulation: 95 },
];

const systems = [
  {
    icon: "🫁", title: "Poumons & Respiration", color: "#f59e0b",
    impacts: [
      { label: "Bronchite chronique", value: "×3-5 risque", desc: "Fumée détruit les cils bronchiques (cellules de nettoyage). Mucus s'accumule → toux chronique, infections à répétition." },
      { label: "BPCO (emphysème)", value: "90% des cas", desc: "Bronchopneumopathie obstructive — destruction irréversible des alvéoles. Insuffisance respiratoire progressive. 90% des BPCO sont fumeurs." },
      { label: "Cancer du poumon", value: "×25 risque", desc: "Risque multiplié par 25 chez le fumeur. #1 cancer mortel. 85% des cancers du poumon sont liés au tabac." },
      { label: "Capacité respiratoire", value: "−20 à −30%", desc: "Réduction progressive du VEMS (volume expiratoire maximal). Essoufflement à l'effort qui s'aggrave avec les années." },
      { label: "Cils bronchiques", value: "Détruits", desc: "Les cils qui évacuent poussières et bactéries sont paralysés par la fumée. Nettoyage bronchique aboli." },
    ]
  },
  {
    icon: "❤️", title: "Cœur & Vaisseaux", color: "#f87171",
    impacts: [
      { label: "Coronaropathie", value: "×2-4 risque", desc: "Tabac = #1 facteur de risque cardiovasculaire modifiable. Artères coronaires rétrécies par plaque d'athérome accélérée." },
      { label: "AVC (accident vasculaire)", value: "×2-4 risque", desc: "Atherosclérose + coagulation augmentée → caillots dans les artères cérébrales." },
      { label: "AOMI (artérites membres)", value: "×5-10 risque", desc: "Obstruction artères jambes → douleurs à la marche, gangrène possible, amputations." },
      { label: "Monoxyde de carbone (CO)", value: "Hémoglobine", desc: "CO se fixe à l'hémoglobine à la place de l'O₂. Jusqu'à 10% de l'hémoglobine inutilisable chez un fumeur régulier." },
      { label: "Nicotine → vasoconstriction", value: "Chronique", desc: "Nicotine → noradrénaline → vasoconstriction chronique → hypertension, plaies qui cicatrisent mal." },
    ]
  },
  {
    icon: "🧠", title: "Cerveau & Addiction", color: "#818cf8",
    impacts: [
      { label: "Récepteurs nAChR", value: "Upregulation ×2", desc: "Le cerveau compense l'exposition chronique à la nicotine en doublant ses récepteurs nicotiniques. Sevrage difficile car trop de récepteurs sans ligand." },
      { label: "Dopamine (récompense)", value: "↑ par nicotine", desc: "Nicotine → libération dopamine dans le NAcc. Mais la baseline dopaminergique baisse avec l'usage chronique → besoin de fumer pour se sentir 'normal'." },
      { label: "Demi-vie nicotine", value: "2 heures", desc: "Chaque 2h, nicotine chute de moitié. Avec 20 cig/jour, le fumeur gère sa nicotinémie toutes les 45-60 minutes." },
      { label: "Mémoire procédurale hijackée", value: "Conditionnement", desc: "Le café, la fin d'un repas, le stress = triggers automatiques. L'addiction tabac est autant comportementale que chimique." },
      { label: "Anxiété de sevrage", value: "Ironique", desc: "La nicotine semble 'réduire le stress' — mais en réalité elle ne fait que soulager le sevrage qu'elle a créé. Non-fumeurs ont moins d'anxiété." },
    ]
  },
  {
    icon: "🧪", title: "Cancer & Cancérigènes", color: "#34d399",
    impacts: [
      { label: "7000 composés chimiques", value: "Fumée tabac", desc: "La fumée de cigarette contient plus de 7000 composés, dont 70 cancérigènes avérés." },
      { label: "Benzène", value: "Cancérigène gr.1", desc: "Leucémies. Présent en grande quantité dans la fumée de tabac." },
      { label: "Benzo[a]pyrène", value: "Cancérigène gr.1", desc: "Mutagène puissant — se fixe directement à l'ADN et provoque des mutations irréversibles." },
      { label: "Nitrosamines (NNK, NNN)", value: "Cancérigènes", desc: "Cancérigènes spécifiques du tabac — cancers poumon, pancréas, cavité buccale." },
      { label: "Dommages ADN", value: "Chaque cigarette", desc: "Chaque cigarette génère des cassures de brins d'ADN dans les cellules bronchiques. Mutagenèse cumulative." },
    ]
  },
];

const timeline = [
  { day: "20 min", icon: "❤️", color: "#22c55e", phase: "Immédiat", items: ["Fréquence cardiaque revient à la normale", "Pression artérielle diminue", "Circulation périphérique s'améliore", "Mains et pieds se réchauffent", "Premier bénéfice mesurable"] },
  { day: "12h", icon: "🫁", color: "#84cc16", phase: "CO normalisé", items: ["Monoxyde de carbone sanguin revient à normale", "Oxygène dans le sang augmente", "Cils bronchiques commencent à bouger", "Corps moins intoxiqué à chaque minute", "Symptômes de manque : irritabilité, envies"] },
  { day: "2-12 sem", icon: "🚶", color: "#f59e0b", phase: "Circulation", items: ["Circulation sanguine améliorée", "Essoufflement réduit à l'effort", "Marche et exercice plus faciles", "Muqueuses en cours de guérison", "Toux de nettoyage possible (normal)"] },
  { day: "1-9 mois", icon: "🧹", color: "#f97316", phase: "Nettoyage", items: ["Toux et essoufflement diminuent", "Poumons se nettoient activement", "Cils bronchiques reconstruits", "Infections respiratoires moins fréquentes", "Capacité pulmonaire qui remonte"] },
  { day: "1 an", icon: "🫀", color: "#ef4444", phase: "Cardio -50%", items: ["Risque maladie coronarienne réduit de 50%", "Risque d'AVC en baisse marquée", "Cœur récupéré significativement", "Circulation pratiquement normalisée"] },
  { day: "5-15 ans", icon: "🌱", color: "#06b6d4", phase: "Cancers réduits", items: ["Risque AVC comme un non-fumeur", "Risque cancer bouche/gorge/œsophage divisé par 2", "Poumons continuent de se réparer", "Risque cancer poumon réduit de 50% à 10 ans", "À 15 ans : risque cardiovasculaire = non-fumeur"] },
];

const stopBenefits = [
  { period: "24h", color: "#ef4444", benefits: ["CO sanguin éliminé", "Risque IM commence à baisser"] },
  { period: "2 semaines", color: "#f97316", benefits: ["Circulation améliorée", "Fonction pulmonaire +30%", "Marche sans essoufflement"] },
  { period: "1-3 mois", color: "#fbbf24", benefits: ["Cils bronchiques reconstruits", "Moins d'infections", "Énergie augmentée"] },
  { period: "1 an", color: "#84cc16", benefits: ["Risque coronarien −50%", "Goût et odorat restaurés", "Peau qui s'améliore"] },
  { period: "10-15 ans", color: "#22c55e", benefits: ["Risque cancer poumon −50%", "Risque cardiovasculaire = non-fumeur", "Espérance de vie normalisée"] },
];

const NicTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px" }}>
      <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontSize: 12, marginBottom: 2 }}>
          {p.name === "niveau" ? "🟡 Nicotine sanguine" : "🔵 Satisfaction subjective"}: <strong>{p.value}%</strong>
        </div>
      ))}
    </div>
  );
};

export default function Tabac({ onBack }) {
  const [activeNav, setActiveNav] = useState("overview");
  const [activeSystem, setActiveSystem] = useState(0);
  const [activeDay, setActiveDay] = useState(0);
  const w = useWidth();
  const desk = w >= 768;

  return (
    <div style={{ minHeight: "100vh", background: "#060610", fontFamily: "'Georgia','Times New Roman',serif", color: "#e2e8f0" }}>

      <div style={{
        background: "linear-gradient(180deg, #14080000 0%, #060610 100%)",
        backgroundImage: "linear-gradient(180deg, #14100000 0%, #060610 100%)",
        background: "linear-gradient(180deg, #160d00 0%, #060610 100%)",
        padding: desk ? "48px 48px 36px" : "28px 20px 20px",
        borderBottom: "1px solid #2a1a00",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, #f59e0b18 0%, transparent 70%)" }} />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid #2a1a00", borderRadius: 8, color: "#64748b", padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "monospace", marginBottom: 16 }}>
            ← Choisir une substance
          </button>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: COLOR, marginBottom: 10, fontFamily: "monospace" }}>GUIDE SCIENTIFIQUE · #6 OMS · 26/100</div>
          <h1 style={{
            fontSize: desk ? 38 : 26, fontWeight: "bold", margin: "0 0 10px", lineHeight: 1.2,
            background: "linear-gradient(135deg, #fff 40%, #f59e0b)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Tabac — #1 cause de mort évitable
          </h1>
          <p style={{ fontSize: desk ? 15 : 13, color: "#64748b", margin: 0, lineHeight: 1.7, maxWidth: 600 }}>
            8 millions de morts par an, 7000 composés chimiques, et une addiction comportementale parmi les plus résistantes.
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
              <div style={{ background: "#160d00", border: `1px solid ${COLOR}33`, borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 11, color: COLOR, letterSpacing: 2, fontFamily: "monospace", marginBottom: 16 }}>PROFIL PHARMACOLOGIQUE</div>
                {[
                  { label: "Substance active", value: "Nicotine — agoniste nAChR" },
                  { label: "Mécanisme", value: "Activation récepteurs nicotiniques → dopamine" },
                  { label: "Demi-vie nicotine", value: "2 heures → manque toutes les 45 min" },
                  { label: "Composés fumée", value: "7000+ dont 70 cancérigènes avérés" },
                  { label: "Dépendance", value: "Physique + comportementale (très forte)" },
                  { label: "Mortalité", value: "8 millions de morts/an dans le monde" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, paddingBottom: 10, borderBottom: i < 5 ? `1px solid ${COLOR}22` : "none" }}>
                    <span style={{ fontSize: 12, color: "#64748b", flexShrink: 0, width: "38%" }}>{item.label}</span>
                    <span style={{ fontSize: 12, color: "#e2e8f0", textAlign: "right" }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { val: "8 millions", label: "Morts par an", sub: "#1 cause mort évitable", color: "#ef4444" },
                  { val: "×25", label: "Risque cancer poumon", sub: "vs non-fumeur", color: "#f97316" },
                  { val: "×4", label: "Risque coronarien", sub: "maladies du cœur", color: "#f87171" },
                  { val: "10 ans", label: "Espérance de vie perdue", sub: "1 paquet/jour toute vie", color: "#fbbf24" },
                  { val: "32%", label: "Taux de dépendance", sub: "#1 parmi toutes les drogues", color: COLOR },
                  { val: "15 ans", label: "Récupération complète", sub: "risque cardio = non-fumeur", color: "#22c55e" },
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
                  { myth: "La cigarette réduit mon stress", reality: "La nicotine soulage le sevrage qu'elle a créé. Les non-fumeurs ont moins d'anxiété que les fumeurs. Le 'soulagement' est une illusion." },
                  { myth: "Fumer léger c'est moins dangereux", reality: "Il n'existe pas de seuil minimal de sécurité. Même 1 cigarette/jour augmente significativement le risque cardiovasculaire." },
                  { myth: "Le vapotage c'est pareil que fumer", reality: "La vapeur ne contient pas les 7000 composés de la fumée. Mais la nicotine et certains additifs posent quand même des risques — réduction des risques, pas élimination." },
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
            <SectionTitle color={COLOR}>Effets immédiats — de l'allumage au manque</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 14 }}>
              {[
                { time: "0–30 sec", color: COLOR, icon: "🚬", title: "Inhalation", events: ["Nicotine passe dans les poumons en 7-8 secondes", "Atteint le cerveau en 10-20 secondes", "Plus rapide que la plupart des drogues IV", "CO, irritants et cancérigènes pénètrent en même temps", "3 à 5 mg de nicotine par cigarette"] },
                { time: "20–30 sec", color: "#fbbf24", icon: "🧠", title: "Activation cérébrale", events: ["nAChR activés → libération dopamine", "Sentiment de 'soulagement' — manque soudainement soulagé", "Légère augmentation de l'attention et de la concentration", "Noradrénaline → légère augmentation vigilance", "Sérotonine → calme apparent"] },
                { time: "30 min", color: "#f97316", icon: "📉", title: "Déclin", events: ["Nicotine chute à 60% du pic", "Sensation de plaisir qui s'estompe", "Premiers signaux d'inconfort", "Début de légère irritabilité", "Corps réclame la prochaine cigarette"] },
                { time: "1–2h", color: "#ef4444", icon: "😤", title: "Manque", events: ["Nicotine à 15-20% du pic", "Irritabilité, difficulté à se concentrer", "Pensées récurrentes sur la cigarette", "Légère anxiété, agitation", "Trigger environnemental déclenche l'envie"] },
                { time: "Long terme", color: "#a855f7", icon: "⚙️", title: "Dépendance installée", events: ["Récepteurs nAChR upregulés ×2 en permanence", "Cerveau 'normal' = cerveau qui fume", "Arrêter = retourner à la normal pendant des semaines", "Conditionnement comportemental puissant ajouté", "Mémoire émotionnelle du soulagement gravée"] },
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
            <SectionTitle color={COLOR}>Timeline — bénéfices après l'arrêt</SectionTitle>
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
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 16 }}>RÉDUCTION DES RISQUES — ARRÊT COMPLET</div>
                {[
                  { step: "Arrêt complet", color: COLOR },
                  { step: "20 min → FC et PA normales", color: "#22c55e" },
                  { step: "12h → CO sanguin éliminé", color: "#84cc16" },
                  { step: "2 sem → circulation améliorée", color: "#fbbf24" },
                  { step: "1 an → risque coronarien −50%", color: "#f97316" },
                  { step: "5 ans → risque AVC = non-fumeur", color: "#ef4444" },
                  { step: "10 ans → risque cancer poumon −50%", color: "#a855f7" },
                  { step: "15 ans → risque cardio = non-fumeur", color: "#06b6d4" },
                ].map((item, i, arr) => (
                  <div key={i} style={{ display: "flex", alignItems: "stretch" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 28 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, flexShrink: 0, marginTop: 10 }} />
                      {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: item.color, opacity: 0.2, minHeight: 14 }} />}
                    </div>
                    <div style={{ padding: "6px 12px", fontSize: 12, color: i === 0 ? item.color : "#94a3b8", fontWeight: i === 0 ? "bold" : "normal" }}>
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
            <SectionTitle color={COLOR}>Nicotine & Hormones</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 24, marginBottom: 24 }}>
              <Card color={COLOR}>
                <div style={{ fontSize: 11, color: COLOR, letterSpacing: 2, fontFamily: "monospace", marginBottom: 6 }}>NICOTINE & SATISFACTION — CYCLE PAR CIGARETTE</div>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 16, lineHeight: 1.5 }}>Demi-vie 2h : chaque cigarette ne fait que combler le manque créé par la précédente.</div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={nicotineData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <defs>
                      <linearGradient id="tab-nicGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLOR} stopOpacity={0.4} /><stop offset="95%" stopColor={COLOR} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="tab-satGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#475569" }} />
                    <YAxis tick={{ fontSize: 9, fill: "#475569" }} />
                    <Tooltip content={<NicTip />} />
                    <Area type="monotone" dataKey="niveau" stroke={COLOR} fill="url(#tab-nicGrad)" strokeWidth={2} name="niveau" dot={false} />
                    <Area type="monotone" dataKey="satisfaction" stroke="#3b82f6" fill="url(#tab-satGrad)" strokeWidth={2} name="satisfaction" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}><div style={{ width: 16, height: 2, background: COLOR }} /><span style={{ color: "#64748b" }}>Nicotine sanguine</span></div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}><div style={{ width: 16, height: 2, background: "#3b82f6" }} /><span style={{ color: "#64748b" }}>Satisfaction</span></div>
                </div>
              </Card>
              <div>
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>TABLEAU HORMONAL — TABAC</div>
                {[
                  { hormone: "Dopamine", effet: "↑ aigu/↓ baseline", duree: "Cigarette + post-tabac", impact: "Récompense per cigarette, mais baseline dopamine réduite avec dépendance", color: "#a855f7" },
                  { hormone: "Noradrénaline", effet: "↑", duree: "Par cigarette", impact: "Vigilance légère, concentration, vasoconstriction", color: "#f87171" },
                  { hormone: "Cortisol", effet: "↑ chronique", duree: "Fumeur régulier", impact: "Stress oxydatif, inflammation, vieillissement cellulaire accéléré", color: "#ef4444" },
                  { hormone: "Insuline", effet: "Résistance", duree: "Usage chronique", impact: "Le tabac augmente la résistance à l'insuline — risque diabète type 2", color: "#fbbf24" },
                  { hormone: "Estrogènes", effet: "↓↓ femmes", duree: "Usage chronique", impact: "Ménopause précoce de 1-4 ans, ostéoporose, fertilité réduite", color: "#fb923c" },
                  { hormone: "Testostérone", effet: "↓ hommes", duree: "Usage chronique", impact: "Dysfonction érectile (vasoconstriction + testostérone basse)", color: "#6366f1" },
                ].map((h, i) => (
                  <div key={i} style={{ background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 10, padding: 12, marginBottom: 8, borderLeft: `3px solid ${h.color}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: "bold", color: h.color }}>{h.hormone}</span>
                      <span style={{ fontSize: 11, fontFamily: "monospace", color: "#e2e8f0", fontWeight: "bold" }}>{h.effet}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 3 }}>{h.impact}</div>
                    <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace" }}>Durée : {h.duree}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeNav === "lungs" && (
          <div>
            <SectionTitle color={COLOR}>Poumons & Cancer — dommages spécifiques</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>PROGRESSION DES DOMMAGES PULMONAIRES</div>
                {[
                  { stage: "5-10 ans", color: "#fbbf24", desc: "Toux chronique du matin, expectoration. Cils bronchiques chroniquement paralysés. Infections fréquentes. Spirométrie légèrement réduite." },
                  { stage: "10-20 ans", color: "#f97316", desc: "Bronchite chronique installée. Essoufflement à l'effort. BPCO stade précoce possible. Risque cancer commence à monter significativement." },
                  { stage: "20-30 ans", color: "#ef4444", desc: "BPCO évoluée — essoufflement à faible effort. Emphysème. Risque cancer ×15-25 vs non-fumeur. Risque cardiovasculaire très élevé." },
                  { stage: "30 ans+", color: "#dc2626", desc: "Insuffisance respiratoire chronique. Oxygène permanent possible. Risque cancer extrêmement élevé. Espérance de vie réduite de 10+ ans." },
                ].map((stage, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: stage.color, flexShrink: 0, marginTop: 4 }} />
                      {i < 3 && <div style={{ width: 2, flex: 1, background: stage.color, opacity: 0.2, minHeight: 20 }} />}
                    </div>
                    <div style={{ flex: 1, background: "#0d0d1a", border: `1px solid ${stage.color}22`, borderRadius: 10, padding: 12 }}>
                      <div style={{ fontSize: 11, color: stage.color, fontFamily: "monospace", fontWeight: "bold", marginBottom: 4 }}>Tabagisme {stage.stage}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.4 }}>{stage.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>CANCERS LIÉS AU TABAC</div>
                {[
                  { cancer: "Cancer du poumon", risque: "×25", part: "85% liés tabac", color: "#ef4444" },
                  { cancer: "Cancer larynx/gorge", risque: "×5-10", part: "75% liés tabac", color: "#f97316" },
                  { cancer: "Cancer de l'œsophage", risque: "×5", part: "70% liés tabac", color: "#fbbf24" },
                  { cancer: "Cancer de la bouche/lèvres", risque: "×6", part: "80% liés tabac", color: "#fb923c" },
                  { cancer: "Cancer de la vessie", risque: "×3", part: "50% liés tabac", color: "#a855f7" },
                  { cancer: "Cancer du pancréas", risque: "×2-3", part: "25% liés tabac", color: "#6366f1" },
                  { cancer: "Leucémies", risque: "×2", part: "Benzène fumée", color: "#22d3ee" },
                ].map((item, i) => (
                  <div key={i} style={{ background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 10, padding: 12, marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: "bold", color: "#e2e8f0" }}>{item.cancer}</span>
                      <div style={{ display: "flex", gap: 8 }}>
                        <span style={{ fontSize: 12, fontFamily: "monospace", color: item.color, fontWeight: "bold" }}>{item.risque}</span>
                      </div>
                    </div>
                    <div style={{ height: 4, background: "#1e1e3a", borderRadius: 2 }}>
                      <div style={{ width: item.part, height: "100%", background: item.color, borderRadius: 2, opacity: 0.6 }} />
                    </div>
                    <div style={{ fontSize: 10, color: "#475569", marginTop: 3 }}>{item.part} des cas attribuables au tabac</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeNav === "stop" && (
          <div>
            <SectionTitle color={COLOR}>Arrêter de fumer — méthodes et bénéfices</SectionTitle>
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
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>MÉTHODES D'ARRÊT — EFFICACITÉ</div>
                {[
                  { icon: "💊", tip: "Varénicline (Champix)", desc: "Agoniste partiel nAChR — réduit le plaisir de fumer et les symptômes de sevrage. Méthode la plus efficace en monothérapie (×3 vs placebo)." },
                  { icon: "🩹", tip: "Substitution nicotinique", desc: "Patchs, gommes, inhalateurs — délivrent la nicotine sans les 7000 composés. Efficacité ×1.5-2 vs pas d'aide. Idéal en combinaison." },
                  { icon: "💙", tip: "Bupropion (Zyban)", desc: "Antidépresseur qui réduit le craving. Efficacité similaire à la varénicline. Utile si dépression sous-jacente associée." },
                  { icon: "🧠", tip: "TCC + accompagnement", desc: "La thérapie comportementale multiplie l'efficacité de toute méthode. Traite les triggers comportementaux et le conditionnement." },
                  { icon: "📱", tip: "Applications et suivi", desc: "Les apps de suivi (jours sans fumer, argent économisé, bénéfices santé) renforcent la motivation et la conscientisation." },
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
                  <div style={{ fontSize: 12, color: "#22c55e", fontWeight: "bold", marginBottom: 8 }}>📊 La vérité sur les rechutes</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>95% des fumeurs qui arrêtent sans aide rechutent dans l'année. Ce n'est pas un manque de volonté — c'est la physiologie. Avec médicaments + accompagnement, le taux de succès à 1 an monte à 30-35%. Chaque tentative apprend quelque chose.</div>
                </Card>
              </div>
            </div>
          </div>
        )}

      </div>

      <div style={{ padding: "20px 48px 36px", borderTop: "1px solid #1e1e3a", textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "#334155", letterSpacing: 1, fontFamily: "monospace" }}>
          BASÉ SUR DES DONNÉES SCIENTIFIQUES PEER-REVIEWED · OMS · CIRC · US Surgeon General Report · IARC
        </div>
      </div>
    </div>
  );
}
