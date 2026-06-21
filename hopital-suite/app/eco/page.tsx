"use client";
import { useState, useEffect } from "react";

const ACCENT = "#22c55e";
const BG = "#050d1a";
const CARD = "#0a1628";
const BORDER = "1px solid rgba(255,255,255,0.06)";
const TEXT = "#e2e8f0";
const MUTED = "#64748b";

const ENERGIE_SEMAINE = [312, 298, 341, 287, 329, 318, 247];
const ENERGIE_MOIS = [8820, 9140, 8650, 9320, 8910, 9480, 8730, 9100, 8820, 9250, 8660, 9310, 8940, 9080, 8750, 9420, 9010, 8830, 9260, 8710, 9390, 8940, 9130, 8780, 9470, 9020, 8650, 9310, 8880, 1247];
const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const CERTIFICATIONS = [
  { name: "ISO 14001", desc: "Système de management environnemental", status: "En cours", progress: 67, icon: "🌍" },
  { name: "HEQ® Niveau 1", desc: "Haute Exigence Qualité Environnementale", status: "Obtenu", progress: 100, icon: "🏆" },
  { name: "Zéro Carbone 2030", desc: "Neutralité carbone objectif horizon 2030", status: "Planifié", progress: 23, icon: "🌿" },
  { name: "Label BioNettoyage", desc: "Produits d'entretien biodégradables", status: "Obtenu", progress: 100, icon: "✅" },
];

const OBJECTIFS = [
  { label: "Réduction consommation énergie", actuel: 73, cible: 85, unite: "%" },
  { label: "Couverture solaire", actuel: 34, cible: 60, unite: "%" },
  { label: "Tri sélectif des déchets", actuel: 82, cible: 95, unite: "%" },
  { label: "Récupération eau de pluie", actuel: 18, cible: 40, unite: "%" },
];

export default function EcoPage() {
  const [vue, setVue] = useState<"semaine" | "mois">("semaine");
  const [animIn, setAnimIn] = useState(false);
  const [score] = useState(73);

  useEffect(() => { setAnimIn(true); }, []);

  const data = vue === "semaine" ? ENERGIE_SEMAINE : ENERGIE_MOIS.slice(-14);
  const labels = vue === "semaine" ? JOURS : Array.from({ length: data.length }, (_, i) => `J${i+1}`);
  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);

  const polylinePoints = data.map((v, i) => {
    const x = 30 + (i / (data.length - 1)) * 560;
    const y = 170 - ((v - minVal) / (maxVal - minVal)) * 140;
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = `30,175 ${polylinePoints} ${30 + 560},175`;

  const statusColor = (s: string) => s === "Obtenu" ? ACCENT : s === "En cours" ? "#f59e0b" : MUTED;

  return (
    <div style={{ minHeight:"100vh", background:BG, color:TEXT, fontFamily:"'Inter', system-ui, sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes grow { from{width:0} to{width:100%} }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#050d1a} ::-webkit-scrollbar-thumb{background:#22c55e30;border-radius:4px}
      `}</style>

      {/* Nav */}
      <div style={{ position:"sticky", top:0, zIndex:200, background:"rgba(5,13,26,0.96)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(14,165,233,0.12)", padding:"0 1.5rem", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <a href="/" style={{ display:"inline-flex", alignItems:"center", gap:8, color:"rgba(255,255,255,0.5)", textDecoration:"none", fontSize:13, fontWeight:600 }}>← Portail CHNCAK</a>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>CHNCAK Suite</span>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"2rem 1.5rem" }}>

        {/* Header */}
        <div style={{ animation: animIn ? "fadeUp 0.5s ease both" : "none", marginBottom:"2rem" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16, marginBottom:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:48, height:48, borderRadius:14, background:`${ACCENT}15`, border:`1px solid ${ACCENT}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>🌿</div>
              <div>
                <h1 style={{ margin:0, fontSize:26, fontWeight:700, color:TEXT }}>Éco-Hôpital CHNCAK</h1>
                <p style={{ margin:0, fontSize:13, color:MUTED }}>Gestion Environnementale & Développement Durable</p>
              </div>
            </div>
            <div style={{ background:`${ACCENT}10`, border:`1px solid ${ACCENT}30`, borderRadius:14, padding:"12px 20px", textAlign:"center" }}>
              <div style={{ fontSize:36, fontWeight:700, color:ACCENT }}>{score}/100</div>
              <div style={{ fontSize:12, color:MUTED }}>Score Global</div>
              <div style={{ fontSize:13, fontWeight:700, color:ACCENT, marginTop:2 }}>Niveau B+</div>
            </div>
          </div>

          {/* 3 sections grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>

            {/* Énergie */}
            <div style={{ background:CARD, border:BORDER, borderRadius:14, padding:"1.25rem", animation:"fadeUp 0.4s ease both" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <span style={{ fontSize:18 }}>⚡</span>
                <span style={{ fontWeight:700, fontSize:14, color:TEXT }}>Énergie</span>
                <span style={{ marginLeft:"auto", padding:"2px 8px", background:`${ACCENT}15`, border:`1px solid ${ACCENT}25`, borderRadius:10, fontSize:10, color:ACCENT, fontWeight:700 }}>ACTIF</span>
              </div>
              <div style={{ fontSize:28, fontWeight:700, color:"#fbbf24", marginBottom:2 }}>1,247 <span style={{ fontSize:14, fontWeight:400, color:MUTED }}>kWh/jour</span></div>
              <div style={{ fontSize:12, color:MUTED, marginBottom:14 }}>Consommation moyenne journalière</div>

              <div style={{ marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:MUTED, marginBottom:4 }}>
                  <span>Panneaux solaires</span><span style={{ color:ACCENT, fontWeight:600 }}>34%</span>
                </div>
                <div style={{ height:5, background:"rgba(255,255,255,0.06)", borderRadius:3 }}>
                  <div style={{ height:5, width:"34%", background:ACCENT, borderRadius:3 }}></div>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {[
                  { label:"Économies ce mois", val:"€ 3,240", color:ACCENT },
                  { label:"Objectif couverture", val:"60% à 2030", color:MUTED },
                  { label:"CO₂ évité", val:"4.2 tonnes", color:ACCENT },
                ].map((m, i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:12 }}>
                    <span style={{ color:MUTED }}>{m.label}</span>
                    <span style={{ color:m.color, fontWeight:600 }}>{m.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Eau */}
            <div style={{ background:CARD, border:BORDER, borderRadius:14, padding:"1.25rem", animation:"fadeUp 0.5s ease both" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <span style={{ fontSize:18 }}>💧</span>
                <span style={{ fontWeight:700, fontSize:14, color:TEXT }}>Eau</span>
                <span style={{ marginLeft:"auto", padding:"2px 8px", background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.25)", borderRadius:10, fontSize:10, color:"#60a5fa", fontWeight:700 }}>SUIVI</span>
              </div>
              <div style={{ fontSize:28, fontWeight:700, color:"#60a5fa", marginBottom:2 }}>48 <span style={{ fontSize:14, fontWeight:400, color:MUTED }}>m³/jour</span></div>
              <div style={{ fontSize:12, color:MUTED, marginBottom:14 }}>Consommation moyenne journalière</div>

              <div style={{ marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:MUTED, marginBottom:4 }}>
                  <span>Récupération pluie</span><span style={{ color:"#60a5fa", fontWeight:600 }}>18%</span>
                </div>
                <div style={{ height:5, background:"rgba(255,255,255,0.06)", borderRadius:3 }}>
                  <div style={{ height:5, width:"18%", background:"#60a5fa", borderRadius:3 }}></div>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {[
                  { label:"Fuites détectées", val:"2 actives", color:"#f59e0b" },
                  { label:"Économies eau", val:"8.6 m³/jour", color:"#60a5fa" },
                  { label:"Objectif récupération", val:"40% à 2028", color:MUTED },
                ].map((m, i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:12 }}>
                    <span style={{ color:MUTED }}>{m.label}</span>
                    <span style={{ color:m.color, fontWeight:600 }}>{m.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Déchets */}
            <div style={{ background:CARD, border:BORDER, borderRadius:14, padding:"1.25rem", animation:"fadeUp 0.6s ease both" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <span style={{ fontSize:18 }}>♻️</span>
                <span style={{ fontWeight:700, fontSize:14, color:TEXT }}>Déchets</span>
                <span style={{ marginLeft:"auto", padding:"2px 8px", background:`${ACCENT}15`, border:`1px solid ${ACCENT}25`, borderRadius:10, fontSize:10, color:ACCENT, fontWeight:700 }}>82%</span>
              </div>
              <div style={{ fontSize:28, fontWeight:700, color:"#a78bfa", marginBottom:2 }}>127 <span style={{ fontSize:14, fontWeight:400, color:MUTED }}>kg/jour</span></div>
              <div style={{ fontSize:12, color:MUTED, marginBottom:14 }}>Déchets médicaux traités</div>

              <div style={{ marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:MUTED, marginBottom:4 }}>
                  <span>Tri sélectif</span><span style={{ color:ACCENT, fontWeight:600 }}>82%</span>
                </div>
                <div style={{ height:5, background:"rgba(255,255,255,0.06)", borderRadius:3 }}>
                  <div style={{ height:5, width:"82%", background:ACCENT, borderRadius:3 }}></div>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {[
                  { label:"Incinérateur", val:"Opérationnel ✓", color:ACCENT },
                  { label:"Recyclage plastique", val:"41 kg/jour", color:"#a78bfa" },
                  { label:"Déchets dangereux", val:"Traçabilité 100%", color:ACCENT },
                ].map((m, i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:12 }}>
                    <span style={{ color:MUTED }}>{m.label}</span>
                    <span style={{ color:m.color, fontWeight:600 }}>{m.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Graphique consommation */}
        <div style={{ background:CARD, border:BORDER, borderRadius:16, padding:"1.5rem", marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <h2 style={{ margin:0, fontSize:15, fontWeight:700, color:TEXT }}>📈 Consommation Énergétique</h2>
            <div style={{ display:"flex", gap:4, background:"rgba(255,255,255,0.04)", border:BORDER, borderRadius:8, padding:3 }}>
              {(["semaine", "mois"] as const).map((v) => (
                <button key={v} onClick={() => setVue(v)} style={{
                  padding:"5px 14px", borderRadius:6, border:"none", cursor:"pointer", fontSize:12, fontWeight:600, transition:"all 0.2s",
                  background: vue===v ? `${ACCENT}20` : "transparent",
                  color: vue===v ? ACCENT : MUTED,
                }}>{v === "semaine" ? "Semaine" : "Mois"}</button>
              ))}
            </div>
          </div>
          <svg width="100%" height="200" viewBox="0 0 620 200">
            {/* Grille */}
            {[0, 50, 100, 150].map((y) => (
              <line key={y} x1={20} y1={y+10} x2={610} y2={y+10} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
            ))}
            {/* Zone remplie */}
            <polygon points={areaPoints} fill={`${ACCENT}08`} />
            {/* Courbe */}
            <polyline points={polylinePoints} fill="none" stroke={ACCENT} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
            {/* Points */}
            {data.map((v, i) => {
              const x = 30 + (i / (data.length - 1)) * 560;
              const y = 170 - ((v - minVal) / (maxVal - minVal)) * 140;
              return <circle key={i} cx={x} cy={y} r={4} fill={ACCENT} fillOpacity={0.8} />;
            })}
            {/* Labels */}
            {vue === "semaine" && labels.map((l, i) => {
              const x = 30 + (i / (data.length - 1)) * 560;
              return <text key={i} x={x} y={195} textAnchor="middle" fill={MUTED} fontSize={10}>{l}</text>;
            })}
          </svg>
          <div style={{ display:"flex", gap:20, marginTop:8 }}>
            <span style={{ fontSize:12, color:MUTED }}>Min: <span style={{ color:ACCENT, fontWeight:600 }}>{minVal} kWh</span></span>
            <span style={{ fontSize:12, color:MUTED }}>Max: <span style={{ color:"#fbbf24", fontWeight:600 }}>{maxVal} kWh</span></span>
            <span style={{ fontSize:12, color:MUTED }}>Moy: <span style={{ color:TEXT, fontWeight:600 }}>{Math.round(data.reduce((a,b)=>a+b)/data.length)} kWh</span></span>
          </div>
        </div>

        {/* Certifications & Objectifs */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <div style={{ background:CARD, border:BORDER, borderRadius:16, padding:"1.5rem" }}>
            <h2 style={{ margin:"0 0 1rem", fontSize:15, fontWeight:700, color:TEXT }}>🏅 Certifications Environnementales</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {CERTIFICATIONS.map((c, i) => (
                <div key={i} style={{ background:"rgba(34,197,94,0.04)", border:`1px solid rgba(34,197,94,0.1)`, borderRadius:12, padding:"12px 14px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:16 }}>{c.icon}</span>
                      <span style={{ fontWeight:700, fontSize:13, color:TEXT }}>{c.name}</span>
                    </div>
                    <span style={{ padding:"2px 8px", borderRadius:10, fontSize:10, fontWeight:700, background:`${statusColor(c.status)}20`, color:statusColor(c.status) }}>{c.status}</span>
                  </div>
                  <div style={{ fontSize:11, color:MUTED, marginBottom:6 }}>{c.desc}</div>
                  <div style={{ height:4, background:"rgba(255,255,255,0.06)", borderRadius:2 }}>
                    <div style={{ height:4, width:`${c.progress}%`, background:statusColor(c.status), borderRadius:2 }}></div>
                  </div>
                  <div style={{ fontSize:10, color:MUTED, marginTop:3 }}>{c.progress}%</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background:CARD, border:BORDER, borderRadius:16, padding:"1.5rem" }}>
            <h2 style={{ margin:"0 0 1rem", fontSize:15, fontWeight:700, color:TEXT }}>🎯 Objectifs 2030</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {OBJECTIFS.map((o, i) => (
                <div key={i}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:6 }}>
                    <span style={{ color:TEXT }}>{o.label}</span>
                    <span style={{ color:MUTED, fontSize:12 }}>{o.actuel}{o.unite} / <span style={{ color:ACCENT }}>{o.cible}{o.unite}</span></span>
                  </div>
                  <div style={{ height:8, background:"rgba(255,255,255,0.06)", borderRadius:4, overflow:"hidden" }}>
                    <div style={{ height:8, width:`${(o.actuel/o.cible)*100}%`, background:`linear-gradient(90deg, ${ACCENT}80, ${ACCENT})`, borderRadius:4, transition:"width 1s" }}></div>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:MUTED, marginTop:3 }}>
                    <span>Actuel: {o.actuel}{o.unite}</span>
                    <span>{Math.round((o.actuel/o.cible)*100)}% de l'objectif</span>
                  </div>
                </div>
              ))}

              <div style={{ marginTop:4, background:`${ACCENT}08`, border:`1px solid ${ACCENT}20`, borderRadius:12, padding:"12px 14px" }}>
                <div style={{ fontSize:12, color:MUTED, marginBottom:4 }}>Score environnemental global</div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ fontSize:32, fontWeight:700, color:ACCENT }}>73</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:TEXT }}>Niveau B+</div>
                    <div style={{ fontSize:11, color:MUTED }}>Objectif: 90/100 en 2030</div>
                  </div>
                </div>
                <div style={{ height:6, background:"rgba(255,255,255,0.06)", borderRadius:3, marginTop:8 }}>
                  <div style={{ height:6, width:"73%", background:`linear-gradient(90deg, ${ACCENT}60, ${ACCENT})`, borderRadius:3 }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
