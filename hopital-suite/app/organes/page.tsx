"use client";
import { useState } from "react";

const ACCENT = "#ec4899";
const BG = "#050d1a";
const CARD = "#0a1628";
const BORDER = "1px solid rgba(255,255,255,0.06)";
const TEXT = "#e2e8f0";
const MUTED = "#64748b";

const patientsAttente = [
  { init: "A.D.", organe: "Rein", groupe: "A+", delai: "6 mois", urgence: "P1" },
  { init: "M.N.", organe: "Foie", groupe: "O-", delai: "3 mois", urgence: "P1" },
  { init: "F.S.", organe: "Cœur", groupe: "B+", delai: "1 mois", urgence: "P1" },
  { init: "I.F.", organe: "Rein", groupe: "AB+", delai: "12 mois", urgence: "P2" },
  { init: "R.T.", organe: "Cornée", groupe: "A-", delai: "18 mois", urgence: "P3" },
];

const organes = [
  { nom: "Rein", icon: "🫘", dispo: 2, compat: 8, statut: "Disponible", color: ACCENT },
  { nom: "Foie", icon: "🫀", dispo: 1, compat: 3, statut: "Disponible", color: "#f59e0b" },
  { nom: "Cœur", icon: "❤️", dispo: 0, compat: 1, statut: "En attente", color: "#ef4444" },
  { nom: "Cornée", icon: "👁️", dispo: 4, compat: 12, statut: "Disponible", color: "#8b5cf6" },
];

const etapes = [
  { num: "01", titre: "Identification du donneur", desc: "Déclaration de mort encéphalique, bilan médical complet, accord famille", delai: "< 2h", color: ACCENT },
  { num: "02", titre: "Bilan de compatibilité", desc: "Groupage, cross-match, sérologies, critères d'exclusion", delai: "2-4h", color: "#f59e0b" },
  { num: "03", titre: "Attribution & Logistique", desc: "Contact centre receveur, transport organe, équipe chirurgicale mobilisée", delai: "4-6h", color: "#8b5cf6" },
  { num: "04", titre: "Transplantation", desc: "Intervention chirurgicale, surveillance post-op, immunosuppression", delai: "6-12h", color: "#84cc16" },
];

const urgenceColor: Record<string, string> = { "P1": "#ef4444", "P2": "#f59e0b", "P3": "#84cc16" };

type FormState = {
  nom: string;
  naissance: string;
  groupe: string;
  organes: string[];
  consentement: boolean;
};

export default function OrganesPage() {
  const [showModal, setShowModal] = useState(false);
  const [compteur, setCompteur] = useState(1247);
  const [form, setForm] = useState<FormState>({
    nom: "",
    naissance: "",
    groupe: "",
    organes: [],
    consentement: false,
  });

  const organesOptions = ["Rein", "Foie", "Cœur", "Poumons", "Cornée", "Pancréas"];

  function toggleOrgane(o: string) {
    setForm(f => ({
      ...f,
      organes: f.organes.includes(o) ? f.organes.filter(x => x !== o) : [...f.organes, o],
    }));
  }

  function handleSubmit() {
    if (!form.nom || !form.groupe || !form.consentement || form.organes.length === 0) return;
    setCompteur(c => c + 1);
    setShowModal(true);
    setForm({ nom: "", naissance: "", groupe: "", organes: [], consentement: false });
  }

  return (
    <div style={{ minHeight: "100vh", background: BG, color: TEXT, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes countUp { from{transform:scale(1.3);color:#ec4899} to{transform:scale(1)} }
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
            <div style={{ width: 48, height: 48, borderRadius: 14, background: `${ACCENT}22`, border: `1px solid ${ACCENT}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>❤️</div>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: TEXT, margin: 0 }}>DonOrganes — <span style={{ color: ACCENT }}>Registre CHNCAK</span></h1>
              <p style={{ color: MUTED, fontSize: 13, margin: 0 }}>Registre National de Don d'Organes & Transplantation</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "2rem", animation: "fadeUp .5s .1s ease both" }}>
          {[
            { label: "Donneurs enregistrés", val: compteur.toLocaleString("fr-FR"), icon: "💝", color: ACCENT },
            { label: "Greffes cette année", val: "8", icon: "🏥", color: "#84cc16" },
            { label: "Patients en attente", val: "34", icon: "⏳", color: "#f59e0b" },
            { label: "Centres partenaires", val: "3", icon: "🤝", color: "#8b5cf6" },
          ].map((s, i) => (
            <div key={i} style={{ background: CARD, border: BORDER, borderRadius: 14, padding: "1.25rem", borderTop: `2px solid ${s.color}` }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Section: Patients en attente */}
        <div style={{ marginBottom: "2rem", animation: "fadeUp .5s .15s ease both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
            <div style={{ width: 4, height: 20, background: "#ef4444", borderRadius: 2 }} />
            <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: "#ef4444" }}>Patients en attente de greffe</h2>
            <span style={{ fontSize: 12, color: MUTED, marginLeft: "auto", animation: "pulse 2s infinite" }}>● URGENT</span>
          </div>
          <div style={{ background: CARD, border: "1px solid rgba(239,68,68,0.2)", borderRadius: 16, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(239,68,68,0.06)" }}>
                  {["Patient", "Organe attendu", "Groupe sanguin", "Délai max.", "Priorité"].map((h, i) => (
                    <th key={i} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: "1px solid rgba(239,68,68,0.15)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {patientsAttente.map((p, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${ACCENT}22`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: ACCENT }}>{p.init}</div>
                    </td>
                    <td style={{ padding: "14px 16px", fontWeight: 600, fontSize: 14 }}>{p.organe}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ background: "rgba(255,255,255,0.08)", borderRadius: 6, padding: "3px 10px", fontSize: 13, fontWeight: 700, color: TEXT }}>{p.groupe}</span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: MUTED }}>{p.delai}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ background: `${urgenceColor[p.urgence]}22`, color: urgenceColor[p.urgence], border: `1px solid ${urgenceColor[p.urgence]}44`, borderRadius: 6, padding: "2px 12px", fontSize: 12, fontWeight: 800 }}>{p.urgence}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Organes disponibles */}
        <div style={{ marginBottom: "2rem", animation: "fadeUp .5s .2s ease both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
            <div style={{ width: 4, height: 20, background: ACCENT, borderRadius: 2 }} />
            <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>Organes disponibles</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }}>
            {organes.map((o, i) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${o.color}33`, borderRadius: 16, padding: "1.5rem", textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{o.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>{o.nom}</div>
                <div style={{ marginBottom: "1rem" }}>
                  <span style={{ background: o.dispo > 0 ? `${o.color}22` : "rgba(239,68,68,0.15)", color: o.dispo > 0 ? o.color : "#ef4444", border: `1px solid ${o.dispo > 0 ? o.color + "44" : "rgba(239,68,68,0.3)"}`, borderRadius: 8, padding: "4px 14px", fontSize: 12, fontWeight: 700 }}>
                    {o.dispo > 0 ? `${o.dispo} disponible${o.dispo > 1 ? "s" : ""}` : "Indisponible"}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: MUTED }}>
                  <span style={{ color: o.color, fontWeight: 700 }}>{o.compat}</span> compatibilités potentielles
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Formulaire d'inscription */}
        <div style={{ marginBottom: "2rem", animation: "fadeUp .5s .25s ease both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
            <div style={{ width: 4, height: 20, background: "#84cc16", borderRadius: 2 }} />
            <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>Registre des Donneurs — Inscription</h2>
            <div style={{ marginLeft: "auto", background: `${ACCENT}22`, border: `1px solid ${ACCENT}44`, borderRadius: 12, padding: "6px 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: ACCENT, fontSize: 20, fontWeight: 800 }}>{compteur.toLocaleString("fr-FR")}</span>
              <span style={{ fontSize: 11, color: MUTED }}>donneurs enregistrés</span>
            </div>
          </div>
          <div style={{ background: CARD, border: BORDER, borderRadius: 16, padding: "2rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: 12, color: MUTED, fontWeight: 700, marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>Nom complet</label>
                <input
                  type="text"
                  value={form.nom}
                  onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                  placeholder="Votre nom et prénom"
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px", color: TEXT, fontSize: 14, outline: "none" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, color: MUTED, fontWeight: 700, marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>Date de naissance</label>
                <input
                  type="date"
                  value={form.naissance}
                  onChange={e => setForm(f => ({ ...f, naissance: e.target.value }))}
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px", color: TEXT, fontSize: 14, outline: "none", colorScheme: "dark" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, color: MUTED, fontWeight: 700, marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>Groupe sanguin</label>
                <select
                  value={form.groupe}
                  onChange={e => setForm(f => ({ ...f, groupe: e.target.value }))}
                  style={{ width: "100%", background: "#0a1628", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px", color: form.groupe ? TEXT : MUTED, fontSize: 14, outline: "none" }}
                >
                  <option value="">Sélectionner...</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: 12, color: MUTED, fontWeight: 700, marginBottom: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>Organes à donner (sélection multiple)</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {organesOptions.map(o => {
                  const selected = form.organes.includes(o);
                  return (
                    <button key={o} onClick={() => toggleOrgane(o)} style={{ padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", border: selected ? `1px solid ${ACCENT}88` : "1px solid rgba(255,255,255,0.1)", background: selected ? `${ACCENT}22` : "rgba(255,255,255,0.04)", color: selected ? ACCENT : MUTED, transition: "all .2s" }}>
                      {o}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "flex-start", gap: 12 }}>
              <input
                type="checkbox"
                id="consent"
                checked={form.consentement}
                onChange={e => setForm(f => ({ ...f, consentement: e.target.checked }))}
                style={{ marginTop: 2, accentColor: ACCENT, width: 16, height: 16, cursor: "pointer" }}
              />
              <label htmlFor="consent" style={{ fontSize: 13, color: MUTED, cursor: "pointer", lineHeight: 1.5 }}>
                Je consens librement au don de mes organes après mon décès, conformément à la législation sénégalaise. Ce choix peut être modifié à tout moment. Mes proches seront informés de ma décision.
              </label>
            </div>
            <button
              onClick={handleSubmit}
              style={{ background: `linear-gradient(135deg, ${ACCENT}, #be185d)`, color: "#fff", border: "none", borderRadius: 12, padding: "12px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "opacity .2s", opacity: form.nom && form.groupe && form.consentement && form.organes.length > 0 ? 1 : 0.5 }}
            >
              💝 M'inscrire comme donneur
            </button>
          </div>
        </div>

        {/* Section: Protocoles */}
        <div style={{ animation: "fadeUp .5s .3s ease both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
            <div style={{ width: 4, height: 20, background: "#8b5cf6", borderRadius: 2 }} />
            <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>Protocoles de transplantation</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }}>
            {etapes.map((e, i) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${e.color}33`, borderRadius: 16, padding: "1.5rem", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "1rem", right: "1rem", fontSize: 32, fontWeight: 900, color: `${e.color}15`, lineHeight: 1 }}>{e.num}</div>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${e.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: "0.75rem" }}>
                  {i === 0 ? "🏥" : i === 1 ? "🔬" : i === 2 ? "🚁" : "⚕️"}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: e.color }}>{e.titre}</div>
                <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.5, marginBottom: "0.75rem" }}>{e.desc}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: e.color, background: `${e.color}11`, borderRadius: 6, padding: "4px 10px", display: "inline-block" }}>⏱ {e.delai}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de confirmation */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: "#0a1628", border: `1px solid ${ACCENT}44`, borderRadius: 24, padding: "3rem 2.5rem", maxWidth: 480, width: "100%", textAlign: "center", animation: "fadeUp .4s ease both" }}>
            <div style={{ fontSize: 64, marginBottom: "1rem" }}>💝</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: ACCENT, marginBottom: "0.75rem", margin: "0 0 0.75rem" }}>Merci de votre geste de vie</h2>
            <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.6, marginBottom: "1.5rem", margin: "0 0 1.5rem" }}>
              Vous venez de rejoindre les <strong style={{ color: TEXT }}>{compteur.toLocaleString("fr-FR")} donneurs</strong> enregistrés au Sénégal. Votre générosité peut sauver jusqu'à <strong style={{ color: ACCENT }}>8 vies</strong>.
            </p>
            <div style={{ background: `${ACCENT}11`, border: `1px solid ${ACCENT}33`, borderRadius: 14, padding: "1rem", marginBottom: "2rem" }}>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>NUMÉRO DE DONNEUR</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: ACCENT, letterSpacing: "0.1em" }}>CHNCAK-{compteur}</div>
            </div>
            <button onClick={() => setShowModal(false)} style={{ background: `linear-gradient(135deg, ${ACCENT}, #be185d)`, color: "#fff", border: "none", borderRadius: 12, padding: "12px 40px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
