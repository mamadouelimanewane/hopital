// Données de démonstration — Pharmacie de l'Hôpital Ndamatou de Touba
// Ces données sont statiques et servent à illustrer le fonctionnement de l'application.

export interface Medicament {
  id: string
  nom: string
  dci: string // Dénomination Commune Internationale (nom générique)
  categorie: string
  stock: number
  seuilMin: number
  datePeremption: string
  hashBlockchain: string
  unite: string
}

export interface MouvementStock {
  id: string
  medicamentNom: string
  type: "Entrée" | "Sortie"
  quantite: number
  date: string
  motif: string
}

export interface Ordonnance {
  id: string
  patientNom: string
  medecinNom: string
  medicaments: string[]
  statut: "En attente" | "Délivrée"
  date: string
}

function fakeHash(seed: string): string {
  let h1 = 0xdeadbeef
  let h2 = 0x41c6ce57
  for (let i = 0; i < seed.length; i++) {
    const ch = seed.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = (h1 ^ (h1 >>> 16)) >>> 0
  h2 = (h2 ^ (h2 >>> 16)) >>> 0
  const hex = (h1.toString(16).padStart(8, "0") + h2.toString(16).padStart(8, "0")).repeat(4)
  return "0x" + hex.slice(0, 64)
}

export const MEDICAMENTS: Medicament[] = [
  { id: "MED-001", nom: "Doliprane 1000mg", dci: "Paracétamol", categorie: "Antalgique", stock: 1240, seuilMin: 300, datePeremption: "2027-03-15", hashBlockchain: fakeHash("MED-001"), unite: "comprimés" },
  { id: "MED-002", nom: "Amoxicilline 500mg", dci: "Amoxicilline", categorie: "Antibiotique", stock: 85, seuilMin: 150, datePeremption: "2026-11-02", hashBlockchain: fakeHash("MED-002"), unite: "gélules" },
  { id: "MED-003", nom: "Coartem", dci: "Artéméther/Luméfantrine", categorie: "Antipaludique", stock: 420, seuilMin: 200, datePeremption: "2026-09-20", hashBlockchain: fakeHash("MED-003"), unite: "boîtes" },
  { id: "MED-004", nom: "Ventoline", dci: "Salbutamol", categorie: "Bronchodilatateur", stock: 60, seuilMin: 80, datePeremption: "2026-08-05", hashBlockchain: fakeHash("MED-004"), unite: "flacons" },
  { id: "MED-005", nom: "Insuline Mixtard", dci: "Insuline humaine", categorie: "Antidiabétique", stock: 145, seuilMin: 100, datePeremption: "2026-07-18", hashBlockchain: fakeHash("MED-005"), unite: "flacons" },
  { id: "MED-006", nom: "Metformine 500mg", dci: "Metformine", categorie: "Antidiabétique", stock: 610, seuilMin: 250, datePeremption: "2027-01-10", hashBlockchain: fakeHash("MED-006"), unite: "comprimés" },
  { id: "MED-007", nom: "Oxytocine", dci: "Oxytocine", categorie: "Utérotonique", stock: 38, seuilMin: 50, datePeremption: "2026-07-25", hashBlockchain: fakeHash("MED-007"), unite: "ampoules" },
  { id: "MED-008", nom: "Sérum Salé 0,9%", dci: "Chlorure de sodium", categorie: "Solution IV", stock: 980, seuilMin: 400, datePeremption: "2027-05-30", hashBlockchain: fakeHash("MED-008"), unite: "poches" },
  { id: "MED-009", nom: "Diazépam 10mg", dci: "Diazépam", categorie: "Anxiolytique", stock: 96, seuilMin: 60, datePeremption: "2026-12-12", hashBlockchain: fakeHash("MED-009"), unite: "ampoules" },
  { id: "MED-010", nom: "Ceftriaxone 1g", dci: "Ceftriaxone", categorie: "Antibiotique", stock: 54, seuilMin: 100, datePeremption: "2026-07-10", hashBlockchain: fakeHash("MED-010"), unite: "flacons" },
  { id: "MED-011", nom: "Fer + Acide folique", dci: "Sulfate ferreux", categorie: "Supplément", stock: 720, seuilMin: 300, datePeremption: "2027-02-28", hashBlockchain: fakeHash("MED-011"), unite: "comprimés" },
  { id: "MED-012", nom: "Adrénaline 1mg/ml", dci: "Épinéphrine", categorie: "Urgence", stock: 22, seuilMin: 40, datePeremption: "2026-07-08", hashBlockchain: fakeHash("MED-012"), unite: "ampoules" },
]

export const MOUVEMENTS_STOCK: MouvementStock[] = [
  { id: "MVT-001", medicamentNom: "Doliprane 1000mg", type: "Entrée", quantite: 500, date: "2026-07-01", motif: "Livraison fournisseur Sénégal Pharma" },
  { id: "MVT-002", medicamentNom: "Amoxicilline 500mg", type: "Sortie", quantite: 40, date: "2026-07-01", motif: "Dispensation service pédiatrie" },
  { id: "MVT-003", medicamentNom: "Coartem", type: "Sortie", quantite: 25, date: "2026-07-01", motif: "Dispensation urgences" },
  { id: "MVT-004", medicamentNom: "Oxytocine", type: "Sortie", quantite: 6, date: "2026-06-30", motif: "Bloc maternité" },
  { id: "MVT-005", medicamentNom: "Sérum Salé 0,9%", type: "Entrée", quantite: 200, date: "2026-06-30", motif: "Livraison PNA (Pharmacie Nationale d'Approvisionnement)" },
  { id: "MVT-006", medicamentNom: "Ceftriaxone 1g", type: "Sortie", quantite: 18, date: "2026-06-29", motif: "Dispensation service chirurgie" },
  { id: "MVT-007", medicamentNom: "Insuline Mixtard", type: "Entrée", quantite: 60, date: "2026-06-29", motif: "Livraison fournisseur Sénégal Pharma" },
  { id: "MVT-008", medicamentNom: "Ventoline", type: "Sortie", quantite: 12, date: "2026-06-28", motif: "Dispensation service pneumologie" },
  { id: "MVT-009", medicamentNom: "Adrénaline 1mg/ml", type: "Sortie", quantite: 4, date: "2026-06-28", motif: "Stock chariot d'urgence" },
  { id: "MVT-010", medicamentNom: "Metformine 500mg", type: "Entrée", quantite: 300, date: "2026-06-27", motif: "Livraison PNA" },
  { id: "MVT-011", medicamentNom: "Diazépam 10mg", type: "Sortie", quantite: 10, date: "2026-06-27", motif: "Dispensation service psychiatrie" },
  { id: "MVT-012", medicamentNom: "Fer + Acide folique", type: "Sortie", quantite: 80, date: "2026-06-26", motif: "Dispensation consultation prénatale" },
]

export const ORDONNANCES: Ordonnance[] = [
  { id: "ORD-1042", patientNom: "Awa Ndiaye", medecinNom: "Dr. Cheikh Fall", medicaments: ["Doliprane 1000mg", "Amoxicilline 500mg"], statut: "Délivrée", date: "2026-07-02" },
  { id: "ORD-1043", patientNom: "Moussa Diop", medecinNom: "Dr. Fatou Sarr", medicaments: ["Coartem"], statut: "En attente", date: "2026-07-02" },
  { id: "ORD-1044", patientNom: "Ibrahima Mbaye", medecinNom: "Dr. Cheikh Fall", medicaments: ["Metformine 500mg", "Fer + Acide folique"], statut: "En attente", date: "2026-07-02" },
  { id: "ORD-1045", patientNom: "Fatoumata Ba", medecinNom: "Dr. Aïssatou Diallo", medicaments: ["Ventoline"], statut: "Délivrée", date: "2026-07-01" },
  { id: "ORD-1046", patientNom: "Ousmane Sy", medecinNom: "Dr. Modou Gueye", medicaments: ["Ceftriaxone 1g", "Sérum Salé 0,9%"], statut: "Délivrée", date: "2026-07-01" },
  { id: "ORD-1047", patientNom: "Mariama Diallo", medecinNom: "Dr. Fatou Sarr", medicaments: ["Insuline Mixtard"], statut: "En attente", date: "2026-07-01" },
  { id: "ORD-1048", patientNom: "Abdou Kane", medecinNom: "Dr. Modou Gueye", medicaments: ["Diazépam 10mg"], statut: "Délivrée", date: "2026-06-30" },
  { id: "ORD-1049", patientNom: "Astou Sow", medecinNom: "Dr. Aïssatou Diallo", medicaments: ["Oxytocine", "Sérum Salé 0,9%"], statut: "Délivrée", date: "2026-06-30" },
  { id: "ORD-1050", patientNom: "Lamine Faye", medecinNom: "Dr. Cheikh Fall", medicaments: ["Doliprane 1000mg"], statut: "En attente", date: "2026-06-29" },
  { id: "ORD-1051", patientNom: "Bineta Cissé", medecinNom: "Dr. Fatou Sarr", medicaments: ["Adrénaline 1mg/ml"], statut: "Délivrée", date: "2026-06-29" },
]

// --- Fonctions utilitaires dérivées des données ci-dessus ---

export function medicamentsEnAlerteStock(): Medicament[] {
  return MEDICAMENTS.filter((m) => m.stock <= m.seuilMin)
}

export function medicamentsPeremptionProche(joursSeuil = 45): Medicament[] {
  const maintenant = new Date("2026-07-02").getTime()
  return MEDICAMENTS.filter((m) => {
    const diffJours = (new Date(m.datePeremption).getTime() - maintenant) / (1000 * 60 * 60 * 24)
    return diffJours <= joursSeuil
  })
}

export function repartitionParCategorie(): { categorie: string; count: number }[] {
  const map = new Map<string, number>()
  for (const m of MEDICAMENTS) {
    map.set(m.categorie, (map.get(m.categorie) ?? 0) + 1)
  }
  return Array.from(map.entries()).map(([categorie, count]) => ({ categorie, count }))
}
