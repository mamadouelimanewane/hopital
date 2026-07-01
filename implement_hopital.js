const fs = require('fs');
const path = require('path');

const APPS = {
  "ndamatou-connect": {
    name: "Ndamatou Connect",
    title: "Portail Patient & Télémédecine",
    desc: "Prenez rendez-vous, consultez vos dossiers médicaux et orientez-vous dans l'hôpital.",
    color1: "bg-blue-600",
    color2: "text-blue-600",
    hex1: "#2563eb",
    hex2: "#1d4ed8",
  },
  "ndamatou-predict-ia": {
    name: "Ndamatou Predict-IA",
    title: "Gestion Prédictive des Flux",
    desc: "Supervisez l'affluence et optimisez l'affectation des ressources avec l'IA.",
    color1: "bg-emerald-500",
    color2: "text-emerald-600",
    hex1: "#0ea5e9",
    hex2: "#047857",
  },
  "smart-pharma": {
    name: "SmartPharma",
    title: "Pharmacie Digitale",
    desc: "Suivez les stocks en temps réel et sécurisez les prescriptions via Blockchain.",
    color1: "bg-teal-500",
    color2: "text-teal-600",
    hex1: "#14b8a6",
    hex2: "#0f766e",
  },
  "ndamatou-med-learn": {
    name: "Ndamatou Med-Learn",
    title: "Plateforme Universitaire",
    desc: "Suivez les interventions en direct et participez aux staffs virtuels.",
    color1: "bg-indigo-500",
    color2: "text-indigo-600",
    hex1: "#6366f1",
    hex2: "#4338ca",
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
  replaceInFile(path.join(dir, 'package.json'), /"name": "(citoyen|cnra-analytics)"/g, `"name": "${appId}"`);
  
  // layout.tsx
  const layoutPath = path.join(dir, 'app/(site)/layout.tsx');
  replaceInFile(layoutPath, /(Citoyen|CNRA Analytics)/g, data.name);
  replaceInFile(layoutPath, /#1A3A6B/g, data.hex1);
  replaceInFile(layoutPath, /#C9A84C/g, data.hex2);

  // page.tsx (accueil)
  const pagePath = path.join(dir, 'app/page.tsx');
  replaceInFile(pagePath, /(Citoyen|CNRA Analytics)/g, data.name);
  replaceInFile(pagePath, /(Le portail.*audiovisuelle|Centre de Commandement Stratégique)/g, data.title);
  replaceInFile(pagePath, /(Signalez.*audiovisuelle|Agrégez et analysez toutes les données de régulation via IA)/g, data.desc);
  
  if (appId !== 'ndamatou-predict-ia') {
      replaceInFile(pagePath, /bg-\[\#1A3A6B\]/g, `bg-[${data.hex1}]`);
      replaceInFile(pagePath, /text-\[\#1A3A6B\]/g, `text-[${data.hex1}]`);
      replaceInFile(pagePath, /bg-\[\#C9A84C\]/g, `bg-[${data.hex2}]`);
      replaceInFile(pagePath, /text-\[\#C9A84C\]/g, `text-[${data.hex2}]`);
  } else {
      // Pour predict-ia, on remplace CNRA par Ndamatou
      replaceInFile(pagePath, /CNRA/g, 'Ndamatou');
  }

  // Navbar
  const navPath = path.join(dir, 'components/Navbar.tsx');
  replaceInFile(navPath, /(Citoyen|CNRA Analytics)/g, data.name);
  replaceInFile(navPath, /#1A3A6B/g, data.hex1);
}

// ----------------------------------------------------
// Patcher Hopital-Suite (Le Portail)
// ----------------------------------------------------
const suitePagePath = path.join(ROOT, 'hopital-suite', 'app', 'page.tsx');
if (fs.existsSync(suitePagePath)) {
  let suiteContent = fs.readFileSync(suitePagePath, 'utf8');
  
  // Remplacer les textes génériques
  suiteContent = suiteContent.replace(/CNRA Suite/g, "Hopital Suite");
  suiteContent = suiteContent.replace(/Conseil National de Régulation de l'Audiovisuel/g, "Centre Hospitalier National Ndamatoul Khadim");
  suiteContent = suiteContent.replace(/L'écosystème numérique officiel/g, "L'écosystème digital médical de pointe");
  
  // Remplacer l'objet APPS
  const newAppsContent = `const APPS = [
  { id: "connect", name: "Ndamatou Connect", url: "http://localhost:3001", icon: "🏥", desc: "Portail Patient & Télémédecine", color: "from-blue-600 to-blue-400", bg: "bg-blue-50" },
  { id: "predict", name: "Predict-IA", url: "http://localhost:3002", icon: "🧠", desc: "Tableau de Bord Direction & IA", color: "from-emerald-600 to-emerald-400", bg: "bg-emerald-50" },
  { id: "pharma", name: "SmartPharma", url: "http://localhost:3003", icon: "💊", desc: "Pharmacie, Stocks & Blockchain", color: "from-teal-600 to-teal-400", bg: "bg-teal-50" },
  { id: "learn", name: "Med-Learn", url: "http://localhost:3004", icon: "🎓", desc: "Université & Staffs Médicaux", color: "from-indigo-600 to-indigo-400", bg: "bg-indigo-50" },
]`;
  
  suiteContent = suiteContent.replace(/const APPS = \[[\s\S]*?\]/, newAppsContent);
  fs.writeFileSync(suitePagePath, suiteContent, 'utf8');
}

// package.json du portail
replaceInFile(path.join(ROOT, 'hopital-suite', 'package.json'), /"name": "cnra-suite"/g, '"name": "hopital-suite"');

console.log('Patch Hopital completed successfully!');
