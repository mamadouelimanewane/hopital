"use client"
import { useState } from "react"
import Link from "next/link"

const STATS = [
  { label: "Médicaments en stock", value: "4 827", unit: "références", color: "#0ea5e9", icon: "💊" },
  { label: "Ordonnances traitées", value: "312", unit: "aujourd'hui", color: "#10b981", icon: "📋" },
  { label: "Alertes de rupture", value: "7", unit: "produits", color: "#f59e0b", icon: "⚠️" },
  { label: "Coût journalier stocks", value: "2.4M", unit: "FCFA", color: "#6366f1", icon: "💰" },
]

const MEDICAMENTS = [
  { nom: "Amoxicilline 500mg", categorie: "Antibiotiques", stock: 1240, seuil: 200, statut: "OK", fournisseur: "Laborex SN" },
  { nom: "Paracétamol 1g", categorie: "Antalgiques", stock: 3400, seuil: 500, statut: "OK", fournisseur: "COPHASE" },
  { nom: "Métformine 850mg", categorie: "Antidiabétiques", stock: 89, seuil: 200, statut: "CRITIQUE", fournisseur: "DPMED" },
  { nom: "Amlodipine 5mg", categorie: "Cardiovasculaires", stock: 450, seuil: 300, statut: "OK", fournisseur: "Laborex SN" },
  { nom: "Furosémide 40mg", categorie: "Diurétiques", stock: 124, seuil: 150, statut: "FAIBLE", fournisseur: "COPHASE" },
  { nom: "Artéméther/Luméfantrine", categorie: "Antipaludéens", stock: 2100, seuil: 400, statut: "OK", fournisseur: "PNLP" },
  { nom: "Glibenclamide 5mg", categorie: "Antidiabétiques", stock: 210, seuil: 250, statut: "FAIBLE", fournisseur: "DPMED" },
  { nom: "Enalapril 10mg", categorie: "Antihypertenseurs", stock: 680, seuil: 200, statut: "OK", fournisseur: "Laborex SN" },
]

const COLOR = "#14b8a6"

export default function SmartPharmaPage() {
  const [search, setSearch] = useState("")
  const filtered = MEDICAMENTS.filter(m => 
    m.nom.toLowerCase().includes(search.toLowerCase()) || 
    m.categorie.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        .fade{animation:fadeUp .5s both}
        .pulse{animation:pulse 2s infinite}
        .row:hover{background:rgba(255,255,255,0.04) !important}
        input:focus{outline:2px solid #14b8a6;border-color:transparent}
      `}</style>
      <div style={{ minHeight:"100vh", background:"#0a1628", color:"#fff", fontFamily:"system-ui,sans-serif" }}>
        
        {/* Header */}
        <header style={{ background:"rgba(10,22,40,0.95)", borderBottom:"1px solid rgba(20,184,166,0.2)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:50 }}>
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 1.5rem", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#14b8a6,#0891b2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>💊</div>
              <div>
                <p style={{ fontSize:15, fontWeight:800, color:"#fff", margin:0 }}>SmartPharma</p>
                <p style={{ fontSize:9, color:COLOR, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", margin:0 }}>Pharmacie Centrale · Hôpital Ndamatou</p>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div className="pulse" style={{ width:8, height:8, borderRadius:"50%", background:COLOR }} />
              <span style={{ fontSize:11, color:COLOR, fontWeight:700 }}>STOCKS EN TEMPS RÉEL</span>
            </div>
          </div>
        </header>

        <main style={{ maxWidth:1280, margin:"0 auto", padding:"2rem 1.5rem" }}>
          
          {/* KPI Cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:16, marginBottom:"2rem" }}>
            {STATS.map((s, i) => (
              <div key={s.label} className="fade" style={{ animationDelay:`${i*0.1}s`, background:"rgba(255,255,255,0.03)", border:`1px solid ${s.color}30`, borderRadius:16, padding:"1.5rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <p style={{ fontSize:11, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:"0.1em", margin:0 }}>{s.label}</p>
                    <p style={{ fontSize:32, fontWeight:800, color:s.color, margin:"8px 0 2px" }}>{s.value}</p>
                    <p style={{ fontSize:12, color:"rgba(255,255,255,0.35)", margin:0 }}>{s.unit}</p>
                  </div>
                  <span style={{ fontSize:28 }}>{s.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Search & Table */}
          <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, overflow:"hidden" }}>
            <div style={{ padding:"1.5rem", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
              <div>
                <h2 style={{ fontSize:18, fontWeight:800, color:"#fff", margin:0 }}>Inventaire Pharmacie</h2>
                <p style={{ fontSize:13, color:"rgba(255,255,255,0.4)", margin:0 }}>{filtered.length} médicaments affichés</p>
              </div>
              <input
                type="text"
                placeholder="🔍  Rechercher un médicament ou catégorie..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"8px 16px", color:"#fff", fontSize:13, width:280 }}
              />
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:"rgba(255,255,255,0.03)" }}>
                    {["Médicament","Catégorie","Stock","Seuil mini","Fournisseur","Statut"].map(h => (
                      <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m, i) => {
                    const statutColor = m.statut === "OK" ? "#10b981" : m.statut === "FAIBLE" ? "#f59e0b" : "#ef4444"
                    return (
                      <tr key={m.nom} className="row" style={{ borderTop:"1px solid rgba(255,255,255,0.04)", transition:"background 0.2s", cursor:"pointer" }}>
                        <td style={{ padding:"14px 16px", fontSize:14, fontWeight:700, color:"#fff" }}>{m.nom}</td>
                        <td style={{ padding:"14px 16px", fontSize:13, color:"rgba(255,255,255,0.55)" }}>{m.categorie}</td>
                        <td style={{ padding:"14px 16px", fontSize:14, fontWeight:700, color: m.statut !== "OK" ? "#f59e0b" : "#fff" }}>{m.stock.toLocaleString()}</td>
                        <td style={{ padding:"14px 16px", fontSize:13, color:"rgba(255,255,255,0.4)" }}>{m.seuil}</td>
                        <td style={{ padding:"14px 16px", fontSize:13, color:"rgba(255,255,255,0.55)" }}>{m.fournisseur}</td>
                        <td style={{ padding:"14px 16px" }}>
                          <span style={{ background:`${statutColor}18`, color:statutColor, padding:"4px 12px", borderRadius:100, fontSize:11, fontWeight:700 }}>{m.statut}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions rapides */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:12, marginTop:"1.5rem" }}>
            {[
              {label:"Nouvelle ordonnance", icon:"📋", color:"#0ea5e9"},
              {label:"Commander stock", icon:"📦", color:"#10b981"},
              {label:"Rapport DCI", icon:"📊", color:"#6366f1"},
              {label:"Alertes rupture", icon:"🔔", color:"#f59e0b"},
            ].map(a => (
              <button key={a.label} style={{ background:`${a.color}15`, border:`1px solid ${a.color}30`, borderRadius:12, padding:"14px", cursor:"pointer", color:a.color, fontWeight:700, fontSize:13, display:"flex", alignItems:"center", gap:8, transition:"all 0.2s" }}>
                <span style={{ fontSize:20 }}>{a.icon}</span>{a.label}
              </button>
            ))}
          </div>
        </main>
      </div>
    </>
  )
}
