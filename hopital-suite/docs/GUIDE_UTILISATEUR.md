# 📘 GUIDE UTILISATEUR — CNRA Suite
## Plateforme Numérique du Conseil National de Régulation de l'Audiovisuel du Sénégal

**Version** : 1.0  
**Date** : Juin 2026  
**Public cible** : Agents CNRA, journalistes, formateurs, citoyens sénégalais

---

## 📋 TABLE DES MATIÈRES

1. [Introduction — La CNRA et sa mission numérique](#1-introduction)
2. [Prise en main — Se connecter et naviguer](#2-prise-en-main)
3. [AntiDeep — Détection de deepfakes](#3-antideep)
4. [EduMedia — Éducation aux médias](#4-edumedia)
5. [ElectroWatch — Surveillance électorale](#5-electrowatch)
6. [MediaBase — Annuaire des médias](#6-mediabase)
7. [MediaWatch — Veille des contenus](#7-mediawatch)
8. [Citoyen — Portail public](#8-citoyen)
9. [FAQ — Questions fréquentes](#9-faq)
10. [Glossaire](#10-glossaire)
11. [Contact et support](#11-contact-et-support)

---

# 1. INTRODUCTION

## 1.1 Qu'est-ce que la CNRA ?

Le **Conseil National de Régulation de l'Audiovisuel (CNRA)** est l'autorité indépendante chargée de réguler le secteur audiovisuel au Sénégal. Créé par la Loi n° 2006-04 du 4 janvier 2006, le CNRA veille à :

- ✅ **La liberté de la presse** et le pluralisme de l'information
- ✅ **L'équité du temps de parole** entre acteurs politiques, notamment en période électorale
- ✅ **La protection du public** contre les contenus illicites, trompeurs ou manipulateurs
- ✅ **La déontologie journalistique** et le respect des règles professionnelles
- ✅ **L'éducation aux médias** pour tous les Sénégalais

Le CNRA supervise les télévisions, radios, et médias en ligne opérant sur le territoire sénégalais.

## 1.2 Pourquoi une plateforme numérique ?

Dans un contexte où :
- Les médias sociaux amplifient la désinformation à grande vitesse
- Les deepfakes et fausses vidéos menacent l'intégrité de l'information
- Les élections nécessitent une surveillance rigoureuse du temps de parole
- Les citoyens ont besoin d'outils pour signaler les abus

La **CNRA Suite** est la réponse numérique à ces défis. Elle regroupe **6 applications spécialisées** qui permettent aux agents CNRA, aux professionnels des médias et aux citoyens d'exercer leurs droits et responsabilités de façon efficace, transparente et traçable.

## 1.3 Les 6 modules de la CNRA Suite

| Module | Rôle principal | Port |
|--------|---------------|------|
| 🔍 **AntiDeep** | Détection et analyse de deepfakes | 3001 |
| 📚 **EduMedia** | Formation et éducation aux médias | 3002 |
| 🗳️ **ElectroWatch** | Surveillance du temps de parole électoral | 3003 |
| 📁 **MediaBase** | Annuaire des médias et journalistes | 3004 |
| 👁️ **MediaWatch** | Veille des contenus audiovisuels | 3008 |
| 🏛️ **Citoyen** | Portail de signalement public | 3006 |

> **Bon à savoir** : Chaque module est accessible indépendamment selon votre profil. Vous n'avez pas besoin d'accéder à tous les modules — votre superviseur vous indiquera ceux qui correspondent à votre rôle.

---

# 2. PRISE EN MAIN

## 2.1 Accéder à la plateforme

### Depuis un ordinateur (Desktop)

1. Ouvrez votre navigateur web (Chrome, Firefox, Edge recommandés)
2. Saisissez l'adresse du module souhaité dans la barre d'adresse
3. Appuyez sur **Entrée**

**Exemple** : Pour accéder à MediaWatch, tapez `http://localhost:3008`

> ⚠️ **Attention** : Les adresses `localhost` sont accessibles uniquement depuis l'ordinateur sur lequel la CNRA Suite est installée. Pour un accès réseau en bureau, contactez votre administrateur système qui vous fournira l'adresse IP du serveur.

### Depuis un smartphone ou tablette (Mobile)

La CNRA Suite est entièrement **responsive** — elle s'adapte à toutes les tailles d'écrans.

1. Ouvrez le navigateur de votre appareil
2. Saisissez l'adresse fournie par votre administrateur (ex : `http://192.168.1.10:3001`)
3. Sur mobile, le menu de navigation apparaît sous forme d'icône ☰ (hamburger) en haut à gauche

## 2.2 Connexion et authentification

### Première connexion

1. Sur la page d'accueil du module, cliquez sur **"Se connecter"** ou **"Connexion"**
2. Saisissez votre **adresse email professionnelle** (ex : `prenom.nom@cnra.sn`)
3. Saisissez votre **mot de passe** fourni par l'administrateur
4. Cliquez sur **"Connexion"**

> **Bon à savoir** : Lors de votre toute première connexion, le système vous demandera de **changer votre mot de passe temporaire**. Choisissez un mot de passe d'au moins 8 caractères, mêlant lettres, chiffres et symboles.

### Mot de passe oublié

1. Cliquez sur **"Mot de passe oublié ?"** sur la page de connexion
2. Saisissez votre adresse email professionnelle
3. Consultez votre messagerie — un email avec un lien de réinitialisation vous sera envoyé
4. Cliquez sur le lien (valable 24 heures) et choisissez un nouveau mot de passe

> ⚠️ **Attention** : Ne partagez jamais votre mot de passe avec un collègue. Chaque agent dispose de son propre compte pour assurer la traçabilité des actions.

## 2.3 Comprendre l'interface

### La barre de navigation (Desktop)

Sur ordinateur, vous trouverez une **barre latérale gauche** (sidebar) avec :

- 🏠 **Accueil** — tableau de bord principal du module
- 📋 **Sections spécifiques** au module (varient selon l'application)
- 🔔 **Notifications** — alertes et rappels en attente
- ⚙️ **Paramètres** — préférences de votre compte
- 🚪 **Déconnexion** — toujours se déconnecter après utilisation sur un poste partagé

### La barre de navigation (Mobile)

Sur smartphone, appuyez sur l'icône ☰ en haut à gauche pour ouvrir le menu. Appuyez en dehors du menu ou sur ✕ pour le fermer.

### Le tableau de bord

Chaque module présente un **tableau de bord** à l'ouverture, qui affiche :
- Des **statistiques clés** (nombre d'alertes, sessions en cours, etc.)
- Des **raccourcis** vers les actions les plus fréquentes
- Les **dernières activités** de votre compte

### Notifications et alertes

L'icône 🔔 affiche le nombre de notifications non lues. Cliquez dessus pour les consulter. Les alertes urgentes apparaissent également en haut de page avec un bandeau coloré :
- 🔴 **Rouge** = Urgent, action requise immédiatement
- 🟡 **Jaune** = Avertissement, à traiter rapidement
- 🟢 **Vert** = Information, aucune action requise

## 2.4 Bonnes pratiques générales

- **Déconnectez-vous** toujours en fin de session, surtout sur un poste partagé
- **Sauvegardez régulièrement** vos saisies avec le bouton "Enregistrer" ou "Sauvegarder" — la plateforme ne sauvegarde pas automatiquement les formulaires en cours
- **Rafraîchissez la page** (touche F5) si l'interface semble figée
- **Signalez tout dysfonctionnement** à votre référent technique (voir section [Contact et Support](#11-contact-et-support))

---

# 3. ANTIDEEP — DÉTECTION DE DEEPFAKES

**Accès** : `http://localhost:3001`  
**Utilisateurs** : Analystes médias CNRA, juristes

## 3.1 Qu'est-ce qu'un deepfake ?

Un **deepfake** est un contenu audiovisuel (vidéo, audio, image) fabriqué ou manipulé grâce à l'intelligence artificielle pour faire croire qu'une personne a dit ou fait quelque chose qu'elle n'a en réalité pas dit ou fait.

**Exemples concrets au Sénégal** :
- Une vidéo montrant un candidat à la présidentielle prononçant un discours qu'il n'a jamais tenu
- Un enregistrement audio imitant la voix d'un ministre pour annoncer une fausse décision
- Une image montrant un journaliste dans un contexte compromettant, entièrement fabriquée
- Un clip montant des propos sortis de leur contexte pour créer un faux scandale

> **Bon à savoir** : La détection de deepfakes est une science en évolution. AntiDeep donne des probabilités, pas des certitudes absolues. Une analyse humaine d'expert reste indispensable avant toute décision réglementaire.

## 3.2 Soumettre un contenu suspect

### Étape 1 — Accéder au formulaire de soumission

1. Connectez-vous à AntiDeep (`http://localhost:3001`)
2. Sur le tableau de bord, cliquez sur **"Soumettre un contenu"** ou le bouton ➕
3. Le formulaire de soumission s'ouvre

### Étape 2 — Renseigner les informations de base

Remplissez les champs suivants :

| Champ | Description | Obligatoire |
|-------|-------------|-------------|
| **Titre** | Nom court décrivant le contenu (ex : "Vidéo candidat Thiès 12/06") | ✅ Oui |
| **Type de contenu** | Vidéo / Audio / Image / Texte | ✅ Oui |
| **Source** | URL ou nom du média où le contenu a été trouvé | ✅ Oui |
| **Date de publication** | Quand le contenu est apparu | ✅ Oui |
| **Description** | Contexte et raisons du soupçon | ✅ Oui |
| **Priorité** | Normale / Élevée / Urgente | ✅ Oui |

### Étape 3 — Uploader le fichier

1. Cliquez sur **"Choisir un fichier"** ou glissez-déposez le fichier dans la zone prévue
2. Formats acceptés : `.mp4`, `.avi`, `.mov` (vidéo), `.mp3`, `.wav` (audio), `.jpg`, `.png` (image)
3. Taille maximale : **500 Mo** pour les vidéos, **50 Mo** pour les images
4. Attendez la fin du téléchargement (une barre de progression s'affiche)

> ⚠️ **Attention** : Si le contenu est sur internet (YouTube, Facebook, etc.), vous pouvez soumettre l'URL directement sans télécharger le fichier. Copiez le lien dans le champ "URL du contenu".

### Étape 4 — Lancer l'analyse

1. Vérifiez toutes les informations saisies
2. Cliquez sur **"Lancer l'analyse"**
3. Le système affiche **"Analyse en cours..."** avec une animation
4. Selon la taille du fichier, l'analyse dure de **30 secondes à 5 minutes**

> **Bon à savoir** : Vous pouvez quitter la page et revenir plus tard. L'analyse se poursuit en arrière-plan et vous recevrez une notification 🔔 à la fin.

## 3.3 Lire les résultats d'analyse

### L'écran de résultats

Une fois l'analyse terminée, vous obtenez un rapport structuré avec :

**🔴 Score de suspicion** (0 à 100%)
- 0-30% : Contenu probablement authentique
- 31-60% : Contenu douteux, analyse complémentaire recommandée
- 61-100% : Contenu probablement manipulé

**Indicateurs détaillés** :
- **Cohérence faciale** : Les expressions du visage sont-elles naturelles ?
- **Synchronisation audio-vidéo** : Les lèvres correspondent-elles aux sons ?
- **Artefacts visuels** : Y a-t-il des pixels incohérents, des zones floues anormales ?
- **Métadonnées** : Les informations cachées du fichier sont-elles cohérentes ?

### Interpréter les résultats — Exemples

**Exemple 1 — Score 82% (Hautement suspect)**
```
Vidéo : Discours attribué au candidat X à Ziguinchor
Score deepfake : 82%
Anomalies : Synchronisation labiale défaillante (23 points de désaccord),
             Artefacts autour des oreilles, Métadonnées incohérentes
Recommandation : Signalement prioritaire, expertise externe conseillée
```

**Exemple 2 — Score 15% (Probablement authentique)**
```
Vidéo : Interview du ministre Y sur RTS
Score deepfake : 15%
Anomalies : Légère compression vidéo (normale pour diffusion web)
Recommandation : Contenu authentique, archiver pour référence
```

## 3.4 Gérer les campagnes de désinformation

### Créer une campagne

Une **campagne** regroupe plusieurs contenus suspects liés à un même sujet ou événement.

1. Dans le menu gauche, cliquez sur **"Campagnes"**
2. Cliquez sur **"Nouvelle campagne"**
3. Donnez un nom à la campagne (ex : "Élection présidentielle 2029 — Vagues de deepfakes")
4. Définissez la période concernée
5. Associez les contenus suspects déjà analysés
6. Cliquez sur **"Créer"**

### Consulter les campagnes actives

Le tableau de bord "Campagnes" affiche :
- 📊 Nombre total de contenus analysés
- 🔴 Contenus confirmés comme deepfakes
- 🟡 Contenus en attente d'analyse
- 📈 Tendance (augmentation/diminution des soumissions)

## 3.5 Gérer les alertes AntiDeep

Lorsqu'un contenu dépasse le seuil d'alerte (configurable, par défaut 60%), une alerte est automatiquement générée.

**Traiter une alerte** :
1. Cliquez sur 🔔 dans la barre de navigation
2. Sélectionnez l'alerte AntiDeep
3. Choisissez une action :
   - **"Confirmer deepfake"** → Le contenu est marqué comme frauduleux, un rapport est généré
   - **"Infirmer"** → Le contenu est marqué comme authentique après vérification
   - **"Transmettre à l'expert"** → L'alerte est escaladée vers un juriste ou expert externe
   - **"Mettre en veille"** → L'alerte reste ouverte pour analyse ultérieure

---

# 4. EDUMEDIA — ÉDUCATION AUX MÉDIAS

**Accès** : `http://localhost:3002`  
**Utilisateurs** : Formateurs CNRA, enseignants, grand public

## 4.1 Présentation du module

EduMedia est la bibliothèque de formation de la CNRA. Elle propose des ressources pédagogiques, des cours en ligne et des certifications pour aider tous les Sénégalais à mieux comprendre les médias, développer leur esprit critique et se protéger contre la désinformation.

**Contenu disponible** :
- 📖 Fiches pédagogiques et articles
- 🎥 Vidéos de formation
- 🎯 Quiz interactifs
- 🏆 Certifications officielles CNRA
- 📦 Modules de formation complets (parcours structurés)

## 4.2 Accéder aux ressources pédagogiques

### Sans compte (accès public)

Certaines ressources sont accessibles librement, sans connexion :

1. Rendez-vous sur `http://localhost:3002`
2. Naviguez dans le **catalogue public** via le menu "Ressources"
3. Cliquez sur une ressource pour l'ouvrir
4. Les ressources en libre accès affichent l'icône 🔓

### Avec un compte (accès complet)

Pour accéder aux formations complètes et aux certifications, connectez-vous avec votre compte CNRA ou créez un compte public.

**Créer un compte public** (pour les enseignants et citoyens) :
1. Cliquez sur **"Créer un compte"** sur la page d'accueil
2. Remplissez : Nom, Prénom, Email, Profession, Établissement (optionnel)
3. Acceptez les conditions d'utilisation
4. Vérifiez votre email et cliquez sur le lien de confirmation
5. Vous pouvez maintenant accéder à tous les contenus gratuits

## 4.3 Suivre une formation

### Trouver une formation

1. Dans le menu, cliquez sur **"Formations"** ou **"Catalogue"**
2. Utilisez les filtres pour affiner votre recherche :
   - **Niveau** : Débutant / Intermédiaire / Avancé
   - **Durée** : Moins d'1h / 1-3h / Plus de 3h
   - **Thème** : Fact-checking / Deepfakes / Droits de la presse / Éthique journalistique / etc.
   - **Public** : Enseignants / Journalistes / Grand public / Étudiants
3. Cliquez sur une formation pour voir sa description détaillée
4. Cliquez sur **"S'inscrire"** ou **"Commencer"**

### Suivre les modules d'une formation

Une formation est composée de **modules** (leçons). Chaque module peut contenir :
- Un texte à lire
- Une vidéo à regarder
- Un document téléchargeable (PDF)
- Un quiz à compléter

**Navigation dans une formation** :
- Le menu latéral liste tous les modules dans l'ordre
- ✅ = Module terminé
- 🔵 = Module en cours
- ⚪ = Module non commencé
- Cliquez sur **"Suivant"** pour passer au module suivant
- Votre progression est automatiquement sauvegardée

> **Bon à savoir** : Vous pouvez interrompre une formation et la reprendre plus tard depuis le même point. Retrouvez vos formations en cours dans votre tableau de bord, section **"Mes formations"**.

## 4.4 Passer un quiz

Les quiz valident votre compréhension de chaque module.

### Avant de commencer

- Lisez attentivement toute la leçon avant de lancer le quiz
- Chaque quiz a un nombre limité de tentatives (généralement 3)
- Un score minimum est requis pour valider le module (souvent 70%)

### Pendant le quiz

1. Lisez chaque question attentivement
2. Sélectionnez la ou les bonnes réponses (les cases à cocher permettent plusieurs réponses)
3. Cliquez sur **"Question suivante"** pour avancer
4. Vous ne pouvez pas revenir en arrière une fois la question validée
5. À la fin, cliquez sur **"Soumettre"**

### Après le quiz

- Votre score s'affiche immédiatement
- Si vous avez la note requise : ✅ Module validé, passez au suivant
- Si vous n'avez pas la note : Les bonnes réponses s'affichent, vous pouvez reprendre

> ⚠️ **Attention** : Si vous épuisez vos tentatives sans obtenir la note requise, contactez votre formateur ou l'administrateur EduMedia pour débloquer une nouvelle tentative.

## 4.5 Obtenir une certification

### Types de certifications

| Certification | Prérequis | Validité |
|--------------|-----------|----------|
| Attestation de formation | Compléter 1 formation | Sans limite |
| Certificat Éducation aux médias — Niveau 1 | 3 formations validées | 2 ans |
| Certificat Éducation aux médias — Niveau 2 | 6 formations + examen final | 2 ans |
| Certification Professionnelle CNRA | Réservée aux journalistes accrédités | 1 an |

### Télécharger son certificat

1. Dans votre tableau de bord, cliquez sur **"Mes certifications"**
2. Les certifications obtenues s'affichent avec un badge 🏆
3. Cliquez sur **"Télécharger"** à côté du certificat souhaité
4. Un fichier PDF est généré avec :
   - Votre nom et prénom
   - Le nom de la formation
   - La date d'obtention
   - Le cachet et la signature numérique du CNRA
   - Un code QR de vérification d'authenticité

> **Bon à savoir** : Les employeurs et établissements peuvent vérifier l'authenticité d'un certificat en scannant le QR code ou en saisissant le code de vérification sur `http://localhost:3002/verifier`.

---

# 5. ELECTROWATCH — SURVEILLANCE ÉLECTORALE

**Accès** : `http://localhost:3003`  
**Utilisateurs** : Agents de monitoring CNRA, observateurs électoraux

## 5.1 Rôle et enjeux

ElectroWatch est l'outil de surveillance du **temps de parole médiatique** en période électorale. La loi sénégalaise impose aux médias audiovisuels de garantir un accès **équitable** aux candidats et partis politiques. ElectroWatch permet de mesurer, suivre et signaler les déséquilibres.

**Pourquoi c'est important** :
- Un candidat surreprésenté à la télévision ou à la radio obtient un avantage injuste
- Le CNRA peut exiger des médias fautifs qu'ils rééquilibrent la couverture
- En cas de violations répétées, des sanctions peuvent être prononcées

## 5.2 Créer une campagne électorale

### Accéder à la gestion des campagnes

1. Connectez-vous à ElectroWatch (`http://localhost:3003`)
2. Dans le menu gauche, cliquez sur **"Campagnes"**
3. Cliquez sur **"Nouvelle campagne"**

### Remplir le formulaire de campagne

| Champ | Description | Exemple |
|-------|-------------|---------|
| **Nom de la campagne** | Intitulé de l'élection | "Élection présidentielle 2029" |
| **Type d'élection** | Présidentielle / Législative / Locale | Présidentielle |
| **Date de début** | Début de la période de surveillance | 01/02/2029 |
| **Date de fin** | Fin de la période de surveillance | 25/02/2029 |
| **Médias surveillés** | Sélection dans MediaBase | RTS1, 2STV, TFM, RFM... |
| **Candidats/Partis** | Liste des participants | Candidat A, Candidat B... |

4. Cliquez sur **"Créer la campagne"**
5. La campagne apparaît dans la liste avec le statut **"Active"**

## 5.3 Saisir une intervention

Une **intervention** est chaque prise de parole d'un candidat ou représentant politique dans un média.

### Accéder au formulaire de saisie

1. Dans ElectroWatch, cliquez sur **"Interventions"** dans le menu
2. Cliquez sur **"Nouvelle intervention"** ou le bouton ➕
3. Le formulaire de saisie s'ouvre

### Remplir le formulaire

| Champ | Description | Exemple |
|-------|-------------|---------|
| **Campagne** | Sélectionner la campagne active | Présidentielle 2029 |
| **Média** | La chaîne ou radio | RTS1 |
| **Émission** | Le nom de l'émission | Journal de 20h |
| **Date et heure** | Quand l'intervention a eu lieu | 15/02/2029 à 20:15 |
| **Durée** | En minutes et secondes | 3 min 45 sec |
| **Candidat/Parti** | Qui a parlé | Candidat A |
| **Type** | Interview / Débat / Discours / Publicité électorale | Interview |
| **Ton** | Neutre / Positif / Négatif / Controversé | Neutre |
| **Notes** | Observations complémentaires | Sujet abordé : programme économique |

4. Cliquez sur **"Enregistrer l'intervention"**

> **Bon à savoir** : Vous pouvez saisir les interventions en temps réel pendant la diffusion. Gardez ElectroWatch ouvert sur un second écran ou onglet pendant que vous regardez/écoutez le média.

## 5.4 Comprendre les graphiques de temps de parole

### Le graphique de répartition

Sur la page d'une campagne, un **graphique circulaire** (camembert) montre la répartition du temps de parole entre les candidats.

- Chaque couleur représente un candidat ou parti
- Le pourcentage indique la part du temps de parole total
- L'objectif est que toutes les parts soient aussi proches que possible

### Le graphique d'évolution temporelle

Un **graphique en barres** ou **courbes** montre l'évolution du temps de parole semaine par semaine.

**Comment lire ce graphique** :
- L'axe horizontal (X) = le temps (jours, semaines)
- L'axe vertical (Y) = les minutes de temps de parole
- Chaque couleur = un candidat

**Signaux d'alerte** :
- Une barre beaucoup plus haute que les autres = déséquilibre
- Une courbe qui monte en flèche en fin de campagne = favoritisme possible

### Le tableau récapitulatif

Sous les graphiques, un tableau liste :

| Candidat | Temps total | % du temps | Écart vs. moyenne | Statut |
|----------|-------------|-----------|-------------------|--------|
| Candidat A | 4h 23min | 42% | +18% | ⚠️ Surreprésenté |
| Candidat B | 2h 10min | 21% | -3% | ✅ Équilibré |
| Candidat C | 1h 45min | 17% | -7% | 🟡 Léger déficit |

## 5.5 Traiter une alerte de déséquilibre

### Quand une alerte est générée

Le système génère automatiquement une alerte quand l'écart entre le candidat le plus représenté et la moyenne dépasse un seuil paramétré (ex : +25%).

### Traiter l'alerte

1. Cliquez sur 🔔 dans la barre de navigation
2. Sélectionnez l'alerte ElectroWatch
3. Consultez le détail : quel média, quelle période, quel écart
4. Choisissez une action :
   - **"Envoyer un avertissement"** au média concerné (un email officiel est généré)
   - **"Ouvrir une enquête"** pour approfondir l'analyse
   - **"Classer sans suite"** si l'écart est justifié (ex : débat déjà prévu)
   - **"Escalader"** au responsable hiérarchique

> ⚠️ **Attention** : Tout avertissement officiel envoyé à un média est irréversible et archivé. Assurez-vous que les données de l'alerte sont correctes avant d'agir.

---

# 6. MEDIABASE — ANNUAIRE DES MÉDIAS

**Accès** : `http://localhost:3004`  
**Utilisateurs** : Administrateurs CNRA, journalistes, chercheurs

## 6.1 Présentation

MediaBase est l'annuaire officiel et exhaustif des médias audiovisuels et en ligne agréés au Sénégal, ainsi que des journalistes accrédités par le CNRA. C'est la source de référence pour toutes les questions d'identification et d'accréditation.

**Contenu de MediaBase** :
- 📺 Chaînes de télévision (nationales et locales)
- 📻 Stations de radio
- 🌐 Médias en ligne agréés
- 👤 Journalistes accrédités
- 🏢 Groupes médias et actionnariats
- 📜 Licences et agréments

## 6.2 Rechercher un média

### Recherche simple

1. Sur la page d'accueil de MediaBase, utilisez la **barre de recherche** en haut de page
2. Saisissez le nom du média (ou une partie du nom)
3. Appuyez sur **Entrée** ou cliquez sur 🔍
4. Les résultats s'affichent avec nom, type, statut et région

### Recherche avancée

Cliquez sur **"Filtres avancés"** pour affiner :

| Filtre | Options |
|--------|---------|
| **Type** | Télévision / Radio / En ligne / Presse écrite |
| **Région** | Dakar / Thiès / Ziguinchor / Saint-Louis / etc. |
| **Statut** | Actif / Suspendu / Fermé |
| **Langue** | Français / Wolof / Pulaar / Sérère / Diola / etc. |
| **Groupe média** | Sélectionner un groupe |
| **Agrément** | En cours / Validé / Expiré |

### Fiche d'un média

Cliquez sur un résultat pour ouvrir la **fiche détaillée** :

- **Informations générales** : Nom officiel, acronyme, logo, fondation
- **Coordonnées** : Adresse, téléphone, email, site web
- **Informations légales** : Numéro d'agrément, date d'obtention, date d'expiration
- **Couverture** : Zones géographiques desservies, fréquences (pour radio/TV)
- **Actionnariat** : Groupe propriétaire, principaux actionnaires
- **Journalistes** : Liste des journalistes accrédités rattachés à ce média
- **Historique** : Sanctions, avertissements, modifications de licence

## 6.3 Ajouter ou modifier un journaliste

### Ajouter un nouveau journaliste

1. Dans le menu, cliquez sur **"Journalistes"**
2. Cliquez sur **"Ajouter un journaliste"**
3. Remplissez le formulaire :

| Champ | Description |
|-------|-------------|
| **Nom et Prénom** | Identité civile complète |
| **Date de naissance** | Format JJ/MM/AAAA |
| **Numéro CNI** | Carte nationale d'identité |
| **Email professionnel** | Adresse officielle |
| **Téléphone** | Numéro de contact |
| **Média employeur** | Sélectionner dans la liste |
| **Poste** | Reporter / Rédacteur en chef / Présentateur / etc. |
| **Spécialité** | Politique / Sport / Culture / Économie / etc. |
| **Date d'embauche** | Début du contrat |
| **Photo** | Photo professionnelle (format JPG, max 2 Mo) |
| **Pièces jointes** | Carte de presse, diplômes (PDF) |

4. Cliquez sur **"Enregistrer"**

> **Bon à savoir** : Chaque journaliste reçoit un **numéro d'accréditation CNRA** unique, généré automatiquement. Ce numéro est utilisable pour vérifier l'accréditation.

### Modifier une fiche existante

1. Recherchez le journaliste par nom ou numéro d'accréditation
2. Cliquez sur sa fiche
3. Cliquez sur le bouton ✏️ **"Modifier"**
4. Effectuez vos modifications
5. Cliquez sur **"Enregistrer les modifications"**
6. Un commentaire de modification est obligatoire (traçabilité)

> ⚠️ **Attention** : Toute modification d'une fiche est horodatée et enregistrée avec votre identifiant. Les suppressions sont impossibles — vous pouvez uniquement "archiver" une fiche (le journaliste n'apparaît plus dans les recherches actives mais reste dans l'historique).

## 6.4 Exporter les données

### Export simple

1. Sur n'importe quelle liste (médias, journalistes, groupes)
2. Cliquez sur le bouton **"Exporter"** (icône 📥)
3. Choisissez le format :
   - **Excel (.xlsx)** — pour travailler avec les données dans un tableur
   - **CSV** — format universel pour importation dans d'autres logiciels
   - **PDF** — pour impression et archivage officiel
4. Choisissez les colonnes à inclure
5. Cliquez sur **"Télécharger"**

### Export avancé

Pour des exports personnalisés (sélection de champs spécifiques, filtres combinés) :

1. Appliquez d'abord vos filtres de recherche
2. Sélectionnez les enregistrements à exporter (cases à cocher ou "Sélectionner tout")
3. Cliquez sur **"Exporter la sélection"**

---

# 7. MEDIAWATCH — VEILLE DES CONTENUS

**Accès** : `http://localhost:3008`  
**Utilisateurs** : Agents de veille CNRA

## 7.1 Rôle du module

MediaWatch est l'outil de **surveillance quotidienne des contenus** diffusés par les médias audiovisuels sénégalais. Les agents de veille CNRA l'utilisent pour enregistrer leurs observations, signaler les contenus problématiques et produire des rapports d'analyse.

**Types de contenus surveillés** :
- Émissions d'information et journaux télévisés
- Programmes politiques et débats
- Publicités commerciales et électorales
- Contenus susceptibles de violer les lois sur l'audiovisuel
- Temps de parole des différentes composantes de la société

## 7.2 Démarrer une session de monitoring

### Qu'est-ce qu'une session ?

Une **session de monitoring** est une période de surveillance d'un ou plusieurs médias. Elle a un début, une fin et un agent responsable.

### Créer une session

1. Connectez-vous à MediaWatch (`http://localhost:3008`)
2. Cliquez sur **"Nouvelle session"** ou le bouton ➕
3. Remplissez le formulaire :

| Champ | Description |
|-------|-------------|
| **Titre** | Nom descriptif (ex : "Veille RTS1 — Semaine 24") |
| **Médias** | Sélectionner les chaînes/radios à surveiller |
| **Date et heure de début** | Quand commence la surveillance |
| **Date et heure de fin prévue** | Durée planifiée |
| **Type de veille** | Monitoring régulier / Veille spéciale / Veille électorale |
| **Objectifs** | Ce que vous cherchez à surveiller spécifiquement |

4. Cliquez sur **"Démarrer la session"**
5. La session apparaît avec le statut **"En cours"** 🟢

### Mettre en pause et reprendre

- **Pause** : Cliquez sur ⏸️ si vous devez vous absenter brièvement. La session reste ouverte.
- **Reprendre** : Cliquez sur ▶️ pour reprendre l'enregistrement des observations.
- **Terminer** : Cliquez sur ⏹️ pour clôturer définitivement la session.

## 7.3 Enregistrer une observation

Une **observation** est une note sur un contenu spécifique diffusé pendant la session.

### Formulaire d'observation

1. Pendant une session active, cliquez sur **"Nouvelle observation"** ou appuyez sur le raccourci clavier `O`
2. Remplissez :

| Champ | Description | Exemple |
|-------|-------------|---------|
| **Horodatage** | Heure exacte de l'observation | 20:17:32 |
| **Média** | Quelle chaîne/radio | TFM |
| **Émission** | Nom de l'émission | Grand Jury |
| **Catégorie** | Violation / Temps de parole / Publicité / Observation neutre | Temps de parole |
| **Sévérité** | Information / Avertissement / Violation grave | Avertissement |
| **Description** | Détail précis de l'observation | Invité politique sans droit de réponse accordé à l'opposition |
| **Capture** | Screenshot ou photo si pertinent | (optionnel) |

3. Cliquez sur **"Enregistrer l'observation"**

> **Bon à savoir** : L'horodatage est automatiquement prérempli avec l'heure actuelle. Vous pouvez le modifier si vous saisissez une observation après le fait.

## 7.4 Analyser le temps de parole

### Saisir les mesures de temps de parole

1. Dans une session active, cliquez sur **"Temps de parole"**
2. Pour chaque prise de parole mesurée, cliquez sur **"Ajouter une mesure"**
3. Saisissez : Interlocuteur, Durée, Type (politique / expert / citoyen / journaliste)
4. Les totaux se mettent à jour automatiquement

### Visualisation en temps réel

Le module affiche un **graphique en temps réel** de la répartition du temps de parole pendant la session. Ce graphique est utile pour :
- Détecter immédiatement un déséquilibre
- Préparer des alertes rapides vers ElectroWatch
- Documenter la session avec des visuels

## 7.5 Générer un rapport

### Rapport de session

À la clôture d'une session (ou ultérieurement), vous pouvez générer un rapport officiel.

1. Dans la liste des sessions, cliquez sur la session concernée
2. Cliquez sur **"Générer un rapport"**
3. Choisissez le modèle de rapport :
   - **Rapport de routine** — Format standard hebdomadaire
   - **Rapport d'incident** — Pour signaler une violation spécifique
   - **Rapport thématique** — Analyse d'un sujet précis
   - **Rapport électoral** — Format spécial période électorale

4. Personnalisez les sections à inclure
5. Ajoutez une conclusion et des recommandations
6. Cliquez sur **"Générer"**

### Exporter et partager

Le rapport est généré en **PDF** et peut être :
- Téléchargé sur votre ordinateur
- Envoyé par email directement depuis l'interface
- Archivé automatiquement dans le système
- Partagé avec le responsable hiérarchique via le système de validation

> ⚠️ **Attention** : Les rapports marqués **"Confidentiel"** ne doivent être partagés que via les canaux officiels. Ne pas les envoyer via des messageries personnelles (WhatsApp, etc.).

---

# 8. CITOYEN — PORTAIL PUBLIC

**Accès** : `http://localhost:3006`  
**Utilisateurs** : Citoyens sénégalais

## 8.1 Présentation

Le Portail Citoyen est la porte d'entrée des Sénégalais vers le CNRA. Il permet à tout citoyen de :
- Signaler un contenu problématique dans un média
- Suivre l'avancement de son signalement
- Participer à des pétitions sur des sujets médiatiques
- Consulter les décisions et sanctions prononcées par le CNRA
- S'informer sur les droits des téléspectateurs et auditeurs

**Aucune expertise technique n'est requise** pour utiliser ce portail. Il est conçu pour être simple et accessible à tous.

## 8.2 Soumettre un signalement

### Qu'est-ce qu'on peut signaler ?

Vous pouvez signaler à la CNRA :
- Un contenu **diffamatoire** ou portant atteinte à l'honneur
- Des **propos haineux** ou discriminatoires (ethniques, religieux, de genre)
- De la **désinformation** ou des fausses nouvelles
- Un contenu **inapproprié pour les mineurs** diffusé à une heure non protégée
- Une **publicité mensongère** ou trompeuse
- Une **violation de vie privée** (diffusion de données personnelles sans consentement)
- Un manque d'**équité** dans le traitement de l'information

### Comment soumettre un signalement — Pas à pas

**Étape 1 — Commencer**
1. Rendez-vous sur `http://localhost:3006`
2. Cliquez sur le bouton prominent **"Faire un signalement"** ou **"Signaler un contenu"**

**Étape 2 — Type de signalement**
Sélectionnez le type parmi :
- 📺 Contenu télévisuel
- 📻 Contenu radiophonique
- 🌐 Contenu en ligne (site web, podcast, stream)
- 📱 Contenu sur réseaux sociaux diffusé par un média agréé

**Étape 3 — Identifier le contenu**

| Champ | Description | Obligatoire |
|-------|-------------|-------------|
| **Média** | Nom de la chaîne ou radio | ✅ Oui |
| **Date et heure** | Quand avez-vous vu/entendu ce contenu | ✅ Oui |
| **Émission** | Nom de l'émission si connu | Non |
| **Lien URL** | Si disponible (pour contenu en ligne) | Non |
| **Description** | Ce qui s'est passé, avec le plus de détails possible | ✅ Oui |

**Étape 4 — Votre catégorisation**
Précisez le type de problème :
- [ ] Propos haineux ou discriminatoires
- [ ] Désinformation / fausses nouvelles
- [ ] Atteinte à la vie privée
- [ ] Contenu inapproprié (violence, sexe)
- [ ] Publicité illégale ou trompeuse
- [ ] Manque d'équité journalistique
- [ ] Autre (précisez)

**Étape 5 — Vos coordonnées**

| Champ | Description | Obligatoire |
|-------|-------------|-------------|
| **Prénom et Nom** | Votre identité | ✅ Oui |
| **Email** | Pour recevoir les réponses | ✅ Oui |
| **Téléphone** | Pour contact si besoin | Non |
| **Anonymat** | Vous pouvez demander que votre identité reste confidentielle | Non |

**Étape 6 — Pièces jointes**
Si vous avez des preuves (capture d'écran, enregistrement), vous pouvez les joindre.
- Formats acceptés : JPG, PNG, PDF, MP4, MP3
- Taille max : 20 Mo par fichier, 5 fichiers maximum

**Étape 7 — Soumettre**
1. Relisez votre signalement
2. Cochez **"Je certifie que ces informations sont exactes"**
3. Cliquez sur **"Soumettre mon signalement"**
4. Un **numéro de référence** vous est communiqué — **notez-le précieusement !**

> **Bon à savoir** : Un email de confirmation est automatiquement envoyé à votre adresse avec votre numéro de référence et un lien pour suivre l'avancement.

## 8.3 Suivre son dossier

### Via votre numéro de référence

1. Sur le portail, cliquez sur **"Suivre mon signalement"**
2. Saisissez votre numéro de référence (format : CNRA-2029-XXXXX)
3. Saisissez l'email que vous avez utilisé lors de la soumission
4. Cliquez sur **"Rechercher"**

### Les statuts d'un signalement

| Statut | Signification |
|--------|---------------|
| 🔵 **Reçu** | Votre signalement est enregistré et en attente de traitement |
| 🟡 **En cours d'instruction** | Un agent CNRA analyse votre signalement |
| 🟠 **Complément requis** | Le CNRA a besoin d'informations supplémentaires de votre part |
| 🟢 **Traité — Suite donnée** | Le CNRA a pris des mesures suite à votre signalement |
| ⚪ **Traité — Classé sans suite** | Le CNRA a conclu qu'il n'y a pas de violation à sanctionner |

### Délais indicatifs

- Accusé de réception : **immédiat** (automatique)
- Premier examen : **5 jours ouvrables**
- Décision ou demande de complément : **30 jours** (délai légal)
- Cas complexes : jusqu'à **60 jours**

> ⚠️ **Attention** : Le CNRA peut classer un signalement sans suite si le contenu signalé ne relève pas de sa compétence (ex : contenu sur les réseaux sociaux d'un particulier) ou si les preuves sont insuffisantes. Cela ne signifie pas que votre signalement n'était pas légitime.

## 8.4 Participer à une pétition

### Trouver les pétitions actives

1. Sur le portail Citoyen, cliquez sur **"Pétitions"** dans le menu
2. La liste des pétitions actives s'affiche
3. Chaque pétition indique :
   - Le titre et l'objet
   - Le nombre de signatures actuelles vs. l'objectif
   - La date limite de signature
   - Le statut : En cours / Atteinte / Transmise au CNRA

### Signer une pétition

1. Cliquez sur la pétition qui vous concerne
2. Lisez attentivement le texte de la pétition
3. Cliquez sur **"Signer cette pétition"**
4. Saisissez votre nom, prénom et email
5. Cochez la case de confirmation
6. Cliquez sur **"Confirmer ma signature"**
7. Un email de confirmation vous est envoyé avec un lien de validation
8. Cliquez sur le lien dans l'email pour valider votre signature

> **Bon à savoir** : Votre signature n'est comptabilisée qu'après validation par email. Vérifiez vos spams si vous ne recevez pas l'email de confirmation dans les 5 minutes.

## 8.5 Consulter les décisions du CNRA

### Accéder aux décisions

1. Dans le menu du portail, cliquez sur **"Décisions CNRA"**
2. Naviguez par date, type ou média concerné
3. Cliquez sur une décision pour la lire en détail

### Types de décisions publiées

- **Avertissements** — Mise en demeure officielle à un média
- **Mises en demeure** — Injonction de rectifier ou cesser
- **Sanctions financières** — Amendes prononcées
- **Suspensions** — Suspension temporaire d'un programme ou d'un média
- **Retraits de licence** — Décision grave de fermeture
- **Recommandations** — Orientations non contraignantes

---

# 9. FAQ — QUESTIONS FRÉQUENTES

## Questions générales

**Q1. À qui s'adresse la CNRA Suite ?**
La CNRA Suite s'adresse à trois publics : (1) les agents et collaborateurs du CNRA qui utilisent les modules de travail, (2) les professionnels des médias (journalistes, responsables de rédaction) qui peuvent consulter MediaBase et EduMedia, et (3) tous les citoyens sénégalais qui peuvent accéder au Portail Citoyen pour signaler des contenus ou participer à des pétitions.

**Q2. Est-ce que j'ai besoin d'internet pour utiliser la CNRA Suite ?**
La plateforme fonctionne en réseau local au sein des bureaux du CNRA. Certains modules (notamment le Portail Citoyen) peuvent être rendus accessibles via internet par l'administrateur système. Renseignez-vous auprès de votre responsable.

**Q3. La plateforme fonctionne-t-elle sur mon téléphone ?**
Oui. Tous les modules sont adaptés aux smartphones et tablettes. Utilisez le navigateur Chrome ou Firefox sur votre mobile pour une meilleure expérience.

**Q4. Mes données sont-elles en sécurité ?**
Toutes les données sont stockées sur les serveurs du CNRA, sous la responsabilité de l'institution. Les connexions sont chiffrées et vos identifiants personnels ne sont jamais partagés avec des tiers.

**Q5. Que faire si je n'arrive pas à me connecter ?**
Vérifiez (1) votre adresse email, (2) que le verrouillage Majuscules n'est pas activé, (3) que vous utilisez le bon mot de passe. Si vous avez essayé 5 fois et êtes bloqué, attendez 15 minutes ou contactez l'administrateur.

## Questions sur AntiDeep

**Q6. L'analyse AntiDeep est-elle définitive ?**
Non. L'analyse donne une probabilité, pas une certitude absolue. Un score élevé doit déclencher une vérification humaine par un expert. AntiDeep est un outil d'aide à la décision, pas un juge.

**Q7. Quels types de fichiers AntiDeep peut-il analyser ?**
AntiDeep analyse les vidéos (.mp4, .avi, .mov), les fichiers audio (.mp3, .wav) et les images (.jpg, .png). Les fichiers texte peuvent aussi être soumis pour analyse sémantique.

**Q8. Combien de temps dure une analyse ?**
Selon la taille et la complexité du fichier : 30 secondes pour une image, 2-5 minutes pour une courte vidéo, jusqu'à 15 minutes pour une vidéo longue. L'analyse se fait en arrière-plan.

## Questions sur EduMedia

**Q9. Est-ce que les formations EduMedia sont gratuites ?**
Les ressources en libre accès et de nombreuses formations de base sont gratuites. Certaines certifications avancées peuvent nécessiter une inscription préalable via votre institution ou employeur.

**Q10. Mon certificat EduMedia est-il reconnu ?**
Les certifications EduMedia sont délivrées par le CNRA, autorité officielle. Elles sont reconnues dans le cadre des formations professionnelles du secteur médiatique sénégalais.

**Q11. Puis-je partager des ressources EduMedia avec mes élèves ?**
Oui, pour les ressources marquées "Libre diffusion". Pour les autres, contactez l'administrateur EduMedia du CNRA pour obtenir une autorisation de distribution en classe.

## Questions sur ElectroWatch

**Q12. Comment est calculé le seuil d'alerte de déséquilibre ?**
Le seuil est configurable par les administrateurs ElectroWatch. Par défaut, une alerte est générée quand un candidat a reçu plus de 30% de temps de parole en plus que la moyenne des candidats sur la période analysée.

**Q13. Les candidats indépendants sont-ils pris en compte dans ElectroWatch ?**
Oui. Tout candidat officiellement enregistré par la Commission Électorale Nationale Autonome (CENA) doit être saisi dans le système et bénéficier d'une surveillance équitable.

## Questions sur MediaBase

**Q14. Comment vérifier si un journaliste est bien accrédité par le CNRA ?**
Sur MediaBase, recherchez le journaliste par nom ou numéro d'accréditation. Si la fiche affiche le statut "Accréditation valide" avec une date non expirée, le journaliste est bien accrédité. Le public peut vérifier via le portail Citoyen.

**Q15. Un média peut-il modifier ses propres informations dans MediaBase ?**
Non. Seuls les administrateurs CNRA habilités peuvent modifier les fiches. Les médias qui souhaitent mettre à jour leurs informations doivent contacter le CNRA par voie officielle.

## Questions sur MediaWatch

**Q16. Combien de sessions de monitoring puis-je avoir simultanément ouvertes ?**
Techniquement, vous pouvez avoir plusieurs sessions ouvertes (ex : surveiller deux chaînes en même temps), mais chaque session doit être gérée activement. Pour une surveillance efficace, il est recommandé de ne pas dépasser 2-3 sessions simultanées.

**Q17. Les rapports MediaWatch sont-ils automatiquement envoyés à la hiérarchie ?**
Non, par défaut. Vous devez manuellement valider et envoyer un rapport. Cependant, votre superviseur peut activer une option de "transmission automatique à validation" qui vous envoie une demande d'approbation.

## Questions sur le Portail Citoyen

**Q18. Mon signalement restera-t-il anonyme ?**
Si vous cochez l'option "Anonymat" lors de la soumission, votre identité ne sera pas divulguée au média signalé. Cependant, le CNRA conserve vos coordonnées à des fins de contact interne. Dans le cas d'une procédure judiciaire, l'anonymat peut être levé sur décision de justice.

**Q19. Puis-je signaler un contenu sur les réseaux sociaux ?**
Cela dépend. Si le contenu a été diffusé par un média audiovisuel agréé sur ses propres réseaux sociaux (ex : la page Facebook officielle de RTS), le CNRA est compétent. Si c'est un particulier sur son compte personnel, le CNRA n'est pas compétent — il faut contacter directement la plateforme (Facebook, Twitter/X, TikTok) ou l'ADIE pour les cas relevant de la cybercriminalité.

**Q20. Je n'ai pas reçu de réponse à mon signalement depuis 30 jours. Que faire ?**
Le délai légal est de 30 jours pour une première réponse. Si ce délai est dépassé, utilisez votre numéro de référence pour vérifier le statut sur le portail. Si le statut indique toujours "Reçu" sans évolution, contactez directement le CNRA par email ou téléphone (voir section Contact) en mentionnant votre numéro de référence.

---

# 10. GLOSSAIRE

Ce glossaire définit les termes techniques et réglementaires utilisés dans la CNRA Suite, en langage simple et accessible.

---

**Accréditation** : Autorisation officielle délivrée par le CNRA permettant à un journaliste d'exercer légalement et de bénéficier des droits reconnus à la presse (accès aux conférences de presse officielles, protection des sources, etc.).

**Agrément** : Autorisation administrative délivrée à une entreprise de médias lui permettant d'émettre ou de publier légalement sur le territoire sénégalais. Sans agrément, un média opère illégalement.

**Alerte** : Notification générée automatiquement par le système ou manuellement par un agent lorsqu'une situation nécessite une attention ou une action particulière (ex : déséquilibre de temps de parole, deepfake détecté).

**Audiovisuel** : Ensemble des médias qui combinent son et image : télévisions, radios, chaînes de streaming. La presse écrite et les médias en ligne sans contenu audio/vidéo ne sont pas toujours couverts par la réglementation audiovisuelle.

**Campagne** (dans AntiDeep) : Ensemble de contenus suspects liés à un même événement ou thème de désinformation, traités ensemble pour une analyse coordonnée.

**Campagne** (dans ElectroWatch) : Période de surveillance du temps de parole liée à une élection spécifique (présidentielle, législative, etc.).

**Certification** : Document officiel attestant qu'une personne a suivi et validé une formation sur la plateforme EduMedia. Signée numériquement par le CNRA.

**Deepfake** : Contenu audiovisuel (vidéo, audio ou image) fabriqué ou altéré par intelligence artificielle pour simuler des paroles, des actes ou une apparence qu'une personne n'a pas eus en réalité.

**Désinformation** : Diffusion volontaire de fausses informations dans l'intention de tromper, manipuler ou nuire. À distinguer de la mésinformation (fausse information diffusée sans intention malveillante).

**Équité du temps de parole** : Principe selon lequel les médias audiovisuels doivent accorder un temps de parole raisonnablement équitable aux différents candidats et partis politiques, notamment pendant les campagnes électorales.

**Fiche** (dans MediaBase) : Dossier numérique complet d'un média ou d'un journaliste, contenant toutes les informations légales, professionnelles et historiques.

**Groupe média** : Entreprise ou holding qui contrôle ou détient plusieurs médias différents. Ex : un groupe peut posséder à la fois une chaîne TV, une radio et un site d'information.

**Horodatage** : Enregistrement automatique de la date et de l'heure exacte à laquelle une action est effectuée dans le système. Garantit la traçabilité et l'authenticité des données.

**Instruction** (d'un signalement) : Phase d'analyse d'un signalement par les agents du CNRA, au cours de laquelle les faits sont vérifiés, les parties entendues si nécessaire, et une décision préparée.

**Intervention** (dans ElectroWatch) : Prise de parole d'un candidat, d'un représentant politique ou d'un porte-parole dans un média, mesurée en durée pour le calcul du temps de parole.

**Licence** : Autorisation spécifique liée à une fréquence d'émission (pour une radio ou TV hertzienne) ou à un type de service (streaming, etc.). Distincte de l'agrément général.

**Médias en ligne** : Sites d'information, portails d'actualité et services d'information fonctionnant sur internet. Soumis à réglementation du CNRA s'ils diffusent du contenu audiovisuel ou sont agréés comme organes de presse en ligne.

**Module** : Chaque application de la CNRA Suite (AntiDeep, EduMedia, ElectroWatch, MediaBase, MediaWatch, Citoyen) est appelée un "module".

**Monitoring** : Surveillance régulière et systématique des contenus diffusés par les médias. Activité principale des agents de veille CNRA via MediaWatch.

**Observation** : Note saisie par un agent de veille lors d'une session de monitoring pour documenter un contenu spécifique ou une anomalie constatée.

**Pétition** : Demande collective signée par des citoyens pour attirer l'attention du CNRA sur un problème médiatique ou demander une action spécifique.

**Pluralisme** : Principe fondamental selon lequel les médias doivent présenter la diversité des opinions, courants politiques, ethnies, régions et sensibilités qui composent la société sénégalaise.

**Propos haineux** : Discours qui attaque, humilie ou incite à la haine ou à la violence contre des personnes en raison de leur appartenance (ethnique, religieuse, de genre, etc.). Sanctionné par la loi.

**Rapport** (dans MediaWatch) : Document formel résumant les résultats d'une session de monitoring, les observations enregistrées, les alertes générées et les recommandations de l'agent.

**Réglementation audiovisuelle** : Ensemble des lois et règlements qui encadrent le secteur des médias audiovisuels : conditions d'obtention des licences, obligations de contenu, règles déontologiques, etc.

**Score de suspicion** : Dans AntiDeep, score de 0 à 100% indiquant la probabilité qu'un contenu soit un deepfake ou une manipulation. Plus le score est élevé, plus le contenu est suspect.

**Session** (dans MediaWatch) : Période de surveillance formellement ouverte et gérée par un agent de veille, avec un début et une fin enregistrés, pendant laquelle des observations sont collectées.

**Signalement** : Démarche par laquelle un citoyen ou professionnel informe officiellement le CNRA d'un contenu potentiellement problématique diffusé par un média.

**Suspension** : Sanction prononcée par le CNRA obligeant un média à cesser temporairement d'émettre ou d'émettre un programme spécifique.

**Temps de parole** : Durée totale pendant laquelle un acteur politique (candidat, parti, représentant) s'exprime dans les médias audiovisuels. Mesuré et surveillé pour garantir l'équité électorale.

**Traçabilité** : Capacité à retrouver qui a effectué quelle action dans le système, à quelle heure et depuis quel poste. Toutes les actions des agents sont tracées pour des raisons d'intégrité et de sécurité.

**Veille** : Surveillance régulière et proactive d'un domaine (les médias) pour détecter des tendances, des anomalies ou des violations avant qu'elles ne s'aggravent.

---

# 11. CONTACT ET SUPPORT

## 11.1 Qui contacter selon votre problème

### Problèmes techniques (connexion, bugs, lenteurs)

**Référent technique / Administrateur système CNRA**
- 📧 Email : support-technique@cnra.sn
- 📞 Téléphone : +221 33 XXX XX XX
- ⏰ Disponibilité : Lundi-Vendredi, 8h00-17h00
- 🔴 Urgences techniques (hors horaires) : +221 77 XXX XX XX

**Avant de contacter le support technique, notez** :
- Le module concerné (ex : MediaWatch)
- L'heure exacte du problème
- Ce que vous faisiez au moment du problème
- Le message d'erreur exact (si affiché)
- Capture d'écran si possible

### Questions sur l'utilisation des modules

**Formation et accompagnement**
- 📧 Email : formation@cnra.sn
- 📞 Téléphone : +221 33 XXX XX XX poste 104
- ⏰ Disponibilité : Lundi-Vendredi, 9h00-16h00

### Signalements et plaintes (Portail Citoyen)

**Service des relations avec le public**
- 📧 Email : signalements@cnra.sn
- 📞 Téléphone : +221 33 XXX XX XX
- 📬 Courrier : CNRA, [Adresse officielle], Dakar, Sénégal
- ⏰ Disponibilité : Lundi-Vendredi, 8h30-16h30

### Questions sur les accréditations et agréments (MediaBase)

**Direction des agréments et accréditations**
- 📧 Email : accreditations@cnra.sn
- 📞 Téléphone : +221 33 XXX XX XX poste 201

### Questions générales sur le CNRA

**Secrétariat général**
- 📧 Email : contact@cnra.sn
- 🌐 Site web officiel : www.cnra.sn
- 📍 Adresse : Dakar, Sénégal

## 11.2 Signaler un bug ou suggérer une amélioration

La CNRA Suite est en constante amélioration. Si vous avez une suggestion ou si vous trouvez un bug :

1. Dans n'importe quel module, cliquez sur **"Aide"** ou **"Feedback"** en bas de page
2. Décrivez le problème ou la suggestion en détail
3. Ajoutez des captures d'écran si pertinent
4. Cliquez sur **"Envoyer"**

Votre retour est précieux et contribue à améliorer la plateforme pour tous les utilisateurs.

## 11.3 Formation et prise en main

Des sessions de formation à la CNRA Suite sont organisées régulièrement :

- **Formation initiale** : Pour les nouveaux agents CNRA (2 jours)
- **Formation avancée** : Pour les agents souhaitant approfondir un module spécifique (1 jour)
- **Webinaires** : Sessions en ligne thématiques (1-2h, mensuelles)
- **Tutoriels vidéo** : Disponibles sur EduMedia (`http://localhost:3002`)

Pour vous inscrire à une session de formation : 📧 formation@cnra.sn

---

## 📌 RÉSUMÉ RAPIDE — ACCÈS AUX MODULES

| Module | Adresse | Utilisateurs principaux |
|--------|---------|------------------------|
| 🔍 AntiDeep | http://localhost:3001 | Analystes, juristes CNRA |
| 📚 EduMedia | http://localhost:3002 | Formateurs, enseignants, public |
| 🗳️ ElectroWatch | http://localhost:3003 | Agents monitoring, observateurs |
| 📁 MediaBase | http://localhost:3004 | Administrateurs, journalistes |
| 👁️ MediaWatch | http://localhost:3008 | Agents de veille CNRA |
| 🏛️ Citoyen | http://localhost:3006 | Tous les citoyens sénégalais |

---

*Guide rédigé par la Direction des Systèmes d'Information du CNRA — Version 1.0, Juin 2026*  
*Pour toute question sur ce guide : formation@cnra.sn*

*© CNRA Sénégal — Conseil National de Régulation de l'Audiovisuel*
