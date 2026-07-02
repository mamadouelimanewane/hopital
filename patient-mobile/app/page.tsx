"use client"
import { useState } from "react"

const RDV = [
  { medecin: "Dr. Ousmane Fall", specialite: "Cardiologie", date: "15 Juil. 2026", heure: "10h30", lieu: "Bât. A, Salle 12", statut: "confirmé" },
  { medecin: "Dr. Fatou Mbaye", specialite: "Néphrologie", date: "22 Juil. 2026", heure: "14h00", lieu: "Bât. C, Hémodialyse", statut: "confirmé" },
  { medecin: "Pr. Amadou Diallo", specialite: "Radiologie", date: "28 Juil. 2026", heure: "09h00", lieu: "Bât. B, Scanner", statut: "à confirmer" },
]

const RESULTATS = [
  { type: "NFS complète", date: "01 Juil. 2026", statut: "disponible", icon: "🩸" },
  { type: "Biochimie rénale", date: "28 Juin 2026", statut: "disponible", icon: "🧪" },
  { type: "ECG 12 dérivations", date: "20 Juin 2026", statut: "disponible", icon: "❤️" },
]

const ORDONNANCES = [
  { medecin: "Dr. Fall", date: "01 Juil. 2026", medicaments: ["Amlodipine 5mg — 1cp/j matin", "Metformine 850mg — 1cp matin et soir", "Aspirine 100mg — 1cp/j"] },
  { medecin: "Dr. Mbaye", date: "15 Juin 2026", medicaments: ["EPO 4000 UI — 3x/semaine", "Fer injectable — selon protocole"] },
]

const COLOR = "#0284c7"

export default function PatientPage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        .fade{animation:fadeUp .5s both} .pulse{animation:pulse 2s infinite}
        .card{transition:all .3s} .card:hover{transform:translateY(-2px)}
        button{cursor:pointer;border:none}
      `}</style>
      <div style={{ minHeight:"100vh", background:"#0a1628", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
        <header style={{ background:"rgba(10,22,40,0.95)", borderBottom:"1px solid rgba(2,132,199,0.2)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:50 }}>
          <div style={{ maxWidth:600, margin:"0 auto", padding:"0 1.5rem", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#0284c7,#0369a1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>📱</div>
              <div>
                <p style={{ fontSize:15, fontWeight:800, color:"#fff", margin:0 }}>Mon Espace <span style={{color:COLOR}}>Patient</span></p>
                <p style={{ fontSize:9, color:"rgba(2,132,199,0.7)", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", margin:0 }}>Hôpital Ndamatou · Touba</p>
              </div>
            </div>
          </div>
        </header>
        <main style={{ maxWidth:600, margin:"0 auto", padding:"1.5rem" }}>
          <div className="fade" style={{ background:"rgba(2,132,199,0.08)", border:"1px solid rgba(2,132,199,0.2)", borderRadius:16, padding:"1.5rem", marginBottom:"1.5rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:52, height:52, borderRadius:"50%", background:"linear-gradient(135deg,#0ea5e9,#0284c7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>👤</div>
              <div>
                <p style={{ fontSize:18, fontWeight:800, color:"#fff", margin:0 }}>Modou Ndiaye</p>
                <p style={{ fontSize:12, color:"rgba(255,255,255,0.5)", margin:0 }}>45 ans · Masculin</p>
                <p style={{ fontSize:11, color:COLOR, fontWeight:600, fontFamily:"monospace", margin:0 }}>N° NDM-2024-4827</p>
              </div>
            </div>
          </div>

          <button style={{ width:"100%", background:"linear-gradient(135deg,#ef4444,#dc2626)", color:"#fff", padding:"14px", borderRadius:12, fontSize:15, fontWeight:800, marginBottom:"1.5rem", boxShadow:"0 4px 20px rgba(239,68,68,0.3)" }}>🚨 Appeler les Urgences</button>

          <h2 style={{ fontSize:16, fontWeight:700, margin:"0 0 12px", color:"rgba(255,255,255,0.7)" }}>📅 Mes rendez-vous</h2>
          {RDV.map((r, i) => (
            <div key={r.medecin} className="card fade" style={{ animationDelay:`${i*0.1}s`, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"1rem", marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <p style={{ fontSize:14, fontWeight:700, color:"#fff", margin:0 }}>{r.medecin}</p>
                  <p style={{ fontSize:12, color:"rgba(255,255,255,0.5)", margin:"2px 0" }}>{r.specialite} · {r.lieu}</p>
                  <p style={{ fontSize:13, color:COLOR, fontWeight:600, margin:0 }}>{r.date} à {r.heure}</p>
                </div>
                <span style={{ background: r.statut==="confirmé" ? "#10b98118" : "#f59e0b18", color: r.statut==="confirmé" ? "#10b981" : "#f59e0b", padding:"3px 10px", borderRadius:100, fontSize:10, fontWeight:700 }}>{r.statut}</span>
              </div>
            </div>
          ))}

          <h2 style={{ fontSize:16, fontWeight:700, margin:"1.5rem 0 12px", color:"rgba(255,255,255,0.7)" }}>📋 Mes résultats</h2>
          {RESULTATS.map(r => (
            <div key={r.type} className="card" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"1rem", marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:20 }}>{r.icon}</span>
                <div>
                  <p style={{ fontSize:14, fontWeight:600, color:"#fff", margin:0 }}>{r.type}</p>
                  <p style={{ fontSize:11, color:"rgba(255,255,255,0.4)", margin:0 }}>{r.date}</p>
                </div>
              </div>
              <button style={{ background:`${COLOR}18`, color:COLOR, border:`1px solid ${COLOR}30`, borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700 }}>Voir</button>
            </div>
          ))}

          <h2 style={{ fontSize:16, fontWeight:700, margin:"1.5rem 0 12px", color:"rgba(255,255,255,0.7)" }}>💊 Ordonnances actives</h2>
          {ORDONNANCES.map((o, i) => (
            <div key={i} className="card" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"1rem", marginBottom:10 }}>
              <p style={{ fontSize:13, fontWeight:700, color:"#fff", margin:"0 0 4px" }}>{o.medecin} — {o.date}</p>
              {o.medicaments.map(m => (
                <p key={m} style={{ fontSize:12, color:"rgba(255,255,255,0.5)", margin:"3px 0", paddingLeft:12, borderLeft:"2px solid rgba(2,132,199,0.3)" }}>{m}</p>
              ))}
            </div>
          ))}

          <button style={{ width:"100%", background:`${COLOR}15`, color:COLOR, border:`1px solid ${COLOR}30`, padding:"14px", borderRadius:12, fontSize:14, fontWeight:700, marginTop:"1rem" }}>📅 Prendre un nouveau rendez-vous</button>
        </main>
      </div>
    </>
  )
}
