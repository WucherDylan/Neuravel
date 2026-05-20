import { useWidth } from "./shared";

const SUBSTANCES = [
  {
    id: "alcool",
    name: "Alcool",
    icon: "🍷",
    score: 72,
    color: "#ef4444",
    tagline: "La drogue légale la plus dangereuse au monde",
    stats: ["Cancérigène OMS groupe 1", "5 jours récupération", "Cortisol ×3-4"],
  },
  {
    id: "heroine",
    name: "Héroïne",
    icon: "💉",
    score: 55,
    color: "#a855f7",
    tagline: "Opioïde semi-synthétique à dépendance physique extrême",
    stats: ["Dépendance en 2-3 semaines", "Dopamine +200%", "Sevrage 72h pic"],
  },
  {
    id: "crack",
    name: "Crack",
    icon: "💨",
    score: 54,
    color: "#f97316",
    tagline: "Cocaine base fumable — high de 5 à 15 minutes",
    stats: ["Onset en 8 secondes", "Dopamine +400-500%", "Binge compulsif"],
  },
  {
    id: "meth",
    name: "Méthamphétamine",
    icon: "⚡",
    score: 33,
    color: "#06b6d4",
    tagline: "Stimulant 3-5× plus puissant que la cocaïne",
    stats: ["High 8-24 heures", "Neurotoxique DAT/SERT", "Psychose possible"],
  },
  {
    id: "cocaine",
    name: "Cocaïne",
    icon: "🤍",
    score: 27,
    color: "#3b82f6",
    tagline: "Stimulant puissant — bloqueur de recapture dopamine",
    stats: ["High 30-60 min", "Dopamine +250-300%", "Risque IM coronarien"],
  },
  {
    id: "tabac",
    name: "Tabac",
    icon: "🚬",
    score: 26,
    color: "#f59e0b",
    tagline: "#1 cause de mort évitable — 8 millions/an",
    stats: ["7000 composés chimiques", "Nicotine demi-vie 2h", "Cancer × risques"],
  },
  {
    id: "cannabis",
    name: "Cannabis",
    icon: "🌿",
    score: 20,
    color: "#22c55e",
    tagline: "La drogue illicite la plus consommée au monde",
    stats: ["THC agoniste CB1/CB2", "Mémoire de travail -30%", "Dépendance chez 9%"],
  },
  {
    id: "benzos",
    name: "Benzodiazépines",
    icon: "💊",
    score: 15,
    color: "#6366f1",
    tagline: "Dépresseur du SNC — dépendance médicale insidieuse",
    stats: ["Sevrage potentiellement fatal", "Tolérance en 2-4 semaines", "GABA-A modulateur"],
  },
  {
    id: "cathinones",
    name: "Cathinones",
    icon: "🩷",
    score: 13,
    color: "#ec4899",
    tagline: "3-MMC / 4-MMC — hybride cocaïne + MDMA à demi-vie courte",
    stats: ["Dopamine +380% / Séro +290%", "Redosage compulsif (2-3h)", "Risque syndrome sérotoninergique"],
  },
  {
    id: "amphetamines",
    name: "Amphétamines",
    icon: "⚡",
    score: 22,
    color: "#eab308",
    tagline: "Speed — stimulant puissant à usage médical et récréatif",
    stats: ["Durée 4–8 heures", "Dopamine +300–420%", "Usage TDAH légal (Adderall)"],
  },
  {
    id: "champignons",
    name: "Champignons",
    icon: "🍄",
    score: 6,
    color: "#9333ea",
    tagline: "Psilocybine — psychédélique naturel en révolution thérapeutique",
    stats: ["Agoniste 5-HT2A", "Zéro dépendance physique", "Thérapie dépression FDA"],
  },
  {
    id: "lsd",
    name: "LSD",
    icon: "🌀",
    score: 7,
    color: "#14b8a6",
    tagline: "Diéthylamide lysergique — 50 µg, 12 heures de voyage",
    stats: ["Actif dès 25 µg", "Trip 8–16 heures", "HPPD risque rare ~1–2%"],
  },
  {
    id: "twocb",
    name: "2C-B",
    icon: "🔮",
    score: 6,
    color: "#d946ef",
    tagline: "Phénéthylamine psychédélique — visuels riches, durée maîtrisable",
    stats: ["Dose active 10–25 mg", "Trip 4–6 heures", "Entactogène à basses doses"],
  },
  {
    id: "ketamine",
    name: "Kétamine",
    icon: "🌊",
    score: 15,
    color: "#38bdf8",
    tagline: "Dissociatif antagoniste NMDA — anesthésique et antidépresseur",
    stats: ["K-hole > 200 mg", "Cystite irréversible (usage chronique)", "Antidépresseur FDA 2019"],
  },
];

const SORTED = [...SUBSTANCES].sort((a, b) => b.score - a.score);

export default function Home({ onSelect, onCompare }) {
  const w = useWidth();
  const desk = w >= 768;

  return (
    <div style={{ minHeight: "100vh", background: "#060610", fontFamily: "'Georgia','Times New Roman',serif", color: "#e2e8f0" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(180deg, #0f0520 0%, #060610 100%)",
        padding: desk ? "56px 48px 44px" : "32px 20px 24px",
        borderBottom: "1px solid #1e1e3a",
        position: "relative", overflow: "hidden",
        textAlign: "center",
      }}>
        <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, #7c3aed18 0%, transparent 70%)" }} />
        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#7c3aed", marginBottom: 12, fontFamily: "monospace" }}>GUIDE SCIENTIFIQUE</div>
          <h1 style={{
            fontSize: desk ? 42 : 28, fontWeight: "bold", margin: "0 0 14px", lineHeight: 1.2,
            background: "linear-gradient(135deg, #fff 40%, #7c3aed)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Neuravel
          </h1>
          <p style={{ fontSize: desk ? 15 : 13, color: "#64748b", margin: "0 0 8px", lineHeight: 1.7 }}>
            Les mécanismes biologiques complets de chaque substance — effets immédiats, hormones, récupération.
          </p>
          <p style={{ fontSize: 11, color: "#475569", fontFamily: "monospace", marginBottom: 20 }}>
            Classement OMS dangerosité globale · David Nutt et al., The Lancet 2010
          </p>
          <button
            onClick={onCompare}
            style={{
              background: "#7c3aed22", border: "1px solid #7c3aed66", borderRadius: 10,
              color: "#a78bfa", cursor: "pointer", padding: "10px 24px", fontSize: 13,
              fontFamily: "monospace", letterSpacing: 1, transition: "background 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#7c3aed44"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#7c3aed22"; }}
          >
            ⚖️ Comparer deux substances
          </button>
        </div>
      </div>

      {/* WHO Bar Chart */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: desk ? "36px 48px 0" : "24px 16px 0" }}>
        <div style={{ fontSize: 11, color: "#475569", letterSpacing: 3, fontFamily: "monospace", marginBottom: 20, textAlign: "center" }}>
          SCORE DE DANGEROSITÉ — NUISANCE GLOBALE /100 (auto + autrui)
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 36 }}>
          {SORTED.map((s) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => onSelect(s.id)}>
              <div style={{ width: desk ? 130 : 90, fontSize: desk ? 13 : 11, color: "#94a3b8", textAlign: "right", flexShrink: 0 }}>
                {s.icon} {s.name}
              </div>
              <div style={{ flex: 1, height: 20, background: "#1e1e3a", borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  width: `${s.score}%`, height: "100%",
                  background: `linear-gradient(90deg, ${s.color}88, ${s.color})`,
                  borderRadius: 4,
                  display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 6,
                  transition: "width 0.8s ease",
                }}>
                  <span style={{ fontSize: 10, color: "#fff", fontFamily: "monospace", fontWeight: "bold" }}>{s.score}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drug Cards Grid */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: desk ? "0 48px 48px" : "0 16px 32px" }}>
        <div style={{ fontSize: 11, color: "#475569", letterSpacing: 3, fontFamily: "monospace", marginBottom: 20, textAlign: "center" }}>
          CHOISISSEZ UNE SUBSTANCE — GUIDE COMPLET
        </div>
        <div style={{ display: "grid", gridTemplateColumns: desk ? "1fr 1fr 1fr 1fr" : "1fr 1fr", gap: 14 }}>
          {SORTED.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              style={{
                background: "#0d0d1a",
                border: `1px solid ${s.color}33`,
                borderRadius: 14,
                padding: desk ? 20 : 14,
                cursor: "pointer",
                textAlign: "left",
                transition: "border-color 0.2s, background 0.2s",
                color: "#e2e8f0",
                fontFamily: "'Georgia','Times New Roman',serif",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = s.color + "88";
                e.currentTarget.style.background = s.color + "0a";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = s.color + "33";
                e.currentTarget.style.background = "#0d0d1a";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ fontSize: desk ? 28 : 22 }}>{s.icon}</div>
                <div style={{
                  background: s.color + "22", border: `1px solid ${s.color}44`,
                  borderRadius: 20, padding: "2px 10px",
                  fontSize: 11, color: s.color, fontFamily: "monospace",
                }}>
                  {s.score}/100
                </div>
              </div>
              <div style={{ fontSize: desk ? 15 : 13, fontWeight: "bold", color: s.color, marginBottom: 6 }}>{s.name}</div>
              <div style={{ fontSize: desk ? 11 : 10, color: "#64748b", lineHeight: 1.5, marginBottom: 12 }}>{s.tagline}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {s.stats.map((stat, i) => (
                  <div key={i} style={{ fontSize: 10, color: "#475569", fontFamily: "monospace" }}>
                    · {stat}
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: 14, fontSize: 11, color: s.color,
                display: "flex", alignItems: "center", gap: 4, fontFamily: "monospace",
              }}>
                Voir le guide →
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 48px 36px", borderTop: "1px solid #1e1e3a", textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "#334155", letterSpacing: 1, fontFamily: "monospace" }}>
          CONTENU ÉDUCATIF BASÉ SUR DES DONNÉES PEER-REVIEWED · OMS · The Lancet · NIH · NIDA
        </div>
      </div>
    </div>
  );
}
