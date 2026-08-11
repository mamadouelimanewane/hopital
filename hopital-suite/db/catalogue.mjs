/* ════════════════════════════════════════════════════════════════
   Catalogue d'actes et grille tarifaire de départ.

   MONTANTS INDICATIFS, en francs CFA. Ils servent à faire tourner le
   socle de bout en bout. La grille officielle de l'établissement et
   les nomenclatures de la tutelle doivent être substituées avant
   toute mise en service.
   ════════════════════════════════════════════════════════════════ */

export const DATE_EFFET = "2026-01-01"

export const ACTES = [
  // ── Consultations ──
  ["CS-GEN",   "Consultation de médecine générale",        "consultation", "acte",    3000],
  ["CS-SPE",   "Consultation de spécialité",               "consultation", "acte",   10000],
  ["CS-ANEST", "Consultation d'anesthésie",                "consultation", "acte",   12000],
  ["CS-SUIVI", "Visite de surveillance hospitalière",      "consultation", "acte",    2500],

  // ── Forfaits d'entrée ──
  ["FRF-DOSSIER", "Frais d'ouverture de dossier",          "forfait", "acte",         1000],
  ["FRF-URG",     "Forfait de passage aux urgences",       "forfait", "acte",         5000],
  ["FRF-AMBU",    "Forfait de prise en charge ambulatoire","forfait", "acte",        25000],
  ["FRF-ACCOUCH", "Forfait accouchement simple",           "forfait", "acte",        50000],
  ["FRF-DIALYSE", "Forfait séance d'hémodialyse",          "forfait", "seance",      45000],

  // ── Hébergement ──
  ["HEB-COM",  "Journée en chambre commune",               "hebergement", "jour",     8000],
  ["HEB-PART", "Journée en chambre particulière",          "hebergement", "jour",    20000],
  ["HEB-REA",  "Journée en réanimation",                   "hebergement", "jour",    75000],

  // ── Biologie ──
  ["BIO-NFS",  "Numération formule sanguine",              "biologie", "acte",        5000],
  ["BIO-CRP",  "Protéine C réactive",                      "biologie", "acte",        6000],
  ["BIO-GLY",  "Glycémie à jeun",                          "biologie", "acte",        2000],
  ["BIO-CREAT","Créatininémie",                            "biologie", "acte",        3500],
  ["BIO-IONO", "Ionogramme sanguin",                       "biologie", "acte",        7000],
  ["BIO-TDR",  "Test de diagnostic rapide du paludisme",   "biologie", "acte",        2500],
  ["BIO-GE",   "Goutte épaisse",                           "biologie", "acte",        3000],
  ["BIO-GRP",  "Groupage sanguin ABO Rhésus",              "biologie", "acte",        6000],
  ["BIO-HB",   "Hémoglobine",                              "biologie", "acte",        2000],
  ["BIO-TRANS","Transaminases",                            "biologie", "acte",        8000],

  // ── Imagerie ──
  ["IMG-RXT",  "Radiographie thoracique",                  "imagerie", "acte",       12000],
  ["IMG-ECHO", "Échographie abdominale",                   "imagerie", "acte",       20000],
  ["IMG-SCAN", "Scanner sans injection",                   "imagerie", "acte",       75000],
  ["IMG-SCANI","Scanner avec injection",                   "imagerie", "acte",       95000],
  ["IMG-IRM",  "IRM",                                      "imagerie", "acte",      150000],
  ["IMG-MAMMO","Mammographie",                             "imagerie", "acte",       25000],
  ["PRD-CONTR","Produit de contraste iodé",                "produit", "flacon",     18000],

  // ── Bloc ──
  ["CHIR-APP", "Appendicectomie",                          "chirurgie", "acte",     150000],
  ["CHIR-CES", "Césarienne",                               "chirurgie", "acte",     200000],
  ["ANEST-GEN","Anesthésie générale",                      "anesthesie", "acte",     60000],
  ["BLOC-SALLE","Occupation de salle d'opération",         "forfait", "heure",       40000],

  // ── Médicaments (prix unitaire par prise) ──
  ["MED-PARA",  "Paracétamol 1 g",                         "produit", "prise",         300],
  ["MED-AMOX",  "Amoxicilline 1 g",                        "produit", "prise",         900],
  ["MED-CEFTRI","Ceftriaxone 1 g injectable",              "produit", "prise",        4500],
  ["MED-ARTE",  "Artésunate injectable",                   "produit", "prise",        6500],
  ["MED-OMEP",  "Oméprazole 20 mg",                        "produit", "prise",         450],
  ["MED-INSUL", "Insuline rapide (unité)",                 "produit", "prise",         120],
  ["MED-MORPH", "Morphine 10 mg injectable",               "produit", "prise",        2800],
  ["MED-SERUM", "Sérum physiologique 500 mL",              "produit", "poche",         800],

  // ── Produits et annexes ──
  ["PSL-CGR",  "Concentré de globules rouges",             "produit", "poche",       25000],
  ["TRP-AMB",  "Transport sanitaire",                      "transport", "course",    15000],
  ["MOR-CONS", "Conservation en chambre mortuaire",        "annexe", "jour",          5000],
]

/* Stock initial de la pharmacie. Quantités de départ pour faire
   tourner le circuit ; l'inventaire réel doit les remplacer. */
export const STOCK_INITIAL = [
  ["MED-PARA",   500, 100],
  ["MED-AMOX",   200,  50],
  ["MED-CEFTRI",  80,  20],
  ["MED-ARTE",    60,  15],
  ["MED-OMEP",   300,  60],
  ["MED-INSUL", 1000, 200],
  ["MED-MORPH",   40,  10],
  ["MED-SERUM",  150,  40],
]

/** Insère le catalogue et les tarifs. Idempotent. */
export async function chargerCatalogue(exec) {
  for (const [code, libelle, famille, unite] of ACTES) {
    await exec.query(
      `INSERT INTO catalogue_acte (code, libelle, famille, unite)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (code) DO UPDATE SET libelle = EXCLUDED.libelle`,
      [code, libelle, famille, unite],
    )
  }
  for (const [code, , , , montant] of ACTES) {
    const { rows } = await exec.query(
      `SELECT 1 FROM tarif WHERE code_acte = $1 AND date_effet = $2::date`,
      [code, DATE_EFFET],
    )
    if (rows.length === 0) {
      await exec.query(
        `INSERT INTO tarif (code_acte, montant, date_effet) VALUES ($1,$2,$3::date)`,
        [code, montant, DATE_EFFET],
      )
    }
  }
  for (const [code, quantite, seuil] of STOCK_INITIAL) {
    await exec.query(
      `INSERT INTO stock (code_acte, quantite, seuil_alerte)
       VALUES ($1,$2,$3)
       ON CONFLICT (code_acte) DO UPDATE
         SET quantite = EXCLUDED.quantite, seuil_alerte = EXCLUDED.seuil_alerte`,
      [code, quantite, seuil],
    )
  }
  return ACTES.length
}
