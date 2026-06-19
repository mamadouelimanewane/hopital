const fs = require('fs');
const path = require('path');

const APPS = [
  { id: "connect", name: "CHNCAK Connect", icon: "🏥", color: "#2563eb", subtitle: "Portail Patient & Télémédecine",
    desc: "L'application centrale pour tous les patients de l'hôpital CHNCAK de Touba.",
    features: [
      { icon: "📅", title: "Prise de RDV", desc: "Consultations en ligne" },
      { icon: "📄", title: "Résultats", desc: "Analyses et radiologies" },
      { icon: "📞", title: "Téléconsultation", desc: "Vidéo avec les médecins" },
      { icon: "💳", title: "Paiement", desc: "Factures en ligne" },
    ],
    stats: [{ val: "10K+", label: "Patients Actifs" }, { val: "24/7", label: "Disponibilité" }, { val: "100%", label: "Sécurisé" }]
  },
  { id: "predict", name: "Predict-IA", icon: "🧠", color: "#10b981", subtitle: "Tableau de Bord Direction & IA",
    desc: "Intelligence artificielle pour la gestion prédictive des ressources hospitalières.",
    features: [
      { icon: "📈", title: "Prévision Flux", desc: "Anticipation des urgences" },
      { icon: "🛏️", title: "Lits Disponibles", desc: "Gestion des capacités" },
      { icon: "👥", title: "Planning Staff", desc: "Optimisation du personnel" },
      { icon: "💰", title: "Budget", desc: "Suivi financier en temps réel" },
    ],
    stats: [{ val: "95%", label: "Précision IA" }, { val: "+20%", label: "Efficacité" }, { val: "-15%", label: "Temps d'attente" }]
  },
  { id: "pharma", name: "SmartPharma", icon: "💊", color: "#14b8a6", subtitle: "Pharmacie, Stocks & Blockchain",
    desc: "Gestion intelligente et transparente de la pharmacie de l'hôpital.",
    features: [
      { icon: "📦", title: "Suivi Stocks", desc: "Inventaire en temps réel" },
      { icon: "🔗", title: "Blockchain", desc: "Traçabilité des médicaments" },
      { icon: "⚠️", title: "Alertes", desc: "Prévention des ruptures" },
      { icon: "🧾", title: "Ordonnances", desc: "Délivrance numérisée" },
    ],
    stats: [{ val: "0", label: "Rupture de Stock" }, { val: "100%", label: "Traçabilité" }, { val: "5K+", label: "Références" }]
  },
  { id: "learn", name: "Med-Learn", icon: "🎓", color: "#6366f1", subtitle: "Université & Staffs Médicaux",
    desc: "Plateforme de formation continue pour le personnel médical du CHNCAK.",
    features: [
      { icon: "📚", title: "Cours en Ligne", desc: "Modules de spécialisation" },
      { icon: "🎥", title: "Chirurgie Live", desc: "Retransmission des blocs" },
      { icon: "👨‍⚕️", title: "Staffs", desc: "Réunions multidisciplinaires" },
      { icon: "🏆", title: "Certifications", desc: "Validation des acquis" },
    ],
    stats: [{ val: "500+", label: "Médecins Formés" }, { val: "50+", label: "Cours Disponibles" }, { val: "Live", label: "Bloc Opératoire" }]
  },
  { id: "blood", name: "Blood-Sync", icon: "🩸", color: "#ef4444", subtitle: "Banque de Sang Connectée",
    desc: "Système de gestion optimisée pour la banque de sang de Touba.",
    features: [
      { icon: "🩸", title: "Poches Disponibles", desc: "Inventaire par groupe sanguin" },
      { icon: "❤️", title: "Donneurs", desc: "Appels aux dons ciblés" },
      { icon: "🚑", title: "Urgences", desc: "Acheminement rapide" },
      { icon: "❄️", title: "Conservation", desc: "Monitoring de la chaîne du froid" },
    ],
    stats: [{ val: "100%", label: "Sécurité Transfusion" }, { val: "24/7", label: "Monitoring" }, { val: "10K+", label: "Donneurs Inscrits" }]
  },
  { id: "ambu", name: "Ambu-Track", icon: "🚑", color: "#f97316", subtitle: "Contrôle Aérien des Urgences",
    desc: "Gestion de flotte et régulation des ambulances en temps réel.",
    features: [
      { icon: "📍", title: "GPS Tracking", desc: "Suivi de toutes les ambulances" },
      { icon: "🗺️", title: "Routing", desc: "Calcul de l'itinéraire le plus rapide" },
      { icon: "📡", title: "Télémétrie", desc: "Transmission des constantes vitale" },
      { icon: "🏥", title: "Pré-alerte", desc: "Préparation des équipes d'urgence" },
    ],
    stats: [{ val: "-40%", label: "Temps d'Intervention" }, { val: "50+", label: "Véhicules Connectés" }, { val: "Live", label: "Transmission" }]
  },
  { id: "neuro", name: "NeuroScan-IA", icon: "🧬", color: "#8b5cf6", subtitle: "Assistant Radiologique par IA",
    desc: "Outil d'aide au diagnostic pour l'imagerie médicale (IRM, Scanner).",
    features: [
      { icon: "🧠", title: "Analyse IA", desc: "Détection des anomalies" },
      { icon: "🖼️", title: "Viewer 3D", desc: "Visualisation avancée" },
      { icon: "📝", title: "Comptes Rendus", desc: "Génération automatique" },
      { icon: "☁️", title: "PACS/RIS", desc: "Intégration transparente" },
    ],
    stats: [{ val: "99%", label: "Sensibilité IA" }, { val: "Secondes", label: "Temps d'Analyse" }, { val: "1M+", label: "Images Apprises" }]
  },
  { id: "touba", name: "Touba-Med-Care", icon: "🌟", color: "#eab308", subtitle: "Tourisme Médical VIP",
    desc: "Services premium et conciergerie pour les patients internationaux et VIP.",
    features: [
      { icon: "🛎️", title: "Conciergerie", desc: "Service sur mesure" },
      { icon: "✈️", title: "Transferts", desc: "Aéroport - Hôpital" },
      { icon: "🏨", title: "Hébergement", desc: "Suites médicalisées" },
      { icon: "🌍", title: "Traduction", desc: "Interprètes médicaux" },
    ],
    stats: [{ val: "5★", label: "Service Client" }, { val: "VIP", label: "Accueil Personnalisé" }, { val: "24/7", label: "Assistance" }]
  },
  { id: "eco", name: "Eco-Hôpital", icon: "⚡", color: "#84cc16", subtitle: "Smart Grid & Jumeau Énergétique",
    desc: "Gestion intelligente de la consommation énergétique et écologique du CHNCAK.",
    features: [
      { icon: "🔋", title: "Smart Grid", desc: "Optimisation électrique" },
      { icon: "☀️", title: "Solaire", desc: "Production d'énergie verte" },
      { icon: "💧", title: "Eau", desc: "Gestion des ressources" },
      { icon: "♻️", title: "Déchets", desc: "Suivi du recyclage" },
    ],
    stats: [{ val: "-30%", label: "Consommation" }, { val: "50%", label: "Énergie Verte" }, { val: "0", label: "Gaspillage" }]
  },
  { id: "magal", name: "Magal-Surge", icon: "🕌", color: "#7c3aed", subtitle: "Gestion de Crise Grand Magal",
    desc: "Module spécifique de préparation et réponse aux afflux massifs lors du Grand Magal de Touba.",
    features: [
      { icon: "📈", title: "Prédiction", desc: "Modélisation de l'afflux" },
      { icon: "🏕️", title: "Postes Avancés", desc: "Gestion des hôpitaux de campagne" },
      { icon: "🚨", title: "Alerte", desc: "Coordination des secours" },
      { icon: "📊", title: "Dashboard", desc: "Vue temps réel de la situation" },
    ],
    stats: [{ val: "3M+", label: "Pèlerins Protégés" }, { val: "100+", label: "Postes Coordonnés" }, { val: "Live", label: "Monitoring" }]
  },
  { id: "nutri", name: "Nutri-Care", icon: "🍽️", color: "#d97706", subtitle: "Suivi Nutritionnel Médical",
    desc: "Gestion personnalisée de la nutrition des patients hospitalisés.",
    features: [
      { icon: "🥗", title: "Menus", desc: "Adaptés aux pathologies" },
      { icon: "👩‍⚕️", title: "Diététique", desc: "Suivi par les spécialistes" },
      { icon: "🏭", title: "Cuisine", desc: "Lien direct avec la restauration" },
      { icon: "📊", title: "Dénutrition", desc: "Dépistage et prévention" },
    ],
    stats: [{ val: "100%", label: "Repas Personnalisés" }, { val: "0", label: "Erreur Allergie" }, { val: "3", label: "Repas/Jour/Patient" }]
  },
  { id: "psych", name: "Psych-Care", icon: "🧘", color: "#0891b2", subtitle: "Santé Mentale Anonyme & IA",
    desc: "Soutien psychologique accessible, confidentiel et assisté par intelligence artificielle.",
    features: [
      { icon: "💬", title: "Chatbot IA", desc: "Soutien émotionnel 24/7" },
      { icon: "🕵️", title: "Anonymat", desc: "Consultations discrètes" },
      { icon: "📞", title: "Télé-Psy", desc: "Séances vidéo" },
      { icon: "🚨", title: "Crise", desc: "Intervention d'urgence" },
    ],
    stats: [{ val: "100%", label: "Confidentiel" }, { val: "24/7", label: "Disponibilité" }, { val: "5K+", label: "Sessions/Mois" }]
  },
  { id: "rehab", name: "Rehab-Track", icon: "🦴", color: "#16a34a", subtitle: "Rééducation Post-Opératoire",
    desc: "Suivi numérique des programmes de kinésithérapie et de rééducation.",
    features: [
      { icon: "🏃", title: "Exercices", desc: "Vidéos personnalisées" },
      { icon: "📈", title: "Progrès", desc: "Suivi des amplitudes" },
      { icon: "📱", title: "App Patient", desc: "Rappels et motivation" },
      { icon: "🤝", title: "Lien Kiné", desc: "Feedback continu" },
    ],
    stats: [{ val: "+40%", label: "Observance" }, { val: "-20%", label: "Temps Récupération" }, { val: "100+", label: "Protocoles" }]
  },
  { id: "organes", name: "Don-Organes", icon: "❤️", color: "#e11d48", subtitle: "Registre National Donneurs",
    desc: "Gestion sécurisée, éthique et transparente des dons et transplantations d'organes.",
    features: [
      { icon: "📝", title: "Registre", desc: "Inscription des volontaires" },
      { icon: "🧬", title: "Matching", desc: "Algorithme de compatibilité HLA" },
      { icon: "⏱️", title: "Logistique", desc: "Coordination des greffes" },
      { icon: "🔒", title: "Éthique", desc: "Traçabilité et anonymat" },
    ],
    stats: [{ val: "10K+", label: "Inscrits" }, { val: "100%", label: "Transparent" }, { val: "National", label: "Couverture" }]
  },
];

const ROOT = 'c:/gravity/hopital/hopital-suite/app';

const pageTemplate = (app) => `"use client"
import Link from "next/link"

export default function ${app.name.replace(/[^a-zA-Z]/g, '')}Page() {
  return (
    <>
      <style>{\`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, sans-serif; background: #0a1628; color: #fff; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .au1{animation:fadeUp .6s .1s both} .au2{animation:fadeUp .6s .2s both}
        .au3{animation:fadeUp .6s .3s both} .au4{animation:fadeUp .6s .4s both}
        .stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 1.5rem; text-align: center; transition: all 0.3s; }
        .stat-card:hover { border-color: ${app.color}44; background: rgba(255,255,255,0.05); transform: translateY(-3px); }
        .feat-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 1.25rem; transition: all 0.3s; }
        .feat-card:hover { border-color: ${app.color}44; background: rgba(255,255,255,0.04); }
        .back-btn { display: inline-flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.5); text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s; }
        .back-btn:hover { color: #fff; }
      \`}</style>

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,22,40,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 1.5rem", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" className="back-btn">← Retour au Portail CHNCAK</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "${app.color}" }} />
          <span style={{ fontSize: 12, color: "${app.color}", fontWeight: 700, letterSpacing: "0.1em" }}>SYSTÈME ACTIF</span>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem" }}>

        {/* HERO */}
        <div className="au1" style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: "3rem" }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, background: "${app.color}20", border: "2px solid ${app.color}40", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, flexShrink: 0, boxShadow: "0 0 30px ${app.color}30" }}>
            ${app.icon}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: "${app.color}", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", background: "${app.color}15", padding: "3px 10px", borderRadius: 6, border: "1px solid ${app.color}30" }}>
                Application Hospitalière
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 10 }}>
              <span style={{ background: "linear-gradient(135deg, #fff, ${app.color})", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                ${app.name}
              </span>
            </h1>
            <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.15rem)", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 600 }}>
              ${app.desc}
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="au2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: "3rem" }}>
          ${app.stats.map(s => `<div className="stat-card">
            <p style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, color: "${app.color}", marginBottom: 4 }}>${s.val}</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>${s.label}</p>
          </div>`).join('\n          ')}
        </div>

        {/* FEATURES */}
        <div className="au3" style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, marginBottom: "1.5rem" }}>Fonctionnalités Clés</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 12 }}>
            ${app.features.map(f => `<div className="feat-card">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "${app.color}18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>${f.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>${f.title}</h3>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>${f.desc}</p>
            </div>`).join('\n            ')}
          </div>
        </div>

        {/* CTA */}
        <div className="au4" style={{ background: "${app.color}10", border: "1px solid ${app.color}25", borderRadius: 16, padding: "2rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1.5rem" }}>
          <div>
            <h3 style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)", fontWeight: 800, marginBottom: 8 }}>Prêt à intégrer ce module ?</h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Contactez Processingenierie pour déployer ${app.name} dans votre infrastructure.</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="mailto:contact@processingenierie.sn" style={{ background: "${app.color}", color: "#fff", padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              ✉️ Nous contacter
            </a>
            <Link href="/" style={{ background: "rgba(255,255,255,0.05)", color: "#fff", padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)" }}>
              ← Retour Portail
            </Link>
          </div>
        </div>

      </main>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "1.5rem", marginTop: "3rem", textAlign: "center" }}>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Développé par <span style={{ color: "${app.color}", fontWeight: 700 }}>Processingenierie</span> · Hôpital CHNCAK Touba 🇸🇳</p>
      </footer>
    </>
  )
}
`;

for (const app of APPS) {
  const dir = path.join(ROOT, app.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'page.tsx'), pageTemplate(app), 'utf8');
  console.log(`✅ Created route: /${app.id}`);
}

console.log('\n🎉 Toutes les 14 pages CHNCAK créées avec succès !');
