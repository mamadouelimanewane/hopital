"use client"
import Link from "next/link"
import { useState } from "react"

const COUL = "#a855f7"

type Statut = "Terminée" | "Confirmée" | "En attente"
interface Reunion {
  id: string
  reunion: string
  date: string
  service: string
  participantsPresents: number
  participantsTotal: number
  statut: Statut
}

const REUNIONS_INIT: Reunion[] = [
  { id: "r1", reunion: "Comité de Direction Hebdomadaire", date: "08/07/2026 08h00", service: "Direction Générale", participantsPresents: 12, participantsTotal: 12, statut: "Terminée" },
  { id: "r2", reunion: "Staff Qualité & Accréditation JCI", date: "09/07/2026 14h00", service: "Qualité-JCI", participantsPresents: 8, participantsTotal: 10, statut: "Confirmée" },
  { id: "r3", reunion: "Revue Morbi-Mortalité Maternité", date: "10/07/2026 08h30", service: "Mater-Neo", participantsPresents: 6, participantsTotal: 9, statut: "Confirmée" },
  { id: "r4", reunion: "Point Budgétaire Trimestriel", date: "11/07/2026 10h00", service: "Direction Financière", participantsPresents: 5, participantsTotal: 7, statut: "En attente" },
  { id: "r5", reunion: "Coordination Préparation Magal", date: "12/07/2026 09h00", service: "Magal-Surge", participantsPresents: 15, participantsTotal: 18, statut: "Confirmée" },
]

const CR_INIT: Record<string, string> = {
  r1: "Points abordés : budget Q3, avancement des 45 applications, préparation du Magal.\nDécisions : validation du budget CVC, relance du recrutement infirmier.\nProchaine réunion : 15/07/2026.",
}

const ANNONCES_INIT = [
  { id: "a1", texte: "Formation obligatoire « Gestes qui sauvent » — inscriptions ouvertes jusqu'au 15/07.", audience: "Tout le personnel", date: "07/07/2026 09h12" },
  { id: "a2", texte: "Fermeture exceptionnelle du parking visiteurs le 10/07 pour maintenance.", audience: "Administratif", date: "06/07/2026 16h40" },
]

const statutClass: Record<Statut, string> = { "Terminée": "badge-terminee", "Confirmée": "badge-confirmee", "En attente": "badge-attente" }

type Onglet = "planification" | "comptes-rendus" | "communication" | "visio"

export default function ReunionsPage() {
  const [reunions, setReunions] = useState<Reunion[]>(REUNIONS_INIT)
  const [onglet, setOnglet] = useState<Onglet>("planification")

  // Planification
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ reunion: "", date: "", service: "", participants: 5 })

  function planifierReunion() {
    if (!form.reunion || !form.date || !form.service) return
    const nouvelle: Reunion = {
      id: "r" + Date.now(),
      reunion: form.reunion, date: form.date, service: form.service,
      participantsPresents: 0, participantsTotal: form.participants, statut: "En attente",
    }
    setReunions([nouvelle, ...reunions])
    setForm({ reunion: "", date: "", service: "", participants: 5 })
    setShowForm(false)
  }

  // Comptes-rendus
  const [comptesRendus, setComptesRendus] = useState<Record<string, string>>(CR_INIT)
  const [crOuvert, setCrOuvert] = useState<string | null>(null)
  const [crDraft, setCrDraft] = useState("")

  function ouvrirCr(id: string) {
    setCrOuvert(id)
    setCrDraft(comptesRendus[id] || "")
  }
  function publierCr() {
    if (!crOuvert) return
    setComptesRendus({ ...comptesRendus, [crOuvert]: crDraft })
    setCrOuvert(null)
  }

  // Communication interne
  const [annonces, setAnnonces] = useState(ANNONCES_INIT)
  const [annonceTexte, setAnnonceTexte] = useState("")
  const [annonceAudience, setAnnonceAudience] = useState("Tout le personnel")

  function publierAnnonce() {
    if (!annonceTexte.trim()) return
    setAnnonces([{ id: "a" + Date.now(), texte: annonceTexte, audience: annonceAudience, date: new Date().toLocaleString("fr-FR") }, ...annonces])
    setAnnonceTexte("")
  }

  // Visioconférence
  const [visioOuvert, setVisioOuvert] = useState<string | null>(null)
  const [visioEtape, setVisioEtape] = useState<"connexion" | "connecte">("connexion")

  function rejoindreVisio(id: string) {
    setVisioOuvert(id)
    setVisioEtape("connexion")
    setTimeout(() => setVisioEtape("connecte"), 1400)
  }

  const reunionVisio = reunions.find(r => r.id === visioOuvert)
  const reunionCr = reunions.find(r => r.id === crOuvert)

  const tabs: { id: Onglet; icon: string; label: string }[] = [
    { id: "planification", icon: "📅", label: "Planification & invitations" },
    { id: "comptes-rendus", icon: "📝", label: "Comptes-rendus partagés" },
    { id: "communication", icon: "📣", label: "Communication interne" },
    { id: "visio", icon: "🎥", label: "Visioconférence intégrée" },
  ]

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, sans-serif; background: #0a1628; color: #fff; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .au1{animation:fadeUp .6s .1s both} .au2{animation:fadeUp .6s .2s both}
        .au3{animation:fadeUp .6s .3s both} .au4{animation:fadeUp .6s .4s both}
        .stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 1.5rem; text-align: center; transition: all 0.3s; }
        .stat-card:hover { border-color: ${COUL}44; background: rgba(255,255,255,0.05); transform: translateY(-3px); }
        .back-btn { display: inline-flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.5); text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s; }
        .back-btn:hover { color: #fff; }
        table { width: 100%; border-collapse: collapse; }
        th { background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; padding: 12px 16px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.06); }
        td { padding: 14px 16px; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.04); color: rgba(255,255,255,0.85); }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: rgba(255,255,255,0.02); }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .badge-terminee { background: rgba(148,163,184,0.15); color: #cbd5e1; border: 1px solid rgba(148,163,184,0.3); }
        .badge-confirmee { background: rgba(168,85,247,0.15); color: #d8b4fe; border: 1px solid ${COUL}44; }
        .badge-attente { background: rgba(245,158,11,0.12); color: #fcd34d; border: 1px solid rgba(245,158,11,0.3); }
        .cta-btn { display: inline-flex; align-items: center; gap: 8px; background: ${COUL}; color: #fff; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 15px; text-decoration: none; transition: all 0.3s; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px ${COUL}44; }
        .mini-btn { background: rgba(168,85,247,0.15); color: #d8b4fe; border: 1px solid ${COUL}44; border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 700; cursor: pointer; }
        .mini-btn:hover { background: rgba(168,85,247,0.25); }
        input, textarea, select { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; padding: 10px 12px; font-size: 13px; font-family: inherit; outline: none; width: 100%; }
        input:focus, textarea:focus, select:focus { border-color: ${COUL}88; }
        .field-label { font-size: 11px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; display: block; }
      `}</style>

      {/* HEADER */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,22,40,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 1.5rem", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/#applications" className="back-btn">← Retour au Portail Ndamatou</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: COUL, animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 12, color: COUL, fontWeight: 700, letterSpacing: "0.1em" }}>SYSTÈME ACTIF</span>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem" }}>

        {/* HERO */}
        <section style={{ textAlign: "center", marginBottom: "3rem" }} className="au1">
          <div style={{ fontSize: 72, marginBottom: "1rem" }}>🗓️</div>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, marginBottom: "1rem", background: `linear-gradient(135deg, #fff 0%, ${COUL} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Réunions & Communication
          </h1>
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.5)", maxWidth: 560, margin: "0 auto 0.5rem" }}>
            Planification, Comptes-Rendus & Communication Interne
          </p>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.3)", maxWidth: 620, margin: "0 auto" }}>
            Centralisez la planification des réunions institutionnelles, leurs comptes-rendus et la communication interne de l&apos;hôpital.
          </p>
        </section>

        {/* STATS */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1rem", marginBottom: "3rem" }}>
          {[
            { val: String(reunions.length), label: "Réunions planifiées ce mois", icon: "🗓️" },
            { val: "87%", label: "Taux de participation moyen", icon: "👥" },
            { val: String(Object.keys(comptesRendus).length), label: "Comptes-rendus publiés", icon: "📝" },
            { val: String(annonces.length), label: "Communiqués internes diffusés", icon: "📣" },
          ].map((s, i) => (
            <div key={i} className={`stat-card au${i + 1}`}>
              <div style={{ fontSize: 28, marginBottom: "0.5rem" }}>{s.icon}</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: COUL, marginBottom: "0.25rem" }}>{s.val}</div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
            </div>
          ))}
        </section>

        {/* WORKSPACE — ONGLETS FONCTIONNELS */}
        <section style={{ marginBottom: "4rem" }} className="au2">
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", color: "rgba(255,255,255,0.9)" }}>
            <span style={{ color: COUL }}>■</span> Fonctionnalités clés
          </h2>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1.25rem" }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setOnglet(t.id)} style={{
                background: onglet === t.id ? "rgba(168,85,247,0.18)" : "rgba(255,255,255,0.03)",
                color: onglet === t.id ? "#d8b4fe" : "rgba(255,255,255,0.55)",
                border: `1px solid ${onglet === t.id ? COUL + "66" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
              }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "1.5rem" }}>

            {/* PLANIFICATION */}
            {onglet === "planification" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Créez une réunion et gérez les invitations des participants.</p>
                  <button onClick={() => setShowForm(!showForm)} className="mini-btn">{showForm ? "✕ Annuler" : "+ Nouvelle réunion"}</button>
                </div>

                {showForm && (
                  <div style={{ background: "rgba(168,85,247,0.06)", border: `1px solid ${COUL}33`, borderRadius: 12, padding: "1.25rem", marginBottom: 20 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, marginBottom: 14 }}>
                      <div>
                        <label className="field-label">Titre de la réunion</label>
                        <input value={form.reunion} onChange={e => setForm({ ...form, reunion: e.target.value })} placeholder="Ex: Revue mensuelle Pharmacie" />
                      </div>
                      <div>
                        <label className="field-label">Date & heure</label>
                        <input value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} placeholder="Ex: 15/07/2026 10h00" />
                      </div>
                      <div>
                        <label className="field-label">Service organisateur</label>
                        <input value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} placeholder="Ex: SmartPharma" />
                      </div>
                      <div>
                        <label className="field-label">Participants invités</label>
                        <input type="number" min={1} value={form.participants} onChange={e => setForm({ ...form, participants: Number(e.target.value) })} />
                      </div>
                    </div>
                    <button onClick={planifierReunion} className="mini-btn">📅 Planifier & inviter</button>
                  </div>
                )}

                <div style={{ overflow: "auto" }}>
                  <table>
                    <thead>
                      <tr><th>Réunion</th><th>Date</th><th>Service</th><th>Participants</th><th>Statut</th></tr>
                    </thead>
                    <tbody>
                      {reunions.map(r => (
                        <tr key={r.id}>
                          <td style={{ fontWeight: 600, color: "#fff" }}>{r.reunion}</td>
                          <td style={{ color: "rgba(255,255,255,0.6)" }}>{r.date}</td>
                          <td style={{ color: "rgba(255,255,255,0.6)" }}>{r.service}</td>
                          <td style={{ color: "rgba(255,255,255,0.5)" }}>{r.participantsPresents}/{r.participantsTotal}</td>
                          <td><span className={`badge ${statutClass[r.statut]}`}>{r.statut}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* COMPTES-RENDUS */}
            {onglet === "comptes-rendus" && (
              <div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>Rédigez et publiez le compte-rendu de chaque réunion ; il est aussitôt visible par les participants et services concernés.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {reunions.map(r => {
                    const publie = comptesRendus[r.id]
                    return (
                      <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "12px 16px", flexWrap: "wrap", gap: 10 }}>
                        <div>
                          <div style={{ fontWeight: 600, color: "#fff", fontSize: 13 }}>{r.reunion}</div>
                          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{r.date} · {r.service}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {publie && <span className="badge badge-terminee">✓ CR disponible</span>}
                          <button onClick={() => ouvrirCr(r.id)} className="mini-btn">{publie ? "Modifier le CR" : "Rédiger le CR"}</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* COMMUNICATION */}
            {onglet === "communication" && (
              <div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>Publiez une annonce ou une note de service à destination du personnel.</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 10, marginBottom: 12, alignItems: "end", flexWrap: "wrap" }}>
                  <div>
                    <label className="field-label">Message</label>
                    <textarea value={annonceTexte} onChange={e => setAnnonceTexte(e.target.value)} placeholder="Rédigez votre annonce…" rows={2} />
                  </div>
                  <div>
                    <label className="field-label">Audience</label>
                    <select value={annonceAudience} onChange={e => setAnnonceAudience(e.target.value)}>
                      <option>Tout le personnel</option>
                      <option>Personnel médical</option>
                      <option>Administratif</option>
                    </select>
                  </div>
                </div>
                <button onClick={publierAnnonce} className="mini-btn" style={{ marginBottom: 20 }}>📣 Publier l&apos;annonce</button>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {annonces.map(a => (
                    <div key={a.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "12px 16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 8 }}>
                        <span className="badge badge-confirmee">{a.audience}</span>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{a.date}</span>
                      </div>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>{a.texte}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VISIOCONFÉRENCE */}
            {onglet === "visio" && (
              <div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>Rejoignez une réunion à distance pour les participants multi-sites ou en télétravail.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {reunions.filter(r => r.statut !== "Terminée").map(r => (
                    <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "12px 16px", flexWrap: "wrap", gap: 10 }}>
                      <div>
                        <div style={{ fontWeight: 600, color: "#fff", fontSize: 13 }}>{r.reunion}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{r.date} · {r.service}</div>
                      </div>
                      <button onClick={() => rejoindreVisio(r.id)} className="mini-btn">🎥 Rejoindre</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="au4" style={{ background: `linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(10,22,40,0) 100%)`, border: `1px solid ${COUL}33`, borderRadius: 16, padding: "3rem", textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.75rem" }}>Fluidifiez votre communication interne</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2rem", maxWidth: 480, margin: "0 auto 2rem" }}>
            Centralisez réunions, comptes-rendus et annonces pour une coordination plus efficace entre tous les services.
          </p>
          <a href="mailto:contact@processingenierie.sn" className="cta-btn">
            ✉️ Nous contacter
          </a>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "2rem 1.5rem", textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
        <p>© 2026 Ndamatou Health Suite — Réunions & Communication · Tous droits réservés · <a href="mailto:contact@processingenierie.sn" style={{ color: COUL, textDecoration: "none" }}>contact@processingenierie.sn</a></p>
      </footer>

      {/* MODALE COMPTE-RENDU */}
      {crOuvert && reunionCr && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#0a1628", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "1.5rem", width: "100%", maxWidth: 520 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>Compte-rendu — {reunionCr.reunion}</h3>
              <button onClick={() => setCrOuvert(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>
            <textarea value={crDraft} onChange={e => setCrDraft(e.target.value)} rows={8} placeholder="Points abordés, décisions, actions à suivre…" style={{ marginBottom: 14 }} />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setCrOuvert(null)} style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>Annuler</button>
              <button onClick={publierCr} className="mini-btn">Publier le compte-rendu</button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE VISIOCONFÉRENCE */}
      {visioOuvert && reunionVisio && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#0a1628", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "1.5rem", width: "100%", maxWidth: 560 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{reunionVisio.reunion}</h3>
              <button onClick={() => setVisioOuvert(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>

            {visioEtape === "connexion" ? (
              <div style={{ textAlign: "center", padding: "2.5rem 0" }}>
                <div style={{ fontSize: 36, marginBottom: 12, animation: "pulse 1s infinite" }}>🎥</div>
                <p style={{ color: "#e5e7eb", fontWeight: 600 }}>Connexion à la visioconférence…</p>
              </div>
            ) : (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(90px,1fr))", gap: 10, marginBottom: 18 }}>
                  {Array.from({ length: Math.min(reunionVisio.participantsTotal, 8) }).map((_, i) => (
                    <div key={i} style={{ background: "rgba(168,85,247,0.12)", border: `1px solid ${COUL}33`, borderRadius: 10, padding: "14px 6px", textAlign: "center" }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: COUL, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px", fontWeight: 800, fontSize: 13 }}>
                        {String.fromCharCode(65 + (i % 26))}{String.fromCharCode(78 + (i % 10))}
                      </div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>🎙️ 📹</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
                  <span style={{ fontSize: 13, color: "#86efac", fontWeight: 600 }}>🟢 En réunion — {reunionVisio.participantsTotal} participants connectés</span>
                </div>
                <button onClick={() => setVisioOuvert(null)} style={{ width: "100%", background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                  Quitter la réunion
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
