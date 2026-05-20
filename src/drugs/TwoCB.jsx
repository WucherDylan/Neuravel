import { useState } from "react";
import { useWidth, SectionTitle, Card } from "../shared";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";

const COLOR = "#d946ef";

const twoCBTimeline = [
  { time: "0h", activation: 100, perception: 100, entactogen: 100 },
  { time: "0.5h", activation: 160, perception: 140, entactogen: 180 },
  { time: "1h", activation: 320, perception: 340, entactogen: 300 },
  { time: "1.5h", activation: 420, perception: 480, entactogen: 380 },
  { time: "2h", activation: 460, perception: 520, entactogen: 400 },
  { time: "2.5h", activation: 450, perception: 510, entactogen: 380 },
  { time: "3h", activation: 400, perception: 450, entactogen: 330 },
  { time: "3.5h", activation: 320, perception: 360, entactogen: 260 },
  { time: "4h", activation: 230, perception: 260, entactogen: 180 },
  { time: "4.5h", activation: 160, perception: 180, entactogen: 130 },
  { time: "5h", activation: 120, perception: 130, entactogen: 110 },
  { time: "6h", activation: 100, perception: 100, entactogen: 100 },
];

const cbRecoveryData = [
  { time: "Fin trip", energie: 72, humeur: 115, serotonin: 92 },
  { time: "J+1", energie: 88, humeur: 112, serotonin: 96 },
  { time: "J+2", energie: 95, humeur: 108, serotonin: 98 },
  { time: "J+3", energie: 100, humeur: 104, serotonin: 100 },
  { time: "J+5", energie: 100, humeur: 101, serotonin: 100 },
  { time: "J+7", energie: 100, humeur: 100, serotonin: 100 },
];

const toleranceData = [
  { day: "J0 (prise)", tolerance: 100 },
  { day: "J1", tolerance: 80 },
  { day: "J2", tolerance: 55 },
  { day: "J3", tolerance: 35 },
  { day: "J5", tolerance: 15 },
  { day: "J7", tolerance: 5 },
  { day: "J10", tolerance: 0 },
];

const NAV = [
  { id: "overview", label: "Présentation" },
  { id: "immediate", label: "Effets immédiats" },
  { id: "systems", label: "Systèmes affectés" },
  { id: "timeline", label: "Timeline" },
  { id: "hormones", label: "Neurochimie" },
  { id: "badtrip", label: "Bad trip" },
  { id: "stop", label: "Sécurité" },
  { id: "sources", label: "Sources" },
];

function CBTooltip({ active, payload, label }) {
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

function Sources({ desk }) {
  const refs = [
    { authors: "Nutt DJ et al.", title: "Drug harms in the UK: a multicriteria decision analysis", journal: "The Lancet", year: "2010", url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(10)61462-6/fulltext" },
    { authors: "Shulgin A, Shulgin A.", title: "PiHKAL: A Chemical Love Story — 2C-B synthesis and pharmacology", journal: "Transform Press", year: "1991", url: "https://www.erowid.org/library/books_online/pihkal/pihkal.shtml" },
    { authors: "González D et al.", title: "Phenomenology of 4-bromo-2,5-dimethoxyphenethylamine (2C-B) in a clinical trial setting", journal: "Drug and Alcohol Dependence", year: "2015", url: "https://pubmed.ncbi.nlm.nih.gov/25900040/" },
    { authors: "Papaseit E et al.", title: "Human Pharmacology of 3,4-Methylenedioxymethamphetamine (MDMA) and 2C-B Comparison", journal: "Frontiers in Psychiatry", year: "2018", url: "https://pubmed.ncbi.nlm.nih.gov/30327627/" },
    { authors: "Nichols DE.", title: "Psychedelics — Pharmacological Reviews", journal: "Pharmacological Reviews", year: "2016", url: "https://pubmed.ncbi.nlm.nih.gov/26841800/" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle color={COLOR}>Sources & Références scientifiques</SectionTitle>
      <div style={{ background: `${COLOR}10`, border: `1px solid ${COLOR}33`, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 8 }}>PEER-REVIEWED · PUBMED · PHARMACOLOGICAL REVIEWS</div>
        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          Le 2C-B reste une des substances les moins étudiées cliniquement en raison de son statut légal.
          Les données pharmacologiques disponibles sont issues d'études précliniques et d'essais humains limités.
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

export default function TwoCB({ onBack }) {
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
      case "sources": return <Sources desk={desk} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060610", fontFamily: "'Georgia','Times New Roman',serif", color: "#e2e8f0" }}>
      <div style={{
        background: "linear-gradient(180deg, #1a0020 0%, #060610 100%)",
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
            <span style={{ fontSize: 42 }}>🔮</span>
            <div>
              <div style={{ fontSize: 10, color: COLOR, letterSpacing: 4, fontFamily: "monospace", marginBottom: 4 }}>PSYCHÉDÉLIQUE · PHÉNÉTHYLAMINE · AGONISTE 5-HT2A</div>
              <h1 style={{ fontSize: desk ? 32 : 22, fontWeight: "bold", color: "#e2e8f0", margin: 0 }}>2C-B</h1>
            </div>
          </div>
          <p style={{ color: "#94a3b8", fontSize: desk ? 14 : 12, lineHeight: 1.7, maxWidth: 620, margin: "0 0 16px" }}>
            4-Bromo-2,5-diméthoxyphénéthylamine — synthétisée par Alexander Shulgin en 1974 et décrite dans PiHKAL.
            Psychédélique phénéthylamine à la croisée du LSD et de l'MDMA : visuels riches, composante entactogène,
            durée de <strong style={{ color: "#e2e8f0" }}>4–6 heures</strong> plus gérable qu'un trip au LSD.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[
              { label: "Dose active", val: "10–25 mg" },
              { label: "Durée", val: "4–6 heures" },
              { label: "Dépendance physique", val: "Nulle" },
              { label: "Onset", val: "45–90 min" },
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
      <SectionTitle color={COLOR}>Qu'est-ce que le 2C-B ?</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
        <Card color={COLOR}>
          <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>DÉCOUVERTE & HISTOIRE</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { year: "1974", fact: "Alexander Shulgin synthétise le 2C-B dans son laboratoire privé" },
              { year: "1991", fact: "Décrit en détail dans PiHKAL (Phenethylamines I Have Known And Loved)" },
              { year: "1990s", fact: "Utilisé en Europe comme alternative légale à l'MDMA (vendu sous le nom Nexus)" },
              { year: "2001", fact: "Classé Schedule I aux USA, puis illégal dans la plupart des pays" },
              { year: "2000s+", fact: "Intérêt croissant pour la recherche en psychothérapie assistée" },
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
            Le 2C-B est un <strong style={{ color: "#e2e8f0" }}>agoniste partiel des récepteurs 5-HT2A et 5-HT2C</strong>,
            à l'origine des effets psychédéliques. Contrairement au LSD, il agit aussi comme
            libérateur partiel de sérotonine et présente une affinité pour les récepteurs 5-HT2B —
            d'où sa composante entactogène (rappelant légèrement l'MDMA à basses doses).
          </p>
          <div style={{ background: "#060610", borderRadius: 8, padding: "10px 14px", border: `1px solid ${COLOR}22` }}>
            <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace", marginBottom: 4 }}>AFFINITÉ RÉCEPTEURS</div>
            <div style={{ fontSize: 12, color: "#e2e8f0" }}>5-HT2A {'>'} 5-HT2C {'>'} 5-HT2B {'>'} α2-adrénergiques {'>'} D4</div>
          </div>
        </Card>
      </div>
      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>2C-B vs LSD vs MDMA — POSITIONNEMENT</div>
        <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr" : "1fr", gap: 10 }}>
          {[
            { param: "Durée", cb: "4–6h", lsd: "8–16h", mdma: "3–5h" },
            { param: "Effets visuels", cb: "Très riches", lsd: "Intenses", mdma: "Rares" },
            { param: "Composante entactogène", cb: "Modérée", lsd: "Faible", mdma: "Principale" },
            { param: "Introspection", cb: "Modérée", lsd: "Variable", mdma: "Sociale" },
            { param: "Dose active", cb: "10–25 mg", lsd: "50–200 µg", mdma: "75–125 mg" },
            { param: "Dépendance physique", cb: "Nulle", lsd: "Nulle", mdma: "Nulle" },
          ].map((row) => (
            <div key={row.param} style={{ background: "#060610", borderRadius: 8, padding: "10px 12px", border: "1px solid #1e1e3a" }}>
              <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace", marginBottom: 6 }}>{row.param}</div>
              <div style={{ fontSize: 12, color: COLOR }}>2C-B: {row.cb}</div>
              <div style={{ fontSize: 12, color: "#14b8a6" }}>LSD: {row.lsd}</div>
              <div style={{ fontSize: 12, color: "#f97316" }}>MDMA: {row.mdma}</div>
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
      <SectionTitle color={COLOR}>Effets immédiats — 6h de voyage</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
        {[
          {
            title: "0–1h · Onset",
            items: [
              "Légère nausée possible pendant la montée",
              "Fourmillements, chaleur corporelle",
              "Premiers halos et changements de couleurs",
              "Euphorie montante, envie de sourire",
              "Légère accélération cardiaque",
            ],
          },
          {
            title: "1–2.5h · Montée & Pic",
            items: [
              "Visuels très colorés, géométriques et fluides",
              "Surfaces qui respirent, textures vivantes",
              "Empathie et ouverture émotionnelle (entactogène)",
              "Pensées claires et créatives — moins chaotiques que LSD",
              "Synesthésie modérée (sons = couleurs)",
            ],
          },
          {
            title: "2.5–4h · Plateau & Descente",
            items: [
              "Visuels qui restent présents mais se stabilisent",
              "Conversation et contact social très agréables",
              "Moins d'ego dissolution que LSD — lucidité conservée",
              "Plaisir sensoriel amplifié (musique, toucher)",
              "Descente graduelle et confortable",
            ],
          },
          {
            title: "4–6h · Fin & After",
            items: [
              "Retour progressif à l'état normal",
              "Afterglow doux — bien-être résiduel",
              "Fatigue légère, pas d'insomnie prolongée (vs LSD)",
              "Appétit pouvant revenir rapidement",
              "Insights émotionnels qui persistent",
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
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>AVANTAGE CLEF : DURÉE MAÎTRISABLE</div>
        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          Comparé au LSD (8–16h), la durée de 4–6h du 2C-B est considérée comme un avantage majeur
          par la communauté de réduction des risques. En cas de bad trip, l'expérience se termine
          naturellement bien plus tôt. La lucidité conservée pendant le voyage le rend aussi
          plus <strong style={{ color: "#e2e8f0" }}>prévisible et contrôlable</strong> pour la plupart des utilisateurs.
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
          system: "Récepteurs 5-HT2A — Effets psychédéliques",
          icon: "🔮",
          detail: "Comme le LSD et la psilocybine, le 2C-B active puissamment les récepteurs 5-HT2A corticaux. Cela génère les effets visuels riches et géométriques, l'altération de la perception du temps et l'augmentation de l'entropie neurale. La différence : le 2C-B ne se piège pas dans le récepteur comme le LSD — d'où une durée 2–3× plus courte.",
          stats: [
            { label: "Affinité 5-HT2A", val: "Élevée" },
            { label: "Entropie neurale", val: "+180–250%" },
            { label: "Durée liaison", val: "Plus courte que LSD" },
          ],
        },
        {
          system: "Récepteurs 5-HT2B & 5-HT2C — Entactogène",
          icon: "💞",
          detail: "L'affinité pour les récepteurs 5-HT2B et l'action légère sur la libération de sérotonine confèrent au 2C-B sa composante entactogène distinctive. À basses doses (10–15mg), cette dimension domine et l'expérience ressemble davantage à un MDMA léger avec des visuels. À hautes doses, les effets psychédéliques prennent le dessus.",
          stats: [
            { label: "Effet entactogène", val: "Modéré (basses doses)" },
            { label: "Sérotonine", val: "Libération légère" },
            { label: "Empathie", val: "Augmentée" },
          ],
        },
        {
          system: "Système dopaminergique",
          icon: "💫",
          detail: "Le 2C-B présente une affinité modérée pour les récepteurs D4 dopaminergiques. Cela contribue à la composante euphorisante mais sans l'effet stimulant marqué du LSD. Il n'y a pas de neurotoxicité dopaminergique documentée, contrairement à la méthamphétamine ou à certains substituts d'amphétamines.",
          stats: [
            { label: "Affinité D4", val: "Modérée" },
            { label: "Euphorie", val: "Présente" },
            { label: "Neurotoxicité", val: "Non documentée" },
          ],
        },
        {
          system: "Corps & Physiologie",
          icon: "💓",
          detail: "Tachycardie légère à modérée, légère élévation de la tension artérielle et mydriase pendant le pic. Nausées fréquentes à la montée — dissipées une fois le pic atteint. Pas de toxicité organique documentée. Hyperthermie possible en contexte festif (danse + 2C-B). Le 2C-B est considéré comme peu toxique sur le plan physique.",
          stats: [
            { label: "Nausées onset", val: "Fréquentes" },
            { label: "Cardiotoxicité", val: "Faible" },
            { label: "Toxicité hépatique", val: "Nulle" },
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

      <div style={{ fontSize: 11, color: COLOR, letterSpacing: 3, fontFamily: "monospace", marginBottom: 16, paddingBottom: 8, borderBottom: `1px solid ${COLOR}22` }}>PARTIE 1 — EFFETS ACTIFS (4–6h)</div>

      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>ACTIVATION 5-HT2A, PERCEPTION & ENTACTOGÈNE (% baseline)</div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={twoCBTimeline}>
            <defs>
              <linearGradient id="cb-actGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLOR} stopOpacity={0.4} />
                <stop offset="95%" stopColor={COLOR} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="cb-percGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="cb-entGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
            <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 11 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} unit="%" />
            <Tooltip content={<CBTooltip />} />
            <ReferenceLine y={100} stroke="#334155" strokeDasharray="4 4" />
            <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
            <Area type="monotone" dataKey="activation" name="Activation 5-HT2A" stroke={COLOR} fill="url(#cb-actGrad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="perception" name="Intensité perceptuelle" stroke="#9333ea" fill="url(#cb-percGrad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="entactogen" name="Composante entactogène" stroke="#f97316" fill="url(#cb-entGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 11, color: "#475569", textAlign: "center", marginTop: 8, fontFamily: "monospace" }}>
          Durée 2–3× plus courte que le LSD — la composante entactogène est forte à la montée
        </div>
      </Card>
      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>TOLÉRANCE — DISPARITION POST-PRISE (% tolérance résiduelle)</div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={toleranceData}>
            <defs>
              <linearGradient id="cb-tolGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLOR} stopOpacity={0.5} />
                <stop offset="95%" stopColor={COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
            <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} unit="%" domain={[0, 100]} />
            <Tooltip content={<TolTooltip />} />
            <Area type="monotone" dataKey="tolerance" name="Tolérance" stroke={COLOR} fill="url(#cb-tolGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 11, color: "#475569", textAlign: "center", marginTop: 8, fontFamily: "monospace" }}>
          Tolérance croisée avec LSD et psilocybine — disparaît en ≈ 10 jours
        </div>
      </Card>
      <div style={{ fontSize: 11, color: "#22c55e", letterSpacing: 3, fontFamily: "monospace", marginBottom: 16, marginTop: 8, paddingBottom: 8, borderBottom: "1px solid #22c55e22" }}>PARTIE 2 — ARRÊT & RÉCUPÉRATION (J+1 → J+7)</div>

      <Card color={COLOR}>
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>RÉCUPÉRATION — ÉNERGIE, HUMEUR & SÉROTONINE (% baseline)</div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={cbRecoveryData}>
            <defs>
              <linearGradient id="cb-enRecGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLOR} stopOpacity={0.4} />
                <stop offset="95%" stopColor={COLOR} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="cb-humRecGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
            <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 11 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} unit="%" domain={[60, 120]} />
            <Tooltip content={<CBTooltip />} />
            <ReferenceLine y={100} stroke="#334155" strokeDasharray="4 4" />
            <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
            <Area type="monotone" dataKey="energie" name="Énergie physique" stroke={COLOR} fill="url(#cb-enRecGrad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="humeur" name="Humeur / afterglow" stroke="#22c55e" fill="url(#cb-humRecGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 11, color: "#475569", textAlign: "center", marginTop: 8, fontFamily: "monospace" }}>
          Récupération rapide — retour baseline en ≈ 3–5 jours (durée courte vs LSD)
        </div>
      </Card>
    </div>
  );
}

function Neurochimie({ desk }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle color={COLOR}>Neurochimie du 2C-B</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
        {[
          { hormone: "5-HT2A (sérotonine)", icon: "🔮", effect: "Agoniste partiel — génère les effets psychédéliques visuels et cognitifs. Liaison plus courte que le LSD (pas de capuchon protéique), d'où la durée de 4–6h.", impact: "Visuels riches, entropie neurale ↑", color: COLOR },
          { hormone: "5-HT2B & 5-HT2C", icon: "💞", effect: "L'agonisme 5-HT2B avec libération légère de sérotonine crée la composante entactogène — empathie, ouverture, chaleur émotionnelle. Plus marqué à basses doses (10–15mg).", impact: "Entactogène modéré", color: "#f97316" },
          { hormone: "Dopamine D4", icon: "💫", effect: "Affinité modérée pour D4 — contribue à l'euphorie et au bien-être sans la composante stimulante marquée du LSD ou des amphétamines.", impact: "Euphorie légère à modérée", color: "#22c55e" },
          { hormone: "Sérotonine endogène", icon: "🌊", effect: "Légère libération de sérotonine (contrairement au LSD qui n'en libère pas). Ce mécanisme mixte (agonisme + libération partielle) est caractéristique des phénéthylamines psychédéliques.", impact: "Libération légère (vs LSD : aucune)", color: "#9333ea" },
          { hormone: "Noradrénaline", icon: "⚡", effect: "Activation légère du système noradrénergique — moins prononcée que le LSD. Explique la légère tachycardie et la mydriase sans l'effet stimulant prolongé caractéristique du LSD.", impact: "Stimulation légère (< LSD)", color: "#eab308" },
          { hormone: "BDNF & Plasticité", icon: "🌱", effect: "Comme les autres psychédéliques sérotoninergiques, le 2C-B stimule probablement la neuroplasticité via BDNF. Moins documenté que pour la psilocybine — la recherche clinique sur le 2C-B reste limitée.", impact: "Neuroplasticité (données limitées)", color: "#3b82f6" },
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
        <div style={{ fontSize: 12, color: "#ef4444", fontFamily: "monospace", marginBottom: 8 }}>MOINS FRÉQUENT QUE SOUS LSD — MAIS RÉEL</div>
        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          Le 2C-B est généralement considéré comme plus stable émotionnellement que le LSD,
          avec une lucidité mieux préservée. Cela dit, des bad trips sont possibles,
          surtout à <strong style={{ color: "#e2e8f0" }}>hautes doses ({'>'} 25mg)</strong> ou dans un mauvais cadre.
          La durée plus courte (4–6h) reste un filet de sécurité comparé au LSD.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
        <Card color="#ef4444">
          <div style={{ fontSize: 12, color: "#ef4444", fontFamily: "monospace", marginBottom: 10 }}>SIGNES D'UN BAD TRIP</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              "Anxiété intense et incontrôlable pendant la montée",
              "Nausées persistantes au-delà de l'onset",
              "Boucles de pensées négatives",
              "Confusion spatiale ou temporelle déstabilisante",
              "Paranoïa envers l'entourage",
              "Forte dissociation (surtout à hautes doses)",
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
              { rule: "Rappeler la durée courte", desc: "\"C'est 4–6h maximum, tu es en sécurité, ça va passer\"" },
              { rule: "Changer l'environnement", desc: "Musique douce, lumière tamisée, espace calme et connu" },
              { rule: "Contact physique rassurant", desc: "Tenir la main si accepté — ancrage corporel efficace" },
              { rule: "Ne pas lutter", desc: "Surrender plutôt que résistance — la résistance amplifie l'anxiété" },
              { rule: "Benzos si nécessaire", desc: "5–10mg diazépam : réduit l'anxiété sans bloquer totalement" },
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
        <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 12 }}>RISQUE HPPD</div>
        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: "0 0 14px" }}>
          Le 2C-B peut provoquer des HPPD (Hallucinogen Persisting Perception Disorder), bien que
          les cas rapportés soient moins nombreux qu'avec le LSD. Des flashbacks visuels brefs,
          de la neige visuelle ou des halos lumineux sont possibles après usage répété.
          Usage espacé recommandé : <strong style={{ color: "#e2e8f0" }}>minimum 2 semaines entre les prises</strong>.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {[
            { label: "HPPD risque", val: "Rare (< LSD)" },
            { label: "Facteur aggravant", val: "Usage fréquent répété" },
            { label: "Intervalle recommandé", val: "≥ 2 semaines" },
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
        <div style={{ fontSize: 12, color: "#22c55e", fontFamily: "monospace", marginBottom: 8 }}>PAS DE DÉPENDANCE PHYSIQUE · PAS DE TOXICITÉ ORGANIQUE DOCUMENTÉE</div>
        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          Le 2C-B est considéré comme peu toxique sur le plan physiologique.
          Aucune neurotoxicité sérotoninergique ou dopaminergique documentée, aucune dépendance physique.
          Les décès associés au 2C-B sont extrêmement rares et liés à des comportements à risque
          ou à des mélanges dangereux — <strong style={{ color: "#e2e8f0" }}>jamais à une toxicité directe</strong>.
          Les risques principaux restent psychologiques et comportementaux.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr" : "1fr", gap: 16 }}>
        <Card color={COLOR}>
          <div style={{ fontSize: 12, color: COLOR, fontFamily: "monospace", marginBottom: 10 }}>RÉDUCTION DES RISQUES</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { rule: "Tester la substance", desc: "Kit Marquis : vire au vert/bleu-vert pour le 2C-B (ne pas confondre avec MDMA)" },
              { rule: "Commencer bas", desc: "10–15mg pour une première fois — monter progressivement" },
              { rule: "Estomac vide ou léger", desc: "Réduit les nausées à la montée — attendre 3–4h après un repas lourd" },
              { rule: "Éviter le mélange MDMA", desc: "\"Candy flipping 2C-B\" : surcharge sérotoninergique, risque aggravé" },
              { rule: "Trip sitter sobre", desc: "Recommandé, surtout pour les premières expériences" },
              { rule: "Espacement des prises", desc: "Minimum 2 semaines — tolérance croisée avec LSD/psilocybine" },
            ].map((r) => (
              <div key={r.rule} style={{ borderLeft: `2px solid ${COLOR}44`, paddingLeft: 12, paddingBottom: 8 }}>
                <div style={{ fontSize: 12, color: "#e2e8f0" }}>{r.rule}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card color="#ef4444">
          <div style={{ fontSize: 12, color: "#ef4444", fontFamily: "monospace", marginBottom: 10 }}>CONTRE-INDICATIONS & MÉLANGES DANGEREUX</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { ci: "MAOIs", why: "Syndrome sérotoninergique potentiellement fatal" },
              { ci: "Lithium", why: "Risque de convulsions (comme avec LSD/champignons)" },
              { ci: "MDMA (même soir)", why: "Surcharge sérotoninergique, cardiotoxicité augmentée" },
              { ci: "Schizophrénie / psychose", why: "Décompensation psychotique aiguë possible" },
              { ci: "Trouble bipolaire type I", why: "Risque de déclenchement d'épisode maniaque" },
              { ci: "Antécédents HPPD", why: "Risque d'aggravation significatif" },
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
            { name: "Erowid", contact: "erowid.org", desc: "Base de données substances — 2C-B vault" },
            { name: "PsychonautWiki", contact: "psychonautwiki.org", desc: "Fiches pharmacologiques détaillées" },
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
