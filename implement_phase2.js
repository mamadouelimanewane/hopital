const fs = require('fs');
const path = require('path');

const APPS = {
  "blood-sync": {
    name: "Blood-Sync",
    title: "Banque de Sang Connectée",
    desc: "Alertes SOS donneurs et gestion d'inventaire en temps réel.",
    color1: "bg-red-500",
    color2: "text-red-600",
    hex1: "#ef4444",
    hex2: "#b91c1c",
  },
  "ambu-track": {
    name: "Ambu-Track",
    title: "Contrôle Aérien des Urgences",
    desc: "Suivi GPS de la flotte et transmission vitale IoT.",
    color1: "bg-orange-500",
    color2: "text-orange-600",
    hex1: "#f97316",
    hex2: "#c2410c",
  },
  "neuroscan-ia": {
    name: "NeuroScan-IA",
    title: "Assistant Radiologique par IA",
    desc: "Deep Learning pour la détection instantanée sur IRM et Scanners.",
    color1: "bg-violet-500",
    color2: "text-violet-600",
    hex1: "#8b5cf6",
    hex2: "#6d28d9",
  },
  "touba-med-care": {
    name: "Touba-Med-Care",
    title: "Portail Tourisme Médical",
    desc: "Prise en charge VIP, financement diaspora et accompagnement logistique.",
    color1: "bg-yellow-500",
    color2: "text-yellow-600",
    hex1: "#eab308",
    hex2: "#a16207",
  },
  "eco-hopital": {
    name: "Eco-Hôpital",
    title: "Jumeau Énergétique",
    desc: "Smart Grid pour réguler l'énergie des blocs et anticiper les coupures.",
    color1: "bg-lime-500",
    color2: "text-lime-600",
    hex1: "#84cc16",
    hex2: "#4d7c0f",
  }
};

const ROOT = 'c:/gravity/hopital';

function replaceInFile(filePath, searchRegex, replacement) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(searchRegex, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

for (const [appId, data] of Object.entries(APPS)) {
  const dir = path.join(ROOT, appId);
  
  // package.json
  replaceInFile(path.join(dir, 'package.json'), /"name": "(citoyen|cnra-analytics|hopital-suite)"/g, `"name": "${appId}"`);
  
  // layout.tsx
  const layoutPath = path.join(dir, 'app/(site)/layout.tsx');
  replaceInFile(layoutPath, /(Citoyen|CNRA Analytics|Ndamatou Predict-IA)/g, data.name);
  replaceInFile(layoutPath, /#1A3A6B/g, data.hex1);
  replaceInFile(layoutPath, /#C9A84C/g, data.hex2);

  // page.tsx (accueil)
  const pagePath = path.join(dir, 'app/page.tsx');
  replaceInFile(pagePath, /(Citoyen|CNRA Analytics|Ndamatou Predict-IA)/g, data.name);
  replaceInFile(pagePath, /(Le portail.*audiovisuelle|Centre de Commandement Stratégique)/g, data.title);
  replaceInFile(pagePath, /(Signalez.*audiovisuelle|Agrégez et analysez toutes les données de régulation via IA)/g, data.desc);
  
  // Replace colors for non-IA templates
  replaceInFile(pagePath, /bg-\[\#1A3A6B\]/g, `bg-[${data.hex1}]`);
  replaceInFile(pagePath, /text-\[\#1A3A6B\]/g, `text-[${data.hex1}]`);
  replaceInFile(pagePath, /bg-\[\#C9A84C\]/g, `bg-[${data.hex2}]`);
  replaceInFile(pagePath, /text-\[\#C9A84C\]/g, `text-[${data.hex2}]`);
  
  // Replace names for IA templates (Neuroscan, Eco-Hopital copied from analytics)
  replaceInFile(pagePath, /CNRA/g, 'Ndamatou');

  // Navbar
  const navPath = path.join(dir, 'components/Navbar.tsx');
  replaceInFile(navPath, /(Citoyen|CNRA Analytics|Ndamatou Predict-IA)/g, data.name);
  replaceInFile(navPath, /#1A3A6B/g, data.hex1);
}

// ----------------------------------------------------
// Patcher Hopital-Suite (Le Portail) pour intégrer les 9 apps
// ----------------------------------------------------
const suitePagePath = path.join(ROOT, 'hopital-suite', 'app', 'page.tsx');
if (fs.existsSync(suitePagePath)) {
  let suiteContent = fs.readFileSync(suitePagePath, 'utf8');
  
  const newAppsContent = `const APPS = [
  { id: "connect", name: "Ndamatou Connect", url: "http://localhost:3001", icon: "🏥", desc: "Portail Patient & Télémédecine", color: "from-blue-600 to-blue-400", bg: "bg-blue-50" },
  { id: "predict", name: "Predict-IA", url: "http://localhost:3002", icon: "🧠", desc: "Tableau de Bord Direction & IA", color: "from-emerald-600 to-emerald-400", bg: "bg-emerald-50" },
  { id: "pharma", name: "SmartPharma", url: "http://localhost:3003", icon: "💊", desc: "Pharmacie, Stocks & Blockchain", color: "from-teal-600 to-teal-400", bg: "bg-teal-50" },
  { id: "learn", name: "Med-Learn", url: "http://localhost:3004", icon: "🎓", desc: "Université & Staffs Médicaux", color: "from-indigo-600 to-indigo-400", bg: "bg-indigo-50" },
  { id: "blood", name: "Blood-Sync", url: "http://localhost:3005", icon: "🩸", desc: "Banque de Sang Connectée", color: "from-red-600 to-red-400", bg: "bg-red-50" },
  { id: "ambu", name: "Ambu-Track", url: "http://localhost:3006", icon: "🚑", desc: "Contrôle Aérien des Urgences", color: "from-orange-600 to-orange-400", bg: "bg-orange-50" },
  { id: "neuro", name: "NeuroScan-IA", url: "http://localhost:3007", icon: "🧬", desc: "Assistant Radiologique par IA", color: "from-violet-600 to-violet-400", bg: "bg-violet-50" },
  { id: "touba", name: "Touba-Med-Care", url: "http://localhost:3008", icon: "🌟", desc: "Tourisme Médical VIP", color: "from-yellow-600 to-yellow-400", bg: "bg-yellow-50" },
  { id: "eco", name: "Eco-Hôpital", url: "http://localhost:3009", icon: "⚡", desc: "Smart Grid & Jumeau Énergétique", color: "from-lime-600 to-lime-400", bg: "bg-lime-50" },
]`;
  
  suiteContent = suiteContent.replace(/const APPS = \[[\s\S]*?\];/, newAppsContent + ';');
  // Handle case where semicolon was not present
  if (!suiteContent.includes(newAppsContent)) {
     suiteContent = suiteContent.replace(/const APPS = \[[\s\S]*?\]/, newAppsContent);
  }
  
  // Appliquer le remplacement de grid
  suiteContent = suiteContent.replace(/grid-cols-1 md:grid-cols-2/g, "grid-cols-1 md:grid-cols-3");
  
  fs.writeFileSync(suitePagePath, suiteContent, 'utf8');
}

console.log('Patch Phase 2 completed successfully!');
