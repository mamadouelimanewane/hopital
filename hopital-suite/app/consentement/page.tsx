"use client"
import Link from "next/link"

const COUL = "#8b5cf6"

const DATA = [
  { patient: "Ousmane Sylla", procedure: "Appendicectomie", praticien: "Dr. Sall", dateSig: "07/07/2026 08h30", statut: "Signé" },
  { patient: "Mame Diarra Niang", procedure: "Césarienne", praticien: "Dr. Mbaye", dateSig: "—", statut: "En attente" },
  { patient: "Cheikh Ba", procedure: "Cataracte OD", praticien: "Dr. Diallo", dateSig: "07/07/2026 09h15", statut: "Signé" },
  { patient: "Sokhna Fall", procedure: "Coloscopie", praticien: "Dr. Ndiaye", dateSig: "07/07/2026 10h00", statut: "Signé" },
  { patient: "Abdou Sène", procedure: "Pose de KT central", praticien: "Dr. Faye", dateSig: "—", statut: "En attente" },
]

export default function ConsentementPage() {
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
        .feat-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 1.25rem; transition: all 0.3s; }
        .feat-card:hover { border-color: ${COUL}44; background: rgba(255,255,255,0.04); }
        .back-btn { display: inline-flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.5); text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s; }
        .back-btn:hover { color: #fff; }
        table { width: 100%; border-collapse: collapse; }
        th { background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; padding: 12px 16px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.06); }
        td { padding: 14px 16px; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04); color: rgba(255,255,255,0.85); }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: rgba(255,255,255,0.02); }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .badge-signed { background: rgba(139,92,246,0.15); color: #c4b5fd; border: 1px solid ${COUL}44; }
        .badge-pending { background: rgba(245,158,11,0.12); color: #fcd34d; border: 1px solid rgba(245,158,11,0.3); }
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
          <div style={{ fontSize: 72, marginBottom: "1rem" }}>✍️</div>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, marginBottom: "1rem", background: `linear-gradient(135deg, #fff 0%, ${COUL} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            e-Consentement
          </h1>
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.5)", maxWidth: 560, margin: "0 auto 0.5rem" }}>
            Consentement Éclairé Électronique
          </p>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.3)", maxWidth: 620, margin: "0 auto" }}>
            Dématérialisez et sécurisez l'ensemble du processus de consentement éclairé, de la signature à l'archivage certifié.
          </p>
        </section>

        {/* STATS */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1rem", marginBottom: "4rem" }}>
          {[
            { val: "1 450", label: "Consentements signés", icon: "✅" },
            { val: "3", label: "En attente bloc", icon: "⏳" },
            { val: "100%", label: "Dématérialisé", icon: "☁️" },
            { val: "0", label: "Litige depuis déploiement", icon: "⚖️" },
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
              { icon: "✏️", title: "Signature sur tablette", desc: "Recueillez la signature manuscrite numérique du patient directement au lit ou au cabinet de consultation." },
              { icon: "🎥", title: "Vidéos explicatives", desc: "Chaque procédure est accompagnée d'une vidéo pédagogique pour s'assurer d'un consentement véritablement éclairé." },
              { icon: "🗄️", title: "Archivage certifié", desc: "Chaque document est horodaté et archivé avec valeur probatoire conforme aux exigences légales sénégalaises." },
              { icon: "🔗", title: "Intégration DMP", desc: "Synchronisation automatique avec le Dossier Médical Partagé pour un accès immédiat par tous les acteurs de santé." },
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
            <span style={{ color: COUL }}>■</span> Consentements du jour — {new Date().toLocaleDateString("fr-FR")}
          </h2>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Procédure</th>
                  <th>Praticien</th>
                  <th>Date Signature</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {DATA.map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, color: "#fff" }}>{row.patient}</td>
                    <td>{row.procedure}</td>
                    <td style={{ color: "rgba(255,255,255,0.6)" }}>{row.praticien}</td>
                    <td style={{ fontFamily: "monospace", color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{row.dateSig}</td>
                    <td>
                      <span className={row.statut === "Signé" ? "badge badge-signed" : "badge badge-pending"}>
                        {row.statut === "Signé" ? "✓ " : "⏳ "}{row.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <section className="au4" style={{ background: `linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(10,22,40,0) 100%)`, border: `1px solid ${COUL}22`, borderRadius: 16, padding: "3rem", textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.75rem" }}>Sécurisez vos consentements dès aujourd'hui</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2rem", maxWidth: 480, margin: "0 auto 2rem" }}>
            Réduisez le risque juridique et améliorez l'expérience patient grâce à e-Consentement.
          </p>
          <a href="mailto:contact@processingenierie.sn" className="cta-btn">
            ✉️ Nous contacter
          </a>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "2rem 1.5rem", textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
        <p>© 2026 Ndamatou Health Suite — e-Consentement · Tous droits réservés · <a href="mailto:contact@processingenierie.sn" style={{ color: COUL, textDecoration: "none" }}>contact@processingenierie.sn</a></p>
      </footer>
    </>
  )
}
