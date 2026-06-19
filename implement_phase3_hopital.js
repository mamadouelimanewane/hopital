const fs = require('fs');
const path = require('path');

const APPS = {
  "magal-surge": {
    name: "Magal-Surge",
    title: "Gestion de Crise Grand Magal",
    desc: "Prépositionnement automatique des ressources 45j avant le Magal.",
    hex1: "#7c3aed", hex2: "#5b21b6",
  },
  "nutri-care": {
    name: "Nutri-Care",
    title: "Suivi Nutritionnel Médical",
    desc: "Plans diététiques personnalisés avec aliments sénégalais locaux.",
    hex1: "#d97706", hex2: "#b45309",
  },
  "psych-care": {
    name: "Psych-Care",
    title: "Santé Mentale Connectée",
    desc: "Soutien psychologique 100% anonyme avec IA de détection de détresse.",
    hex1: "#0891b2", hex2: "#0e7490",
  },
  "rehab-track": {
    name: "Rehab-Track",
    title: "Rééducation Post-Opératoire",
    desc: "Programme de physiothérapie à distance via caméra smartphone.",
    hex1: "#16a34a", hex2: "#15803d",
  },
  "don-organes": {
    name: "Don-Organes",
    title: "Registre National des Donneurs",
    desc: "1er registre biométrique de donneurs d'organes au Sénégal.",
    hex1: "#e11d48", hex2: "#be123c",
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
  replaceInFile(path.join(dir, 'package.json'), /"name": "(citoyen|cnra-analytics)"/g, `"name": "${appId}"`);
  const pagePath = path.join(dir, 'app/page.tsx');
  replaceInFile(pagePath, /(Citoyen|CNRA Analytics)/g, data.name);
  replaceInFile(pagePath, /(Le portail.*audiovisuelle|Centre de Commandement Stratégique)/g, data.title);
  replaceInFile(pagePath, /(Signalez.*audiovisuelle|Agrégez et analysez toutes les données de régulation via IA)/g, data.desc);
  replaceInFile(pagePath, /bg-\[\#1A3A6B\]/g, `bg-[${data.hex1}]`);
  replaceInFile(pagePath, /text-\[\#1A3A6B\]/g, `text-[${data.hex1}]`);
  replaceInFile(pagePath, /CNRA/g, 'CHNCAK');
  const navPath = path.join(dir, 'components/Navbar.tsx');
  replaceInFile(navPath, /(Citoyen|CNRA Analytics)/g, data.name);
  replaceInFile(navPath, /#1A3A6B/g, data.hex1);
}

// Update hopital-suite portal to include 14 apps
const suitePagePath = path.join(ROOT, 'hopital-suite', 'app', 'page.tsx');
if (fs.existsSync(suitePagePath)) {
  let content = fs.readFileSync(suitePagePath, 'utf8');
  const newApps = `const APPS = [
  { id: "connect", name: "CHNCAK Connect", url: "http://localhost:3001", icon: "🏥", desc: "Portail Patient & Télémédecine", color: "from-blue-600 to-blue-400", bg: "bg-blue-50" },
  { id: "predict", name: "Predict-IA", url: "http://localhost:3002", icon: "🧠", desc: "Tableau de Bord Direction & IA", color: "from-emerald-600 to-emerald-400", bg: "bg-emerald-50" },
  { id: "pharma", name: "SmartPharma", url: "http://localhost:3003", icon: "💊", desc: "Pharmacie, Stocks & Blockchain", color: "from-teal-600 to-teal-400", bg: "bg-teal-50" },
  { id: "learn", name: "Med-Learn", url: "http://localhost:3004", icon: "🎓", desc: "Université & Staffs Médicaux", color: "from-indigo-600 to-indigo-400", bg: "bg-indigo-50" },
  { id: "blood", name: "Blood-Sync", url: "http://localhost:3005", icon: "🩸", desc: "Banque de Sang Connectée", color: "from-red-600 to-red-400", bg: "bg-red-50" },
  { id: "ambu", name: "Ambu-Track", url: "http://localhost:3006", icon: "🚑", desc: "Contrôle Aérien des Urgences", color: "from-orange-600 to-orange-400", bg: "bg-orange-50" },
  { id: "neuro", name: "NeuroScan-IA", url: "http://localhost:3007", icon: "🧬", desc: "Assistant Radiologique par IA", color: "from-violet-600 to-violet-400", bg: "bg-violet-50" },
  { id: "touba", name: "Touba-Med-Care", url: "http://localhost:3008", icon: "🌟", desc: "Tourisme Médical VIP", color: "from-yellow-600 to-yellow-400", bg: "bg-yellow-50" },
  { id: "eco", name: "Eco-Hôpital", url: "http://localhost:3009", icon: "⚡", desc: "Smart Grid & Jumeau Énergétique", color: "from-lime-600 to-lime-400", bg: "bg-lime-50" },
  { id: "magal", name: "Magal-Surge", url: "http://localhost:3010", icon: "🕌", desc: "Gestion de Crise Grand Magal", color: "from-purple-600 to-purple-400", bg: "bg-purple-50" },
  { id: "nutri", name: "Nutri-Care", url: "http://localhost:3011", icon: "🍽️", desc: "Suivi Nutritionnel Médical", color: "from-amber-600 to-amber-400", bg: "bg-amber-50" },
  { id: "psych", name: "Psych-Care", url: "http://localhost:3012", icon: "🧘", desc: "Santé Mentale Anonyme & IA", color: "from-cyan-600 to-cyan-400", bg: "bg-cyan-50" },
  { id: "rehab", name: "Rehab-Track", url: "http://localhost:3013", icon: "🦴", desc: "Rééducation Post-Opératoire", color: "from-green-600 to-green-400", bg: "bg-green-50" },
  { id: "organes", name: "Don-Organes", url: "http://localhost:3014", icon: "❤️", desc: "Registre National Donneurs", color: "from-rose-600 to-rose-400", bg: "bg-rose-50" },
]`;
  content = content.replace(/const APPS = \[[\s\S]*?\];?/, newApps + ';');
  content = content.replace(/gridTemplateColumns: "repeat\(auto-fit, minmax\(min\(100%, 300px\), 1fr\)\)"/g, 'gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))"');
  fs.writeFileSync(suitePagePath, content, 'utf8');
}

console.log('✅ Patch CHNCAK Phase 3 completed! 14 apps total.');
