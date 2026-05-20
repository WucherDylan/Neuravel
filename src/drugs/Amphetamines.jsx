import { useState } from "react";
import { useWidth, SectionTitle, Card } from "../shared";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend, LineChart, Line,
} from "recharts";

const COLOR = "#eab308";

// Dopamine timeline — amphetamine vs meth comparison
const dopamineData = [
  { time: "0h", amp: 100, meth: 100, baseline: 100 },
  { time: "0.5h", amp: 320, meth: 500, baseline: 100 },
  { time: "1h", amp: 390, meth: 750, baseline: 100 },
  { time: "2h", amp: 420, meth: 850, baseline: 100 },
  { time: "4h", amp: 350, meth: 700, baseline: 100 },
  { time: "6h", amp: 230, meth: 500, baseline: 100 },
  { time: "8h", amp: 130, meth: 350, baseline: 100 },
  { time: "12h", amp: 80, meth: 200, baseline: 100 },
  { time: "16h", amp: 90, meth: 130, baseline: 100 },
  { time: "24h", amp: 100, meth: 100, baseline: 100 },
];

// Recovery timeline (dopamine system)
const recoveryData = [
  { month: "Sem 1", dopa: 55, energie: 40, humeur: 45 },
  { month: "Sem 2", dopa: 62, energie: 50, humeur: 52 },
  { month: "Mois 1", dopa: 70, energie: 65, humeur: 63 },
  { month: "Mois 2", dopa: 78, energie: 73, humeur: 70 },
  { month: "Mois 3", dopa: 84, energie: 80, humeur: 77 },
  { month: "Mois 6", dopa: 90, energie: 88, humeur: 85 },
  { month: "An 1", dopa: 95, energie: 94, humeur: 92 },
  { month: "An 2", dopa: 100, energie: 100, humeur: 100 },
];

// Cortisol pattern
const cortisolData = [
  { j: "Pendant", cortisol: 210 },
  { j: "J+1", cortisol: 180 },
  { j: "J+2", cortisol: 155 },
  { j: "J+3", cortisol: 135 },
  { j: "J+5", cortisol: 115 },
  { j: "J+7", cortisol: 108 },
  { j: "J+14", cortisol: 102 },
  { j: "J+30", cortisol: 100 },
];

const NAV = [
  { id: "overview", label: "Présentation" },
  { id: "immediate", label: "Effets immédiats" },
  { id: "systems", label: "Systèmes affectés" },
  { id: "timeline", label: "Timeline" },
  { id: "hormones", label: "Neurochimie" },
  { id: "medical", label: "Usage médical" },
  { id: "stop", label: "Sécurité" },
  { id: "sources", label: "Sources" },
];

function DopTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0d0d1a", border: "1px solid #eab30833", borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      <div style={{ color: "#94a3b8", marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color }}>{p.name}: {p.value}%</div>
      ))}
    </div>
  );
}

function RecTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0d0d1a", border: "1px solid #eab30833", borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      <div style={{ color: "#94a3b8", marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color }}>{p.name}: {p.value}%</div>
      ))}
    </div>
  );
}

function CortisolTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0d0d1a", border: "1px solid #eab30833", borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      <div style={{ color: "#94a3b8", marginBottom: 6 }}>{label}</div>
      <div style={{ color: COLOR }}>Cortisol: {payload[0]?.value}% baseline</div>
    </div>
  );
}

function Sources({ desk }) {
  const refs = [
    { authors: "Nutt DJ et al.", title: "Drug harms in the UK: a multicriteria decision analysis", journal: "The Lancet", year: "2010", url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(10)61462-6/fulltext" },
    { authors: "Berman S et al.", title: "Brain dysfunctions and neurotoxicity induced by psychostimulants", journal: "Neural Regeneration Research", year: "2024", url: "https://journals.lww.com/nrronline/fulltext/2024/09000/brain_dysfunctions_and_neurotoxicity_induced_by.18.aspx" },
    { authors: "Berman S et al.", title: "Potential adverse effects of amphetamine treatment on brain and behavior: a review", journal: "Nature — Molecular Psychiatry", year: "2009", url: "https://www.nature.com/articles/mp200890" },
    { authors: "Faraone SV et al.", title: "The pharmacology of amphetamine and methylphenidate: Relevance to the neurobiology of ADHD", journal: "Neuroscience & Biobehavioral Reviews", year: "2021", url: "https://pubmed.ncbi.nlm.nih.gov/33276077/" },
    { authors: "FDA", title: "Adderall (amphetamine) — Prescribing Information and Safety", journal: "U.S. Food and Drug Administration", year: "2024", url: "https://www.fda.gov/drugs/drug-safety-and-availability/fda-drug-safety-communication-fda-warns-about-rare-cases-serious-heart-problems-and-psychiatric" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle color={COLOR}>Sources & Références scientifiques</SectionTitle>
      <div style={{ background: `${COLOR}10`, border: `1px solid ${COLOR}33`, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 8 }}>PEER-REVIEWED · OMS · PUBMED · NIH</div>
        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          Toutes les données présentées sont issues de publications scientifiques révisées par les pairs (2009–2025).
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

export default function Amphetamines({ onBack }) {
  const [section, setSection] = useState("overview");
  const w = useWidth();
  const desk = w >= 768;

  const renderSection = () => {
    switch (section) {
      case "overview": return <Overview desk={desk} />;
      case "immediate": return <Immediate desk={desk} />;
      case "systems": return <Systems desk={desk} />;
      case "timeline": return <Timeline desk={desk} />;
      case "hormones": return <Hormones desk={desk} />;
      case "medical": return <Medical desk={desk} />;
      case "stop": return <Stop desk={desk} />;
      case "sources": return <Sources desk={desk} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060610", fontFamily: "'Georgia','Times New Roman',serif", color: "#e2e8f0" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(180deg, #1a1400 0%, #060610 100%)",
        padding: desk ? "40px 48px 32px" : "24px 20px 20px",
        borderBottom: "1px solid #1e1e3a",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${COLOR}15 0%, transparent 70%)` }} />
        <button onClick={onBack} style={{
          background: "none", border: `1px solid #1e1e3a`, borderRadius: 8,
          color: "#64748b", cursor: "pointer", padding: "6px 14px", fontSize: 12,
          fontFamily: "monospace", marginBottom: 20, display: "flex", alignItems: "center", gap: 6,
        }}>← Retour</button>
        <div style={{ maxWidth: 800, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <span style={{ fontSize: 42 }}>⚡</span>
            <div>
              <div style={{ fontSize: 10, color: COLOR, letterSpacing: 4, fontFamily: "monospace", marginBottom: 4 }}>STIMULANT · AMPHÉTAMINE SULFATE</div>
              <h1 style={{ fontSize: desk ? 32 : 22, fontWeight: "bold", color: "#e2e8f0", margin: 0 }}>Amphétamines</h1>
            </div>
          </div>
          <p style={{ color: "#94a3b8", fontSize: desk ? 14 : 12, lineHeight: 1.7, maxWidth: 620, margin: "0 0 16px" }}>
            Speed, amphétamine sulfate, Adderall — stimulants puissants du SNC agissant sur
            les systèmes dopaminergique et noradrénergique. Moins puissant que la méthamphétamine,
            mais profil pharmacologique similaire avec des usages médicaux légitimes.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[
              { label: "OMS Classement", val: "#9 env." },
              { label: "Durée high", val: "4–8 heures" },
              { label: "Dopamine peak", val: "+300–420%" },
              { label: "Demi-vie", val: "10–12h" },
            ].map((item) => (
              <div key={item.label} style={{ background: COLOR + "15", border: `1px solid ${COLOR}33`, borderRadius: 8, padding: "6px 14px" }}>
                <div style={{ fontSize: 10, color: "#64748b", fontFamily: "monospace" }}>{item.label}</div>
                <div style={{ fontSize: 13, color: COLOR, fontWeight: "bold" }}>{item.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nav */}
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

      {/* Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: desk ? "36px 48px 60px" : "24px 16px 40px" }}>
        {renderSection()}
      </div>
    </div>
  );
}

function Overview({ desk }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle color={COLOR}>Qu'est-ce que l'amphétamine ?</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
        <Card color={COLOR}>
          <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>MÉCANISME D'ACTION</div>
          <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            L'amphétamine est un <strong style={{ color: "#e2e8f0" }}>inhibiteur et libérateur de monoamines</strong> —
            elle inverse le fonctionnement des transporteurs DAT, NET et SERT pour forcer
            la libération de dopamine, noradrénaline et sérotonine dans la synapse.
            Contrairement aux bloqueurs (cocaïne), elle <em>vide activement</em> les vésicules présynaptiques.
          </p>
        </Card>
        <Card color={COLOR}>
          <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>FORMES & VOIES</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { form: "Sulfate de speed", note: "Poudre blanche/beige · oral/insufflé · 20–60% pureté rue" },
              { form: "Adderall / Dexedrine", note: "Usage médical TDAH · comprimés dosés" },
              { form: "Lisdexamphétamine (Vyvanse)", note: "Prodrogue à libération prolongée" },
              { form: "Amphétamine base", note: "Huile · fumée · absorption rapide" },
            ].map((f) => (
              <div key={f.form} style={{ borderLeft: `2px solid ${COLOR}44`, paddingLeft: 12 }}>
                <div style={{ fontSize: 12, color: "#e2e8f0" }}>{f.form}</div>
                <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>{f.note}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>COMPARAISON AMPHÉTAMINE vs MÉTHAMPHÉTAMINE</div>
        <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr" : "1fr", gap: 12 }}>
          {[
            { param: "Lipophilicité", amp: "Modérée", meth: "Élevée" },
            { param: "Passage BHE", amp: "Bon", meth: "Très élevé" },
            { param: "Durée d'action", amp: "4–8h", meth: "8–24h" },
            { param: "Puissance dopamine", amp: "+300–420%", meth: "+700–900%" },
            { param: "Neurotoxicité DAT", amp: "Modérée", meth: "Sévère" },
            { param: "Usage médical", amp: "TDAH, narcolepsie", meth: "Limité (obésité)" },
          ].map((row) => (
            <div key={row.param} style={{ background: "#060610", borderRadius: 8, padding: "10px 14px", border: "1px solid #1e1e3a" }}>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4, fontFamily: "monospace" }}>{row.param}</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: COLOR }}>AMP: {row.amp}</span>
                <span style={{ fontSize: 12, color: "#06b6d4" }}>METH: {row.meth}</span>
              </div>
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
      <SectionTitle color={COLOR}>Effets immédiats</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
        {[
          {
            title: "0–30 min · Montée",
            items: [
              "Euphorie, confiance augmentée",
              "Énergie et vigilance intenses",
              "Appétit totalement supprimé",
              "Fréquence cardiaque +20–40 bpm",
              "Pupilles dilatées (mydriase)",
            ],
          },
          {
            title: "1–4h · Pic",
            items: [
              "Hyperfocus — concentration extrême",
              "Loquacité, pensées accélérées",
              "Libido augmentée puis inhibée",
              "Transpiration, bouche sèche",
              "Hyperactivité motrice",
            ],
          },
          {
            title: "4–8h · Descente",
            items: [
              "Fatigue progressive, irritabilité",
              "Anxiété, nervosité",
              "Crash dopaminergique imminent",
              "Besoin de redoser (craving)",
              "Tension artérielle encore élevée",
            ],
          },
          {
            title: "8–48h · Crash",
            items: [
              "Épuisement profond ('comedown')",
              "Hypersomnie (12–20h de sommeil)",
              "Hyperphagie de récupération",
              "Anhédonie transitoire",
              "Dépression légère à modérée",
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
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>TIMELINE DOPAMINE : AMPHÉTAMINE vs MÉTHAMPHÉTAMINE</div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={dopamineData}>
            <defs>
              <linearGradient id="amp-ampGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLOR} stopOpacity={0.4} />
                <stop offset="95%" stopColor={COLOR} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="amp-methGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
            <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 11 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} unit="%" />
            <Tooltip content={<DopTooltip />} />
            <ReferenceLine y={100} stroke="#334155" strokeDasharray="4 4" />
            <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
            <Area type="monotone" dataKey="amp" name="Amphétamine" stroke={COLOR} fill="url(#amp-ampGrad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="meth" name="Méthamphétamine" stroke="#06b6d4" fill="url(#amp-methGrad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="baseline" name="Baseline" stroke="#334155" fill="none" strokeWidth={1} strokeDasharray="4 4" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 11, color: "#475569", textAlign: "center", marginTop: 8, fontFamily: "monospace" }}>
          L'amphétamine produit un high moins intense mais plus long que la meth
        </div>
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
          system: "Cerveau & Dopamine",
          icon: "🧠",
          detail: "Libération massive de dopamine dans le noyau accumbens (+300-420% baseline). Activation DAT/NET/SERT inversée — les transporteurs pompent les monoamines vers l'extérieur de la cellule au lieu de les recycler. Avec usage chronique : downrégulation des récepteurs D2, apoptose partielle des terminaisons dopaminergiques (moins sévère que meth).",
          stats: [
            { label: "Dopamine peak", val: "+300–420%" },
            { label: "Noradrénaline", val: "+200–350%" },
            { label: "Sérotonine", val: "+100–150%" },
          ],
        },
        {
          system: "Cœur & Circulation",
          icon: "❤️",
          detail: "La libération de noradrénaline provoque une vasoconstriction périphérique et une tachycardie. Risque d'arythmie et d'hypertension artérielle sévère. Usage chronique associé à cardiomyopathie, HTAP (hypertension artérielle pulmonaire) et endocardite (si IV). Risque d'AVC ischémique par vasospasme.",
          stats: [
            { label: "FC augmentation", val: "+20–50 bpm" },
            { label: "TA systolique", val: "+30–50 mmHg" },
            { label: "Risque AVC", val: "×3–5 (haute dose)" },
          ],
        },
        {
          system: "Métabolisme & Thermorégulation",
          icon: "🌡️",
          detail: "Augmentation significative du métabolisme basal — suppression totale de l'appétit via action sur le NPY hypothalamique. Hyperthermie par augmentation de l'activité métabolique et vasoconstriction. La combinaison hyperthermie + déshydratation peut être fatale en contexte festif.",
          stats: [
            { label: "Métabolisme basal", val: "+20–35%" },
            { label: "Température corpo.", val: "jusqu'à 40.5°C" },
            { label: "Appétit", val: "−80 à −100%" },
          ],
        },
        {
          system: "Système endocrinien",
          icon: "⚗️",
          detail: "Cortisol élevé pendant et après la prise. Suppression de la GH (hormone de croissance) — préoccupation majeure pour les adolescents traités au long cours. Testostérone réduite chez les hommes avec usage chronique. Perturbation des cycles de sommeil via suppression de la mélatonine.",
          stats: [
            { label: "Cortisol", val: "+110–130%" },
            { label: "GH (chronique)", val: "−20–40%" },
            { label: "Mélatonine", val: "supprimée" },
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
      <SectionTitle color={COLOR}>Timeline</SectionTitle>

      <div style={{ fontSize: 11, color: COLOR, letterSpacing: 3, fontFamily: "monospace", marginBottom: 16, paddingBottom: 8, borderBottom: `1px solid ${COLOR}22` }}>PARTIE 1 — EFFETS ACTIFS (4–8h)</div>

      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>EFFETS ACTIFS — DOPAMINE AMPHÉTAMINE vs METH (0–24h, % baseline)</div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={dopamineData}>
            <defs>
              <linearGradient id="amp-actAmpGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLOR} stopOpacity={0.4} />
                <stop offset="95%" stopColor={COLOR} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="amp-actMethGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
            <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 11 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} unit="%" />
            <Tooltip content={<DopTooltip />} />
            <ReferenceLine y={100} stroke="#334155" strokeDasharray="4 4" />
            <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
            <Area type="monotone" dataKey="amp" name="Amphétamine" stroke={COLOR} fill="url(#amp-actAmpGrad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="meth" name="Méthamphétamine" stroke="#06b6d4" fill="url(#amp-actMethGrad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="baseline" name="Baseline" stroke="#334155" fill="none" strokeWidth={1} strokeDasharray="4 4" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 11, color: "#475569", textAlign: "center", marginTop: 8, fontFamily: "monospace" }}>
          High 4–8h · crash dopaminergique à 12–24h · début de récupération
        </div>
      </Card>
      <div style={{ fontSize: 11, color: "#22c55e", letterSpacing: 3, fontFamily: "monospace", marginBottom: 16, marginTop: 8, paddingBottom: 8, borderBottom: "1px solid #22c55e22" }}>PARTIE 2 — ARRÊT & RÉCUPÉRATION</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { period: "0–24h", title: "Crash aigu", desc: "Épuisement profond, hypersomnie, faim intense après la suppression. Humeur dépressive. Le cerveau manque de dopamine.", color: "#ef4444" },
          { period: "Jour 2–7", title: "Sevrage précoce", desc: "Anhédonie, fatigue chronique, irritabilité. Craving fort. Insomnie possible après l'hypersomnie initiale.", color: "#f97316" },
          { period: "Sem 2–4", title: "Stabilisation physique", desc: "Retour progressif de l'appétit normal et du sommeil. Humeur encore instable. Récepteurs D2 commencent à se rétablir.", color: COLOR },
          { period: "Mois 1–3", title: "Rétablissement moyen", desc: "Énergie revenue à 70-85%. Les circuits de récompense se restaurent. Craving contextuel encore présent.", color: "#22c55e" },
          { period: "Mois 3–12", title: "Récupération avancée", desc: "DAT/D2 en voie de normalisation (IRM fonctionnelle). Fonctions cognitives améliorées. Risque de rechute toujours présent sur les triggers.", color: "#3b82f6" },
          { period: "An 1–2", title: "Récupération complète", desc: "Densité DAT normalisée dans les études d'imagerie. Capacité de plaisir ordinaire restaurée. Vigilance aux situations à risque maintenue.", color: "#a855f7" },
        ].map((step) => (
          <div key={step.period} style={{ display: "flex", gap: 16 }}>
            <div style={{ width: 80, flexShrink: 0, textAlign: "right" }}>
              <div style={{ fontSize: 11, color: step.color, fontFamily: "monospace", fontWeight: "bold" }}>{step.period}</div>
            </div>
            <div style={{ width: 2, background: step.color + "44", borderRadius: 2, flexShrink: 0 }} />
            <div style={{ flex: 1, paddingBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: "bold", color: "#e2e8f0", marginBottom: 4 }}>{step.title}</div>
              <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>{step.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>RÉCUPÉRATION FONCTIONNELLE (% baseline)</div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={recoveryData}>
            <defs>
              <linearGradient id="amp-dopaRec" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLOR} stopOpacity={0.4} />
                <stop offset="95%" stopColor={COLOR} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="amp-enRec" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="amp-humRec" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
            <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 10 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} unit="%" domain={[0, 100]} />
            <Tooltip content={<RecTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
            <Area type="monotone" dataKey="dopa" name="Dopamine" stroke={COLOR} fill="url(#amp-dopaRec)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="energie" name="Énergie" stroke="#22c55e" fill="url(#amp-enRec)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="humeur" name="Humeur" stroke="#a855f7" fill="url(#amp-humRec)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 11, color: "#475569", textAlign: "center", marginTop: 8, fontFamily: "monospace" }}>
          Récupération complète en 12–24 mois selon usage et fréquence
        </div>
      </Card>
    </div>
  );
}

function Hormones({ desk }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle color={COLOR}>Impact hormonal</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
        {[
          { hormone: "Dopamine", icon: "⚡", acute: "+300–420%", chronic: "Récepteurs D2 −30%", note: "Libération forcée par inversion DAT" },
          { hormone: "Noradrénaline", icon: "❤️", acute: "+200–350%", chronic: "Hypertension chronique", note: "Inversion NET — vigilance, FC, TA" },
          { hormone: "Cortisol", icon: "🔥", acute: "+110–130%", chronic: "Axe HPA perturbé", note: "Réponse au stress amplifiée" },
          { hormone: "Sérotonine", icon: "🌊", acute: "+100–150%", chronic: "Faible déplétion (vs MDMA)", note: "Moins sérotoninergique que cathinones" },
          { hormone: "Hormone de croissance", icon: "📈", acute: "Supprimée acutement", chronic: "−20–40% chronique", note: "Préoccupation chez adolescents TDAH" },
          { hormone: "Mélatonine", icon: "🌙", acute: "Supprimée (×4-6h)", chronic: "Rythme circadien décalé", note: "Insomnie fréquente en soirée" },
        ].map((h) => (
          <Card key={h.hormone} color={COLOR}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 18 }}>{h.icon}</span>
              <div style={{ fontSize: 13, fontWeight: "bold", color: "#e2e8f0" }}>{h.hormone}</div>
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <div style={{ flex: 1, background: "#060610", borderRadius: 6, padding: "6px 10px" }}>
                <div style={{ fontSize: 10, color: "#64748b", fontFamily: "monospace", marginBottom: 2 }}>AIGU</div>
                <div style={{ fontSize: 12, color: COLOR, fontWeight: "bold" }}>{h.acute}</div>
              </div>
              <div style={{ flex: 1, background: "#060610", borderRadius: 6, padding: "6px 10px" }}>
                <div style={{ fontSize: 10, color: "#64748b", fontFamily: "monospace", marginBottom: 2 }}>CHRONIQUE</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{h.chronic}</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#475569", fontFamily: "monospace" }}>{h.note}</div>
          </Card>
        ))}
      </div>
      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>CORTISOL POST-AMPHÉTAMINE (jours)</div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={cortisolData}>
            <defs>
              <linearGradient id="amp-cortGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLOR} stopOpacity={0.5} />
                <stop offset="95%" stopColor={COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
            <XAxis dataKey="j" tick={{ fill: "#64748b", fontSize: 11 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} unit="%" domain={[90, 220]} />
            <Tooltip content={<CortisolTooltip />} />
            <ReferenceLine y={100} stroke="#334155" strokeDasharray="4 4" label={{ value: "Baseline", fill: "#475569", fontSize: 10 }} />
            <Area type="monotone" dataKey="cortisol" stroke={COLOR} fill="url(#amp-cortGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 11, color: "#475569", textAlign: "center", marginTop: 8, fontFamily: "monospace" }}>
          Cortisol revient à baseline en ≈ 30 jours d'abstinence
        </div>
      </Card>
    </div>
  );
}

function Medical({ desk }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle color={COLOR}>Usage médical vs récréatif</SectionTitle>

      <div style={{ background: "#eab30810", border: "1px solid #eab30833", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>LES DEUX FACES D'UNE MÊME MOLÉCULE</div>
        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          L'amphétamine est à la fois un médicament essentiel reconnu par l'OMS et une drogue
          récréative à risque sérieux. La différence centrale : la <strong style={{ color: "#e2e8f0" }}>dose, la formulation,
          et le contexte</strong>. Un Adderall dosé à 10mg libéré progressivement n'a pas le même
          profil qu'une ligne de speed insufflé à dose inconnue.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
        <Card color="#22c55e">
          <div style={{ fontSize: 12, color: "#22c55e", fontFamily: "monospace", marginBottom: 12 }}>USAGE MÉDICAL LÉGITIME</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { use: "TDAH (adulte & enfant)", detail: "Améliore dopamine préfrontale → concentration, impulsivité réduite. Adderall, Vyvanse, Ritaline (méthylphénidate)." },
              { use: "Narcolepsie", detail: "Stimulation pour maintenir l'éveil diurne. Traitement de 1re ligne dans certains pays." },
              { use: "Obésité sévère (historique)", detail: "Suppresseur d'appétit — usage aujourd'hui très limité en raison des risques cardiaques." },
              { use: "Usage militaire (WWII)", detail: "Pervitin (meth) et Benzédrine distribués aux soldats pour combat prolongé — controversé." },
            ].map((u) => (
              <div key={u.use} style={{ borderLeft: "2px solid #22c55e44", paddingLeft: 12 }}>
                <div style={{ fontSize: 12, color: "#e2e8f0" }}>{u.use}</div>
                <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>{u.detail}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card color="#ef4444">
          <div style={{ fontSize: 12, color: "#ef4444", fontFamily: "monospace", marginBottom: 12 }}>RISQUES USAGE RÉCRÉATIF</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { risk: "Pureté du marché noir", detail: "Speed de rue = 10–60% pureté. Coupé avec caféine, levamisole, parfois méthamphétamine." },
              { risk: "Surdosage imprévisible", detail: "Dose de rue inconnue → risque d'arythmie, convulsions, AVC hypertensif." },
              { risk: "Dépendance psychologique", detail: "Craving fort lié aux effets euphorisants. Usage compulsif possible notamment en contexte festif." },
              { risk: "Psychose amphétaminique", detail: "Paranoïa, hallucinations avec usage à haute dose ou prolongé — surtout en privation de sommeil." },
            ].map((r) => (
              <div key={r.risk} style={{ borderLeft: "2px solid #ef444444", paddingLeft: 12 }}>
                <div style={{ fontSize: 12, color: "#e2e8f0" }}>{r.risk}</div>
                <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>{r.detail}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>TDAH : TRAITEMENT vs DOPAGE</div>
        <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr" : "1fr", gap: 12 }}>
          {[
            {
              question: "Effet sur un cerveau TDAH",
              answer: "Normalise la signalisation dopaminergique préfrontale déficiente → améliore focus, réduction impulsivité",
              color: "#22c55e",
            },
            {
              question: "Effet sur un cerveau neurotypique",
              answer: "Surdopamine → hyperactivation, puis crash. Augmente risque d'addiction et d'anxiété sans bénéfice cognitif net",
              color: "#ef4444",
            },
            {
              question: "Dopage académique",
              answer: "Les études montrent que les non-TDAH n'ont pas de bénéfice cognitif réel — seulement l'impression subjective d'être plus efficaces",
              color: COLOR,
            },
          ].map((item) => (
            <div key={item.question} style={{ background: "#060610", borderRadius: 8, padding: "14px", border: `1px solid ${item.color}22` }}>
              <div style={{ fontSize: 11, color: item.color, fontFamily: "monospace", marginBottom: 6 }}>{item.question}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{item.answer}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>RÉDUCTION DES RISQUES — USAGE RÉCRÉATIF</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { rule: "Test de substance", detail: "Utiliser un kit Marquis/Simon's pour confirmer l'amphétamine (brun → orange vs bleu pour MDMA)" },
            { rule: "Dosage prudent", detail: "Commencer à 10–20mg oral. Éviter l'insufflation (muqueuse + absorption erratique)" },
            { rule: "Pas de redosage tardif", detail: "Éviter de redoser après 18h → insomnie prolongée et crash plus sévère" },
            { rule: "Hydratation et nutrition", detail: "Boire eau régulièrement (pas excès), manger avant la prise — protège le cœur" },
            { rule: "Éviter les combinaisons", detail: "MAOIs (danger mortel), alcool (cardiotoxique), autres stimulants" },
            { rule: "Fréquence maximale", detail: "1x par semaine max pour limiter tolérance et risque de dépendance" },
          ].map((r) => (
            <div key={r.rule} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid #1e1e3a" }}>
              <div style={{ width: 6, height: 6, background: COLOR, borderRadius: "50%", flexShrink: 0, marginTop: 6 }} />
              <div>
                <div style={{ fontSize: 13, color: "#e2e8f0", marginBottom: 2 }}>{r.rule}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{r.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Stop({ desk }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle color={COLOR}>Arrêter les amphétamines</SectionTitle>
      <div style={{ background: "#22c55e10", border: "1px solid #22c55e33", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, color: "#22c55e", fontFamily: "monospace", marginBottom: 8 }}>BONNE NOUVELLE</div>
        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          Contrairement à l'héroïne ou aux benzodiazépines, l'arrêt des amphétamines n'est
          <strong style={{ color: "#e2e8f0" }}> pas médicalement dangereux</strong> (pas de convulsions, pas de risque
          vital direct). Le sevrage est principalement psychologique et nécessite un accompagnement,
          pas une hospitalisation d'urgence.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
        <Card color={COLOR}>
          <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>SYMPTÔMES DE SEVRAGE</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { sym: "Fatigue et hypersomnie", timing: "Jours 1–5" },
              { sym: "Craving intense", timing: "Jours 1–14" },
              { sym: "Humeur dépressive", timing: "Semaines 1–4" },
              { sym: "Anhédonie (incapacité au plaisir)", timing: "Semaines 2–8" },
              { sym: "Irritabilité, anxiété", timing: "Semaines 1–3" },
              { sym: "Hyperphagie (faim de rattrapage)", timing: "Semaines 1–4" },
            ].map((s) => (
              <div key={s.sym} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #1e1e3a" }}>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{s.sym}</span>
                <span style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>{s.timing}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card color={COLOR}>
          <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>STRATÉGIES DE SOUTIEN</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { strat: "Suivi addictologue", desc: "Évaluation de la dépendance, thérapie motivationnelle" },
              { strat: "TCC (thérapie cognitive-comportementale)", desc: "Gestion du craving, identification des triggers" },
              { strat: "Traitement de l'anhédonie", desc: "Exercice physique (+dopamine naturelle), alimentation riche en tyrosine" },
              { strat: "Groupes de pairs", desc: "NA (Narcotiques Anonymes), SMART Recovery" },
              { strat: "Traitement du TDAH sous-jacent", desc: "Si le speed était une automédication — diagnostic et traitement adapté" },
            ].map((s) => (
              <div key={s.strat} style={{ borderLeft: `2px solid ${COLOR}44`, paddingLeft: 12, paddingBottom: 8 }}>
                <div style={{ fontSize: 12, color: "#e2e8f0" }}>{s.strat}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>RESSOURCES</div>
        <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr" : "1fr", gap: 10 }}>
          {[
            { name: "Drogues Info Service", contact: "0800 23 13 13 (gratuit)", desc: "Écoute et information 24h/24" },
            { name: "Addictions France", contact: "addictions-france.org", desc: "Réseau de soins addictologie" },
            { name: "CSAPA", contact: "Votre département", desc: "Centre de soin ambulatoire gratuit" },
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
