# -*- coding: utf-8 -*-
"""
Document de présentation Ndamatou — style rapport professionnel
Fond blanc, typographie claire, sommaire, titres, sous-titres, paragraphes
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak,
    Table, TableStyle, HRFlowable, Image as RLImage, KeepTogether
)
from reportlab.pdfgen import canvas as pdf_canvas
from reportlab.platypus.flowables import Flowable

W, H = A4
OUTPUT = "C:/gravity/hopital/Ndamatou_Document_Presentation.pdf"
PHOTO  = "C:/gravity/hopital/ndamatou_building.jpg"

# ── COULEURS ─────────────────────────────────────────────────────────────────
NAVY   = HexColor("#0a2540")
BLUE   = HexColor("#1a56db")
TEAL   = HexColor("#0d9488")
GOLD   = HexColor("#b45309")
LGOLD  = HexColor("#f59e0b")
GREEN  = HexColor("#15803d")
RED    = HexColor("#b91c1c")
PURPLE = HexColor("#6d28d9")
GREY   = HexColor("#374151")
LGREY  = HexColor("#6b7280")
BGLIGHT= HexColor("#f8fafc")
LBORDER= HexColor("#e2e8f0")

SEC_COLOR = {
    "clinique": BLUE,
    "admin":    TEAL,
    "event":    GOLD,
    "ia":       PURPLE,
}

# ── STYLES ───────────────────────────────────────────────────────────────────
def styles():
    base = dict(fontName="Helvetica", textColor=GREY, leading=16, spaceAfter=6)
    return {
        "cover_main": ParagraphStyle("cover_main", fontName="Helvetica-Bold",
            fontSize=28, textColor=white, leading=34, alignment=TA_CENTER, spaceAfter=8),
        "cover_sub": ParagraphStyle("cover_sub", fontName="Helvetica",
            fontSize=13, textColor=HexColor("#cbd5e1"), leading=18, alignment=TA_CENTER, spaceAfter=6),
        "cover_tag": ParagraphStyle("cover_tag", fontName="Helvetica-Bold",
            fontSize=10, textColor=LGOLD, leading=14, alignment=TA_CENTER, letterSpacing=2),

        "toc_section": ParagraphStyle("toc_section", fontName="Helvetica-Bold",
            fontSize=11, textColor=NAVY, leading=16, spaceAfter=3, spaceBefore=8),
        "toc_app": ParagraphStyle("toc_app", fontName="Helvetica",
            fontSize=9.5, textColor=GREY, leading=14, leftIndent=18, spaceAfter=1),

        "sec_title": ParagraphStyle("sec_title", fontName="Helvetica-Bold",
            fontSize=20, textColor=white, leading=26, alignment=TA_LEFT, spaceAfter=6),
        "sec_sub": ParagraphStyle("sec_sub", fontName="Helvetica",
            fontSize=12, textColor=HexColor("#bfdbfe"), leading=16, alignment=TA_LEFT),

        "app_num": ParagraphStyle("app_num", fontName="Helvetica-Bold",
            fontSize=9, textColor=BLUE, leading=12, spaceAfter=2, letterSpacing=1),
        "app_title": ParagraphStyle("app_title", fontName="Helvetica-Bold",
            fontSize=17, textColor=NAVY, leading=22, spaceAfter=4),
        "app_subtitle": ParagraphStyle("app_subtitle", fontName="Helvetica-Bold",
            fontSize=11, textColor=LGREY, leading=15, spaceAfter=10),

        "h3": ParagraphStyle("h3", fontName="Helvetica-Bold",
            fontSize=10, textColor=NAVY, leading=14, spaceAfter=4, spaceBefore=10),
        "body": ParagraphStyle("body", fontName="Helvetica",
            fontSize=10, textColor=GREY, leading=16, spaceAfter=6, alignment=TA_JUSTIFY),
        "bullet": ParagraphStyle("bullet", fontName="Helvetica",
            fontSize=10, textColor=GREY, leading=15, spaceAfter=3,
            leftIndent=16, firstLineIndent=0),
        "caption": ParagraphStyle("caption", fontName="Helvetica",
            fontSize=8, textColor=LGREY, leading=12, alignment=TA_CENTER, spaceAfter=4),

        "kpi_val": ParagraphStyle("kpi_val", fontName="Helvetica-Bold",
            fontSize=22, textColor=BLUE, leading=26, alignment=TA_CENTER),
        "kpi_lbl": ParagraphStyle("kpi_lbl", fontName="Helvetica",
            fontSize=8, textColor=LGREY, leading=11, alignment=TA_CENTER),

        "footer_text": ParagraphStyle("footer_text", fontName="Helvetica",
            fontSize=8, textColor=LGREY, leading=11),
    }

ST = styles()

# ── PAGE CALLBACKS ────────────────────────────────────────────────────────────
def cb_cover(c, doc):
    c.saveState()
    # Fond bleu marine pleine page
    c.setFillColor(NAVY)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    # Bande décorative or en haut
    c.setFillColor(LGOLD)
    c.rect(0, H-6*mm, W, 6*mm, fill=1, stroke=0)
    # Bande or bas
    c.setFillColor(LGOLD)
    c.rect(0, 0, W, 5*mm, fill=1, stroke=0)
    c.restoreState()

def cb_normal(c, doc):
    c.saveState()
    # En-tête filet
    c.setStrokeColor(LBORDER)
    c.setLineWidth(0.5)
    c.line(1.5*cm, H-1.4*cm, W-1.5*cm, H-1.4*cm)
    # Texte en-tête
    c.setFont("Helvetica", 7.5)
    c.setFillColor(LGREY)
    c.drawString(1.5*cm, H-1.1*cm, "Ndamatou — Écosystème Digital")
    c.drawRightString(W-1.5*cm, H-1.1*cm, "Document de Présentation 2026")
    # Pied de page
    c.line(1.5*cm, 1.6*cm, W-1.5*cm, 1.6*cm)
    c.setFont("Helvetica", 7.5)
    c.setFillColor(LGREY)
    c.drawString(1.5*cm, 0.9*cm, "Processingenierie · Touba, Sénégal")
    c.drawCentredString(W/2, 0.9*cm, f"— {doc.page} —")
    c.drawRightString(W-1.5*cm, 0.9*cm, "Confidentiel")
    c.restoreState()

# ── DONNÉES ───────────────────────────────────────────────────────────────────
SECTIONS = [
  {
    "id": "clinique", "num": 1,
    "title": "Soins & Gestion Clinique",
    "subtitle": "Les fondamentaux du quotidien hospitalier — 8 applications",
    "intro": (
        "Cette première partie de l'écosystème Ndamatou regroupe les huit applications essentielles "
        "au fonctionnement quotidien de l'hôpital. Elles couvrent l'ensemble du parcours patient, "
        "de l'accueil à la facturation, en passant par la pharmacie, le laboratoire, les urgences "
        "et la gestion des ressources humaines. Ce socle numérique constitue la colonne vertébrale "
        "sur laquelle repose toute l'organisation des soins au sein du Ndamatou."
    ),
    "apps": [
      {
        "num": "1.1", "name": "Ndamatou Connect — Portail Patient & Télémédecine",
        "subtitle": "La porte d'entrée numérique de l'hôpital",
        "intro": (
            "Ndamatou Connect est le portail central destiné aux patients et aux professionnels de santé. "
            "Il transforme l'expérience hospitalière en offrant un accès complet et sécurisé à l'ensemble "
            "des services médicaux depuis un ordinateur ou un smartphone. Ce portail constitue le visage "
            "numérique du Ndamatou vis-à-vis de ses patients et de ses partenaires."
        ),
        "features": [
            "Prise de rendez-vous en ligne, disponible 24h/24 et 7j/7, avec confirmation par SMS",
            "Téléconsultation vidéo sécurisée entre patient et médecin, depuis domicile",
            "Dossier médical numérique unifié : antécédents, prescriptions, résultats, comptes rendus",
            "Ordonnances électroniques transmises directement à la pharmacie de l'hôpital",
            "Suivi des constantes vitales (tension, glycémie, IMC, fréquence cardiaque)",
            "Résultats d'analyses et d'imagerie consultables en ligne dès validation",
            "Paiement des actes médicaux via Wave, Orange Money ou carte bancaire",
            "Messagerie sécurisée patient-médecin avec notification en temps réel",
        ],
        "valeur": (
            "Ce portail réduit le temps d'attente moyen de 60 %, diminue les déplacements inutiles "
            "et améliore la satisfaction des patients de 40 %. Il désencombre les urgences en permettant "
            "une orientation préalable efficace, et renforce la fidélité des patients au Ndamatou."
        ),
        "innovation": (
            "L'innovation majeure réside dans la centralisation du dossier patient en temps réel, "
            "consultable et mis à jour simultanément par tous les services. La téléconsultation intégrée "
            "au dossier médical constitue une première en Afrique de l'Ouest pour un hôpital public."
        ),
      },
      {
        "num": "1.2", "name": "SmartPharma — Pharmacie Intelligente",
        "subtitle": "Gestion sécurisée des stocks et des prescriptions",
        "intro": (
            "SmartPharma assure la gestion complète de la pharmacie hospitalière, depuis la réception "
            "des médicaments jusqu'à leur dispensation au patient. La traçabilité totale, les alertes "
            "automatiques et la connexion aux assurances maladie en font un outil indispensable à la "
            "sécurité médicamenteuse du Ndamatou."
        ),
        "features": [
            "Inventaire en temps réel de plus de 1 247 références médicamenteuses",
            "Alertes automatiques en cas de stock critique ou de rupture imminente",
            "Traçabilité complète par technologie blockchain, du fabricant au patient",
            "Validation et réception des ordonnances électroniques issues du portail Connect",
            "Alertes de péremption proactives avec proposition de consommation prioritaire",
            "Dispensation sécurisée par QR code, éliminant les erreurs de délivrance",
            "Interface directe avec la CNAM et les mutuelles pour remboursement automatique",
            "Tableau de bord de consommation par service et par pathologie",
        ],
        "valeur": (
            "SmartPharma élimine les ruptures de stock critiques et génère des économies estimées "
            "à 25 millions de FCFA par an en réduisant les pertes liées à la péremption. "
            "Les erreurs de dispensation sont réduites à quasi-zéro grâce à la double vérification "
            "numérique ordonnance-stock."
        ),
        "innovation": (
            "L'utilisation de la blockchain pour tracer chaque médicament de sa fabrication "
            "jusqu'au patient est une innovation majeure dans le secteur hospitalier sénégalais. "
            "Cette technologie garantit l'authenticité des médicaments et protège contre les "
            "contrefaçons, un enjeu crucial en Afrique subsaharienne."
        ),
      },
      {
        "num": "1.3", "name": "BloodSync — Banque de Sang Connectée",
        "subtitle": "Gestion des stocks sanguins et réseau national de donneurs",
        "intro": (
            "BloodSync est une application critique dédiée à la gestion de la banque de sang du Ndamatou. "
            "Elle assure en permanence la disponibilité des produits sanguins nécessaires aux interventions "
            "chirurgicales et aux urgences transfusionnelles, tout en développant le réseau de donneurs "
            "bénévoles à l'échelle nationale."
        ),
        "features": [
            "Suivi en temps réel des stocks par groupe sanguin (A+, A-, B+, B-, O+, O-, AB+, AB-)",
            "Alertes SOS automatiques en cas de besoin urgent de transfusion",
            "Base de données géolocalisée des donneurs bénévoles avec profil sanguin",
            "Compatibilité totale avec le réseau national du Centre de Transfusion Sanguine (CNTS)",
            "Interface automatisée avec les urgences pour déclencher les approvisionnements",
            "Rapports quotidiens et bilans hebdomadaires des mouvements sanguins",
            "Formulaire de don en ligne avec rappels et suivi post-don pour les donneurs",
        ],
        "valeur": (
            "Le délai d'approvisionnement en produits sanguins est réduit de 70 %, ce qui peut "
            "représenter un facteur décisif dans des situations chirurgicales ou obstétricales d'urgence. "
            "Le réseau de donneurs actifs dépasse les 5 000 personnes, garantissant une autonomie "
            "transfusionnelle au Ndamatou."
        ),
        "innovation": (
            "La connexion en temps réel avec le CNTS national constitue une première en Sénégal. "
            "Elle permet de mutualiser les stocks entre établissements et d'éviter tout gaspillage, "
            "tout en garantissant une réponse immédiate aux situations de pénurie locales."
        ),
      },
      {
        "num": "1.4", "name": "AmbuTrack — Suivi et Dispatch des Ambulances",
        "subtitle": "Coordination intelligente des interventions d'urgence",
        "intro": (
            "AmbuTrack est le système de gestion et de dispatch des ambulances du Ndamatou. "
            "Il permet de coordonner en temps réel l'ensemble de la flotte ambulancière, d'optimiser "
            "les délais d'intervention et d'assurer une communication fluide entre les équipes terrain "
            "et le centre de régulation médicale."
        ),
        "features": [
            "Localisation GPS en temps réel de toutes les ambulances de la flotte (7 véhicules)",
            "Dispatch intelligent basé sur la proximité, l'urgence médicale et la disponibilité",
            "Calcul dynamique de l'ETA (temps d'arrivée estimé) mis à jour en permanence",
            "Coordination intégrée avec le centre 15 régional et les services d'urgence",
            "Historique complet de chaque mission : localisation, durée, équipe, patient",
            "Formulaire d'appel urgence en ligne pour les médecins ou les familles",
            "Rapport d'intervention automatique transmis au dossier médical patient",
        ],
        "valeur": (
            "Le temps moyen d'intervention est réduit de 35 %, ce qui améliore directement "
            "le pronostic vital des patients en situation d'urgence. La couverture géographique "
            "de Touba et de ses environs est optimisée, avec une répartition intelligente "
            "des ressources ambulancières."
        ),
        "innovation": (
            "L'algorithme de dispatch intègre simultanément la localisation GPS, les conditions "
            "de circulation et le niveau de priorité médicale pour désigner l'ambulance la plus "
            "adaptée. Cette approche multi-critères est une innovation rare dans les systèmes "
            "préhospitaliers africains."
        ),
      },
      {
        "num": "1.5", "name": "Lab Connect — Laboratoire Connecté Temps Réel",
        "subtitle": "Résultats d'analyses intégrés instantanément au dossier patient",
        "intro": (
            "Lab Connect relie les équipements du laboratoire d'analyses médicales au système "
            "d'information hospitalier du Ndamatou. Dès qu'un résultat est validé par un biologiste, "
            "il est instantanément disponible dans le dossier patient et notifié au médecin "
            "prescripteur, supprimant tout délai et toute ressaisie manuelle."
        ),
        "features": [
            "Transmission automatique des résultats dès validation par le biologiste responsable",
            "Alertes critiques immédiates (hyperkaliémie, troponines, etc.) avec niveau de priorité",
            "Traçabilité complète des échantillons, de la collecte à la validation du résultat",
            "Intégration directe et instantanée au dossier médical numérique du patient",
            "Interface de validation en ligne pour le biologiste, accessible à distance",
            "Historique complet des analyses par patient avec courbes d'évolution",
            "Export automatique en PDF des résultats, transmissible au patient via Connect",
        ],
        "valeur": (
            "Le délai de rendu des résultats est réduit de 50 %, accélérant la prise de décision "
            "médicale. Les alertes critiques sont transmises en moins de deux minutes au médecin "
            "concerné, réduisant significativement le risque d'omission ou de retard de traitement."
        ),
        "innovation": (
            "La connexion directe automate-logiciel-dossier sans aucune ressaisie manuelle "
            "élimine une source majeure d'erreurs dans les laboratoires hospitaliers. "
            "Le système est compatible avec tous les grands automates de biologie clinique."
        ),
      },
      {
        "num": "1.6", "name": "Smart Beds — Gestion Intelligente des Lits",
        "subtitle": "Optimisation de la capacité d'accueil par service",
        "intro": (
            "Smart Beds est l'outil de gestion en temps réel des lits hospitaliers du Ndamatou. "
            "Il offre une visibilité totale sur la disponibilité, l'occupation et la rotation "
            "des lits par service, permettant à l'administration d'optimiser en permanence "
            "la capacité d'accueil de l'établissement."
        ),
        "features": [
            "Tableau de bord temps réel de la disponibilité des lits par service et par étage",
            "Algorithme de prédiction des sorties patients basé sur les diagnostics et séjours",
            "Planification automatique du nettoyage et de la désinfection des chambres",
            "Alertes de saturation par service avec seuils paramétrables",
            "Historique et statistiques du taux d'occupation sur 12 mois glissants",
            "Interface dédiée aux brancardiers pour les transferts et admissions",
            "Tableau de bord quotidien remis automatiquement à la direction",
        ],
        "valeur": (
            "Le taux d'occupation des lits est amélioré de 15 %, ce qui représente une capacité "
            "d'accueil supplémentaire significative sans investissement immobilier. La rotation "
            "des lits est optimisée, réduisant les files d'attente aux urgences et les transferts "
            "vers d'autres établissements."
        ),
        "innovation": (
            "L'algorithme prédictif de sortie patient, basé sur l'apprentissage des données "
            "historiques de chaque service, permet d'anticiper les disponibilités avec une "
            "fiabilité de 85 %, facilitant la planification des admissions programmées."
        ),
      },
      {
        "num": "1.7", "name": "FactuCare — Facturation & Assurance Maladie",
        "subtitle": "Recouvrement automatisé connecté à la CNAM et aux mutuelles",
        "intro": (
            "FactuCare prend en charge l'intégralité du cycle de facturation du Ndamatou, "
            "depuis la génération automatique de la facture à la sortie du patient jusqu'au "
            "suivi des remboursements par les organismes d'assurance maladie. "
            "Il garantit la conformité réglementaire et améliore significativement le taux de recouvrement."
        ),
        "features": [
            "Génération automatique de la facture à la sortie du patient, consolidant tous les actes",
            "Télétransmission directe et instantanée vers la CNAM sans intervention manuelle",
            "Suivi en temps réel des remboursements par les mutuelles partenaires",
            "Tableau de bord de recouvrement avec indicateurs de performance mensuel",
            "Gestion des échéanciers de paiement pour les patients non couverts",
            "Rapports financiers mensuels et annuels générés automatiquement",
            "Archivage légal sécurisé de toutes les factures avec signature électronique",
        ],
        "valeur": (
            "Le taux de recouvrement augmente de 30 % grâce à la réduction des rejets de dossiers "
            "et à la télétransmission immédiate. Le délai de facturation est réduit de 80 %, "
            "améliorant directement la trésorerie de l'hôpital et réduisant les impayés."
        ),
        "innovation": (
            "La télétransmission automatique vers la CNAM, sans aucun formulaire papier ni "
            "ressaisie, est une première dans le secteur hospitalier public sénégalais. "
            "Elle réduit les coûts administratifs et garantit une conformité totale "
            "avec la réglementation de l'assurance maladie."
        ),
      },
      {
        "num": "1.8", "name": "RH Médical — Ressources Humaines Médicales",
        "subtitle": "Planification et gestion du personnel médical et paramédical",
        "intro": (
            "RH Médical est la plateforme de gestion intégrée des ressources humaines du Ndamatou. "
            "Elle couvre l'ensemble du cycle de vie professionnel du personnel médical et paramédical : "
            "planification des gardes, gestion des compétences, évaluations, formation continue "
            "et administration des contrats."
        ),
        "features": [
            "Planification automatique des gardes, des astreintes et des rotations sur 4 semaines",
            "Gestion des compétences, diplômes et habilitations par agent",
            "Suivi des congés, RTT et remplacements avec alertes de sous-effectif",
            "Évaluations annuelles dématérialisées avec grilles de critères paramétrables",
            "Suivi de la formation continue obligatoire avec rappels automatiques",
            "Gestion des contrats, des avenants et des documents administratifs dématérialisés",
            "Interface avec le logiciel de paie pour le calcul des indemnités de garde",
        ],
        "valeur": (
            "Les conflits de planning sont réduits de 90 % grâce à l'optimisation algorithmique. "
            "Le temps consacré aux tâches RH administratives diminue de 60 %, libérant "
            "les cadres pour se concentrer sur le management et l'accompagnement des équipes. "
            "La conformité réglementaire est assurée en permanence."
        ),
        "innovation": (
            "L'algorithme d'optimisation des plannings de garde intègre les contraintes légales "
            "(temps de repos, heures maximum), les préférences des agents et les besoins en "
            "compétences spécifiques par service. Il génère un planning équitable et optimisé "
            "en quelques secondes pour un horizon de quatre semaines."
        ),
      },
    ],
  },
  {
    "id": "admin", "num": 2,
    "title": "Administration, Qualité & Réseau",
    "subtitle": "Pilotage, conformité et coordination nationale — 8 applications",
    "intro": (
        "La deuxième partie de l'écosystème Ndamatou regroupe les applications dédiées au pilotage "
        "institutionnel, à la démarche qualité, au réseau inter-hospitalier et aux spécialités "
        "transversales. Ces outils positionnent le Ndamatou comme un acteur de référence du système "
        "de santé sénégalais, ancré dans l'excellence et ouvert sur le territoire national."
    ),
    "apps": [
      {
        "num": "2.1", "name": "Qualité-JCI — Accréditation Internationale",
        "subtitle": "Pilotage de la démarche qualité vers l'accréditation JCI",
        "intro": (
            "Qualité-JCI accompagne le Ndamatou dans sa démarche d'accréditation internationale "
            "auprès de la Joint Commission International (JCI), référence mondiale en matière "
            "de qualité hospitalière. Cette application structure la conformité aux 14 chapitres "
            "de standards JCI et suit en temps réel l'atteinte des objectifs."
        ),
        "features": [
            "Suivi des 14 chapitres de standards JCI avec indicateurs de conformité par chapitre",
            "Tableau de bord des indicateurs qualité OMS mis à jour en temps réel",
            "Gestion des événements indésirables avec analyse des causes profondes",
            "Calendrier des audits internes et externes avec relances automatiques",
            "Analyse de la conformité des prescriptions (objectif : 91 % de conformité)",
            "Génération du rapport d'accréditation exportable en format officiel JCI",
            "Plan d'amélioration continue avec actions, responsables et échéances",
        ],
        "valeur": (
            "L'accréditation JCI représente la reconnaissance internationale du plus haut niveau "
            "de qualité des soins. Elle renforce la confiance des patients et des partenaires "
            "institutionnels, attire des coopérations internationales et ouvre la porte "
            "à des financements d'organisations mondiales de la santé."
        ),
        "innovation": (
            "Le Ndamatou serait le premier hôpital en zone rurale d'Afrique subsaharienne "
            "à atteindre l'accréditation JCI grâce à une démarche entièrement pilotée "
            "par le numérique. Cela constitue un modèle inédit pour le continent africain."
        ),
      },
      {
        "num": "2.2", "name": "Réseau Santé SN — Interconnexion Nationale",
        "subtitle": "Partage inter-hospitalier à l'échelle du Sénégal",
        "intro": (
            "Réseau Santé SN est la plateforme d'interconnexion entre le Ndamatou et les autres "
            "établissements hospitaliers du Sénégal. Elle permet le partage des dossiers patients, "
            "la coordination des transferts et la transmission automatique des données "
            "épidémiologiques au Ministère de la Santé."
        ),
        "features": [
            "Connexion en temps réel avec 6 hôpitaux partenaires sur le territoire national",
            "Partage sécurisé des dossiers médicaux inter-établissements avec consentement patient",
            "Gestion des transferts de patients avec dossier médical intégré",
            "Reporting automatique des indicateurs de santé vers le Ministère (MSAS)",
            "Tableau de bord national des indicateurs de performance sanitaire",
            "Télé-expertise médicale entre spécialistes de différents sites",
            "Carte épidémique nationale actualisée en temps réel",
        ],
        "valeur": (
            "Le réseau garantit la continuité des soins entre établissements, éliminant "
            "les ruptures d'information lors des transferts de patients. Les données nationales "
            "fiables transmises au MSAS améliorent la planification sanitaire et l'allocation "
            "des ressources à l'échelle du pays."
        ),
        "innovation": (
            "Cette infrastructure constitue le premier réseau de santé numérique inter-hospitalier "
            "du Sénégal. Elle pose les bases d'un système de santé cohérent et interconnecté "
            "à l'échelle nationale, modèle potentiel pour toute l'Afrique de l'Ouest."
        ),
      },
      {
        "num": "2.3", "name": "NutriCare — Suivi Nutritionnel Médical",
        "subtitle": "Évaluation et prise en charge de la dénutrition hospitalière",
        "intro": (
            "NutriCare intègre la prise en charge nutritionnelle dans le parcours de soin "
            "de chaque patient hospitalisé. En appliquant les standards internationaux de "
            "dépistage (NRS-2002), elle permet aux diétiticiens et aux médecins de coordonner "
            "efficacement les plans nutritionnels et de prévenir les complications liées "
            "à la dénutrition."
        ),
        "features": [
            "Évaluation nutritionnelle systématique NRS-2002 à chaque admission",
            "Plans nutritionnels personnalisés par pathologie (diabète, IRC, oncologie, pédiatrie)",
            "Alertes automatiques en cas de dénutrition détectée ou de dégradation du score",
            "Interface directe avec la cuisine centrale pour transmission des régimes spéciaux",
            "Suivi quotidien du poids, de l'IMC et des indicateurs nutritionnels biologiques",
            "Bilans diétiticiens intégrés au dossier médical et consultables par l'équipe soignante",
            "Protocoles spécifiques pour la nutrition parentérale et entérale",
        ],
        "valeur": (
            "La prévalence de la dénutrition hospitalière est réduite de 40 %, ce qui entraîne "
            "une diminution moyenne de 2 jours de la durée de séjour et une réduction de 25 % "
            "des complications post-opératoires. L'impact financier est considérable, "
            "tant pour l'hôpital que pour les patients."
        ),
        "innovation": (
            "L'intégration automatique du score nutritionnel dans les prescriptions médicales "
            "est une innovation rare dans les systèmes hospitaliers africains. Elle rappelle "
            "au médecin de prendre en compte la nutrition comme composante thérapeutique "
            "à part entière."
        ),
      },
      {
        "num": "2.4", "name": "RehabTrack — Rééducation & Kinésithérapie",
        "subtitle": "Suivi personnalisé des parcours de rééducation physique",
        "intro": (
            "RehabTrack structure et numérise la prise en charge en kinésithérapie et rééducation "
            "fonctionnelle au Ndamatou. De la prescription initiale du médecin à l'évaluation finale "
            "avant la sortie, chaque étape du parcours de rééducation est tracée, mesurée "
            "et optimisée pour maximiser le retour à l'autonomie du patient."
        ),
        "features": [
            "Suivi de la progression par exercice et par séance pour chaque patient",
            "Planning kinésithérapie automatisé sur 5 jours avec gestion des ressources",
            "Gestion de 8 plateaux techniques : matériel, disponibilité, maintenance",
            "Courbes de progression interactives visualisées par le médecin et le patient",
            "Objectifs personnalisés par type de pathologie ou de chirurgie",
            "Communication directe intégrée entre médecin prescripteur et kinésithérapeute",
            "Bilan de sortie automatisé avec recommandations pour la rééducation à domicile",
        ],
        "valeur": (
            "Le retour à l'autonomie est accéléré de 35 %, réduisant la durée de séjour en "
            "service de rééducation. Le taux de réadmission à 30 jours diminue de 15 % grâce "
            "à des plans de sortie plus complets. La saturation des plateaux de rééducation "
            "est réduite de 20 % par une meilleure planification."
        ),
        "innovation": (
            "L'algorithme de prescription automatique des séances de kinésithérapie, calibré "
            "selon le type d'intervention chirurgicale et les comorbidités du patient, "
            "garantit un programme de rééducation standardisé et basé sur les meilleures "
            "pratiques internationales."
        ),
      },
      {
        "num": "2.5", "name": "PsychCare — Psychiatrie & Santé Mentale",
        "subtitle": "Soins psychiatriques numériques, confidentiels et inclusifs",
        "intro": (
            "PsychCare est une plateforme dédiée à l'unité de psychiatrie et santé mentale du Ndamatou. "
            "Dans un contexte culturel où la santé mentale reste souvent tabou, PsychCare propose "
            "un cadre numérique sécurisé, anonymisé et bienveillant pour accompagner les patients "
            "tout au long de leur parcours de soins psychiatriques."
        ),
        "features": [
            "Dossiers psychiatriques entièrement anonymisés avec accès restreint et tracé",
            "Programmes de thérapies cognitivo-comportementales (TCC) structurés et numériques",
            "Suivi et planification des thérapies de groupe avec liste d'attente gérée",
            "Ligne d'écoute psychologique intégrée, accessible 24h/24",
            "Programmation d'activités art-thérapie, méditation et relaxation",
            "Bibliothèque de ressources documentaires pour patients et familles",
            "Reporting confidentiel des indicateurs de santé mentale vers le MSAS",
        ],
        "valeur": (
            "La stigmatisation est réduite grâce à l'anonymisation totale des dossiers. "
            "L'accès aux soins mentaux est élargi à trois fois plus de patients, notamment "
            "grâce à la consultation à distance et à la ligne d'écoute disponible en "
            "dehors des heures d'ouverture du service."
        ),
        "innovation": (
            "PsychCare est le premier service de psychiatrie numérique en Afrique subsaharienne "
            "offrant une protection totale des données personnelles conformément aux standards "
            "internationaux (RGPD-compatible). Il brise le tabou de la santé mentale "
            "en offrant un cadre sécurisé et dégmatisé."
        ),
      },
      {
        "num": "2.6", "name": "DonOrganes — Registre National de Don d'Organes",
        "subtitle": "Gestion des donneurs, liste d'attente et protocoles de greffe",
        "intro": (
            "DonOrganes est le premier registre numérique de don d'organes du Sénégal, "
            "hébergé au Ndamatou. Il centralise les profils des donneurs potentiels, gère "
            "la liste d'attente des patients en besoin de greffe et coordonne en temps réel "
            "les procédures de compatibilité et de transplantation."
        ),
        "features": [
            "Registre sécurisé et confidentiel des donneurs d'organes volontaires",
            "Gestion de la liste d'attente nationale des patients en attente de greffe",
            "Algorithme IA de compatibilité croisant groupe sanguin, HLA et urgence médicale",
            "Protocoles numériques de transplantation par type d'organe",
            "Système d'alerte urgence greffe en temps réel avec notification des équipes",
            "Interface avec trois centres partenaires agréés pour la transplantation",
            "Formulaire de consentement au don d'organes dématérialisé et légalement valide",
        ],
        "valeur": (
            "Le nombre de donneurs enregistrés augmente de 200 % grâce à la simplification "
            "de la démarche d'enregistrement. Le délai de mise en relation donneur-receveur "
            "est réduit de 40 %, ce qui améliore directement les chances de succès "
            "des greffes et sauve des vies."
        ),
        "innovation": (
            "L'algorithme de compatibilité par intelligence artificielle, capable de croiser "
            "simultanément le groupe sanguin, les antigènes HLA et le niveau d'urgence médicale "
            "en quelques secondes, est une innovation technologique rare même dans les pays "
            "à systèmes de santé avancés."
        ),
      },
      {
        "num": "2.7", "name": "Épidémio-Watch — Surveillance Épidémique",
        "subtitle": "Veille épidémiologique nationale avec alerte précoce",
        "intro": (
            "Épidémio-Watch est le système de surveillance épidémiologique en temps réel du Ndamatou, "
            "connecté au réseau national de santé et aux bases de données de l'OMS. "
            "Il surveille en permanence l'évolution de six maladies prioritaires au Sénégal "
            "et génère des alertes précoces pour permettre une mobilisation rapide des ressources."
        ),
        "features": [
            "Surveillance en continu de 6 maladies : paludisme, choléra, dengue, méningite, COVID, rougeole",
            "Carte épidémique interactive du Sénégal avec niveaux d'alerte par région",
            "Transmission automatique des alertes conformément aux standards OMS",
            "Terminal de données live avec logs des événements en temps réel",
            "Corrélations automatisées entre données météorologiques et risque épidémique",
            "Module de prédiction des flux médicaux lors du Grand Magal (3 millions de pèlerins)",
            "Rapports hebdomadaires automatiques transmis au Ministère de la Santé",
        ],
        "valeur": (
            "La détection précoce des foyers épidémiques est avancée de 72 heures en moyenne, "
            "permettant une mobilisation des ressources avant que l'épidémie ne se propage. "
            "La réponse sanitaire nationale est ainsi mieux coordonnée et plus efficiente."
        ),
        "innovation": (
            "La corrélation en temps réel entre les données de précipitations, la mobilité "
            "humaine (notamment lors des grands rassemblements religieux) et le risque épidémique "
            "est une approche prédictive inédite dans le contexte sahélien africain."
        ),
      },
      {
        "num": "2.8", "name": "Don & Diaspora — Financement Solidaire",
        "subtitle": "Collecte de fonds auprès de la diaspora et des donateurs internationaux",
        "intro": (
            "Don & Diaspora est la plateforme de financement participatif du Ndamatou, "
            "conçue pour mobiliser la générosité de la diaspora sénégalaise et des donateurs "
            "internationaux au bénéfice de l'hôpital de Touba. Elle garantit la transparence "
            "totale de l'utilisation des fonds collectés."
        ),
        "features": [
            "Création et gestion de campagnes de financement ciblées par équipement ou projet",
            "Paiement sécurisé via Wave, Orange Money, PayPal et virement bancaire international",
            "Tableau de bord de transparence en temps réel : fonds collectés vs objectifs",
            "Certification fiscale automatique pour les donateurs éligibles à la déduction",
            "Réseau actif de donateurs dans 15 pays, dont France, Italie, USA, Espagne",
            "Rapports d'utilisation des fonds audités et publiés sur la plateforme",
            "Système de communication ciblée avec la communauté des donateurs",
        ],
        "valeur": (
            "L'objectif de collecte est fixé à 500 millions de FCFA sur 3 ans, avec "
            "1 247 donateurs actifs dès l'ouverture. Ces fonds permettent de financer "
            "des équipements médicaux critiques inaccessibles par les seuls budgets publics."
        ),
        "innovation": (
            "C'est la première plateforme hospitalière sénégalaise à intégrer simultanément "
            "les paiements mobiles africains (Wave, Orange Money) et les paiements internationaux "
            "(PayPal, SWIFT), rendant la générosité de la diaspora accessible sans friction."
        ),
      },
    ],
  },
  {
    "id": "event", "num": 3,
    "title": "Événementiel, Mobilité & Durabilité",
    "subtitle": "Grands rassemblements, gestion de crise et responsabilité environnementale — 4 applications",
    "intro": (
        "La troisième partie de l'écosystème répond aux défis spécifiques liés au contexte unique "
        "du Ndamatou : l'accueil médical de millions de pèlerins lors du Grand Magal de Touba, "
        "la gestion des situations de crise à forte montée en charge, l'autonomie mobile "
        "des patients et la transition vers un hôpital respectueux de l'environnement."
    ),
    "apps": [
      {
        "num": "3.1", "name": "Touba MedCare — Médecine du Grand Magal",
        "subtitle": "Dispositif médical exceptionnel pour 3 millions de pèlerins",
        "intro": (
            "Touba MedCare est l'application médicale dédiée au Grand Magal de Touba, "
            "le plus grand rassemblement religieux d'Afrique avec près de 3 millions de participants. "
            "Elle coordonne le déploiement de l'ensemble du dispositif sanitaire : postes médicaux, "
            "personnels, ambulances et stocks de médicaments spécifiques à l'événement."
        ),
        "features": [
            "Carte interactive des 6 zones médicales du Grand Magal avec mise à jour temps réel",
            "Coordination de 47 postes médicaux géolocalisés sur l'ensemble de la ville",
            "Gestion de 200 médecins et personnels paramédicaux déployés simultanément",
            "Suivi de 15 ambulances dédiées avec dispatch prioritaire durant l'événement",
            "Compteur de flux pèlerins en temps réel avec modélisation des zones à risque",
            "Protocoles médicaux spécifiques : déshydratation, bousculade, urgences foule",
            "Gestion des stocks de médicaments spéciaux pré-positionnés pour le Magal",
        ],
        "valeur": (
            "Le Grand Magal représente chaque année un défi sanitaire considérable. "
            "Touba MedCare permet d'assurer des soins à plus d'un million de pèlerins "
            "sur trois jours, avec zéro épidémie signalée depuis le déploiement du système. "
            "Ce dispositif protège la réputation internationale du pèlerinage."
        ),
        "innovation": (
            "Touba MedCare est le seul système de santé au monde spécifiquement dimensionné "
            "et optimisé pour un rassemblement religieux de 3 millions de personnes. "
            "Son approche de prépositionnement intelligent des ressources médicales "
            "basée sur la modélisation des flux de pèlerins est une innovation mondiale."
        ),
      },
      {
        "num": "3.2", "name": "Magal Surge — Cellule de Crise",
        "subtitle": "Gestion numérique des situations de crise et de montée en charge",
        "intro": (
            "Magal Surge est le système de gestion de crise du Ndamatou, activable en cas "
            "de montée en charge exceptionnelle des urgences, que ce soit lors du Grand Magal, "
            "d'une catastrophe naturelle ou d'une épidémie soudaine. Il centralise toutes "
            "les décisions et assure leur traçabilité complète."
        ),
        "features": [
            "5 niveaux d'alerte progressifs avec procédures d'escalade définies",
            "Tableau de bord KPIs en temps réel : admissions, saturation, ressources disponibles",
            "Grille de saturation par service avec seuils d'alerte paramétrables",
            "Compteur d'admissions par heure avec projection de saturation",
            "Timeline des décisions prises horodatées et attribuées à chaque responsable",
            "Mobilisation du personnel supplémentaire en un clic avec confirmation",
            "Modal d'escalade avec traçabilité complète et notification automatique",
        ],
        "valeur": (
            "Le temps de réponse à une crise est réduit de 60 % grâce à la centralisation "
            "des informations et des décisions. Aucune décision n'est prise sans être tracée, "
            "ce qui facilite le retour d'expérience et l'amélioration continue "
            "du dispositif de gestion de crise."
        ),
        "innovation": (
            "Magal Surge est la première cellule de crise entièrement numérique pour un hôpital "
            "d'Afrique subsaharienne. Elle transforme la gestion du chaos en processus structuré, "
            "documenté et reproductible, conforme aux standards de gestion de crise "
            "des organisations internationales de santé."
        ),
      },
      {
        "num": "3.3", "name": "Éco-Hôpital — Gestion Environnementale",
        "subtitle": "Énergie, eau, déchets et certification ISO 14001",
        "intro": (
            "Éco-Hôpital est la solution de gestion environnementale du Ndamatou. "
            "Elle pilote en temps réel les consommations énergétiques, la production solaire, "
            "la gestion de l'eau et le tri des déchets médicaux. Son objectif est de conduire "
            "le Ndamatou vers la certification ISO 14001 et d'en faire un modèle d'hôpital "
            "vert pour l'Afrique."
        ),
        "features": [
            "Monitoring de la consommation électrique en temps réel par bâtiment et par service",
            "Intégration et suivi de la production photovoltaïque (34 % de l'énergie produite)",
            "Gestion et optimisation de la consommation d'eau avec récupération des eaux pluviales",
            "Suivi du tri des déchets médicaux avec taux de conformité de 82 %",
            "Score environnemental global B+ (73/100) avec indicateurs détaillés",
            "Graphiques de consommation semaine/mois/an pour comparaison et analyse",
            "Plan d'action pour l'obtention de la certification ISO 14001",
        ],
        "valeur": (
            "Les économies réalisées sur les consommations énergétiques s'élèvent à "
            "180 millions de FCFA par an. L'empreinte carbone de l'hôpital est réduite de 40 %, "
            "ce qui représente un engagement environnemental fort et une réduction "
            "des charges opérationnelles durables."
        ),
        "innovation": (
            "Le jumelage numérique entre l'hôpital et ses flux environnementaux — énergie, eau, "
            "déchets — pour une optimisation continue est une approche encore peu répandue "
            "dans les hôpitaux africains. Éco-Hôpital fait du Ndamatou un pionnier "
            "du développement durable hospitalier sur le continent."
        ),
      },
      {
        "num": "3.4", "name": "Patient Mobile — Application PWA",
        "subtitle": "Tous les services Ndamatou depuis un smartphone",
        "intro": (
            "Patient Mobile est l'application mobile progressive (PWA) du Ndamatou, installable "
            "sur tout smartphone sans passer par un app store. Elle donne accès à l'ensemble "
            "des services hospitaliers depuis n'importe où, y compris en connexion 2G, "
            "rendant le Ndamatou accessible au plus grand nombre."
        ),
        "features": [
            "Interface smartphone intuitive, optimisée pour les écrans de toutes tailles",
            "QR code personnel d'accès au dossier médical, utilisable à l'accueil",
            "Prise de rendez-vous et annulation depuis le téléphone en moins de 2 minutes",
            "Consultation des résultats d'analyses sur mobile dès validation",
            "Paiement Wave et Orange Money intégré pour régler les actes médicaux",
            "Bouton SOS urgence géolocalisé avec transmission immédiate au centre 15",
            "Carnet de vaccination numérique présentable lors des contrôles sanitaires",
        ],
        "valeur": (
            "80 % des démarches administratives et médicales peuvent être effectuées sans "
            "déplacement à l'hôpital. L'autonomie du patient est totale et le service "
            "d'accueil est déchargé des demandes d'information de routine, "
            "lui permettant de se concentrer sur les cas complexes."
        ),
        "innovation": (
            "La technologie PWA (Progressive Web App) permet à Patient Mobile d'être "
            "installée sur tout type de téléphone, y compris les modèles bas de gamme, "
            "et de fonctionner même avec une connexion 2G. C'est un choix d'inclusion "
            "numérique fort, adapté au contexte sénégalais."
        ),
      },
    ],
  },
  {
    "id": "ia", "num": 4,
    "title": "Intelligence Artificielle & Formation",
    "subtitle": "Diagnostic IA, prédiction et apprentissage médical — 6 applications",
    "intro": (
        "La quatrième et dernière partie de l'écosystème Ndamatou représente la dimension "
        "la plus avant-gardiste de la transformation numérique. Ces six applications "
        "d'intelligence artificielle et de formation médicale positionnent le Ndamatou "
        "à la pointe de l'innovation mondiale en matière de santé, tout en renforçant "
        "les compétences du personnel médical sénégalais."
    ),
    "apps": [
      {
        "num": "4.1", "name": "Triage IA — ChatBot Wolof & Français",
        "subtitle": "Premier chatbot médical de triage en langue wolof au monde",
        "intro": (
            "Triage IA est un chatbot médical bilingue Wolof-Français conçu pour assister "
            "les patients à l'entrée des urgences du Ndamatou. En comprenant la langue "
            "maternelle de 50 % de la population sénégalaise, il rend le premier contact "
            "médical plus accessible, plus rapide et plus précis."
        ),
        "features": [
            "Reconnaissance et compréhension du wolof naturel par traitement du langage (NLP)",
            "Classification automatique des urgences en trois niveaux de priorité (P1, P2, P3)",
            "Orientation automatique vers le service médical adapté à la situation du patient",
            "Disponibilité permanente 24h/24 sans nécessiter la présence d'un infirmier triageur",
            "Extension progressive vers le pulaar, le sérère et d'autres langues nationales",
            "Statistiques en temps réel sur les motifs de consultation et les flux de patients",
            "Escalade automatique vers un médecin en cas de détection d'une urgence vitale (P1)",
        ],
        "valeur": (
            "Le temps de triage est réduit de 50 %, les erreurs d'orientation diminuent de 80 %. "
            "La charge des infirmiers triageurs est significativement allégée, leur permettant "
            "de se concentrer sur la prise en charge directe des patients les plus graves."
        ),
        "innovation": (
            "Triage IA est le premier chatbot médical au monde entraîné spécifiquement "
            "sur le wolof et ses expressions médicales. Son modèle NLP adapté aux langues "
            "africaines représente une avancée technologique majeure pour l'accès "
            "aux soins dans les pays francophones et wolofphones."
        ),
      },
      {
        "num": "4.2", "name": "NeuroScan IA — Assistant Radiologique",
        "subtitle": "Analyse automatisée des images cérébrales par intelligence artificielle",
        "intro": (
            "NeuroScan IA est un assistant radiologique basé sur l'intelligence artificielle, "
            "dédié à l'analyse des images cérébrales (IRM, TDM, EEG). Il assiste les médecins "
            "du Ndamatou dans la détection précoce des pathologies neurologiques, notamment "
            "dans un contexte où l'accès à des neuroradiologues spécialisés est limité."
        ),
        "features": [
            "Analyse automatique des images IRM, TDM et EEG cérébrales par réseau de neurones",
            "Détection et localisation des anomalies avec score de confiance associé",
            "Classification des urgences neurologiques en niveaux de priorité P1, P2, P3",
            "Comparaison systématique avec une base de référence de cas similaires",
            "Génération automatique d'un pré-rapport radiologique structuré",
            "File de priorité intelligente pour le passage en lecture des examens",
            "Protocoles cliniques intégrés par type de pathologie détectée",
        ],
        "valeur": (
            "La précision diagnostique atteint 94,2 % sur les pathologies ciblées, "
            "comparable à l'expertise d'un neuroradiologue senior. Le diagnostic est "
            "rendu 48 heures plus rapidement, et trois fois plus de pathologies "
            "sont détectées à un stade précoce, améliorant le pronostic."
        ),
        "innovation": (
            "Le modèle IA de NeuroScan est entraîné sur 50 000 images cérébrales "
            "issues de populations africaines, le rendant particulièrement pertinent "
            "pour les pathologies prévalentes en Afrique subsaharienne. "
            "C'est une adaptation locale d'une technologie de pointe mondiale."
        ),
      },
      {
        "num": "4.3", "name": "IA-Diagnostic — Diagnostic Multi-Pathologies",
        "subtitle": "Assistant IA de diagnostic clinique pour les médecins",
        "intro": (
            "IA-Diagnostic est un outil d'aide à la décision médicale basé sur l'intelligence "
            "artificielle. En analysant les symptômes décrits par le médecin, il génère "
            "une liste de diagnostics différentiels probabilistes, recommande des examens "
            "complémentaires et alerte sur les interactions médicamenteuses."
        ),
        "features": [
            "Analyse simultanée des symptômes multi-organes et des données biologiques",
            "Liste classée de diagnostics différentiels avec probabilités associées",
            "Recommandations personnalisées des examens complémentaires à réaliser",
            "Base de données couvrant plus de 10 000 pathologies référencées",
            "Intégration directe avec le dossier médical pour pré-remplissage automatique",
            "Alertes sur les interactions médicamenteuses potentiellement dangereuses",
            "Second avis IA disponible en moins de 30 secondes pour tout médecin",
        ],
        "valeur": (
            "Le taux d'erreur diagnostique est réduit de 35 % grâce au second avis systématique "
            "de l'IA. Chaque médecin bénéficie d'un soutien équivalent à une consultation "
            "spécialisée pour chaque patient, sans délai ni surcoût pour l'établissement."
        ),
        "innovation": (
            "Le modèle IA est entraîné sur des cohortes africaines, intégrant les pathologies "
            "tropicales et leurs présentations cliniques spécifiques. Il représente "
            "la première IA médicale généraliste véritablement adaptée au contexte "
            "épidémiologique de l'Afrique subsaharienne."
        ),
      },
      {
        "num": "4.4", "name": "Predict IA — Tableau de Bord Prédictif",
        "subtitle": "Anticipation des crises médicales et pilotage par la donnée",
        "intro": (
            "Predict IA est le tableau de bord prédictif de la direction du Ndamatou. "
            "Alimenté par l'ensemble des données générées par les 25 autres applications, "
            "il déploie 5 modèles d'intelligence artificielle pour anticiper les admissions, "
            "détecter précocement les sepsis et prévenir les défaillances d'équipements."
        ),
        "features": [
            "Prédiction du volume d'admissions à 7 jours avec intervalle de confiance",
            "Détection précoce du sepsis avec avance de 12 heures sur le diagnostic clinique",
            "Prédiction des défaillances d'équipements par analyse des données de maintenance",
            "Évaluation du risque de réadmission à 30 jours pour chaque patient à la sortie",
            "Alertes prédictives priorisées transmises aux équipes concernées",
            "5 modèles IA actifs en parallèle, avec une précision moyenne de 94,2 %",
            "Tableau de bord direction mis à jour en temps réel avec indicateurs clés",
        ],
        "valeur": (
            "Les économies générées par l'anticipation représentent 120 millions de FCFA par an. "
            "La détection précoce du sepsis est celle qui sauve le plus de vies, "
            "cette complication étant responsable d'une mortalité hospitalière importante. "
            "Le Ndamatou passe d'une gestion réactive à une gestion proactive."
        ),
        "innovation": (
            "L'interconnexion de 5 modèles IA alimentés par les données temps réel de "
            "26 applications simultanées constitue un niveau de sophistication analytique "
            "inédit dans les hôpitaux africains, comparable aux systèmes des grands "
            "CHU européens et nord-américains."
        ),
      },
      {
        "num": "4.5", "name": "Ndamatou Academy — Formation & Simulation Médicale",
        "subtitle": "Plateforme de formation continue avec simulations de cas cliniques IA",
        "intro": (
            "Ndamatou Academy est la plateforme de formation médicale continue du Ndamatou. "
            "Elle propose des modules interactifs, des simulations de cas cliniques basées "
            "sur des données anonymisées réelles, et des certifications reconnues "
            "par le Ministère de la Santé. Elle fait du Ndamatou un pôle d'excellence "
            "et d'attraction des talents médicaux."
        ),
        "features": [
            "Modules de formation interactifs couvrant toutes les spécialités médicales",
            "Simulations de cas cliniques IA reproduisant des situations réelles anonymisées",
            "Certifications officielles reconnues par le Ministère de la Santé du Sénégal",
            "Staff médical virtuel pour l'entraînement aux procédures et aux diagnostics",
            "Suivi de la progression individuelle avec score détaillé par compétence",
            "Bibliothèque de plus de 500 ressources médicales (vidéos, guides, protocoles)",
            "Formation accessible en présentiel et à distance depuis tout appareil connecté",
        ],
        "valeur": (
            "Les compétences médicales du personnel augmentent de 40 % en moyenne "
            "sur les indicateurs testés. Le Ndamatou devient un centre d'attraction "
            "des meilleurs talents médicaux du Sénégal, qui voient dans cette formation "
            "continue un avantage professionnel majeur."
        ),
        "innovation": (
            "Les simulations médicales IA, qui reproduisent des cas cliniques réels "
            "issus du Ndamatou et anonymisés, offrent un entraînement contextuel "
            "impossible à reproduire par des manuels ou des formations classiques. "
            "C'est l'apprentissage par l'expérience, à la demande et sans risque pour les patients."
        ),
      },
      {
        "num": "4.6", "name": "MedLearn — E-Learning Médical & Certifications",
        "subtitle": "Catalogue complet de formation en ligne pour tout le personnel",
        "intro": (
            "MedLearn est le catalogue d'e-learning médical du Ndamatou, accessible à l'ensemble "
            "du personnel soignant et administratif. Avec 234 modules, 1 247 apprenants actifs "
            "et un système de certification intégré, il crée une culture d'apprentissage "
            "continu au sein de l'établissement."
        ),
        "features": [
            "Catalogue de 234 modules de formation couvrant soins, gestion et réglementation",
            "1 247 apprenants actifs avec progression personnalisée et objectifs individuels",
            "Système de certification intégré avec jury numérique et délivrance automatique",
            "Classement, badges et système de récompenses pour stimuler la motivation",
            "Progression personnalisée par apprenant avec recommandations automatiques",
            "Accès optimisé mobile et tablette, compatible avec les connexions limitées",
            "Partenariats avec les universités médicales sénégalaises pour la validation des crédits",
        ],
        "valeur": (
            "Le taux de complétion des formations atteint 89 %, un niveau exceptionnel "
            "qui témoigne de l'engagement du personnel. Huit certifications sont délivrées "
            "en moyenne chaque mois, renforçant les compétences certifiées "
            "et le niveau général de l'établissement."
        ),
        "innovation": (
            "MedLearn est la plateforme d'e-learning médical la plus complète du système "
            "de santé sénégalais. Son intégration avec les universités médicales pour "
            "la validation des crédits de formation continue représente une innovation "
            "institutionnelle majeure qui valorise l'investissement de chaque apprenant."
        ),
      },
    ],
  },
]

# ── BUILDER ───────────────────────────────────────────────────────────────────
def bullet(text):
    return Paragraph(f"• {text}", ST["bullet"])

def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT, pagesize=A4,
        leftMargin=2*cm, rightMargin=2*cm,
        topMargin=2.2*cm, bottomMargin=2.2*cm,
    )
    elems = []

    # ── COUVERTURE ────────────────────────────────────────────────────────────
    # Spacer pour descendre le contenu (fond bleu dessiné en callback)
    elems.append(Spacer(1, 2.5*cm))

    # Photo hôpital
    if os.path.exists(PHOTO):
        img = RLImage(PHOTO, width=17*cm, height=8.5*cm)
        img.hAlign = "CENTER"
        elems.append(img)

    # Légende photo
    elems.append(Spacer(1, 4*mm))
    elems.append(Paragraph(
        "Centre Hospitalier National Ndamatoul Khadim — Touba, Sénégal",
        ParagraphStyle("ph_cap", fontName="Helvetica", fontSize=9,
                       textColor=HexColor("#94a3b8"), alignment=TA_CENTER, leading=13)
    ))

    elems.append(Spacer(1, 1.2*cm))

    # Titre principal
    elems.append(Paragraph("Ndamatou", ST["cover_main"]))
    elems.append(Paragraph(
        "Écosystème Digital Hospitalier",
        ParagraphStyle("cv2", fontName="Helvetica", fontSize=18,
                       textColor=HexColor("#e2e8f0"), alignment=TA_CENTER, leading=24)
    ))
    elems.append(Spacer(1, 6*mm))

    # Filet or
    elems.append(Table([[""]], colWidths=[17*cm],
                        style=TableStyle([("LINEABOVE",(0,0),(-1,-1),2,LGOLD),
                                          ("TOPPADDING",(0,0),(-1,-1),0),
                                          ("BOTTOMPADDING",(0,0),(-1,-1),0)])))
    elems.append(Spacer(1, 6*mm))

    elems.append(Paragraph("26 Applications • 4 Thèmes • Touba, Sénégal", ST["cover_tag"]))
    elems.append(Spacer(1, 4*mm))
    elems.append(Paragraph(
        "Document de Présentation Stratégique 2026-2030",
        ParagraphStyle("cv3", fontName="Helvetica", fontSize=11,
                       textColor=HexColor("#94a3b8"), alignment=TA_CENTER, leading=15)
    ))
    elems.append(Spacer(1, 8*mm))
    elems.append(Paragraph(
        "Processingenierie  ·  Juin 2026  ·  Confidentiel",
        ParagraphStyle("cv4", fontName="Helvetica", fontSize=9,
                       textColor=HexColor("#64748b"), alignment=TA_CENTER)
    ))

    elems.append(PageBreak())

    # ── SOMMAIRE ──────────────────────────────────────────────────────────────
    elems.append(Spacer(1, 4*mm))
    elems.append(Paragraph("SOMMAIRE", ParagraphStyle("som_h", fontName="Helvetica-Bold",
        fontSize=18, textColor=NAVY, leading=24, spaceAfter=6)))
    elems.append(HRFlowable(width="100%", thickness=2, color=BLUE, spaceAfter=14))

    # Résumé exécutif
    elems.append(Paragraph("Résumé Exécutif & Chiffres Clés", ST["toc_section"]))
    elems.append(HRFlowable(width="100%", thickness=0.3, color=LBORDER, spaceAfter=6))

    for sec in SECTIONS:
        color = SEC_COLOR[sec["id"]]
        elems.append(Spacer(1, 4*mm))
        # Titre de section
        row = [[
            Paragraph(f"Partie {sec['num']}. {sec['title']}", ST["toc_section"]),
            Paragraph(str(sec["num"]), ParagraphStyle("pg", fontName="Helvetica-Bold",
                fontSize=10, textColor=color, alignment=TA_RIGHT, leading=14))
        ]]
        t = Table(row, colWidths=[14*cm, 2*cm])
        t.setStyle(TableStyle([
            ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
            ("LINEAFTER",(0,0),(0,0),2,color),
            ("LEFTPADDING",(0,0),(0,0),6),
            ("TOPPADDING",(0,0),(-1,-1),3),
            ("BOTTOMPADDING",(0,0),(-1,-1),3),
        ]))
        elems.append(t)
        elems.append(HRFlowable(width="100%", thickness=0.3, color=LBORDER, spaceAfter=3))
        for app in sec["apps"]:
            row2 = [[
                Paragraph(f"   {app['num']}. {app['name'].split('—')[0].strip()}", ST["toc_app"]),
                Paragraph("", ST["toc_app"])
            ]]
            t2 = Table(row2, colWidths=[14*cm, 2*cm])
            t2.setStyle(TableStyle([("TOPPADDING",(0,0),(-1,-1),1),("BOTTOMPADDING",(0,0),(-1,-1),1)]))
            elems.append(t2)

    elems.append(Spacer(1, 1*cm))
    elems.append(Paragraph("Conclusion & Appel à l'Action", ST["toc_section"]))
    elems.append(HRFlowable(width="100%", thickness=0.3, color=LBORDER, spaceAfter=6))
    elems.append(PageBreak())

    # ── RÉSUMÉ EXÉCUTIF ───────────────────────────────────────────────────────
    elems.append(Paragraph("Résumé Exécutif", ParagraphStyle("h1e", fontName="Helvetica-Bold",
        fontSize=18, textColor=NAVY, leading=24, spaceAfter=4)))
    elems.append(HRFlowable(width="100%", thickness=2, color=BLUE, spaceAfter=10))

    elems.append(Paragraph("Présentation Générale", ST["h3"]))
    elems.append(Paragraph(
        "Le Centre Hospitalier National Ndamatoul Khadim (Ndamatou) de Touba est l'un des établissements "
        "hospitaliers les plus stratégiques du Sénégal. Par sa situation au cœur de la ville sainte de Touba "
        "et son rôle lors du Grand Magal — le plus grand rassemblement religieux d'Afrique avec près de "
        "3 millions de participants — le Ndamatou est appelé à jouer un rôle de premier plan dans le système "
        "de santé national.", ST["body"]))
    elems.append(Paragraph(
        "Afin de répondre à ce défi et de positionner l'établissement comme une référence de rang mondial, "
        "Processingenierie propose un écosystème complet de 26 applications numériques interconnectées, "
        "couvrant l'intégralité du fonctionnement hospitalier. Ces applications sont organisées en quatre "
        "grandes parties thématiques, allant des fondamentaux cliniques jusqu'aux innovations d'intelligence "
        "artificielle les plus avancées.", ST["body"]))

    elems.append(Spacer(1, 4*mm))
    elems.append(Paragraph("Chiffres Clés de l'Écosystème", ST["h3"]))
    kpis = [
        ("26", "applications\nnumériques"),
        ("3 M", "pèlerins\nsoignés / an"),
        ("94,2 %", "précision\nmoyenne IA"),
        ("500 M", "FCFA collectés\nvisés"),
        ("6", "hôpitaux\nconnectés"),
        ("JCI", "accréditation\ninternationale"),
    ]
    kpi_rows = [[
        [Paragraph(v, ST["kpi_val"]), Paragraph(l.replace("\n","<br/>"), ST["kpi_lbl"])]
        for v, l in kpis
    ]]
    kt = Table(kpi_rows, colWidths=[2.8*cm]*6)
    kt.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,-1),BGLIGHT),
        ("BOX",(0,0),(-1,-1),0.5,LBORDER),
        ("INNERGRID",(0,0),(-1,-1),0.5,LBORDER),
        ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
        ("TOPPADDING",(0,0),(-1,-1),10),
        ("BOTTOMPADDING",(0,0),(-1,-1),10),
    ]))
    elems.append(kt)
    elems.append(Spacer(1, 8*mm))

    elems.append(Paragraph("Les Quatre Piliers de la Transformation Numérique", ST["h3"]))
    for sec in SECTIONS:
        color = SEC_COLOR[sec["id"]]
        row = [[
            Paragraph(f"Partie {sec['num']}", ParagraphStyle("pn", fontName="Helvetica-Bold",
                fontSize=9, textColor=white, leading=12, alignment=TA_CENTER)),
            [Paragraph(sec["title"], ParagraphStyle("pt", fontName="Helvetica-Bold",
                fontSize=11, textColor=NAVY, leading=14)),
             Paragraph(sec["subtitle"], ParagraphStyle("ps", fontName="Helvetica",
                fontSize=9, textColor=LGREY, leading=13))]
        ]]
        t = Table(row, colWidths=[2.2*cm, 14.8*cm])
        t.setStyle(TableStyle([
            ("BACKGROUND",(0,0),(0,0),color),
            ("BACKGROUND",(1,0),(1,0),BGLIGHT),
            ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
            ("LEFTPADDING",(0,0),(0,0),6),
            ("LEFTPADDING",(1,0),(1,0),12),
            ("TOPPADDING",(0,0),(-1,-1),10),
            ("BOTTOMPADDING",(0,0),(-1,-1),10),
            ("BOX",(0,0),(-1,-1),0.5,LBORDER),
        ]))
        elems.append(t)
        elems.append(Spacer(1, 4*mm))

    elems.append(PageBreak())

    # ── SECTIONS ──────────────────────────────────────────────────────────────
    for sec in SECTIONS:
        color = SEC_COLOR[sec["id"]]

        # Page de titre de section
        sec_title_bg = Table([[""]],
            colWidths=[17*cm], rowHeights=[3.5*cm],
            style=TableStyle([
                ("BACKGROUND",(0,0),(-1,-1),color),
                ("BOX",(0,0),(-1,-1),0,color),
            ]))
        elems.append(sec_title_bg)

        # On superpose le texte via une table dans un bloc coloré
        row_sec = [[
            Paragraph(f"Partie {sec['num']}", ParagraphStyle("sn",fontName="Helvetica-Bold",
                fontSize=9,textColor=white,leading=14,letterSpacing=2)),
            Paragraph(sec["title"], ST["sec_title"]),
            Paragraph(sec["subtitle"], ST["sec_sub"]),
        ]]
        # On utilise un tableau empilé vertical
        inner = [
            [Paragraph(f"PARTIE {sec['num']} / 4",
                ParagraphStyle("pnum",fontName="Helvetica-Bold",fontSize=9,
                               textColor=HexColor("#bfdbfe"),leading=12,letterSpacing=1))],
            [Paragraph(sec["title"], ParagraphStyle("stit",fontName="Helvetica-Bold",
                fontSize=22,textColor=white,leading=28))],
            [Paragraph(sec["subtitle"], ParagraphStyle("ssub",fontName="Helvetica",
                fontSize=11,textColor=HexColor("#bfdbfe"),leading=15))],
        ]
        t_inner = Table(inner, colWidths=[17*cm])
        t_inner.setStyle(TableStyle([
            ("BACKGROUND",(0,0),(-1,-1),color),
            ("LEFTPADDING",(0,0),(-1,-1),20),
            ("TOPPADDING",(0,0),(0,0),16),
            ("TOPPADDING",(0,1),(0,1),4),
            ("TOPPADDING",(0,2),(0,2),4),
            ("BOTTOMPADDING",(0,2),(0,2),20),
        ]))
        # Remplacer le bloc précédent par ce tableau
        elems.pop()  # enlever le sec_title_bg vide
        elems.append(t_inner)
        elems.append(Spacer(1, 8*mm))

        # Introduction de section
        elems.append(Paragraph(sec["intro"], ST["body"]))
        elems.append(Spacer(1, 4*mm))
        elems.append(HRFlowable(width="100%", thickness=1, color=color, spaceAfter=12))

        # Applications
        for i, app in enumerate(sec["apps"]):
            app_block = []

            # Numéro + titre
            app_block.append(Paragraph(f"Application {app['num']}", ParagraphStyle(
                "anum", fontName="Helvetica-Bold", fontSize=8,
                textColor=color, leading=12, spaceAfter=2, letterSpacing=1)))
            app_block.append(Paragraph(app["name"], ParagraphStyle(
                "atit", fontName="Helvetica-Bold", fontSize=16,
                textColor=NAVY, leading=21, spaceAfter=2)))
            app_block.append(Paragraph(app["subtitle"], ParagraphStyle(
                "asub", fontName="Helvetica", fontSize=11,
                textColor=LGREY, leading=15, spaceAfter=8)))
            app_block.append(HRFlowable(width="100%", thickness=0.8, color=color, spaceAfter=8))

            # Présentation
            app_block.append(Paragraph("Présentation", ST["h3"]))
            app_block.append(Paragraph(app["intro"], ST["body"]))

            # Fonctionnalités
            app_block.append(Paragraph("Fonctionnalités Principales", ST["h3"]))
            for feat in app["features"]:
                app_block.append(bullet(feat))

            # Valeur ajoutée
            app_block.append(Spacer(1, 4*mm))
            va_box = Table([[
                Paragraph("Valeur Ajoutée", ParagraphStyle("va_h",fontName="Helvetica-Bold",
                    fontSize=9,textColor=GREEN,leading=13,spaceAfter=4)),
                Paragraph(app["valeur"], ParagraphStyle("va_b",fontName="Helvetica",
                    fontSize=9.5,textColor=GREY,leading=14,alignment=TA_JUSTIFY)),
            ]], colWidths=[3.5*cm, 12.5*cm])
            va_box.setStyle(TableStyle([
                ("BACKGROUND",(0,0),(-1,-1),HexColor("#f0fdf4")),
                ("BOX",(0,0),(-1,-1),0.5,HexColor("#bbf7d0")),
                ("LINEBEFORE",(0,0),(0,-1),3,GREEN),
                ("VALIGN",(0,0),(-1,-1),"TOP"),
                ("TOPPADDING",(0,0),(-1,-1),10),
                ("BOTTOMPADDING",(0,0),(-1,-1),10),
                ("LEFTPADDING",(0,0),(0,-1),10),
                ("LEFTPADDING",(1,0),(1,-1),10),
            ]))
            app_block.append(va_box)

            # Innovation
            app_block.append(Spacer(1, 4*mm))
            in_box = Table([[
                Paragraph("Innovation", ParagraphStyle("in_h",fontName="Helvetica-Bold",
                    fontSize=9,textColor=PURPLE,leading=13,spaceAfter=4)),
                Paragraph(app["innovation"], ParagraphStyle("in_b",fontName="Helvetica",
                    fontSize=9.5,textColor=GREY,leading=14,alignment=TA_JUSTIFY)),
            ]], colWidths=[3.5*cm, 12.5*cm])
            in_box.setStyle(TableStyle([
                ("BACKGROUND",(0,0),(-1,-1),HexColor("#faf5ff")),
                ("BOX",(0,0),(-1,-1),0.5,HexColor("#e9d5ff")),
                ("LINEBEFORE",(0,0),(0,-1),3,PURPLE),
                ("VALIGN",(0,0),(-1,-1),"TOP"),
                ("TOPPADDING",(0,0),(-1,-1),10),
                ("BOTTOMPADDING",(0,0),(-1,-1),10),
                ("LEFTPADDING",(0,0),(0,-1),10),
                ("LEFTPADDING",(1,0),(1,-1),10),
            ]))
            app_block.append(in_box)
            app_block.append(Spacer(1, 10*mm))

            if i < len(sec["apps"]) - 1:
                app_block.append(HRFlowable(width="100%", thickness=0.4,
                                             color=LBORDER, spaceAfter=10))

            elems.append(KeepTogether(app_block[:5]))  # garde titre + intro ensemble
            elems.extend(app_block[5:])

        elems.append(PageBreak())

    # ── CONCLUSION ────────────────────────────────────────────────────────────
    elems.append(Paragraph("Conclusion & Appel à l'Action",
        ParagraphStyle("conc_h", fontName="Helvetica-Bold",
            fontSize=18, textColor=NAVY, leading=24, spaceAfter=6)))
    elems.append(HRFlowable(width="100%", thickness=2, color=BLUE, spaceAfter=12))

    elems.append(Paragraph(
        "L'écosystème digital du Ndamatou représente une transformation profonde et durable "
        "du système de santé de Touba et, à terme, du Sénégal tout entier. Chacune des "
        "26 applications a été conçue pour répondre à un besoin réel, mesurable et urgent, "
        "identifié sur le terrain.", ST["body"]))

    elems.append(Paragraph(
        "La mise en oeuvre de cet écosystème permettra au Ndamatou d'atteindre plusieurs "
        "objectifs stratégiques majeurs :", ST["body"]))

    for b in [
        "Obtenir l'accréditation internationale JCI, reconnaissance mondiale de l'excellence des soins",
        "Améliorer significativement la prise en charge des 3 millions de pèlerins du Grand Magal",
        "Réduire les erreurs médicales de 35 % grâce à l'intelligence artificielle",
        "Générer des économies opérationnelles de plus de 400 millions de FCFA par an",
        "Positionner le Ndamatou comme modèle de référence pour la santé numérique en Afrique",
        "Renforcer les compétences du personnel médical par la formation continue numérique",
    ]:
        elems.append(bullet(b))

    elems.append(Spacer(1, 8*mm))
    elems.append(Paragraph(
        "Processingenierie s'engage à accompagner le Ndamatou à chaque étape de cette "
        "transformation — de la formation initiale des équipes jusqu'à l'obtention des "
        "certifications et accréditations visées.", ST["body"]))

    elems.append(Spacer(1, 10*mm))
    cta = Table([[Paragraph(
        "Nous sommes convaincus que les décisions prises aujourd'hui par les autorités "
        "du Ndamatou écriront une page importante de l'histoire de la santé publique "
        "sénégalaise. Nous sommes prêts à démarrer dès votre accord.",
        ParagraphStyle("cta", fontName="Helvetica-Bold", fontSize=11,
                       textColor=NAVY, leading=17, alignment=TA_CENTER)
    )]], colWidths=[17*cm])
    cta.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,-1),BGLIGHT),
        ("BOX",(0,0),(-1,-1),1.5,BLUE),
        ("TOPPADDING",(0,0),(-1,-1),16),
        ("BOTTOMPADDING",(0,0),(-1,-1),16),
        ("LEFTPADDING",(0,0),(-1,-1),20),
        ("RIGHTPADDING",(0,0),(-1,-1),20),
    ]))
    elems.append(cta)
    elems.append(Spacer(1, 12*mm))

    # Contacts
    elems.append(Paragraph("Informations de Contact", ST["h3"]))
    elems.append(HRFlowable(width="100%", thickness=0.5, color=LBORDER, spaceAfter=6))
    for label, val in [
        ("Plateforme en ligne", "hospice-seven.vercel.app"),
        ("Développeur", "Processingenierie — Dakar, Sénégal"),
        ("Contact e-mail", "mamadouastelwane@gmail.com"),
        ("Dépôt GitHub", "github.com/mamadouelimanewane/hopital"),
        ("Version", "1.0 — Juin 2026 — Document Confidentiel"),
    ]:
        row = [[
            Paragraph(label, ParagraphStyle("cl", fontName="Helvetica-Bold",
                fontSize=9, textColor=NAVY, leading=13)),
            Paragraph(val, ParagraphStyle("cv", fontName="Helvetica",
                fontSize=9, textColor=GREY, leading=13)),
        ]]
        ct = Table(row, colWidths=[4.5*cm, 12.5*cm])
        ct.setStyle(TableStyle([
            ("TOPPADDING",(0,0),(-1,-1),4),
            ("BOTTOMPADDING",(0,0),(-1,-1),4),
            ("LINEBELOW",(0,0),(-1,-1),0.3,LBORDER),
        ]))
        elems.append(ct)

    # Build
    doc.build(elems, onFirstPage=cb_cover, onLaterPages=cb_normal)
    size = os.path.getsize(OUTPUT) // 1024
    print(f"PDF OK : {OUTPUT}  ({size} Ko)")

if __name__ == "__main__":
    build_pdf()
