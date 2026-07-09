"use client"
import Link from "next/link"

const COUL = "#78716c"

const DATA = [
  { lieu: "Ascenseur Visiteurs B", type: "Ascenseur OTIS", probleme: "Porte bloquée", technicien: "Équipe 1", priorite: "Haute", statut: "Sur site" },
  { lieu: "Réanimation A", type: "Climatisation", probleme: "Panne unité intérieure", technicien: "Équipe CVC", priorite: "Urgente", statut: "En cours" },
  { lieu: "Bloc Opératoire", type: "Éclairage", probleme: "Ampoule salle 3", technicien: "Électricien", priorite: "Normale", statut: "Planifié J+1" },
  { lieu: "Groupe Secours 2", type: "Générateur", probleme: "Test mensuel", technicien: "Technicien Perkins", priorite: "Basse", statut: "Terminé" },
  { lieu: "Hall Entrée Principal", type: "Porte automatique", probleme: "Capteur défaillant", technicien: "Équipe 1", priorite: "Haute", statut: "En cours" },
  { lieu: "Parking Sous-sol", type: "Ventilation", probleme: "Filtre à changer", technicien: "Équipe CVC", priorite: "Normale", statut: "Planifié J+2" },
]

export default function MaintenanceBatimentPage() {
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
        .stat-card:hover { border-color: ${COUL}66; background: rgba(255,255,255,0.05); transform: translateY(-3px); }
        .feat-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 1.25rem; transition: all 0.3s; }
        .feat-card:hover { border-color: ${COUL}66; background: rgba(255,255,255,0.04); }
        .back-btn { display: inline-flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.5); text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s; }
        .back-btn:hover { color: #fff; }
        table { width: 100%; border-collapse: collapse; }
        th { background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; padding: 12px 16px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.06); }
        td { padding: 14px 16px; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.04); color: rgba(255,255,255,0.85); }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: rgba(255,255,255,0.02); }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .badge-urgente { background: rgba(239,68,68,0.2); color: #fca5a5; border: 1px solid rgba(239,68,68,0.4); }
        .badge-haute { background: rgba(245,158,11,0.15); color: #fcd34d; border: 1px solid rgba(245,158,11,0.35); }
        .badge-normale { background: rgba(120,113,108,0.2); color: #d6d3d1; border: 1px solid rgba(120,113,108,0.4); }
        .badge-basse { background: rgba(101,163,13,0.12); color: #86efac; border: 1px solid rgba(101,163,13,0.3); }
        .status-done { color: #86efac; } .status-active { color: #fcd34d; } .status-planned { color: rgba(255,255,255,0.45); } .status-onsite { color: ${COUL}; font-weight: 600; }
        .cta-btn { display: inline-flex; align-items: center; gap: 8px; background: ${COUL}; color: #fff; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 15px; text-decoration: none; transition: all 0.3s; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px ${COUL}44; }
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
        <section style={{ textAlign: "center", marginBottom: "4rem" }} className="au1">
          <div style={{ fontSize: 72, marginBottom: "1rem" }}>🏢</div>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, marginBottom: "1rem", background: `linear-gradient(135deg, #fff 0%, ${COUL} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Maintenance Bâtiment
          </h1>
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.5)", maxWidth: 560, margin: "0 auto 0.5rem" }}>
            Infrastructures Générales et Équipements
          </p>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.3)", maxWidth: 620, margin: "0 auto" }}>
            Gestion centralisée de toutes les installations techniques de l'hôpital, du signalement à la résolution en temps réel.
          </p>
        </section>

        {/* STATS */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1rem", marginBottom: "4rem" }}>
          {[
            { val: "12", label: "Tickets ouverts", icon: "🎫" },
            { val: "100%", label: "Groupes secours opérationnels", icon: "⚡" },
            { val: "2h", label: "Délai résolution moyen", icon: "⏱️" },
            { val: "98%", label: "Disponibilité ascenseurs", icon: "🛗" },
          ].map((s, i) => (
            <div key={i} className={`stat-card au${i + 1}`}>
              <div style={{ fontSize: 28, marginBottom: "0.5rem" }}>{s.icon}</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: COUL, marginBottom: "0.25rem" }}>{s.val}</div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
            </div>
          ))}
        </section>

        {/* FEATURES */}
        <section style={{ marginBottom: "4rem" }} className="au2">
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", color: "rgba(255,255,255,0.9)" }}>
            <span style={{ color: COUL }}>■</span> Fonctionnalités clés
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1rem" }}>
            {[
              { icon: "🌡️", title: "Surveillance CVC", desc: "Monitoring en continu de la Climatisation, Ventilation et Chauffage avec alertes sur les dérives de température et hygrométrie." },
              { icon: "🛗", title: "Gestion ascenseurs", desc: "Suivi de l'état opérationnel de chaque ascenseur, historique des pannes et interface avec les prestataires de maintenance." },
              { icon: "⚡", title: "Groupes électrogènes", desc: "Supervision des groupes de secours, déclenchements automatiques et tests périodiques planifiés avec rapport de conformité." },
              { icon: "🎫", title: "Ticketing pannes", desc: "Signalement instantané via QR code depuis n'importe quel local, assignation automatique et suivi jusqu'à clôture." },
            ].map((f, i) => (
              <div key={i} className="feat-card">
                <div style={{ fontSize: 28, marginBottom: "0.75rem" }}>{f.icon}</div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem", color: "#fff" }}>{f.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TABLE */}
        <section style={{ marginBottom: "4rem" }} className="au3">
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", color: "rgba(255,255,255,0.9)" }}>
            <span style={{ color: COUL }}>■</span> Tickets actifs — {new Date().toLocaleDateString("fr-FR")}
          </h2>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Lieu</th>
                  <th>Type Équipement</th>
                  <th>Problème</th>
                  <th>Technicien</th>
                  <th>Priorité</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {DATA.map((row, i) => {
                  const prioriteBadge = row.priorite === "Urgente" ? "badge badge-urgente" : row.priorite === "Haute" ? "badge badge-haute" : row.priorite === "Basse" ? "badge badge-basse" : "badge badge-normale"
                  const statusClass = row.statut === "Terminé" ? "status-done" : row.statut === "En cours" ? "status-active" : row.statut === "Sur site" ? "status-onsite" : "status-planned"
                  return (
                    <tr key={i}>
                      <td style={{ fontWeight: 600, color: "#fff" }}>{row.lieu}</td>
                      <td>{row.type}</td>
                      <td style={{ color: "rgba(255,255,255,0.6)" }}>{row.probleme}</td>
                      <td style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{row.technicien}</td>
                      <td><span className={prioriteBadge}>{row.priorite}</span></td>
                      <td className={statusClass}>{row.statut === "Terminé" ? "✓ " : row.statut === "En cours" ? "⟳ " : ""}{row.statut}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <section className="au4" style={{ background: `linear-gradient(135deg, rgba(120,113,108,0.08) 0%, rgba(10,22,40,0) 100%)`, border: `1px solid ${COUL}33`, borderRadius: 16, padding: "3rem", textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.75rem" }}>Optimisez la gestion de vos infrastructures</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2rem", maxWidth: 480, margin: "0 auto 2rem" }}>
            Centralisez la maintenance préventive et curative de votre établissement avec notre GMAO hospitalière.
          </p>
          <a href="mailto:contact@processingenierie.sn" className="cta-btn">
            ✉️ Nous contacter
          </a>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "2rem 1.5rem", textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
        <p>© 2026 Ndamatou Health Suite — Maintenance Bâtiment · Tous droits réservés · <a href="mailto:contact@processingenierie.sn" style={{ color: COUL, textDecoration: "none" }}>contact@processingenierie.sn</a></p>
      </footer>
    </>
  )
}
