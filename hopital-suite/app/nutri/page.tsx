"use client";
import { useState } from "react";

const ACCENT = "#84cc16";
const BG = "#050d1a";
const CARD = "#0a1628";
const BORDER = "1px solid rgba(255,255,255,0.06)";
const TEXT = "#e2e8f0";
const MUTED = "#64748b";

const patients = [
  { nom: "Aminata Diallo", service: "Médecine Interne", nrs: 4, imc: 16.2, plan: "Hypercalorique", eval: "18 Jun 2026", etat: "Critique" },
  { nom: "Moussa Ndiaye", service: "Chirurgie", nrs: 2, imc: 22.1, plan: "Post-opératoire", eval: "19 Jun 2026", etat: "Bon" },
  { nom: "Fatou Seck", service: "Pédiatrie", nrs: 3, imc: 14.8, plan: "Pédiatrique", eval: "20 Jun 2026", etat: "À risque" },
  { nom: "Ibrahima Fall", service: "Nephrologie", nrs: 3, imc: 19.5, plan: "Insuffisance rénale", eval: "17 Jun 2026", etat: "À risque" },
  { nom: "Rokhaya Mbaye", service: "Endocrinologie", nrs: 1, imc: 26.3, plan: "Diabète type 2", eval: "21 Jun 2026", etat: "Bon" },
  { nom: "Cheikh Sarr", service: "Réanimation", nrs: 5, imc: 15.1, plan: "Nutrition entérale", eval: "21 Jun 2026", etat: "Critique" },
];

const plans = [
  { nom: "Diabète type 2", calories: 1800, proteines: "70g", restrictions: "Sucres simples, graisses saturées", patients: 42, couleur: "#f59e0b" },
  { nom: "Insuffisance rénale", calories: 2000, proteines: "50g", restrictions: "Potassium, phosphore, sodium", patients: 28, couleur: "#06b6d4" },
  { nom: "Post-opératoire", calories: 2500, proteines: "100g", restrictions: "Fibres les 48h post-op", patients: 61, couleur: "#8b5cf6" },
  { nom: "Pédiatrique", calories: 1200, proteines: "40g", restrictions: "Adaptées à l'âge", patients: 35, couleur: "#ec4899" },
];

const alertes = [
  { patient: "Cheikh Sarr", service: "Réanimation", nrs: 5, action: "Initier nutrition parentérale d'urgence, consulter réanimateur" },
  { patient: "Aminata Diallo", service: "Médecine Interne", nrs: 4, action: "Supplément hypercalorique oral + réévaluation J+3" },
  { patient: "Fatou Seck", service: "Pédiatrie", nrs: 3, action: "Adapter plan pédiatrique, contrôle poids quotidien" },
  { patient: "Ibrahima Fall", service: "Nephrologie", nrs: 3, action: "Bilan biologique nutritionnel, ajustement protéines" },
];

const etats = [
  { label: "Bon", count: 98, color: "#84cc16" },
  { label: "À risque", count: 112, color: "#f59e0b" },
  { label: "Critique", count: 37, color: "#ef4444" },
];

const carences = [
  { label: "Vitamine D", pct: 68 },
  { label: "Fer", pct: 54 },
  { label: "Protéines", pct: 47 },
  { label: "Zinc", pct: 31 },
  { label: "Vitamine B12", pct: 22 },
];

function badgeEtat(etat: string) {
  const colors: Record<string, string> = { "Bon": "#84cc16", "À risque": "#f59e0b", "Critique": "#ef4444" };
  const c = colors[etat] || MUTED;
  return (
    <span style={{ background: `${c}22`, color: c, border: `1px solid ${c}44`, borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
      {etat}
    </span>
  );
}

export default function NutriPage() {
  const [tab, setTab] = useState(0);
  const tabs = ["Patients", "Plans Nutritionnels", "Alertes", "Statistiques"];

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
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: `${ACCENT}22`, border: `1px solid ${ACCENT}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🥗</div>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: TEXT, margin: 0 }}>NutriCare <span style={{ color: ACCENT }}>CHNCAK</span></h1>
              <p style={{ color: MUTED, fontSize: 13, margin: 0 }}>Nutrition Médicale & Diététique Clinique</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "2rem", animation: "fadeUp .5s .1s ease both" }}>
          {[
            { label: "Patients suivis", val: "247", icon: "👥", color: ACCENT },
            { label: "Diétiticiens", val: "8", icon: "👩‍⚕️", color: "#06b6d4" },
            { label: "Plans actifs", val: "94%", icon: "📋", color: "#8b5cf6" },
            { label: "Alertes dénutrition", val: "12", icon: "⚠️", color: "#ef4444" },
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
              <div style={{ padding: "1rem 1.5rem", borderBottom: BORDER, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Patients hospitalisés — Suivi nutritionnel</h2>
                <span style={{ fontSize: 12, color: MUTED }}>247 patients au total</span>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                      {["Patient", "Service", "Score NRS", "IMC", "Plan actif", "Dernière éval.", "État"].map((h, i) => (
                        <th key={i} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: BORDER }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((p, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding: "14px 16px", fontWeight: 600, fontSize: 14 }}>{p.nom}</td>
                        <td style={{ padding: "14px 16px", color: MUTED, fontSize: 13 }}>{p.service}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ color: p.nrs >= 4 ? "#ef4444" : p.nrs >= 3 ? "#f59e0b" : ACCENT, fontWeight: 700, fontSize: 16 }}>{p.nrs}</span>
                          <span style={{ color: MUTED, fontSize: 11 }}>/7</span>
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: p.imc < 18.5 ? "#ef4444" : TEXT }}>{p.imc}</td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: ACCENT }}>{p.plan}</td>
                        <td style={{ padding: "14px 16px", fontSize: 12, color: MUTED }}>{p.eval}</td>
                        <td style={{ padding: "14px 16px" }}>{badgeEtat(p.etat)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab Plans */}
        {tab === 1 && (
          <div style={{ animation: "fadeUp .3s ease both", display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1rem" }}>
            {plans.map((plan, i) => (
              <div key={i} style={{ background: CARD, border: BORDER, borderRadius: 16, padding: "1.5rem", borderLeft: `3px solid ${plan.couleur}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: plan.couleur, margin: 0 }}>{plan.nom}</h3>
                  <span style={{ background: `${plan.couleur}22`, color: plan.couleur, borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>{plan.patients} patients</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                  <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "0.75rem" }}>
                    <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>CALORIES/JOUR</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: TEXT }}>{plan.calories} <span style={{ fontSize: 12, color: MUTED }}>kcal</span></div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "0.75rem" }}>
                    <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>PROTÉINES/JOUR</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: TEXT }}>{plan.proteines}</div>
                  </div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "0.75rem" }}>
                  <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>RESTRICTIONS</div>
                  <div style={{ fontSize: 13, color: TEXT }}>{plan.restrictions}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Alertes */}
        {tab === 2 && (
          <div style={{ animation: "fadeUp .3s ease both", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20, animation: "pulse 2s infinite" }}>🚨</span>
              <span style={{ color: "#ef4444", fontWeight: 600, fontSize: 14 }}>12 alertes dénutrition actives — Intervention diététique requise</span>
            </div>
            {alertes.map((a, i) => (
              <div key={i} style={{ background: CARD, border: "1px solid rgba(239,68,68,0.2)", borderRadius: 14, padding: "1.25rem 1.5rem", display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "#ef4444", fontWeight: 800, fontSize: 18 }}>{a.nrs}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{a.patient}</span>
                    <span style={{ fontSize: 12, color: MUTED, background: "rgba(255,255,255,0.05)", borderRadius: 6, padding: "2px 10px" }}>{a.service}</span>
                  </div>
                  <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>Score NRS : <span style={{ color: "#ef4444", fontWeight: 700 }}>{a.nrs}/7</span> — Dénutrition {a.nrs >= 5 ? "sévère" : "modérée"}</div>
                  <div style={{ fontSize: 13, color: "#fbbf24", background: "rgba(251,191,36,0.06)", borderRadius: 8, padding: "8px 12px" }}>💡 {a.action}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Statistiques */}
        {tab === 3 && (
          <div style={{ animation: "fadeUp .3s ease both", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div style={{ background: CARD, border: BORDER, borderRadius: 16, padding: "1.5rem" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: "1.5rem", margin: "0 0 1.5rem" }}>Distribution États Nutritionnels</h3>
              <svg viewBox="0 0 320 180" style={{ width: "100%", marginBottom: "1.5rem" }}>
                {etats.map((e, i) => {
                  const pct = e.count / 247;
                  const w = pct * 260;
                  return (
                    <g key={i}>
                      <rect x={20} y={20 + i * 48} width={w} height={32} rx={8} fill={e.color} fillOpacity={0.8} />
                      <text x={30} y={42 + i * 48} fill="#fff" fontSize={13} fontWeight="700">{e.label}</text>
                      <text x={290} y={42 + i * 48} textAnchor="end" fill={e.color} fontSize={13} fontWeight="700">{e.count}</text>
                    </g>
                  );
                })}
              </svg>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {etats.map((e, i) => {
                  const pct = Math.round(e.count / 247 * 100);
                  return (
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 13 }}>{e.label}</span>
                        <span style={{ fontSize: 13, color: e.color, fontWeight: 700 }}>{pct}%</span>
                      </div>
                      <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: e.color, borderRadius: 3 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ background: CARD, border: BORDER, borderRadius: 16, padding: "1.5rem" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 1.5rem" }}>Top 5 Carences Détectées</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {carences.map((c, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13 }}>{c.label}</span>
                      <span style={{ fontSize: 13, color: ACCENT, fontWeight: 700 }}>{c.pct}%</span>
                    </div>
                    <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4 }}>
                      <div style={{ width: `${c.pct}%`, height: "100%", background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT}88)`, borderRadius: 4 }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "1.5rem", background: `${ACCENT}11`, border: `1px solid ${ACCENT}33`, borderRadius: 10, padding: "1rem" }}>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>RECOMMANDATION PRIORITAIRE</div>
                <div style={{ fontSize: 13, color: TEXT }}>Supplémenter systématiquement en Vitamine D les patients hospitalisés plus de 7 jours</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
