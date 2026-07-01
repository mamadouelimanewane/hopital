"""
Document de présentation PDF de luxe — Écosystème Digital Ndamatou Touba
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm, cm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak,
    Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.pdfgen import canvas
from reportlab.platypus.flowables import Flowable
from reportlab.lib.colors import HexColor, white, black
import os

W, H = A4

# ─── PALETTE ────────────────────────────────────────────────────────────────
NAVY       = HexColor("#0a1628")
NAVY2      = HexColor("#0f2035")
GOLD       = HexColor("#c9a84c")
GOLD2      = HexColor("#f0c674")
EMERALD    = HexColor("#0ea5e9")
SLATE      = HexColor("#334155")
SLATE2     = HexColor("#64748b")
LIGHT      = HexColor("#e2e8f0")
OFFWHITE   = HexColor("#f8fafc")
CRIMSON    = HexColor("#dc2626")
SKY        = HexColor("#0ea5e9")
INDIGO     = HexColor("#6366f1")
AMBER      = HexColor("#f59e0b")

SEC_COLORS = {
    "clinique": HexColor("#0ea5e9"),
    "admin":    HexColor("#0ea5e9"),
    "event":    HexColor("#f59e0b"),
    "ia":       HexColor("#8b5cf6"),
}
SEC_DARK = {
    "clinique": HexColor("#0c2d48"),
    "admin":    HexColor("#0c2e22"),
    "event":    HexColor("#2e1f00"),
    "ia":       HexColor("#1e1040"),
}

OUTPUT = "C:/gravity/hopital/Ndamatou_Presentation_Luxe.pdf"

# ─── CUSTOM FLOWABLES ────────────────────────────────────────────────────────

class ColorRect(Flowable):
    """Rectangle plein coloré."""
    def __init__(self, w, h, color, radius=0):
        self.w, self.h, self.color, self.r = w, h, color, radius
    def draw(self):
        self.canv.setFillColor(self.color)
        self.canv.roundRect(0, 0, self.w, self.h, self.r, fill=1, stroke=0)
    def wrap(self, *args): return self.w, self.h

class GoldLine(Flowable):
    """Filet or décoratif."""
    def __init__(self, width=None, thickness=1):
        self.width = width or (W - 4*cm)
        self.thickness = thickness
    def draw(self):
        self.canv.setStrokeColor(GOLD)
        self.canv.setLineWidth(self.thickness)
        self.canv.line(0, 0, self.width, 0)
    def wrap(self, *args): return self.width, self.thickness + 2

class AppCard(Flowable):
    """Carte détaillée d'une application."""
    def __init__(self, app, section_color):
        self.app = app
        self.sec_color = section_color
        self._calc_height()

    def _calc_height(self):
        self._h = 7.8*cm

    def wrap(self, availW, availH):
        self._w = availW
        return availW, self._h

    def draw(self):
        c = self.canv
        w, h = self._w, self._h
        a = self.app
        sc = self.sec_color

        # Fond de carte
        c.setFillColor(HexColor("#0d1f35"))
        c.roundRect(0, 0, w, h, 6, fill=1, stroke=0)

        # Bande gauche colorée
        c.setFillColor(sc)
        c.roundRect(0, 0, 6, h, 3, fill=1, stroke=0)

        # Bande haute décorative
        c.setFillColor(HexColor(a["hexColor"]))
        c.rect(6, h - 3, w - 6, 3, fill=1, stroke=0)

        # Icône cercle
        cx, cy = 36, h - 30
        c.setFillColor(HexColor(a["hexColor"] + "30"))
        c.circle(cx, cy, 18, fill=1, stroke=0)
        c.setFillColor(HexColor(a["hexColor"]))
        c.setFont("Helvetica-Bold", 9)
        c.drawCentredString(cx, cy - 3, a["icon_text"])

        # Nom de l'app
        c.setFillColor(white)
        c.setFont("Helvetica-Bold", 13)
        c.drawString(62, h - 22, a["name"])

        # Tag
        tag = a.get("tag", "")
        if tag:
            c.setFillColor(HexColor(a["hexColor"] + "30"))
            c.roundRect(62, h - 40, len(tag)*6 + 12, 13, 4, fill=1, stroke=0)
            c.setFillColor(HexColor(a["hexColor"]))
            c.setFont("Helvetica-Bold", 7)
            c.drawString(68, h - 31, tag.upper())

        # Description courte
        c.setFillColor(HexColor("#94a3b8"))
        c.setFont("Helvetica", 9)
        # Tronquer si trop long
        desc = a["desc"]
        if len(desc) > 70: desc = desc[:68] + "…"
        c.drawString(62, h - 54, desc)

        # Séparateur
        c.setStrokeColor(HexColor("#1e3a5f"))
        c.setLineWidth(0.5)
        c.line(14, h - 68, w - 14, h - 68)

        # Fonctionnalités (col gauche)
        features = a.get("features", [])
        c.setFont("Helvetica-Bold", 7.5)
        c.setFillColor(HexColor(a["hexColor"]))
        c.drawString(14, h - 84, "FONCTIONNALITÉS")

        c.setFont("Helvetica", 8)
        c.setFillColor(LIGHT)
        y = h - 97
        for feat in features[:4]:
            c.setFillColor(HexColor(a["hexColor"]))
            c.circle(22, y + 3, 2, fill=1, stroke=0)
            c.setFillColor(LIGHT)
            txt = feat if len(feat) < 48 else feat[:46] + "…"
            c.drawString(27, y, txt)
            y -= 13
        # Suite col droite
        mid = w // 2 + 10
        y2 = h - 97
        for feat in features[4:7]:
            c.setFillColor(HexColor(a["hexColor"]))
            c.circle(mid + 8, y2 + 3, 2, fill=1, stroke=0)
            c.setFillColor(LIGHT)
            txt = feat if len(feat) < 48 else feat[:46] + "…"
            c.drawString(mid + 13, y2, txt)
            y2 -= 13

        # Valeur ajoutée (bas)
        c.setFillColor(HexColor("#0a2e1a"))
        c.roundRect(14, 8, (w - 28) // 2 - 4, 42, 4, fill=1, stroke=0)
        c.setFont("Helvetica-Bold", 6.5)
        c.setFillColor(EMERALD)
        c.drawString(20, 44, "VALEUR AJOUTÉE")
        c.setFont("Helvetica", 7.5)
        c.setFillColor(HexColor("#d1fae5"))
        va = a.get("valeur", "")
        # Wrap manuel simple
        words = va.split()
        lines, line = [], []
        for w2 in words:
            if len(" ".join(line + [w2])) < 42:
                line.append(w2)
            else:
                lines.append(" ".join(line)); line = [w2]
        if line: lines.append(" ".join(line))
        vy = 34
        for l in lines[:3]:
            c.drawString(20, vy, l); vy -= 10

        # Innovation
        mid2 = (w - 28) // 2 + 18
        c.setFillColor(HexColor("#1e1040"))
        c.roundRect(mid2, 8, (w - 28) // 2 - 4, 42, 4, fill=1, stroke=0)
        c.setFont("Helvetica-Bold", 6.5)
        c.setFillColor(HexColor("#a78bfa"))
        c.drawString(mid2 + 6, 44, "INNOVATION")
        c.setFont("Helvetica", 7.5)
        c.setFillColor(HexColor("#e0d7ff"))
        innov = a.get("innovation", "")
        words2 = innov.split()
        lines2, line2 = [], []
        for w3 in words2:
            if len(" ".join(line2 + [w3])) < 42:
                line2.append(w3)
            else:
                lines2.append(" ".join(line2)); line2 = [w3]
        if line2: lines2.append(" ".join(line2))
        vy2 = 34
        for l2 in lines2[:3]:
            c.drawString(mid2 + 6, vy2, l2); vy2 -= 10

        # KPI badge (droite haut)
        kpi = a.get("kpi", "")
        if kpi:
            c.setFillColor(HexColor(a["hexColor"]))
            c.roundRect(w - 100, h - 26, 86, 18, 9, fill=1, stroke=0)
            c.setFillColor(white)
            c.setFont("Helvetica-Bold", 7)
            c.drawCentredString(w - 57, h - 17, kpi)


# ─── PAGE CALLBACKS ──────────────────────────────────────────────────────────

def cover_page(canvas_obj, doc):
    canvas_obj.saveState()
    # Fond sombre dégradé simulé par rectangles
    canvas_obj.setFillColor(NAVY)
    canvas_obj.rect(0, 0, W, H, fill=1, stroke=0)
    canvas_obj.setFillColor(HexColor("#0f2a40"))
    canvas_obj.rect(0, H*0.55, W, H*0.45, fill=1, stroke=0)

    # Motif géométrique décoratif haut
    canvas_obj.setStrokeColor(HexColor("#1a3a5c"))
    canvas_obj.setLineWidth(0.5)
    for i in range(0, int(W)+1, 30):
        canvas_obj.line(i, H*0.55, i, H)
    for j in range(int(H*0.55), int(H)+1, 30):
        canvas_obj.line(0, j, W, j)

    # Bandeau doré haut
    canvas_obj.setFillColor(GOLD)
    canvas_obj.rect(0, H - 8*mm, W, 8*mm, fill=1, stroke=0)
    canvas_obj.setFillColor(GOLD2)
    canvas_obj.rect(0, H - 14*mm, W, 3*mm, fill=1, stroke=0)

    # Bandeau doré bas
    canvas_obj.setFillColor(GOLD)
    canvas_obj.rect(0, 0, W, 8*mm, fill=1, stroke=0)
    canvas_obj.setFillColor(GOLD2)
    canvas_obj.rect(0, 8*mm, W, 3*mm, fill=1, stroke=0)

    # Logo hôpital (cercle + croix)
    cx, cy = W/2, H*0.72
    canvas_obj.setFillColor(HexColor("#0d2035"))
    canvas_obj.circle(cx, cy, 38*mm, fill=1, stroke=0)
    canvas_obj.setStrokeColor(GOLD)
    canvas_obj.setLineWidth(2)
    canvas_obj.circle(cx, cy, 38*mm, fill=0, stroke=1)
    canvas_obj.setStrokeColor(GOLD2)
    canvas_obj.setLineWidth(1)
    canvas_obj.circle(cx, cy, 34*mm, fill=0, stroke=1)
    # Croix médicale
    canvas_obj.setFillColor(GOLD)
    cross_w, cross_h = 14*mm, 14*mm
    canvas_obj.rect(cx - 3.5*mm, cy - cross_h/2, 7*mm, cross_h, fill=1, stroke=0)
    canvas_obj.rect(cx - cross_w/2, cy - 3.5*mm, cross_w, 7*mm, fill=1, stroke=0)
    # Demi-lune
    canvas_obj.setFillColor(GOLD2)
    canvas_obj.setFont("Helvetica-Bold", 28)
    canvas_obj.setFillColor(GOLD2)
    canvas_obj.drawCentredString(cx, cy - 38*mm - 8*mm, "☽")

    # Texte principal
    canvas_obj.setFont("Helvetica-Bold", 9)
    canvas_obj.setFillColor(GOLD)
    canvas_obj.drawCentredString(cx, H*0.55 - 12*mm, "CENTRE HOSPITALIER NATIONAL NdamatouL KHADIM")

    canvas_obj.setFont("Helvetica-Bold", 28)
    canvas_obj.setFillColor(white)
    canvas_obj.drawCentredString(cx, H*0.55 - 30*mm, "Ndamatou")

    canvas_obj.setFont("Helvetica", 11)
    canvas_obj.setFillColor(GOLD2)
    canvas_obj.drawCentredString(cx, H*0.55 - 42*mm, "Touba — République du Sénégal")

    # Filet or
    canvas_obj.setStrokeColor(GOLD)
    canvas_obj.setLineWidth(1.5)
    canvas_obj.line(3*cm, H*0.55 - 52*mm, W - 3*cm, H*0.55 - 52*mm)

    # Titre document
    canvas_obj.setFont("Helvetica-Bold", 22)
    canvas_obj.setFillColor(white)
    canvas_obj.drawCentredString(cx, H*0.55 - 68*mm, "ÉCOSYSTÈME DIGITAL")

    canvas_obj.setFont("Helvetica-Bold", 34)
    canvas_obj.setFillColor(GOLD)
    canvas_obj.drawCentredString(cx, H*0.55 - 90*mm, "26 APPLICATIONS")

    canvas_obj.setFont("Helvetica", 11)
    canvas_obj.setFillColor(HexColor("#94a3b8"))
    canvas_obj.drawCentredString(cx, H*0.55 - 108*mm, "D'AVANT-GARDE MÉDICALES")

    # Filet bas
    canvas_obj.setStrokeColor(GOLD)
    canvas_obj.setLineWidth(1)
    canvas_obj.line(3*cm, H*0.55 - 118*mm, W - 3*cm, H*0.55 - 118*mm)

    # Sous-texte
    canvas_obj.setFont("Helvetica", 9)
    canvas_obj.setFillColor(HexColor("#64748b"))
    canvas_obj.drawCentredString(cx, H*0.55 - 130*mm, "Document confidentiel — Proposition stratégique 2026-2030")

    canvas_obj.setFont("Helvetica-Bold", 8)
    canvas_obj.setFillColor(GOLD)
    canvas_obj.drawCentredString(cx, 16*mm, "PROCESSINGENIERIE  ·  hospice-seven.vercel.app  ·  Juin 2026")

    canvas_obj.restoreState()


def section_divider(canvas_obj, doc, title, subtitle, number, color, dark_color, icon):
    canvas_obj.saveState()
    # Fond
    canvas_obj.setFillColor(dark_color)
    canvas_obj.rect(0, 0, W, H, fill=1, stroke=0)

    # Bande colorée gauche
    canvas_obj.setFillColor(color)
    canvas_obj.rect(0, 0, 12*mm, H, fill=1, stroke=0)

    # Bande colorée droite fine
    canvas_obj.setFillColor(HexColor(color.hexval() + "80") if hasattr(color, 'hexval') else color)
    canvas_obj.setFillColor(color)
    canvas_obj.setStrokeColor(color)
    canvas_obj.setLineWidth(2)
    canvas_obj.line(W - 12*mm, 0, W - 12*mm, H)

    # Motif circulaire décoratif
    canvas_obj.setStrokeColor(color)
    canvas_obj.setLineWidth(0.4)
    canvas_obj.setFillColor(NAVY)
    for r in [60, 90, 120, 150, 180]:
        canvas_obj.circle(W*0.75, H*0.35, r*mm, fill=0, stroke=1)

    # Numéro de section
    canvas_obj.setFont("Helvetica-Bold", 120)
    canvas_obj.setFillColor(color)
    # Opacité simulée par couleur
    canvas_obj.setFillColor(HexColor("#ffffff15"))
    canvas_obj.drawString(W*0.52, H*0.15, str(number))

    # Icône grande
    canvas_obj.setFont("Helvetica-Bold", 52)
    canvas_obj.setFillColor(color)
    canvas_obj.drawString(2*cm, H*0.62, icon)

    # Filet doré
    canvas_obj.setStrokeColor(GOLD)
    canvas_obj.setLineWidth(2)
    canvas_obj.line(2*cm, H*0.58, W - 2*cm, H*0.58)

    # Étape
    canvas_obj.setFont("Helvetica-Bold", 9)
    canvas_obj.setFillColor(GOLD)
    canvas_obj.drawString(2*cm, H*0.54, f"ÉTAPE {number} / 4  ·  PARTIE {number}")

    # Titre
    canvas_obj.setFont("Helvetica-Bold", 28)
    canvas_obj.setFillColor(white)
    canvas_obj.drawString(2*cm, H*0.44, title)

    # Sous-titre
    canvas_obj.setFont("Helvetica", 13)
    canvas_obj.setFillColor(color)
    canvas_obj.drawString(2*cm, H*0.36, subtitle)

    # Filet bas
    canvas_obj.setStrokeColor(GOLD)
    canvas_obj.setLineWidth(1)
    canvas_obj.line(2*cm, H*0.3, W - 2*cm, H*0.3)

    # Note bas
    canvas_obj.setFont("Helvetica", 8)
    canvas_obj.setFillColor(HexColor("#475569"))
    canvas_obj.drawString(2*cm, 2*cm, "Ndamatou Suite — Écosystème Digital — Touba, Sénégal")
    canvas_obj.drawRightString(W - 2*cm, 2*cm, f"Partie {number} / 4")

    canvas_obj.restoreState()


def normal_page(canvas_obj, doc):
    canvas_obj.saveState()
    # Fond sombre
    canvas_obj.setFillColor(NAVY)
    canvas_obj.rect(0, 0, W, H, fill=1, stroke=0)
    # Bande haut fine
    canvas_obj.setFillColor(GOLD)
    canvas_obj.rect(0, H - 5*mm, W, 5*mm, fill=1, stroke=0)
    # Bande bas
    canvas_obj.setFillColor(HexColor("#0f1e35"))
    canvas_obj.rect(0, 0, W, 14*mm, fill=1, stroke=0)
    canvas_obj.setStrokeColor(GOLD)
    canvas_obj.setLineWidth(0.5)
    canvas_obj.line(0, 14*mm, W, 14*mm)
    # En-tête
    canvas_obj.setFont("Helvetica-Bold", 7)
    canvas_obj.setFillColor(GOLD)
    canvas_obj.drawString(2*cm, H - 3.5*mm, "Ndamatou · ÉCOSYSTÈME DIGITAL · TOUBA")
    canvas_obj.setFillColor(HexColor("#475569"))
    canvas_obj.drawRightString(W - 2*cm, H - 3.5*mm, "CONFIDENTIEL · 2026")
    # Pied de page
    canvas_obj.setFont("Helvetica", 7)
    canvas_obj.setFillColor(HexColor("#475569"))
    canvas_obj.drawString(2*cm, 5*mm, "Processingenierie © 2026 · Tous droits réservés")
    canvas_obj.drawRightString(W - 2*cm, 5*mm, f"Page {doc.page}")
    canvas_obj.restoreState()


# ─── STYLES ──────────────────────────────────────────────────────────────────

def make_styles():
    return {
        "h1": ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=20,
                              textColor=white, spaceAfter=6, leading=26),
        "h2": ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=14,
                              textColor=GOLD, spaceAfter=4, leading=18),
        "h3": ParagraphStyle("h3", fontName="Helvetica-Bold", fontSize=11,
                              textColor=EMERALD, spaceAfter=3, leading=14),
        "body": ParagraphStyle("body", fontName="Helvetica", fontSize=9,
                               textColor=LIGHT, spaceAfter=6, leading=13,
                               alignment=TA_JUSTIFY),
        "body_c": ParagraphStyle("body_c", fontName="Helvetica", fontSize=9,
                                  textColor=LIGHT, spaceAfter=4, leading=13,
                                  alignment=TA_CENTER),
        "small": ParagraphStyle("small", fontName="Helvetica", fontSize=8,
                                 textColor=SLATE2, spaceAfter=4, leading=11),
        "label": ParagraphStyle("label", fontName="Helvetica-Bold", fontSize=8,
                                 textColor=GOLD, spaceAfter=2, leading=11,
                                 letterSpacing=1),
        "bullet": ParagraphStyle("bullet", fontName="Helvetica", fontSize=9,
                                  textColor=LIGHT, spaceAfter=3, leading=12,
                                  leftIndent=12, firstLineIndent=-8),
        "kpi_big": ParagraphStyle("kpi_big", fontName="Helvetica-Bold", fontSize=24,
                                   textColor=GOLD, alignment=TA_CENTER, leading=28),
        "kpi_label": ParagraphStyle("kpi_label", fontName="Helvetica", fontSize=8,
                                     textColor=SLATE2, alignment=TA_CENTER, leading=11),
    }


# ─── DONNÉES APPLICATIONS ────────────────────────────────────────────────────

SECTIONS_DATA = [
  {
    "id": "clinique",
    "number": 1,
    "title": "Soins & Gestion Clinique",
    "subtitle": "Les fondamentaux indispensables du quotidien hospitalier",
    "icon": "🏥",
    "apps": [
      {
        "name": "Ndamatou Connect",
        "icon_text": "CNCT",
        "hexColor": "#2563eb",
        "tag": "Portail Patient",
        "desc": "Portail numérique complet pour le parcours patient de bout en bout",
        "features": [
          "Prise de rendez-vous en ligne 24h/24",
          "Téléconsultation vidéo sécurisée",
          "Dossier médical numérique unifié",
          "Ordonnances électroniques",
          "Suivi des constantes vitales",
          "Résultats d'analyses en ligne",
          "Paiement Wave / Orange Money",
        ],
        "valeur": "Réduction de 60% du temps d'attente. Satisfaction patient en hausse de 40%. Désengorgement des urgences.",
        "innovation": "Dossier patient partagé en temps réel entre tous les services. Téléconsultation intégrée au dossier.",
        "kpi": "↑ 40% satisfaction",
        "impact": "Transforme la relation patient-hôpital en une expérience fluide et moderne.",
      },
      {
        "name": "SmartPharma",
        "icon_text": "PHRM",
        "hexColor": "#14b8a6",
        "tag": "Pharmacie Digitale",
        "desc": "Gestion intelligente de la pharmacie, stocks et ordonnances sécurisées",
        "features": [
          "Inventaire temps réel (1 247 références)",
          "Alertes automatiques rupture de stock",
          "Traçabilité blockchain des médicaments",
          "Validation ordonnances électroniques",
          "Alertes péremption proactives",
          "Dispensation sécurisée par QR code",
          "Interface CNAM / mutuelles directe",
        ],
        "valeur": "Zéro rupture critique. Économies de 25M FCFA/an sur les pertes. Erreurs de dispensation quasi-nulles.",
        "innovation": "Blockchain pour la traçabilité complète de chaque médicament du fabricant au patient.",
        "kpi": "0 rupture critique",
        "impact": "Garantit la sécurité médicamenteuse dans tout l'établissement.",
      },
      {
        "name": "BloodSync",
        "icon_text": "BSYN",
        "hexColor": "#ef4444",
        "tag": "Banque de Sang",
        "desc": "Gestion temps réel de la banque de sang et réseau national de donneurs",
        "features": [
          "Stocks en temps réel par groupe sanguin",
          "Alertes SOS urgences transfusion",
          "Base donneurs avec géolocalisation",
          "Compatible réseau national CNTS",
          "Interface urgences automatisée",
          "Rapports bilans sanguins quotidiens",
          "Formulaire de don sécurisé en ligne",
        ],
        "valeur": "Délai d'approvisionnement réduit de 70%. Aucune pénurie mortelle. Extension du réseau de donneurs à +5 000 personnes.",
        "innovation": "Connexion temps réel avec le Centre National de Transfusion Sanguine du Sénégal.",
        "kpi": "-70% délai approvisionnement",
        "impact": "Sauve des vies en situation d'urgence critique.",
      },
      {
        "name": "AmbuTrack",
        "icon_text": "AMBT",
        "hexColor": "#f97316",
        "tag": "Dispatch Urgences",
        "desc": "Tracking GPS et dispatch intelligent des ambulances du Ndamatou",
        "features": [
          "GPS temps réel 7 ambulances",
          "Dispatch intelligent par proximité",
          "ETA calculé dynamiquement",
          "Coordination centre 15 intégrée",
          "Historique de toutes les missions",
          "Formulaire urgence en ligne",
          "Rapport intervention automatique",
        ],
        "valeur": "Temps d'intervention réduit de 35%. Couverture totale de Touba et environs. Coordination optimale des ressources.",
        "innovation": "IA de dispatch basée sur la localisation, le trafic et la priorité médicale simultanément.",
        "kpi": "-35% temps intervention",
        "impact": "Optimise chaque minute précieuse dans les situations d'urgence vitale.",
      },
      {
        "name": "Lab Connect",
        "icon_text": "LABC",
        "hexColor": "#0369a1",
        "tag": "Laboratoire Connecté",
        "desc": "Résultats d'analyses en temps réel, intégrés au dossier patient",
        "features": [
          "Résultats numériques instantanés",
          "Alertes critiques automatiques",
          "Traçabilité complète des échantillons",
          "Intégration directe au dossier patient",
          "Validation biologiste en ligne",
          "Historique analyses par patient",
          "Export PDF automatique",
        ],
        "valeur": "Délai de rendu résultats réduit de 50%. Zéro perte d'échantillon. Alertes critiques en moins de 2 minutes.",
        "innovation": "Connexion directe automate-logiciel-dossier sans aucune ressaisie manuelle.",
        "kpi": "-50% délai résultats",
        "impact": "Accélère la prise de décision médicale sur des données fiables.",
      },
      {
        "name": "Smart Beds",
        "icon_text": "BEDS",
        "hexColor": "#2563eb",
        "tag": "Gestion des Lits",
        "desc": "Optimisation de la capacité hospitalière par gestion intelligente des lits",
        "features": [
          "Disponibilité lits en temps réel",
          "Prédiction des sorties patients",
          "Planification nettoyage & désinfection",
          "Alertes saturation par service",
          "Historique taux d'occupation",
          "Interface brancardiers intégrée",
          "Tableau de bord direction quotidien",
        ],
        "valeur": "Taux d'occupation en hausse de 15%. Rotation des lits optimisée. Fin des files d'attente aux urgences.",
        "innovation": "Algorithme de prédiction des sorties basé sur les diagnostics et durées de séjour moyennes.",
        "kpi": "+15% taux d'occupation",
        "impact": "Maximise la capacité d'accueil sans construire de nouveaux bâtiments.",
      },
      {
        "name": "FactuCare",
        "icon_text": "FACT",
        "hexColor": "#15803d",
        "tag": "Facturation & CNAM",
        "desc": "Facturation automatisée et recouvrement, connecté à la CNAM et mutuelles",
        "features": [
          "Facturation automatique à la sortie",
          "Télétransmission CNAM directe",
          "Suivi remboursements mutuelles",
          "Tableau de bord recouvrement",
          "Échéanciers de paiement",
          "Rapports financiers mensuels",
          "Archivage légal des factures",
        ],
        "valeur": "Taux de recouvrement en hausse de 30%. Délai de facturation réduit de 80%. Conformité CNAM garantie.",
        "innovation": "Télétransmission automatique vers la CNAM sans aucune intervention manuelle.",
        "kpi": "+30% recouvrement",
        "impact": "Améliore significativement la santé financière de l'établissement.",
      },
      {
        "name": "RH Médical",
        "icon_text": "RH",
        "hexColor": "#4338ca",
        "tag": "Ressources Humaines",
        "desc": "Gestion intégrée des ressources humaines médicales et paramédicales",
        "features": [
          "Planning gardes et astreintes",
          "Gestion des compétences et diplômes",
          "Suivi des congés et remplacements",
          "Évaluations annuelles numériques",
          "Formation continue intégrée",
          "Contrats et documents dématérialisés",
          "Paie & indemnités interfacées",
        ],
        "valeur": "Conflits horaires réduits de 90%. Conformité réglementaire totale. Temps RH administratif -60%.",
        "innovation": "Algorithme d'optimisation automatique des plannings de garde sur 4 semaines.",
        "kpi": "-90% conflits horaires",
        "impact": "Libère le personnel médical des contraintes administratives pour se concentrer sur le soin.",
      },
    ],
  },
  {
    "id": "admin",
    "number": 2,
    "title": "Administration, Qualité & Réseau",
    "subtitle": "Pilotage, conformité et coordination nationale",
    "icon": "📋",
    "apps": [
      {
        "name": "Qualité-JCI",
        "icon_text": "QUAL",
        "hexColor": "#1d4ed8",
        "tag": "Accréditation Internationale",
        "desc": "Pilotage de la démarche qualité vers l'accréditation JCI internationale",
        "features": [
          "14 chapitres standards JCI",
          "Indicateurs qualité OMS en temps réel",
          "Gestion des événements indésirables",
          "Calendrier d'audits interne & externe",
          "Analyse des prescriptions (91% conformité)",
          "Rapport d'accréditation exportable",
          "Plan d'amélioration continue",
        ],
        "valeur": "Accréditation JCI : reconnaissance internationale de niveau mondial. Confiance patients et partenaires +200%.",
        "innovation": "Premier hôpital d'Afrique subsaharienne rurale à viser l'accréditation JCI grâce au digital.",
        "kpi": "Accréditation JCI 2027",
        "impact": "Positionne le Ndamatou comme référence africaine en qualité des soins.",
      },
      {
        "name": "Réseau Santé SN",
        "icon_text": "RSLT",
        "hexColor": "#0891b2",
        "tag": "Multi-Hôpitaux",
        "desc": "Réseau de partage inter-hospitalier à l'échelle nationale sénégalaise",
        "features": [
          "6 hôpitaux connectés en temps réel",
          "Dossiers partagés inter-établissements",
          "Gestion des transferts de patients",
          "Reporting automatique Ministère Santé",
          "Indicateurs nationaux unifiés",
          "Télé-expertise médicale entre sites",
          "Carte épidémique nationale",
        ],
        "valeur": "Continuité des soins totale entre hôpitaux. Données nationales fiables pour le MSAS. Élimination des doublons.",
        "innovation": "Infrastructure de santé numérique nationale interconnectée — modèle pour l'Afrique de l'Ouest.",
        "kpi": "6 hôpitaux connectés",
        "impact": "Crée un système de santé cohérent à l'échelle du Sénégal.",
      },
      {
        "name": "NutriCare",
        "icon_text": "NUTR",
        "hexColor": "#d97706",
        "tag": "Nutrition Médicale",
        "desc": "Suivi nutritionnel clinique des patients hospitalisés avec score NRS",
        "features": [
          "Évaluation NRS-2002 systématique",
          "Plans nutritionnels personnalisés",
          "Alertes dénutrition automatiques",
          "Interface avec la cuisine centrale",
          "Suivi IMC et poids quotidien",
          "Rapports diétiticiens intégrés",
          "Protocoles diabète, IRC, pédiatrie",
        ],
        "valeur": "Dénutrition hospitalière réduite de 40%. Durée de séjour réduite de 2 jours en moyenne. Complications post-op -25%.",
        "innovation": "Intégration automatique du score nutritionnel dans les prescriptions médicales.",
        "kpi": "-40% dénutrition",
        "impact": "La nutrition comme levier d'amélioration de tous les résultats cliniques.",
      },
      {
        "name": "RehabTrack",
        "icon_text": "RHBT",
        "hexColor": "#16a34a",
        "tag": "Rééducation & Kiné",
        "desc": "Suivi complet de rééducation physique et kinésithérapie post-opératoire",
        "features": [
          "Suivi progression patient par exercice",
          "Planning kinésithérapie 5 jours",
          "Gestion 8 plateaux d'équipements",
          "Courbes de progression SVG interactives",
          "Objectifs personnalisés par pathologie",
          "Communication médecin-kiné intégrée",
          "Bilans de sortie automatisés",
        ],
        "valeur": "Retour à l'autonomie 35% plus rapide. Saturation des services kiné réduite de 20%. Réadmissions -15%.",
        "innovation": "Algorithme de prescription automatique des séances selon le type de chirurgie réalisée.",
        "kpi": "+35% retour autonomie",
        "impact": "Transforme la rééducation en un processus mesurable et optimisé.",
      },
      {
        "name": "PsychCare",
        "icon_text": "PSYC",
        "hexColor": "#0891b2",
        "tag": "Santé Mentale",
        "desc": "Unité de psychiatrie numérique, confidentielle, inclusive et innovante",
        "features": [
          "Dossiers psychiatriques anonymisés",
          "Programmes TCC structurés",
          "Suivi des programmes groupe",
          "Ligne d'écoute intégrée 24h/24",
          "Art-thérapie & méditation planifiées",
          "Ressources documentaires patients",
          "Reporting confidentiel MSAS",
        ],
        "valeur": "Stigmatisation réduite grâce à l'anonymisation totale. Accès aux soins mentaux élargi à 3x plus de patients.",
        "innovation": "Premier service de psychiatrie numérique en Afrique subsaharienne avec protection totale des données.",
        "kpi": "3x accès soins mentaux",
        "impact": "Brise le tabou de la santé mentale en offrant un cadre sécurisé et confidentiel.",
      },
      {
        "name": "DonOrganes",
        "icon_text": "ORGN",
        "hexColor": "#e11d48",
        "tag": "Registre National",
        "desc": "Registre national de don d'organes, protocoles de greffe et urgences",
        "features": [
          "Registre donneur sécurisé",
          "Gestion liste attente greffes",
          "Compatibilité groupes sanguins IA",
          "Protocoles de transplantation",
          "Alerte urgence greffe en temps réel",
          "Interface 3 centres partenaires",
          "Formulaire consentement numérique",
        ],
        "valeur": "Augmentation du nombre de donneurs de 200%. Délai de mise en relation réduit de 40%. Vies sauvées par greffe.",
        "innovation": "Algorithme de compatibilité IA qui croise groupe sanguin, HLA et urgence médicale en quelques secondes.",
        "kpi": "+200% donneurs",
        "impact": "Sauve des vies en réduisant drastiquement les délais d'attente pour une greffe.",
      },
      {
        "name": "Épidémio-Watch",
        "icon_text": "EPID",
        "hexColor": "#991b1b",
        "tag": "Surveillance Épidémique",
        "desc": "Système de veille épidémiologique en temps réel — alerte précoce nationale",
        "features": [
          "Surveillance 6 maladies prioritaires",
          "Carte épidémique Sénégal interactive",
          "Alertes OMS automatisées",
          "Terminal live des données régionales",
          "Corrélations météo-épidémie par IA",
          "Prédiction du Grand Magal (3M personnes)",
          "Rapports hebdomadaires MSAS",
        ],
        "valeur": "Détection précoce des épidémies avec -72h de délai d'alerte. Mobilisation des ressources avant la crise.",
        "innovation": "Corrélation en temps réel entre précipitations, mobilité humaine et risque épidémique.",
        "kpi": "-72h délai alerte",
        "impact": "Protège la population sénégalaise des épidémies par anticipation.",
      },
      {
        "name": "Don & Diaspora",
        "icon_text": "DIAS",
        "hexColor": "#b45309",
        "tag": "Financement Solidaire",
        "desc": "Plateforme de financement participatif pour la diaspora et les donateurs",
        "features": [
          "Campagnes de financement ciblées",
          "Paiement Wave, Orange Money, PayPal",
          "Virement international sécurisé",
          "Tableau de bord transparence totale",
          "Certificats fiscaux automatiques",
          "Réseau 15 pays de diaspora",
          "Rapport d'utilisation audité",
        ],
        "valeur": "Objectif 500M FCFA. 1 247 donateurs actifs dans 15 pays. Financement des équipements critiques.",
        "innovation": "Première plateforme hospitalière sénégalaise intégrant Wave, Orange Money et paiements internationaux.",
        "kpi": "500M FCFA objectif",
        "impact": "Mobilise la générosité de la diaspora pour moderniser l'hôpital de Touba.",
      },
    ],
  },
  {
    "id": "event",
    "number": 3,
    "title": "Événementiel, Mobilité & Durabilité",
    "subtitle": "Gestion de crise, grands rassemblements et responsabilité environnementale",
    "icon": "🌟",
    "apps": [
      {
        "name": "Touba MedCare",
        "icon_text": "TOUB",
        "hexColor": "#eab308",
        "tag": "Grand Magal",
        "desc": "Dispositif médical exceptionnel pour accueillir 3 millions de pèlerins",
        "features": [
          "Carte interactive 6 zones médicales",
          "47 postes médicaux géolocalisés",
          "200 médecins coordonnés en temps réel",
          "15 ambulances dédiées au Magal",
          "Compteur flux pèlerins en direct",
          "Protocoles déshydratation, foule, épidémie",
          "Stocks médicaments spéciaux Magal",
        ],
        "valeur": "Zéro épidémie lors du Grand Magal. Soins apportés à plus d'1 million de pèlerins sur 3 jours.",
        "innovation": "Unique système de santé au monde dimensionné pour un pèlerinage de 3 millions de personnes.",
        "kpi": "3 millions de pèlerins",
        "impact": "Fait du Ndamatou le gardien de la santé du plus grand rassemblement d'Afrique.",
      },
      {
        "name": "Magal Surge",
        "icon_text": "SURG",
        "hexColor": "#f97316",
        "tag": "Cellule de Crise",
        "desc": "Système de gestion de crise et de montée en charge extrême pour grands événements",
        "features": [
          "5 niveaux d'alerte progressifs",
          "Dashboard KPIs temps réel",
          "Grille saturation 6 services",
          "Compteur admissions/heure live",
          "Timeline des décisions horodatées",
          "Mobilisation personnel en 1 clic",
          "Modal escalade avec traçabilité",
        ],
        "valeur": "Temps de réponse à une crise réduit de 60%. Zéro décision non tracée. Coordination totale en 5 minutes.",
        "innovation": "Cellule de crise entièrement numérique — première en Afrique subsaharienne pour un hôpital.",
        "kpi": "-60% temps réponse crise",
        "impact": "Transforme le chaos de crise en processus maîtrisé et documenté.",
      },
      {
        "name": "Éco-Hôpital",
        "icon_text": "ECO",
        "hexColor": "#22c55e",
        "tag": "Développement Durable",
        "desc": "Gestion environnementale complète — énergie, eau, déchets, certifications",
        "features": [
          "Consommation électrique temps réel",
          "Panneaux solaires intégrés (34%)",
          "Gestion eau et récupération pluie",
          "Tri déchets médicaux (82% conformité)",
          "Score environnemental B+ (73/100)",
          "Graphique consommation semaine/mois",
          "Plan certifications ISO 14001",
        ],
        "valeur": "Économies de 180M FCFA/an sur les énergies. Empreinte carbone réduite de 40%. Certification ISO 14001.",
        "innovation": "Jumelage numérique de l'hôpital avec son empreinte environnementale pour optimisation continue.",
        "kpi": "180M FCFA économies/an",
        "impact": "Fait du Ndamatou un modèle d'hôpital vert et responsable pour l'Afrique.",
      },
      {
        "name": "Patient Mobile",
        "icon_text": "MOBL",
        "hexColor": "#0284c7",
        "tag": "Application PWA",
        "desc": "Application mobile patient — accès à tous les services Ndamatou depuis un smartphone",
        "features": [
          "Interface smartphone intuitive",
          "QR code dossier médical",
          "Prise RDV et annulation mobile",
          "Résultats analyses sur téléphone",
          "Paiement Wave/Orange Money intégré",
          "Bouton SOS urgence géolocalisé",
          "Carnet vaccination numérique",
        ],
        "valeur": "80% des démarches réalisables sans déplacement à l'hôpital. Autonomie patient totale. Désengorgement accueil.",
        "innovation": "PWA installable sur tout smartphone sans app store — accessible même avec connexion 2G.",
        "kpi": "80% démarches sans déplacement",
        "impact": "Démocratise l'accès aux services hospitaliers pour tous les citoyens de Touba.",
      },
    ],
  },
  {
    "id": "ia",
    "number": 4,
    "title": "Intelligence Artificielle & Formation",
    "subtitle": "Innovations IA pour le diagnostic, la prédiction et l'apprentissage médical",
    "icon": "🤖",
    "apps": [
      {
        "name": "Triage IA Wolof",
        "icon_text": "TRIA",
        "hexColor": "#065f46",
        "tag": "Chatbot Médical",
        "desc": "ChatBot de triage médical bilingue Wolof-Français — premier en Afrique",
        "features": [
          "Reconnaissance Wolof naturel (NLP)",
          "Classification urgences P1/P2/P3",
          "Orientation automatique service adapté",
          "Disponible 24h/24 sans infirmier",
          "Intégration pulaar et autres langues",
          "Statistiques traitements en temps réel",
          "Escalade automatique médecin si P1",
        ],
        "valeur": "Temps de triage réduit de 50%. Erreurs d'orientation -80%. Réduction charge infirmiers triageurs.",
        "innovation": "Premier chatbot médical en Wolof au monde. NLP local adapté aux expressions médicales sénégalaises.",
        "kpi": "Premier chatbot médical Wolof",
        "impact": "Rend les soins accessibles dans la langue maternelle de 50% de la population.",
      },
      {
        "name": "NeuroScan IA",
        "icon_text": "NURO",
        "hexColor": "#8b5cf6",
        "tag": "Imagerie Cérébrale IA",
        "desc": "Analyse automatisée des images cérébrales par intelligence artificielle",
        "features": [
          "Analyse IRM/TDM/EEG par IA",
          "Détection automatique anomalies",
          "Score de confiance par diagnostic",
          "File priorité P1/P2/P3 IA",
          "Comparaison avec base de cas",
          "Rapport radiologique automatisé",
          "Protocoles pathologies intégrés",
        ],
        "valeur": "Précision diagnostique de 94,2%. Diagnostic 48h plus rapide. Détection précoce de 3x plus de pathologies.",
        "innovation": "Modèle IA entraîné sur 50 000 images cérébrales africaines — adapté aux pathologies locales.",
        "kpi": "94.2% précision IA",
        "impact": "Donne accès à une expertise neuroradiologique de niveau CHU à Touba.",
      },
      {
        "name": "IA-Diagnostic",
        "icon_text": "DIAG",
        "hexColor": "#7c3aed",
        "tag": "Diagnostic Multi-Pathologies",
        "desc": "Assistant IA de diagnostic clinique multi-pathologies pour médecins",
        "features": [
          "Analyse symptômes multi-organes",
          "Probabilités diagnostiques classées",
          "Recommandations examens complémentaires",
          "Base de 10 000+ pathologies",
          "Intégration dossier médical direct",
          "Alertes interactions médicamenteuses",
          "Second avis IA instantané",
        ],
        "valeur": "Taux d'erreur diagnostique réduit de 35%. Second avis disponible en 30 secondes. Formation continue médecins.",
        "innovation": "IA médicale formée sur des cohortes africaines — pertinente pour les pathologies tropicales.",
        "kpi": "-35% erreurs diagnostiques",
        "impact": "Augmente la capacité diagnostique de chaque médecin comme un spécialiste supplémentaire.",
      },
      {
        "name": "Predict IA",
        "icon_text": "PRED",
        "hexColor": "#6366f1",
        "tag": "Prédictions & Direction",
        "desc": "Tableau de bord prédictif IA pour la direction et la gestion anticipée des flux",
        "features": [
          "Prédiction admissions 7 jours",
          "Détection précoce sepsis (-12h)",
          "Prédiction défaillances équipements",
          "Risque réadmission à 30 jours",
          "Alertes prédictives priorisées",
          "5 modèles IA actifs (94.2% précision)",
          "Tableau de bord Direction temps réel",
        ],
        "valeur": "Économies de 120M FCFA/an par anticipation. Vies sauvées grâce à la détection précoce du sepsis.",
        "innovation": "IA prédictive couplée aux données météo, calendrier événements et historique épidémique Touba.",
        "kpi": "120M FCFA économies/an",
        "impact": "Passe d'un hôpital réactif à un hôpital proactif qui anticipe chaque situation.",
      },
      {
        "name": "Ndamatou Academy",
        "icon_text": "ACAD",
        "hexColor": "#6d28d9",
        "tag": "Formation Médicale",
        "desc": "Plateforme de formation médicale continue avec simulations et cas cliniques",
        "features": [
          "Modules interactifs par spécialité",
          "Simulations de cas cliniques IA",
          "Certifications reconnues MSAS",
          "Staff virtuel pour entraînement",
          "Progression et scores en temps réel",
          "Bibliothèque 500+ ressources",
          "Formation à distance ou présentiel",
        ],
        "valeur": "Compétences médicales en hausse de 40%. Formation continue sans quitter Touba. Attractivité du Ndamatou x3.",
        "innovation": "Simulations médicales IA qui reproduisent des cas cliniques réels anonymisés du Ndamatou.",
        "kpi": "+40% compétences médicales",
        "impact": "Fait du Ndamatou un pôle d'excellence et d'attraction des meilleurs talents médicaux du Sénégal.",
      },
      {
        "name": "MedLearn",
        "icon_text": "LERN",
        "hexColor": "#f59e0b",
        "tag": "E-Learning & Certifications",
        "desc": "Plateforme e-learning médicale complète avec catalogue, progression et classement",
        "features": [
          "234 modules médicaux disponibles",
          "1 247 apprenants actifs",
          "Système de certification intégré",
          "Classement et badges de motivation",
          "Progression personnalisée par apprenant",
          "Accès mobile et tablette",
          "Partenariats universités médicales SN",
        ],
        "valeur": "89% de taux de complétion. 8 certifications délivrées par mois. Réseau d'excellence médicale national.",
        "innovation": "Plateforme e-learning la plus complète du système de santé sénégalais, interconnectée avec les universités.",
        "kpi": "89% taux complétion",
        "impact": "Crée une culture d'apprentissage continu au sein de tout le personnel du Ndamatou.",
      },
    ],
  },
]

GLOBAL_KPIS = [
    ("26", "Applications\nOpérationnelles"),
    ("3M", "Pèlerins\nsoignés/an"),
    ("94.2%", "Précision\nIA diagnostique"),
    ("500M", "FCFA\ncollectés visés"),
    ("JCI", "Accréditation\ninternationale"),
    ("6", "Hôpitaux\nconnectés"),
]


# ─── BUILD PDF ───────────────────────────────────────────────────────────────

class PDFBuilder:
    def __init__(self):
        self.elements = []
        self.styles = make_styles()
        self._page_callbacks = []

    def P(self, text, style="body"):
        self.elements.append(Paragraph(text, self.styles[style]))

    def SP(self, h=6):
        self.elements.append(Spacer(1, h))

    def HR(self, color=None, thickness=0.5):
        self.elements.append(HRFlowable(
            width="100%", thickness=thickness,
            color=color or GOLD, spaceAfter=4, spaceBefore=4
        ))

    def build(self):
        doc = SimpleDocTemplate(
            OUTPUT, pagesize=A4,
            leftMargin=2*cm, rightMargin=2*cm,
            topMargin=1.6*cm, bottomMargin=1.8*cm,
        )

        # Première page = cover
        self._build_cover()
        self.elements.append(PageBreak())

        # Sommaire
        self._build_toc()
        self.elements.append(PageBreak())

        # Résumé exécutif
        self._build_executive_summary()
        self.elements.append(PageBreak())

        # Les 4 sections
        for sec in SECTIONS_DATA:
            self._build_section(sec)

        # Conclusion
        self._build_conclusion()

        def first_page(c, d):
            cover_page(c, d)

        def later_pages(c, d):
            normal_page(c, d)

        doc.build(self.elements, onFirstPage=first_page, onLaterPages=later_pages)
        print(f"✅ PDF généré : {OUTPUT}")

    def _build_cover(self):
        # La cover est entièrement dessinée dans le callback
        # On ajoute juste un spacer pour forcer la page
        pass

    def _build_toc(self):
        st = self.styles
        self.SP(8)
        self.P("TABLE DES MATIÈRES", "label")
        self.HR(GOLD, 1.5)
        self.SP(10)

        toc_items = [
            ("Résumé Exécutif", "3"),
            ("", ""),
            ("PARTIE 1 — Soins & Gestion Clinique", "4"),
            ("  1.1  Ndamatou Connect — Portail Patient", "5"),
            ("  1.2  SmartPharma — Pharmacie Intelligente", "5"),
            ("  1.3  BloodSync — Banque de Sang", "6"),
            ("  1.4  AmbuTrack — Ambulances GPS", "6"),
            ("  1.5  Lab Connect — Laboratoire Connecté", "7"),
            ("  1.6  Smart Beds — Gestion des Lits", "7"),
            ("  1.7  FactuCare — Facturation & CNAM", "8"),
            ("  1.8  RH Médical — Ressources Humaines", "8"),
            ("", ""),
            ("PARTIE 2 — Administration, Qualité & Réseau", "9"),
            ("  2.1 à 2.8  Qualité-JCI · Réseau SN · NutriCare · RehabTrack", "10-13"),
            ("               PsychCare · DonOrganes · Épidémio-Watch · Don & Diaspora", ""),
            ("", ""),
            ("PARTIE 3 — Événementiel, Mobilité & Durabilité", "14"),
            ("  3.1 à 3.4  Touba MedCare · Magal Surge · Éco-Hôpital · Patient Mobile", "15-17"),
            ("", ""),
            ("PARTIE 4 — Intelligence Artificielle & Formation", "18"),
            ("  4.1 à 4.6  Triage IA · NeuroScan · IA-Diagnostic · Predict · Academy · MedLearn", "19-22"),
            ("", ""),
            ("Conclusion & Appel à l'Action", "23"),
        ]

        for title, page in toc_items:
            if not title:
                self.SP(4)
                continue
            is_main = title.startswith("PARTIE")
            data = [[
                Paragraph(title, ParagraphStyle(
                    "toc", fontName="Helvetica-Bold" if is_main else "Helvetica",
                    fontSize=10 if is_main else 8.5,
                    textColor=GOLD if is_main else LIGHT,
                    leading=13
                )),
                Paragraph(page, ParagraphStyle(
                    "toc_p", fontName="Helvetica-Bold" if is_main else "Helvetica",
                    fontSize=9, textColor=GOLD if is_main else SLATE2,
                    alignment=TA_CENTER, leading=13
                ))
            ]]
            t = Table(data, colWidths=[14*cm, 2*cm])
            t.setStyle(TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 4 if is_main else 2),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4 if is_main else 2),
                ("LINEBELOW", (0, 0), (-1, -1), 0.3, HexColor("#1e3a5f")),
            ] + ([("BACKGROUND", (0, 0), (-1, -1), HexColor("#0d1f35")),
                  ("LEFTPADDING", (0, 0), (0, 0), 8)] if is_main else [])))
            self.elements.append(t)

        self.SP(16)
        self.P("Ce document est strictement confidentiel et destiné exclusivement aux autorités du Ndamatou et aux décideurs institutionnels. Toute reproduction est interdite sans autorisation écrite de Processingenierie.", "small")

    def _build_executive_summary(self):
        st = self.styles
        self.SP(8)
        self.P("RÉSUMÉ EXÉCUTIF", "label")
        self.HR(GOLD, 1.5)
        self.SP(10)
        self.P("Vision Stratégique 2026-2030", "h1")
        self.SP(6)

        intro = (
            "Le Centre Hospitalier National Ndamatoul Khadim (Ndamatou) de Touba est appelé à devenir "
            "le fleuron de la santé publique sénégalaise et une référence de rang mondial. "
            "Pour y parvenir, <b>Processingenierie</b> a conçu un écosystème de <b>26 applications digitales "
            "interconnectées</b>, couvrant l'intégralité du fonctionnement hospitalier, de la relation patient "
            "aux outils d'intelligence artificielle de pointe."
        )
        self.elements.append(Paragraph(intro, st["body"]))
        self.SP(10)

        # KPIs globaux
        self.P("Chiffres Clés de l'Écosystème", "h2")
        self.SP(6)

        kpi_data = []
        row = []
        for i, (val, label) in enumerate(GLOBAL_KPIS):
            cell_content = [
                Paragraph(val, st["kpi_big"]),
                Paragraph(label.replace("\n", "<br/>"), st["kpi_label"]),
            ]
            row.append(cell_content)
            if (i + 1) % 3 == 0:
                kpi_data.append(row)
                row = []
        if row:
            while len(row) < 3:
                row.append([Paragraph("", st["body"])])
            kpi_data.append(row)

        kpi_table = Table(kpi_data, colWidths=[5.3*cm, 5.3*cm, 5.3*cm])
        kpi_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), HexColor("#0d1f35")),
            ("GRID", (0, 0), (-1, -1), 0.5, HexColor("#1e3a5f")),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("TOPPADDING", (0, 0), (-1, -1), 12),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
            ("ROWBACKGROUNDS", (0, 0), (-1, -1), [HexColor("#0d1f35"), HexColor("#0a1628")]),
        ]))
        self.elements.append(kpi_table)
        self.SP(14)

        # 4 piliers
        self.P("Les 4 Piliers de la Transformation", "h2")
        self.SP(6)

        pillars = [
            (SEC_COLORS["clinique"], "Étape 1", "Soins & Clinique",
             "8 applications couvrent la totalité du parcours de soin quotidien : portail patient, pharmacie, urgences, laboratoire, lits, facturation et RH."),
            (SEC_COLORS["admin"], "Étape 2", "Administration & Qualité",
             "8 applications assurent la conformité JCI, le réseau inter-hôpitaux, la nutrition, la rééducation, la psychiatrie et la surveillance épidémique."),
            (SEC_COLORS["event"], "Étape 3", "Événementiel & Durabilité",
             "4 applications gèrent le Grand Magal (3M pèlerins), les crises, l'empreinte environnementale et l'autonomie mobile du patient."),
            (SEC_COLORS["ia"], "Étape 4", "IA & Formation",
             "6 applications d'intelligence artificielle révolutionnent le diagnostic, la prédiction et la formation continue du personnel médical."),
        ]

        pillar_rows = []
        for color, num, title, desc in pillars:
            row_data = [
                [Paragraph(num, ParagraphStyle("pill_num", fontName="Helvetica-Bold",
                                               fontSize=9, textColor=color, leading=12)),
                 Paragraph(title, ParagraphStyle("pill_title", fontName="Helvetica-Bold",
                                                  fontSize=11, textColor=white, leading=14)),
                 Paragraph(desc, ParagraphStyle("pill_desc", fontName="Helvetica", fontSize=8.5,
                                                 textColor=LIGHT, leading=12, alignment=TA_JUSTIFY))],
            ]
            t = Table(row_data, colWidths=[2*cm, 4.5*cm, 9.5*cm])
            t.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), HexColor("#0d1f35")),
                ("LEFTPADDING", (0, 0), (0, 0), 10),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                ("LINEAFTER", (0, 0), (0, 0), 3, color),
                ("LINEAFTER", (1, 0), (1, 0), 0.5, HexColor("#1e3a5f")),
                ("LINEBELOW", (0, 0), (-1, 0), 0.5, HexColor("#1e3a5f")),
            ]))
            self.elements.append(t)
            self.SP(4)

        self.SP(10)
        quote = (
            "« Le Ndamatou de Touba ne sera pas seulement le meilleur hôpital du Sénégal. "
            "Il sera le modèle de référence que l'Afrique entière viendra étudier. »"
        )
        self.elements.append(Paragraph(quote, ParagraphStyle(
            "quote", fontName="Helvetica-Bold", fontSize=11, textColor=GOLD2,
            alignment=TA_CENTER, leading=16, leftIndent=2*cm, rightIndent=2*cm,
            spaceAfter=6
        )))
        self.P("— Processingenierie, Partenaire Technologique du Ndamatou", "body_c")

    def _build_section(self, sec):
        color = SEC_COLORS[sec["id"]]
        dark = SEC_DARK[sec["id"]]
        st = self.styles

        # Page de séparation de section (dessinée en callback)
        class SectionDividerPage(Flowable):
            def __init__(self, sec_data, clr, d_clr):
                self.s = sec_data
                self.c = clr
                self.d = d_clr
            def draw(self):
                section_divider(self.canv, None,
                                self.s["title"], self.s["subtitle"],
                                self.s["number"], self.c, self.d, self.s["icon"])
            def wrap(self, w, h):
                return W, H

        # Forcer une pleine page
        self.elements.append(PageBreak())
        sdp = SectionDividerPage(sec, color, dark)
        # On ne peut pas facilement insérer une page de section dessinée avec callback
        # On va plutôt créer une "page de couverture" en utilisant une table pleine page
        self._build_section_header_inline(sec, color, dark)
        self.elements.append(PageBreak())

        # Apps
        for app in sec["apps"]:
            card = AppCard(app, color)
            self.elements.append(KeepTogether([card, Spacer(1, 10)]))

        self.elements.append(PageBreak())

    def _build_section_header_inline(self, sec, color, dark):
        st = self.styles
        self.SP(10)

        # Bandeau section
        data = [[
            Paragraph(f"<font color='#{color.hexval()[2:]}'>ÉTAPE {sec['number']} / 4</font>",
                      ParagraphStyle("sh_tag", fontName="Helvetica-Bold", fontSize=9,
                                     textColor=GOLD, leading=12)),
            Paragraph(sec["icon"] + "  " + sec["title"],
                      ParagraphStyle("sh_title", fontName="Helvetica-Bold", fontSize=20,
                                     textColor=white, leading=24)),
            Paragraph(sec["subtitle"],
                      ParagraphStyle("sh_sub", fontName="Helvetica", fontSize=10,
                                     textColor=color, leading=13)),
        ]]
        t = Table([[Paragraph(sec["icon"], ParagraphStyle("ico", fontSize=40, leading=50)),
                    [
                        Paragraph(f"ÉTAPE {sec['number']} / 4  ·  {len(sec['apps'])} APPLICATIONS",
                                  ParagraphStyle("tag", fontName="Helvetica-Bold", fontSize=8,
                                                 textColor=color, leading=12, letterSpacing=1)),
                        Spacer(1, 4),
                        Paragraph(sec["title"],
                                  ParagraphStyle("t", fontName="Helvetica-Bold", fontSize=22,
                                                 textColor=white, leading=26)),
                        Spacer(1, 4),
                        Paragraph(sec["subtitle"],
                                  ParagraphStyle("s", fontName="Helvetica", fontSize=10,
                                                 textColor=color, leading=13)),
                    ]
                   ]],
                  colWidths=[2*cm, 14*cm])
        t.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), dark),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("LEFTPADDING", (0, 0), (-1, -1), 14),
            ("RIGHTPADDING", (0, 0), (-1, -1), 14),
            ("TOPPADDING", (0, 0), (-1, -1), 16),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 16),
            ("LINEAFTER", (0, 0), (0, 0), 4, color),
            ("LINEBEFORE", (0, 0), (0, 0), 4, color),
            ("LINEBELOW", (0, 0), (-1, -1), 2, color),
        ]))
        self.elements.append(t)
        self.SP(14)

    def _build_conclusion(self):
        st = self.styles
        self.SP(10)
        self.P("CONCLUSION & APPEL À L'ACTION", "label")
        self.HR(GOLD, 2)
        self.SP(10)
        self.P("Investir dans l'Excellence Médicale du Sénégal", "h1")
        self.SP(8)

        conclusion_text = (
            "L'écosystème digital Ndamatou représente bien plus qu'une modernisation technologique : "
            "c'est la <b>fondation numérique d'un nouveau système de santé</b> pour Touba et pour le Sénégal entier. "
            "Chacune des 26 applications a été conçue pour répondre à un besoin réel, mesurable et urgent du terrain."
        )
        self.elements.append(Paragraph(conclusion_text, st["body"]))
        self.SP(8)

        benefits = [
            ("🏆", "Accréditation JCI", "Le Ndamatou devient le premier hôpital rural d'Afrique subsaharienne accrédité JCI, attirant coopérations internationales et financements."),
            ("💰", "Retour sur Investissement", "Les économies générées (énergie, recouvrement, prévention) couvrent le coût de l'écosystème en moins de 24 mois."),
            ("🌍", "Modèle Africain", "Cet écosystème sera le référentiel étudié par les 54 pays africains en quête de modernisation hospitalière."),
            ("👥", "Impact Humain Immédiat", "Des milliers de patients soignés mieux, plus vite, avec moins d'erreurs et plus de dignité dès le premier jour."),
            ("🔬", "Innovation Made in Sénégal", "100% développé par des ingénieurs sénégalais de Processingenierie — fierté nationale et autonomie technologique."),
        ]

        for icon, title, desc in benefits:
            row_data = [[
                Paragraph(icon, ParagraphStyle("bn_icon", fontSize=20, leading=24)),
                [Paragraph(title, ParagraphStyle("bn_t", fontName="Helvetica-Bold", fontSize=11,
                                                   textColor=GOLD, leading=14)),
                 Spacer(1, 2),
                 Paragraph(desc, ParagraphStyle("bn_d", fontName="Helvetica", fontSize=9,
                                                 textColor=LIGHT, leading=12, alignment=TA_JUSTIFY))],
            ]]
            t = Table(row_data, colWidths=[1.4*cm, 14.6*cm])
            t.setStyle(TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("LINEAFTER", (0, 0), (0, 0), 2, GOLD),
                ("LINEBELOW", (0, 0), (-1, -1), 0.5, HexColor("#1e3a5f")),
                ("BACKGROUND", (0, 0), (-1, -1), HexColor("#0d1f35")),
            ]))
            self.elements.append(t)
            self.SP(6)

        self.SP(12)
        self.HR(GOLD, 1.5)
        self.SP(10)

        # CTA final
        cta_text = (
            "<b>Autorités du Ndamatou, Ministère de la Santé,</b><br/><br/>"
            "Ce document vous est soumis avec la conviction que l'avenir de la santé à Touba "
            "et au Sénégal passe par ce saut technologique courageux et maîtrisé.<br/><br/>"
            "Processingenierie s'engage à accompagner le Ndamatou à chaque étape de cette "
            "transformation — de la formation des équipes jusqu'à l'obtention de l'accréditation JCI.<br/><br/>"
            "<b>La décision que vous prenez aujourd'hui écrira l'histoire de la santé sénégalaise.</b>"
        )
        cta_para = Paragraph(cta_text, ParagraphStyle(
            "cta", fontName="Helvetica", fontSize=10, textColor=LIGHT,
            leading=16, alignment=TA_CENTER,
            spaceAfter=10
        ))

        cta_table = Table([[cta_para]], colWidths=[16*cm])
        cta_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), HexColor("#0c2035")),
            ("LINEABOVE", (0, 0), (-1, 0), 3, GOLD),
            ("LINEBELOW", (0, 0), (-1, -1), 3, GOLD),
            ("LEFTPADDING", (0, 0), (-1, -1), 20),
            ("RIGHTPADDING", (0, 0), (-1, -1), 20),
            ("TOPPADDING", (0, 0), (-1, -1), 20),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 20),
        ]))
        self.elements.append(cta_table)
        self.SP(12)

        # Contacts
        self.P("CONTACT & INFORMATIONS", "label")
        self.HR(color=SLATE)
        self.SP(6)
        contact_data = [
            ["Plateforme Live", "hospice-seven.vercel.app"],
            ["Développeur", "Processingenierie — Dakar, Sénégal"],
            ["Dépôt GitHub", "github.com/mamadouelimanewane/hopital"],
            ["Contact", "mamadouastelwane@gmail.com"],
            ["Document", "Version 1.0 — Juin 2026 — Confidentiel"],
        ]
        ct = Table(contact_data, colWidths=[5*cm, 11*cm])
        ct.setStyle(TableStyle([
            ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("TEXTCOLOR", (0, 0), (0, -1), GOLD),
            ("TEXTCOLOR", (1, 0), (1, -1), LIGHT),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ("LINEBELOW", (0, 0), (-1, -1), 0.3, HexColor("#1e3a5f")),
        ]))
        self.elements.append(ct)


# ─── MAIN ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("Génération du PDF de luxe Ndamatou...")
    builder = PDFBuilder()
    builder.build()
    size_kb = os.path.getsize(OUTPUT) // 1024
    print(f"Taille : {size_kb} Ko")
    print(f"Fichier : {OUTPUT}")
