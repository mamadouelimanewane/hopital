"use client";
import { useState, useEffect } from "react";

const ACCENT = "#a855f7";
const BG = "#050d1a";
const CARD = "#0a1628";
const BORDER = "1px solid rgba(255,255,255,0.06)";
const TEXT = "#e2e8f0";
const MUTED = "#64748b";

const CASES = [
  { id: "NC-2026-001", patient: "Amadou Diallo", age: 58, scan: "IRM Cérébral", date: "21/06/2026", result: "Anomalie détectée", confidence: 91, status: "review" },
  { id: "NC-2026-002", patient: "Fatou Mbaye", age: 34, scan: "EEG 32 canaux", date: "21/06/2026", result: "Normale", confidence: 97, status: "ok" },
  { id: "NC-2026-003", patient: "Ibrahima Sow", age: 72, scan: "TDM Crâne", date: "20/06/2026", result: "Critique", confidence: 88, status: "critical" },
  { id: "NC-2026-004", patient: "Mariama Ba", age: 45, scan: "IRM Fonctionnel", date: "20/06/2026", result: "Normale", confidence: 99, status: "ok" },
  { id: "NC-2026-005", patient: "Moussa Ndiaye", age: 61, scan: "TDM Perfusion", date: "19/06/2026", result: "Anomalie détectée", confidence: 84, status: "review" },
];

const QUEUE = [
  { id: "Q-001", patient: "Cheikh Diop", priority: "P1", type: "IRM Urgence", delay: "15 min", status: "En cours" },
  { id: "Q-002", patient: "Rokhaya Fall", priority: "P2", type: "EEG Standard", delay: "45 min", status: "En attente" },
  { id: "Q-003", patient: "Ousmane Faye", priority: "P1", type: "TDM Crâne", delay: "20 min", status: "En cours" },
  { id: "Q-004", patient: "Aissatou Cissé", priority: "P3", type: "IRM Rachis", delay: "2h 10min", status: "En attente" },
  { id: "Q-005", patient: "Lamine Koné", priority: "P2", type: "EEG Sommeil", delay: "1h 30min", status: "En attente" },
  { id: "Q-006", patient: "Ndèye Seck", priority: "P3", type: "TDM Perfusion", delay: "3h 00min", status: "En attente" },
];

const PROTOCOLS = [
  { pathology: "AVC Ischémique", steps: ["TDM immédiat", "Bilan biologique", "Thrombolyse IV < 4h30", "Surveillance USI"], duration: "48h protocole actif" },
  { pathology: "Épilepsie Réfractaire", steps: ["EEG longue durée", "IRM 3T", "Consultation chirurgie", "Stimulation VNS"], duration: "30 jours évaluation" },
  { pathology: "Tumeur Cérébrale", steps: ["IRM avec gadolinium", "Biopsie stéréotaxique", "PET scan", "Réunion oncologie"], duration: "14 jours bilan" },
  { pathology: "Traumatisme Crânien", steps: ["TDM urgence", "Score Glasgow", "Surveillance ICP", "Rééducation précoce"], duration: "72h phase aiguë" },
  { pathology: "Démence / Alzheimer", steps: ["IRM volumétrique", "PET amyloïde", "Bilan neuropsychologique", "MMS + MOCA"], duration: "60 jours évaluation" },
];

const ANOMALY_BARS = [
  { label: "AVC", count: 18, color: "#ef4444" },
  { label: "Tumeurs", count: 12, color: ACCENT },
  { label: "Épilepsie", count: 24, color: "#f59e0b" },
  { label: "Trauma", count: 31, color: "#3b82f6" },
  { label: "Démentiel", count: 9, color: "#22c55e" },
  { label: "Autre", count: 33, color: MUTED },
];

const maxBar = Math.max(...ANOMALY_BARS.map(b => b.count));

export default function NeuroPage() {
  const [tab, setTab] = useState(0);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => { setAnimIn(true); }, []);

  const tabs = ["Analyses IA", "File d'attente", "Résultats", "Protocoles"];

  const resultColor = (r: string) => {
    if (r === "Critique") return "#ef4444";
    if (r === "Anomalie détectée") return "#f59e0b";
    return "#22c55e";
  };

  const priorityColor = (p: string) => {
    if (p === "P1") return "#ef4444";
    if (p === "P2") return "#f59e0b";
    return "#22c55e";
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, color: TEXT, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#050d1a} ::-webkit-scrollbar-thumb{background:#a855f730;border-radius:4px}
      `}</style>

      {/* Nav */}
      <div style={{ position:"sticky", top:0, zIndex:200, background:"rgba(5,13,26,0.96)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(14,165,233,0.12)", padding:"0 1.5rem", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <a href="/" style={{ display:"inline-flex", alignItems:"center", gap:8, color:"rgba(255,255,255,0.5)", textDecoration:"none", fontSize:13, fontWeight:600 }}>← Portail CHNCAK</a>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>CHNCAK Suite</span>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"2rem 1.5rem" }}>

        {/* Header */}
        <div style={{ animation: animIn ? "fadeUp 0.5s ease both" : "none", marginBottom:"2rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
            <div style={{ width:48, height:48, borderRadius:12, background:`${ACCENT}22`, border:`1px solid ${ACCENT}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>🧠</div>
            <div>
              <h1 style={{ margin:0, fontSize:26, fontWeight:700, color:TEXT }}>NeuroScan IA</h1>
              <p style={{ margin:0, fontSize:13, color:MUTED }}>CHNCAK — Neurologie & Imagerie Cérébrale IA</p>
            </div>
            <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6, background:`${ACCENT}15`, border:`1px solid ${ACCENT}30`, borderRadius:20, padding:"5px 14px" }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:ACCENT, display:"inline-block", animation:"pulse 2s infinite" }}></span>
              <span style={{ fontSize:11, color:ACCENT, fontWeight:700, letterSpacing:"0.05em" }}>IA ACTIVE</span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginTop:20 }}>
            {[
              { label:"Scans / mois", value:"127", icon:"📊", delta:"+8% vs mai", urgent:false },
              { label:"Précision IA", value:"94.2%", icon:"🎯", delta:"+1.3% vs mai", urgent:false },
              { label:"Cas en attente", value:"8", icon:"⏳", delta:"", urgent:true },
            ].map((s,i) => (
              <div key={i} style={{ background:CARD, border:BORDER, borderRadius:14, padding:"1.25rem 1.5rem", animation:`fadeUp ${0.4+i*0.1}s ease both` }}>
                <div style={{ fontSize:22, marginBottom:8 }}>{s.icon}</div>
                <div style={{ fontSize:30, fontWeight:700, color:s.urgent ? "#f59e0b" : ACCENT }}>{s.value}</div>
                <div style={{ fontSize:13, color:MUTED, marginTop:2 }}>{s.label}</div>
                {s.delta && <div style={{ fontSize:11, color:"#22c55e", marginTop:6, fontWeight:600 }}>{s.delta}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:4, marginBottom:"1.5rem", background:CARD, border:BORDER, borderRadius:10, padding:4, width:"fit-content" }}>
          {tabs.map((t,i) => (
            <button key={i} onClick={() => setTab(i)} style={{
              padding:"7px 20px", borderRadius:7, border:"none", cursor:"pointer", fontSize:13, fontWeight:600, transition:"all 0.2s",
              background: tab===i ? `${ACCENT}22` : "transparent",
              color: tab===i ? ACCENT : MUTED,
              outline: tab===i ? `1px solid ${ACCENT}40` : "none"
            }}>{t}</button>
          ))}
        </div>

        {/* Tab 0 — Analyses IA */}
        {tab === 0 && (
          <div style={{ animation:"fadeUp 0.3s ease both", display:"flex", flexDirection:"column", gap:10 }}>
            {CASES.map((c) => (
              <div key={c.id} onClick={() => setSelectedCase(selectedCase===c.id ? null : c.id)} style={{
                background:CARD, border: selectedCase===c.id ? `1px solid ${ACCENT}50` : BORDER,
                borderRadius:14, padding:"1rem 1.25rem", cursor:"pointer", transition:"all 0.2s"
              }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:40, height:40, borderRadius:10, background:`${ACCENT}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🧬</div>
                    <div>
                      <div style={{ fontWeight:600, fontSize:14, color:TEXT }}>{c.patient}, {c.age} ans</div>
                      <div style={{ fontSize:12, color:MUTED, marginTop:2 }}>{c.id} · {c.scan} · {c.date}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                    <span style={{ fontSize:13, color:MUTED }}>Confiance: <span style={{ color:ACCENT, fontWeight:700 }}>{c.confidence}%</span></span>
                    <span style={{ padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:600, background:`${resultColor(c.result)}20`, color:resultColor(c.result) }}>{c.result}</span>
                  </div>
                </div>
                {selectedCase === c.id && (
                  <div style={{ marginTop:14, paddingTop:14, borderTop:"1px solid rgba(255,255,255,0.06)", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                    {["Analyse morphologique", "Détection d'anomalies", "Comparaison baseline"].map((item, j) => (
                      <div key={j} style={{ background:"rgba(168,85,247,0.06)", border:`1px solid ${ACCENT}20`, borderRadius:10, padding:"10px 12px" }}>
                        <div style={{ fontSize:11, color:MUTED, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.05em" }}>{item}</div>
                        <div style={{ fontSize:13, color:TEXT, fontWeight:600 }}>
                          {j===0 ? "47 régions analysées" : j===1 ? c.result : "Référence chargée ✓"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 1 — File d'attente */}
        {tab === 1 && (
          <div style={{ animation:"fadeUp 0.3s ease both" }}>
            <div style={{ background:CARD, border:BORDER, borderRadius:14, overflow:"hidden" }}>
              <div style={{ padding:"1rem 1.25rem", borderBottom:BORDER, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontWeight:700, fontSize:14, color:TEXT }}>File d'attente — {QUEUE.length} patients</span>
                <span style={{ fontSize:12, color:MUTED }}>Mis à jour il y a 2 min</span>
              </div>
              {QUEUE.map((q, i) => (
                <div key={q.id} style={{ padding:"1rem 1.25rem", borderBottom: i < QUEUE.length-1 ? BORDER : "none", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <span style={{ width:30, height:30, borderRadius:8, background:`${priorityColor(q.priority)}20`, color:priorityColor(q.priority), fontSize:11, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${priorityColor(q.priority)}30` }}>{q.priority}</span>
                    <div>
                      <div style={{ fontWeight:600, fontSize:14, color:TEXT }}>{q.patient}</div>
                      <div style={{ fontSize:12, color:MUTED, marginTop:1 }}>{q.id} · {q.type}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:20 }}>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:11, color:MUTED }}>Délai estimé</div>
                      <div style={{ fontSize:13, fontWeight:700, color: q.priority==="P1" ? "#ef4444" : TEXT }}>{q.delay}</div>
                    </div>
                    <span style={{ padding:"4px 12px", borderRadius:20, fontSize:11, fontWeight:700,
                      background: q.status==="En cours" ? `${ACCENT}20` : "rgba(100,116,139,0.12)",
                      color: q.status==="En cours" ? ACCENT : MUTED,
                      border: q.status==="En cours" ? `1px solid ${ACCENT}30` : "1px solid rgba(100,116,139,0.2)"
                    }}>{q.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2 — Résultats */}
        {tab === 2 && (
          <div style={{ animation:"fadeUp 0.3s ease both" }}>
            <div style={{ background:CARD, border:BORDER, borderRadius:14, padding:"1.5rem", marginBottom:12 }}>
              <h3 style={{ margin:"0 0 1.25rem", fontSize:15, fontWeight:700, color:TEXT }}>Anomalies détectées — Juin 2026</h3>
              <svg width="100%" height="260" viewBox="0 0 620 260">
                {ANOMALY_BARS.map((b, i) => {
                  const barH = (b.count / maxBar) * 190;
                  const x = 20 + i * 100;
                  return (
                    <g key={b.label}>
                      <rect x={x} y={230-barH} width={70} height={barH} rx={6} fill={b.color} fillOpacity={0.75} />
                      <rect x={x} y={230-barH} width={70} height={Math.min(barH, 8)} rx={6} fill={b.color} />
                      <text x={x+35} y={222-barH} textAnchor="middle" fill={b.color} fontSize={13} fontWeight="700">{b.count}</text>
                      <text x={x+35} y={248} textAnchor="middle" fill={MUTED} fontSize={11}>{b.label}</text>
                    </g>
                  );
                })}
                <line x1={10} y1={232} x2={610} y2={232} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
              </svg>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12 }}>
              {[
                { label:"Total scans analysés", value:"127", color:ACCENT },
                { label:"Taux de détection positif", value:"36%", color:"#f59e0b" },
                { label:"Scans normaux", value:"81", color:"#22c55e" },
                { label:"Alertes critiques", value:"4", color:"#ef4444" },
              ].map((m, i) => (
                <div key={i} style={{ background:CARD, border:BORDER, borderRadius:12, padding:"1.25rem 1.5rem" }}>
                  <div style={{ fontSize:28, fontWeight:700, color:m.color }}>{m.value}</div>
                  <div style={{ fontSize:13, color:MUTED, marginTop:4 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3 — Protocoles */}
        {tab === 3 && (
          <div style={{ animation:"fadeUp 0.3s ease both", display:"flex", flexDirection:"column", gap:12 }}>
            {PROTOCOLS.map((p, i) => (
              <div key={i} style={{ background:CARD, border:BORDER, borderRadius:14, padding:"1.25rem 1.5rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ width:36, height:36, borderRadius:10, background:`${ACCENT}15`, border:`1px solid ${ACCENT}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>📋</span>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15, color:TEXT }}>{p.pathology}</div>
                      <div style={{ fontSize:12, color:MUTED, marginTop:2 }}>{p.duration}</div>
                    </div>
                  </div>
                  <span style={{ padding:"4px 12px", background:`${ACCENT}15`, border:`1px solid ${ACCENT}30`, borderRadius:20, fontSize:11, color:ACCENT, fontWeight:700 }}>Protocole actif</span>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
                  {p.steps.map((step, j) => (
                    <div key={j} style={{ background:"rgba(168,85,247,0.05)", border:"1px solid rgba(168,85,247,0.12)", borderRadius:10, padding:"10px 12px", display:"flex", alignItems:"flex-start", gap:8 }}>
                      <span style={{ width:20, height:20, borderRadius:"50%", background:`${ACCENT}25`, fontSize:10, display:"flex", alignItems:"center", justifyContent:"center", color:ACCENT, fontWeight:700, flexShrink:0, marginTop:1 }}>{j+1}</span>
                      <span style={{ fontSize:12, color:TEXT, lineHeight:1.4 }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
