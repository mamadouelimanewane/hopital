"use client";
import { useState, useEffect } from "react";

const ACCENT = "#f97316";
const BG = "#050d1a";
const CARD = "#0a1628";
const BORDER = "1px solid rgba(255,255,255,0.06)";
const TEXT = "#e2e8f0";
const MUTED = "#64748b";

const SERVICES = [
  { name: "Urgences", fill: 94, beds: 47, max: 50 },
  { name: "Médecine Interne", fill: 78, beds: 39, max: 50 },
  { name: "Pédiatrie", fill: 65, beds: 26, max: 40 },
  { name: "Chirurgie", fill: 88, beds: 44, max: 50 },
  { name: "Réanimation", fill: 100, beds: 16, max: 16 },
  { name: "Maternité", fill: 71, beds: 25, max: 35 },
];

const PERSONNEL = [
  { corps: "Médecins", present: 47, total: 50, icon: "👨‍⚕️" },
  { corps: "Infirmiers", present: 123, total: 150, icon: "👩‍⚕️" },
  { corps: "Aides-soignants", present: 89, total: 100, icon: "🏥" },
  { corps: "Secouristes", present: 34, total: 40, icon: "🚑" },
  { corps: "Administratif", present: 18, total: 20, icon: "💼" },
];

const DECISIONS = [
  { heure: "14:32", decision: "Ouverture salle de débordement B4 — 30 lits supplémentaires", responsable: "Dr. Diallo Amadou", level: "critical" },
  { heure: "13:47", decision: "Rappel de 12 infirmiers en congé — renfort immédiat", responsable: "Mme Fatou Mbaye, DRH", level: "warn" },
  { heure: "12:15", decision: "Convention activée avec Clinique du Cap — transferts autorisés", responsable: "Dr. Ibrahima Sow", level: "info" },
  { heure: "11:00", decision: "Stock de sang renforcé — 80 poches O+ livrées par EFS", responsable: "Pharmacie centrale", level: "ok" },
  { heure: "09:20", decision: "Déclenchement Plan Blanc partiel — Niveau 3 activé", responsable: "Direction CHNCAK", level: "critical" },
];

const fillColor = (pct: number) => pct >= 95 ? "#ef4444" : pct >= 85 ? "#f97316" : pct >= 70 ? "#f59e0b" : "#22c55e";
const levelColor = (l: string) => l === "critical" ? "#ef4444" : l === "warn" ? "#f59e0b" : l === "ok" ? "#22c55e" : "#60a5fa";

export default function MagalSurgePage() {
  const [admissions, setAdmissions] = useState(47);
  const [casGraves, setCasGraves] = useState(12);
  const [showModal, setShowModal] = useState(false);
  const [alerted, setAlerted] = useState(false);
  const [animIn, setAnimIn] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setAnimIn(true);
    const interval = setInterval(() => {
      setAdmissions(prev => prev + Math.floor(Math.random() * 3));
      setCasGraves(prev => Math.max(10, prev + (Math.random() > 0.7 ? 1 : 0)));
      setTime(new Date());
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const totalBeds = SERVICES.reduce((a, s) => a + s.max, 0);
  const occupiedBeds = SERVICES.reduce((a, s) => a + s.beds, 0);
  const globalOccupancy = Math.round((occupiedBeds / totalBeds) * 100);

  return (
    <div style={{ minHeight:"100vh", background:BG, color:TEXT, fontFamily:"'Inter', system-ui, sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes slideIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#050d1a} ::-webkit-scrollbar-thumb{background:#f9731630;border-radius:4px}
      `}</style>

      {/* Nav */}
      <div style={{ position:"sticky", top:0, zIndex:200, background:"rgba(5,13,26,0.96)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(14,165,233,0.12)", padding:"0 1.5rem", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <a href="/" style={{ display:"inline-flex", alignItems:"center", gap:8, color:"rgba(255,255,255,0.5)", textDecoration:"none", fontSize:13, fontWeight:600 }}>← Portail CHNCAK</a>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>CHNCAK Suite</span>
      </div>

      {/* Modal Alerte */}
      {showModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:"#0f1a2e", border:"1px solid rgba(249,115,22,0.5)", borderRadius:16, padding:"2rem", maxWidth:440, width:"90%", animation:"slideIn 0.2s ease" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <span style={{ fontSize:28 }}>🚨</span>
              <div>
                <div style={{ fontWeight:700, fontSize:17, color:"#ef4444" }}>Confirmer Alerte Niveau 4</div>
                <div style={{ fontSize:12, color:MUTED, marginTop:2 }}>Action irréversible — notification massive</div>
              </div>
            </div>
            <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:10, padding:"12px 14px", marginBottom:16 }}>
              <p style={{ margin:0, fontSize:13, color:TEXT, lineHeight:1.6 }}>
                Le déclenchement du <strong style={{ color:"#ef4444" }}>Niveau 4 — Alerte Maximale</strong> activera :
                <br />• Rappel de TOUT le personnel disponible
                <br />• Transfert automatique des patients stables
                <br />• Notification Ministère de la Santé
                <br />• Mobilisation des équipes militaires de secours
              </p>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setShowModal(false)} style={{ flex:1, padding:"10px", borderRadius:8, border:BORDER, background:"transparent", color:MUTED, cursor:"pointer", fontWeight:600, fontSize:13 }}>Annuler</button>
              <button onClick={() => { setAlerted(true); setShowModal(false); }} style={{ flex:1, padding:"10px", borderRadius:8, border:"1px solid #ef4444", background:"rgba(239,68,68,0.15)", color:"#ef4444", cursor:"pointer", fontWeight:700, fontSize:13 }}>
                ⚡ CONFIRMER NIVEAU 4
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"2rem 1.5rem" }}>

        {/* Header */}
        <div style={{ animation: animIn ? "fadeUp 0.5s ease both" : "none", marginBottom:"2rem" }}>
          <div style={{ background:`linear-gradient(135deg, rgba(249,115,22,0.12) 0%, transparent 60%)`, border:`1px solid rgba(249,115,22,0.25)`, borderRadius:16, padding:"1.25rem 1.5rem", marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ fontSize:28 }}>⚡</div>
                <div>
                  <h1 style={{ margin:0, fontSize:24, fontWeight:700, color:TEXT }}>Magal Surge — Cellule de Crise</h1>
                  <p style={{ margin:0, fontSize:12, color:MUTED, marginTop:2 }}>Gestion de crise & Montée en charge — Grand Événement 2026</p>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                <div style={{
                  display:"flex", alignItems:"center", gap:8, padding:"6px 14px",
                  background: alerted ? "rgba(239,68,68,0.15)" : "rgba(249,115,22,0.15)",
                  border: alerted ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(249,115,22,0.4)",
                  borderRadius:10
                }}>
                  <span style={{ animation:"blink 1s infinite", width:8, height:8, borderRadius:"50%", background:alerted ? "#ef4444" : ACCENT, display:"inline-block" }}></span>
                  <span style={{ fontWeight:700, fontSize:13, color:alerted ? "#ef4444" : ACCENT }}>
                    {alerted ? "ROUGE — Niveau 4/5" : "ORANGE — Niveau 3/5"}
                  </span>
                </div>
                <span style={{ fontSize:11, color:MUTED }}>{time.toLocaleTimeString("fr-FR", { hour:"2-digit", minute:"2-digit", second:"2-digit" })}</span>
              </div>
            </div>
          </div>

          {/* Dashboard stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
            {[
              { label:"Occupancy globale", value:`${globalOccupancy}%`, color: globalOccupancy >= 90 ? "#ef4444" : ACCENT, icon:"🏥" },
              { label:"Admissions/heure", value:`${admissions}`, color:ACCENT, icon:"📈" },
              { label:"Cas graves actifs", value:`${casGraves}`, color:"#ef4444", icon:"🚨" },
              { label:"Décès (24h)", value:"0", color:"#22c55e", icon:"✅" },
            ].map((s,i) => (
              <div key={i} style={{ background:CARD, border:BORDER, borderRadius:14, padding:"1.25rem", animation:`fadeUp ${0.4+i*0.1}s ease both`, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`${s.color}50` }}></div>
                <div style={{ fontSize:22, marginBottom:8 }}>{s.icon}</div>
                <div style={{ fontSize:32, fontWeight:700, color:s.color, lineHeight:1 }}>{s.value}</div>
                <div style={{ fontSize:12, color:MUTED, marginTop:6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Capacités services */}
        <div style={{ background:CARD, border:BORDER, borderRadius:16, padding:"1.5rem", marginBottom:14 }}>
          <h2 style={{ margin:"0 0 1rem", fontSize:15, fontWeight:700, color:TEXT }}>🏥 Capacités en Temps Réel</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
            {SERVICES.map((s, i) => (
              <div key={i} style={{ background:"rgba(255,255,255,0.02)", border:`1px solid ${s.fill >= 90 ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.06)"}`, borderRadius:12, padding:"12px 14px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <span style={{ fontWeight:600, fontSize:13, color:TEXT }}>{s.name}</span>
                  <span style={{ fontSize:14, fontWeight:700, color:fillColor(s.fill) }}>{s.fill}%</span>
                </div>
                <div style={{ height:8, background:"rgba(255,255,255,0.06)", borderRadius:4, overflow:"hidden", marginBottom:6 }}>
                  <div style={{
                    height:8, borderRadius:4, transition:"width 1s ease",
                    width:`${s.fill}%`,
                    background: s.fill >= 95 ? `linear-gradient(90deg, #ef444460, #ef4444)` : s.fill >= 85 ? `linear-gradient(90deg, ${ACCENT}60, ${ACCENT})` : `linear-gradient(90deg, #22c55e60, #22c55e)`
                  }}></div>
                </div>
                <div style={{ fontSize:11, color:MUTED }}>
                  {s.beds} / {s.max} lits occupés
                  {s.fill >= 95 && <span style={{ marginLeft:8, color:"#ef4444", fontWeight:700, animation:"blink 1s infinite" }}>SATURATION</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>

          {/* Personnel mobilisé */}
          <div style={{ background:CARD, border:BORDER, borderRadius:16, padding:"1.5rem" }}>
            <h2 style={{ margin:"0 0 1rem", fontSize:15, fontWeight:700, color:TEXT }}>👥 Personnel Mobilisé</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {PERSONNEL.map((p, i) => {
                const pct = Math.round((p.present/p.total)*100);
                return (
                  <div key={i}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:16 }}>{p.icon}</span>
                        <span style={{ fontSize:13, fontWeight:600, color:TEXT }}>{p.corps}</span>
                      </div>
                      <span style={{ fontSize:13, fontWeight:700, color: pct >= 95 ? "#22c55e" : pct >= 80 ? ACCENT : "#ef4444" }}>
                        {p.present}/{p.total}
                      </span>
                    </div>
                    <div style={{ height:5, background:"rgba(255,255,255,0.06)", borderRadius:3 }}>
                      <div style={{ height:5, width:`${pct}%`, borderRadius:3, background: pct >= 90 ? "#22c55e" : pct >= 75 ? ACCENT : "#ef4444", transition:"width 0.5s" }}></div>
                    </div>
                  </div>
                );
              })}
              <div style={{ marginTop:8, paddingTop:8, borderTop:BORDER, display:"flex", justifyContent:"space-between", fontSize:12 }}>
                <span style={{ color:MUTED }}>Total personnel présent</span>
                <span style={{ color:ACCENT, fontWeight:700 }}>311 / 360</span>
              </div>
            </div>
          </div>

          {/* Décisions de crise */}
          <div style={{ background:CARD, border:BORDER, borderRadius:16, padding:"1.5rem" }}>
            <h2 style={{ margin:"0 0 1rem", fontSize:15, fontWeight:700, color:TEXT }}>📋 Décisions de Crise</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {DECISIONS.map((d, i) => (
                <div key={i} style={{ display:"flex", gap:10, padding:"10px 12px", background:`${levelColor(d.level)}06`, border:`1px solid ${levelColor(d.level)}18`, borderRadius:10 }}>
                  <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                    <span style={{ fontSize:10, color:MUTED, fontWeight:600 }}>{d.heure}</span>
                    <div style={{ width:2, flex:1, background:`${levelColor(d.level)}30`, minHeight:16 }}></div>
                  </div>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:12, color:TEXT, fontWeight:500, lineHeight:1.4, marginBottom:4 }}>{d.decision}</div>
                    <div style={{ fontSize:11, color:MUTED }}>— {d.responsable}</div>
                  </div>
                  <div style={{ flexShrink:0 }}>
                    <span style={{ width:8, height:8, borderRadius:"50%", background:levelColor(d.level), display:"inline-block", marginTop:2 }}></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bouton alerte */}
        <div style={{ background:CARD, border:alerted ? "1px solid rgba(239,68,68,0.3)" : BORDER, borderRadius:16, padding:"1.5rem" }}>
          {alerted ? (
            <div style={{ display:"flex", alignItems:"center", gap:12, justifyContent:"center" }}>
              <span style={{ animation:"blink 1s infinite", fontSize:24 }}>🚨</span>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontWeight:700, fontSize:16, color:"#ef4444" }}>ALERTE NIVEAU 4 ACTIVÉE</div>
                <div style={{ fontSize:12, color:MUTED, marginTop:4 }}>Toutes les équipes ont été notifiées · {time.toLocaleTimeString("fr-FR")}</div>
              </div>
              <span style={{ animation:"blink 1s infinite", fontSize:24 }}>🚨</span>
            </div>
          ) : (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:TEXT }}>Escalader le niveau d'alerte</div>
                <div style={{ fontSize:12, color:MUTED, marginTop:2 }}>Actuellement Niveau 3 — Passage au Niveau 4 requis si occupancy &gt; 95%</div>
              </div>
              <button onClick={() => setShowModal(true)} style={{
                display:"flex", alignItems:"center", gap:8, padding:"10px 20px", borderRadius:10,
                border:`1px solid ${ACCENT}60`, background:`${ACCENT}15`,
                color:ACCENT, fontWeight:700, fontSize:13, cursor:"pointer",
                transition:"all 0.2s"
              }}>
                <span style={{ animation:"pulse 2s infinite", width:8, height:8, borderRadius:"50%", background:ACCENT, display:"inline-block" }}></span>
                Déclencher Alerte Niveau 4
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
