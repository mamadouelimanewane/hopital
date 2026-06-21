"use client";
import { useState } from "react";

const ACCENT = "#06b6d4";
const BG = "#050d1a";
const CARD = "#0a1628";
const BORDER = "1px solid rgba(255,255,255,0.06)";
const TEXT = "#e2e8f0";
const MUTED = "#64748b";

const patients = [
  { nom: "Moussa Diallo", pathologie: "AVC ischémique", programme: "Rééducation neuromotrice", kine: "K. Badji", progression: 72, prochaine: "23 Jun 09h00" },
  { nom: "Awa Ndiaye", pathologie: "Fracture du genou", programme: "Réhabilitation orthopédique", kine: "S. Faye", progression: 55, prochaine: "23 Jun 14h00" },
  { nom: "Lamine Sarr", pathologie: "Chirurgie épaule", programme: "Récupération post-op", kine: "K. Badji", progression: 38, prochaine: "24 Jun 10h30" },
  { nom: "Binta Mbaye", pathologie: "Sclérose en plaques", programme: "Maintien fonctionnel", kine: "O. Diop", progression: 61, prochaine: "25 Jun 08h00" },
  { nom: "Oumar Fall", pathologie: "Lombalgie chronique", programme: "Rééducation rachidienne", kine: "S. Faye", progression: 84, prochaine: "26 Jun 11h00" },
  { nom: "Mariama Sow", pathologie: "Hémiplégie droite", programme: "Rééducation neuromotrice", kine: "O. Diop", progression: 29, prochaine: "23 Jun 16h00" },
];

const jours = ["Lun 23", "Mar 24", "Mer 25", "Jeu 26", "Ven 27"];
const creneaux = ["08h00", "10h00", "14h00", "16h00"];
const planning: (string | null)[][] = [
  ["M. Diallo", "L. Sarr", "B. Mbaye", null],
  ["A. Ndiaye", null, "O. Fall", "M. Sow"],
  ["M. Diallo", "B. Mbaye", null, "A. Ndiaye"],
  ["L. Sarr", "O. Fall", "M. Sow", null],
  [null, "M. Diallo", "A. Ndiaye", "O. Fall"],
];

const equipements = [
  { nom: "Vélo ergomètre A1", type: "Cardio", statut: "Disponible", plateau: "Plateau 1" },
  { nom: "Tapis roulant T3", type: "Cardio", statut: "Occupé", plateau: "Plateau 1" },
  { nom: "Bain bouillonnant", type: "Hydrothérapie", statut: "Disponible", plateau: "Plateau 2" },
  { nom: "Poulie de rééducation", type: "Musculation", statut: "Disponible", plateau: "Plateau 3" },
  { nom: "Cycloergomètre bras", type: "Cardio", statut: "Maintenance", plateau: "Plateau 1" },
  { nom: "Plateforme de stabilité", type: "Proprioception", statut: "Disponible", plateau: "Plateau 4" },
  { nom: "Table d'électrostimulation", type: "Électrothérapie", statut: "Occupé", plateau: "Plateau 2" },
  { nom: "Échelle thérapeutique", type: "Rééducation", statut: "Disponible", plateau: "Plateau 3" },
];

const progresPts = [
  { nom: "M. Diallo", color: ACCENT, pts: [20, 28, 35, 44, 52, 61, 68, 72] },
  { nom: "A. Ndiaye", color: "#84cc16", pts: [10, 18, 24, 30, 38, 45, 50, 55] },
  { nom: "O. Fall", color: "#f59e0b", pts: [40, 50, 58, 65, 70, 76, 81, 84] },
];

function statutColor(s: string) {
  if (s === "Disponible") return "#84cc16";
  if (s === "Occupé") return ACCENT;
  return "#f59e0b";
}

function progressBar(pct: number) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: pct > 70 ? "#84cc16" : pct > 40 ? ACCENT : "#f59e0b", borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: pct > 70 ? "#84cc16" : pct > 40 ? ACCENT : "#f59e0b", minWidth: 32 }}>{pct}%</span>
    </div>
  );
}

export default function RehabPage() {
  const [tab, setTab] = useState(0);
  const tabs = ["Patients", "Séances", "Équipements", "Progrès"];

  // SVG chart helpers
  const W = 480, H = 160, PX = 40, PY = 16;
  function ptX(i: number) { return PX + (i / 7) * (W - PX * 2); }
  function ptY(v: number) { return H - PY - (v / 100) * (H - PY * 2); }
  function polyline(pts: number[]) {
    return pts.map((v, i) => `${ptX(i)},${ptY(v)}`).join(" ");
  }

  return (
    <div style={{ minHeight: "100vh", background: BG, color: TEXT, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        *{box-sizing:border-box;}
      `}</style>

      {/* Nav */}
      <div style={{ position: "sticky", top: 0, zIndex: 200, background: "rgba(5,13,26,0.96)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(14,165,233,0.12)", padding: "0 1.5rem", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>← Portail CHNCAK</a>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>CHNCAK Suite</span>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Header */}
        <div style={{ animation: "fadeUp .5s ease both", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: `${ACCENT}22`, border: `1px solid ${ACCENT}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🏃</div>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: TEXT, margin: 0 }}>RehabTrack <span style={{ color: ACCENT }}>CHNCAK</span></h1>
              <p style={{ color: MUTED, fontSize: 13, margin: 0 }}>Rééducation & Kinésithérapie — Suivi de physiothérapie</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "2rem", animation: "fadeUp .5s .1s ease both" }}>
          {[
            { label: "Patients en rééducation", val: "156", icon: "🏥", color: ACCENT },
            { label: "Kinésithérapeutes", val: "18", icon: "💪", color: "#8b5cf6" },
            { label: "Objectifs atteints", val: "92%", icon: "🎯", color: "#84cc16" },
            { label: "Plateaux thérapeutiques", val: "4", icon: "🏋️", color: "#f59e0b" },
          ].map((s, i) => (
            <div key={i} style={{ background: CARD, border: BORDER, borderRadius: 14, padding: "1.25rem", borderTop: `2px solid ${s.color}` }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, background: CARD, border: BORDER, borderRadius: 12, padding: 4, marginBottom: "1.5rem", width: "fit-content" }}>
          {tabs.map((t, i) => (
            <button key={i} onClick={() => setTab(i)} style={{ padding: "8px 20px", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", background: tab === i ? `${ACCENT}22` : "transparent", color: tab === i ? ACCENT : MUTED, transition: "all .2s" }}>
              {t}
            </button>
          ))}
        </div>

        {/* Tab Patients */}
        {tab === 0 && (
          <div style={{ animation: "fadeUp .3s ease both" }}>
            <div style={{ background: CARD, border: BORDER, borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "1rem 1.5rem", borderBottom: BORDER }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Patients en rééducation active</h2>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                      {["Patient", "Pathologie", "Programme", "Kiné assigné", "Progression", "Prochaine séance"].map((h, i) => (
                        <th key={i} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: BORDER }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((p, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding: "14px 16px", fontWeight: 600, fontSize: 14 }}>{p.nom}</td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: MUTED }}>{p.pathologie}</td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: ACCENT }}>{p.programme}</td>
                        <td style={{ padding: "14px 16px", fontSize: 13 }}>{p.kine}</td>
                        <td style={{ padding: "14px 16px", minWidth: 160 }}>{progressBar(p.progression)}</td>
                        <td style={{ padding: "14px 16px", fontSize: 12, color: MUTED }}>{p.prochaine}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab Séances */}
        {tab === 1 && (
          <div style={{ animation: "fadeUp .3s ease both" }}>
            <div style={{ background: CARD, border: BORDER, borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "1rem 1.5rem", borderBottom: BORDER }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Planning hebdomadaire — Semaine 26</h2>
              </div>
              <div style={{ overflowX: "auto", padding: "1rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "10px 12px", fontSize: 11, color: MUTED, textAlign: "left", fontWeight: 700, width: 80 }}>Créneau</th>
                      {jours.map((j, i) => (
                        <th key={i} style={{ padding: "10px 12px", fontSize: 12, color: TEXT, textAlign: "center", fontWeight: 700 }}>{j}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {creneaux.map((cr, ri) => (
                      <tr key={ri}>
                        <td style={{ padding: "8px 12px", fontSize: 12, color: MUTED, fontWeight: 600 }}>{cr}</td>
                        {jours.map((_, ci) => {
                          const val = planning[ci][ri];
                          return (
                            <td key={ci} style={{ padding: "6px 8px", textAlign: "center" }}>
                              {val ? (
                                <div style={{ background: `${ACCENT}22`, border: `1px solid ${ACCENT}44`, borderRadius: 8, padding: "6px 10px", fontSize: 12, color: ACCENT, fontWeight: 600 }}>{val}</div>
                              ) : (
                                <div style={{ height: 34, borderRadius: 8, background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.06)" }} />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab Équipements */}
        {tab === 2 && (
          <div style={{ animation: "fadeUp .3s ease both", display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1rem" }}>
            {equipements.map((eq, i) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${statutColor(eq.statut)}33`, borderRadius: 14, padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{eq.nom}</div>
                  <div style={{ fontSize: 12, color: MUTED }}>{eq.type} · {eq.plateau}</div>
                </div>
                <span style={{ background: `${statutColor(eq.statut)}22`, color: statutColor(eq.statut), border: `1px solid ${statutColor(eq.statut)}44`, borderRadius: 8, padding: "4px 14px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
                  {eq.statut === "Disponible" ? "✓ " : eq.statut === "Maintenance" ? "⚙ " : "● "}{eq.statut}
                </span>
              </div>
            ))}
            <div style={{ gridColumn: "1/-1", background: CARD, border: BORDER, borderRadius: 14, padding: "1rem 1.5rem" }}>
              <div style={{ display: "flex", gap: "2rem" }}>
                {[{ label: "Disponibles", val: equipements.filter(e => e.statut === "Disponible").length, color: "#84cc16" },
                  { label: "Occupés", val: equipements.filter(e => e.statut === "Occupé").length, color: ACCENT },
                  { label: "Maintenance", val: equipements.filter(e => e.statut === "Maintenance").length, color: "#f59e0b" }
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: r.color }} />
                    <span style={{ fontSize: 13, color: MUTED }}>{r.label} :</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: r.color }}>{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Progrès */}
        {tab === 3 && (
          <div style={{ animation: "fadeUp .3s ease both", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ background: CARD, border: BORDER, borderRadius: 16, padding: "1.5rem" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 1.5rem" }}>Évolution de la progression — 8 semaines</h3>
              <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", background: "rgba(255,255,255,0.02)", borderRadius: 10 }}>
                {/* Grid horizontal */}
                {[0, 25, 50, 75, 100].map((v, i) => (
                  <g key={i}>
                    <line x1={PX} y1={ptY(v)} x2={W - PX} y2={ptY(v)} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
                    <text x={PX - 6} y={ptY(v) + 4} textAnchor="end" fill={MUTED} fontSize={9}>{v}%</text>
                  </g>
                ))}
                {/* Grid vertical */}
                {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                  <g key={i}>
                    <line x1={ptX(i)} y1={PY} x2={ptX(i)} y2={H - PY} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
                    <text x={ptX(i)} y={H - 2} textAnchor="middle" fill={MUTED} fontSize={9}>S{i + 1}</text>
                  </g>
                ))}
                {/* Lignes */}
                {progresPts.map((p, i) => (
                  <g key={i}>
                    <polyline points={polyline(p.pts)} fill="none" stroke={p.color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
                    {p.pts.map((v, j) => (
                      <circle key={j} cx={ptX(j)} cy={ptY(v)} r={3.5} fill={p.color} />
                    ))}
                  </g>
                ))}
              </svg>
              {/* Légende */}
              <div style={{ display: "flex", gap: "2rem", marginTop: "1rem" }}>
                {progresPts.map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 24, height: 3, background: p.color, borderRadius: 2 }} />
                    <span style={{ fontSize: 13, color: MUTED }}>{p.nom}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: p.color }}>{p.pts[p.pts.length - 1]}%</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Mini stats individuelles */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
              {patients.slice(0, 3).map((p, i) => (
                <div key={i} style={{ background: CARD, border: BORDER, borderRadius: 14, padding: "1.25rem" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{p.nom}</div>
                  <div style={{ fontSize: 12, color: MUTED, marginBottom: "1rem" }}>{p.pathologie}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: MUTED }}>Progression globale</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: ACCENT }}>{p.progression}%</span>
                  </div>
                  <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4 }}>
                    <div style={{ width: `${p.progression}%`, height: "100%", background: `linear-gradient(90deg, ${ACCENT}, #0284c7)`, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
