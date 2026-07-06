import Link from "next/link"
import { notFound } from "next/navigation"
import { manuelApps, categories } from "../../manuelData"

const card = "#0a1628"
const border = "rgba(255,255,255,0.06)"

export function generateStaticParams() {
  return manuelApps.map(a => ({ id: a.id }))
}

export default async function ManuelAppPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const index = manuelApps.findIndex(a => a.id === id)
  if (index === -1) notFound()

  const app = manuelApps[index]
  const precedent = manuelApps[(index - 1 + manuelApps.length) % manuelApps.length]
  const suivant = manuelApps[(index + 1) % manuelApps.length]
  const coul = categories[app.categorie].couleur

  return (
    <div style={{ background:"#050d1a", minHeight:"100vh", color:"#e2e8f0", fontFamily:"'Inter',system-ui,sans-serif" }}>
      {/* BACK NAV */}
      <div style={{ position:"sticky", top:0, zIndex:200, background:"rgba(5,13,26,0.96)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(14,165,233,0.12)", padding:"0 1.5rem", height:52, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
        <Link href="/ndamatou-academy" style={{ display:"inline-flex", alignItems:"center", gap:8, color:"rgba(255,255,255,0.5)", textDecoration:"none", fontSize:13, fontWeight:600 }}>← Sommaire du Manuel</Link>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>Ndamatou Academy — Manuel de Formation</span>
      </div>

      <div style={{ maxWidth:840, margin:"0 auto", padding:"2rem 1.5rem 4rem" }}>

        {/* EN-TÊTE DOCUMENT */}
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:"1.75rem" }}>
          <div style={{ width:64, height:64, borderRadius:16, background:`${coul}20`, border:`2px solid ${coul}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, flexShrink:0 }}>
            {app.icone}
          </div>
          <div>
            <span style={{ background:`${coul}18`, color:coul, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:12 }}>{categories[app.categorie].label}</span>
            <h1 style={{ fontSize:"clamp(22px,3vw,32px)", fontWeight:900, margin:"6px 0 0", color:"#fff" }}>{app.nom}</h1>
            <p style={{ fontSize:12, color:"rgba(255,255,255,0.35)", margin:"2px 0 0" }}>Manuel de formation — Module {app.route}</p>
          </div>
        </div>

        {/* OBJECTIF */}
        <section style={{ background:card, border:`1px solid ${border}`, borderRadius:16, padding:"1.5rem", marginBottom:"1.25rem" }}>
          <h2 style={{ fontSize:13, fontWeight:800, color:coul, textTransform:"uppercase", letterSpacing:"0.06em", margin:"0 0 10px" }}>Objectif</h2>
          <p style={{ fontSize:15, lineHeight:1.7, color:"rgba(255,255,255,0.85)", margin:0 }}>{app.objectif}</p>
        </section>

        {/* PUBLIC CONCERNÉ */}
        <section style={{ background:card, border:`1px solid ${border}`, borderRadius:16, padding:"1.5rem", marginBottom:"1.25rem" }}>
          <h2 style={{ fontSize:13, fontWeight:800, color:coul, textTransform:"uppercase", letterSpacing:"0.06em", margin:"0 0 12px" }}>Public concerné</h2>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {app.roles.map(r => (
              <span key={r} style={{ background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.75)", fontSize:13, padding:"5px 14px", borderRadius:20, border:`1px solid ${border}` }}>{r}</span>
            ))}
          </div>
        </section>

        {/* FONCTIONNALITÉS CLÉS */}
        <section style={{ background:card, border:`1px solid ${border}`, borderRadius:16, padding:"1.5rem", marginBottom:"1.25rem" }}>
          <h2 style={{ fontSize:13, fontWeight:800, color:coul, textTransform:"uppercase", letterSpacing:"0.06em", margin:"0 0 12px" }}>Fonctionnalités clés</h2>
          <ul style={{ margin:0, paddingLeft:0, listStyle:"none", display:"flex", flexDirection:"column", gap:10 }}>
            {app.fonctionnalites.map((f, i) => (
              <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, fontSize:14, color:"rgba(255,255,255,0.75)", lineHeight:1.6 }}>
                <span style={{ color:coul, flexShrink:0 }}>✓</span>{f}
              </li>
            ))}
          </ul>
        </section>

        {/* GUIDE PAS À PAS */}
        <section style={{ background:card, border:`1px solid ${border}`, borderRadius:16, padding:"1.5rem", marginBottom:"1.25rem" }}>
          <h2 style={{ fontSize:13, fontWeight:800, color:coul, textTransform:"uppercase", letterSpacing:"0.06em", margin:"0 0 16px" }}>Guide d&apos;utilisation pas à pas</h2>
          <ol style={{ margin:0, padding:0, listStyle:"none", display:"flex", flexDirection:"column", gap:16 }}>
            {app.guide.map((g, i) => (
              <li key={i} style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                <span style={{
                  width:26, height:26, borderRadius:"50%", background:`${coul}20`, border:`1px solid ${coul}50`, color:coul,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, flexShrink:0
                }}>{i + 1}</span>
                <p style={{ margin:"3px 0 0", fontSize:14, lineHeight:1.7, color:"rgba(255,255,255,0.8)" }}>{g}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* BONNES PRATIQUES */}
        <section style={{ background:`${coul}0f`, border:`1px solid ${coul}30`, borderRadius:16, padding:"1.5rem", marginBottom:"2rem" }}>
          <h2 style={{ fontSize:13, fontWeight:800, color:coul, textTransform:"uppercase", letterSpacing:"0.06em", margin:"0 0 10px" }}>💡 Bonnes pratiques</h2>
          <ul style={{ margin:0, paddingLeft:18, display:"flex", flexDirection:"column", gap:8 }}>
            {app.conseils.map((c, i) => (
              <li key={i} style={{ fontSize:14, color:"rgba(255,255,255,0.7)", lineHeight:1.6 }}>{c}</li>
            ))}
          </ul>
        </section>

        {/* OUVRIR L'APPLICATION */}
        <a href={app.route} style={{
          display:"inline-flex", alignItems:"center", gap:8, background:`${coul}25`, color:coul, border:`1px solid ${coul}60`,
          borderRadius:10, padding:"12px 22px", fontSize:14, fontWeight:700, textDecoration:"none", marginBottom:"2.5rem"
        }}>
          Ouvrir {app.nom} →
        </a>

        {/* NAVIGATION PRÉCÉDENT / SUIVANT */}
        <div style={{ display:"flex", justifyContent:"space-between", gap:12, borderTop:`1px solid ${border}`, paddingTop:"1.5rem", flexWrap:"wrap" }}>
          <Link href={`/ndamatou-academy/manuel/${precedent.id}`} style={{ color:"rgba(255,255,255,0.5)", textDecoration:"none", fontSize:13 }}>
            ← {precedent.icone} {precedent.nom}
          </Link>
          <Link href={`/ndamatou-academy/manuel/${suivant.id}`} style={{ color:"rgba(255,255,255,0.5)", textDecoration:"none", fontSize:13, textAlign:"right" }}>
            {suivant.icone} {suivant.nom} →
          </Link>
        </div>
      </div>
    </div>
  )
}
