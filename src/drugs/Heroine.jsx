import { useState } from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts";
import { useWidth, SectionTitle, Card } from "../shared";

const COLOR = "#a855f7";

const NAV = [
  { id: "overview", label: "Vue d'ensemble", icon: "⚡" },
  { id: "immediate", label: "Effets immédiats", icon: "💉" },
  { id: "systems", label: "Systèmes affectés", icon: "🧬" },
  { id: "timeline", label: "Timeline sevrage", icon: "📅" },
  { id: "hormones", label: "Dopamine & Hormones", icon: "📈" },
  { id: "overdose", label: "Overdose & Sevrage", icon: "⚠️" },
  { id: "stop", label: "Récupération", icon: "🌱" },
];

const dopamineData = [
  { time: "Baseline", normal: 100, drug: 100 },
  { time: "Flash (IV)", normal: 100, drug: 350 },
  { time: "30 min", normal: 100, drug: 250 },
  { time: "2h", normal: 100, drug: 180 },
  { time: "6h", normal: 100, drug: 60 },
  { time: "12h", normal: 100, drug: 50 },
  { time: "J2", normal: 100, drug: 42 },
  { time: "J7", normal: 100, drug: 55 },
  { time: "1 mois", normal: 100, drug: 72 },
  { time: "3 mois", normal: 100, drug: 88 },
  { time: "1 an", normal: 100, drug: 96 },
];

const endorphinData = [
  { time: "Normal", endogenes: 100, exogenes: 0 },
  { time: "Semaine 1", endogenes: 40, exogenes: 100 },
  { time: "Mois 1", endogenes: 15, exogenes: 100 },
  { time: "Mois 3", endogenes: 8, exogenes: 100 },
  { time: "Arrêt J1", endogenes: 8, exogenes: 0 },
  { time: "Arrêt J7", endogenes: 20, exogenes: 0 },
  { time: "Arrêt 1m", endogenes: 55, exogenes: 0 },
  { time: "Arrêt 6m", endogenes: 80, exogenes: 0 },
  { time: "Arrêt 1an", endogenes: 95, exogenes: 0 },
];

const systems = [
  {
    icon: "🧠", title: "Cerveau & Opioïdes", color: "#a855f7",
    impacts: [
      { label: "Récepteurs µ-opioïdes", value: "Saturés", desc: "L'héroïne active massivement les récepteurs mu (MOR) — ceux des endorphines naturelles. Sensation de bien-être absolue." },
      { label: "Dopamine (VTA→NAcc)", value: "+200%", desc: "Libération de dopamine dans le nucleus accumbens 2× plus intense qu'aucune autre expérience naturelle." },
      { label: "Endorphines endogènes", value: "Supprimées", desc: "Le cerveau arrête de produire ses propres opioïdes. Dépendance physique après 2-3 semaines." },
      { label: "Sensibilité à la douleur", value: "↑↑↑", desc: "En sevrage, la douleur est amplifiée 3× — hyperalgésie opioïde. Le corps devient incapable de tolérer la douleur normale." },
      { label: "Cortex préfrontal", value: "Altéré", desc: "Prise de décision, impulsivité, contrôle — progressivement détériorés avec l'usage chronique." },
    ]
  },
  {
    icon: "🫁", title: "Respiration", color: "#f87171",
    impacts: [
      { label: "Centre respiratoire", value: "Déprimé", desc: "Les récepteurs mu-opioïdes du tronc cérébral contrôlent la respiration. L'héroïne les sature → bradypnée." },
      { label: "Fréquence respiratoire", value: "−50%", desc: "Peut descendre à 6-8 respirations/min (normale: 12-20). Cause #1 de mort par overdose." },
      { label: "Apnée du sommeil", value: "Risque ×3", desc: "Dépression respiratoire aggravée pendant le sommeil. Risque de mort subite." },
      { label: "Œdème pulmonaire", value: "Risque", desc: "Accumulation de liquide dans les poumons — peut survenir lors d'une overdose." },
      { label: "Narcan (naloxone)", value: "Antidote", desc: "Antagoniste opioïde. Inverse la dépression respiratoire en 2-5 minutes. Essentiel en cas d'OD." },
    ]
  },
  {
    icon: "🧪", title: "Hormones & Métabolisme", color: "#34d399",
    impacts: [
      { label: "Testostérone", value: "−60 à −70%", desc: "Hypogonadisme opioïde — suppression de l'axe hypothalamo-hypophyso-gonadique. Chute drastique chez hommes ET femmes." },
      { label: "Cortisol", value: "Dysrégulé", desc: "Axe HPA perturbé. Bas pendant l'intoxication, spike intense en sevrage × 2-3." },
      { label: "GH (hormone de croissance)", value: "↓↓", desc: "Sécrétion nocturne supprimée. Muscle, os et récupération physique impactés." },
      { label: "Prolactine", value: "↑↑", desc: "Hyperprolactinémie opioïde — troubles menstruels, galactorrhée, dysfonction sexuelle." },
      { label: "Insuline", value: "Résistance", desc: "Usage chronique → résistance à l'insuline, risque diabète de type 2." },
    ]
  },
  {
    icon: "❤️", title: "Cœur & Veines", color: "#fb923c",
    impacts: [
      { label: "Bradycardie", value: "↓ FC", desc: "Fréquence cardiaque ralentie par l'activation vagale opioïde. Associée à la dépression respiratoire." },
      { label: "Hypotension", value: "↓ PA", desc: "Vasodilatation périphérique → pression artérielle basse → risque d'évanouissement." },
      { label: "Endocardite", value: "IV risque", desc: "Injection IV = contamination bactérienne des valves cardiaques. Infections potentiellement fatales." },
      { label: "Thrombose veineuse", value: "Risque ↑↑", desc: "Injections répétées → destruction du capital veineux, thromboses, abcès." },
      { label: "HIV / Hépatite C", value: "Transmission", desc: "Partage d'aiguilles = vecteur #1 de VIH et hépatite C dans les populations d'usagers." },
    ]
  },
];

const timeline = [
  { day: "0-6h", icon: "💉", color: "#a855f7", phase: "Intoxication", items: ["Flash intense (IV) en 8-30 secondes", "Euphorie profonde — 'nodding'", "Analgésie totale, chaleur corporelle", "Dépression respiratoire — risque OD", "Conscience altérée, semi-conscience"] },
  { day: "6-24h", icon: "😰", color: "#f97316", phase: "Début sevrage", items: ["Larmoiements, rhinorrhée, bâillements", "Anxiété, agitation, irritabilité", "Début de douleurs musculaires", "Insomnie, chair de poule", "Craving intense — besoin urgent"] },
  { day: "24-72h", icon: "💀", color: "#ef4444", phase: "Pic sevrage", items: ["Douleurs musculaires/osseuses sévères", "Nausées, vomissements, diarrhée", "Hypertension, tachycardie, fièvre", "Sueurs froides, frissons intenses", "Crampes abdominales — 'cold turkey'"] },
  { day: "3-7j", icon: "😤", color: "#6366f1", phase: "Déclin sevrage", items: ["Symptômes physiques qui diminuent", "Insomnie persistante encore sévère", "Anxiété et dépression installées", "Faiblesse, léthargie extrême", "Craving psychologique intense"] },
  { day: "1-3 mois", icon: "🌥️", color: "#22d3ee", phase: "PAWS", items: ["Syndrome post-sevrage aigu (PAWS)", "Dysphorie, anhedonia — rien ne fait plaisir", "Insomnie chronique résiduelle", "Endorphines endogènes encore basses", "Risque de rechute très élevé"] },
  { day: "6-24 mois", icon: "🌱", color: "#22c55e", phase: "Récupération", items: ["Récepteurs opioïdes en reconstruction", "Dopamine baseline qui remonte", "Retour progressif du plaisir naturel", "Testostérone qui se normalise", "Récupération cognitive amorcée"] },
];

const stopBenefits = [
  { period: "24-72h", color: "#ef4444", benefits: ["Sevrage aigu (difficile mais pas fatal)", "Corps commence à se détoxifier"] },
  { period: "1-2 semaines", color: "#f97316", benefits: ["Symptômes physiques disparaissent", "Appétit revient", "Énergie physique progressivement"] },
  { period: "1 mois", color: "#fbbf24", benefits: ["Endorphines endogènes en reconstruction", "Sommeil qui s'améliore", "Humeur moins anhedonic"] },
  { period: "3-6 mois", color: "#84cc16", benefits: ["Testostérone en remontée", "Circuits dopamine en réparation", "Plaisirs naturels qui reviennent"] },
  { period: "1-2 ans", color: "#22c55e", benefits: ["Récupération neurologique substantielle", "Relations et vie sociale reconstituées", "Risque de rechute qui décline"] },
];

const DopaTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px" }}>
      <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontSize: 12, marginBottom: 2 }}>
          {p.name === "normal" ? "🟢 Dopamine saine" : "🔴 Héroïne"}: <strong>{p.value}%</strong>
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
          {p.name === "endogenes" ? "🟢 Endorphines naturelles" : "🔴 Opioïdes exogènes"}: <strong>{p.value}%</strong>
        </div>
      ))}
    </div>
  );
};

export default function Heroine({ onBack }) {
  const [activeNav, setActiveNav] = useState("overview");
  const [activeSystem, setActiveSystem] = useState(0);
  const [activeDay, setActiveDay] = useState(0);
  const w = useWidth();
  const desk = w >= 768;

  return (
    <div style={{ minHeight: "100vh", background: "#060610", fontFamily: "'Georgia','Times New Roman',serif", color: "#e2e8f0" }}>

      <div style={{
        background: "linear-gradient(180deg, #1a0530 0%, #060610 100%)",
        padding: desk ? "48px 48px 36px" : "28px 20px 20px",
        borderBottom: "1px solid #2d1b4e",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, #a855f718 0%, transparent 70%)" }} />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid #2d1b4e", borderRadius: 8, color: "#64748b", padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "monospace", marginBottom: 16 }}>
            ← Choisir une substance
          </button>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: COLOR, marginBottom: 10, fontFamily: "monospace" }}>GUIDE SCIENTIFIQUE · #2 OMS · 55/100</div>
          <h1 style={{
            fontSize: desk ? 38 : 26, fontWeight: "bold", margin: "0 0 10px", lineHeight: 1.2,
            background: "linear-gradient(135deg, #fff 40%, #a855f7)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Héroïne — opioïde semi-synthétique
          </h1>
          <p style={{ fontSize: desk ? 15 : 13, color: "#64748b", margin: 0, lineHeight: 1.7, maxWidth: 600 }}>
            Dépendance physique extrême, dépression respiratoire et effondrement du système endorphinique endogène.
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
              <div style={{ background: "#1a0530", border: `1px solid ${COLOR}33`, borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 11, color: COLOR, letterSpacing: 2, fontFamily: "monospace", marginBottom: 16 }}>PROFIL PHARMACOLOGIQUE</div>
                {[
                  { label: "Classe", value: "Opioïde semi-synthétique (diacétylmorphine)" },
                  { label: "Mécanisme", value: "Agoniste µ-opioïde (MOR) — récepteurs endorphines" },
                  { label: "Onset (IV)", value: "8-30 secondes — flash immédiat" },
                  { label: "Durée du high", value: "4-6 heures" },
                  { label: "Dépendance physique", value: "Après 2-3 semaines d'usage régulier" },
                  { label: "Potentiel addictif", value: "#2 mondial (OMS)" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, paddingBottom: 10, borderBottom: i < 5 ? "1px solid #2d1b4e" : "none" }}>
                    <span style={{ fontSize: 12, color: "#64748b", flexShrink: 0, width: "40%" }}>{item.label}</span>
                    <span style={{ fontSize: 12, color: "#e2e8f0", textAlign: "right" }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { val: "+200%", label: "Dopamine nucleus accumbens", sub: "vs toute expérience naturelle", color: COLOR },
                  { val: "2-3 sem", label: "Dépendance physique", sub: "avec usage régulier", color: "#f97316" },
                  { val: "−70%", label: "Testostérone", sub: "hypogonadisme opioïde", color: "#f87171" },
                  { val: "1/3", label: "Risque dépendance vie", sub: "si usage régulier amorcé", color: "#fb923c" },
                  { val: "72h", label: "Pic sevrage", sub: "syndrome cold turkey", color: "#a855f7" },
                  { val: "12-24m", label: "Récupération complète", sub: "circuits dopamine", color: "#22c55e" },
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
              <div style={{ fontSize: 11, color: COLOR, letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>MÉCANISME CENTRAL — POURQUOI C'EST SI ADDICTIF</div>
              <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr" : "1fr", gap: 14 }}>
                {[
                  { title: "Le système opioïde endogène", desc: "Ton cerveau produit naturellement des endorphines qui se fixent aux récepteurs opioïdes — pour gérer la douleur, l'effort, le plaisir social. L'héroïne simule ce système avec une intensité 10-100× supérieure." },
                  { title: "L'effondrement endogène", desc: "Avec l'usage régulier, le cerveau réduit sa production d'endorphines (régulation négative). Tu deviens dépendant de l'apport externe juste pour te sentir normal — pas pour te sentir bien." },
                  { title: "Le sevrage comme anti-plaisir", desc: "Le sevrage n'est pas l'absence de plaisir, c'est l'activation active du système douleur/stress. Douleurs osseuses, nausées, anxiété extrême — le cerveau purifie sa chimie en sens inverse." },
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
            <SectionTitle color={COLOR}>Effets immédiats — de l'injection au manque</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 14 }}>
              {[
                { time: "0–30 sec (IV)", color: "#a855f7", icon: "⚡", title: "Le Flash", events: ["Chaleur intense qui monte de l'abdomen au crâne", "Euphorie absolue — toute douleur physique et psychologique disparaît", "Sensation de bien-être total, plénitude", "Récepteurs µ-opioïdes saturés en secondes", "Dopamine +200% dans le nucleus accumbens"] },
                { time: "5–30 min", color: "#8b5cf6", icon: "🌊", title: "L'Euphorie", events: ["Sensation de paix profonde, chaleur corporelle", "Détachement du monde extérieur", "Analgésie totale — plus aucune douleur", "Nausées possibles (activation trigone area)", "Conscience intacte mais altérée"] },
                { time: "1–4h", color: "#6366f1", icon: "😴", title: "Le 'Nod'", events: ["Semi-conscience — oscillation entre éveil et somnolence", "Euphorie qui décline progressivement", "Corps lourd, muscles relâchés", "Respiration ralentie — risque si forte dose", "Pupilles en points (myosis)"] },
                { time: "4–8h", color: "#f97316", icon: "⬇️", title: "La Descente", events: ["Disparition progressive de l'euphorie", "Retour de la conscience normale", "Premiers signaux de manque si dépendant", "Anxiété légère, inconfort croissant", "Besoin psychologique de redoser"] },
                { time: "8–24h (sevrage)", color: "#ef4444", icon: "🆘", title: "Syndrome de sevrage", events: ["Larmoiements, éternuements, sueurs froides", "Douleurs musculaires et osseuses", "Diarrhée, nausées, vomissements", "Anxiété intense, insomnie, agitation", "Craving écrasant — tout le corps réclame"] },
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
            <SectionTitle color={COLOR}>Timeline du sevrage</SectionTitle>
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
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 16 }}>TRAITEMENT MÉDICAL DU SEVRAGE</div>
                {[
                  { step: "Méthadone ou Buprénorphine", color: COLOR, desc: "Substitution opioïde — réduit la souffrance du sevrage" },
                  { step: "Clonidine", color: "#6366f1", desc: "Réduit l'hyperactivité noradrénergique en sevrage" },
                  { step: "Loperamide", color: "#22d3ee", desc: "Diarrhée et crampes abdominales" },
                  { step: "Naltrexone (post-sevrage)", color: "#22c55e", desc: "Bloque l'effet de l'héroïne — aide à la prévention rechute" },
                  { step: "Suivi psychologique", color: "#84cc16", desc: "TCC, thérapie de remplacement — indispensable à long terme" },
                ].map((item, i, arr) => (
                  <div key={i} style={{ display: "flex", alignItems: "stretch" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 28 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, flexShrink: 0, marginTop: 12 }} />
                      {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: item.color, opacity: 0.2, minHeight: 20 }} />}
                    </div>
                    <div style={{ padding: "8px 12px 8px 6px", flex: 1 }}>
                      <div style={{ fontSize: 13, color: item.color, fontWeight: "bold" }}>{item.step}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeNav === "hormones" && (
          <div>
            <SectionTitle color={COLOR}>Dopamine & Système endorphinique</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 24, marginBottom: 24 }}>
              <Card color={COLOR}>
                <div style={{ fontSize: 11, color: COLOR, letterSpacing: 2, fontFamily: "monospace", marginBottom: 6 }}>DOPAMINE — USAGE ET RÉCUPÉRATION</div>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 16, lineHeight: 1.5 }}>Niveau relatif à la baseline (100%). Le crash post-héroïne plonge sous la normale.</div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={dopamineData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <defs>
                      <linearGradient id="her-normalGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="her-drugGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLOR} stopOpacity={0.4} /><stop offset="95%" stopColor={COLOR} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" tick={{ fontSize: 8, fill: "#475569" }} />
                    <YAxis tick={{ fontSize: 9, fill: "#475569" }} />
                    <Tooltip content={<DopaTip />} />
                    <ReferenceLine y={100} stroke="#475569" strokeDasharray="3 3" />
                    <Area type="monotone" dataKey="normal" stroke="#22c55e" fill="url(#her-normalGrad)" strokeWidth={2} name="normal" dot={false} />
                    <Area type="monotone" dataKey="drug" stroke={COLOR} fill="url(#her-drugGrad)" strokeWidth={2} name="drug" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}><div style={{ width: 16, height: 2, background: "#22c55e" }} /><span style={{ color: "#64748b" }}>Baseline saine</span></div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}><div style={{ width: 16, height: 2, background: COLOR }} /><span style={{ color: "#64748b" }}>Post-héroïne</span></div>
                </div>
              </Card>
              <Card color="#34d399">
                <div style={{ fontSize: 11, color: "#34d399", letterSpacing: 2, fontFamily: "monospace", marginBottom: 6 }}>ENDORPHINES ENDOGÈNES VS EXOGÈNES</div>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 16, lineHeight: 1.5 }}>Le cerveau arrête de produire ses propres endorphines. La récupération prend 6-18 mois.</div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={endorphinData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <defs>
                      <linearGradient id="her-endoGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} /><stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="her-exoGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f87171" stopOpacity={0.4} /><stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" tick={{ fontSize: 8, fill: "#475569" }} />
                    <YAxis tick={{ fontSize: 9, fill: "#475569" }} />
                    <Tooltip content={<EndoTip />} />
                    <Area type="monotone" dataKey="endogenes" stroke="#34d399" fill="url(#her-endoGrad)" strokeWidth={2} name="endogenes" dot={false} />
                    <Area type="monotone" dataKey="exogenes" stroke="#f87171" fill="url(#her-exoGrad)" strokeWidth={2} name="exogenes" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}><div style={{ width: 16, height: 2, background: "#34d399" }} /><span style={{ color: "#64748b" }}>Endorphines naturelles</span></div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}><div style={{ width: 16, height: 2, background: "#f87171" }} /><span style={{ color: "#64748b" }}>Opioïdes exogènes</span></div>
                </div>
              </Card>
            </div>
            <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>TABLEAU HORMONAL — USAGE CHRONIQUE</div>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr" : "1fr", gap: 10 }}>
              {[
                { hormone: "Testostérone", effet: "−60 à −70%", duree: "Chronique", impact: "Hypogonadisme opioïde — libido, masse musculaire, énergie", color: "#f97316" },
                { hormone: "Endorphines endogènes", effet: "Quasi nulles", duree: "Usage régulier", impact: "Incapacité à ressentir plaisir et gestion de la douleur naturels", color: COLOR },
                { hormone: "Cortisol", effet: "↑↑ en sevrage", duree: "Pics 72h sevrage", impact: "Anxiété intense, hyperalgésie, hyperactivation SNA", color: "#ef4444" },
                { hormone: "GH (croissance)", effet: "Supprimée", duree: "Usage chronique", impact: "Récupération musculaire, sommeil profond altérés", color: "#6366f1" },
                { hormone: "Prolactine", effet: "↑↑", duree: "Usage chronique", impact: "Dysfonction sexuelle, troubles menstruels, galactorrhée", color: "#f87171" },
                { hormone: "Dopamine baseline", effet: "↓↓ sous 100%", duree: "Mois post-arrêt", impact: "Anhedonia — rien ne procure de plaisir, risque rechute élevé", color: "#a855f7" },
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

        {activeNav === "overdose" && (
          <div>
            <SectionTitle color={COLOR}>Overdose & Sevrage — informations critiques</SectionTitle>
            <div style={{ background: "#1a0014", border: "2px solid #ef444488", borderRadius: 14, padding: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 14, color: "#ef4444", fontWeight: "bold", marginBottom: 10 }}>⚠️ OVERDOSE — RECONNAÎTRE ET RÉAGIR</div>
              <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: "#f87171", fontWeight: "bold", marginBottom: 8 }}>Signes d'overdose :</div>
                  {["Lèvres et ongles bleus (cyanose)", "Respiration très lente, bruyante ou absente", "Pupilles en points fixes", "Inconscience, impossible à réveiller", "Teint grisâtre, corps flasque"].map((s, i) => (
                    <div key={i} style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>⚡ {s}</div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#22c55e", fontWeight: "bold", marginBottom: 8 }}>Que faire immédiatement :</div>
                  {["Appeler le 15 (SAMU) ou 112", "Administrer la naloxone (Narcan) si disponible", "Position latérale de sécurité", "Pratiquer la ventilation si nécessaire", "Ne jamais laisser seule une personne en OD"].map((s, i) => (
                    <div key={i} style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>✓ {s}</div>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 14, padding: 12, background: "#060610", borderRadius: 8, fontSize: 12, color: "#22c55e" }}>
                🟢 La naloxone (Narcan) est un antidote opioïde disponible en pharmacie sans ordonnance. Elle inverse l'overdose en 2-5 minutes. En posséder une peut sauver une vie.
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>SYNDROME DE SEVRAGE — INTENSITÉ</div>
                {[
                  { time: "6-12h", level: 20, color: "#fbbf24", label: "Début — agitation, larmoiements" },
                  { time: "12-24h", level: 55, color: "#f97316", label: "Modéré — douleurs, nausées" },
                  { time: "24-48h", level: 90, color: "#ef4444", label: "Pic — souffrance sévère" },
                  { time: "48-72h", level: 80, color: "#f87171", label: "Intense — vomissements, crampes" },
                  { time: "3-5j", level: 50, color: "#fb923c", label: "Déclin — encore difficile" },
                  { time: "1 semaine", level: 25, color: "#fbbf24", label: "Résiduel — fatigue, insomnie" },
                  { time: "1 mois", level: 10, color: "#84cc16", label: "Stable — PAWS possible" },
                ].map((item, i) => (
                  <div key={i} style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                      <span style={{ color: "#64748b", fontFamily: "monospace" }}>{item.time}</span>
                      <span style={{ color: item.color, fontSize: 10 }}>{item.label}</span>
                    </div>
                    <div style={{ height: 8, background: "#1e1e3a", borderRadius: 4 }}>
                      <div style={{ width: `${item.level}%`, height: "100%", background: item.color, borderRadius: 4, opacity: 0.8 }} />
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>TRAITEMENT DE SUBSTITUTION</div>
                {[
                  { drug: "Méthadone", class: "Agoniste µ complet", use: "Réduction risques + sevrage progressif. Demi-vie longue (24-36h) = 1 prise/j.", color: "#22c55e" },
                  { drug: "Buprénorphine (Subutex)", class: "Agoniste µ partiel", use: "Standard en France. Moins d'abus potentiel. Combinée avec naloxone (Suboxone).", color: "#06b6d4" },
                  { drug: "Naltrexone", class: "Antagoniste µ", use: "Bloque l'effet des opioïdes. Utilisé après sevrage pour prévenir rechute.", color: "#a855f7" },
                ].map((t, i) => (
                  <div key={i} style={{ background: "#0d0d1a", border: `1px solid ${t.color}33`, borderRadius: 12, padding: 14, marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: "bold", color: t.color }}>{t.drug}</span>
                      <span style={{ fontSize: 10, color: "#64748b", fontFamily: "monospace" }}>{t.class}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{t.use}</div>
                  </div>
                ))}
                <Card color="#475569">
                  <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.6 }}>Le sevrage de l'héroïne n'est pas fatal en lui-même, mais la souffrance intense entraîne souvent une rechute. La substitution médicale est plus efficace que le sevrage brutal — elle réduit la mortalité et améliore les chances de récupération à long terme.</div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeNav === "stop" && (
          <div>
            <SectionTitle color={COLOR}>Récupération — bénéfices & étapes</SectionTitle>
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
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>SOUTIEN & RESSOURCES</div>
                {[
                  { icon: "🏥", tip: "Consultation addictologie", desc: "Médecin ou structure spécialisée (CSAPA) — traitement de substitution et suivi médical." },
                  { icon: "☎️", tip: "Drogues Info Service : 0800 23 13 13", desc: "Ligne gratuite, anonyme, 7j/7. Conseil, orientation, écoute." },
                  { icon: "👥", tip: "Narcotics Anonymous (NA)", desc: "Groupes de parole entre pairs. Présents dans toute la France. Efficacité reconnue." },
                  { icon: "🧠", tip: "Thérapie cognitivo-comportementale", desc: "La TCC réduit les rechutes en changeant les patterns de pensée liés à l'usage." },
                  { icon: "🏃", tip: "Activité physique intensive", desc: "L'exercice libère des endorphines naturelles — aide à reconstruire le système de récompense." },
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
                  <div style={{ fontSize: 12, color: COLOR, fontWeight: "bold", marginBottom: 8 }}>🧠 La neuroplasticité comme espoir</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>Le cerveau se répare. Les circuits dopaminergiques endommagés se reconstruisent sur 12 à 24 mois d'abstinence. La capacité à ressentir du plaisir naturel revient progressivement. La récupération est réelle et mesurable en neuroimagerie.</div>
                </Card>
              </div>
            </div>
          </div>
        )}

      </div>

      <div style={{ padding: "20px 48px 36px", borderTop: "1px solid #1e1e3a", textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "#334155", letterSpacing: 1, fontFamily: "monospace" }}>
          BASÉ SUR DES DONNÉES SCIENTIFIQUES PEER-REVIEWED · NIH/NIDA · WHO · Koob & Volkow, Neuroscience Reviews
        </div>
      </div>
    </div>
  );
}
