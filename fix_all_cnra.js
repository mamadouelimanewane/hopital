/**
 * fix_all_cnra.js — Supprime TOUTES les références CNRA/audiovisuel du projet hopital
 * et reconstruit les composants Navbar/Footer pour chaque app Next.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = 'c:/gravity/hopital';

// Liste des dossiers d'apps Next.js avec Navbar/Footer CNRA à corriger
const APPS_WITH_COMPONENTS = [
  { dir: 'ambu-track',       name: 'AmbuTrack',      icon: '🚑', color: '#f97316', subtitle: 'Suivi & Dispatch Ambulances — Hôpital Ndamatou' },
  { dir: 'blood-sync',       name: 'BloodSync',      icon: '🩸', color: '#ef4444', subtitle: 'Banque de Sang Connectée — Hôpital Ndamatou' },
  { dir: 'chncak-connect',   name: 'Ndamatou Connect',icon: '🏥', color: '#0ea5e9', subtitle: 'Portail Patient & Télémédecine — Hôpital Ndamatou' },
  { dir: 'chncak-med-learn', name: 'Med-Learn',      icon: '🎓', color: '#6366f1', subtitle: 'Formation Médicale Continue — Hôpital Ndamatou' },
  { dir: 'chncak-predict-ia',name: 'Predict-IA',     icon: '🧠', color: '#10b981', subtitle: 'IA Médicale Prédictive — Hôpital Ndamatou' },
  { dir: 'don-organes',      name: 'DonOrganes',     icon: '❤️', color: '#e11d48', subtitle: 'Registre Don d\'Organes — Hôpital Ndamatou' },
  { dir: 'eco-hopital',      name: 'Éco-Hôpital',   icon: '⚡', color: '#22c55e', subtitle: 'Gestion Énergétique & Durabilité — Hôpital Ndamatou' },
  { dir: 'magal-surge',      name: 'Magal-Surge',    icon: '🕌', color: '#a855f7', subtitle: 'Cellule de Crise Grand Magal — Hôpital Ndamatou' },
  { dir: 'neuroscan-ia',     name: 'NeuroScan-IA',   icon: '🧬', color: '#8b5cf6', subtitle: 'Radiologie & IA Neurologique — Hôpital Ndamatou' },
  { dir: 'nutri-care',       name: 'NutriCare',      icon: '🍽️', color: '#f59e0b', subtitle: 'Suivi Nutritionnel Médical — Hôpital Ndamatou' },
  { dir: 'psych-care',       name: 'PsychCare',      icon: '🧘', color: '#06b6d4', subtitle: 'Psychiatrie & Santé Mentale — Hôpital Ndamatou' },
  { dir: 'rehab-track',      name: 'RehabTrack',     icon: '🦴', color: '#16a34a', subtitle: 'Rééducation & Kinésithérapie — Hôpital Ndamatou' },
];

function buildNavbar(app) {
  return `"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, Hospital } from "lucide-react"

const nav = [
  { label: "Tableau de bord", href: "/" },
  { label: "Gestion",         href: "/gestion" },
  { label: "Patients",        href: "/patients" },
  { label: "Statistiques",    href: "/stats" },
  { label: "Rapports",        href: "/rapports" },
  { label: "Paramètres",      href: "/parametres" },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header style={{ background: "${app.color}", boxShadow: "0 2px 12px rgba(0,0,0,0.15)", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ background: "#0a1628", padding: "4px 16px", textAlign: "center" }}>
        <p style={{ fontSize: 11, color: "#0ea5e9", margin: 0, letterSpacing: "0.08em" }}>
          🇸🇳 République du Sénégal · Hôpital Ndamatou de Touba · Ministère de la Santé
        </p>
      </div>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>${app.icon}</div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 800, color: "#fff", margin: 0 }}>${app.name}</p>
            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>Hôpital Ndamatou · Touba</p>
          </div>
        </Link>
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }} className="hidden lg:flex">
          {nav.map(item => (
            <Link key={item.href} href={item.href}
              style={{
                padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none",
                background: pathname === item.href ? "rgba(255,255,255,0.2)" : "transparent",
                color: pathname === item.href ? "#fff" : "rgba(255,255,255,0.75)",
                transition: "all 0.2s",
              }}
            >{item.label}</Link>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", opacity: 0.9, animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 700, letterSpacing: "0.1em" }}>EN LIGNE</span>
        </div>
      </div>
    </header>
  )
}

export default Navbar
`;
}

function buildFooter(app) {
  return `export function Footer() {
  return (
    <footer style={{ background: "#0a1628", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "2rem 1.5rem", marginTop: "auto" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>${app.icon}</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>${app.name}</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0 }}>${app.subtitle}</p>
          </div>
        </div>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", margin: 0 }}>
          © {new Date().getFullYear()} Hôpital Ndamatou — Touba, Sénégal · Tous droits réservés
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "${app.color}" }} />
          <span style={{ fontSize: 11, color: "${app.color}", fontWeight: 700 }}>SYSTÈME ACTIF</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
`;
}

let fixed = 0;
let errors = [];

for (const app of APPS_WITH_COMPONENTS) {
  const appDir = path.join(ROOT, app.dir);
  const navPath = path.join(appDir, 'components', 'Navbar.tsx');
  const footPath = path.join(appDir, 'components', 'Footer.tsx');
  
  if (fs.existsSync(path.dirname(navPath))) {
    try {
      fs.writeFileSync(navPath, buildNavbar(app), 'utf8');
      fs.writeFileSync(footPath, buildFooter(app), 'utf8');
      console.log(`✅ ${app.dir} — Navbar & Footer corrigés`);
      fixed++;
    } catch(e) {
      errors.push(`${app.dir}: ${e.message}`);
    }
  } else {
    console.log(`⚠️  ${app.dir} — dossier components introuvable`);
  }
}

// Corriger smart-pharma page.tsx (contenu CNRA)
const smartPharmaPage = path.join(ROOT, 'smart-pharma', 'app', 'page.tsx');
const smartPharmaLayout = path.join(ROOT, 'smart-pharma', 'app', 'layout.tsx');
const smartPharmaContent = `"use client"
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
      <style>{\`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        .fade{animation:fadeUp .5s both}
        .pulse{animation:pulse 2s infinite}
        .row:hover{background:rgba(255,255,255,0.04) !important}
        input:focus{outline:2px solid #14b8a6;border-color:transparent}
      \`}</style>
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
              <div key={s.label} className="fade" style={{ animationDelay:\`\${i*0.1}s\`, background:"rgba(255,255,255,0.03)", border:\`1px solid \${s.color}30\`, borderRadius:16, padding:"1.5rem" }}>
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
                          <span style={{ background:\`\${statutColor}18\`, color:statutColor, padding:"4px 12px", borderRadius:100, fontSize:11, fontWeight:700 }}>{m.statut}</span>
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
              <button key={a.label} style={{ background:\`\${a.color}15\`, border:\`1px solid \${a.color}30\`, borderRadius:12, padding:"14px", cursor:"pointer", color:a.color, fontWeight:700, fontSize:13, display:"flex", alignItems:"center", gap:8, transition:"all 0.2s" }}>
                <span style={{ fontSize:20 }}>{a.icon}</span>{a.label}
              </button>
            ))}
          </div>
        </main>
      </div>
    </>
  )
}
`;
fs.writeFileSync(smartPharmaPage, smartPharmaContent, 'utf8');
console.log(`✅ smart-pharma/app/page.tsx — Reconstruit (pharmacie hospitalière)`);

// Corriger le layout de smart-pharma
const smartPharmaLayoutContent = `import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "SmartPharma — Pharmacie Centrale Hôpital Ndamatou",
  description: "Gestion des stocks médicamenteux, ordonnances et fournisseurs pour l'Hôpital Ndamatou de Touba.",
  keywords: ["pharmacie", "Ndamatou", "Touba", "médicaments", "stocks"],
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: "#0a1628", fontFamily: "system-ui, sans-serif" }}>{children}</body>
    </html>
  )
}
`;
fs.writeFileSync(smartPharmaLayout, smartPharmaLayoutContent, 'utf8');
console.log(`✅ smart-pharma/app/layout.tsx — Corrigé`);

// Corriger touba-med-care
const toubaMedCarePage = path.join(ROOT, 'touba-med-care', 'app', 'page.tsx');
const toubaMedCareLayout = path.join(ROOT, 'touba-med-care', 'app', 'layout.tsx');
const toubaMedCareLayoutContent = `import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Touba MedCare — Médecine du Grand Magal",
  description: "Système de gestion médicale pour le Grand Magal de Touba — Hôpital Ndamatou.",
  keywords: ["Magal", "Touba", "Ndamatou", "santé", "pèlerinage"],
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: "#0a1628", fontFamily: "system-ui, sans-serif" }}>{children}</body>
    </html>
  )
}
`;
if (fs.existsSync(toubaMedCareLayout)) {
  fs.writeFileSync(toubaMedCareLayout, toubaMedCareLayoutContent, 'utf8');
  console.log(`✅ touba-med-care/app/layout.tsx — Corrigé`);
}

console.log(`\n🎉 Correction CNRA terminée : ${fixed} apps Navbar/Footer corrigées + smart-pharma & touba-med-care reconstruits`);
if (errors.length > 0) console.log("⚠️  Erreurs :", errors);
