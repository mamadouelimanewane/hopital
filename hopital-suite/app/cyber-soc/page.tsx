"use client"
import Link from "next/link"

const COUL = "#e11d48"

const DATA = [
  { horodatage: "07/07/2026 02h14", menace: "Brute Force SSH", cible: "Serveur PACS", severite: "Haute", resolution: "IP bannie auto" },
  { horodatage: "07/07/2026 08h32", menace: "Connexion hors horaire", cible: "Poste Urgences", severite: "Moyenne", resolution: "Enquête en cours" },
  { horodatage: "06/07/2026 23h41", menace: "Scan de port", cible: "Réseau IoT biomédical", severite: "Faible", resolution: "Bloqué firewall" },
  { horodatage: "06/07/2026 17h05", menace: "Phishing détecté", cible: "Messagerie RH", severite: "Haute", resolution: "Email mis en quarantaine" },
  { horodatage: "06/07/2026 11h22", menace: "Tentative ransomware", cible: "NAS Imagerie", severite: "Critique", resolution: "Isolation réseau immédiate" },
]

export default function CyberSOCPage() {
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
        .badge-critique { background: rgba(239,68,68,0.2); color: #fca5a5; border: 1px solid rgba(239,68,68,0.4); }
        .badge-haute { background: rgba(225,29,72,0.15); color: #fb7185; border: 1px solid ${COUL}44; }
        .badge-moyenne { background: rgba(245,158,11,0.12); color: #fcd34d; border: 1px solid rgba(245,158,11,0.3); }
        .badge-faible { background: rgba(101,163,13,0.12); color: #86efac; border: 1px solid rgba(101,163,13,0.3); }
        .cta-btn { display: inline-flex; align-items: center; gap: 8px; background: ${COUL}; color: #fff; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 15px; text-decoration: none; transition: all 0.3s; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px ${COUL}44; }
        .ticker-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${COUL}; animation: pulse 1.5s infinite; margin-right: 6px; }
      `}</style>

      {/* HEADER */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,22,40,0.95)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${COUL}22`, padding: "0 1.5rem", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/#applications" className="back-btn">← Retour au Portail Ndamatou</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="ticker-dot" />
          <span style={{ fontSize: 12, color: COUL, fontWeight: 700, letterSpacing: "0.1em" }}>SURVEILLANCE 24/7</span>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem" }}>

        {/* HERO */}
        <section style={{ textAlign: "center", marginBottom: "4rem" }} className="au1">
          <div style={{ fontSize: 72, marginBottom: "1rem" }}>🛡️</div>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, marginBottom: "1rem", background: `linear-gradient(135deg, #fff 0%, ${COUL} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Cyber-SOC Hôpital
          </h1>
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.5)", maxWidth: 560, margin: "0 auto 0.5rem" }}>
            Centre Opérationnel de Sécurité
          </p>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.3)", maxWidth: 620, margin: "0 auto" }}>
            Protection en temps réel de l'ensemble du système d'information hospitalier contre les cybermenaces modernes.
          </p>
        </section>

        {/* STATS */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1rem", marginBottom: "4rem" }}>
          {[
            { val: "14", label: "Attaques / semaine bloquées", icon: "🚫" },
            { val: "99.9%", label: "Disponibilité SI", icon: "⚡" },
            { val: "1 240", label: "Équipements surveillés", icon: "🖥️" },
            { val: "0", label: "Brèche de données", icon: "🔒" },
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
              { icon: "👁️", title: "Surveillance 24/7", desc: "Monitoring continu de l'ensemble du réseau hospitalier avec corrélation d'événements par IA et alertes en temps réel." },
              { icon: "📒", title: "Playbooks incidents", desc: "Réponses automatisées et guidées pour chaque type d'incident cyber, réduisant le temps de réaction à moins de 5 minutes." },
              { icon: "🔌", title: "Isolation réseau", desc: "Capacité de micro-segmentation et d'isolement immédiat d'un équipement compromis sans impacter le reste du SI." },
              { icon: "📋", title: "Audit conformité RGPD/MSHP", desc: "Rapports d'audit automatisés pour prouver la conformité aux réglementations RGPD et aux exigences du MSHP." },
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
            <span style={{ color: COUL }}>■</span> Journal des incidents récents
          </h2>
          <div style={{ background: "rgba(225,29,72,0.03)", border: `1px solid ${COUL}22`, borderRadius: 12, overflow: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Horodatage</th>
                  <th>Menace</th>
                  <th>Cible</th>
                  <th>Sévérité</th>
                  <th>Résolution</th>
                </tr>
              </thead>
              <tbody>
                {DATA.map((row, i) => {
                  const badgeClass = row.severite === "Critique" ? "badge badge-critique" : row.severite === "Haute" ? "badge badge-haute" : row.severite === "Moyenne" ? "badge badge-moyenne" : "badge badge-faible"
                  return (
                    <tr key={i}>
                      <td style={{ fontFamily: "monospace", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{row.horodatage}</td>
                      <td style={{ fontWeight: 600, color: "#fff" }}>{row.menace}</td>
                      <td style={{ color: "rgba(255,255,255,0.6)" }}>{row.cible}</td>
                      <td><span className={badgeClass}>{row.severite}</span></td>
                      <td style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{row.resolution}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <section className="au4" style={{ background: `linear-gradient(135deg, rgba(225,29,72,0.08) 0%, rgba(10,22,40,0) 100%)`, border: `1px solid ${COUL}22`, borderRadius: 16, padding: "3rem", textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.75rem" }}>Sécurisez votre SI hospitalier</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2rem", maxWidth: 480, margin: "0 auto 2rem" }}>
            Les hôpitaux sont la 1ère cible des ransomwares. Protégez vos données patients et votre continuité de soins.
          </p>
          <a href="mailto:contact@processingenierie.sn" className="cta-btn">
            ✉️ Nous contacter
          </a>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${COUL}11`, padding: "2rem 1.5rem", textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
        <p>© 2026 Ndamatou Health Suite — Cyber-SOC Hôpital · Tous droits réservés · <a href="mailto:contact@processingenierie.sn" style={{ color: COUL, textDecoration: "none" }}>contact@processingenierie.sn</a></p>
      </footer>
    </>
  )
}
