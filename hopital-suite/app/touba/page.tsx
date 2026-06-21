"use client";
import { useState, useEffect } from "react";

const ACCENT = "#f59e0b";
const BG = "#050d1a";
const CARD = "#0a1628";
const BORDER = "1px solid rgba(255,255,255,0.06)";
const TEXT = "#e2e8f0";
const MUTED = "#64748b";

const MAGAL_DATE = new Date("2026-10-15T00:00:00");

const POSTES = [
  { name: "Darou Khoudoss", x: 200, y: 140, status: "ok", consultations: 247, charge: 62 },
  { name: "Guédé", x: 310, y: 100, status: "warn", consultations: 891, charge: 84 },
  { name: "Keur Niang", x: 160, y: 200, status: "ok", consultations: 134, charge: 41 },
  { name: "Touba Mosquée", x: 280, y: 190, status: "critical", consultations: 1243, charge: 97 },
  { name: "Ndamatou", x: 380, y: 170, status: "warn", consultations: 567, charge: 79 },
  { name: "Dianatou", x: 240, y: 260, status: "ok", consultations: 312, charge: 53 },
];

const RESSOURCES = [
  { item: "Paracétamol 500mg", stock: "120,000 cp", niveau: 88, unit: "comprimés" },
  { item: "Sérum physiologique", stock: "3,400 flacons", niveau: 72, unit: "flacons" },
  { item: "Poches de sang O+", stock: "480 poches", niveau: 60, unit: "poches" },
  { item: "Lits de réserve", stock: "340 lits", niveau: 45, unit: "lits disponibles" },
  { item: "Masques FFP2", stock: "25,000 unités", niveau: 93, unit: "unités" },
  { item: "Défibrillateurs", stock: "47 appareils", niveau: 100, unit: "opérationnels" },
];

const PROTOCOLES = [
  { title: "Déshydratation Sévère", icon: "💧", steps: ["Évaluation rapide (< 2min)", "Réhydratation IV NaCl 0.9%", "Monitoring 30 min", "Transfert si nécessaire"], color: "#3b82f6" },
  { title: "Mouvement de Foule", icon: "🚨", steps: ["Activation cellule crise", "Cordons de sécurité", "Triage rouge/jaune/vert", "Évacuation prioritaire"], color: "#ef4444" },
  { title: "Maladies Virales", icon: "🦠", steps: ["Isolement immédiat", "Test rapide antigénique", "Traitement symptomatique", "Notification épidémio"], color: "#a855f7" },
  { title: "Urgences Cardiaques", icon: "❤️", steps: ["ECG 12 dérivations", "Aspégic 300mg PO", "Transfert CHNCAK < 30min", "Dossier SAMU transmis"], color: "#ef4444" },
];

function getCountdown() {
  const now = new Date();
  const diff = MAGAL_DATE.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { days, hours, minutes };
}

const statusColor = (s: string) => s === "ok" ? "#22c55e" : s === "warn" ? "#f59e0b" : "#ef4444";

export default function ToubaPage() {
  const [countdown, setCountdown] = useState(getCountdown());
  const [consultations, setConsultations] = useState(14237);
  const [animIn, setAnimIn] = useState(false);
  const [selectedPoste, setSelectedPoste] = useState<string | null>(null);

  useEffect(() => {
    setAnimIn(true);
    const interval = setInterval(() => {
      setCountdown(getCountdown());
      setConsultations(prev => prev + Math.floor(Math.random() * 8 + 2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight:"100vh", background:BG, color:TEXT, fontFamily:"'Inter', system-ui, sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes countUp { from{transform:scale(0.8);opacity:0} to{transform:scale(1);opacity:1} }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#050d1a} ::-webkit-scrollbar-thumb{background:#f59e0b30;border-radius:4px}
      `}</style>

      {/* Nav */}
      <div style={{ position:"sticky", top:0, zIndex:200, background:"rgba(5,13,26,0.96)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(14,165,233,0.12)", padding:"0 1.5rem", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <a href="/" style={{ display:"inline-flex", alignItems:"center", gap:8, color:"rgba(255,255,255,0.5)", textDecoration:"none", fontSize:13, fontWeight:600 }}>← Portail CHNCAK</a>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>CHNCAK Suite</span>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"2rem 1.5rem" }}>

        {/* Header */}
        <div style={{ animation: animIn ? "fadeUp 0.5s ease both" : "none", marginBottom:"2rem" }}>
          <div style={{ background:`linear-gradient(135deg, ${ACCENT}15 0%, transparent 60%)`, border:`1px solid ${ACCENT}25`, borderRadius:16, padding:"1.5rem 2rem", marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16 }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                  <span style={{ fontSize:28 }}>🕌</span>
                  <h1 style={{ margin:0, fontSize:26, fontWeight:700, color:TEXT }}>Touba MedCare</h1>
                </div>
                <p style={{ margin:0, fontSize:14, color:MUTED }}>Grand Magal de Touba 2026 — Cellule Médicale Nationale</p>
              </div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <span style={{ animation:"pulse 2s infinite", width:8, height:8, borderRadius:"50%", background:ACCENT, display:"inline-block" }}></span>
                <span style={{ fontSize:12, color:ACCENT, fontWeight:700 }}>OPÉRATION ACTIVE</span>
              </div>
            </div>

            {/* Countdown */}
            <div style={{ marginTop:16, display:"flex", gap:12, alignItems:"center" }}>
              <span style={{ fontSize:12, color:MUTED, fontWeight:600 }}>GRAND MAGAL DANS :</span>
              {[
                { val: countdown.days, label: "Jours" },
                { val: countdown.hours, label: "Heures" },
                { val: countdown.minutes, label: "Minutes" },
              ].map((c, i) => (
                <div key={i} style={{ background:"rgba(245,158,11,0.12)", border:`1px solid ${ACCENT}30`, borderRadius:10, padding:"8px 14px", textAlign:"center" }}>
                  <div style={{ fontSize:24, fontWeight:700, color:ACCENT, lineHeight:1 }}>{c.val}</div>
                  <div style={{ fontSize:10, color:MUTED, marginTop:2, textTransform:"uppercase", letterSpacing:"0.05em" }}>{c.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
            {[
              { icon:"👥", value:"3M+", label:"Pèlerins attendus" },
              { icon:"🏥", value:"47", label:"Postes médicaux" },
              { icon:"👨‍⚕️", value:"200", label:"Médecins mobilisés" },
              { icon:"🚑", value:"15", label:"Ambulances" },
            ].map((s,i) => (
              <div key={i} style={{ background:CARD, border:BORDER, borderRadius:14, padding:"1.25rem", animation:`fadeUp ${0.4+i*0.1}s ease both` }}>
                <div style={{ fontSize:24, marginBottom:8 }}>{s.icon}</div>
                <div style={{ fontSize:26, fontWeight:700, color:ACCENT }}>{s.value}</div>
                <div style={{ fontSize:12, color:MUTED, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Carte des Postes */}
        <div style={{ background:CARD, border:BORDER, borderRadius:16, padding:"1.5rem", marginBottom:16 }}>
          <h2 style={{ margin:"0 0 1rem", fontSize:16, fontWeight:700, color:TEXT }}>🗺️ Carte des Postes Médicaux — Touba</h2>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:16 }}>
            <div style={{ position:"relative", background:"rgba(245,158,11,0.03)", border:"1px solid rgba(245,158,11,0.1)", borderRadius:12, overflow:"hidden" }}>
              <svg width="100%" height="340" viewBox="0 0 500 340">
                {/* Fond ville */}
                <rect width="500" height="340" fill="rgba(245,158,11,0.02)" />
                {/* Routes stylisées */}
                <line x1={100} y1={170} x2={400} y2={170} stroke="rgba(245,158,11,0.08)" strokeWidth={8} strokeLinecap="round" />
                <line x1={270} y1={60} x2={270} y2={300} stroke="rgba(245,158,11,0.08)" strokeWidth={8} strokeLinecap="round" />
                <line x1={130} y1={100} x2={400} y2={270} stroke="rgba(245,158,11,0.05)" strokeWidth={4} strokeLinecap="round" />
                {/* Mosquée centrale */}
                <rect x={245} y={155} width={50} height={40} rx={4} fill="rgba(245,158,11,0.15)" stroke={`${ACCENT}50`} strokeWidth={1.5} />
                <text x={270} y={180} textAnchor="middle" fill={ACCENT} fontSize={10} fontWeight="700">MOSQUÉE</text>
                {/* Postes */}
                {POSTES.map((p) => (
                  <g key={p.name} onClick={() => setSelectedPoste(selectedPoste===p.name ? null : p.name)} style={{ cursor:"pointer" }}>
                    <circle cx={p.x} cy={p.y} r={selectedPoste===p.name ? 14 : 10} fill={statusColor(p.status)} fillOpacity={selectedPoste===p.name ? 0.4 : 0.2} stroke={statusColor(p.status)} strokeWidth={2} />
                    <circle cx={p.x} cy={p.y} r={4} fill={statusColor(p.status)} />
                    <text x={p.x} y={p.y-16} textAnchor="middle" fill={TEXT} fontSize={9} fontWeight="600">{p.name.split(" ")[0]}</text>
                  </g>
                ))}
              </svg>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {POSTES.map((p) => (
                <div key={p.name} onClick={() => setSelectedPoste(selectedPoste===p.name ? null : p.name)} style={{
                  background: selectedPoste===p.name ? `rgba(245,158,11,0.08)` : "transparent",
                  border: selectedPoste===p.name ? `1px solid ${ACCENT}30` : BORDER,
                  borderRadius:10, padding:"10px 12px", cursor:"pointer", transition:"all 0.2s"
                }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                    <span style={{ fontSize:12, fontWeight:600, color:TEXT }}>{p.name}</span>
                    <span style={{ width:8, height:8, borderRadius:"50%", background:statusColor(p.status), display:"inline-block" }}></span>
                  </div>
                  <div style={{ fontSize:11, color:MUTED, marginBottom:6 }}>{p.consultations} consultations</div>
                  <div style={{ height:4, background:"rgba(255,255,255,0.06)", borderRadius:2 }}>
                    <div style={{ height:4, width:`${p.charge}%`, background:statusColor(p.status), borderRadius:2, transition:"width 0.5s" }}></div>
                  </div>
                  <div style={{ fontSize:10, color:MUTED, marginTop:3 }}>Charge: {p.charge}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Flux temps réel */}
        <div style={{ background:CARD, border:BORDER, borderRadius:16, padding:"1.5rem", marginBottom:16 }}>
          <h2 style={{ margin:"0 0 1rem", fontSize:16, fontWeight:700, color:TEXT }}>⚡ Flux en Temps Réel</h2>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <div style={{ background:"rgba(245,158,11,0.05)", border:`1px solid ${ACCENT}20`, borderRadius:12, padding:"1.25rem", textAlign:"center" }}>
              <div style={{ fontSize:48, fontWeight:700, color:ACCENT, animation:"countUp 0.3s ease" }}>{consultations.toLocaleString("fr-FR")}</div>
              <div style={{ fontSize:13, color:MUTED, marginTop:4 }}>Consultations totales</div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginTop:8 }}>
                <span style={{ animation:"pulse 1.5s infinite", width:6, height:6, borderRadius:"50%", background:"#22c55e", display:"inline-block" }}></span>
                <span style={{ fontSize:11, color:"#22c55e", fontWeight:600 }}>Flux actif — +5 / 3 sec</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize:13, color:MUTED, marginBottom:10, fontWeight:600 }}>Charge par poste</div>
              {POSTES.map((p) => (
                <div key={p.name} style={{ marginBottom:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:MUTED, marginBottom:3 }}>
                    <span>{p.name}</span><span style={{ color:statusColor(p.status), fontWeight:600 }}>{p.charge}%</span>
                  </div>
                  <div style={{ height:5, background:"rgba(255,255,255,0.06)", borderRadius:3 }}>
                    <div style={{ height:5, width:`${p.charge}%`, background:statusColor(p.status), borderRadius:3, transition:"width 1s" }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ressources */}
        <div style={{ background:CARD, border:BORDER, borderRadius:16, padding:"1.5rem", marginBottom:16 }}>
          <h2 style={{ margin:"0 0 1rem", fontSize:16, fontWeight:700, color:TEXT }}>📦 Ressources Médicales</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10 }}>
            {RESSOURCES.map((r, i) => (
              <div key={i} style={{ background:"rgba(245,158,11,0.03)", border:`1px solid ${ACCENT}15`, borderRadius:12, padding:"12px 16px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:TEXT }}>{r.item}</span>
                  <span style={{ fontSize:12, color:ACCENT, fontWeight:700 }}>{r.niveau}%</span>
                </div>
                <div style={{ height:5, background:"rgba(255,255,255,0.06)", borderRadius:3, marginBottom:6 }}>
                  <div style={{ height:5, width:`${r.niveau}%`, background: r.niveau > 75 ? "#22c55e" : r.niveau > 40 ? ACCENT : "#ef4444", borderRadius:3 }}></div>
                </div>
                <div style={{ fontSize:11, color:MUTED }}>{r.stock} · {r.unit}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Protocoles Magal */}
        <div style={{ background:CARD, border:BORDER, borderRadius:16, padding:"1.5rem" }}>
          <h2 style={{ margin:"0 0 1rem", fontSize:16, fontWeight:700, color:TEXT }}>🏥 Protocoles Magal</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12 }}>
            {PROTOCOLES.map((p, i) => (
              <div key={i} style={{ background:`${p.color}08`, border:`1px solid ${p.color}20`, borderRadius:14, padding:"1.25rem" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                  <span style={{ fontSize:24 }}>{p.icon}</span>
                  <span style={{ fontWeight:700, fontSize:14, color:TEXT }}>{p.title}</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {p.steps.map((step, j) => (
                    <div key={j} style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ width:18, height:18, borderRadius:"50%", background:`${p.color}25`, color:p.color, fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{j+1}</span>
                      <span style={{ fontSize:12, color:TEXT }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
