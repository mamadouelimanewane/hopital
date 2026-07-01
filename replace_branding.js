const fs = require('fs');
const path = require('path');

const targetDir = 'c:/gravity/hopital';

const replacements = [
  { search: /Cheikh Ahmadou Bamba/gi, replace: 'Ndamatou de Touba' },
  { search: /Cheikh Ahmadou Khadim/gi, replace: 'Ndamatou de Touba' },
  { search: /CHNCAK/g, replace: 'Ndamatou' },
  { search: /chncak/g, replace: 'ndamatou' },
  { search: /Cheikh\s*Ahmadou/gi, replace: 'Ndamatou' },
  { search: /#10b981/g, replace: '#0ea5e9' }, // emerald to light blue (ocean)
  { search: /#059669/g, replace: '#0284c7' }  // darker emerald to darker blue
];

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === '.next' || file === 'replace_branding.js') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (stat.isFile() && /\.(js|jsx|ts|tsx|html|css|py|json|md)$/.test(file)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let newContent = content;
      
      // Let's add Hémodialyse, Néonatologie, Réanimation to page.tsx and generate_hopital_pages.js as a bonus
      // We will just do the regex replacements first
      for (const { search, replace } of replacements) {
        newContent = newContent.replace(search, replace);
      }
      
      if (newContent !== content) {
        console.log(`Updated ${fullPath}`);
        fs.writeFileSync(fullPath, newContent, 'utf8');
      }
    }
  }
}

walkDir(targetDir);
console.log("Done");
