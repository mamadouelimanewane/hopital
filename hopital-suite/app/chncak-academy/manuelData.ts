export type CategorieId = "clinique" | "admin" | "evenementiel" | "ia"

export const categories: Record<CategorieId, { label: string; couleur: string }> = {
  clinique:     { label: "Soins & Gestion Clinique",            couleur: "#2563eb" },
  admin:        { label: "Administration, Qualité & Réseaux",   couleur: "#22c55e" },
  evenementiel: { label: "Événementiel, Mobilité & Durabilité", couleur: "#f59e0b" },
  ia:           { label: "Intelligence Artificielle & Formation", couleur: "#a78bfa" },
}

export interface ManuelApp {
  id: string
  nom: string
  route: string
  icone: string
  categorie: CategorieId
  objectif: string
  roles: string[]
  fonctionnalites: string[]
  guide: string[]
  conseils: string[]
}

export const manuelApps: ManuelApp[] = [
  // ---------- A. Soins & Gestion Clinique ----------
  {
    id: "connect", nom: "Ndamatou Connect", route: "/connect", icone: "🏥", categorie: "clinique",
    objectif: "Portail central du patient : prise de rendez-vous, résultats, téléconsultation et paiement en ligne.",
    roles: ["Patient", "Secrétariat médical", "Médecin"],
    fonctionnalites: ["Prise de rendez-vous en ligne", "Consultation des résultats d'analyses et de radiologie", "Téléconsultation vidéo", "Paiement des factures en ligne", "Bascule Français / Wolof"],
    guide: [
      "Se connecter avec son compte patient (ou en créer un depuis l'accueil).",
      "Choisir « Prise de RDV », sélectionner le service et le médecin souhaité.",
      "Confirmer le créneau ; une notification de rappel est envoyée avant la consultation.",
      "Consulter l'onglet « Résultats » dès qu'un examen est disponible.",
      "Pour une téléconsultation, cliquer sur « Rejoindre » à l'heure du rendez-vous.",
    ],
    conseils: ["Vérifier la couverture d'assurance avant de valider un paiement.", "Utiliser la bascule Wolof pour les patients peu à l'aise en français."],
  },
  {
    id: "pharma", nom: "SmartPharma", route: "/pharma", icone: "💊", categorie: "clinique",
    objectif: "Gérer les stocks de la pharmacie hospitalière et la traçabilité des ordonnances numérisées.",
    roles: ["Pharmacien", "Préparateur", "Gestionnaire de stock"],
    fonctionnalites: ["Suivi des stocks en temps réel", "Alertes de rupture / péremption", "Ordonnances numérisées", "Traçabilité des dispensations"],
    guide: [
      "Consulter le tableau de bord pour repérer les alertes de stock bas.",
      "Scanner ou saisir l'ordonnance reçue du service prescripteur.",
      "Valider la dispensation ; le stock se met à jour automatiquement.",
      "Passer une commande de réapprovisionnement depuis la fiche produit si le seuil est atteint.",
    ],
    conseils: ["Traiter les alertes de péremption chaque matin en priorité.", "Toujours vérifier la correspondance patient/ordonnance avant dispensation."],
  },
  {
    id: "blood", nom: "BloodSync", route: "/blood", icone: "🩸", categorie: "clinique",
    objectif: "Piloter la banque de sang : inventaire par groupe sanguin, appels aux dons, gestion des urgences.",
    roles: ["Biologiste", "Technicien de banque de sang", "Coordinateur urgences"],
    fonctionnalites: ["Inventaire en temps réel par groupe sanguin", "Déclenchement d'appel aux dons", "Réservation de poches pour intervention programmée", "Alertes de pénurie critique"],
    guide: [
      "Vérifier le niveau de stock par groupe sanguin sur le tableau de bord.",
      "En cas de pénurie, déclencher une campagne d'appel aux dons depuis le module.",
      "Réserver les poches nécessaires pour une intervention chirurgicale planifiée.",
      "Enregistrer chaque entrée/sortie de poche pour garder l'inventaire à jour.",
    ],
    conseils: ["Anticiper les besoins avant les périodes à forte affluence (Magal, fêtes).", "Prioriser les groupes rares (O négatif) dans les campagnes de don."],
  },
  {
    id: "ambu", nom: "AmbuTrack", route: "/ambu", icone: "🚑", categorie: "clinique",
    objectif: "Suivre et coordonner la flotte d'ambulances en temps réel (géolocalisation, régulation).",
    roles: ["Régulateur", "Chauffeur ambulancier", "Chef de service urgences"],
    fonctionnalites: ["Géolocalisation GPS des véhicules", "Affectation de mission à l'ambulance la plus proche", "Suivi du temps de trajet estimé", "Historique des interventions"],
    guide: [
      "Recevoir l'appel d'urgence et créer une mission dans le module.",
      "Le système propose l'ambulance disponible la plus proche ; valider l'affectation.",
      "Suivre le trajet en direct jusqu'à l'arrivée sur site puis au retour à l'hôpital.",
      "Clôturer la mission et renseigner le compte-rendu d'intervention.",
    ],
    conseils: ["Garder le statut des véhicules à jour (disponible / en mission / maintenance).", "Prioriser les missions vitales en cas de conflit de disponibilité."],
  },
  {
    id: "lab-connect", nom: "Lab Connect", route: "/lab-connect", icone: "🧪", categorie: "clinique",
    objectif: "Centraliser les résultats de laboratoire et leur transmission en temps réel aux services prescripteurs.",
    roles: ["Technicien de laboratoire", "Biologiste", "Médecin prescripteur"],
    fonctionnalites: ["Réception des demandes d'analyses", "Saisie et validation des résultats", "Notification automatique au service prescripteur", "Recherche patient / type d'examen"],
    guide: [
      "Ouvrir la demande d'analyse reçue depuis le service clinique.",
      "Saisir les résultats une fois l'analyse réalisée.",
      "Faire valider les résultats par le biologiste responsable.",
      "Le service prescripteur est notifié automatiquement dès la validation.",
    ],
    conseils: ["Signaler immédiatement toute valeur critique en dehors de la validation standard.", "Utiliser la recherche pour retrouver rapidement l'historique d'un patient."],
  },
  {
    id: "smart-beds", nom: "Smart Beds", route: "/smart-beds", icone: "🛏️", categorie: "clinique",
    objectif: "Visualiser et optimiser l'occupation des lits sur l'ensemble des services de l'hôpital.",
    roles: ["Cadre de santé", "Bed manager", "Direction des soins"],
    fonctionnalites: ["Vue en temps réel des lits par service", "Filtres par disponibilité / service", "Prédiction d'occupation à court terme", "Alerte de saturation"],
    guide: [
      "Consulter la vue d'ensemble pour repérer les services proches de la saturation.",
      "Filtrer par service pour affecter un lit disponible à un nouveau patient.",
      "Mettre à jour le statut du lit (occupé / à nettoyer / disponible) après chaque mouvement.",
      "Surveiller les prédictions d'occupation pour anticiper les transferts.",
    ],
    conseils: ["Mettre à jour le statut du lit immédiatement après la sortie du patient pour fiabiliser les prédictions."],
  },
  {
    id: "factu-care", nom: "FactuCare", route: "/factu-care", icone: "💳", categorie: "clinique",
    objectif: "Gérer la facturation, la prise en charge par les assurances (CMU, IPM…) et le recouvrement.",
    roles: ["Agent de facturation", "Responsable recouvrement", "Direction financière"],
    fonctionnalites: ["Émission de factures avec calcul automatique de la couverture assurance", "Suivi des remboursements", "Statistiques de recouvrement", "Paiement mobile (Wave, Orange Money, Free Money, carte bancaire)"],
    guide: [
      "Créer une nouvelle facture via « + Nouvelle Facture », sélectionner patient, actes et assurance.",
      "Utiliser « Calculer automatiquement » pour obtenir le montant et la part prise en charge.",
      "Pour une facture impayée, cliquer sur « 📲 Payer » et choisir un moyen de paiement mobile.",
      "Suivre les remboursements en cours dans l'onglet « Remboursements ».",
      "Consulter l'onglet « Statistiques » pour le suivi mensuel du recouvrement.",
    ],
    conseils: ["Relancer systématiquement les factures impayées après 30 jours.", "Vérifier le taux de couverture de l'assurance avant d'annoncer le reste à payer au patient."],
  },
  {
    id: "rh-medical", nom: "RH Médical", route: "/rh-medical", icone: "👥", categorie: "clinique",
    objectif: "Administrer les ressources humaines du personnel médical et paramédical (plannings, dossiers).",
    roles: ["Responsable RH", "Chef de service", "Direction générale"],
    fonctionnalites: ["Gestion des plannings et des gardes", "Dossiers du personnel", "Suivi des congés et absences", "Lien avec les certifications de Ndamatou Academy"],
    guide: [
      "Consulter le planning du service pour vérifier la couverture des gardes.",
      "Mettre à jour le dossier d'un agent (affectation, qualification, certification).",
      "Valider une demande de congé et vérifier l'impact sur les effectifs de garde.",
      "Recouper les certifications obtenues sur Ndamatou Academy avec les habilitations requises.",
    ],
    conseils: ["Anticiper les besoins en personnel avant les grands évènements (Magal-Surge)."],
  },
  {
    id: "hemo", nom: "Hemo-Care", route: "/hemo", icone: "🩸", categorie: "clinique",
    objectif: "Planifier et suivre les séances d'hémodialyse du centre.",
    roles: ["Infirmier de dialyse", "Néphrologue", "Cadre du service"],
    fonctionnalites: ["Planning des séances par patient", "Suivi des paramètres de dialyse", "Historique clinique du patient dialysé", "Alertes de rendez-vous manqué"],
    guide: [
      "Consulter le planning du jour pour préparer les postes de dialyse.",
      "Ouvrir la fiche du patient pour vérifier les paramètres de la séance précédente.",
      "Enregistrer les constantes et incidents pendant la séance.",
      "Programmer la prochaine séance selon le protocole du patient.",
    ],
    conseils: ["Signaler tout rendez-vous manqué pour un suivi rapproché — risque vital en cas d'interruption prolongée."],
  },
  {
    id: "mater", nom: "Mater-Neo", route: "/mater", icone: "👶", categorie: "clinique",
    objectif: "Suivre la grossesse, l'accouchement et la néonatologie (partogramme, couveuses).",
    roles: ["Sage-femme", "Gynécologue-obstétricien", "Pédiatre néonatologiste"],
    fonctionnalites: ["Suivi de grossesse et partogramme numérique", "Gestion des couveuses et de leur occupation", "Dossier néonatal", "Alerte complication obstétricale"],
    guide: [
      "Ouvrir le dossier de la patiente et renseigner le partogramme pendant le travail.",
      "Surveiller les alertes de complication (stagnation, souffrance fœtale).",
      "À la naissance, créer le dossier néonatal et affecter une couveuse si nécessaire.",
      "Suivre l'occupation des couveuses depuis le tableau de bord du service.",
    ],
    conseils: ["Traiter toute alerte du partogramme comme prioritaire — l'outil est un support, pas un substitut au jugement clinique."],
  },

  // ---------- B. Administration, Qualité & Réseaux ----------
  {
    id: "qualite-accred", nom: "Qualité-JCI", route: "/qualite-accred", icone: "🏅", categorie: "admin",
    objectif: "Suivre les indicateurs qualité et préparer l'accréditation selon les référentiels JCI.",
    roles: ["Responsable qualité", "Direction", "Référents de service"],
    fonctionnalites: ["Tableaux de bord d'indicateurs qualité", "Suivi des actions correctives", "Checklists d'audit interne", "Historique des non-conformités"],
    guide: [
      "Consulter les indicateurs qualité du mois par service.",
      "Ouvrir une non-conformité constatée et lui assigner une action corrective.",
      "Suivre l'avancement des actions jusqu'à clôture.",
      "Utiliser les checklists avant chaque audit interne.",
    ],
    conseils: ["Documenter chaque non-conformité avec preuve à l'appui pour faciliter l'audit externe."],
  },
  {
    id: "sante-reseau", nom: "Réseau Santé SN", route: "/sante-reseau", icone: "🌐", categorie: "admin",
    objectif: "Interconnecter l'hôpital Ndamatou avec le réseau multi-hôpitaux du Sénégal.",
    roles: ["Référent interopérabilité", "Direction médicale", "DIM"],
    fonctionnalites: ["Recherche par identifiant national de santé", "Échange d'informations inter-établissements", "Suivi des demandes de transfert de patient"],
    guide: [
      "Rechercher un patient par son identifiant national pour retrouver son historique inter-hôpitaux.",
      "Initier une demande de transfert vers un autre établissement du réseau si nécessaire.",
      "Suivre le statut de la demande jusqu'à confirmation par l'hôpital receveur.",
    ],
    conseils: ["Vérifier l'identité du patient avant tout échange de données inter-établissements."],
  },
  {
    id: "nutri", nom: "Nutri-Care", route: "/nutri", icone: "🥗", categorie: "admin",
    objectif: "Assurer le suivi nutritionnel médical personnalisé des patients hospitalisés.",
    roles: ["Diététicien", "Médecin traitant", "Personnel soignant"],
    fonctionnalites: ["Évaluation de l'état nutritionnel", "Plans alimentaires personnalisés", "Suivi de l'évolution du poids et des apports"],
    guide: [
      "Évaluer l'état nutritionnel du patient à l'admission.",
      "Créer un plan alimentaire adapté à la pathologie et le partager avec la cuisine.",
      "Suivre l'évolution des indicateurs nutritionnels pendant le séjour.",
    ],
    conseils: ["Prioriser les patients dénutris ou à risque (personnes âgées, oncologie, réanimation)."],
  },
  {
    id: "rehab", nom: "Rehab-Track", route: "/rehab", icone: "🦵", categorie: "admin",
    objectif: "Suivre la rééducation post-opératoire et les séances de kinésithérapie.",
    roles: ["Kinésithérapeute", "Chirurgien", "Patient"],
    fonctionnalites: ["Planning des séances de rééducation", "Suivi de la progression fonctionnelle", "Exercices recommandés par pathologie"],
    guide: [
      "Créer le programme de rééducation à partir du protocole post-opératoire.",
      "Enregistrer la progression après chaque séance.",
      "Ajuster le programme selon l'évolution fonctionnelle du patient.",
    ],
    conseils: ["Encourager le patient à consulter ses progrès pour renforcer son adhésion au programme."],
  },
  {
    id: "psych", nom: "Psych-Care", route: "/psych", icone: "🧠", categorie: "admin",
    objectif: "Accompagner la santé mentale des patients de façon anonyme, assistée par IA.",
    roles: ["Psychologue", "Psychiatre", "Patient"],
    fonctionnalites: ["Échange anonymisé assisté par IA", "Orientation vers un professionnel si besoin détecté", "Suivi longitudinal confidentiel"],
    guide: [
      "Le patient engage un échange anonyme via le module.",
      "L'IA oriente vers un professionnel si des signaux d'alerte sont détectés.",
      "Le psychologue prend le relais pour un suivi personnalisé si nécessaire.",
    ],
    conseils: ["Rappeler systématiquement au patient que l'IA ne remplace pas un avis clinique en cas d'urgence psychiatrique."],
  },
  {
    id: "organes", nom: "Don-Organes", route: "/organes", icone: "🫀", categorie: "admin",
    objectif: "Gérer le registre national des donneurs d'organes.",
    roles: ["Coordinateur de prélèvement", "Médecin référent", "Administration"],
    fonctionnalites: ["Inscription et gestion des consentements", "Recherche de compatibilité donneur/receveur", "Suivi des dossiers de prélèvement"],
    guide: [
      "Enregistrer le consentement du donneur dans le registre.",
      "Lancer une recherche de compatibilité en cas de disponibilité d'organe.",
      "Suivre le dossier jusqu'à la réalisation du prélèvement ou de la greffe.",
    ],
    conseils: ["Respecter scrupuleusement le cadre légal et éthique du consentement à chaque étape."],
  },
  {
    id: "epidemio-watch", nom: "Épidémio-Watch", route: "/epidemio-watch", icone: "📡", categorie: "admin",
    objectif: "Surveiller les indicateurs épidémiologiques et détecter les signaux d'alerte précoces.",
    roles: ["Épidémiologiste", "Direction médicale", "Autorités sanitaires"],
    fonctionnalites: ["Cartographie régionale des cas", "Journal des signalements en temps réel", "Alertes de seuil épidémique"],
    guide: [
      "Consulter la carte régionale pour repérer les zones à risque.",
      "Suivre le journal des signalements en temps réel.",
      "Déclencher une alerte auprès des autorités sanitaires en cas de dépassement de seuil.",
    ],
    conseils: ["Croiser les données avec Magal-Surge en période de rassemblement massif."],
  },
  {
    id: "don-financement", nom: "Don & Diaspora", route: "/don-financement", icone: "🤲", categorie: "admin",
    objectif: "Faciliter le financement et les dons de la diaspora sénégalaise au profit de l'hôpital.",
    roles: ["Responsable des dons", "Donateur (diaspora)", "Direction financière"],
    fonctionnalites: ["Création de campagnes de financement", "Formulaire de don en ligne", "Suivi de la collecte par campagne"],
    guide: [
      "Créer une campagne avec un objectif de collecte défini.",
      "Le donateur remplit le formulaire (montant, informations, campagne ciblée).",
      "Suivre la progression de la collecte et communiquer les résultats aux donateurs.",
    ],
    conseils: ["Publier des mises à jour régulières sur l'utilisation des fonds pour renforcer la confiance des donateurs."],
  },
  {
    id: "gmao", nom: "GMAO-Track", route: "/gmao", icone: "🛠️", categorie: "admin",
    objectif: "Gérer la maintenance des équipements biomédicaux (déjà livré, rattaché à la maintenance).",
    roles: ["Technicien biomédical", "Responsable maintenance", "Cadre de service"],
    fonctionnalites: ["Planning de maintenance préventive", "Gestion des interventions correctives", "Historique et fiche de vie de chaque équipement"],
    guide: [
      "Déclarer une panne depuis le service concerné.",
      "Le technicien biomédical planifie et réalise l'intervention.",
      "Consulter le planning de maintenance préventive pour anticiper les révisions.",
    ],
    conseils: ["Ne jamais différer la maintenance préventive des équipements critiques (respirateurs, dialyse)."],
  },
  {
    id: "supply", nom: "Supply-Chain", route: "/supply", icone: "📦", categorie: "admin",
    objectif: "Gérer la logistique et les fournisseurs non-médicaux de l'hôpital.",
    roles: ["Responsable logistique", "Service achats", "Fournisseurs"],
    fonctionnalites: ["Suivi des commandes fournisseurs", "Gestion des stocks non-médicaux", "Évaluation des fournisseurs"],
    guide: [
      "Passer une commande auprès du fournisseur référencé.",
      "Suivre la livraison et confirmer la réception en stock.",
      "Évaluer le fournisseur (délai, qualité) après chaque livraison.",
    ],
    conseils: ["Diversifier les fournisseurs critiques pour limiter le risque de rupture."],
  },
  {
    id: "dmp", nom: "DMP-Gateway", route: "/dmp", icone: "🔗", categorie: "admin",
    objectif: "Assurer l'interopérabilité du Dossier Médical Partagé (HL7/FHIR) avec les autres hôpitaux sénégalais.",
    roles: ["Référent interopérabilité", "DIM", "Administrateur système"],
    fonctionnalites: ["Supervision des connecteurs HL7 v2 / FHIR R4", "Recherche de dossiers partagés", "Journal de synchronisation", "Audit de sécurité et chiffrement"],
    guide: [
      "Consulter le tableau de bord pour vérifier la disponibilité des connecteurs.",
      "Rechercher un dossier partagé pour un patient transféré d'un autre établissement.",
      "Vérifier le journal de synchronisation en cas d'anomalie signalée.",
      "Contrôler périodiquement l'audit de sécurité (chiffrement, accès).",
    ],
    conseils: ["Traiter toute latence anormale d'un connecteur comme un incident à escalader rapidement."],
  },

  // ---------- C. Événementiel, Mobilité & Durabilité ----------
  {
    id: "touba", nom: "Touba-Med-Care", route: "/touba", icone: "⭐", categorie: "evenementiel",
    objectif: "Assurer la prise en charge médicale VIP et internationale.",
    roles: ["Coordinateur VIP", "Médecin référent", "Protocole"],
    fonctionnalites: ["Circuit de prise en charge dédié", "Coordination avec le protocole d'accueil", "Suivi personnalisé du dossier"],
    guide: [
      "Enregistrer l'arrivée du patient VIP et activer le circuit dédié.",
      "Coordonner les rendez-vous avec les spécialistes concernés.",
      "Assurer un suivi personnalisé jusqu'à la sortie.",
    ],
    conseils: ["Anticiper les besoins de discrétion et de sécurité propres à ce type de prise en charge."],
  },
  {
    id: "magal", nom: "Magal-Surge", route: "/magal", icone: "🕌", categorie: "evenementiel",
    objectif: "Préparer et coordonner la réponse sanitaire à l'afflux massif du Grand Magal de Touba.",
    roles: ["Cellule de crise", "Direction médicale", "Coordinateurs postes avancés"],
    fonctionnalites: ["Simulateur de capacité selon l'affluence prévue", "Coordination des postes de santé avancés", "Indicateurs de crise en direct", "Système d'alerte"],
    guide: [
      "Utiliser le simulateur de capacité en ajustant le curseur d'affluence prévue.",
      "Dimensionner les postes de santé, lits de crise, ambulances et personnel selon le résultat.",
      "Suivre les indicateurs de crise en direct pendant l'évènement.",
      "Déclencher le niveau d'alerte adapté (normal, vigilance, critique) selon les indicateurs.",
    ],
    conseils: ["Lancer la simulation plusieurs semaines avant l'évènement pour anticiper le déploiement des ressources."],
  },
  {
    id: "eco", nom: "Éco-Hôpital", route: "/eco", icone: "🌱", categorie: "evenementiel",
    objectif: "Piloter la gestion énergétique et la durabilité de l'hôpital (Smart Grid, solaire).",
    roles: ["Responsable technique", "Direction générale", "Service énergie"],
    fonctionnalites: ["Suivi de la consommation énergétique", "Monitoring de la production solaire", "Indicateurs de durabilité"],
    guide: [
      "Consulter le tableau de bord de consommation par bâtiment.",
      "Suivre la production de l'installation solaire en temps réel.",
      "Identifier les postes de consommation à optimiser.",
    ],
    conseils: ["Croiser les pics de consommation avec l'activité hospitalière pour identifier les gisements d'économie."],
  },
  {
    id: "patient-mobile", nom: "Patient Mobile", route: "/patient-mobile", icone: "📱", categorie: "evenementiel",
    objectif: "Offrir une application mobile (PWA) dédiée aux patients pour un accès simplifié aux services.",
    roles: ["Patient", "Support technique"],
    fonctionnalites: ["Installation en PWA sans magasin d'application", "Accès rapide aux fonctions clés (RDV, résultats, paiement)", "Notifications push"],
    guide: [
      "Installer l'application depuis le navigateur mobile (« Ajouter à l'écran d'accueil »).",
      "Se connecter avec son compte Ndamatou Connect.",
      "Activer les notifications pour recevoir les rappels de rendez-vous.",
    ],
    conseils: ["Recommander l'installation aux patients suivis régulièrement (chroniques, grossesse, dialyse)."],
  },
  {
    id: "waste", nom: "Waste-Control", route: "/waste", icone: "🗑️", categorie: "evenementiel",
    objectif: "Assurer la traçabilité des déchets médicaux (DASRI) de leur collecte à leur élimination.",
    roles: ["Agent d'hygiène", "Responsable DASRI", "Prestataire d'élimination"],
    fonctionnalites: ["Enregistrement de la collecte par service", "Suivi de la chaîne de traçabilité jusqu'à l'élimination", "Rapports de conformité réglementaire"],
    guide: [
      "Enregistrer chaque collecte de déchets DASRI par service.",
      "Suivre le transport jusqu'au site d'élimination.",
      "Générer le rapport de conformité pour les autorités sanitaires.",
    ],
    conseils: ["Ne jamais valider une élimination sans preuve de traçabilité complète — enjeu réglementaire et sanitaire."],
  },
  {
    id: "indoor", nom: "Indoor-Guide", route: "/indoor", icone: "🧭", categorie: "evenementiel",
    objectif: "Guider les visiteurs et patients à l'intérieur de l'hôpital et gérer leurs accès.",
    roles: ["Patient / visiteur", "Agent d'accueil", "Sécurité"],
    fonctionnalites: ["Plan interactif des bâtiments et services", "Itinéraire jusqu'au service recherché", "Gestion des badges visiteurs"],
    guide: [
      "Rechercher le service souhaité dans le plan interactif.",
      "Suivre l'itinéraire proposé jusqu'au bon bâtiment/étage.",
      "L'agent d'accueil édite un badge visiteur si nécessaire.",
    ],
    conseils: ["Mettre à jour le plan à chaque réaménagement de service pour éviter d'égarer les visiteurs."],
  },
  {
    id: "morgue", nom: "Morgue-Sync", route: "/morgue", icone: "🕯️", categorie: "evenementiel",
    objectif: "Gérer administrativement les décès et la coordination avec les services funéraires.",
    roles: ["Agent d'état civil hospitalier", "Service funéraire", "Famille du défunt"],
    fonctionnalites: ["Enregistrement du décès et des documents administratifs", "Coordination avec les prestataires funéraires", "Suivi du retrait du corps"],
    guide: [
      "Enregistrer le décès et générer les documents administratifs requis.",
      "Informer la famille des démarches et options funéraires.",
      "Coordonner avec le prestataire funéraire jusqu'au retrait du corps.",
    ],
    conseils: ["Traiter chaque dossier avec rigueur administrative et sensibilité humaine."],
  },

  // ---------- D. Intelligence Artificielle & Formation ----------
  {
    id: "chatbot-triage", nom: "Triage IA", route: "/chatbot-triage", icone: "🤖", categorie: "ia",
    objectif: "Orienter les patients aux urgences via un chatbot de triage médical multilingue (Français/Wolof/Pulaar).",
    roles: ["Patient", "Infirmier d'accueil et d'orientation"],
    fonctionnalites: ["Questionnaire de triage conversationnel", "Classification de l'urgence (P1 à Non urgent)", "Support multilingue Français / Wolof / Pulaar"],
    guide: [
      "Le patient décrit ses symptômes via le chatbot, dans la langue de son choix.",
      "Le système propose une classification d'urgence (P1, P2, P3, Non urgent).",
      "L'infirmier d'accueil confirme ou ajuste le niveau d'urgence avant orientation.",
    ],
    conseils: ["Le triage IA est une aide à la décision — la validation humaine reste systématique avant toute orientation."],
  },
  {
    id: "neuro", nom: "NeuroScan-IA", route: "/neuro", icone: "🧠", categorie: "ia",
    objectif: "Assister les radiologues dans l'analyse d'images cérébrales grâce à l'intelligence artificielle.",
    roles: ["Radiologue", "Neurologue"],
    fonctionnalites: ["Analyse assistée d'imagerie cérébrale", "Détection de zones suspectes", "Second avis automatisé"],
    guide: [
      "Importer ou sélectionner l'examen d'imagerie à analyser.",
      "Consulter les zones signalées par l'IA comme suspectes.",
      "Le radiologue rend l'interprétation finale, l'IA n'étant qu'un support d'aide au diagnostic.",
    ],
    conseils: ["Toujours croiser l'avis de l'IA avec la clinique du patient avant conclusion diagnostique."],
  },
  {
    id: "ia-diagnostic", nom: "IA-Diagnostic", route: "/ia-diagnostic", icone: "🔬", categorie: "ia",
    objectif: "Fournir un second avis diagnostique assisté par IA sur plusieurs spécialités (cardiologie, ophtalmologie, biologie, neurologie).",
    roles: ["Médecin traitant", "Spécialiste référent"],
    fonctionnalites: ["Saisie du cas clinique en texte libre", "Suggestions diagnostiques par spécialité", "Historique des demandes de second avis"],
    guide: [
      "Décrire le cas clinique (ex. « Patient de 58 ans, dyspnée d'effort… »).",
      "Sélectionner le module spécialisé concerné (cardiologie, neurologie, etc.).",
      "Examiner les pistes diagnostiques proposées et les confronter à l'examen clinique.",
    ],
    conseils: ["Utiliser l'outil en complément, jamais en remplacement de l'examen clinique et des explorations nécessaires."],
  },
  {
    id: "predict", nom: "Predict-IA", route: "/predict", icone: "📊", categorie: "ia",
    objectif: "Donner à la Direction un tableau de bord prédictif consolidé (flux patients, lits, budget).",
    roles: ["Direction générale", "Direction des soins", "Direction financière"],
    fonctionnalites: ["Prévision des flux patients", "Prévision d'occupation des lits", "Indicateurs budgétaires consolidés"],
    guide: [
      "Consulter les prévisions de flux patients pour la semaine à venir.",
      "Croiser avec l'occupation prévue des lits pour anticiper les tensions.",
      "Suivre les indicateurs budgétaires consolidés pour les décisions stratégiques.",
    ],
    conseils: ["Utiliser les prévisions pour préparer les arbitrages de ressources en amont, pas dans l'urgence."],
  },
  {
    id: "chncak-academy", nom: "Ndamatou Academy", route: "/chncak-academy", icone: "🎓", categorie: "ia",
    objectif: "Centraliser la formation continue, les simulations cliniques et les certifications du personnel — y compris ce manuel de formation aux 34 applications.",
    roles: ["Tout le personnel médical et paramédical", "Responsable formation"],
    fonctionnalites: ["Modules de formation clinique", "Simulations de cas cliniques notées", "Suivi des certifications", "Staffs cliniques virtuels", "Manuel de formation des 34 applications (cet onglet)"],
    guide: [
      "Parcourir l'onglet « Formations » pour suivre un module clinique.",
      "S'entraîner sur l'onglet « Simulations » avec des cas cliniques notés.",
      "Consulter l'onglet « Manuel Applications » pour apprendre à utiliser chaque module de l'écosystème.",
      "Suivre ses certifications et leur date d'expiration dans l'onglet dédié.",
    ],
    conseils: ["Revenir régulièrement sur ce manuel lors de la prise en main d'un nouveau module ou de l'arrivée d'un nouvel agent."],
  },
  {
    id: "learn", nom: "Med-Learn", route: "/learn", icone: "📖", categorie: "ia",
    objectif: "Proposer un parcours e-learning médical et des certifications du personnel en autonomie.",
    roles: ["Personnel médical et paramédical", "Responsable formation"],
    fonctionnalites: ["Cours en ligne à son rythme", "Évaluations et quiz de certification", "Suivi de la progression individuelle"],
    guide: [
      "Choisir un parcours e-learning adapté à sa fonction.",
      "Suivre les modules à son rythme et passer les quiz associés.",
      "Obtenir la certification une fois le parcours validé.",
    ],
    conseils: ["Planifier des créneaux dédiés au e-learning plutôt que de compter sur les temps morts."],
  },
]
