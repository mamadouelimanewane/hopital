"use client";
import { useState } from "react";

const ACCENT = "#8b5cf6";
const BG = "#050d1a";
const CARD = "#0a1628";
const BORDER = "1px solid rgba(255,255,255,0.06)";
const TEXT = "#e2e8f0";
const MUTED = "#64748b";

const patients = [
  { init: "M.D.", diagnostic: "Dépression majeure", medecin: "Dr. Sall", statut: "Suivi actif", prochaine: "23 Jun 2026", seances: 12 },
  { init: "F.N.", diagnostic: "Trouble anxieux généralisé", medecin: "Dr. Diop", statut: "Suivi actif", prochaine: "24 Jun 2026", seances: 7 },
  { init: "A.B.", diagnostic: "Trouble bipolaire type I", medecin: "Dr. Sall", statut: "Stabilisé", prochaine: "01 Jul 2026", seances: 24 },
  { init: "O.K.", diagnostic: "Schizophrénie paranoïde", medecin: "Dr. Niang", statut: "Hospitalisation", prochaine: "22 Jun 2026", seances: 31 },
  { init: "R.T.", diagnostic: "PTSD", medecin: "Dr. Diop", statut: "Suivi actif", prochaine: "25 Jun 2026", seances: 9 },
  { init: "S.M.", diagnostic: "TOC", medecin: "Dr. Niang", statut: "Suivi actif", prochaine: "26 Jun 2026", seances: 15 },
];

const consultations = [
  { init: "M.D.", type: "Individuelle", jour: "Lun 23 Jun", heure: "09h00", duree: "50 min", salle: "Salle Calme 1" },
  { init: "F.N.", type: "Individuelle", jour: "Lun 23 Jun", heure: "10h30", duree: "50 min", salle: "Salle Calme 2" },
  { init: "Groupe A", type: "Groupe", jour: "Mar 24 Jun", heure: "14h00", duree: "90 min", salle: "Salle Thérapie" },
  { init: "O.K.", type: "Famille", jour: "Mer 25 Jun", heure: "11h00", duree: "60 min", salle: "Salle Famille" },
  { init: "R.T.", type: "Individuelle", jour: "Jeu 26 Jun", heure: "15h30", duree: "50 min", salle: "Salle Calme 1" },
];

const programmes = [
  { nom: "Thérapie Cognitive Comportementale (TCC)", participants: 18, seances: 3, prochain: "Mar 24 Jun — 10h00", couleur: ACCENT, icon: "🧠" },
  { nom: "Méditation & Pleine Conscience", participants: 24, seances: 5, prochain: "Lun 23 Jun — 08h00", couleur: "#06b6d4", icon: "🧘" },
  { nom: "Art-thérapie", participants: 12, seances: 2, prochain: "Mer 25 Jun — 14h00", couleur: "#f59e0b", icon: "🎨" },
  { nom: "Groupe de Parole", participants: 15, seances: 2, prochain: "Ven 27 Jun — 16h00", couleur: "#84cc16", icon: "💬" },
];

const typeColors: Record<string, string> = { "Individuelle": ACCENT, "Groupe": "#06b6d4", "Famille": "#f59e0b" };

export default function PsychPage() {
  const [tab, setTab] = useState(0);
  const tabs = ["Patients", "Consultations", "Programmes", "Ressources"];

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
        {/* Bandeau confidentialité */}
        <div style={{ background: `${ACCENT}11`, border: `1px solid ${ACCENT}33`, borderRadius: 10, padding: "0.75rem 1.25rem", marginBottom: "1.5rem", display: "flex", gap: 10, alignItems: "center", animation: "fadeUp .4s ease both" }}>
          <span style={{ fontSize: 16 }}>🔒</span>
          <span style={{ fontSize: 12, color: MUTED }}>Données anonymisées conformément au secret médical psychiatrique — Accès restreint au personnel habilité</span>
        </div>

        {/* Header */}
        <div style={{ animation: "fadeUp .5s ease both", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: `${ACCENT}22`, border: `1px solid ${ACCENT}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🧠</div>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: TEXT, margin: 0 }}>PsychCare <span style={{ color: ACCENT }}>CHNCAK</span></h1>
              <p style={{ color: MUTED, fontSize: 13, margin: 0 }}>Psychiatrie & Santé Mentale — Unité Spécialisée</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "2rem", animation: "fadeUp .5s .1s ease both" }}>
          {[
            { label: "Patients suivis", val: "78", icon: "👥", color: ACCENT },
            { label: "Psychiatres", val: "12", icon: "👨‍⚕️", color: "#06b6d4" },
            { label: "Psychologues", val: "4", icon: "🧬", color: "#f59e0b" },
            { label: "Incidents (30j)", val: "0", icon: "✅", color: "#84cc16" },
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
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Patients — Identités anonymisées</h2>
                <span style={{ fontSize: 12, color: MUTED }}>Données strictement confidentielles</span>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                      {["Patient", "Diagnostic", "Médecin référent", "Statut", "Séances", "Prochaine RDV"].map((h, i) => (
                        <th key={i} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: BORDER }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((p, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${ACCENT}22`, border: `1px solid ${ACCENT}33`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: ACCENT }}>{p.init}</div>
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: TEXT }}>{p.diagnostic}</td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: MUTED }}>{p.medecin}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ background: p.statut === "Hospitalisation" ? "rgba(239,68,68,0.15)" : `${ACCENT}15`, color: p.statut === "Hospitalisation" ? "#ef4444" : p.statut === "Stabilisé" ? "#84cc16" : ACCENT, border: `1px solid ${p.statut === "Hospitalisation" ? "rgba(239,68,68,0.3)" : `${ACCENT}33`}`, borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>{p.statut}</span>
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: ACCENT, fontWeight: 600 }}>{p.seances}</td>
                        <td style={{ padding: "14px 16px", fontSize: 12, color: MUTED }}>{p.prochaine}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab Consultations */}
        {tab === 1 && (
          <div style={{ animation: "fadeUp .3s ease both", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ background: CARD, border: BORDER, borderRadius: 14, padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Planning — Semaine du 23 au 27 Jun 2026</h2>
              <span style={{ fontSize: 12, color: MUTED }}>5 consultations programmées</span>
            </div>
            {consultations.map((c, i) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${typeColors[c.type]}33`, borderRadius: 14, padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1.5rem", borderLeft: `3px solid ${typeColors[c.type]}` }}>
                <div style={{ textAlign: "center", minWidth: 70 }}>
                  <div style={{ fontSize: 11, color: MUTED, marginBottom: 2 }}>{c.jour.split(" ")[0]}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: typeColors[c.type] }}>{c.heure}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{c.init}</div>
                  <div style={{ fontSize: 12, color: MUTED }}>{c.jour} · {c.duree} · {c.salle}</div>
                </div>
                <span style={{ background: `${typeColors[c.type]}22`, color: typeColors[c.type], border: `1px solid ${typeColors[c.type]}44`, borderRadius: 8, padding: "4px 14px", fontSize: 12, fontWeight: 700 }}>{c.type}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tab Programmes */}
        {tab === 2 && (
          <div style={{ animation: "fadeUp .3s ease both", display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1rem" }}>
            {programmes.map((prog, i) => (
              <div key={i} style={{ background: CARD, border: BORDER, borderRadius: 16, padding: "1.5rem", borderTop: `2px solid ${prog.couleur}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1rem" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${prog.couleur}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{prog.icon}</div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: TEXT, margin: 0, lineHeight: 1.3 }}>{prog.nom}</h3>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                  <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "0.75rem", textAlign: "center" }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: prog.couleur }}>{prog.participants}</div>
                    <div style={{ fontSize: 11, color: MUTED }}>participants</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "0.75rem", textAlign: "center" }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: prog.couleur }}>{prog.seances}</div>
                    <div style={{ fontSize: 11, color: MUTED }}>séances/semaine</div>
                  </div>
                </div>
                <div style={{ background: `${prog.couleur}11`, borderRadius: 10, padding: "0.75rem" }}>
                  <div style={{ fontSize: 11, color: MUTED, marginBottom: 2 }}>PROCHAIN ATELIER</div>
                  <div style={{ fontSize: 13, color: prog.couleur, fontWeight: 600 }}>{prog.prochain}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Ressources */}
        {tab === 3 && (
          <div style={{ animation: "fadeUp .3s ease both", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Urgence */}
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 14, padding: "1.5rem" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#ef4444", marginBottom: "1rem" }}>🆘 Ligne d'écoute & Urgences Psychiatriques</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
                {[
                  { label: "Ligne d'écoute 24h/24", num: "800 000 001", color: "#ef4444" },
                  { label: "Urgences CHNCAK", num: "33 869 00 00", color: "#f59e0b" },
                  { label: "SAMU / Urgences", num: "15", color: "#8b5cf6" },
                ].map((c, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "1rem", textAlign: "center" }}>
                    <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>{c.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: c.color }}>{c.num}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Ressources documentaires */}
            <div style={{ background: CARD, border: BORDER, borderRadius: 14, padding: "1.5rem" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 1rem" }}>Ressources Documentaires</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  { titre: "Guide de prise en charge de la dépression", type: "PDF", categorie: "Protocole clinique" },
                  { titre: "Manuel TCC — Praticien", type: "PDF", categorie: "Formation" },
                  { titre: "Échelle HAM-D — Hamilton Depression", type: "Outil", categorie: "Évaluation" },
                  { titre: "Protocole de crise suicidaire", type: "PDF", categorie: "Urgence" },
                  { titre: "Formulaires de consentement éclairé", type: "DOCX", categorie: "Administratif" },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: BORDER }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{r.titre}</div>
                      <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{r.categorie}</div>
                    </div>
                    <span style={{ background: `${ACCENT}22`, color: ACCENT, borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>{r.type}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Conseils bien-être */}
            <div style={{ background: CARD, border: BORDER, borderRadius: 14, padding: "1.5rem" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 1rem" }}>Conseils Bien-être pour Patients</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "0.75rem" }}>
                {[
                  { icon: "🌙", titre: "Hygiène du sommeil", desc: "Coucher et lever réguliers, éviter écrans avant le sommeil" },
                  { icon: "🚶", titre: "Activité physique", desc: "30 min de marche quotidienne réduit les symptômes dépressifs" },
                  { icon: "🍎", titre: "Alimentation équilibrée", desc: "Oméga-3 et vitamine B ont un impact sur l'humeur" },
                  { icon: "🤝", titre: "Lien social", desc: "Maintenir des relations sociales protège contre la dépression" },
                ].map((c, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "1rem", display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 24 }}>{c.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{c.titre}</div>
                      <div style={{ fontSize: 12, color: MUTED }}>{c.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
