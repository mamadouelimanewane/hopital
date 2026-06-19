import puppeteer from 'puppeteer'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const files = [
  {
    input: 'DOSSIER_COMMERCIAL.html',
    output: 'DOSSIER_COMMERCIAL_CNRA.pdf',
    label: 'Dossier Commercial',
    format: 'A4',
    landscape: false,
  },
  {
    input: 'PROSPECTUS_COMMERCIAL.html',
    output: 'PROSPECTUS_COMMERCIAL_CNRA.pdf',
    label: 'Prospectus Commercial',
    format: 'A4',
    landscape: false,
  },
  {
    input: 'PRESENTATION_CNRA.html',
    output: 'PRESENTATION_CNRA.pdf',
    label: 'Présentation PowerPoint',
    format: 'A4',
    landscape: true,
  },
]

async function generatePDFs() {
  console.log('🚀 Lancement de Puppeteer...')
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  for (const file of files) {
    const inputPath = path.join(__dirname, file.input)
    const outputPath = path.join(__dirname, file.output)

    if (!fs.existsSync(inputPath)) {
      console.error(`❌ Fichier introuvable: ${file.input}`)
      continue
    }

    console.log(`📄 Génération: ${file.label}...`)
    const page = await browser.newPage()

    await page.setViewport({
      width: file.landscape ? 1123 : 794,
      height: file.landscape ? 794 : 1123,
      deviceScaleFactor: 2,
    })

    await page.goto(`file:///${inputPath.replace(/\\/g, '/')}`, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    })

    // Attendre que les animations soient terminées
    await new Promise(r => setTimeout(r, 1500))

    await page.pdf({
      path: outputPath,
      format: file.format,
      landscape: file.landscape,
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    })

    const size = (fs.statSync(outputPath).size / 1024).toFixed(0)
    console.log(`   ✅ ${file.output} (${size} KB)`)
    await page.close()
  }

  await browser.close()
  console.log('\n🎉 Tous les PDFs générés dans C:\\gravity\\cnra-suite\\docs\\')
}

generatePDFs().catch(console.error)
