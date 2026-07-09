"use client"
import Link from "next/link"
import { useState, useEffect } from "react"

const SECTIONS = [
  {
    id: "clinique",
    label: "Soins & Gestion Clinique",
    desc: "Les fondamentaux du quotidien hospitalier",
    icon: "🏥",
    apps: [
      { id: "connect",       name: "Ndamatou Connect",   href: "/connect",       icon: "🏥", desc: "Portail Patient & Télémédecine",         hexColor: "#2563eb" },
      { id: "pharma",        name: "SmartPharma",       href: "/pharma",        icon: "💊", desc: "Pharmacie, Stocks & Ordonnances",         hexColor: "#14b8a6" },
      { id: "blood",         name: "BloodSync",         href: "/blood",         icon: "🩸", desc: "Banque de Sang Connectée",               hexColor: "#ef4444" },
      { id: "ambu",          name: "AmbuTrack",         href: "/ambu",          icon: "🚑", desc: "Suivi & Dispatch des Ambulances",         hexColor: "#f97316" },
      { id: "lab-connect",   name: "Lab Connect",       href: "/lab-connect",   icon: "🧪", desc: "Laboratoire Connecté Temps Réel",         hexColor: "#0369a1" },
      { id: "smart-beds",    name: "Smart Beds",        href: "/smart-beds",    icon: "🛏️", desc: "Gestion Intelligente des Lits",           hexColor: "#2563eb" },
      { id: "factu-care",    name: "FactuCare",         href: "/factu-care",    icon: "💳", desc: "Facturation & Assurance Maladie",         hexColor: "#15803d" },
      { id: "rh-medical",    name: "RH Médical",        href: "/rh-medical",    icon: "👥", desc: "Ressources Humaines Médicales",           hexColor: "#4338ca" },
      { id: "hemo",          name: "Hemo-Care",         href: "/hemo",          icon: "🩸", desc: "Centre d'Hémodialyse",                  hexColor: "#0ea5e9" },
      { id: "mater",         name: "Mater-Neo",         href: "/mater",         icon: "👶", desc: "Maternité & Néonatologie",              hexColor: "#ec4899" },
    ],
  },
  {
    id: "admin",
    label: "Administration, Qualité & Réseau",
    desc: "Pilotage, conformité et coordination inter-établissements",
    icon: "📋",
    apps: [
      { id: "qualite-accred", name: "Qualité-JCI",      href: "/qualite-accred", icon: "🏆", desc: "Qualité & Accréditation JCI",           hexColor: "#1d4ed8" },
      { id: "sante-reseau",  name: "Réseau Santé SN",   href: "/sante-reseau",  icon: "🌐", desc: "Réseau Multi-Hôpitaux Sénégal",          hexColor: "#0891b2" },
      { id: "nutri",         name: "NutriCare",         href: "/nutri",         icon: "🍽️", desc: "Suivi Nutritionnel Médical",              hexColor: "#d97706" },
      { id: "rehab",         name: "RehabTrack",        href: "/rehab",         icon: "🦴", desc: "Rééducation & Kinésithérapie",            hexColor: "#16a34a" },
      { id: "psych",         name: "PsychCare",         href: "/psych",         icon: "🧘", desc: "Psychiatrie & Santé Mentale",             hexColor: "#0891b2" },
      { id: "organes",       name: "DonOrganes",        href: "/organes",       icon: "❤️", desc: "Registre National Don d'Organes",         hexColor: "#e11d48" },
      { id: "epidemio-watch",name: "Épidémio-Watch",    href: "/epidemio-watch",icon: "🦠", desc: "Surveillance Épidémique Sénégal",         hexColor: "#991b1b" },
      { id: "don-financement",name: "Don & Diaspora",   href: "/don-financement",icon:"🌍", desc: "Financement & Dons Diaspora",             hexColor: "#b45309" },
      { id: "gmao",          name: "GMAO-Track",        href: "https://ndamatou-gmao.vercel.app/dashboard", icon: "🔧", desc: "Maintenance des Équipements — Application complète", hexColor: "#64748b" },
      { id: "supply",        name: "Supply-Chain",      href: "/supply",        icon: "📦", desc: "Logistique & Fournisseurs",             hexColor: "#eab308" },
      { id: "dmp",           name: "DMP-Gateway",       href: "/dmp",           icon: "🌍", desc: "Interopérabilité HL7/FHIR",             hexColor: "#10b981" },
    ],
  },
  {
    id: "event",
    label: "Événementiel, Mobilité & Durabilité",
    desc: "Gestion de crise, grands rassemblements et développement durable",
    icon: "🌟",
    apps: [
      { id: "touba",         name: "Touba MedCare",     href: "/touba",         icon: "🕌", desc: "Médecine Grand Magal de Touba",           hexColor: "#eab308" },
      { id: "magal",         name: "Magal Surge",       href: "/magal",         icon: "🚨", desc: "Cellule de Crise & Montée en Charge",     hexColor: "#f97316" },
      { id: "eco",           name: "Éco-Hôpital",       href: "/eco",           icon: "⚡", desc: "Gestion Énergétique & Durabilité",         hexColor: "#22c55e" },
      { id: "patient-mobile",name: "Patient Mobile",    href: "/patient-mobile",icon: "📱", desc: "Application Mobile Patient PWA",           hexColor: "#0284c7" },
      { id: "waste",         name: "Waste-Control",     href: "/waste",         icon: "🗑️", desc: "Gestion des Déchets Médicaux",          hexColor: "#84cc16" },
      { id: "indoor",        name: "Indoor-Guide",      href: "/indoor",        icon: "🗺️", desc: "Guidage 3D & Visiteurs",                hexColor: "#3b82f6" },
      { id: "morgue",        name: "Morgue-Sync",       href: "/morgue",        icon: "🕊️", desc: "Gestion Funéraire",                     hexColor: "#94a3b8" },
    ],
  },
  {
    id: "extensions",
    label: "Extensions Avancées",
    desc: "Nouvelles propositions pour approfondir la couverture de l'écosystème",
    icon: "🧩",
    apps: [
      { id: "bloc-operatoire", name: "Bloc Opératoire",  href: "/bloc-operatoire", icon: "🔪", desc: "Planning & Sécurité du Bloc Chirurgical",  hexColor: "#dc2626" },
      { id: "urgences",       name: "Urgences SAU",      href: "/urgences",       icon: "🚨", desc: "Pilotage Temps Réel du Service d'Urgences", hexColor: "#f97316" },
      { id: "imagerie",       name: "Imagerie PACS/RIS", href: "/imagerie",       icon: "🩻", desc: "Workflow Radiologie & Archivage d'Images",  hexColor: "#0891b2" },
      { id: "ias-watch",      name: "IAS-Watch",         href: "/ias-watch",      icon: "🦠", desc: "Surveillance des Infections Nosocomiales", hexColor: "#65a30d" },
      { id: "proches-aidants",name: "Proches-Aidants",   href: "/proches-aidants",icon: "👨‍👩‍👧", desc: "Suivi à Distance pour les Familles",       hexColor: "#ec4899" },
      { id: "consentement",   name: "Consentement Éclairé",href: "/consentement", icon: "✍️", desc: "Consentement Électronique avant Acte",     hexColor: "#8b5cf6" },
      { id: "bien-etre-soignant",name: "Bien-Être Soignant",href: "/bien-etre-soignant",icon: "🧘", desc: "Prévention du Burn-Out & Climat Social", hexColor: "#0d9488" },
      { id: "sterilisation",  name: "Stérilisation",     href: "/sterilisation",  icon: "🧼", desc: "Traçabilité du Matériel Stérilisé",         hexColor: "#06b6d4" },
      { id: "cyber-soc",      name: "Cyber-SOC",         href: "/cyber-soc",      icon: "🛡️", desc: "Centre de Sécurité Opérationnelle Cyber",  hexColor: "#e11d48" },
      { id: "maintenance-batiment",name: "Maintenance Bâtiment",href: "/maintenance-batiment",icon: "🏗️", desc: "Maintenance Générale des Infrastructures", hexColor: "#78716c" },
      { id: "reunions",       name: "Réunions & Communication",href: "/reunions",  icon: "🗓️", desc: "Planification, Comptes-Rendus & Communication", hexColor: "#a855f7" },
    ],
  },
  {
    id: "ia",
    label: "Intelligence Artificielle & Formation",
    desc: "Innovations IA pour le diagnostic, la prédiction et l'apprentissage médical",
    icon: "🤖",
    apps: [
      { id: "chatbot-triage",name: "Triage IA",         href: "/chatbot-triage",icon: "💬", desc: "ChatBot Triage Wolof + Français",          hexColor: "#065f46" },
      { id: "neuro",         name: "NeuroScan IA",      href: "/neuro",         icon: "🧬", desc: "Assistant Radiologique par IA",            hexColor: "#8b5cf6" },
      { id: "ia-diagnostic", name: "IA-Diagnostic",     href: "/ia-diagnostic", icon: "🔬", desc: "Diagnostic Multi-Pathologies IA",          hexColor: "#7c3aed" },
      { id: "predict",       name: "Predict IA",        href: "/predict",       icon: "🧠", desc: "Prédictions & Tableau de Bord IA",         hexColor: "#6366f1" },
      { id: "ndamatou-academy",name: "Ndamatou Academy",    href: "/ndamatou-academy",icon: "🎓", desc: "Formation & Simulation Médicale",          hexColor: "#6d28d9" },
      { id: "learn",         name: "MedLearn",          href: "/learn",         icon: "📚", desc: "E-Learning Médical & Certifications",      hexColor: "#f59e0b" },
    ],
  },
]

const APPS = SECTIONS.flatMap(s => s.apps)

const BG = "#0a1628"
const ACCENT = "#0ea5e9"

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: Math.random() > 0.8 ? "2px" : "1px",
          height: Math.random() > 0.8 ? "2px" : "1px",
          borderRadius: "50%",
          background: Math.random() > 0.6 ? "#0ea5e9" : "rgba(255,255,255,0.4)",
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `twinkle ${2 + Math.random() * 4}s ${Math.random() * 3}s infinite`,
          opacity: Math.random() * 0.7 + 0.2,
        }} />
      ))}
    </div>
  )
}

export default function Home() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, sans-serif; }
        @keyframes twinkle { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 1; transform: scale(1.5); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-dot { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; transform: scale(1.2); } }
        @keyframes scan-line { 0% { top: 0; } 100% { top: 100%; } }
        .au1 { animation: fadeUp 0.7s 0.1s both; } .au2 { animation: fadeUp 0.7s 0.25s both; }
        .au3 { animation: fadeUp 0.7s 0.4s both; } .au4 { animation: fadeUp 0.7s 0.55s both; }
        .au5 { animation: fadeUp 0.7s 0.7s both; }
        .card-hover { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
        .card-hover:hover { transform: translateY(-5px); }
        .scan-fx { animation: scan-line 3s linear infinite; }
      `}</style>

      <div style={{ minHeight: "100vh", background: BG, color: "#fff", position: "relative" }}>
        {mounted && <Particles />}

        {/* Ambient gradients */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(16,185,129,0.15), transparent)" }} />
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 50% 40% at 90% 90%, rgba(37,99,235,0.08), transparent)" }} />

        {/* HEADER */}
        <header style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "rgba(10,22,40,0.85)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(16,185,129,0.15)",
        }}>
          <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 1.5rem",
            display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, fontSize: 20,
                background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 20px rgba(16,185,129,0.3)",
              }}>🏥</div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: "0.03em" }}>
                  Ndamatou <span style={{ color: ACCENT }}>Suite</span>
                </p>
                <p style={{ fontSize: 9, color: "rgba(16,185,129,0.7)", fontWeight: 600,
                  letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  Centre Hospitalier National · Touba
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%", background: ACCENT,
                display: "inline-block", animation: "pulse-dot 2s infinite",
              }} />
              <span style={{ fontSize: 11, color: ACCENT, fontWeight: 700, letterSpacing: "0.1em" }}>
                SYSTÈME EN LIGNE
              </span>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section style={{ maxWidth: 1300, margin: "0 auto", padding: "5rem 1.5rem 4rem", textAlign: "center", position: "relative" }}>
          <div className="au1" style={{ display: "inline-flex", marginBottom: "1.5rem" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)",
              borderRadius: 100, padding: "6px 18px",
            }}>
              <span style={{ fontSize: 13 }}>🇸🇳</span>
              <span style={{ fontSize: 11, color: ACCENT, fontWeight: 700,
                letterSpacing: "0.12em", textTransform: "uppercase" }}>
                République du Sénégal · MSHP
              </span>
            </div>
          </div>

          <div className="au2" style={{ marginBottom: "1.5rem" }}>
            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              <span style={{ display: "block", fontSize: "0.42em", fontWeight: 500,
                color: "rgba(255,255,255,0.45)", letterSpacing: "0.18em",
                textTransform: "uppercase", marginBottom: "0.7rem" }}>
                L'Écosystème Digital
              </span>
              <span style={{
                background: "linear-gradient(135deg, #fff 0%, #d1fae5 50%, #0ea5e9 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Hôpital Ndamatou
              </span>
              <span style={{ display: "block", fontSize: "0.65em", fontWeight: 700,
                color: ACCENT, marginTop: "0.4rem" }}>
                Touba · Sénégal
              </span>
            </h1>
          </div>

          <p className="au3" style={{
            fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", fontWeight: 600,
            color: "rgba(255,255,255,0.75)", maxWidth: 680, margin: "0 auto 2.5rem", lineHeight: 1.7,
          }}>
            Soigner. <span style={{ color: ACCENT }}>Innover.</span> Protéger chaque citoyen sénégalais.
          </p>

          <div className="au4" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#applications" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
              color: "#fff", padding: "14px 32px", borderRadius: 12,
              fontSize: 16, fontWeight: 700, textDecoration: "none",
              boxShadow: "0 0 30px rgba(16,185,129,0.3)", transition: "all 0.2s",
            }}>
              Explorer les 45 applications →
            </a>
          </div>

          <div className="au5" style={{
            maxWidth: 780, margin: "3.5rem auto 0",
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(16,185,129,0.15)",
            borderRadius: 16, padding: "2rem 2.5rem",
          }}>
            <p style={{ fontSize: 12, color: ACCENT, fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>
              Notre Mission
            </p>
            <p style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
              Le Système d'information de l'hôpital Ndamatou de Touba est une infrastructure de référence nationale.
              Cet écosystème digital de <strong style={{ color: "#fff" }}>45 applications d'avant-garde</strong> place
              l'excellence médicale au cœur de la transformation numérique sénégalaise.
            </p>
          </div>
        </section>

        {/* DIVIDER */}
        <div style={{ position: "relative", maxWidth: 1300, margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.3), transparent)" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            background: BG, padding: "0 10px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: ACCENT, margin: "0 auto" }} />
          </div>
        </div>

        {/* APPS GRID */}
        <section id="applications" style={{ maxWidth: 1300, margin: "0 auto", padding: "4rem 1.5rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontSize: 12, color: ACCENT, fontWeight: 700,
              letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>
              — Portail d'accès —
            </p>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 800, color: "#fff" }}>
              45 Applications Médicales d'État
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", marginTop: 8 }}>
              5 domaines · Du soin quotidien à la cybersécurité et l'intelligence artificielle
            </p>
          </div>

          {SECTIONS.map((section, si) => (
            <div key={section.id} style={{ marginBottom: "3.5rem" }}>
              {/* Section header */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "1.5rem", paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{section.icon}</div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 11, color: ACCENT, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase" }}>Étape {si + 1} / {SECTIONS.length}</span>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "inline-block" }} />
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>{section.apps.length} applications</span>
                  </div>
                  <h3 style={{ margin: "2px 0 0", fontSize: "clamp(1rem, 2vw, 1.25rem)", fontWeight: 800, color: "#fff" }}>{section.label}</h3>
                  <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{section.desc}</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 14 }}>
            {section.apps.map((app) => (
              <Link key={app.id} href={app.href}
                className="card-hover"
                target={app.href.startsWith("http") ? "_blank" : undefined}
                rel={app.href.startsWith("http") ? "noopener noreferrer" : undefined}
                onMouseEnter={() => setHovered(app.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  textDecoration: "none", display: "block",
                  background: hovered === app.id
                    ? `rgba(255,255,255,0.05)`
                    : "rgba(255,255,255,0.02)",
                  border: `1px solid ${hovered === app.id ? app.hexColor + "55" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 16, padding: "1.5rem",
                  position: "relative", overflow: "hidden",
                  boxShadow: hovered === app.id ? `0 12px 40px ${app.hexColor}22` : "none",
                }}>
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, ${app.hexColor}, transparent)`,
                  opacity: hovered === app.id ? 1 : 0.3, transition: "opacity 0.3s",
                }} />
                {hovered === app.id && (
                  <div style={{
                    position: "absolute", left: 0, right: 0, height: 40,
                    background: `linear-gradient(180deg, transparent, ${app.hexColor}15, transparent)`,
                    pointerEvents: "none",
                  }} className="scan-fx" />
                )}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, flexShrink: 0, fontSize: 22,
                    background: `${app.hexColor}15`,
                    border: `1px solid ${app.hexColor}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "transform 0.3s",
                    transform: hovered === app.id ? "scale(1.1) rotate(-5deg)" : "scale(1)",
                  }}>{app.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{app.name}</h3>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{app.desc}</p>
                  </div>
                </div>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.05)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%",
                      background: app.hexColor, animation: "pulse-dot 2s infinite" }} />
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>
                      {app.href.startsWith("http") ? new URL(app.href).hostname : `ndamatou/${app.id}`}
                    </span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700,
                    color: hovered === app.id ? app.hexColor : "rgba(255,255,255,0.2)",
                    transition: "color 0.3s" }}>
                    {app.href.startsWith("http") ? "Ouvrir ↗" : "Ouvrir →"}
                  </span>
                </div>
              </Link>
            ))}
              </div>
            </div>
          ))}
        </section>

        {/* MISSION BLOCK */}
        <section style={{ maxWidth: 1300, margin: "3rem auto", padding: "0 1.5rem" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(37,99,235,0.08) 100%)",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: 20, padding: "2.5rem", position: "relative", overflow: "hidden",
          }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "center" }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <p style={{ fontSize: 12, color: ACCENT, fontWeight: 700,
                  letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
                  Notre Vision 2030
                </p>
                <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "#fff", marginBottom: 14 }}>
                  Soigner, Innover, Protéger
                </h2>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.85 }}>
                  Le Ndamatou de Touba est le fleuron de la santé sénégalaise.
                  Avec cet écosystème de <strong style={{ color: "#fff" }}>45 applications</strong>,
                  Processingenierie propulse l'hôpital au rang des établissements
                  hospitaliers les plus avancés technologiquement d'Afrique de l'Ouest.
                </p>
              </div>
              <div style={{ textAlign: "center", padding: "0 1.5rem" }}>
                <p style={{ fontSize: 52, fontWeight: 900, color: ACCENT, lineHeight: 1 }}>45</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4,
                  letterSpacing: "0.1em", textTransform: "uppercase" }}>Applications</p>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "2rem 1.5rem", marginTop: "2rem" }}>
          <div style={{ maxWidth: 1300, margin: "0 auto",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>🇸🇳</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#ddeaf7" }}>Ndamatou · Touba</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Centre Hospitalier National Ndamatoul Khadim</p>
              </div>
            </div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
              Développé par <span style={{ color: ACCENT, fontWeight: 700 }}>Processingenierie</span>
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
