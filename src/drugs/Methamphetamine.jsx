import { useState } from "react";
import { useWidth, SectionTitle, Card } from "../shared";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";

const COLOR = "#06b6d4";

const dopamineData = [
  { time: "Baseline", normal: 100, drug: 100 },
  { time: "1h (peak)", normal: 100, drug: 900 },
  { time: "4h", normal: 100, drug: 650 },
  { time: "8h", normal: 100, drug: 400 },
  { time: "16h", normal: 100, drug: 200 },
  { time: "24h", normal: 100, drug: 38 },
  { time: "72h", normal: 100, drug: 30 },
  { time: "1 sem", normal: 100, drug: 45 },
  { time: "1 mois", normal: 100, drug: 60 },
  { time: "6 mois", normal: 100, drug: 78 },
  { time: "1 an", normal: 100, drug: 88 },
  { time: "2 ans", normal: 100, drug: 95 },
];

const brainDamageData = [
  { region: "NAcc", normal: 100, meth6m: 72, meth2ans: 88 },
  { region: "CPF", normal: 100, meth6m: 65, meth2ans: 80 },
  { region: "Striatum", normal: 100, meth6m: 68, meth2ans: 84 },
  { region: "Hippocampe", normal: 100, meth6m: 70, meth2ans: 85 },
  { region: "Amygdale", normal: 100, meth6m: 75, meth2ans: 90 },
];

const systems = [
  {
    icon: "🧠", title: "Cerveau & Neurotoxicité", color: "#06b6d4",
    impacts: [
      { label: "Dopamine (DAT)", value: "+900% pic", desc: "La meth inverse le transporteur DAT — au lieu de recapter la dopamine, il la pompe dans la synapse. +900% au nucleus accumbens. 3-5× plus que la cocaïne." },
      { label: "Terminaisons DAT", value: "Détruites", desc: "Contrairement à la cocaïne, la meth détruit physiquement les terminaisons dopaminergiques. Neurotoxicité permanente mesurable en imagerie." },
      { label: "SERT (sérotonine)", value: "Détruit", desc: "Les axones sérotoninergiques sont aussi détruits. Dépression profonde et chronique post-usage." },
      { label: "Cortex préfrontal", value: "Atrophie", desc: "Réduction du volume gris mesurable. Impulsivité, mauvaise décision, contrôle émotionnel aboli." },
      { label: "Psychose meth-induite", value: "Possible", desc: "Psychose paranoïde avec hallucinations — peut persister des semaines après l'arrêt. Indistinguable de la schizophrénie en aigu." },
    ]
  },
  {
    icon: "❤️", title: "Cœur & Vaisseaux", color: "#f87171",
    impacts: [
      { label: "Tachycardie", value: "+80-120 bpm", desc: "Noradrénaline ↑↑ → activation sympathique maximale. Cœur peut atteindre 180-200 bpm dans les cas sévères." },
      { label: "Hypertension sévère", value: "↑↑↑", desc: "Vasospasme généralisé + tachycardie → risque d'AVC hémorragique, même chez les jeunes." },
      { label: "Cardiomyopathie", value: "Chronique", desc: "Cardiotoxicité directe + adrénaline chronique → inflammation du muscle cardiaque, insuffisance cardiaque." },
      { label: "Mort subite", value: "Risque élevé", desc: "Surtout lors des 'binges' ou avec chaleur/effort. Hyperthermie + arythmie = combinaison fatale." },
      { label: "Artériosclérose accélérée", value: "Chronique", desc: "Usage chronique → vieillissement cardiovasculaire accéléré de 10-15 ans." },
    ]
  },
  {
    icon: "🌡️", title: "Température & Métabolisme", color: "#fb923c",
    impacts: [
      { label: "Hyperthermie", value: "Jusqu'à 42°C", desc: "Mécanisme triple : activation sympathique + inhibition transpiration + activité physique intense. 40°C+ = urgence vitale." },
      { label: "Rhabdomyolyse", value: "Risque", desc: "Hyperthermie + activité intense → destruction des fibres musculaires → toxines dans les reins → insuffisance rénale aiguë." },
      { label: "Anorexie", value: "Sévère", desc: "La meth supprime l'appétit pendant 24-48h. Usagers chroniques perdent 20-40% du poids corporel." },
      { label: "Déshydratation", value: "Sévère", desc: "Transpiration + déficit d'apport hydrique + durée longue du high (24h) → déshydratation profonde." },
      { label: "Cicatrisation altérée", value: "↓↓", desc: "Vasoconstriction chronique + malnutrition → cicatrisation très ralentie, plaies qui s'infectent facilement." },
    ]
  },
  {
    icon: "🦷", title: "Bouche & Peau", color: "#a855f7",
    impacts: [
      { label: "Meth Mouth", value: "Destruction dentaire", desc: "Bouche sèche (xérostomie) + bruxisme + acidité + négligence d'hygiène → destruction totale de la dentition en 1-2 ans." },
      { label: "Bruxisme sévère", value: "Chronique", desc: "Tensions massétériques extrêmes → dents cassées, mâchoire douloureuse, usure totale de l'émail." },
      { label: "Xérostomie", value: "Bouche sèche", desc: "La salive protège les dents. La meth supprime la salivation → acidité constante → caries généralisées." },
      { label: "Lésions cutanées", value: "Formication", desc: "Hallucinations tactiles ('cokebug', 'meth mites') → grattage obsessionnel → plaies, cicatrices, infections." },
      { label: "Vieillissement accéléré", value: "Visible", desc: "Malnutrition + stress oxydatif + vasoconstriction + déshydratation → vieillissement cutané de 10-20 ans en quelques années." },
    ]
  },
];

const timeline = [
  { day: "Usage", icon: "⚡", color: "#06b6d4", phase: "Intoxication (8-24h)", items: ["Rush euphorique intense — confiance, énergie maximale", "Hyperactivité, insomnie totale, anorexie", "Tachycardie, hypertension, hyperthermie", "Grandiosité, hypersexualité possible", "Durée : 8 à 24 heures (vs 45 min cocaine)"] },
  { day: "24-72h", icon: "💀", color: "#ef4444", phase: "Crash sévère", items: ["Effondrement dopamine sous 30% de baseline", "Hypersomnie massive (20-30h de sommeil)", "Dépression profonde, anhedonia totale", "Faim intense après jours sans manger", "Paranoïa et hallucinations résiduelles"] },
  { day: "1-2 sem", icon: "😤", color: "#a855f7", phase: "PAWS précoce", items: ["Craving intense — réveils avec envie de meth", "Dépression persistante", "Insomnie, anxiété", "Difficultés cognitives marquées", "Risque de rechute très élevé"] },
  { day: "1-6 mois", icon: "🌥️", color: "#6366f1", phase: "Récupération neurologique", items: ["Dopamine qui remonte progressivement", "Fonctions cognitives partiellement restaurées", "Humeur plus stable mais plaisirs naturels réduits", "Cerveau en réparation — imagerie mesurable", "Exercice physique accélère la récupération"] },
  { day: "6-24 mois", icon: "🌤️", color: "#22d3ee", phase: "Réparation avancée", items: ["Terminaisons dopaminergiques en reconstruction", "Mémoire et concentration améliorées", "Plaisirs naturels qui reviennent", "Réduction de l'anhedonia", "Récupération cognitive substantielle"] },
  { day: "2 ans+", icon: "🌱", color: "#22c55e", phase: "Récupération complète", items: ["Circuits dopamine proches de la normale", "Fonctions cognitives normalisées", "Vie émotionnelle et sociale reconstruite", "Certaines lésions peuvent être permanentes", "Récupération possible avec abstinence prolongée"] },
];

const stopBenefits = [
  { period: "24-72h", color: "#ef4444", benefits: ["Crash sévère — le plus difficile", "Corps en détox extrême"] },
  { period: "1-2 semaines", color: "#f97316", benefits: ["Sommeil récupérateur (excessif)", "Paramètres cardio normalisés", "Appétit et poids commencent à revenir"] },
  { period: "1-3 mois", color: "#fbbf24", benefits: ["Dopamine en reconstruction active", "Humeur plus stable", "Fonctions cognitives qui reviennent"] },
  { period: "6 mois - 1 an", color: "#84cc16", benefits: ["Récupération neurologique mesurable en imagerie", "Plaisirs naturels restaurés", "Mémoire et concentration améliorées"] },
  { period: "1-2 ans", color: "#22c55e", benefits: ["Circuits dopamine proches de la normale", "Récupération fonctionnelle complète", "Transformation physique visible"] },
];

const NAV = [
  { id: "overview", label: "Présentation" },
  { id: "immediate", label: "Effets immédiats" },
  { id: "systems", label: "Systèmes affectés" },
  { id: "timeline", label: "Timeline" },
  { id: "hormones", label: "Neurochimie" },
  { id: "risks", label: "Neurotoxicité" },
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

function Overview({ desk }) {
  return (
    <div>
      <SectionTitle color={COLOR}>Présentation</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 24, marginBottom: 24 }}>
        <div style={{ background: "#000c14", border: `1px solid ${COLOR}33`, borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 11, color: COLOR, letterSpacing: 2, fontFamily: "monospace", marginBottom: 16 }}>PROFIL PHARMACOLOGIQUE</div>
          {[
            { label: "Classe", value: "Amphétamine substituée — stimulant puissant" },
            { label: "Mécanisme", value: "Inversion DAT/NET/SERT + inhibition MAO" },
            { label: "Vs Cocaïne", value: "3-5× plus dopaminergique, 10-15× plus longue" },
            { label: "Durée du high", value: "8 à 24 heures selon la dose/voie" },
            { label: "Spécificité", value: "Neurotoxicité directe des terminaisons DA/5-HT" },
            { label: "Demi-vie", value: "10-12 heures (vs 1h cocaïne)" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, paddingBottom: 10, borderBottom: i < 5 ? `1px solid ${COLOR}22` : "none" }}>
              <span style={{ fontSize: 12, color: "#64748b", flexShrink: 0, width: "35%" }}>{item.label}</span>
              <span style={{ fontSize: 12, color: "#e2e8f0", textAlign: "right" }}>{item.value}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { val: "+900%", label: "Dopamine pic", sub: "vs +280% pour la cocaïne", color: COLOR },
            { val: "8-24h", label: "Durée du high", sub: "vs 45 min pour la cocaïne", color: "#60a5fa" },
            { val: "Visible", label: "Dommages cérébraux", sub: "mesurables en IRM", color: "#ef4444" },
            { val: "42°C", label: "Hyperthermie max", sub: "risque vital", color: "#f97316" },
            { val: "Meth Mouth", label: "Destruction dentaire", sub: "1-2 ans d'usage", color: "#fb923c" },
            { val: "2 ans", label: "Récupération", sub: "avec abstinence totale", color: "#22c55e" },
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
        <div style={{ fontSize: 11, color: COLOR, letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>DIFFÉRENCE FONDAMENTALE — METH VS COCAÏNE</div>
        <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr" : "1fr", gap: 14 }}>
          {[
            { title: "Mécanisme inversé", desc: "La cocaïne bloque le recaptage de la dopamine. La meth inverse le transporteur — il pompe activement la dopamine vers l'extérieur. Résultat : 3-5× plus dopaminergique." },
            { title: "Dommages permanents", desc: "La cocaïne n'est pas neurotoxique directe. La meth détruit physiquement les terminaisons des neurones dopaminergiques et sérotoninergiques. Mesurable en IRM." },
            { title: "Le piège de la durée", desc: "24h de high semble avantageux — mais cela signifie 24h d'exposition au stress cardiovasculaire, 24h d'anorexie, 24h d'insomnie. Le crash est proportionnellement plus sévère." },
          ].map((m, i) => (
            <div key={i} style={{ background: "#060610", borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 12, color: COLOR, marginBottom: 6, fontWeight: "bold" }}>{m.title}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{m.desc}</div>
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
      <SectionTitle color={COLOR}>Effets immédiats — 24h d'intoxication</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 14 }}>
        {[
          { time: "0–30 min", color: COLOR, icon: "⚡", title: "Rush initial", events: ["Euphorie explosive — confiance absolue", "Énergie apparemment illimitée", "Appétit complètement supprimé", "Hyperactivité physique et mentale", "Tachycardie, hypertension, mydriase"] },
          { time: "2–8h", color: "#22d3ee", icon: "🚀", title: "Plateau stimulant", events: ["Énergie, productivité, concentration extrêmes", "Insomnie totale et inconfortable", "Hypersexualité, confiance sociale", "Grandiosité, idées qui s'enchaînent", "Possible début de paranoïa légère"] },
          { time: "8–16h", color: "#6366f1", icon: "🌀", title: "Stimulation prolongée", events: ["High toujours présent mais moins intense", "Début d'anxiété et d'irritabilité", "Possible paranoïa modérée", "Corps épuisé mais cerveau hyperactif", "Bouche sèche, douleurs musculaires"] },
          { time: "16–24h", color: "#a855f7", icon: "😰", title: "Descente tardive", events: ["Pensées désorganisées, confusion", "Paranoïa et méfiance intenses", "Possible psychose brève", "Corps au bord de l'effondrement", "Hyperthermie résiduelle"] },
          { time: "24–72h", color: "#ef4444", icon: "💥", title: "Crash", events: ["Effondrement total — hypersomnie 20-30h", "Dépression profonde, anhedonia", "Faim intense après jours sans manger", "Paranoïa et hallucinations résiduelles", "Dopamine à 30% de baseline — tout est vide"] },
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

      <div style={{ fontSize: 11, color: COLOR, letterSpacing: 3, fontFamily: "monospace", marginBottom: 16, paddingBottom: 8, borderBottom: `1px solid ${COLOR}22` }}>PARTIE 1 — EFFETS ACTIFS (24h)</div>

      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: COLOR, letterSpacing: 2, fontFamily: "monospace", marginBottom: 6 }}>DOPAMINE — USAGE METH ET RÉCUPÉRATION SUR 2 ANS</div>
        <div style={{ fontSize: 11, color: "#475569", marginBottom: 14, lineHeight: 1.5 }}>Pic à +900% (vs +280% cocaïne), crash sous 30%, récupération lente sur 1-2 ans.</div>
        <Card color={COLOR}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dopamineData} margin={{ top: 10, right: 10, bottom: 5, left: -10 }}>
              <defs>
                <linearGradient id="mth-normalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="mth-drugGrad" x1="0" y1="0" x2="0" y2="1">
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
              <Area type="monotone" dataKey="normal" stroke="#22c55e" fill="url(#mth-normalGrad)" strokeWidth={2} name="Baseline saine" dot={false} />
              <Area type="monotone" dataKey="drug" stroke={COLOR} fill="url(#mth-drugGrad)" strokeWidth={2} name="Post-méthamphétamine" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ fontSize: 11, color: "#22c55e", letterSpacing: 3, fontFamily: "monospace", marginBottom: 16, marginTop: 8, paddingBottom: 8, borderBottom: "1px solid #22c55e22" }}>PARTIE 2 — ARRÊT & RÉCUPÉRATION (jusqu'à 2 ans)</div>

      <div>
        <div style={{ fontSize: 11, color: "#ef4444", letterSpacing: 2, fontFamily: "monospace", marginBottom: 6 }}>RÉCUPÉRATION CÉRÉBRALE — DENSITÉ DAT PAR RÉGION (%)</div>
        <div style={{ fontSize: 11, color: "#475569", marginBottom: 14, lineHeight: 1.5 }}>Dommages mesurables en IRM (PET scan). Récupération substantielle possible à 2 ans d'abstinence.</div>
        <Card color="#ef4444">
          {brainDamageData.map((region, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6, fontWeight: "bold" }}>{region.region}</div>
              <div style={{ display: "flex", gap: 6, marginBottom: 3 }}>
                <div style={{ width: 80, fontSize: 10, color: "#475569" }}>Normal</div>
                <div style={{ flex: 1, height: 8, background: "#1e1e3a", borderRadius: 4 }}>
                  <div style={{ width: `${region.normal}%`, height: "100%", background: "#22c55e", borderRadius: 4 }} />
                </div>
                <div style={{ width: 35, fontSize: 10, color: "#22c55e", textAlign: "right" }}>{region.normal}%</div>
              </div>
              <div style={{ display: "flex", gap: 6, marginBottom: 3 }}>
                <div style={{ width: 80, fontSize: 10, color: "#475569" }}>6 mois arrêt</div>
                <div style={{ flex: 1, height: 8, background: "#1e1e3a", borderRadius: 4 }}>
                  <div style={{ width: `${region.meth6m}%`, height: "100%", background: "#f97316", borderRadius: 4 }} />
                </div>
                <div style={{ width: 35, fontSize: 10, color: "#f97316", textAlign: "right" }}>{region.meth6m}%</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <div style={{ width: 80, fontSize: 10, color: "#475569" }}>2 ans arrêt</div>
                <div style={{ flex: 1, height: 8, background: "#1e1e3a", borderRadius: 4 }}>
                  <div style={{ width: `${region.meth2ans}%`, height: "100%", background: COLOR, borderRadius: 4 }} />
                </div>
                <div style={{ width: 35, fontSize: 10, color: COLOR, textAlign: "right" }}>{region.meth2ans}%</div>
              </div>
            </div>
          ))}
          <div style={{ fontSize: 10, color: "#475569", fontStyle: "italic", marginTop: 8 }}>Source : Volkow et al., Journal of Neuroscience. La récupération est réelle mais partielle à 2 ans.</div>
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
      <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>TABLEAU HORMONAL — USAGE METH</div>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr" : "1fr", gap: 10, marginBottom: 24 }}>
        {[
          { hormone: "Dopamine", effet: "+900% pic", duree: "8-24h puis crash 30%", impact: "Euphorie extrême puis dépression prolongée, anhedonia", color: COLOR },
          { hormone: "Noradrénaline", effet: "↑↑↑↑", duree: "Usage", impact: "Tachycardie, HTA sévère, hyperthermie, vigilance extrême", color: "#f87171" },
          { hormone: "Sérotonine", effet: "↑ puis détruite", duree: "Chronique", impact: "Axones SERT détruits → dépression chronique post-usage", color: "#818cf8" },
          { hormone: "Cortisol", effet: "↑↑↑", duree: "Usage + crash", impact: "Immunodépression, inflammation, stockage graisseux abdominal", color: "#ef4444" },
          { hormone: "Testostérone", effet: "↓↓ chronique", duree: "Usage régulier", impact: "Hypogonadisme, fonte musculaire, malgré apparence d'énergie", color: "#fb923c" },
          { hormone: "Mélatonine", effet: "Supprimée", duree: "Usage (24h+)", impact: "Insomnie totale pendant le high — dette de sommeil massive", color: "#6366f1" },
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
      <SectionTitle color={COLOR}>Neurotoxicité — dommages cérébraux mesurables</SectionTitle>
      <div style={{ background: "#001018", border: `2px solid ${COLOR}66`, borderRadius: 14, padding: 20, marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: COLOR, fontWeight: "bold", marginBottom: 8 }}>Ce que les IRM révèlent</div>
        <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>Des études de neuroimagerie (PET scan) ont montré chez les usagers de meth chroniques : réduction de 20-30% des terminaisons DAT dans le striatum, atrophie du cortex préfrontal, réduction volume hippocampe. Ces dommages sont partiellement réversibles après 2+ ans d'abstinence.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 20 }}>
        <div>
          <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>MÉCANISMES DE NEUROTOXICITÉ</div>
          {[
            { num: "01", color: COLOR, title: "Stress oxydatif massif", desc: "La libération excessive de dopamine génère des radicaux libres lors de son oxydation. Ces radicaux détruisent directement les terminaisons nerveuses." },
            { num: "02", color: "#f97316", title: "Excitotoxicité glutamatergique", desc: "Dopamine ↑↑ → activation glutamate → suractivation récepteurs NMDA → influx calcium → mort cellulaire." },
            { num: "03", color: "#a855f7", title: "Hyperthermie neurologique", desc: "La temperature corporelle de 40-42°C est directement neurotoxique. Le cerveau est particulièrement sensible à la chaleur." },
            { num: "04", color: "#ef4444", title: "Mitochondries dysfonctionnelles", desc: "Stress oxydatif chronique → dysfonction mitochondriale → mort cellulaire programmée dans les zones dopaminergiques." },
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
          <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>CONSÉQUENCES COGNITIVES</div>
          {[
            { func: "Mémoire de travail", impact: "−35%", color: "#ef4444", desc: "Incapacité à maintenir l'information active, planification altérée" },
            { func: "Attention", impact: "−28%", color: "#f97316", desc: "Distraction, incapacité à se concentrer sur une tâche" },
            { func: "Contrôle inhibiteur", impact: "−40%", color: "#fbbf24", desc: "Impulsivité, incapacité à résister aux urgences" },
            { func: "Prise de décision", impact: "−32%", color: "#a855f7", desc: "Choix irrationnels, vision à court terme pathologique" },
            { func: "Vitesse de traitement", impact: "−25%", color: "#6366f1", desc: "Pensée ralentie, temps de réaction allongé" },
            { func: "Mémoire épisodique", impact: "−30%", color: "#22d3ee", desc: "Souvenirs des événements récents altérés" },
          ].map((item, i) => (
            <div key={i} style={{ background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 10, padding: 12, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: "bold", color: "#e2e8f0" }}>{item.func}</span>
                <span style={{ fontSize: 13, fontFamily: "monospace", color: item.color, fontWeight: "bold" }}>{item.impact}</span>
              </div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{item.desc}</div>
            </div>
          ))}
          <Card color="#22c55e">
            <div style={{ fontSize: 11, color: "#22c55e", fontWeight: "bold", marginBottom: 6 }}>La récupération est réelle</div>
            <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.6 }}>Avec 1-2 ans d'abstinence, les études montrent une récupération substantielle des fonctions cognitives et des circuits dopaminergiques. Le cerveau se répare — mais le temps est essentiel.</div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Safety({ desk }) {
  return (
    <div>
      <SectionTitle color={COLOR}>Sécurité — récupération & protocoles</SectionTitle>
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
          <div style={{ fontSize: 11, color: "#475569", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>PROTOCOLES DE RÉCUPÉRATION</div>
          {[
            { icon: "🏃", tip: "Exercice physique — neuroprotecteur", desc: "L'exercice stimule le BDNF (Brain-Derived Neurotrophic Factor) — facteur de croissance neuronale. Accélère la reconstruction des circuits DA." },
            { icon: "🥦", tip: "Antioxydants alimentaires", desc: "Fruits, légumes, oméga-3 — combattent le stress oxydatif résiduel. Nutrition essentielle après malnutrition prolongée." },
            { icon: "😴", tip: "Hygiène du sommeil rigoureuse", desc: "Le sommeil est quand le cerveau se répare. Heures fixes, éviter caféine et écrans. Le sommeil profond reconstruit les circuits DA." },
            { icon: "🧠", tip: "TCC + Contingency Management", desc: "Les récompenses concrètes pour l'abstinence sont très efficaces pour la meth. La TCC modifie les patterns de pensée addictifs." },
            { icon: "🏥", tip: "Suivi neuropsychologique", desc: "Les déficits cognitifs peuvent affecter la capacité à suivre un traitement. Un suivi adapté améliore les résultats." },
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
    { authors: "Zhang Y et al.", title: "Neurotoxicity mechanisms and clinical implications of six common recreational drugs", journal: "Frontiers in Pharmacology", year: "2025", url: "https://www.frontiersin.org/journals/pharmacology/articles/10.3389/fphar.2025.1526270/full" },
    { authors: "Berman S et al.", title: "Brain dysfunctions and neurotoxicity induced by methamphetamine", journal: "Neural Regeneration Research", year: "2024", url: "https://journals.lww.com/nrronline/fulltext/2024/09000/brain_dysfunctions_and_neurotoxicity_induced_by.18.aspx" },
    { authors: "Moszczynska A.", title: "Neurobiology and Clinical Manifestations of Methamphetamine Neurotoxicity", journal: "Psychiatric Times", year: "2021", url: "https://www.psychiatrictimes.com/view/neurobiology-and-clinical-manifestations-methamphetamine-neurotoxicity" },
    { authors: "NIDA", title: "Methamphetamine DrugFacts — Mechanism and effects", journal: "National Institute on Drug Abuse", year: "2025", url: "https://nida.nih.gov/publications/drugfacts/methamphetamine" },
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

export default function Methamphetamine({ onBack }) {
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
        background: "linear-gradient(180deg, #000c14 0%, #060610 100%)",
        padding: desk ? "48px 48px 36px" : "28px 20px 20px",
        borderBottom: "1px solid #0c1f2e",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, #06b6d418 0%, transparent 70%)" }} />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid #0c1f2e", borderRadius: 8, color: "#64748b", padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "monospace", marginBottom: 16 }}>
            ← Retour
          </button>
          <div style={{ display: "inline-block", background: COLOR + "22", border: `1px solid ${COLOR}44`, borderRadius: 20, padding: "4px 14px", fontSize: 11, color: COLOR, fontFamily: "monospace", letterSpacing: 1, marginBottom: 12 }}>
            STIMULANT NEUROTOXIQUE · #4 OMS · 33/100
          </div>
          <h1 style={{
            fontSize: desk ? 38 : 26, fontWeight: "bold", margin: "0 0 10px", lineHeight: 1.2,
            background: `linear-gradient(135deg, #fff 40%, ${COLOR})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            🧪 Méthamphétamine
          </h1>
          <p style={{ fontSize: desk ? 15 : 13, color: "#64748b", margin: "0 0 20px", lineHeight: 1.7, maxWidth: 600 }}>
            3-5× plus puissante que la cocaïne, high de 24h, et destruction neuronale permanente mesurable en IRM.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { label: "+900% dopamine", color: COLOR },
              { label: "High 24 heures", color: "#60a5fa" },
              { label: "Neurotoxique direct", color: "#ef4444" },
              { label: "Meth Mouth", color: "#a855f7" },
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
          BASÉ SUR DES DONNÉES SCIENTIFIQUES PEER-REVIEWED · Volkow et al., J. Neuroscience · NIH/NIDA · WHO
        </div>
      </div>
    </div>
  );
}
