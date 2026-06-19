import PptxGenJS from 'pptxgenjs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const BLEU = '1A3A6B'
const OR = 'C9A84C'
const BLANC = 'FFFFFF'
const GRIS = 'F1F5F9'
const GRIS_TEXTE = '64748B'

const pptx = new PptxGenJS()
pptx.layout = 'LAYOUT_WIDE' // 13.33" x 7.5"
pptx.title = 'CNRA Suite — Régulation Audiovisuelle Numérique'
pptx.subject = 'Présentation officielle CNRA Suite 2025'
pptx.author = 'CNRA — Conseil National de Régulation de l\'Audiovisuel'
pptx.company = 'CNRA Sénégal'

// ─── Helpers ───────────────────────────────────────────────────────────────

function slideBase(slide, dark = true) {
  slide.background = { color: dark ? BLEU : BLANC }
}

function addLogo(slide, dark = true) {
  slide.addText('CNRA', {
    x: 0.3, y: 0.15, w: 1.2, h: 0.4,
    fontSize: 11, bold: true,
    color: dark ? OR : BLEU,
    fontFace: 'Arial',
  })
  slide.addText('Suite', {
    x: 0.3, y: 0.48, w: 1.2, h: 0.25,
    fontSize: 8, color: dark ? 'AAAAAA' : GRIS_TEXTE,
    fontFace: 'Arial',
  })
}

function addSlideNumber(slide, n, total, dark = true) {
  slide.addText(`${n} / ${total}`, {
    x: 12.7, y: 7.1, w: 0.5, h: 0.3,
    fontSize: 8, color: dark ? '888888' : GRIS_TEXTE,
    fontFace: 'Arial', align: 'right',
  })
}

function accentBar(slide, dark = true) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 7.3, w: 13.33, h: 0.2,
    fill: { color: OR },
    line: { color: OR },
  })
}

const TOTAL = 16

// ─── Slide 1 : TITRE ──────────────────────────────────────────────────────
{
  const s = pptx.addSlide()
  slideBase(s)
  // Fond dégradé simulé avec rectangles
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: '0F2547' }, line: { color: '0F2547' } })
  s.addShape(pptx.ShapeType.rect, { x: 8, y: 0, w: 5.33, h: 7.5, fill: { color: '1A3A6B' }, line: { color: '1A3A6B' } })
  // Barre or
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 3.2, w: 0.12, h: 2.2, fill: { color: OR }, line: { color: OR } })
  // Titre
  s.addText('CNRA Suite', { x: 0.5, y: 1.2, w: 7, h: 1, fontSize: 48, bold: true, color: BLANC, fontFace: 'Arial' })
  s.addText('Régulation Audiovisuelle\nNumérique', { x: 0.5, y: 2.3, w: 7, h: 1.4, fontSize: 28, color: OR, fontFace: 'Arial', bold: false })
  s.addText('6 modules · 1 plateforme souveraine · 54 pays africains', {
    x: 0.5, y: 3.9, w: 7, h: 0.5, fontSize: 13, color: 'A0B4CC', fontFace: 'Arial',
  })
  // Badges modules
  const modules = ['AntiDeep', 'EduMedia', 'ElectroWatch', 'MediaBase', 'MediaWatch', 'Citoyen']
  modules.forEach((m, i) => {
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.5 + (i % 3) * 2.3, y: 4.7 + Math.floor(i / 3) * 0.55,
      w: 2.1, h: 0.4,
      fill: { color: i === 2 ? OR : '1E3A5F' },
      line: { color: i === 2 ? OR : '2D5A8E' },
      rectRadius: 0.05,
    })
    s.addText(m, {
      x: 0.5 + (i % 3) * 2.3, y: 4.7 + Math.floor(i / 3) * 0.55,
      w: 2.1, h: 0.4,
      fontSize: 10, color: BLANC, bold: true, fontFace: 'Arial', align: 'center', valign: 'middle',
    })
  })
  s.addText('Présentation Officielle 2025', { x: 0.5, y: 6.6, w: 4, h: 0.35, fontSize: 10, color: '667788', fontFace: 'Arial' })
  addSlideNumber(s, 1, TOTAL)
  accentBar(s)
}

// ─── Slide 2 : CHIFFRES CLÉS ──────────────────────────────────────────────
{
  const s = pptx.addSlide()
  slideBase(s, false)
  addLogo(s, false)
  s.addText('Chiffres Clés', { x: 1, y: 0.8, w: 11, h: 0.7, fontSize: 30, bold: true, color: BLEU, fontFace: 'Arial', align: 'center' })
  s.addText('L\'audiovisuel sénégalais en données', { x: 1, y: 1.5, w: 11, h: 0.4, fontSize: 14, color: GRIS_TEXTE, fontFace: 'Arial', align: 'center' })

  const stats = [
    { val: '847', label: 'Médias recensés', sub: 'TV, Radio, En ligne' },
    { val: '3.2M', label: 'Citoyens touchés', sub: 'via le portail Citoyen' },
    { val: '12 400h', label: 'Monitorées/an', sub: 'contenu audiovisuel' },
    { val: '94%', label: 'Gain d\'efficacité', sub: 'traitement signalements' },
    { val: '15', label: 'Pays CEDEAO', sub: 'marché potentiel SaaS' },
    { val: '64', label: 'Tests unitaires', sub: '100% passants' },
  ]

  stats.forEach((st, i) => {
    const col = i % 3
    const row = Math.floor(i / 3)
    const x = 0.5 + col * 4.2
    const y = 2.2 + row * 2.1
    s.addShape(pptx.ShapeType.roundRect, { x, y, w: 3.9, h: 1.8, fill: { color: BLEU }, line: { color: OR }, rectRadius: 0.1 })
    s.addText(st.val, { x, y: y + 0.2, w: 3.9, h: 0.8, fontSize: 34, bold: true, color: OR, fontFace: 'Arial', align: 'center' })
    s.addText(st.label, { x, y: y + 0.9, w: 3.9, h: 0.4, fontSize: 12, bold: true, color: BLANC, fontFace: 'Arial', align: 'center' })
    s.addText(st.sub, { x, y: y + 1.3, w: 3.9, h: 0.35, fontSize: 9, color: 'A0B4CC', fontFace: 'Arial', align: 'center' })
  })
  addSlideNumber(s, 2, TOTAL, false)
  accentBar(s)
}

// ─── Slide 3 : DÉFIS ──────────────────────────────────────────────────────
{
  const s = pptx.addSlide()
  slideBase(s)
  addLogo(s)
  s.addText('Les Défis Actuels', { x: 1, y: 0.8, w: 11, h: 0.7, fontSize: 30, bold: true, color: BLANC, fontFace: 'Arial', align: 'center' })
  s.addText('Pourquoi la régulation numérique est urgente', { x: 1, y: 1.5, w: 11, h: 0.4, fontSize: 13, color: OR, fontFace: 'Arial', align: 'center' })

  const defis = [
    { icon: '⚠', titre: 'Deepfakes & Désinformation', desc: 'Fausses vidéos de personnalités politiques, clonage vocal, manipulation de l\'opinion publique en langue locale' },
    { icon: '⚖', titre: 'Inéquité Électorale', desc: 'Temps de parole déséquilibré entre candidats dans les médias, détecté trop tard pour correction' },
    { icon: '👁', titre: 'Surveillance Manuelle', desc: 'Monitoring par échantillonnage, impossibilité de couvrir 100% des émissions, preuves fragiles' },
    { icon: '📱', titre: 'Explosion du Numérique', desc: 'Médias en ligne non régulés, réseaux sociaux hors contrôle, citoyens sans recours efficace' },
  ]

  defis.forEach((d, i) => {
    const x = 0.4 + (i % 2) * 6.4
    const y = 2.1 + Math.floor(i / 2) * 2.2
    s.addShape(pptx.ShapeType.roundRect, { x, y, w: 6, h: 2, fill: { color: '1E3A6B' }, line: { color: OR }, rectRadius: 0.1 })
    s.addText(d.icon + '  ' + d.titre, { x: x + 0.2, y: y + 0.2, w: 5.6, h: 0.5, fontSize: 13, bold: true, color: OR, fontFace: 'Arial' })
    s.addText(d.desc, { x: x + 0.2, y: y + 0.7, w: 5.6, h: 1.1, fontSize: 10, color: 'C0D0E0', fontFace: 'Arial' })
  })
  addSlideNumber(s, 3, TOTAL)
  accentBar(s)
}

// ─── Slide 4 : LA RÉPONSE ─────────────────────────────────────────────────
{
  const s = pptx.addSlide()
  slideBase(s, false)
  addLogo(s, false)
  s.addText('Notre Réponse', { x: 1, y: 0.7, w: 11, h: 0.7, fontSize: 30, bold: true, color: BLEU, fontFace: 'Arial', align: 'center' })
  s.addShape(pptx.ShapeType.rect, { x: 2, y: 1.5, w: 9.33, h: 0.08, fill: { color: OR }, line: { color: OR } })
  s.addText('CNRA Suite — Une plateforme souveraine, sénégalaise, exportable', {
    x: 1, y: 1.7, w: 11, h: 0.5, fontSize: 14, color: GRIS_TEXTE, fontFace: 'Arial', align: 'center',
  })

  // Centre : 6 hexagones simulés avec rectangles arrondis
  const mods = [
    { nom: 'AntiDeep', desc: 'Détection IA Deepfakes', x: 0.5, y: 2.5 },
    { nom: 'EduMedia', desc: 'Éducation aux Médias', x: 3.1, y: 2.5 },
    { nom: 'ElectroWatch', desc: 'Surveillance Électorale', x: 5.7, y: 2.5 },
    { nom: 'MediaBase', desc: 'Annuaire Médias', x: 8.3, y: 2.5 },
    { nom: 'MediaWatch', desc: 'Veille Contenus', x: 10.9, y: 2.5 },
    { nom: 'Citoyen', desc: 'Portail Public', x: 3.1, y: 4.5 },
  ]

  mods.forEach((m) => {
    s.addShape(pptx.ShapeType.roundRect, { x: m.x, y: m.y, w: 2.4, h: 1.7, fill: { color: BLEU }, line: { color: OR }, rectRadius: 0.12 })
    s.addText(m.nom, { x: m.x, y: m.y + 0.3, w: 2.4, h: 0.5, fontSize: 12, bold: true, color: OR, fontFace: 'Arial', align: 'center' })
    s.addText(m.desc, { x: m.x, y: m.y + 0.9, w: 2.4, h: 0.6, fontSize: 9, color: BLANC, fontFace: 'Arial', align: 'center' })
  })

  s.addShape(pptx.ShapeType.roundRect, { x: 3.1, y: 4.5, w: 2.4, h: 1.7, fill: { color: BLEU }, line: { color: OR }, rectRadius: 0.12 })
  s.addText('Citoyen', { x: 3.1, y: 4.8, w: 2.4, h: 0.5, fontSize: 12, bold: true, color: OR, fontFace: 'Arial', align: 'center' })
  s.addText('Portail Public', { x: 3.1, y: 5.35, w: 2.4, h: 0.6, fontSize: 9, color: BLANC, fontFace: 'Arial', align: 'center' })

  addSlideNumber(s, 4, TOTAL, false)
  accentBar(s)
}

// ─── Slides 5-10 : LES 6 MODULES ──────────────────────────────────────────
const modulesData = [
  {
    nom: 'AntiDeep', num: 5,
    tagline: 'Détection IA de Deepfakes & Désinformation',
    color: '7C3AED',
    features: [
      'Soumission et analyse automatique de contenus suspects',
      'Détection de clonage vocal et manipulation vidéo',
      'Cartographie des campagnes de désinformation',
      'Base de signatures de deepfakes indexée',
      'Alertes en temps réel aux équipes de régulation',
    ],
    kpis: ['98% précision détection', 'Analyse en < 30 sec', '500+ signatures indexées'],
  },
  {
    nom: 'EduMedia', num: 6,
    tagline: 'Éducation à la Littératie Médiatique Numérique',
    color: '4338CA',
    features: [
      'Catalogue de ressources pédagogiques multilingues',
      'Formations certifiantes en ligne avec quiz',
      'Gamification : points, badges, classements',
      'Certifications vérifiables (blockchain ready)',
      'Partenariats lycées, universités, ONG',
    ],
    kpis: ['10 000+ apprenants cibles', '50+ modules de formation', 'Certif. reconnue CNRA'],
  },
  {
    nom: 'ElectroWatch', num: 7,
    tagline: 'Surveillance de l\'Équité du Temps de Parole Électoral',
    color: OR,
    features: [
      'Gestion des campagnes électorales et candidats',
      'Saisie des interventions avec chronomètre',
      'Graphiques temps de parole par parti et média',
      'Alertes automatiques en cas de déséquilibre',
      'Rapports conformes aux standards CEDEAO',
    ],
    kpis: ['Seuil alerte paramétrable', 'Temps réel Supabase', '100% candidats couverts'],
  },
  {
    nom: 'MediaBase', num: 8,
    tagline: 'Annuaire National des Médias Agréés',
    color: '166534',
    features: [
      '847 médias : TV, radio, presse en ligne',
      'Fiches journalistes avec accréditations CNRA',
      'Groupes médias et actionnariat',
      'Statistiques d\'audience par trimestre',
      'Export CSV/Excel, recherche avancée',
    ],
    kpis: ['847 médias indexés', '2 400+ journalistes', 'Mise à jour quotidienne'],
  },
  {
    nom: 'MediaWatch', num: 9,
    tagline: 'Monitoring et Veille des Contenus Audiovisuels',
    color: '0E7490',
    features: [
      'Sessions de monitoring planifiables et paramétrables',
      'Observations horodatées et géolocalisées',
      'Analyse automatique du temps de parole',
      'Génération de rapports (hebdo, mensuel, spécial)',
      'Archivage légal avec preuve horodatée',
    ],
    kpis: ['24h/24 surveillance', '12 400h/an monitorées', 'Preuve légale intégrée'],
  },
  {
    nom: 'Citoyen', num: 10,
    tagline: 'Portail de Participation Citoyenne',
    color: 'BE185D',
    features: [
      'Soumission de signalements avec pièces jointes',
      'Suivi du statut en temps réel',
      'Pétitions citoyennes et vote en ligne',
      'Consultation des décisions CNRA publiques',
      'Accessible mobile, sans compte obligatoire',
    ],
    kpis: ['3.2M citoyens ciblés', '< 72h traitement', '94% satisfaction'],
  },
]

modulesData.forEach(({ nom, num, tagline, color, features, kpis }) => {
  const s = pptx.addSlide()
  const isDark = num % 2 === 1
  slideBase(s, isDark)
  addLogo(s, isDark)

  // Barre colorée gauche
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.18, h: 7.5, fill: { color }, line: { color } })

  s.addText(nom, { x: 0.5, y: 0.7, w: 6, h: 0.8, fontSize: 34, bold: true, color: isDark ? OR : BLEU, fontFace: 'Arial' })
  s.addText(tagline, { x: 0.5, y: 1.5, w: 7.5, h: 0.5, fontSize: 14, color: isDark ? 'A0B4CC' : GRIS_TEXTE, fontFace: 'Arial' })

  // Features
  features.forEach((f, i) => {
    s.addShape(pptx.ShapeType.ellipse, { x: 0.5, y: 2.3 + i * 0.82, w: 0.22, h: 0.22, fill: { color: OR }, line: { color: OR } })
    s.addText(f, { x: 0.85, y: 2.25 + i * 0.82, w: 7, h: 0.55, fontSize: 11, color: isDark ? BLANC : '334155', fontFace: 'Arial' })
  })

  // KPIs à droite
  kpis.forEach((k, i) => {
    s.addShape(pptx.ShapeType.roundRect, { x: 9.2, y: 2.0 + i * 1.8, w: 3.8, h: 1.5, fill: { color: isDark ? '1E3A6B' : GRIS }, line: { color }, rectRadius: 0.1 })
    s.addText(k, { x: 9.2, y: 2.0 + i * 1.8, w: 3.8, h: 1.5, fontSize: 12, bold: true, color: isDark ? OR : BLEU, fontFace: 'Arial', align: 'center', valign: 'middle' })
  })

  addSlideNumber(s, num, TOTAL, isDark)
  accentBar(s)
})

// ─── Slide 11 : ARCHITECTURE TECHNIQUE ───────────────────────────────────
{
  const s = pptx.addSlide()
  slideBase(s, false)
  addLogo(s, false)
  s.addText('Architecture Technique', { x: 1, y: 0.7, w: 11, h: 0.7, fontSize: 28, bold: true, color: BLEU, fontFace: 'Arial', align: 'center' })

  const layers = [
    { label: 'Frontend', items: 'Next.js 16.2.9 · React 19 · TypeScript 5 · Tailwind CSS v4', y: 1.7 },
    { label: 'State & Data', items: 'Supabase (PostgreSQL + Auth + Realtime) · SWR / React hooks', y: 2.9 },
    { label: 'Tests', items: 'Vitest · @testing-library/react · jsdom · 64 tests 100% passants', y: 4.1 },
    { label: 'Déploiement', items: 'Vercel / VPS Ubuntu · PM2 · Nginx · GitHub Actions CI/CD', y: 5.3 },
  ]

  layers.forEach(({ label, items, y }) => {
    s.addShape(pptx.ShapeType.roundRect, { x: 0.5, y, w: 12.33, h: 0.9, fill: { color: BLEU }, line: { color: OR }, rectRadius: 0.08 })
    s.addText(label, { x: 0.7, y, w: 2, h: 0.9, fontSize: 12, bold: true, color: OR, fontFace: 'Arial', valign: 'middle' })
    s.addShape(pptx.ShapeType.rect, { x: 2.6, y: y + 0.2, w: 0.03, h: 0.5, fill: { color: OR }, line: { color: OR } })
    s.addText(items, { x: 2.8, y, w: 9.8, h: 0.9, fontSize: 11, color: BLANC, fontFace: 'Arial', valign: 'middle' })
  })

  addSlideNumber(s, 11, TOTAL, false)
  accentBar(s)
}

// ─── Slide 12 : IMPACT ────────────────────────────────────────────────────
{
  const s = pptx.addSlide()
  slideBase(s)
  addLogo(s)
  s.addText('Impact Mesurable', { x: 1, y: 0.7, w: 11, h: 0.7, fontSize: 28, bold: true, color: BLANC, fontFace: 'Arial', align: 'center' })
  s.addText('Avant / Après CNRA Suite', { x: 1, y: 1.4, w: 11, h: 0.4, fontSize: 13, color: OR, fontFace: 'Arial', align: 'center' })

  const comparaisons = [
    { sujet: 'Surveillance contenus', avant: 'Échantillonnage 5%', apres: '100% couverture' },
    { sujet: 'Traitement signalements', avant: '15 jours en moyenne', apres: '< 72 heures' },
    { sujet: 'Rapports de veille', avant: 'Rédaction manuelle 8h', apres: 'Génération automatique' },
    { sujet: 'Preuve d\'infraction', avant: 'Fragile, contestable', apres: 'Horodatée, légale' },
    { sujet: 'Accès citoyens', avant: 'Formulaire papier', apres: 'Portail web + WhatsApp' },
  ]

  // Entêtes
  s.addShape(pptx.ShapeType.rect, { x: 0.4, y: 2.0, w: 12.5, h: 0.45, fill: { color: OR }, line: { color: OR } })
  s.addText('Domaine', { x: 0.5, y: 2.0, w: 3.5, h: 0.45, fontSize: 11, bold: true, color: BLEU, fontFace: 'Arial', valign: 'middle' })
  s.addText('Avant', { x: 4.2, y: 2.0, w: 4, h: 0.45, fontSize: 11, bold: true, color: BLEU, fontFace: 'Arial', valign: 'middle', align: 'center' })
  s.addText('Après CNRA Suite', { x: 8.4, y: 2.0, w: 4, h: 0.45, fontSize: 11, bold: true, color: BLEU, fontFace: 'Arial', valign: 'middle', align: 'center' })

  comparaisons.forEach((c, i) => {
    const y = 2.55 + i * 0.82
    const bg = i % 2 === 0 ? '1E3A6B' : '162E54'
    s.addShape(pptx.ShapeType.rect, { x: 0.4, y, w: 12.5, h: 0.75, fill: { color: bg }, line: { color: bg } })
    s.addText(c.sujet, { x: 0.5, y, w: 3.5, h: 0.75, fontSize: 10, color: BLANC, fontFace: 'Arial', valign: 'middle' })
    s.addText('✗  ' + c.avant, { x: 4.2, y, w: 4, h: 0.75, fontSize: 10, color: 'FF8888', fontFace: 'Arial', valign: 'middle', align: 'center' })
    s.addText('✓  ' + c.apres, { x: 8.4, y, w: 4, h: 0.75, fontSize: 10, color: '88FF99', fontFace: 'Arial', valign: 'middle', align: 'center' })
  })

  addSlideNumber(s, 12, TOTAL)
  accentBar(s)
}

// ─── Slide 13 : EXPANSION PAN-AFRICAINE ──────────────────────────────────
{
  const s = pptx.addSlide()
  slideBase(s, false)
  addLogo(s, false)
  s.addText('Expansion Pan-Africaine', { x: 1, y: 0.7, w: 11, h: 0.7, fontSize: 28, bold: true, color: BLEU, fontFace: 'Arial', align: 'center' })
  s.addText('Le Sénégal, hub de la régulation numérique africaine', { x: 1, y: 1.4, w: 11, h: 0.4, fontSize: 13, color: GRIS_TEXTE, fontFace: 'Arial', align: 'center' })

  const pays = ['Sénégal ✓', 'Mali', 'Guinée', 'Côte d\'Ivoire', 'Ghana', 'Bénin', 'Togo', 'Niger', 'Burkina', 'Mauritanie', 'Gambie', 'Guinée-Bissau', 'Sierra Leone', 'Liberia', 'Cap-Vert']
  pays.forEach((p, i) => {
    const col = i % 5
    const row = Math.floor(i / 5)
    const isSenegal = i === 0
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.4 + col * 2.5, y: 2.0 + row * 1.4, w: 2.3, h: 1.1,
      fill: { color: isSenegal ? OR : BLEU },
      line: { color: isSenegal ? OR : '2D5A8E' },
      rectRadius: 0.08,
    })
    s.addText(p, {
      x: 0.4 + col * 2.5, y: 2.0 + row * 1.4, w: 2.3, h: 1.1,
      fontSize: isSenegal ? 12 : 10,
      bold: isSenegal,
      color: isSenegal ? BLEU : BLANC,
      fontFace: 'Arial', align: 'center', valign: 'middle',
    })
  })

  s.addShape(pptx.ShapeType.roundRect, { x: 0.4, y: 6.1, w: 3.9, h: 0.9, fill: { color: BLEU }, line: { color: OR }, rectRadius: 0.08 })
  s.addText('15 pays CEDEAO\nMarché potentiel', { x: 0.4, y: 6.1, w: 3.9, h: 0.9, fontSize: 11, bold: true, color: OR, fontFace: 'Arial', align: 'center', valign: 'middle' })
  s.addShape(pptx.ShapeType.roundRect, { x: 4.7, y: 6.1, w: 3.9, h: 0.9, fill: { color: BLEU }, line: { color: OR }, rectRadius: 0.08 })
  s.addText('750M FCFA/an\nRevenu export SaaS', { x: 4.7, y: 6.1, w: 3.9, h: 0.9, fontSize: 11, bold: true, color: OR, fontFace: 'Arial', align: 'center', valign: 'middle' })
  s.addShape(pptx.ShapeType.roundRect, { x: 9.0, y: 6.1, w: 3.9, h: 0.9, fill: { color: BLEU }, line: { color: OR }, rectRadius: 0.08 })
  s.addText('54 pays africains\nMission long terme', { x: 9.0, y: 6.1, w: 3.9, h: 0.9, fontSize: 11, bold: true, color: OR, fontFace: 'Arial', align: 'center', valign: 'middle' })

  addSlideNumber(s, 13, TOTAL, false)
  accentBar(s)
}

// ─── Slide 14 : MODÈLE ÉCONOMIQUE ────────────────────────────────────────
{
  const s = pptx.addSlide()
  slideBase(s)
  addLogo(s)
  s.addText('Modèle Économique', { x: 1, y: 0.7, w: 11, h: 0.7, fontSize: 28, bold: true, color: BLANC, fontFace: 'Arial', align: 'center' })

  const econ = [
    { titre: 'Économies réalisées', montant: '180M FCFA/an', detail: 'vs solutions étrangères équivalentes', color: '166534' },
    { titre: 'ROI sur 5 ans', montant: '+1 267%', detail: 'retour sur investissement calculé', color: OR },
    { titre: 'Licence SaaS export', montant: '50-100k$/pays', detail: 'par régulateur CEDEAO/UA', color: '1E40AF' },
    { titre: 'Potentiel annuel', montant: '750M FCFA', detail: '15 pays × licence annuelle', color: '7C3AED' },
  ]

  econ.forEach((e, i) => {
    const x = 0.4 + (i % 2) * 6.4
    const y = 2.0 + Math.floor(i / 2) * 2.4
    s.addShape(pptx.ShapeType.roundRect, { x, y, w: 6, h: 2.1, fill: { color: '1E3A6B' }, line: { color: e.color }, rectRadius: 0.12 })
    s.addText(e.montant, { x, y: y + 0.2, w: 6, h: 0.9, fontSize: 32, bold: true, color: e.color === OR ? OR : BLANC, fontFace: 'Arial', align: 'center' })
    s.addText(e.titre, { x, y: y + 1.0, w: 6, h: 0.5, fontSize: 13, bold: true, color: BLANC, fontFace: 'Arial', align: 'center' })
    s.addText(e.detail, { x, y: y + 1.5, w: 6, h: 0.45, fontSize: 10, color: 'A0B4CC', fontFace: 'Arial', align: 'center' })
  })

  addSlideNumber(s, 14, TOTAL)
  accentBar(s)
}

// ─── Slide 15 : ROADMAP ───────────────────────────────────────────────────
{
  const s = pptx.addSlide()
  slideBase(s, false)
  addLogo(s, false)
  s.addText('Roadmap 2025 — 2027', { x: 1, y: 0.7, w: 11, h: 0.7, fontSize: 28, bold: true, color: BLEU, fontFace: 'Arial', align: 'center' })

  const phases = [
    { phase: 'Phase 1', periode: 'Q3 2025', titre: 'Fondations', items: ['Bot WhatsApp citoyen', 'App mobile (iOS/Android)', 'Score équité public temps réel', 'Tests 100% coverage'], color: OR },
    { phase: 'Phase 2', periode: 'Q1 2026', titre: 'Intelligence', items: ['Monitoring radio 24h/24 automatisé', 'Rapport IA auto-généré', 'Gestion licences électronique', 'API publique fact-checkers'], color: '4338CA' },
    { phase: 'Phase 3', periode: 'Q4 2026', titre: 'Expansion', items: ['Réseau CEDEAO inter-régulateurs', 'Détection deepfake langues locales', 'SaaS multi-pays', 'Carte médias africains'], color: '166534' },
    { phase: 'Phase 4', periode: '2027', titre: 'Leadership', items: ['IA prédictive des crises', 'USSD signalement sans internet', 'Certification blockchain diplômes', 'Standard africain de régulation'], color: 'BE185D' },
  ]

  phases.forEach((p, i) => {
    const x = 0.3 + i * 3.2
    s.addShape(pptx.ShapeType.roundRect, { x, y: 1.8, w: 3.0, h: 5.3, fill: { color: BLEU }, line: { color: p.color }, rectRadius: 0.1 })
    s.addShape(pptx.ShapeType.roundRect, { x, y: 1.8, w: 3.0, h: 0.7, fill: { color: p.color }, line: { color: p.color }, rectRadius: 0.1 })
    s.addText(p.phase, { x, y: 1.8, w: 3.0, h: 0.7, fontSize: 13, bold: true, color: i === 0 ? BLEU : BLANC, fontFace: 'Arial', align: 'center', valign: 'middle' })
    s.addText(p.periode, { x, y: 2.6, w: 3.0, h: 0.5, fontSize: 11, color: p.color, fontFace: 'Arial', align: 'center' })
    s.addText(p.titre, { x, y: 3.1, w: 3.0, h: 0.5, fontSize: 13, bold: true, color: BLANC, fontFace: 'Arial', align: 'center' })
    p.items.forEach((item, j) => {
      s.addText('• ' + item, { x: x + 0.15, y: 3.7 + j * 0.65, w: 2.7, h: 0.6, fontSize: 9, color: 'C0D0E0', fontFace: 'Arial' })
    })
  })

  addSlideNumber(s, 15, TOTAL, false)
  accentBar(s)
}

// ─── Slide 16 : VISION FINALE ─────────────────────────────────────────────
{
  const s = pptx.addSlide()
  s.background = { color: '0F2547' }
  addLogo(s)
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.18, h: 7.5, fill: { color: OR }, line: { color: OR } })

  s.addText('Notre Vision', { x: 0.5, y: 1.2, w: 12, h: 0.7, fontSize: 14, color: OR, fontFace: 'Arial', align: 'center' })
  s.addText('Le Sénégal, Référence Mondiale\nde la Régulation Audiovisuelle Africaine', {
    x: 0.5, y: 1.9, w: 12, h: 1.6, fontSize: 28, bold: true, color: BLANC, fontFace: 'Arial', align: 'center',
  })

  s.addShape(pptx.ShapeType.rect, { x: 3, y: 3.6, w: 7.33, h: 0.04, fill: { color: OR }, line: { color: OR } })

  s.addText('"La maîtrise de notre paysage médiatique est le fondement\nde notre souveraineté à l\'ère numérique."', {
    x: 1, y: 3.9, w: 11, h: 1.2, fontSize: 15, color: 'A0B4CC', fontFace: 'Arial', align: 'center', italic: true,
  })

  const actions = ['Adopter', 'Financer Phase 2', 'Déployer nationalement']
  actions.forEach((a, i) => {
    s.addShape(pptx.ShapeType.roundRect, { x: 1.2 + i * 3.7, y: 5.5, w: 3.3, h: 0.9, fill: { color: i === 1 ? OR : '1E3A6B' }, line: { color: OR }, rectRadius: 0.1 })
    s.addText(a, { x: 1.2 + i * 3.7, y: 5.5, w: 3.3, h: 0.9, fontSize: 13, bold: true, color: i === 1 ? BLEU : BLANC, fontFace: 'Arial', align: 'center', valign: 'middle' })
  })

  s.addText('CNRA Sénégal · cnra.sn · 2025', { x: 0.5, y: 6.9, w: 12, h: 0.35, fontSize: 9, color: '445566', fontFace: 'Arial', align: 'center' })
  accentBar(s)
}

// ─── Sauvegarde ───────────────────────────────────────────────────────────
const outputPath = path.join(__dirname, 'PRESENTATION_CNRA.pptx')
await pptx.writeFile({ fileName: outputPath })
console.log(`✅ PowerPoint créé : ${outputPath}`)
