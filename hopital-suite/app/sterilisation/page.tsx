"use client"
import Link from "next/link"

const COUL = "#06b6d4"

const DATA = [
  { lot: "LOT-2026-07-07-A", programme: "Prion 134°C", contenu: "Instruments neurochirurgie", nbItems: "24 items", temp: "134°C", duree: "18 min", statut: "Phase séchage" },
  { lot: "LOT-2026-07-07-B", programme: "Standard 134°C", contenu: "Plateau chirurgie générale", nbItems: "36 items", temp: "134°C", duree: "5 min", statut: "Libéré" },
  { lot: "LOT-2026-07-07-C", programme: "Flash 134°C", contenu: "Kit urgence", nbItems: "12 items", temp: "134°C", duree: "3 min", statut: "En charge" },
  { lot: "LOT-2026-07-07-D", programme: "Standard 121°C", contenu: "Instruments maternité", nbItems: "18 items", temp: "121°C", duree: "15 min", statut: "Libéré" },
  { lot: "LOT-2026-07-07-E", programme: "Thermosensible OPL", contenu: "Endoscopes flexibles", nbItems: "6 items", temp: "56°C", duree: "60 min", statut: "En cours" },
]

export default function SterilisationPage() {
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
        td { padding: 14px 16px; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.04); color: rgba(255,255,255,0.85); }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: rgba(255,255,255,0.02); }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .badge-libre { background: rgba(6,182,212,0.15); color: #67e8f9; border: 1px solid ${COUL}44; }
        .badge-active { background: rgba(245,158,11,0.12); color: #fcd34d; border: 1px solid rgba(245,158,11,0.3); }
        .badge-charge { background: rgba(139,92,246,0.15); color: #c4b5fd; border: 1px solid rgba(139,92,246,0.3); }
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
          <div style={{ fontSize: 72, marginBottom: "1rem" }}>🧼</div>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, marginBottom: "1rem", background: `linear-gradient(135deg, #fff 0%, ${COUL} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Stérilisation Centrale
          </h1>
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.5)", maxWidth: 560, margin: "0 auto 0.5rem" }}>
            Traçabilité de l'Instrumentation Chirurgicale
          </p>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.3)", maxWidth: 620, margin: "0 auto" }}>
            Contrôle en temps réel de chaque cycle de stérilisation, de la réception sale à la livraison stérile au bloc opératoire.
          </p>
        </section>

        {/* STATS */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1rem", marginBottom: "4rem" }}>
          {[
            { val: "42", label: "Boîtes traitées / jour", icon: "📦" },
            { val: "2 840", label: "Instruments suivis", icon: "🔧" },
            { val: "3/3", label: "Autoclaves actifs", icon: "⚙️" },
            { val: "100%", label: "Traçabilité garantie", icon: "✅" },
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
              { icon: "📲", title: "Code Datamatrix par instrument", desc: "Chaque instrument possède un identifiant unique scannable permettant de retracer l'intégralité de son historique." },
              { icon: "♻️", title: "Suivi cycles autoclaves", desc: "Enregistrement automatique de chaque paramètre de cycle : température, pression, durée et résultat des tests chimiques." },
              { icon: "🏥", title: "Connexion bloc opératoire", desc: "Attribution électronique des boîtes aux salles et aux chirurgiens avant chaque intervention programmée." },
              { icon: "⏰", title: "Alertes péremption stérilité", desc: "Notification proactive avant expiration de la garantie de stérilité pour éviter toute utilisation non conforme." },
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
            <span style={{ color: COUL }}>■</span> Cycles en cours — {new Date().toLocaleDateString("fr-FR")}
          </h2>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>N° Lot</th>
                  <th>Programme</th>
                  <th>Contenu</th>
                  <th>Nb Items</th>
                  <th>Temp.</th>
                  <th>Durée</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {DATA.map((row, i) => {
                  const badgeClass = row.statut === "Libéré" ? "badge badge-libre" : row.statut === "En charge" ? "badge badge-charge" : "badge badge-active"
                  return (
                    <tr key={i}>
                      <td style={{ fontFamily: "monospace", color: COUL, fontSize: 12 }}>{row.lot}</td>
                      <td style={{ fontWeight: 600 }}>{row.programme}</td>
                      <td style={{ color: "rgba(255,255,255,0.6)" }}>{row.contenu}</td>
                      <td style={{ textAlign: "center" }}>{row.nbItems}</td>
                      <td style={{ textAlign: "center", fontWeight: 700, color: row.temp === "134°C" ? "#f87171" : row.temp === "121°C" ? "#fcd34d" : "#67e8f9" }}>{row.temp}</td>
                      <td style={{ textAlign: "center" }}>{row.duree}</td>
                      <td><span className={badgeClass}>{row.statut}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <section className="au4" style={{ background: `linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(10,22,40,0) 100%)`, border: `1px solid ${COUL}22`, borderRadius: 16, padding: "3rem", textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.75rem" }}>Traçabilité totale de votre instrumentation</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2rem", maxWidth: 480, margin: "0 auto 2rem" }}>
            Conformez-vous aux normes EN 17665 et ISO 13485 avec notre solution clé en main pour la stérilisation centrale.
          </p>
          <a href="mailto:contact@processingenierie.sn" className="cta-btn">
            ✉️ Nous contacter
          </a>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "2rem 1.5rem", textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
        <p>© 2026 Ndamatou Health Suite — Stérilisation Centrale · Tous droits réservés · <a href="mailto:contact@processingenierie.sn" style={{ color: COUL, textDecoration: "none" }}>contact@processingenierie.sn</a></p>
      </footer>
    </>
  )
}
