import { useState } from "react";
import { useWidth, SectionTitle, Card } from "../shared";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";

const COLOR = "#14b8a6";

// LSD timeline — 12h+ duration, 5-HT2A activation + noradrénaline
const lsdTimeline = [
  { time: "0h", activation: 100, perception: 100, norad: 100 },
  { time: "0.5h", activation: 150, perception: 130, norad: 160 },
  { time: "1h", activation: 280, perception: 260, norad: 240 },
  { time: "2h", activation: 450, perception: 500, norad: 320 },
  { time: "3h", activation: 520, perception: 580, norad: 350 },
  { time: "4h", activation: 510, perception: 570, norad: 340 },
  { time: "5h", activation: 480, perception: 540, norad: 310 },
  { time: "6h", activation: 420, perception: 460, norad: 270 },
  { time: "8h", activation: 300, perception: 320, norad: 200 },
  { time: "10h", activation: 190, perception: 200, norad: 150 },
  { time: "12h", activation: 130, perception: 140, norad: 120 },
  { time: "14h", activation: 105, perception: 108, norad: 105 },
  { time: "16h", activation: 100, perception: 100, norad: 100 },
];

// LSD vs Psilocybine comparison data
const compareData = [
  { param: "Durée", lsd: 100, psilo: 50 },
  { param: "Puissance dose", lsd: 100, psilo: 20 },
  { param: "Stimulation", lsd: 90, psilo: 40 },
  { param: "Visuels", lsd: 95, psilo: 80 },
  { param: "Bodily load", lsd: 75, psilo: 55 },
  { param: "Introspection", lsd: 70, psilo: 95 },
  { param: "Risque HPPD", lsd: 70, psilo: 30 },
];

// Tolérance croisée
const toleranceData = [
  { day: "J0 (prise)", tolerance: 100 },
  { day: "J1", tolerance: 85 },
  { day: "J2", tolerance: 60 },
  { day: "J3", tolerance: 40 },
  { day: "J5", tolerance: 20 },
  { day: "J7", tolerance: 8 },
  { day: "J10", tolerance: 2 },
  { day: "J14", tolerance: 0 },
];

const NAV = [
  { id: "overview", label: "Présentation" },
  { id: "immediate", label: "Effets immédiats" },
  { id: "systems", label: "Systèmes affectés" },
  { id: "timeline", label: "Timeline 16h" },
  { id: "hormones", label: "Neurochimie" },
  { id: "badtrip", label: "Bad trip" },
  { id: "stop", label: "Sécurité" },
];

function LSDTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0d0d1a", border: `1px solid ${COLOR}33`, borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      <div style={{ color: "#94a3b8", marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color }}>{p.name}: {p.value}%</div>
      ))}
    </div>
  );
}

function TolTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0d0d1a", border: `1px solid ${COLOR}33`, borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      <div style={{ color: "#94a3b8", marginBottom: 6 }}>{label}</div>
      <div style={{ color: COLOR }}>Tolérance résiduelle: {payload[0]?.value}%</div>
    </div>
  );
}

export default function LSD({ onBack }) {
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
      case "badtrip": return <BadTrip desk={desk} />;
      case "stop": return <Safety desk={desk} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060610", fontFamily: "'Georgia','Times New Roman',serif", color: "#e2e8f0" }}>
      <div style={{
        background: "linear-gradient(180deg, #001a18 0%, #060610 100%)",
        padding: desk ? "40px 48px 32px" : "24px 20px 20px",
        borderBottom: "1px solid #1e1e3a",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${COLOR}15 0%, transparent 70%)` }} />
        <button onClick={onBack} style={{
          background: "none", border: "1px solid #1e1e3a", borderRadius: 8,
          color: "#64748b", cursor: "pointer", padding: "6px 14px", fontSize: 12,
          fontFamily: "monospace", marginBottom: 20, display: "flex", alignItems: "center", gap: 6,
        }}>← Retour</button>
        <div style={{ maxWidth: 800, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <span style={{ fontSize: 42 }}>🌀</span>
            <div>
              <div style={{ fontSize: 10, color: COLOR, letterSpacing: 4, fontFamily: "monospace", marginBottom: 4 }}>PSYCHÉDÉLIQUE · SEMI-SYNTHÉTIQUE · AGONISTE 5-HT2A</div>
              <h1 style={{ fontSize: desk ? 32 : 22, fontWeight: "bold", color: "#e2e8f0", margin: 0 }}>LSD-25</h1>
            </div>
          </div>
          <p style={{ color: "#94a3b8", fontSize: desk ? 14 : 12, lineHeight: 1.7, maxWidth: 620, margin: "0 0 16px" }}>
            Diéthylamide de l'acide lysergique — synthétisé par Albert Hofmann en 1938 chez Sandoz.
            L'un des composés psychoactifs les plus puissants jamais découverts : actif dès <strong style={{ color: "#e2e8f0" }}>25–50 microgrammes</strong>.
            Duration 8–16h, profil pharmacologique similaire à la psilocybine mais plus stimulant et prolongé.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[
              { label: "Dose active", val: "50–200 µg" },
              { label: "Durée trip", val: "8–16 heures" },
              { label: "Dépendance physique", val: "Nulle" },
              { label: "Demi-vie", val: "3.6h (psilocine: 2h)" },
            ].map((item) => (
              <div key={item.label} style={{ background: COLOR + "15", border: `1px solid ${COLOR}33`, borderRadius: 8, padding: "6px 14px" }}>
                <div style={{ fontSize: 10, color: "#64748b", fontFamily: "monospace" }}>{item.label}</div>
                <div style={{ fontSize: 13, color: COLOR, fontWeight: "bold" }}>{item.val}</div>
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

      <div style={{ maxWidth: 900, margin: "0 auto", padding: desk ? "36px 48px 60px" : "24px 16px 40px" }}>
        {renderSection()}
      </div>
    </div>
  );
}

function Overview({ desk }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle color={COLOR}>Qu'est-ce que le LSD ?</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
        <Card color={COLOR}>
          <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>DÉCOUVERTE & HISTOIRE</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { year: "1938", fact: "Hofmann synthétise le LSD-25 chez Sandoz Laboratories" },
              { year: "1943", fact: "Hofmann découvre accidentellement les effets psychédéliques ('Bicycle Day', 19 avril)" },
              { year: "1950s–60s", fact: "Sandoz distribue le Delysid® aux psychiatres — 40 000+ études publiées" },
              { year: "1968–71", fact: "Interdiction mondiale — Schedule I USA, conventions ONU" },
              { year: "2000s+", fact: "Renaissance de la recherche : Johns Hopkins, Imperial College, NYU" },
            ].map((e) => (
              <div key={e.year} style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 50, fontSize: 11, color: COLOR, fontFamily: "monospace", flexShrink: 0 }}>{e.year}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{e.fact}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card color={COLOR}>
          <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>MÉCANISME D'ACTION</div>
          <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: "0 0 12px" }}>
            Le LSD est un <strong style={{ color: "#e2e8f0" }}>agoniste partiel puissant des récepteurs 5-HT2A et 5-HT2C</strong>.
            Sa particularité : il se lie aux récepteurs sérotoninergiques comme un "couvercle" —
            les études cryo-EM 2017 (Nature) ont montré qu'un capuchon protéique emprisonne
            la molécule dans le récepteur, expliquant la durée d'action exceptionnellement longue.
          </p>
          <div style={{ background: "#060610", borderRadius: 8, padding: "10px 14px", border: `1px solid ${COLOR}22` }}>
            <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace", marginBottom: 4 }}>AFFINITÉ RÉCEPTEURS</div>
            <div style={{ fontSize: 12, color: "#e2e8f0" }}>5-HT2A {'>'} 5-HT2C {'>'} D1/D2 {'>'} α-adrénergiques {'>'} histamine H1</div>
          </div>
        </Card>
      </div>
      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>LSD vs PSILOCYBINE — COMPARAISON SUBJECTIVE</div>
        <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr" : "1fr", gap: 10 }}>
          {[
            { param: "Durée", lsd: "8–16h", psilo: "4–6h", avantage: "psilocybine" },
            { param: "Dose active", lsd: "50–200 µg", psilo: "1–4g sec", avantage: "neutre" },
            { param: "Composante stimulante", lsd: "Marquée (noradrénaline)", psilo: "Faible", avantage: "contexte" },
            { param: "Introspection", lsd: "Modérée", psilo: "Très marquée", avantage: "psilocybine" },
            { param: "HPPD risque", lsd: "Plus élevé", psilo: "Rare", avantage: "psilocybine" },
            { param: "Neurotoxicité", lsd: "Non documentée", psilo: "Non documentée", avantage: "égal" },
          ].map((row) => (
            <div key={row.param} style={{ background: "#060610", borderRadius: 8, padding: "10px 12px", border: "1px solid #1e1e3a" }}>
              <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace", marginBottom: 6 }}>{row.param}</div>
              <div style={{ fontSize: 12, color: COLOR }}>LSD: {row.lsd}</div>
              <div style={{ fontSize: 12, color: "#9333ea" }}>Psilocybine: {row.psilo}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Immediate({ desk }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle color={COLOR}>Effets immédiats — 16h de voyage</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
        {[
          {
            title: "0–1h · Onset",
            items: [
              "Légère anxiété, fourmillements",
              "Premiers changements visuels (halos, brillance)",
              "Nausées rares (moins qu'avec champignons)",
              "Pupilles très dilatées (mydriase intense)",
              "Élévation de la fréquence cardiaque",
            ],
          },
          {
            title: "1–4h · Montée & Pic",
            items: [
              "Hallucinations visuelles riches et géométriques",
              "Synesthésie prononcée (sons = formes = couleurs)",
              "Pensées qui s'emballent ou s'ouvrent infiniment",
              "Dissolution de l'ego (hautes doses)",
              "Expériences de déjà-vu et confusion temporelle",
            ],
          },
          {
            title: "4–8h · Plateau",
            items: [
              "Plateau très long — caractéristique du LSD",
              "Stimulation physique persistante (mandibules, tremblements)",
              "Exploration mentale continue",
              "Rires incontrôlables ou larmes émotionnelles",
              "Hypersensibilité à la musique (très intense)",
            ],
          },
          {
            title: "8–16h · Descente & After",
            items: [
              "Descente très lente — encore actif à 12h",
              "Difficulté à dormir même épuisé",
              "Afterglow : clarté mentale, sérénité",
              "Lendemain : fatigue profonde",
              "Insights qui persistent des jours/semaines",
            ],
          },
        ].map((phase) => (
          <Card key={phase.title} color={COLOR}>
            <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>{phase.title}</div>
            <ul style={{ margin: 0, padding: "0 0 0 16px", display: "flex", flexDirection: "column", gap: 6 }}>
              {phase.items.map((item) => (
                <li key={item} style={{ color: "#94a3b8", fontSize: 13 }}>{item}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>LA DURÉE : PRINCIPAL DÉFI</div>
        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          Le voyage au LSD dure 2 à 3 fois plus longtemps qu'avec la psilocybine.
          Commencé à 20h, il sera encore actif à 8h du matin. Cette durée rend le LSD
          <strong style={{ color: "#e2e8f0" }}> plus difficile à gérer</strong> en cas de bad trip —
          il n'y a pas d'issue rapide. La préparation et le setting sont donc encore plus critiques.
        </p>
      </Card>
    </div>
  );
}

function Systems({ desk }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionTitle color={COLOR}>Systèmes biologiques affectés</SectionTitle>
      {[
        {
          system: "Récepteurs 5-HT2A — Cortex",
          icon: "🧠",
          detail: "Activation des récepteurs 5-HT2A cortical avec un mécanisme unique : la molécule de LSD est piégée dans le récepteur par un capuchon protéique (lid extracellulaire), expliquant sa durée d'action de 8–16h. L'entropie neurale augmente massivement — le cerveau génère des connexions inédites entre régions normalement disjointes.",
          stats: [
            { label: "Affinité Ki 5-HT2A", val: "~1.5 nM" },
            { label: "Entropie neurale", val: "+200–300%" },
            { label: "DMN suppression", val: "−50 à −65%" },
          ],
        },
        {
          system: "Système noradrénergique",
          icon: "⚡",
          detail: "Le LSD active les récepteurs α1 adrénergiques et les neurones du locus coeruleus — d'où sa composante stimulante plus marquée que la psilocybine. Cela explique la tachycardie, la mydriase intense, la tension musculaire (mâchoires) et la difficulté à dormir même 12h après la prise.",
          stats: [
            { label: "Tachycardie", val: "+15–30 bpm" },
            { label: "TA systolique", val: "+15–25 mmHg" },
            { label: "Mydriase", val: "Très prononcée" },
          ],
        },
        {
          system: "Récepteurs dopaminergiques",
          icon: "💫",
          detail: "Le LSD se lie aussi aux récepteurs D1 et D2 avec une affinité modérée. Cela contribue aux effets euphorisants et à la pensée accélérée. C'est aussi la raison pour laquelle les antipsychotiques (bloqueurs D2) peuvent 'couper' partiellement un trip au LSD en cas d'urgence.",
          stats: [
            { label: "Affinité D1/D2", val: "Modérée" },
            { label: "Effet antipsychotique", val: "Neutralise trip" },
            { label: "Euphorie", val: "Modérée à élevée" },
          ],
        },
        {
          system: "Corps & Physiologie",
          icon: "💓",
          detail: "Pas de toxicité organique documentée même à doses élevées. Les risques physiques sont indirects : accidents comportementaux, hyperthermie possible en contexte festif (effort + LSD), et hypothermie si exposé au froid sans le sentir. La mâchoire serrée (trismus) est fréquente.",
          stats: [
            { label: "Toxicité hépatique", val: "Nulle" },
            { label: "Dose létale DL50", val: "Non atteinte humain" },
            { label: "HPPD risque", val: "~1–2% usagers" },
          ],
        },
      ].map((sys) => (
        <Card key={sys.system} color={COLOR}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 22 }}>{sys.icon}</span>
            <div style={{ fontSize: 14, fontWeight: "bold", color: "#e2e8f0" }}>{sys.system}</div>
          </div>
          <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: "0 0 14px" }}>{sys.detail}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {sys.stats.map((st) => (
              <div key={st.label} style={{ background: "#060610", borderRadius: 8, padding: "6px 12px", border: `1px solid ${COLOR}22` }}>
                <div style={{ fontSize: 10, color: "#64748b", fontFamily: "monospace" }}>{st.label}</div>
                <div style={{ fontSize: 13, color: COLOR, fontWeight: "bold" }}>{st.val}</div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function Timeline({ desk }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle color={COLOR}>Timeline 16 heures</SectionTitle>
      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>ACTIVATION 5-HT2A, NORADRÉNALINE & PERCEPTION (% baseline)</div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={lsdTimeline}>
            <defs>
              <linearGradient id="lsd-actGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLOR} stopOpacity={0.4} />
                <stop offset="95%" stopColor={COLOR} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="lsd-percGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="lsd-norGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
            <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 11 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} unit="%" />
            <Tooltip content={<LSDTooltip />} />
            <ReferenceLine y={100} stroke="#334155" strokeDasharray="4 4" />
            <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
            <Area type="monotone" dataKey="activation" name="Activation 5-HT2A" stroke={COLOR} fill="url(#lsd-actGrad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="perception" name="Intensité perceptuelle" stroke="#9333ea" fill="url(#lsd-percGrad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="norad" name="Noradrénaline" stroke="#f97316" fill="url(#lsd-norGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 11, color: "#475569", textAlign: "center", marginTop: 8, fontFamily: "monospace" }}>
          Le LSD reste actif 2–3× plus longtemps que la psilocybine
        </div>
      </Card>
      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>TOLÉRANCE CROISÉE — DISPARITION POST-PRISE (% tolérance résiduelle)</div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={toleranceData}>
            <defs>
              <linearGradient id="lsd-tolGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLOR} stopOpacity={0.5} />
                <stop offset="95%" stopColor={COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
            <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} unit="%" domain={[0, 100]} />
            <Tooltip content={<TolTooltip />} />
            <Area type="monotone" dataKey="tolerance" name="Tolérance" stroke={COLOR} fill="url(#lsd-tolGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 11, color: "#475569", textAlign: "center", marginTop: 8, fontFamily: "monospace" }}>
          La tolérance disparaît en ≈ 14 jours — et s'applique aussi à la psilocybine (tolérance croisée)
        </div>
      </Card>
    </div>
  );
}

function Neurochimie({ desk }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle color={COLOR}>Neurochimie du LSD</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
        {[
          { hormone: "5-HT2A (sérotonine)", icon: "🔮", effect: "Agoniste partiel — fixation prolongée par capuchon protéique. Pas de déplétion sérotonine.", impact: "Trip 8–16h", color: COLOR },
          { hormone: "Noradrénaline (α1, β)", icon: "⚡", effect: "Activation du locus coeruleus → tachycardie, mydriase, tension musculaire, composante stimulante.", impact: "Stimulation +++ vs psilocybine", color: "#f97316" },
          { hormone: "Dopamine D1/D2", icon: "💫", effect: "Agonisme modéré → contribution euphorisante. Les antipsychotiques (D2 bloqueurs) peuvent réduire l'intensité du trip.", impact: "Euphorie modérée", color: "#22c55e" },
          { hormone: "Cortisol", icon: "🔥", effect: "Élévation pendant le trip par activation du stress physiologique et de l'éveil. Retour baseline après.", impact: "+50–90% pendant trip", color: "#eab308" },
          { hormone: "Serotonine endogène", icon: "🌊", effect: "Pas de libération ni de déplétion — agonisme direct des récepteurs sans toucher aux stocks de sérotonine.", impact: "Pas de neurotoxicité sérotoninergique", color: "#9333ea" },
          { hormone: "BDNF & Plasticité", icon: "🌱", effect: "Augmentation du BDNF similaire à la psilocybine — fenêtre de neuroplasticité post-trip exploitée en thérapie.", impact: "Neuroplasticité +", color: "#3b82f6" },
        ].map((h) => (
          <Card key={h.hormone} color={h.color}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 18 }}>{h.icon}</span>
              <div style={{ fontSize: 13, fontWeight: "bold", color: "#e2e8f0" }}>{h.hormone}</div>
            </div>
            <p style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.6, margin: "0 0 10px" }}>{h.effect}</p>
            <div style={{ background: "#060610", borderRadius: 6, padding: "6px 10px", display: "inline-block" }}>
              <span style={{ fontSize: 11, color: h.color, fontFamily: "monospace" }}>{h.impact}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function BadTrip({ desk }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle color={COLOR}>Bad trip — Comprendre & Gérer</SectionTitle>
      <div style={{ background: "#ef444410", border: "1px solid #ef444433", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, color: "#ef4444", fontFamily: "monospace", marginBottom: 8 }}>PRINCIPAL RISQUE DU LSD</div>
        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          Le bad trip n'est pas une overdose — c'est une <strong style={{ color: "#e2e8f0" }}>crise anxieuse ou psychotique aiguë</strong>
          amplifiée par l'état altéré. Il peut survenir même chez des personnes expérimentées.
          La durée du LSD (8–16h) le rend particulièrement difficile à traverser sans soutien.
          La gestion repose sur la <strong style={{ color: "#e2e8f0" }}>présence humaine, pas sur les médicaments</strong>.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
        <Card color="#ef4444">
          <div style={{ fontSize: 12, color: "#ef4444", fontFamily: "monospace", marginBottom: 10 }}>SIGNES D'UN BAD TRIP</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              "Anxiété ou terreur intense, incontrôlable",
              "Conviction d'être en train de mourir ou de devenir fou",
              "Boucles de pensées négatives qui se répètent",
              "Dissociation douloureuse, dépersonnalisation",
              "Comportement agité ou fuite vers l'extérieur",
              "Paranoïa sévère envers les personnes présentes",
            ].map((s) => (
              <div key={s} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <div style={{ color: "#ef4444", fontSize: 14, flexShrink: 0 }}>·</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{s}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card color={COLOR}>
          <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>GESTION TRIP SITTER</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { rule: "Rester calme et présent", desc: "Ne pas paniquer — votre état émotionnel est contagieux" },
              { rule: "Changer l'environnement", desc: "Musique douce, pièce différente, lumière tamisée, extérieur si sûr" },
              { rule: "Contact physique doux", desc: "Tenir la main si accepté — ancrage corporel" },
              { rule: "Rappeler que ça va passer", desc: "\"C'est la substance, ça va se terminer, tu es en sécurité\"" },
              { rule: "Benzodias en dernier recours", desc: "5–10mg diazépam oral : coupe l'anxiété sans neutraliser totalement" },
            ].map((r) => (
              <div key={r.rule} style={{ borderLeft: `2px solid ${COLOR}44`, paddingLeft: 12 }}>
                <div style={{ fontSize: 12, color: "#e2e8f0" }}>{r.rule}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>HPPD — HALLUCINOGEN PERSISTING PERCEPTION DISORDER</div>
        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: "0 0 14px" }}>
          L'HPPD est un effet secondaire rare (≈1–2% des usagers de LSD) caractérisé par
          la persistance de perturbations visuelles après la fin du trip : halos autour des lumières,
          trailing (traînées de mouvement), neige visuelle. Deux formes : <strong style={{ color: "#e2e8f0" }}>Type I</strong> (flashbacks brefs occasionnels)
          et <strong style={{ color: "#e2e8f0" }}>Type II</strong> (persistant, invalidant — traitement par lamotrigine ou clonazépam).
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {[
            { label: "Prévalence HPPD", val: "~1–2%" },
            { label: "Facteur de risque", val: "Usage fréquent, prédisposition" },
            { label: "Traitement", val: "Lamotrigine, clonazépam" },
          ].map((st) => (
            <div key={st.label} style={{ background: "#060610", borderRadius: 8, padding: "6px 12px", border: `1px solid ${COLOR}22` }}>
              <div style={{ fontSize: 10, color: "#64748b", fontFamily: "monospace" }}>{st.label}</div>
              <div style={{ fontSize: 13, color: COLOR, fontWeight: "bold" }}>{st.val}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Safety({ desk }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle color={COLOR}>Sécurité & Réduction des risques</SectionTitle>
      <div style={{ background: "#22c55e10", border: "1px solid #22c55e33", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, color: "#22c55e", fontFamily: "monospace", marginBottom: 8 }}>PAS DE DÉPENDANCE PHYSIQUE · PAS DE TOXICITÉ ORGANIQUE</div>
        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          Le LSD figure parmi les substances les moins toxiques sur le plan physiologique.
          Aucune dépendance physique, aucune neurotoxicité documentée, aucun décès par overdose directe
          répertorié dans la littérature médicale. Les décès associés au LSD sont accidentels
          (comportements à risque pendant le trip). Les risques sont réels mais d'une nature
          fondamentalement <strong style={{ color: "#e2e8f0" }}>psychologique et comportementale</strong>.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
        <Card color={COLOR}>
          <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>RÉDUCTION DES RISQUES</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { rule: "Tester la substance", desc: "Kit Ehrlich : vire au violet/bleu pour LSD (confirme alcaloïde indole)" },
              { rule: "Commencer bas", desc: "75–100 µg pour une première fois — demi-buvard si incertain" },
              { rule: "Trip sitter sobre", desc: "Indispensable, surtout pour le LSD — 16h de voyage sans filet, c'est risqué" },
              { rule: "Jour libre le lendemain", desc: "Impossible de dormir avant 14–18h après la prise" },
              { rule: "Éviter les espaces publics", desc: "Rester en cadre connu et maîtrisé" },
              { rule: "Ne pas mélanger", desc: "Lithium (convulsions), MAOIs (sérotoninergique), tramadol, stimulants" },
            ].map((r) => (
              <div key={r.rule} style={{ borderLeft: `2px solid ${COLOR}44`, paddingLeft: 12, paddingBottom: 8 }}>
                <div style={{ fontSize: 12, color: "#e2e8f0" }}>{r.rule}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card color="#ef4444">
          <div style={{ fontSize: 12, color: "#ef4444", fontFamily: "monospace", marginBottom: 10 }}>CONTRE-INDICATIONS ABSOLUES</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { ci: "Schizophrénie / psychose", why: "Décompensation sévère possible — contre-indication absolue" },
              { ci: "Trouble bipolaire type I", why: "Déclenchement d'épisode maniaque" },
              { ci: "Lithium", why: "Risque de convulsions grandement augmenté" },
              { ci: "MAOIs (dépression ancienne)", why: "Syndrome sérotoninergique" },
              { ci: "Antécédents HPPD", why: "Aggravation quasi-certaine" },
              { ci: "Grossesse", why: "Effets tératogènes inconnus, risque comportemental" },
            ].map((c) => (
              <div key={c.ci} style={{ borderLeft: "2px solid #ef444444", paddingLeft: 12 }}>
                <div style={{ fontSize: 12, color: "#e2e8f0" }}>{c.ci}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{c.why}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>RESSOURCES</div>
        <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr" : "1fr", gap: 10 }}>
          {[
            { name: "Tripsit", contact: "tripsit.me", desc: "Harm reduction, combo chart, aide en ligne" },
            { name: "MAPS", contact: "maps.org", desc: "Recherche psychédélique, ressources scientifiques" },
            { name: "Zendo Project", contact: "zendoproject.org", desc: "Soutien en cas de crise psychédélique" },
          ].map((r) => (
            <div key={r.name} style={{ background: "#060610", borderRadius: 8, padding: "12px 14px", border: `1px solid ${COLOR}22` }}>
              <div style={{ fontSize: 12, color: "#e2e8f0", fontWeight: "bold", marginBottom: 4 }}>{r.name}</div>
              <div style={{ fontSize: 11, color: COLOR, fontFamily: "monospace", marginBottom: 4 }}>{r.contact}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
