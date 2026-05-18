import { useState } from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts";
import { useWidth, SectionTitle, Card } from "../shared";

const COLOR = "#6366f1";

const NAV = [
  { id: "overview", label: "Vue d'ensemble", icon: "⚡" },
  { id: "immediate", label: "Effets immédiats", icon: "💊" },
  { id: "systems", label: "Systèmes affectés", icon: "🧬" },
  { id: "timeline", label: "Timeline sevrage", icon: "📅" },
  { id: "hormones", label: "GABA & Hormones", icon: "📈" },
  { id: "withdrawal", label: "Dépendance médicale", icon: "⚠️" },
  { id: "stop", label: "Sevrage progressif", icon: "🌱" },
];

const gabaData = [
  { time: "Normal", sensibilite: 100, drug: 0 },
  { time: "Sem 1", sensibilite: 90, drug: 80 },
  { time: "Sem 4", sensibilite: 70, drug: 80 },
  { time: "Mois 3", sensibilite: 50, drug: 80 },
  { time: "Mois 6", sensibilite: 35, drug: 80 },
  { time: "Arrêt brutal", sensibilite: 20, drug: 0 },
  { time: "Taper 3m", sensibilite: 60, drug: 10 },
  { time: "Taper 6m", sensibilite: 80, drug: 2 },
  { time: "1 an abstinence", sensibilite: 92, drug: 0 },
];

const cortisolData = [
  { time: "Sous benzos", normal: 14, drug: 8 },
  { time: "Arrêt J1", normal: 14, drug: 35 },
  { time: "J3", normal: 14, drug: 55 },
  { time: "J7", normal: 14, drug: 48 },
  { time: "J14", normal: 14, drug: 38 },
  { time: "1 mois", normal: 14, drug: 28 },
  { time: "3 mois", normal: 14, drug: 20 },
  { time: "6 mois", normal: 14, drug: 16 },
];

const systems = [
  {
    icon: "🧠", title: "Cerveau & GABA", color: "#6366f1",
    impacts: [
      { label: "Récepteurs GABA-A", value: "Modulateur +", desc: "Les benzos sont des modulateurs allostériques positifs du récepteur GABA-A. Ils augmentent la fréquence d'ouverture du canal Cl⁻, amplifiant l'inhibition neuronale." },
      { label: "Tolérance", value: "2-4 semaines", desc: "Le cerveau compense l'excès d'inhibition en réduisant le nombre et la sensibilité des récepteurs GABA-A. La dose thérapeutique devient insuffisante." },
      { label: "Mémoire antérograde", value: "Altérée", desc: "Amnésie antérograde — impossibilité de former de nouveaux souvenirs pendant l'action. Utilisé en médecine (chirurgie, endoscopie)." },
      { label: "Sommeil", value: "Paradoxal", desc: "Facilitent l'endormissement mais suppriment les stades profonds (N3) et le REM. Sommeil 'non-récupérateur' malgré la durée." },
      { label: "Rebond glutamate", value: "Sévère en sevrage", desc: "À l'arrêt, le glutamate (excitateur) n'est plus freiné → hyperexcitabilité neuronale → anxiété, insomnie, convulsions." },
    ]
  },
  {
    icon: "⚡", title: "Système nerveux central", color: "#818cf8",
    impacts: [
      { label: "Anxiolyse", value: "Puissante", desc: "Effets anxiolytiques rapides et puissants — c'est pourquoi ils sont prescrits. Mais la tolérance s'installe rapidement (2-4 semaines)." },
      { label: "Sédation", value: "↑ dose-dépendant", desc: "De la sédation légère au coma selon la dose. Utilisé en anesthésie (midazolam, diazépam)." },
      { label: "Anticonvulsivant", value: "Usage médical", desc: "Très efficace contre les convulsions d'urgence. Mais aussi impliqué dans les convulsions de sevrage si arrêt brutal." },
      { label: "Myorelaxant", value: "Central", desc: "Relaxation musculaire centrale — utile en médecine, mais cause chutes chez les personnes âgées." },
      { label: "Dépression respiratoire", value: "Seul: modérée", desc: "Seuls, les benzos causent rarement une dépression fatale. Combinés à alcool ou opioïdes : risque vital très élevé." },
    ]
  },
  {
    icon: "💊", title: "Pharmacologie comparée", color: "#a78bfa",
    impacts: [
      { label: "Durée d'action courte", value: "Triazolam, Alprazolam", desc: "Demi-vie 6-12h. Insomnie, crises de panique. Potentiel addictif plus élevé — pics sanguins prononcés, sevrage plus abrupt." },
      { label: "Durée d'action longue", value: "Diazépam, Chlordiazépoxide", desc: "Demi-vie 20-100h. Anxiété chronique, sevrage alcool, épilepsie. Sevrage plus doux, tapering plus facile." },
      { label: "Zolpidem, Zopiclone (Z-drugs)", value: "Apparentés", desc: "Même mécanisme GABA-A que les benzos. Mêmes risques de dépendance. Souvent prescrits car 'moins addictifs' — mythe contesté." },
      { label: "Risque combinaison opioïdes", value: "Létal ↑↑", desc: "La FDA a émis un black box warning. Benzos + opioïdes = +30× risque de mort par dépression respiratoire." },
      { label: "Prescription médicale", value: "Max 4 semaines", desc: "Recommandations officielles : benzos max 4 semaines. La réalité : souvent prescrits des mois ou des années." },
    ]
  },
  {
    icon: "🧪", title: "Hormones & Métabolisme", color: "#34d399",
    impacts: [
      { label: "Cortisol", value: "Supprimé sous traitement", desc: "Les benzos suppriment l'axe HPA — cortisol bas pendant la prise. Spike intense en sevrage : anxiété rebond, hypervigilance." },
      { label: "Mélatonine", value: "Perturbée", desc: "Architecture du sommeil détruite malgré l'endormissement facile. Déficit en sommeil profond et REM." },
      { label: "Testostérone", value: "↓ chronique", desc: "Usage prolongé → hypogonadisme. Libido réduite, fatigue, masse musculaire réduite." },
      { label: "GABA endogène", value: "Downrégulé", desc: "Le cerveau réduit sa production endogène de GABA — rendant le patient anxieux sans sa pilule, même à dose normale." },
      { label: "Neurostéroïdes", value: "Perturbés", desc: "Les neurostéroïdes endogènes (alloprégnanolone) modulant aussi GABA-A sont perturbés par l'usage chronique." },
    ]
  },
];

const timeline = [
  { day: "Usage", icon: "💊", color: "#6366f1", phase: "Action thérapeutique", items: ["Anxiolyse rapide — 15-30 minutes (oral)", "Sédation, relaxation musculaire", "Anticonvulsivant en urgence (IV)", "Amnésie antérograde possible", "Durée selon la molécule : 6h à 48h"] },
  { day: "Sem 2-4", icon: "⚠️", color: "#f97316", phase: "Tolérance s'installe", items: ["Récepteurs GABA-A se désensibilisent", "La dose originale ne suffit plus", "Augmentation spontanée de la dose", "Anxiété rebond entre les prises", "Dépendance physique installée"] },
  { day: "Mois 1-6", icon: "😰", color: "#ef4444", phase: "Dépendance physique", items: ["Manque entre les prises", "Anxiété et insomnie rebond sévères", "Symptômes de sevrage inter-doses", "Impossible d'arrêter seul sans aide", "Sevrage brutal = danger vital (convulsions)"] },
  { day: "Taper (progressif)", icon: "📉", color: "#fbbf24", phase: "Sevrage contrôlé", items: ["Réduction de 5-10% par mois", "Diazépam substitution si courte durée", "Suivi médical indispensable", "Symptômes modérés mais gérables", "Durée totale : 6-24 mois selon ancienneté"] },
  { day: "3-12 mois post-arrêt", icon: "🌥️", color: "#22d3ee", phase: "PAWS benzos", items: ["Syndrome post-sevrage prolongé (PAWS)", "Anxiété résiduelle, insomnie", "Symptômes fluctuants — 'windows and waves'", "Récepteurs GABA-A en reconstruction", "Amélioration progressive non-linéaire"] },
  { day: "1-2 ans", icon: "🌱", color: "#22c55e", phase: "Récupération", items: ["Récepteurs GABA-A normalisés", "Anxiété endogène gérée sans médication", "Sommeil récupérateur restauré", "Fonctions cognitives revenues", "Récupération complète possible"] },
];

const stopBenefits = [
  { period: "Semaine 1 (taper)", color: "#fbbf24", benefits: ["Premiers ajustements — modeste", "Corps qui commence à récupérer"] },
  { period: "1-3 mois", color: "#f97316", benefits: ["Récepteurs GABA commencent à récupérer", "Moins de dépendance à la molécule", "Clarté mentale progressive"] },
  { period: "3-6 mois", color: "#84cc16", benefits: ["Anxiété endogène mieux gérée", "Sommeil progressivement récupéré", "Humeur plus stable"] },
  { period: "6-12 mois", color: "#22c55e", benefits: ["Récupération cognitive substantielle", "GABA-A normalisés", "Indépendance fonctionnelle restaurée"] },
  { period: "1-2 ans", color: "#06b6d4", benefits: ["Récupération complète dans la majorité des cas", "Anxiété traitée par voies non-pharmacologiques", "Qualité de vie normale"] },
];

const GabaTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px" }}>
      <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontSize: 12, marginBottom: 2 }}>
          {p.name === "sensibilite" ? "🟢 Sensibilité GABA-A" : "🟣 Benzos actifs"}: <strong>{p.value}%</strong>
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
          {p.name === "normal" ? "🟢 Normal" : "🟣 Sevrage benzos"}: <strong>{p.value} µg/dL</strong>
        </div>
      ))}
    </div>
  );
};

export default function Benzodiazepines({ onBack }) {
  const [activeNav, setActiveNav] = useState("overview");
  const [activeSystem, setActiveSystem] = useState(0);
  const [activeDay, setActiveDay] = useState(0);
  const w = useWidth();
  const desk = w >= 768;

  return (
    <div style={{ minHeight: "100vh", background: "#060610", fontFamily: "'Georgia','Times New Roman',serif", color: "#e2e8f0" }}>

      <div style={{
        background: "linear-gradient(180deg, #08082a 0%, #060610 100%)",
        padding: desk ? "48px 48px 36px" : "28px 20px 20px",
        borderBottom: "1px solid #10103a",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, #6366f118 0%, transparent 70%)" }} />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid #10103a", borderRadius: 8, color: "#64748b", padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "monospace", marginBottom: 16 }}>
            ← Choisir une substance
          </button>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: COLOR, marginBottom: 10, fontFamily: "monospace" }}>GUIDE SCIENTIFIQUE · #8 OMS · 15/100</div>
          <h1 style={{
            fontSize: desk ? 38 : 26, fontWeight: "bold", margin: "0 0 10px", lineHeight: 1.2,
            background: "linear-gradient(135deg, #fff 40%, #6366f1)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Benzodiazépines — dépendance médicale
          </h1>
          <p style={{ fontSize: desk ? 15 : 13, color: "#64748b", margin: 0, lineHeight: 1.7, maxWidth: 600 }}>
            Modulateurs GABA-A — dépendance physique en 2-4 semaines. Sevrage brutal potentiellement fatal comme l'alcool.
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
              <div style={{ background: "#08082a", border: `1px solid ${COLOR}33`, borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 11, color: COLOR, letterSpacing: 2, fontFamily: "monospace", marginBottom: 16 }}>EXEMPLES ET PROFIL</div>
                {[
                  { label: "Exemples courants", value: "Diazépam (Valium), Alprazolam (Xanax), Lorazépam" },
                  { label: "Mécanisme", value: "Modulateur allostérique + récepteur GABA-A → Cl⁻↑" },
                  { label: "Effets médicaux", value: "Anxiété, insomnie, épilepsie, sevrage alcool" },
                  { label: "Dépendance physique", value: "2-4 semaines d'usage régulier" },
                  { label: "Sevrage brutal", value: "DANGER — convulsions, risque vital comme alcool" },
                  { label: "Prescription max", value: "4 semaines recommandées (souvent dépassé)" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, paddingBottom: 10, borderBottom: i < 5 ? `1px solid ${COLOR}22` : "none" }}>
                    <span style={{ fontSize: 12, color: "#64748b", flexShrink: 0, width: "38%" }}>{item.label}</span>
                    <span style={{ fontSize: 12, color: "#e2e8f0", textAlign: "right" }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { val: "2-4 sem", label: "Dépendance physique", sub: "avec usage régulier", color: "#ef4444" },
                  { val: "Convulsions", label: "Sevrage brutal", sub: "risque vital comme alcool", color: "#f97316" },
                  { val: "×30", label: "Mortalité si + opioïdes", sub: "combinaison dangereuse", color: "#f87171" },
                  { val: "4 semaines", label: "Durée recommandée", sub: "souvent dépassée en pratique", color: COLOR },
                  { val: "6-24 mois", label: "Sevrage progressif", sub: "taper nécessaire", color: "#818cf8" },
                  { val: "1-2 ans", label: "Récupération complète", sub: "avec sevrage médical", color: "#22c55e" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 12, padding: 14, textAlign: "center" }}>
                    <div style={{ fontSize: desk ? 18 : 14, fontWeight: "bold", color: s.color, marginBottom: 4, fontFamily: "monospace" }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: "#e2e8f0", marginBottom: 3 }}>{s.label}</div>
                    <div style={{ fontSize: 10, color: "#475569" }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "#14001a", border: "2px solid #ef444488", borderRadius: 14, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 14, color: "#ef4444", fontWeight: "bold", marginBottom: 10 }}>⚠️ ARRÊT BRUTAL = DANGER MÉDICAL</div>
              <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>L'arrêt brutal des benzodiazépines après une dépendance physique peut provoquer des convulsions, un delirium et même la mort. Ne jamais arrêter seul et brutalement. Le sevrage doit être progressif (taper) et médicalement supervisé. Consultez votre médecin avant tout changement.</div>
            </div>
            <Card color={COLOR}>
              <div style={{ fontSize: 11, color: COLOR, letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>MYTHE VS RÉALITÉ</div>
              <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr" : "1fr", gap: 14 }}>
                {[
                  { myth: "Les benzos prescrits par un médecin ne créent pas de dépendance", reality: "La dépendance physique apparaît en 2-4 semaines, prescription ou non. Les études montrent 40% des usagers de 4 semaines développent une dépendance." },
                  { myth: "Je peux arrêter quand je veux — c'est juste un anxiolytique", reality: "Faux et dangereux. L'arrêt brutal après dépendance peut provoquer des convulsions fatales. Le sevrage doit être progressif et supervisé." },
                  { myth: "Les Z-drugs (zolpidem) sont plus sûrs que les benzos", reality: "Même mécanisme GABA-A, même potentiel de dépendance. L'étiquette 'non-benzo' est pharmacologiquement trompeuse." },
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
            <SectionTitle color={COLOR}>Effets immédiats — de l'anxiolyse à la dépendance</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 14 }}>
              {[
                { time: "15–30 min", color: COLOR, icon: "😌", title: "Anxiolyse", events: ["GABA-A potentialisé → inhibition neuronale ↑", "Anxiété qui s'effondre rapidement", "Relaxation musculaire, calme mental", "Sédation légère à modérée", "Sentiment de sécurité et de contrôle"] },
                { time: "30 min – 2h", color: "#818cf8", icon: "💤", title: "Sédation", events: ["Somnolence, endormissement facilité", "Amnésie antérograde (nouveaux souvenirs bloqués)", "Coordination altérée, réflexes ralentis", "Désinhibition possible (comme alcool)", "Dépression respiratoire légère (seul)"] },
                { time: "Semaines 2-4", color: "#fbbf24", icon: "⚙️", title: "Tolérance", events: ["Récepteurs GABA-A se désensibilisent", "Dose originale de moins en moins efficace", "Anxiété rebond entre les prises augmente", "Prescription augmentée ou auto-augmentation", "Dépendance physique silencieusement installée"] },
                { time: "Mois 1+", color: "#f97316", icon: "🔗", title: "Dépendance", events: ["Anxiété pire qu'avant de commencer le traitement", "Impossible d'arrêter sans symptômes sévères", "Manque intense entre les prises (courte durée)", "Vie organisée autour de la prise", "Médication pour éviter le sevrage, plus pour traiter"] },
                { time: "Arrêt brutal", color: "#ef4444", icon: "🆘", title: "URGENCE MÉDICALE", events: ["Hyperexcitabilité neuronale massive (rebound)", "Convulsions — risque vital", "Delirium, confusion, hallucinations", "Tachycardie, hypertension, sueurs", "Hospitalisation nécessaire si dépendance ancienne"] },
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
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 16 }}>PROTOCOLE DE TAPER (RÉDUCTION PROGRESSIVE)</div>
                {[
                  { step: "Évaluation médicale initiale", color: COLOR, desc: "Dose actuelle, durée, molécule, état de santé" },
                  { step: "Substitution si besoin (diazépam)", color: "#818cf8", desc: "Demi-vie longue = sevrage plus doux, moins de pics" },
                  { step: "Réduction 5-10% toutes les 2-4 semaines", color: "#6366f1", desc: "Lente et progressive — le cerveau a le temps de s'adapter" },
                  { step: "Pause si symptômes sévères", color: "#fbbf24", desc: "Le taper peut s'arrêter et reprendre selon la tolérance" },
                  { step: "Durée totale : 6-24 mois", color: "#f97316", desc: "Selon la dose, la durée d'usage et la molécule" },
                  { step: "Soutien psychologique tout au long", color: "#22c55e", desc: "TCC pour l'anxiété sous-jacente qui resurgit" },
                ].map((item, i, arr) => (
                  <div key={i} style={{ display: "flex", alignItems: "stretch" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 28 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, flexShrink: 0, marginTop: 10 }} />
                      {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: item.color, opacity: 0.2, minHeight: 14 }} />}
                    </div>
                    <div style={{ padding: "6px 12px", flex: 1 }}>
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
            <SectionTitle color={COLOR}>GABA & Hormones</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 24, marginBottom: 24 }}>
              <Card color={COLOR}>
                <div style={{ fontSize: 11, color: COLOR, letterSpacing: 2, fontFamily: "monospace", marginBottom: 6 }}>SENSIBILITÉ GABA-A — USAGE ET RÉCUPÉRATION</div>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 16, lineHeight: 1.5 }}>Les récepteurs se désensibilisent avec l'usage. Le taper progressif permet la récupération. L'arrêt brutal cause une hyperexcitabilité dangereuse.</div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={gabaData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <defs>
                      <linearGradient id="benz-gabaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLOR} stopOpacity={0.4} /><stop offset="95%" stopColor={COLOR} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="benz-drugGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} /><stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" tick={{ fontSize: 8, fill: "#475569" }} />
                    <YAxis tick={{ fontSize: 9, fill: "#475569" }} />
                    <Tooltip content={<GabaTip />} />
                    <ReferenceLine y={100} stroke="#475569" strokeDasharray="3 3" />
                    <Area type="monotone" dataKey="sensibilite" stroke={COLOR} fill="url(#benz-gabaGrad)" strokeWidth={2} name="sensibilite" dot={false} />
                    <Area type="monotone" dataKey="drug" stroke="#818cf8" fill="url(#benz-drugGrad)" strokeWidth={2} name="drug" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}><div style={{ width: 16, height: 2, background: COLOR }} /><span style={{ color: "#64748b" }}>Sensibilité GABA-A</span></div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}><div style={{ width: 16, height: 2, background: "#818cf8" }} /><span style={{ color: "#64748b" }}>Benzos actifs</span></div>
                </div>
              </Card>
              <Card color="#ef4444">
                <div style={{ fontSize: 11, color: "#ef4444", letterSpacing: 2, fontFamily: "monospace", marginBottom: 6 }}>CORTISOL — SUPPRESSION ET REBOND EN SEVRAGE</div>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 16, lineHeight: 1.5 }}>Sous benzos : cortisol supprimé. Arrêt : spike massif. Avec taper progressif : remontée contrôlée.</div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={cortisolData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <defs>
                      <linearGradient id="benz-cortNorm" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="benz-cortDrug" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" tick={{ fontSize: 8, fill: "#475569" }} />
                    <YAxis tick={{ fontSize: 9, fill: "#475569" }} />
                    <Tooltip content={<CortTip />} />
                    <ReferenceLine y={20} stroke="#475569" strokeDasharray="3 3" label={{ value: "Seuil normal", fontSize: 9, fill: "#475569" }} />
                    <Area type="monotone" dataKey="normal" stroke="#22c55e" fill="url(#benz-cortNorm)" strokeWidth={2} name="normal" dot={false} />
                    <Area type="monotone" dataKey="drug" stroke="#ef4444" fill="url(#benz-cortDrug)" strokeWidth={2} name="drug" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </div>
            <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>TABLEAU HORMONAL — BENZOS</div>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr" : "1fr", gap: 10 }}>
              {[
                { hormone: "GABA-A sensibilité", effet: "↓↓ chronique", duree: "Semaines-mois d'usage", impact: "Anxiété rebond, hyperexcitabilité, convulsions en sevrage", color: COLOR },
                { hormone: "Cortisol", effet: "↓ sous benzo / ↑↑ sevrage", duree: "Dynamique d'arrêt", impact: "Suppression HPA puis hyperactivation — anxiété sévère en sevrage", color: "#ef4444" },
                { hormone: "Mélatonine", effet: "Perturbée", duree: "Usage chronique", impact: "Sommeil non-récupérateur malgré l'endormissement facile", color: "#6366f1" },
                { hormone: "Testostérone", effet: "↓ chronique", duree: "Usage long terme", impact: "Hypogonadisme, libido réduite, fatigue", color: "#f97316" },
                { hormone: "Glutamate (NMDA)", effet: "Hyperactivité sevrage", duree: "Arrêt", impact: "Excitotoxicité → convulsions, hallucinations, délire", color: "#f87171" },
                { hormone: "Alloprégnanolone", effet: "Perturbée", duree: "Usage chronique", impact: "Neurostéroïde endogène modulant GABA-A — système déséquilibré", color: "#a78bfa" },
              ].map((h, i) => (
                <div key={i} style={{ background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 10, padding: 14, borderLeft: `3px solid ${h.color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: "bold", color: h.color }}>{h.hormone}</span>
                    <span style={{ fontSize: 11, fontFamily: "monospace", color: "#e2e8f0", fontWeight: "bold" }}>{h.effet}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>{h.impact}</div>
                  <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace" }}>Durée : {h.duree}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeNav === "withdrawal" && (
          <div>
            <SectionTitle color={COLOR}>Dépendance médicale — le piège de la prescription</SectionTitle>
            <div style={{ background: "#14001a", border: "2px solid #ef444488", borderRadius: 14, padding: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 14, color: "#ef4444", fontWeight: "bold", marginBottom: 8 }}>⚠️ SEVRAGE BENZO = URGENCE MÉDICALE POTENTIELLE</div>
              <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>Contrairement aux opioïdes, l'arrêt brutal des benzodiazépines après dépendance peut provoquer des convulsions fatales. Comme pour l'alcool (même mécanisme GABA), le sevrage doit être TOUJOURS médicalement supervisé. Ne jamais arrêter seul brutalement.</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>COMMENT LA DÉPENDANCE S'INSTALLE</div>
                {[
                  { num: "01", color: "#fbbf24", title: "Prescription légitime", desc: "Anxiété, insomnie, crise de panique — le médecin prescrit. Les benzos sont très efficaces à court terme. Le patient se sent mieux." },
                  { num: "02", color: "#f97316", title: "Tolérance silencieuse", desc: "En 2-4 semaines, les récepteurs GABA-A se désensibilisent. La même dose produit moins d'effet. L'anxiété revient entre les prises." },
                  { num: "03", color: "#ef4444", title: "Dose escaladée", desc: "Le patient (ou le médecin) augmente la dose. L'anxiété 'rebond' est confondue avec la maladie originale. La dépendance n'est pas reconnue." },
                  { num: "04", color: "#dc2626", title: "Impossible d'arrêter seul", desc: "Toute tentative d'arrêt = symptômes sévères (anxiété extrême, insomnie, convulsions). Le cerveau dépendant interprète tout arrêt comme une urgence." },
                ].map((item, i) => (
                  <div key={i} style={{ background: "#0d0d1a", border: `1px solid ${item.color}22`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
                    <div style={{ display: "flex", gap: 12 }}>
                      <div style={{ fontFamily: "monospace", fontSize: 20, fontWeight: "bold", color: item.color, opacity: 0.4, flexShrink: 0, lineHeight: 1 }}>{item.num}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: "bold", color: item.color, marginBottom: 6 }}>{item.title}</div>
                        <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{item.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>ALTERNATIVES NON-PHARMACOLOGIQUES À L'ANXIÉTÉ</div>
                {[
                  { icon: "🧠", tip: "TCC (Thérapie Cognitivo-Comportementale)", desc: "Efficacité prouvée égale ou supérieure aux benzos à long terme pour l'anxiété généralisée. Traite les causes, pas les symptômes." },
                  { icon: "🧘", tip: "Méditation pleine conscience (MBSR)", desc: "Réduction significative de l'anxiété mesurée. Modifie la neuroplasticité des circuits de l'amygdale." },
                  { icon: "🏃", tip: "Exercice physique régulier", desc: "Effet anxiolytique comparable aux médicaments pour l'anxiété légère à modérée. GABA et endorphines naturels." },
                  { icon: "💊", tip: "ISRS/IRSN si médication nécessaire", desc: "Pour l'anxiété chronique, les antidépresseurs (sertraline, venlafaxine) sont plus appropriés à long terme — pas de dépendance physique." },
                  { icon: "🌙", tip: "Hygiène du sommeil structurée", desc: "TCC-I (insomnie) — aussi efficace que les hypnotiques sans les risques de dépendance. Approche première ligne recommandée." },
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
            <SectionTitle color={COLOR}>Sevrage progressif — bénéfices & protocole</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 24 }}>
              <div>
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>BÉNÉFICES DU SEVRAGE PROGRESSIF</div>
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
                <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>SOUTIEN ET RESSOURCES</div>
                {[
                  { icon: "🏥", tip: "Médecin traitant — première étape", desc: "Ne jamais agir seul. Votre médecin peut établir un plan de taper progressif ou vous orienter vers un spécialiste." },
                  { icon: "👥", tip: "Benzo Buddies (communauté en ligne)", desc: "Forum de soutien pour les personnes en sevrage de benzos. Expériences partagées, conseils pratiques." },
                  { icon: "📋", tip: "Protocole Ashton", desc: "Protocole de sevrage benzo de référence (Prof. Heather Ashton, Newcastle). Reconnu mondialement pour sa rigueur." },
                  { icon: "☎️", tip: "Drogues Info Service : 0800 23 13 13", desc: "Y compris pour les médicaments sous prescription. Ligne gratuite et anonyme." },
                  { icon: "🧠", tip: "TCC pendant le taper", desc: "Apprendre à gérer l'anxiété sans benzos pendant le sevrage — indispensable pour éviter la rechute." },
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
                  <div style={{ fontSize: 12, color: COLOR, fontWeight: "bold", marginBottom: 8 }}>🌱 La récupération est possible</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>Des dizaines de milliers de personnes ont réussi un sevrage progressif des benzodiazépines. Le processus est lent (6-24 mois) et peut être difficile, mais le cerveau récupère. Les systèmes GABA se reconstituent, l'anxiété endogène se normalise. La patience est la clé.</div>
                </Card>
              </div>
            </div>
          </div>
        )}

      </div>

      <div style={{ padding: "20px 48px 36px", borderTop: "1px solid #1e1e3a", textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "#334155", letterSpacing: 1, fontFamily: "monospace" }}>
          BASÉ SUR DES DONNÉES SCIENTIFIQUES PEER-REVIEWED · Ashton Manual · NICE Guidelines · Lader M., J. Psychopharmacology
        </div>
      </div>
    </div>
  );
}
