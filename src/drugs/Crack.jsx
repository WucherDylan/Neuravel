import { useState } from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart, BarChart, Bar } from "recharts";
import { useWidth, SectionTitle, Card } from "../shared";

const COLOR = "#f97316";

const NAV = [
  { id: "overview", label: "Vue d'ensemble", icon: "⚡" },
  { id: "immediate", label: "Effets immédiats", icon: "💨" },
  { id: "systems", label: "Systèmes affectés", icon: "🧬" },
  { id: "timeline", label: "Timeline récupération", icon: "📅" },
  { id: "hormones", label: "Dopamine & Hormones", icon: "📈" },
  { id: "addiction", label: "Addiction & Craving", icon: "⚡" },
  { id: "stop", label: "Récupération", icon: "🌱" },
];

const dopamineData = [
  { time: "Baseline", normal: 100, drug: 100 },
  { time: "Onset 10s", normal: 100, drug: 480 },
  { time: "5 min", normal: 100, drug: 380 },
  { time: "15 min", normal: 100, drug: 180 },
  { time: "30 min", normal: 100, drug: 55 },
  { time: "1h", normal: 100, drug: 50 },
  { time: "3h", normal: 100, drug: 65 },
  { time: "24h", normal: 100, drug: 80 },
  { time: "1 sem", normal: 100, drug: 88 },
  { time: "1 mois", normal: 100, drug: 92 },
];

const bingeData = [
  { time: "Pipe 1", dopamine: 480, craving: 10 },
  { time: "15 min", dopamine: 180, craving: 80 },
  { time: "Pipe 2", dopamine: 420, craving: 15 },
  { time: "30 min", dopamine: 150, craving: 90 },
  { time: "Pipe 3", dopamine: 350, craving: 20 },
  { time: "45 min", dopamine: 120, craving: 95 },
  { time: "Pipe 4", dopamine: 280, craving: 25 },
  { time: "1h15", dopamine: 80, craving: 100 },
  { time: "Arrêt", dopamine: 55, craving: 100 },
];

const systems = [
  {
    icon: "🧠", title: "Cerveau & Dopamine", color: "#f97316",
    impacts: [
      { label: "DAT (transporteur dopamine)", value: "Bloqué 100%", desc: "La cocaine (base du crack) bloque le transporteur DAT — la dopamine s'accumule dans la synapse. +400-500% vs baseline." },
      { label: "Onset (fumé)", value: "8 secondes", desc: "Fumé, le crack atteint le cerveau en 8s via les poumons — plus rapide que la voie IV. Intensité maximale du flash." },
      { label: "Durée du high", value: "5–15 min", desc: "Beaucoup plus court que la cocaïne nasale (30-60 min). Cette brièveté crée une compulsion de re-fumer immédiate." },
      { label: "Circuits de récompense", value: "Saturés", desc: "Le signal de récompense est tellement intense que toutes les activités naturelles (nourriture, sexe) semblent fades ensuite." },
      { label: "Noradrénaline & Sérotonine", value: "↑↑↑", desc: "Le crack bloque aussi le NET et SERT — noradrénaline (énergie, vigilance) et sérotonine (humeur) en excès." },
    ]
  },
  {
    icon: "❤️", title: "Cœur & Vaisseaux", color: "#f87171",
    impacts: [
      { label: "Tachycardie", value: "+50-100 bpm", desc: "Noradrénaline ↑↑ → activation sympathique massive. Risque d'arythmie, surtout sur cœur fragilisé." },
      { label: "Hypertension", value: "↑↑ sévère", desc: "Vasoconstriction généralisée. Pression systolique peut dépasser 180 mmHg. Risque d'AVC." },
      { label: "Infarctus du myocarde", value: "Risque ×24", desc: "Vasospasme coronarien + tachycardie + hypertension = triade mortelle. Même chez les jeunes sans antécédents." },
      { label: "Cardiomyopathie", value: "Chronique", desc: "Usage répété → inflammation du muscle cardiaque, dilatation, insuffisance cardiaque." },
      { label: "Mort subite", value: "Risque élevé", desc: "Arythmie ventriculaire fatale possible dès la première utilisation, surtout combiné avec alcool." },
    ]
  },
  {
    icon: "🫁", title: "Poumons — Crack Lung", color: "#fb923c",
    impacts: [
      { label: "Crack Lung", value: "Syndrome aigu", desc: "Hémorragie alvéolaire diffuse, pneumonie d'hypersensibilité. Douleur thoracique, hémoptysie, insuffisance respiratoire." },
      { label: "Température de fumée", value: "900°C", desc: "La fumée de crack brûle les voies respiratoires. Trachéite, bronchite chimique chronique." },
      { label: "Pneumothorax", value: "Risque ↑", desc: "Inhalation forcée + Valsalva (retenir la fumée) → rupture alvéolaire → poumon effondré." },
      { label: "BPCO accélérée", value: "Chronique", desc: "Usage à long terme → destruction des parois alvéolaires, emphysème prématuré." },
      { label: "Aspergillus (moisissure)", value: "Contamination", desc: "Crack souvent contaminé par des moisissures — aspergilloses pulmonaires graves chez immunodéprimés." },
    ]
  },
  {
    icon: "🧪", title: "Métabolisme & Poids", color: "#34d399",
    impacts: [
      { label: "Appétit", value: "SUPPRIMÉ", desc: "Activation sympathique + cortisol + noradrénaline = anorexie totale pendant l'intoxication. Malnutrition sévère avec usage chronique." },
      { label: "Métabolisme de base", value: "↑↑↑", desc: "Hyperthermie + tachycardie + agitation = dépense énergétique massive. Perte de poids rapide et extrême." },
      { label: "Hyperthermie", value: "Jusqu'à 41°C", desc: "Température corporelle peut dépasser 41°C en cas de dose élevée ou effort physique — risque vital." },
      { label: "Dénutrition", value: "Chronique", desc: "Usagers de crack chroniques perdent 20-40% de leur poids corporel. Carences multiples." },
      { label: "Immunodépression", value: "Sévère", desc: "Malnutrition + cortisol élevé + stress oxydatif → système immunitaire effondré." },
    ]
  },
];

const timeline = [
  { day: "Pendant", icon: "💨", color: "#f97316", phase: "Intoxication", items: ["Flash en 8 secondes — euphorie maximale", "Tachycardie, hypertension, mydriase", "Confiance et énergie extrêmes", "Suppression totale de la faim et du sommeil", "Durée : 5-15 minutes seulement"] },
  { day: "15-30 min", icon: "📉", color: "#ef4444", phase: "Crash immédiat", items: ["Chute brutale dopamine sous baseline", "Dysphorie intense — le contraire de l'euphorie", "Anxiété, irritabilité, agressivité possible", "Craving écrasant — besoin de refumer immédiatement", "Début du 'binge' compulsif"] },
  { day: "Binge", icon: "🔄", color: "#dc2626", phase: "Binge compulsif", items: ["Répétition toutes les 15-20 minutes", "Chaque pipe moins euphorisante", "Craving qui monte malgré la consommation", "Épuisement cardiovasculaire progressif", "Peut durer des jours sans sommeil ni nourriture"] },
  { day: "48-72h", icon: "💀", color: "#7c3aed", phase: "Crash post-binge", items: ["Hypersomnie massive (dormir 20h+)", "Dépression sévère, anhedonia totale", "Faim intense — corps épuisé", "Paranoïa résiduelle, hallucinations tactiles", "Corps et mental au minimum absolu"] },
  { day: "1-2 sem", icon: "😤", color: "#6366f1", phase: "Craving persistant", items: ["Réveils avec envie intense de crack", "Humeur dépressive, irritabilité", "Triggers environnementaux puissants", "Insomnie, anxiété résiduelle", "Risque de rechute très élevé"] },
  { day: "1-3 mois", icon: "🌱", color: "#22c55e", phase: "Récupération", items: ["Dopamine baseline qui remonte", "Plaisirs naturels progressivement restaurés", "Sommeil qui se normalise", "Appétit et poids récupérés", "Craving qui diminue avec le temps"] },
];

const stopBenefits = [
  { period: "24-72h", color: "#ef4444", benefits: ["Crash post-binge — le plus difficile", "Corps en détox extrême"] },
  { period: "1 semaine", color: "#f97316", benefits: ["Sommeil récupérateur (parfois excessif)", "Appétit qui revient", "Paramètres cardiovasculaires normalisés"] },
  { period: "1 mois", color: "#fbbf24", benefits: ["Dopamine baseline en reconstruction", "Humeur plus stable", "Poids récupéré partiellement"] },
  { period: "3-6 mois", color: "#84cc16", benefits: ["Plaisirs naturels qui reviennent", "Craving moins intense", "Capacités cognitives améliorées"] },
  { period: "1-2 ans", color: "#22c55e", benefits: ["Récupération neurologique substantielle", "Circuits cardiovasculaires réparés", "Vie sociale reconstruite"] },
];

const DopaTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px" }}>
      <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontSize: 12, marginBottom: 2 }}>
          {p.name === "normal" ? "🟢 Dopamine saine" : "🔴 Crack"}: <strong>{p.value}%</strong>
        </div>
      ))}
    </div>
  );
};

const BingeTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px" }}>
      <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontSize: 12, marginBottom: 2 }}>
          {p.name === "dopamine" ? "🔴 Dopamine" : "🟠 Craving"}: <strong>{p.value}%</strong>
        </div>
      ))}
    </div>
  );
};

export default function Crack({ onBack }) {
  const [activeNav, setActiveNav] = useState("overview");
  const [activeSystem, setActiveSystem] = useState(0);
  const [activeDay, setActiveDay] = useState(0);
  const w = useWidth();
  const desk = w >= 768;

  return (
    <div style={{ minHeight: "100vh", background: "#060610", fontFamily: "'Georgia','Times New Roman',serif", color: "#e2e8f0" }}>

      <div style={{
        background: "linear-gradient(180deg, #1a0800 0%, #060610 100%)",
        padding: desk ? "48px 48px 36px" : "28px 20px 20px",
        borderBottom: "1px solid #2d1500",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, #f9731618 0%, transparent 70%)" }} />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid #2d1500", borderRadius: 8, color: "#64748b", padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "monospace", marginBottom: 16 }}>
            ← Choisir une substance
          </button>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: COLOR, marginBottom: 10, fontFamily: "monospace" }}>GUIDE SCIENTIFIQUE · #3 OMS · 54/100</div>
          <h1 style={{
            fontSize: desk ? 38 : 26, fontWeight: "bold", margin: "0 0 10px", lineHeight: 1.2,
            background: "linear-gradient(135deg, #fff 40%, #f97316)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Crack — cocaïne base fumable
          </h1>
          <p style={{ fontSize: desk ? 15 : 13, color: "#64748b", margin: 0, lineHeight: 1.7, maxWidth: 600 }}>
            Flash en 8 secondes, high de 5-15 minutes, crash immédiat. Le cycle binge le plus addictif qui existe.
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
              <div style={{ background: "#1a0800", border: `1px solid ${COLOR}33`, borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 11, color: COLOR, letterSpacing: 2, fontFamily: "monospace", marginBottom: 16 }}>PROFIL PHARMACOLOGIQUE</div>
                {[
                  { label: "Substance", value: "Cocaïne base libre (freebase)" },
                  { label: "Mécanisme", value: "Blocage DAT + NET + SERT → dopamine ++++" },
                  { label: "Voie d'administration", value: "Fumée (pipe)" },
                  { label: "Onset", value: "8 secondes — plus rapide que la voie IV" },
                  { label: "Durée du high", value: "5 à 15 minutes" },
                  { label: "Vs cocaïne nasale", value: "2× plus intense, 4× plus courte" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, paddingBottom: 10, borderBottom: i < 5 ? "1px solid #2d1500" : "none" }}>
                    <span style={{ fontSize: 12, color: "#64748b", flexShrink: 0, width: "40%" }}>{item.label}</span>
                    <span style={{ fontSize: 12, color: "#e2e8f0", textAlign: "right" }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { val: "+480%", label: "Dopamine au flash", sub: "vs baseline — pic maximal", color: COLOR },
                  { val: "8 sec", label: "Onset (fumé)", sub: "plus rapide que IV", color: "#ef4444" },
                  { val: "5-15 min", label: "Durée du high", sub: "crash immédiat après", color: "#f87171" },
                  { val: "×24", label: "Risque infarctus", sub: "vs non-consommateur", color: "#dc2626" },
                  { val: "Binge", label: "Pattern compulsif", sub: "répétition toutes 15 min", color: "#fb923c" },
                  { val: "72h", label: "Crash post-binge", sub: "dépression sévère", color: "#6366f1" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 12, padding: 14, textAlign: "center" }}>
                    <div style={{ fontSize: desk ? 20 : 16, fontWeight: "bold", color: s.color, marginBottom: 4, fontFamily: "monospace" }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: "#e2e8f0", marginBottom: 3 }}>{s.label}</div>
                    <div style={{ fontSize: 10, color: "#475569" }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
            <Card color={COLOR}>
              <div style={{ fontSize: 11, color: COLOR, letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>POURQUOI LE CRACK EST SI ADDICTIF — LE PARADOXE DU FLASH</div>
              <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr" : "1fr", gap: 14 }}>
                {[
                  { title: "L'intensité du flash", desc: "La rapidité d'entrée en cerveau détermine le potentiel addictif plus que la dose. Fumé, le crack atteint le cerveau en 8s — c'est plus rapide que toute autre voie. Un flash que rien d'autre ne peut reproduire." },
                  { title: "La brièveté comme piège", desc: "15 minutes de high suivi d'un crash dysphoric — le cerveau associe immédiatement 're-fumer' avec 'arrêter la souffrance'. Ce n'est plus le plaisir qui motive : c'est éviter le manque." },
                  { title: "Le binge comme logique", desc: "Chaque pipe provoque un crash plus profond que le précédent. Le seuil de dopamine monte, l'euphorie diminue, le craving reste maximum. Le binge peut durer des jours." },
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
            <SectionTitle color={COLOR}>Effets immédiats — du flash au crash</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 14 }}>
              {[
                { time: "0–15 secondes", color: COLOR, icon: "⚡", title: "Le Flash", events: ["Chaleur intense dans les poumons et la tête", "Euphorie explosive — toute anxiété et douleur disparaissent", "Confiance absolue, énergie maximale", "Dopamine +480% dans le nucleus accumbens", "Sensation de toute-puissance"] },
                { time: "1–5 min", color: "#fb923c", icon: "🌟", title: "L'Euphorie", events: ["Énergie, confiance, bien-être intense", "Bavardage, sociabilité extrême", "Libido augmentée", "Mydriase (pupilles dilatées)", "Tachycardie, hypertension"] },
                { time: "5–15 min", color: "#fbbf24", icon: "⬇️", title: "La Descente", events: ["Euphorie qui s'effondre rapidement", "Apparition de l'anxiété et de l'agitation", "Craving intense qui monte", "Conscience du 'vide' qui arrive", "Besoin urgent de refumer"] },
                { time: "15–30 min", color: "#ef4444", icon: "💥", title: "Le Crash", events: ["Dysphorie intense — état pire qu'avant", "Anxiété, irritabilité, paranoïa", "Craving ecrasant — tout pour refumer", "Début du cycle binge", "Tentations d'escalader la dose"] },
                { time: "Post-binge 48-72h", color: "#7c3aed", icon: "💤", title: "L'Effondrement", events: ["Hypersomnie extrême (dormir 20-24h)", "Dépression profonde, anhedonie totale", "Faim intense après jours sans manger", "Hallucinations tactiles résiduelles (formication)", "Corps et psychisme au minimum absolu"] },
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
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 16 }}>CASCADE DU BINGE</div>
                {[
                  { step: "1ère pipe — flash +480% dopamine", color: COLOR },
                  { step: "15 min — crash dysphoric, craving", color: "#f87171" },
                  { step: "2ème pipe — flash moins intense", color: "#fb923c" },
                  { step: "Tolérance rapide — dose ↑", color: "#fbbf24" },
                  { step: "Épuisement ressources dopamine", color: "#a855f7" },
                  { step: "Flash inexistant, craving maximal", color: "#6366f1" },
                  { step: "Binge arrêté (argent, produit, force)", color: "#22d3ee" },
                  { step: "Crash total 48-72h", color: "#22c55e" },
                ].map((item, i, arr) => (
                  <div key={i} style={{ display: "flex", alignItems: "stretch" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 28 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, flexShrink: 0, marginTop: 10 }} />
                      {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: item.color, opacity: 0.2, minHeight: 16 }} />}
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
            <SectionTitle color={COLOR}>Dopamine — le cycle flash-crash</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 24, marginBottom: 24 }}>
              <Card color={COLOR}>
                <div style={{ fontSize: 11, color: COLOR, letterSpacing: 2, fontFamily: "monospace", marginBottom: 6 }}>DOPAMINE — DU FLASH À LA RÉCUPÉRATION</div>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 16, lineHeight: 1.5 }}>Flash à 480% suivi d'un crash sous 60% — le cycle qui crée la compulsion.</div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={dopamineData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <defs>
                      <linearGradient id="crk-normalGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="crk-drugGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLOR} stopOpacity={0.5} /><stop offset="95%" stopColor={COLOR} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" tick={{ fontSize: 8, fill: "#475569" }} />
                    <YAxis tick={{ fontSize: 9, fill: "#475569" }} />
                    <Tooltip content={<DopaTip />} />
                    <ReferenceLine y={100} stroke="#475569" strokeDasharray="3 3" />
                    <Area type="monotone" dataKey="normal" stroke="#22c55e" fill="url(#crk-normalGrad)" strokeWidth={2} name="normal" dot={false} />
                    <Area type="monotone" dataKey="drug" stroke={COLOR} fill="url(#crk-drugGrad)" strokeWidth={2} name="drug" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
              <Card color="#ef4444">
                <div style={{ fontSize: 11, color: "#ef4444", letterSpacing: 2, fontFamily: "monospace", marginBottom: 6 }}>DYNAMIQUE DU BINGE — DOPAMINE VS CRAVING</div>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 16, lineHeight: 1.5 }}>La dopamine s'effondre à chaque pipe tandis que le craving reste maximal.</div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={bingeData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <defs>
                      <linearGradient id="crk-dopaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLOR} stopOpacity={0.4} /><stop offset="95%" stopColor={COLOR} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="crk-cravGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" tick={{ fontSize: 8, fill: "#475569" }} />
                    <YAxis tick={{ fontSize: 9, fill: "#475569" }} />
                    <Tooltip content={<BingeTip />} />
                    <Area type="monotone" dataKey="dopamine" stroke={COLOR} fill="url(#crk-dopaGrad)" strokeWidth={2} name="dopamine" dot={false} />
                    <Area type="monotone" dataKey="craving" stroke="#ef4444" fill="url(#crk-cravGrad)" strokeWidth={2} name="craving" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}><div style={{ width: 16, height: 2, background: COLOR }} /><span style={{ color: "#64748b" }}>Dopamine</span></div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}><div style={{ width: 16, height: 2, background: "#ef4444" }} /><span style={{ color: "#64748b" }}>Craving</span></div>
                </div>
              </Card>
            </div>
            <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>TABLEAU HORMONAL — USAGE CRACK</div>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr" : "1fr", gap: 10 }}>
              {[
                { hormone: "Dopamine", effet: "+480% flash", duree: "5-15 min", impact: "Euphorie explosive puis crash profond sous baseline", color: COLOR },
                { hormone: "Noradrénaline", effet: "↑↑↑", duree: "Intoxication", impact: "Tachycardie, hypertension, vigilance extrême, vasoconstriction", color: "#ef4444" },
                { hormone: "Sérotonine", effet: "↑ puis ↓", duree: "Variable", impact: "Euphorie initiale, puis humeur déprimée en crash", color: "#f87171" },
                { hormone: "Cortisol", effet: "↑↑↑", duree: "Post-crash", impact: "Stress aigu, paranoia, inflammation, immunodépression", color: "#fbbf24" },
                { hormone: "Testostérone", effet: "↓ chronique", duree: "Usage répété", impact: "Hypogonadisme, dysfonction érectile, fonte musculaire", color: "#fb923c" },
                { hormone: "Leptine (satiété)", effet: "↓↓", duree: "Usage", impact: "Appétit supprimé — malnutrition sévère avec usage chronique", color: "#6366f1" },
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

        {activeNav === "addiction" && (
          <div>
            <SectionTitle color={COLOR}>Addiction & Craving — la psychologie du binge</SectionTitle>
            <Card color={COLOR}>
              <div style={{ fontSize: 13, color: COLOR, marginBottom: 10, fontWeight: "bold" }}>⚡ Le crack comme paradigme de l'addiction</div>
              <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>Le crack est souvent utilisé dans les études sur l'addiction comme modèle paradigmatique. Sa pharmacologie illustre parfaitement pourquoi la puissance d'un flash court est plus addictive qu'un high prolongé modéré.</div>
            </Card>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 20, marginTop: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>MÉCANISMES DU CRAVING</div>
                {[
                  { num: "01", color: COLOR, title: "Mémoire émotionnelle hijackée", desc: "L'amygdale code le flash crack comme l'expérience la plus intense de ta vie. Tout ce qui y ressemble (contexte, personnes, odeurs) déclenche un craving automatique." },
                  { num: "02", color: "#f87171", title: "DeltaFosB — la trace moléculaire", desc: "Facteur de transcription accumulé avec l'usage — modifie durablement les gènes du circuit de récompense. Persiste des mois après l'arrêt." },
                  { num: "03", color: "#fbbf24", title: "Le seuil hédonique relevé", desc: "Après usage régulier, le cerveau ajuste sa 'baseline' vers le haut. Toute expérience normale — repas, musique, sexe — semble fade en comparaison." },
                  { num: "04", color: "#6366f1", title: "Désinhibition du cortex préfrontal", desc: "Le crack réduit l'activité du CPF (contrôle, prise de décision) — le comportement devient impulsif, régi par les circuits subcorticaux du craving." },
                ].map((item, i) => (
                  <div key={i} style={{ background: "#0d0d1a", border: `1px solid ${item.color}22`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
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
              <div>
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>TRIGGERS ENVIRONNEMENTAUX — GESTION</div>
                {[
                  { icon: "🏘️", tip: "Changer d'environnement", desc: "Les lieux associés au crack déclenchent un craving pavlovien. Changer radicalement d'environnement est la mesure #1 de prévention rechute." },
                  { icon: "👥", tip: "Réseau de soutien", desc: "Isolement = rechute. Le réseau social est le facteur prédictif le plus fort d'une récupération durable." },
                  { icon: "⏱️", tip: "Techniques de craving", desc: "Le craving dure en moyenne 15-20 minutes avant de redescendre. Techniques : respiration, appel d'un proche, activité physique." },
                  { icon: "🧠", tip: "Thérapie contingence", desc: "Récompenses concrètes pour l'abstinence (bons d'achat, activités). Evidence-based — une des approches les plus efficaces pour la dépendance crack." },
                  { icon: "💊", tip: "Pharmacologie adjuvante", desc: "Pas de traitement de substitution spécifique au crack (contrairement héroïne), mais certains médicaments réduisent le craving (ex: N-acétylcystéine)." },
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
                  { icon: "🏥", tip: "Structures CSAPA", desc: "Centres de Soins, d'Accompagnement et de Prévention en Addictologie — accueil sans jugement, traitement et suivi." },
                  { icon: "☎️", tip: "Drogues Info Service : 0800 23 13 13", desc: "Ligne gratuite, anonyme, 7j/7. Conseil et orientation vers des structures." },
                  { icon: "🏃", tip: "Exercice physique intensif", desc: "L'exercice génère dopamine et endorphines naturelles — combat l'anhedonia et reconstruit le circuit de récompense." },
                  { icon: "🥗", tip: "Réhabilitation nutritionnelle", desc: "Après les périodes de binge, le corps est sévèrement dénutri. Une alimentation riche en tryptophane (précurseur sérotonine) aide." },
                  { icon: "🧘", tip: "Pleine conscience (mindfulness)", desc: "Réduit l'intensité du craving et développe la capacité à observer les envies sans y céder." },
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
          BASÉ SUR DES DONNÉES SCIENTIFIQUES PEER-REVIEWED · NIH/NIDA · WHO · Volkow et al., Nature Reviews Neuroscience
        </div>
      </div>
    </div>
  );
}
