import { useState } from "react";
import { useWidth, SectionTitle, Card } from "../shared";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";

const COLOR = "#3b82f6";

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

const NAV = [
  { id: "overview", label: "Présentation" },
  { id: "immediate", label: "Effets immédiats" },
  { id: "systems", label: "Systèmes affectés" },
  { id: "timeline", label: "Timeline" },
  { id: "hormones", label: "Neurochimie" },
  { id: "risks", label: "Cœur & Nez" },
  { id: "stop", label: "Sécurité" },
  { id: "sources", label: "Sources" },
];

const DopaTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px" }}>
      <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontSize: 12, marginBottom: 2 }}>
          {p.name}: <strong>{p.value}%</strong>
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
          {p.name}: <strong>{p.value} µg/dL</strong>
        </div>
      ))}
    </div>
  );
};

function Overview({ desk }) {
  return (
    <div>
      <SectionTitle color={COLOR}>Présentation</SectionTitle>
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
              <div style={{ fontSize: 12, color: "#f87171", marginBottom: 6 }}>Mythe : {m.myth}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>Réalité : {m.reality}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Immediate({ desk }) {
  return (
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
  );
}

function Systems({ desk }) {
  const [activeSystem, setActiveSystem] = useState(0);
  return (
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
  );
}

function Timeline({ desk }) {
  return (
    <div>
      <SectionTitle color={COLOR}>Timeline</SectionTitle>

      <div style={{ fontSize: 11, color: COLOR, letterSpacing: 3, fontFamily: "monospace", marginBottom: 16, paddingBottom: 8, borderBottom: `1px solid ${COLOR}22` }}>PARTIE 1 — EFFETS ACTIFS (60 min)</div>

      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: COLOR, letterSpacing: 2, fontFamily: "monospace", marginBottom: 6 }}>DOPAMINE — USAGE ET RÉCUPÉRATION</div>
        <div style={{ fontSize: 11, color: "#475569", marginBottom: 14, lineHeight: 1.5 }}>Pic à +280% suivi d'un crash sous baseline. Récupération en quelques semaines avec abstinence.</div>
        <Card color={COLOR}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dopamineData} margin={{ top: 10, right: 10, bottom: 5, left: -10 }}>
              <defs>
                <linearGradient id="coc-normalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="coc-drugGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLOR} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={COLOR} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
              <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#475569" }} />
              <YAxis tick={{ fontSize: 9, fill: "#475569" }} />
              <Tooltip content={<DopaTip />} />
              <ReferenceLine y={100} stroke="#475569" strokeDasharray="3 3" />
              <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
              <Area type="monotone" dataKey="normal" stroke="#22c55e" fill="url(#coc-normalGrad)" strokeWidth={2} name="Baseline saine" dot={false} />
              <Area type="monotone" dataKey="drug" stroke={COLOR} fill="url(#coc-drugGrad)" strokeWidth={2} name="Post-cocaïne" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ fontSize: 11, color: "#22c55e", letterSpacing: 3, fontFamily: "monospace", marginBottom: 16, marginTop: 8, paddingBottom: 8, borderBottom: "1px solid #22c55e22" }}>PARTIE 2 — ARRÊT & RÉCUPÉRATION</div>

      <div>
        <div style={{ fontSize: 11, color: "#ef4444", letterSpacing: 2, fontFamily: "monospace", marginBottom: 6 }}>CORTISOL POST-COCAÏNE (µg/dL)</div>
        <div style={{ fontSize: 11, color: "#475569", marginBottom: 14, lineHeight: 1.5 }}>Pic de cortisol ×3 pendant et après l'usage. Anxiété, inflammation, stockage graisseux pendant 48h.</div>
        <Card color="#ef4444">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={cortisolData} margin={{ top: 10, right: 10, bottom: 5, left: -10 }}>
              <defs>
                <linearGradient id="coc-cortNorm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="coc-cortDrug" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
              <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#475569" }} />
              <YAxis tick={{ fontSize: 9, fill: "#475569" }} />
              <Tooltip content={<CortTip />} />
              <ReferenceLine y={20} stroke="#475569" strokeDasharray="3 3" />
              <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
              <Area type="monotone" dataKey="normal" stroke="#22c55e" fill="url(#coc-cortNorm)" strokeWidth={2} name="Cortisol normal" dot={false} />
              <Area type="monotone" dataKey="drug" stroke="#ef4444" fill="url(#coc-cortDrug)" strokeWidth={2} name="Post-cocaïne" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ marginTop: 28 }}>
        <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 16 }}>PHASES DE RÉCUPÉRATION</div>
        <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr" : "1fr", gap: 12 }}>
          {timeline.map((d, i) => (
            <div key={i} style={{ background: "#0d0d1a", border: `1px solid ${d.color}33`, borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>{d.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: "bold", color: d.color }}>{d.day}</div>
                  <div style={{ fontSize: 10, color: "#64748b", fontFamily: "monospace" }}>{d.phase}</div>
                </div>
              </div>
              {d.items.map((item, j) => (
                <div key={j} style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4, paddingLeft: 8, borderLeft: `2px solid ${d.color}44`, lineHeight: 1.5 }}>{item}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Neurochimie({ desk }) {
  return (
    <div>
      <SectionTitle color={COLOR}>Neurochimie — Dopamine & Hormones</SectionTitle>
      <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>TABLEAU HORMONAL — USAGE COCAÏNE</div>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr" : "1fr", gap: 10, marginBottom: 24 }}>
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
  );
}

function Risks({ desk }) {
  return (
    <div>
      <SectionTitle color={COLOR}>Cœur & Nez — dommages spécifiques</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 20, marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>LE CŒUR — CARDIOTOXICITÉ</div>
          <div style={{ background: "#14001a", border: "2px solid #ef444488", borderRadius: 14, padding: 20, marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: "#ef4444", fontWeight: "bold", marginBottom: 8 }}>Urgence cardiovasculaire sous cocaïne</div>
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
  );
}

function Safety({ desk }) {
  return (
    <div>
      <SectionTitle color={COLOR}>Sécurité — récupération & stratégies</SectionTitle>
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
  );
}

function Sources({ desk }) {
  const refs = [
    { authors: "Nutt DJ et al.", title: "Drug harms in the UK: a multicriteria decision analysis", journal: "The Lancet", year: "2010", url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(10)61462-6/fulltext" },
    { authors: "Varela-Nallar L et al.", title: "Neurovascular effects of cocaine: relevance to addiction", journal: "Frontiers in Pharmacology", year: "2024", url: "https://www.frontiersin.org/journals/pharmacology/articles/10.3389/fphar.2024.1357422/full" },
    { authors: "Zhang Y et al.", title: "Neurotoxicity mechanisms and clinical implications of six common recreational drugs", journal: "Frontiers in Pharmacology", year: "2025", url: "https://www.frontiersin.org/journals/pharmacology/articles/10.3389/fphar.2025.1526270/full" },
    { authors: "Vaughan RA, Foster JD.", title: "Mechanisms of dopamine transporter regulation in normal and disease states", journal: "PMC / Trends in Pharmacological Sciences", year: "2013", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4662164/" },
    { authors: "Volkow ND et al.", title: "Decreased striatal dopaminergic responsiveness in detoxified cocaine-dependent subjects", journal: "Nature", year: "1997", url: "https://pubmed.ncbi.nlm.nih.gov/9172169/" },
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

export default function Cocaine({ onBack }) {
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
        background: "linear-gradient(180deg, #00081a 0%, #060610 100%)",
        padding: desk ? "48px 48px 36px" : "28px 20px 20px",
        borderBottom: "1px solid #0f1e3a",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, #3b82f618 0%, transparent 70%)" }} />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid #0f1e3a", borderRadius: 8, color: "#64748b", padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "monospace", marginBottom: 16 }}>
            ← Retour
          </button>
          <div style={{ display: "inline-block", background: COLOR + "22", border: `1px solid ${COLOR}44`, borderRadius: 20, padding: "4px 14px", fontSize: 11, color: COLOR, fontFamily: "monospace", letterSpacing: 1, marginBottom: 12 }}>
            STIMULANT · #5 OMS · 27/100
          </div>
          <h1 style={{
            fontSize: desk ? 38 : 26, fontWeight: "bold", margin: "0 0 10px", lineHeight: 1.2,
            background: `linear-gradient(135deg, #fff 40%, ${COLOR})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            🤍 Cocaïne
          </h1>
          <p style={{ fontSize: desk ? 15 : 13, color: "#64748b", margin: "0 0 20px", lineHeight: 1.7, maxWidth: 600 }}>
            Blocage triple des transporteurs DAT/NET/SERT — euphorie, énergie, cardiotoxicité et destruction nasale.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { label: "+280% dopamine", color: COLOR },
              { label: "×6 risque infarctus", color: "#ef4444" },
              { label: "Septum perforé", color: "#fb923c" },
              { label: "Cocaéthylène dangereux", color: "#fbbf24" },
            ].map((b, i) => (
              <div key={i} style={{ background: "#0d0d1a", border: `1px solid ${b.color}33`, borderRadius: 20, padding: "4px 12px", fontSize: 11, color: b.color, fontFamily: "monospace" }}>
                {b.label}
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

      <div style={{ maxWidth: 900, margin: "0 auto", padding: desk ? "36px 48px" : "20px 16px" }}>
        {renderSection()}
      </div>

      <div style={{ padding: "20px 48px 36px", borderTop: "1px solid #1e1e3a", textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "#334155", letterSpacing: 1, fontFamily: "monospace" }}>
          BASÉ SUR DES DONNÉES SCIENTIFIQUES PEER-REVIEWED · NIH/NIDA · WHO · Kloner et al., JACC
        </div>
      </div>
    </div>
  );
}
