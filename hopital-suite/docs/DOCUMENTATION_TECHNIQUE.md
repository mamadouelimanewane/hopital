# CNRA Suite — Documentation Technique Complète

> **Version** : 1.0.0  
> **Date** : Juin 2026  
> **Auteur** : Équipe technique CNRA  
> **Statut** : Production  

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Architecture globale](#2-architecture-globale)
3. [Stack technologique](#3-stack-technologique)
4. [Installation et configuration](#4-installation-et-configuration)
5. [Modules — Description détaillée](#5-modules--description-détaillée)
   - 5.1 [AntiDeep (port 3001)](#51-antideep-port-3001)
   - 5.2 [EduMedia (port 3002)](#52-edumedia-port-3002)
   - 5.3 [ElectroWatch (port 3003)](#53-electrowatch-port-3003)
   - 5.4 [MediaBase (port 3004)](#54-mediabase-port-3004)
   - 5.5 [MediaWatch (port 3008)](#55-mediawatch-port-3008)
   - 5.6 [Citoyen (port 3006)](#56-citoyen-port-3006)
6. [Base de données Supabase](#6-base-de-données-supabase)
7. [Composants partagés](#7-composants-partagés)
8. [Système de tests](#8-système-de-tests)
9. [Patterns de développement](#9-patterns-de-développement)
10. [Déploiement](#10-déploiement)
11. [Troubleshooting](#11-troubleshooting)
12. [Roadmap technique](#12-roadmap-technique)
13. [Annexes](#13-annexes)

---

## 1. Vue d'ensemble

### 1.1 Présentation

La **CNRA Suite** est un ensemble de six applications web indépendantes développées pour le **Conseil National de Régulation de l'Audiovisuel du Sénégal (CNRA)**. Chaque application couvre un domaine fonctionnel distinct de la régulation audiovisuelle : détection de désinformation, éducation aux médias, surveillance électorale, référentiel des médias, monitoring de contenu et participation citoyenne.

### 1.2 Périmètre fonctionnel

| Module | Port | Domaine | Utilisateurs cibles |
|--------|------|---------|---------------------|
| AntiDeep | 3001 | Détection IA deepfakes & désinformation | Analystes CNRA, experts IA |
| EduMedia | 3002 | Éducation aux médias & littératie numérique | Formateurs, grand public |
| ElectroWatch | 3003 | Surveillance temps de parole électoral | Observateurs électoraux, régulateurs |
| MediaBase | 3004 | Base de données des médias sénégalais | Administrateurs, journalistes |
| MediaWatch | 3008 | Monitoring & veille audiovisuelle | Agents de veille CNRA |
| Citoyen | 3006 | Portail citoyen & signalements | Grand public, associations |

### 1.3 Principes directeurs

- **Indépendance des modules** : chaque application est autonome, déployable séparément
- **Stack unifiée** : même socle technologique pour faciliter la maintenance
- **Base de données commune** : projet Supabase unique partagé entre les modules
- **Design system cohérent** : composants UI réutilisables, identité visuelle CNRA
- **Accessibilité** : respect des standards WCAG 2.1 AA

---

## 2. Architecture globale

### 2.1 Diagramme d'architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CNRA SUITE                                     │
│                                                                             │
│  ┌──────────┐  ┌──────────┐  ┌─────────────┐  ┌──────────┐                │
│  │AntiDeep  │  │ EduMedia │  │ElectroWatch │  │MediaBase │                │
│  │ :3001    │  │  :3002   │  │   :3003     │  │  :3004   │                │
│  └────┬─────┘  └────┬─────┘  └──────┬──────┘  └────┬─────┘                │
│       │             │               │               │                       │
│  ┌────┴─────────────┴───────────────┴───────────────┴─────┐                │
│  │                    Next.js 16.2.9                       │                │
│  │              React 19 + TypeScript 5                    │                │
│  │              Tailwind CSS v4 + clsx/twmerge             │                │
│  └──────────────────────────┬──────────────────────────────┘                │
│                             │                                               │
│  ┌──────────┐  ┌────────────▼──────────────────────────────────────────┐   │
│  │MediaWatch│  │                    SUPABASE                           │   │
│  │  :3008   │  │  ┌─────────────┐  ┌────────────┐  ┌──────────────┐   │   │
│  └────┬─────┘  │  │ PostgreSQL  │  │    Auth    │  │  Realtime    │   │   │
│       │        │  │  (tables)   │  │  (JWT/RLS) │  │  (websocket) │   │   │
│  ┌────┴─────┐  │  └─────────────┘  └────────────┘  └──────────────┘   │   │
│  │ Citoyen  │  │  ┌─────────────┐  ┌────────────┐                     │   │
│  │  :3006   │  │  │   Storage   │  │  Edge Fn   │                     │   │
│  └──────────┘  │  │  (médias)   │  │  (workers) │                     │   │
│                │  └─────────────┘  └────────────┘                     │   │
│                └───────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Flux de données

```
UTILISATEUR
    │
    ▼
┌─────────────────────────────────┐
│     Next.js App Router          │
│  ┌──────────┐  ┌─────────────┐  │
│  │  Server  │  │   Client    │  │
│  │Components│  │ Components  │  │
│  └────┬─────┘  └──────┬──────┘  │
│       │               │         │
│  ┌────▼─────┐   ┌─────▼──────┐  │
│  │ Server   │   │ Browser    │  │
│  │ Actions  │   │ Supabase   │  │
│  │ (RSC)    │   │ Client     │  │
│  └────┬─────┘   └─────┬──────┘  │
└───────┼───────────────┼─────────┘
        │               │
        └───────┬────────┘
                ▼
         ┌──────────────┐
         │   SUPABASE   │
         │  PostgreSQL  │
         │  + Auth RLS  │
         └──────────────┘
```

### 2.3 Structure du workspace

```
C:\gravity\cnra-suite\
├── antideep/               # Module 1 — Détection deepfakes
├── edumedia/               # Module 2 — Éducation médias
├── electrowatch/           # Module 3 — Surveillance électorale
├── mediabase/              # Module 4 — Base de données médias
├── mediawatch/             # Module 5 — Monitoring contenus
├── citoyen/                # Module 6 — Portail citoyen
├── node_modules -> junction # Junction NTFS → mediawatch/node_modules
├── package.json            # Workspace racine (tests Vitest)
├── vitest.config.ts        # Configuration tests workspace
└── docs/
    └── DOCUMENTATION_TECHNIQUE.md  ← ce fichier
```

### 2.4 Modèle de déploiement

Chaque module est déployé comme une application Next.js indépendante. Deux options sont documentées :

- **Vercel** (recommandé pour la scalabilité) : chaque module = 1 projet Vercel
- **VPS Ubuntu** (recommandé pour la souveraineté des données) : PM2 + Nginx reverse proxy

---

## 3. Stack technologique

### 3.1 Tableau de synthèse

| Technologie | Version | Rôle | Justification |
|-------------|---------|------|---------------|
| Next.js | 16.2.9 | Framework fullstack | App Router, SSR/SSG, Server Actions, Turbopack |
| React | 19.2.4 | UI library | Concurrent features, Server Components, Suspense |
| TypeScript | 5.x | Typage statique | Sécurité type-safe à l'échelle du projet |
| Tailwind CSS | v4 | Styling utilitaire | CSS-in-JS zéro runtime, cohérence design |
| Supabase | Latest | Backend as a Service | PostgreSQL + Auth + Realtime + Storage |
| Recharts | 3.x | Visualisations | Composants React, responsive, SVG natif |
| Lucide React | Latest | Icônes | Bibliothèque légère, cohérence visuelle |
| clsx | Latest | Classes conditionnelles | Composition de classes CSS simplifiée |
| tailwind-merge | Latest | Fusion de classes | Résolution des conflits Tailwind |
| Vitest | Latest | Tests unitaires | Compatibilité Vite/ESM, API Jest-compatible |
| @testing-library | Latest | Test DOM | Approche user-centric, ARIA-based |

### 3.2 Next.js 16.2.9 — App Router

L'App Router (disponible depuis Next.js 13) est le paradigme central de la CNRA Suite. Il permet de mélanger Server Components (RSC) et Client Components dans la même arborescence.

**Avantages utilisés :**

```typescript
// Server Component — rendu côté serveur, pas de bundle JS côté client
// app/dashboard/page.tsx
import { createServerClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = createServerClient()
  const { data } = await supabase.from('medias').select('*')
  return <MediaList medias={data} />
}

// Client Component — interactivité, hooks, événements
// components/MediaList.tsx
'use client'
import { useState } from 'react'

export function MediaList({ medias }) {
  const [filter, setFilter] = useState('')
  // ...
}
```

**Règles de séparation RSC/Client :**

- `'use client'` uniquement si : hooks React, événements DOM, localStorage, animations
- Les Server Components peuvent passer des données aux Client Components via props
- Les Client Components NE PEUVENT PAS importer des Server Components

### 3.3 Tailwind CSS v4

La version 4 de Tailwind CSS apporte des changements majeurs par rapport à v3 :

```css
/* globals.css — configuration v4 */
@import "tailwindcss";

/* Variables CSS custom (thème CNRA) */
@theme {
  --color-cnra-blue: #1A3A6B;
  --color-cnra-gold: #C9A84C;
  --color-cnra-red: #C0392B;
}
```

```javascript
// postcss.config.js — @tailwindcss/postcss (remplace tailwindcss)
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

**Différences v3 → v4 à connaître :**
- Plus de fichier `tailwind.config.js` (configuration dans CSS)
- Plugin PostCSS `@tailwindcss/postcss` (pas `tailwindcss`)
- Classes v4 légèrement différentes : `bg-gray-950` disponible nativement

### 3.4 Supabase

Supabase est utilisé comme backend complet :

| Service Supabase | Usage dans CNRA Suite |
|-----------------|----------------------|
| **PostgreSQL** | Stockage de toutes les données métier |
| **Auth** | Authentification des agents CNRA, JWT |
| **RLS** | Isolation des données par rôle/module |
| **Realtime** | Alertes en temps réel (ElectroWatch, MediaWatch) |
| **Storage** | Fichiers médias, pièces jointes signalements |
| **Edge Functions** | Webhooks, traitements asynchrones |

**Clients Supabase (pattern commun) :**

```typescript
// lib/supabase/client.ts — pour les Client Components
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// lib/supabase/server.ts — pour les Server Components et Server Actions
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

---

## 4. Installation et configuration

### 4.1 Prérequis

| Outil | Version minimale | Notes |
|-------|-----------------|-------|
| Node.js | 20.x LTS | Next.js 16 requiert Node 20+ |
| npm | 10.x | Inclus avec Node 20 |
| Git | 2.x | Gestion de version |
| Windows | 10/11 | Pour les junctions NTFS |
| Compte Supabase | — | Projet créé sur app.supabase.com |

### 4.2 Variables d'environnement

Chaque module possède son propre fichier `.env.local`. Les variables suivantes sont communes à tous :

```bash
# .env.local (commun à tous les modules)

# Supabase — connexion publique (safe à exposer côté client)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase — clé service (NE JAMAIS exposer côté client)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# URL publique du module (pour metadata et partage social)
NEXT_PUBLIC_APP_URL=http://localhost:300X
```

Variables spécifiques par module :

```bash
# ElectroWatch uniquement
NEXT_PUBLIC_CNRA_BLUE=#1A3A6B
NEXT_PUBLIC_CNRA_GOLD=#C9A84C

# AntiDeep — API IA externe (si utilisée)
AI_API_KEY=sk-...
AI_API_ENDPOINT=https://api.example.com/v1
```

### 4.3 Installation complète

```bash
# 1. Cloner le dépôt
git clone https://github.com/cnra-sn/cnra-suite.git
cd cnra-suite

# 2. Créer la junction NTFS (Windows uniquement, en tant qu'administrateur)
# Cette junction permet à tous les modules de partager node_modules
mklink /J node_modules mediawatch\node_modules

# 3. Installer les dépendances de chaque module
cd antideep && npm install && cd ..
cd edumedia && npm install && cd ..
cd electrowatch && npm install && cd ..
cd mediabase && npm install && cd ..
cd mediawatch && npm install && cd ..
cd citoyen && npm install && cd ..

# 4. Copier et configurer les variables d'environnement
for module in antideep edumedia electrowatch mediabase mediawatch citoyen; do
  cp $module/.env.example $module/.env.local
  echo "Configure $module/.env.local with your Supabase credentials"
done

# 5. Initialiser la base de données (scripts SQL dans docs/sql/)
# Exécuter dans l'ordre dans le SQL Editor Supabase
```

### 4.4 Démarrage en développement

```bash
# Démarrer un module individuel
cd antideep && npm run dev    # → http://localhost:3001
cd edumedia && npm run dev    # → http://localhost:3002
cd electrowatch && npm run dev # → http://localhost:3003
cd mediabase && npm run dev   # → http://localhost:3004
cd mediawatch && npm run dev  # → http://localhost:3008
cd citoyen && npm run dev     # → http://localhost:3006

# Démarrer tous les modules en parallèle (Windows PowerShell)
$modules = @{
  antideep = 3001; edumedia = 3002; electrowatch = 3003
  mediabase = 3004; mediawatch = 3008; citoyen = 3006
}
$modules.GetEnumerator() | ForEach-Object {
  Start-Process powershell -ArgumentList "-NoExit", "-Command", 
    "cd C:\gravity\cnra-suite\$($_.Key); npm run dev -- --port $($_.Value)"
}
```

### 4.5 Scripts npm disponibles

```json
// package.json (racine workspace)
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}

// package.json (chaque module)
{
  "scripts": {
    "dev": "next dev --turbopack --port 300X",
    "build": "next build",
    "start": "next start --port 300X",
    "lint": "next lint",
    "test": "vitest run"
  }
}
```

---

## 5. Modules — Description détaillée

### 5.1 AntiDeep (port 3001)

#### Présentation

AntiDeep est l'outil de détection IA de deepfakes et de désinformation audiovisuelle du CNRA. Il permet d'analyser des contenus soumis, de suivre des campagnes de désinformation, d'identifier des sources suspectes et de maintenir une base de signatures pour la détection automatisée.

**Identité visuelle :** Thème sombre (`bg-gray-950`), couleurs violet/purple

#### Structure des fichiers

```
antideep/
├── app/
│   ├── (app)/
│   │   ├── layout.tsx              # Layout principal avec sidebar mobile
│   │   ├── dashboard/
│   │   │   └── page.tsx            # Tableau de bord principal
│   │   ├── contenus/
│   │   │   ├── page.tsx            # Liste des contenus soumis
│   │   │   └── [id]/page.tsx       # Détail analyse
│   │   ├── campagnes/
│   │   │   ├── page.tsx            # Campagnes de désinformation
│   │   │   └── [id]/page.tsx       # Détail campagne
│   │   ├── sources/
│   │   │   └── page.tsx            # Sources suspectes
│   │   └── signatures/
│   │       └── page.tsx            # Base de signatures IA
│   ├── globals.css                 # Styles globaux (thème violet/dark)
│   └── layout.tsx                  # Root layout + metadata
├── components/
│   ├── Sidebar.tsx                 # Navigation (thème violet/purple)
│   ├── Toast.tsx                   # Notifications
│   ├── PageSkeleton.tsx            # Loading states
│   ├── EmptyState.tsx              # États vides
│   └── AnalyseCard.tsx             # Carte résultat analyse
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── utils.ts
├── types/
│   └── index.ts                    # Types TypeScript
└── package.json
```

#### Routes et pages

| Route | Composant | Description |
|-------|-----------|-------------|
| `/dashboard` | `DashboardPage` | Vue d'ensemble, stats temps réel |
| `/contenus` | `ContenuListPage` | Liste des contenus soumis à l'analyse |
| `/contenus/[id]` | `ContenuDetailPage` | Rapport d'analyse détaillé |
| `/campagnes` | `CampagnesPage` | Suivi des campagnes de désinformation |
| `/campagnes/[id]` | `CampagneDetailPage` | Timeline et acteurs d'une campagne |
| `/sources` | `SourcesPage` | Sources suspectes identifiées |
| `/signatures` | `SignaturesPage` | Base de signatures deepfakes |

#### Types principaux

```typescript
// types/index.ts

export type StatutAnalyse = 'en_attente' | 'en_cours' | 'termine' | 'erreur'
export type NiveauRisque = 'faible' | 'moyen' | 'eleve' | 'critique'
export type TypeContenu = 'video' | 'audio' | 'image' | 'texte'

export interface ContenuAnalyse {
  id: string
  url?: string
  titre: string
  type: TypeContenu
  statut: StatutAnalyse
  niveau_risque?: NiveauRisque
  score_confiance?: number  // 0-100
  date_soumission: string
  date_analyse?: string
  source_id?: string
  campagne_id?: string
  metadata: Record<string, unknown>
}

export interface CampagneDesinformation {
  id: string
  nom: string
  description: string
  date_debut: string
  date_fin?: string
  actif: boolean
  sources: Source[]
  contenus: ContenuAnalyse[]
  nb_contenus: number
}

export interface Source {
  id: string
  nom: string
  url: string
  type: 'site_web' | 'reseau_social' | 'chaine_telegram' | 'autre'
  niveau_suspicion: NiveauRisque
  date_identification: string
  campagnes: string[]  // IDs campagnes associées
}

export interface SignatureDeepfake {
  id: string
  hash_signature: string
  type_modele: string  // ex: "FaceSwap v2", "Wav2Lip"
  date_creation: string
  nb_occurrences: number
  confiance_detection: number
}
```

#### Tables Supabase (AntiDeep)

```sql
-- Contenus soumis à l'analyse
CREATE TABLE contenus_analyse (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT,
  titre TEXT NOT NULL,
  type TEXT CHECK (type IN ('video','audio','image','texte')),
  statut TEXT DEFAULT 'en_attente',
  niveau_risque TEXT,
  score_confiance NUMERIC(5,2),
  date_soumission TIMESTAMPTZ DEFAULT NOW(),
  date_analyse TIMESTAMPTZ,
  source_id UUID REFERENCES sources(id),
  campagne_id UUID REFERENCES campagnes_desinformation(id),
  metadata JSONB DEFAULT '{}'
);

-- Sources suspectes
CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  type TEXT,
  niveau_suspicion TEXT DEFAULT 'faible',
  date_identification TIMESTAMPTZ DEFAULT NOW()
);

-- Campagnes de désinformation
CREATE TABLE campagnes_desinformation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  description TEXT,
  date_debut TIMESTAMPTZ NOT NULL,
  date_fin TIMESTAMPTZ,
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Base de signatures deepfakes
CREATE TABLE signatures_deepfake (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hash_signature TEXT UNIQUE NOT NULL,
  type_modele TEXT,
  date_creation TIMESTAMPTZ DEFAULT NOW(),
  nb_occurrences INTEGER DEFAULT 1,
  confiance_detection NUMERIC(5,2)
);
```

---

### 5.2 EduMedia (port 3002)

#### Présentation

EduMedia est la plateforme d'éducation aux médias et à la littératie numérique du CNRA. Elle gère les ressources pédagogiques, les quiz interactifs, les formations et les certifications pour renforcer l'esprit critique des citoyens face aux médias.

**Identité visuelle :** Couleur indigo (`indigo-600`, `indigo-700`)

#### Structure des fichiers

```
edumedia/
├── app/
│   ├── (app)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── ressources/
│   │   │   ├── page.tsx            # Catalogue de ressources
│   │   │   └── [id]/page.tsx       # Détail ressource
│   │   ├── quiz/
│   │   │   ├── page.tsx            # Liste des quiz
│   │   │   └── [id]/
│   │   │       ├── page.tsx        # Passage quiz
│   │   │       └── resultats/page.tsx
│   │   ├── formations/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── certifications/
│   │       └── page.tsx
│   └── layout.tsx
├── components/
│   ├── Sidebar.tsx                 # Navigation indigo
│   ├── RessourceCard.tsx
│   ├── QuizPlayer.tsx              # Composant quiz interactif
│   ├── CertificationBadge.tsx
│   └── ProgressBar.tsx
├── lib/
│   ├── supabase/
│   └── utils.ts
└── types/index.ts
```

#### Types principaux

```typescript
// types/index.ts

export type NiveauDifficulte = 'debutant' | 'intermediaire' | 'avance'
export type TypeRessource = 'article' | 'video' | 'infographie' | 'podcast' | 'guide'
export type StatutFormation = 'non_commence' | 'en_cours' | 'termine'

export interface Ressource {
  id: string
  titre: string
  description: string
  type: TypeRessource
  niveau: NiveauDifficulte
  duree_minutes?: number
  url_contenu: string
  url_thumbnail?: string
  tags: string[]
  auteur: string
  date_publication: string
  nb_vues: number
  nb_likes: number
}

export interface Quiz {
  id: string
  titre: string
  description: string
  niveau: NiveauDifficulte
  duree_minutes: number
  nb_questions: number
  score_minimum_certification: number  // pourcentage
  questions: Question[]
}

export interface Question {
  id: string
  quiz_id: string
  enonce: string
  type: 'qcm' | 'vrai_faux' | 'texte_libre'
  options?: string[]
  reponse_correcte: string | string[]
  explication: string
  points: number
}

export interface Formation {
  id: string
  titre: string
  description: string
  niveau: NiveauDifficulte
  modules: ModuleFormation[]
  duree_totale_heures: number
  certificante: boolean
  nb_inscrits: number
}

export interface Certification {
  id: string
  utilisateur_id: string
  formation_id?: string
  quiz_id?: string
  titre_certification: string
  date_obtention: string
  date_expiration?: string
  score: number
  code_verification: string
}
```

#### Tables Supabase (EduMedia)

```sql
CREATE TABLE ressources_pedagogiques (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  description TEXT,
  type TEXT,
  niveau TEXT DEFAULT 'debutant',
  duree_minutes INTEGER,
  url_contenu TEXT,
  url_thumbnail TEXT,
  tags TEXT[],
  auteur TEXT,
  date_publication TIMESTAMPTZ DEFAULT NOW(),
  nb_vues INTEGER DEFAULT 0,
  nb_likes INTEGER DEFAULT 0
);

CREATE TABLE quiz (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  description TEXT,
  niveau TEXT,
  duree_minutes INTEGER,
  score_minimum_certification NUMERIC(5,2) DEFAULT 70,
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quiz(id) ON DELETE CASCADE,
  enonce TEXT NOT NULL,
  type TEXT CHECK (type IN ('qcm','vrai_faux','texte_libre')),
  options JSONB,
  reponse_correcte JSONB NOT NULL,
  explication TEXT,
  points INTEGER DEFAULT 1,
  ordre INTEGER
);

CREATE TABLE formations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  description TEXT,
  niveau TEXT,
  duree_totale_heures NUMERIC(5,1),
  certificante BOOLEAN DEFAULT FALSE,
  nb_inscrits INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utilisateur_id UUID REFERENCES auth.users(id),
  formation_id UUID REFERENCES formations(id),
  quiz_id UUID REFERENCES quiz(id),
  titre_certification TEXT NOT NULL,
  date_obtention TIMESTAMPTZ DEFAULT NOW(),
  date_expiration TIMESTAMPTZ,
  score NUMERIC(5,2),
  code_verification TEXT UNIQUE DEFAULT gen_random_uuid()::TEXT
);
```

---

### 5.3 ElectroWatch (port 3003)

#### Présentation

ElectroWatch est le module de surveillance du temps de parole électoral. Il permet un monitoring en temps réel de l'équité de traitement médiatique entre partis politiques pendant les campagnes électorales, avec génération d'alertes en cas de déséquilibre.

**Identité visuelle :** Bleu CNRA `#1A3A6B` et or `#C9A84C`

#### Structure spéciale (src/)

ElectroWatch utilise le répertoire `src/` contrairement aux autres modules qui utilisent directement `app/` à la racine :

```
electrowatch/src/
├── app/
│   └── (dashboard)/
│       ├── layout.tsx
│       ├── page.tsx               # Dashboard principal
│       ├── campagnes/
│       │   ├── page.tsx
│       │   └── [id]/page.tsx
│       ├── interventions/
│       │   └── page.tsx
│       ├── partis/
│       │   └── page.tsx
│       ├── medias/
│       │   └── page.tsx
│       └── alertes/
│           └── page.tsx
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx            # Navigation bleu CNRA
│   │   └── Header.tsx             # En-tête avec breadcrumb
│   ├── dashboard/
│   │   ├── StatCard.tsx           # Carte statistique
│   │   └── AlerteItem.tsx         # Item d'alerte
│   ├── charts/
│   │   ├── TempsDeparoleChart.tsx # Graphique temps de parole (Recharts)
│   │   └── EquilibreChart.tsx     # Graphique équilibre
│   └── ui/
│       └── toast.tsx              # Notifications
├── hooks/
│   └── useStats.ts                # Hooks de données
├── types/
│   └── index.ts
└── lib/
    └── utils.ts
```

#### Fonctions utilitaires clés

```typescript
// lib/utils.ts

/**
 * Formate une durée en secondes vers un affichage lisible
 * @example formatDuree(3723) → "1h 02min"
 */
export function formatDuree(secondes: number): string {
  if (secondes < 60) return `${secondes}s`
  const heures = Math.floor(secondes / 3600)
  const minutes = Math.floor((secondes % 3600) / 60)
  if (heures > 0) return `${heures}h ${String(minutes).padStart(2, '0')}min`
  return `${minutes}min`
}

/**
 * Formate un pourcentage avec précision configurable
 * @example formatPourcentage(33.333, 1) → "33.3%"
 */
export function formatPourcentage(valeur: number, decimales = 1): string {
  return `${valeur.toFixed(decimales)}%`
}

/**
 * Convertit des secondes en format HH:MM:SS
 * @example secondesEnHHMMSS(3723) → "01:02:03"
 */
export function secondesEnHHMMSS(secondes: number): string {
  const h = Math.floor(secondes / 3600)
  const m = Math.floor((secondes % 3600) / 60)
  const s = secondes % 60
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':')
}

/**
 * Calcule la durée en secondes entre deux timestamps
 */
export function calculerDureeEntre(debut: string, fin: string): number {
  return Math.floor((new Date(fin).getTime() - new Date(debut).getTime()) / 1000)
}

/**
 * Retourne le badge de statut d'une campagne électorale
 */
export function getStatutCampagneBadge(statut: string): {
  label: string
  className: string
} {
  const badges = {
    'planifiee': { label: 'Planifiée', className: 'bg-gray-100 text-gray-700' },
    'en_cours': { label: 'En cours', className: 'bg-green-100 text-green-700' },
    'terminee': { label: 'Terminée', className: 'bg-blue-100 text-blue-700' },
    'suspendue': { label: 'Suspendue', className: 'bg-red-100 text-red-700' },
  }
  return badges[statut] ?? { label: statut, className: 'bg-gray-100 text-gray-700' }
}

/**
 * Retourne la couleur associée au niveau d'alerte
 */
export function getNiveauAlerteColor(niveau: string): string {
  const colors = {
    'info': '#3B82F6',      // blue-500
    'avertissement': '#F59E0B', // amber-500
    'critique': '#EF4444',  // red-500
  }
  return colors[niveau] ?? '#6B7280'
}
```

#### Hooks de données

```typescript
// hooks/useStats.ts

'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * Retourne la campagne électorale actuellement active
 */
export function useCampagneActive() {
  const [campagne, setCampagne] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchCampagne() {
      const { data } = await supabase
        .from('campagnes_electorales')
        .select('*')
        .eq('statut', 'en_cours')
        .single()
      setCampagne(data)
      setLoading(false)
    }
    fetchCampagne()
  }, [])

  return { campagne, loading }
}

/**
 * Statistiques agrégées d'une campagne électorale
 */
export function useStatsCampagne(campagneId: string | null) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!campagneId) return
    async function fetchStats() {
      const { data } = await supabase.rpc('get_stats_campagne', { 
        p_campagne_id: campagneId 
      })
      setStats(data)
      setLoading(false)
    }
    fetchStats()
  }, [campagneId])

  return { stats, loading }
}

/**
 * Alertes non lues, avec abonnement Realtime
 */
export function useAlertesNonLues() {
  const [alertes, setAlertes] = useState([])
  const supabase = createClient()

  useEffect(() => {
    // Chargement initial
    supabase
      .from('alertes_desequilibre')
      .select('*')
      .eq('lue', false)
      .order('created_at', { ascending: false })
      .then(({ data }) => setAlertes(data ?? []))

    // Abonnement Realtime
    const channel = supabase
      .channel('alertes-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'alertes_desequilibre'
      }, (payload) => {
        setAlertes(prev => [payload.new, ...prev])
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  return alertes
}
```

#### Tables Supabase (ElectroWatch)

```sql
CREATE TABLE campagnes_electorales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  type TEXT CHECK (type IN ('presidentielle','legislatives','locales','senatoriales')),
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  statut TEXT DEFAULT 'planifiee',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE partis_politiques (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  sigle TEXT,
  couleur_hex TEXT DEFAULT '#1A3A6B',
  logo_url TEXT,
  actif BOOLEAN DEFAULT TRUE
);

CREATE TABLE medias_surveillance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  type TEXT CHECK (type IN ('television','radio','en_ligne')),
  actif BOOLEAN DEFAULT TRUE
);

CREATE TABLE interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campagne_id UUID REFERENCES campagnes_electorales(id),
  parti_id UUID REFERENCES partis_politiques(id),
  media_id UUID REFERENCES medias_surveillance(id),
  date_heure TIMESTAMPTZ NOT NULL,
  duree_secondes INTEGER NOT NULL CHECK (duree_secondes > 0),
  type_intervention TEXT CHECK (type IN ('discours','interview','reportage','publicite')),
  favorable BOOLEAN,  -- ton éditorial
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE alertes_desequilibre (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campagne_id UUID REFERENCES campagnes_electorales(id),
  media_id UUID REFERENCES medias_surveillance(id),
  parti_id UUID REFERENCES partis_politiques(id),
  niveau TEXT CHECK (niveau IN ('info','avertissement','critique')),
  message TEXT NOT NULL,
  pourcentage_ecart NUMERIC(5,2),
  lue BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vue matérialisée pour les statistiques de temps de parole
CREATE MATERIALIZED VIEW stats_temps_parole AS
SELECT
  campagne_id,
  parti_id,
  media_id,
  SUM(duree_secondes) as total_secondes,
  COUNT(*) as nb_interventions,
  ROUND(
    SUM(duree_secondes)::NUMERIC / 
    SUM(SUM(duree_secondes)) OVER (PARTITION BY campagne_id, media_id) * 100,
    2
  ) as pourcentage
FROM interventions
GROUP BY campagne_id, parti_id, media_id;
```

---

### 5.4 MediaBase (port 3004)

#### Présentation

MediaBase est le référentiel centralisé des médias sénégalais. Il répertorie l'ensemble des opérateurs audiovisuels (télévisions, radios, médias en ligne), des journalistes accrédités, des groupes médias et les statistiques d'audience.

**Identité visuelle :** Bleu institutionnel CNRA

#### Structure des fichiers

```
mediabase/
├── app/
│   ├── (app)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── medias/
│   │   │   ├── page.tsx            # Liste tous médias
│   │   │   ├── [id]/page.tsx       # Fiche média
│   │   │   ├── television/page.tsx
│   │   │   ├── radio/page.tsx
│   │   │   └── en-ligne/page.tsx
│   │   ├── journalistes/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── groupes/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── audience/
│   │       └── page.tsx
│   └── layout.tsx
├── components/
│   ├── Sidebar.tsx
│   ├── MediaCard.tsx
│   ├── JournalisteCard.tsx
│   └── AudienceChart.tsx
└── types/index.ts
```

#### Types principaux

```typescript
// types/index.ts

export type TypeMedia = 'television' | 'radio' | 'en_ligne'
export type StatutMedia = 'actif' | 'suspendu' | 'ferme' | 'en_attente_agrement'
export type ZoneCouverture = 'national' | 'regional' | 'local'

export interface Media {
  id: string
  nom: string
  type: TypeMedia
  statut: StatutMedia
  zone_couverture: ZoneCouverture
  frequence?: string          // Pour les radios
  canal?: number              // Pour les télévisions
  url?: string                // Pour les médias en ligne
  groupe_id?: string
  date_creation: string
  date_agrement?: string
  ville_siege: string
  logo_url?: string
  description?: string
  nb_journalistes?: number
}

export interface Journaliste {
  id: string
  nom: string
  prenom: string
  email?: string
  telephone?: string
  media_id: string
  media?: Media
  specialites: string[]
  date_accreditation: string
  numero_carte_presse: string
  photo_url?: string
  actif: boolean
}

export interface GroupeMedia {
  id: string
  nom: string
  proprietaire: string
  date_creation: string
  medias: Media[]
  nb_medias: number
  pays_origine: string
}

export interface StatsAudience {
  id: string
  media_id: string
  periode: string  // format YYYY-MM
  audience_hebdo?: number
  part_de_marche?: number
  source: string
  date_mesure: string
}
```

#### Tables Supabase (MediaBase)

```sql
CREATE TABLE medias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  type TEXT CHECK (type IN ('television','radio','en_ligne')),
  statut TEXT DEFAULT 'actif',
  zone_couverture TEXT DEFAULT 'national',
  frequence TEXT,
  canal INTEGER,
  url TEXT,
  groupe_id UUID REFERENCES groupes_media(id),
  date_creation DATE,
  date_agrement DATE,
  ville_siege TEXT DEFAULT 'Dakar',
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE journalistes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT UNIQUE,
  telephone TEXT,
  media_id UUID REFERENCES medias(id),
  specialites TEXT[],
  date_accreditation DATE,
  numero_carte_presse TEXT UNIQUE,
  photo_url TEXT,
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE groupes_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  proprietaire TEXT,
  date_creation DATE,
  pays_origine TEXT DEFAULT 'Sénégal',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE stats_audience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID REFERENCES medias(id) ON DELETE CASCADE,
  periode TEXT NOT NULL,  -- YYYY-MM
  audience_hebdo BIGINT,
  part_de_marche NUMERIC(5,2),
  source TEXT,
  date_mesure DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(media_id, periode, source)
);
```

---

### 5.5 MediaWatch (port 3008)

#### Présentation

MediaWatch est le système de monitoring et de veille des contenus audiovisuels. Il permet aux agents CNRA de créer des sessions de surveillance, d'enregistrer des observations, de déclencher des alertes et de produire des rapports de veille.

**Note importante :** Le port a été changé de 3005 à 3008 pour éviter un conflit avec un autre service.

#### Structure des fichiers

```
mediawatch/
├── app/
│   ├── (app)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── sessions/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── observations/page.tsx
│   │   ├── alertes/
│   │   │   └── page.tsx
│   │   ├── temps-parole/
│   │   │   └── page.tsx
│   │   └── rapports/
│   │       ├── page.tsx
│   │       └── [id]/page.tsx
│   └── layout.tsx
└── types/index.ts
```

#### Tables Supabase (MediaWatch)

```sql
CREATE TABLE monitoring_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID REFERENCES medias(id),
  agent_id UUID REFERENCES auth.users(id),
  date_debut TIMESTAMPTZ NOT NULL,
  date_fin TIMESTAMPTZ,
  statut TEXT DEFAULT 'en_cours',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE observations_contenu (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES monitoring_sessions(id) ON DELETE CASCADE,
  horodatage TIMESTAMPTZ NOT NULL,
  type_contenu TEXT,
  description TEXT NOT NULL,
  categorie TEXT,  -- publicite, info, divertissement, politique...
  duree_secondes INTEGER,
  conforme BOOLEAN,
  note_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE alertes_monitoring (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES monitoring_sessions(id),
  media_id UUID REFERENCES medias(id),
  type_alerte TEXT NOT NULL,
  niveau TEXT CHECK (niveau IN ('info','avertissement','critique')),
  description TEXT NOT NULL,
  traitee BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE temps_parole (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES monitoring_sessions(id),
  acteur TEXT NOT NULL,
  type_acteur TEXT,  -- politicien, institution, citoyen...
  duree_secondes INTEGER NOT NULL,
  date_heure TIMESTAMPTZ NOT NULL,
  media_id UUID REFERENCES medias(id)
);

CREATE TABLE rapports_veille (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  periode_debut DATE NOT NULL,
  periode_fin DATE NOT NULL,
  media_ids UUID[],
  agent_id UUID REFERENCES auth.users(id),
  contenu JSONB,
  statut TEXT DEFAULT 'brouillon',
  date_publication TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 5.6 Citoyen (port 3006)

#### Présentation

Le Portail Citoyen est l'interface publique permettant aux citoyens sénégalais de signaler des contenus problématiques, de soutenir des pétitions relatives à la régulation audiovisuelle et de consulter les décisions publiques du CNRA.

#### Structure des fichiers

```
citoyen/
├── app/
│   ├── (app)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── signalements/
│   │   │   ├── page.tsx
│   │   │   ├── nouveau/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── petitions/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── decisions/
│   │       ├── page.tsx
│   │       └── [id]/page.tsx
│   └── layout.tsx
└── lib/utils.ts
```

#### Fonctions utilitaires

```typescript
// lib/utils.ts

/**
 * Formate une durée pour l'affichage citoyen
 * @example formatDuree(90) → "1h 30min"
 * @example formatDuree(45) → "45min"
 */
export function formatDuree(minutes: number): string {
  if (minutes < 60) return `${minutes}min`
  const heures = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${heures}h ${mins}min` : `${heures}h`
}

/**
 * Formate une date en français
 * @example formatDate('2026-06-16') → "16 juin 2026"
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
```

#### Tables Supabase (Citoyen)

```sql
CREATE TABLE signalements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT UNIQUE DEFAULT 'SIG-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('signalement_seq')::TEXT, 5, '0'),
  nom_signalant TEXT,
  email_signalant TEXT,
  telephone_signalant TEXT,
  anonyme BOOLEAN DEFAULT FALSE,
  media_id UUID REFERENCES medias(id),
  nom_media_libre TEXT,  -- si le média n'est pas dans la base
  date_contenu TIMESTAMPTZ,
  description TEXT NOT NULL,
  type_infraction TEXT,
  preuves JSONB DEFAULT '[]',  -- URLs pièces jointes Storage
  statut TEXT DEFAULT 'recu',
  date_traitement TIMESTAMPTZ,
  reponse_cnra TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE petitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  description TEXT NOT NULL,
  auteur_id UUID REFERENCES auth.users(id),
  objectif_signatures INTEGER DEFAULT 1000,
  nb_signatures INTEGER DEFAULT 0,
  statut TEXT DEFAULT 'active',
  date_cloture DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE signatures_petition (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  petition_id UUID REFERENCES petitions(id) ON DELETE CASCADE,
  nom TEXT,
  email TEXT,
  anonyme BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(petition_id, email)
);

CREATE TABLE decisions_cnra (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT UNIQUE NOT NULL,
  titre TEXT NOT NULL,
  description TEXT,
  type_decision TEXT,
  media_id UUID REFERENCES medias(id),
  date_decision DATE NOT NULL,
  date_publication DATE,
  document_url TEXT,
  publique BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 6. Base de données Supabase

### 6.1 Architecture multi-modules

Tous les modules partagent un seul projet Supabase. L'isolation est gérée par :
- **Row Level Security (RLS)** : filtrage par rôle utilisateur
- **Schemas séparés** (optionnel) : `antideep`, `edumedia`, `electrowatch`, etc.
- **Service Role** : les opérations admin utilisent la clé `service_role`

### 6.2 Schéma global des relations

```
auth.users (Supabase Auth)
     │
     ├─── profils_agents (rôle CNRA, module assigné)
     │
     ├─── certifications (EduMedia)
     ├─── monitoring_sessions (MediaWatch)
     └─── rapports_veille (MediaWatch)

medias ──────────────────────────────────────────────────────
     │
     ├─── journalistes (MediaBase)
     ├─── stats_audience (MediaBase)
     ├─── medias_surveillance (ElectroWatch)
     ├─── monitoring_sessions (MediaWatch)
     ├─── alertes_monitoring (MediaWatch)
     ├─── signalements (Citoyen)
     └─── decisions_cnra (Citoyen)

groupes_media ──→ medias

campagnes_electorales ──→ interventions ──→ partis_politiques
                      └──→ alertes_desequilibre
```

### 6.3 Row Level Security (RLS) — Recommandations

#### Stratégie d'accès par rôle

```sql
-- Table des profils agents CNRA
CREATE TABLE profils_agents (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('admin','analyste','agent_veille','formateur','public')),
  modules TEXT[],  -- modules auxquels l'agent a accès
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helper function : rôle de l'utilisateur courant
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM profils_agents WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- Helper function : modules accessibles
CREATE OR REPLACE FUNCTION get_user_modules()
RETURNS TEXT[] AS $$
  SELECT modules FROM profils_agents WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;
```

#### Politiques RLS par module

```sql
-- ===== ANTIDEEP =====
ALTER TABLE contenus_analyse ENABLE ROW LEVEL SECURITY;

-- Lecture : analystes et admins
CREATE POLICY "contenus_lecture" ON contenus_analyse
  FOR SELECT USING (
    get_user_role() IN ('admin', 'analyste')
    AND 'antideep' = ANY(get_user_modules())
  );

-- Écriture : analystes uniquement
CREATE POLICY "contenus_ecriture" ON contenus_analyse
  FOR INSERT WITH CHECK (get_user_role() IN ('admin', 'analyste'));

-- ===== ELECTROWATCH =====
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "interventions_lecture" ON interventions
  FOR SELECT USING (
    get_user_role() IN ('admin', 'analyste', 'agent_veille')
    AND 'electrowatch' = ANY(get_user_modules())
  );

-- ===== CITOYEN — accès public en lecture =====
ALTER TABLE decisions_cnra ENABLE ROW LEVEL SECURITY;

CREATE POLICY "decisions_publiques" ON decisions_cnra
  FOR SELECT USING (publique = TRUE);

ALTER TABLE petitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "petitions_lecture_publique" ON petitions
  FOR SELECT USING (statut = 'active');

-- Signalements : anonymes autorisés (sans JWT)
ALTER TABLE signalements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "signalements_insertion_publique" ON signalements
  FOR INSERT WITH CHECK (TRUE);  -- tout le monde peut signaler

CREATE POLICY "signalements_lecture_agent" ON signalements
  FOR SELECT USING (get_user_role() IN ('admin', 'analyste', 'agent_veille'));
```

### 6.4 Indexes de performance

```sql
-- ElectroWatch — requêtes temps de parole
CREATE INDEX idx_interventions_campagne ON interventions(campagne_id);
CREATE INDEX idx_interventions_parti ON interventions(parti_id);
CREATE INDEX idx_interventions_media ON interventions(media_id);
CREATE INDEX idx_interventions_date ON interventions(date_heure DESC);

-- MediaWatch — sessions et alertes
CREATE INDEX idx_sessions_media ON monitoring_sessions(media_id);
CREATE INDEX idx_sessions_statut ON monitoring_sessions(statut);
CREATE INDEX idx_alertes_traite ON alertes_monitoring(traitee, created_at DESC);
CREATE INDEX idx_observations_session ON observations_contenu(session_id);

-- MediaBase — recherche médias
CREATE INDEX idx_medias_type ON medias(type);
CREATE INDEX idx_medias_statut ON medias(statut);
CREATE INDEX idx_medias_nom ON medias USING GIN (nom gin_trgm_ops);  -- recherche fuzzy

-- AntiDeep — file de traitement
CREATE INDEX idx_contenus_statut ON contenus_analyse(statut, date_soumission);
CREATE INDEX idx_contenus_risque ON contenus_analyse(niveau_risque);
```

### 6.5 Fonctions PostgreSQL utiles

```sql
-- Statistiques temps de parole par campagne et média
CREATE OR REPLACE FUNCTION get_stats_campagne(p_campagne_id UUID)
RETURNS TABLE (
  parti_id UUID,
  parti_nom TEXT,
  total_secondes BIGINT,
  nb_interventions BIGINT,
  pourcentage NUMERIC
) AS $$
SELECT
  i.parti_id,
  pp.nom as parti_nom,
  SUM(i.duree_secondes) as total_secondes,
  COUNT(*) as nb_interventions,
  ROUND(
    SUM(i.duree_secondes)::NUMERIC /
    NULLIF(SUM(SUM(i.duree_secondes)) OVER (), 0) * 100,
    2
  ) as pourcentage
FROM interventions i
JOIN partis_politiques pp ON pp.id = i.parti_id
WHERE i.campagne_id = p_campagne_id
GROUP BY i.parti_id, pp.nom
ORDER BY total_secondes DESC;
$$ LANGUAGE SQL;

-- Mise à jour automatique du compteur de signatures
CREATE OR REPLACE FUNCTION update_petition_signatures()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE petitions
  SET nb_signatures = (
    SELECT COUNT(*) FROM signatures_petition WHERE petition_id = NEW.petition_id
  )
  WHERE id = NEW.petition_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_signatures
  AFTER INSERT OR DELETE ON signatures_petition
  FOR EACH ROW EXECUTE FUNCTION update_petition_signatures();
```

---

## 7. Composants partagés

### 7.1 Sidebar

La Sidebar est le composant de navigation principal. Elle adopte un comportement différent selon la taille d'écran.

#### API du composant

```typescript
interface SidebarProps {
  /** Ouvert sur mobile (contrôlé depuis le layout parent) */
  mobileOpen?: boolean
  /** Callback pour fermer sur mobile */
  onMobileClose?: () => void
  /** Items de navigation */
  items?: NavItem[]
}

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: number  // pour les alertes non lues
  children?: NavItem[]
}
```

#### Implémentation type

```typescript
// components/Sidebar.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  // Fermeture mobile sur changement de route
  useEffect(() => {
    onMobileClose?.()
  }, [pathname])

  return (
    <>
      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          // Mobile : drawer fixe
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-[#1A3A6B] transition-transform duration-300',
          'lg:static lg:z-auto lg:translate-x-0',
          // Mobile open/close
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop collapse
          collapsed ? 'lg:w-16' : 'lg:w-64',
          'w-64'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {!collapsed && (
            <span className="text-white font-bold text-lg">CNRA Suite</span>
          )}
          {/* Bouton fermeture mobile */}
          <button
            onClick={onMobileClose}
            className="lg:hidden text-white/70 hover:text-white"
          >
            <X size={20} />
          </button>
          {/* Bouton collapse desktop */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block text-white/70 hover:text-white ml-auto"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                )}
              >
                <item.icon size={20} className="shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
```

#### Layout parent (pattern mobile)

```typescript
// app/(app)/layout.tsx
'use client'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header mobile */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-gray-600"
          >
            <Menu size={24} />
          </button>
          <span className="font-semibold text-gray-900">CNRA Suite</span>
        </header>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
```

### 7.2 Toast — Système de notifications

```typescript
// components/Toast.tsx
'use client'

import { useState, useCallback } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

// Hook d'utilisation
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: ToastType, message: string, duration = 4000) => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev, { id, type, message, duration }])
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return {
    toasts,
    success: (msg: string, duration?: number) => addToast('success', msg, duration),
    error: (msg: string, duration?: number) => addToast('error', msg, duration),
    warning: (msg: string, duration?: number) => addToast('warning', msg, duration),
    info: (msg: string, duration?: number) => addToast('info', msg, duration),
    dismiss: removeToast,
  }
}

// Composant d'affichage
const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const STYLES = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

export function ToastContainer({ toasts, onDismiss }: {
  toasts: Toast[]
  onDismiss: (id: string) => void
}) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type]
        return (
          <div
            key={toast.id}
            className={cn(
              'flex items-start gap-3 p-4 rounded-lg border shadow-lg',
              STYLES[toast.type]
            )}
          >
            <Icon size={18} className="shrink-0 mt-0.5" />
            <p className="flex-1 text-sm">{toast.message}</p>
            <button onClick={() => onDismiss(toast.id)} className="shrink-0">
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
```

### 7.3 PageSkeleton — Loading states

```typescript
// components/PageSkeleton.tsx

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse bg-gray-200 rounded', className)} />
  )
}

export function PageSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <SkeletonLine className="h-8 w-64" />
        <SkeletonLine className="h-4 w-96" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border space-y-3">
            <SkeletonLine className="h-4 w-24" />
            <SkeletonLine className="h-8 w-16" />
            <SkeletonLine className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="p-4 border-b">
          <SkeletonLine className="h-5 w-32" />
        </div>
        <div className="divide-y">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <SkeletonLine className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <SkeletonLine className="h-4 w-48" />
                <SkeletonLine className="h-3 w-32" />
              </div>
              <SkeletonLine className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

### 7.4 EmptyState

```typescript
// components/EmptyState.tsx
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Icon size={32} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 max-w-sm mb-6">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
```

### 7.5 Utilitaire cn()

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Fusionne des classes CSS Tailwind en gérant les conflits
 * @example cn('px-2 py-1', condition && 'bg-red-500', 'px-4') → 'py-1 bg-red-500 px-4'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formate un nombre avec séparateurs de milliers (fr-FR)
 * @example formatNumber(1234567) → "1 234 567"
 */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n)
}

/**
 * Tronque un texte à une longueur maximale
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}

/**
 * Génère un slug URL-safe depuis un texte
 */
export function slugify(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
```

---

## 8. Système de tests

### 8.1 Architecture des tests

La CNRA Suite dispose de 64 tests au total, répartis en deux niveaux :

| Niveau | Outil | Fichier config | Tests | Couverture |
|--------|-------|----------------|-------|------------|
| Workspace racine | Vitest | `vitest.config.ts` | 43 tests | 5 modules |
| ElectroWatch (isolé) | Vitest | `electrowatch/vitest.config.ts` | 21 tests | Fonctions utils + hooks |
| **Total** | | | **64 tests** | **100% passing** |

### 8.2 Configuration Vitest

```typescript
// vitest.config.ts (racine workspace)
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    include: [
      '*/tests/**/*.{test,spec}.{ts,tsx}',
      '*/src/**/*.{test,spec}.{ts,tsx}',
    ],
    exclude: [
      'electrowatch/**',  // testé séparément
      'node_modules/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['*/lib/**', '*/components/**', '*/hooks/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

```typescript
// tests/setup.ts
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Supabase pour éviter les appels réseau en tests
vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      update: vi.fn().mockResolvedValue({ data: null, error: null }),
      delete: vi.fn().mockResolvedValue({ data: null, error: null }),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      order: vi.fn().mockReturnThis(),
    })),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
    })),
    removeChannel: vi.fn(),
  })),
  createServerClient: vi.fn(),
}))
```

### 8.3 Exemples de tests — ElectroWatch

```typescript
// electrowatch/src/tests/utils.test.ts
import { describe, it, expect } from 'vitest'
import {
  formatDuree,
  formatPourcentage,
  secondesEnHHMMSS,
  calculerDureeEntre,
  getStatutCampagneBadge,
  getNiveauAlerteColor,
} from '../lib/utils'

describe('formatDuree', () => {
  it('formate les secondes sans heures', () => {
    expect(formatDuree(45)).toBe('45s')
    expect(formatDuree(59)).toBe('59s')
  })

  it('formate les minutes sans heures', () => {
    expect(formatDuree(60)).toBe('1h 00min')
    expect(formatDuree(90)).toBe('1h 30min')
    expect(formatDuree(150)).toBe('2h 30min')
  })

  it('formate heures et minutes avec padding', () => {
    expect(formatDuree(3723)).toBe('1h 02min')
    expect(formatDuree(7260)).toBe('2h 01min')
  })
})

describe('formatPourcentage', () => {
  it('utilise 1 décimale par défaut', () => {
    expect(formatPourcentage(33.333)).toBe('33.3%')
  })

  it('respecte le nombre de décimales demandé', () => {
    expect(formatPourcentage(33.333, 2)).toBe('33.33%')
    expect(formatPourcentage(100, 0)).toBe('100%')
  })
})

describe('secondesEnHHMMSS', () => {
  it('convertit correctement', () => {
    expect(secondesEnHHMMSS(0)).toBe('00:00:00')
    expect(secondesEnHHMMSS(61)).toBe('00:01:01')
    expect(secondesEnHHMMSS(3723)).toBe('01:02:03')
  })
})

describe('getStatutCampagneBadge', () => {
  it('retourne le badge correct pour chaque statut', () => {
    expect(getStatutCampagneBadge('en_cours').label).toBe('En cours')
    expect(getStatutCampagneBadge('terminee').className).toContain('blue')
    expect(getStatutCampagneBadge('planifiee').className).toContain('gray')
  })

  it('gère les statuts inconnus sans erreur', () => {
    const badge = getStatutCampagneBadge('inconnu')
    expect(badge.label).toBe('inconnu')
  })
})
```

### 8.4 Exemples de tests — Composants UI

```typescript
// tests/components/EmptyState.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Database } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'

describe('EmptyState', () => {
  it('affiche le titre et la description', () => {
    render(
      <EmptyState
        icon={Database}
        title="Aucune donnée"
        description="Il n'y a pas encore de données à afficher."
      />
    )
    expect(screen.getByText('Aucune donnée')).toBeInTheDocument()
    expect(screen.getByText(/pas encore de données/)).toBeInTheDocument()
  })

  it('appelle le callback action au clic', () => {
    const handleClick = vi.fn()
    render(
      <EmptyState
        icon={Database}
        title="Vide"
        action={{ label: 'Ajouter', onClick: handleClick }}
      />
    )
    fireEvent.click(screen.getByText('Ajouter'))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('ne rend pas le bouton sans prop action', () => {
    render(<EmptyState icon={Database} title="Vide" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
```

### 8.5 Lancer les tests

```bash
# Tous les tests du workspace (43 tests)
cd C:\gravity\cnra-suite
npm test

# Tests avec rapport de couverture
npm run test:coverage

# Tests en mode watch (développement)
npm run test:watch

# Interface visuelle Vitest
npm run test:ui

# Tests ElectroWatch uniquement (21 tests)
cd C:\gravity\cnra-suite\electrowatch
npm test

# Un fichier de test spécifique
npx vitest run tests/components/EmptyState.test.tsx

# Tests filtrés par nom
npx vitest run --grep "formatDuree"
```

---

## 9. Patterns de développement

### 9.1 Conventions de nommage

| Élément | Convention | Exemple |
|---------|-----------|---------|
| Composants | PascalCase | `MediaCard.tsx` |
| Hooks | camelCase, préfixe `use` | `useMediaList.ts` |
| Utilitaires | camelCase | `formatDuree`, `slugify` |
| Types/Interfaces | PascalCase | `Media`, `AlerteItem` |
| Constantes | SCREAMING_SNAKE_CASE | `MAX_ITEMS_PER_PAGE` |
| Routes Next.js | kebab-case | `/temps-parole`, `/groupes-media` |
| Tables Supabase | snake_case pluriel | `contenus_analyse`, `stats_audience` |
| Colonnes SQL | snake_case | `date_soumission`, `nb_interventions` |

### 9.2 Pattern de chargement de données

```typescript
// Pattern recommandé : Server Component + Suspense

// app/(app)/medias/page.tsx
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { MediaList } from '@/components/MediaList'
import { PageSkeleton } from '@/components/PageSkeleton'

async function MediaListData() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('medias')
    .select('*, groupes_media(nom)')
    .eq('statut', 'actif')
    .order('nom')
  
  if (error) throw new Error(error.message)
  return <MediaList medias={data ?? []} />
}

export default function MediasPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Médias sénégalais</h1>
      <Suspense fallback={<PageSkeleton />}>
        <MediaListData />
      </Suspense>
    </div>
  )
}
```

### 9.3 Gestion des erreurs

```typescript
// Pattern error boundary + error.tsx

// app/(app)/error.tsx
'use client'
import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[CNRA Suite Error]', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center h-full py-20 px-4 text-center">
      <AlertTriangle size={48} className="text-red-500 mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Une erreur est survenue
      </h2>
      <p className="text-gray-500 mb-6 max-w-md">
        {error.message || "Une erreur inattendue s'est produite. Veuillez réessayer."}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Réessayer
      </button>
    </div>
  )
}

// Gestion erreurs Supabase dans les Server Actions
// app/actions/mediaActions.ts
'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createMedia(formData: FormData) {
  const supabase = createClient()
  
  // Validation
  const nom = formData.get('nom') as string
  if (!nom?.trim()) {
    return { error: 'Le nom est obligatoire' }
  }

  const { data, error } = await supabase
    .from('medias')
    .insert({ nom, type: formData.get('type') })
    .select()
    .single()

  if (error) {
    console.error('[createMedia]', error)
    return { error: 'Erreur lors de la création du média' }
  }

  revalidatePath('/medias')
  return { data }
}
```

### 9.4 Responsive design

```typescript
// Pattern Tailwind responsive (mobile-first)

// Grille adaptive
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

// Typography adaptive
<h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">

// Padding adaptatif
<div className="p-4 sm:p-6 lg:p-8">

// Masquage conditionnel
<span className="hidden sm:inline">Libellé complet</span>
<span className="sm:hidden">Court</span>

// Tableau responsive (stack sur mobile)
<div className="overflow-x-auto -mx-4 sm:mx-0">
  <table className="min-w-full divide-y divide-gray-200">
    ...
  </table>
</div>
```

### 9.5 Optimisation des performances

```typescript
// 1. Images optimisées avec next/image
import Image from 'next/image'

<Image
  src={media.logo_url}
  alt={`Logo ${media.nom}`}
  width={48}
  height={48}
  className="rounded-full object-cover"
  loading="lazy"
/>

// 2. Lazy loading des composants lourds
import dynamic from 'next/dynamic'

const TempsDeparoleChart = dynamic(
  () => import('@/components/charts/TempsDeparoleChart'),
  {
    loading: () => <div className="h-64 animate-pulse bg-gray-100 rounded-xl" />,
    ssr: false,  // Recharts nécessite le DOM
  }
)

// 3. Mémoisation des composants coûteux
import { memo, useMemo } from 'react'

const StatCard = memo(function StatCard({ value, label, trend }: StatCardProps) {
  const formattedValue = useMemo(() => formatNumber(value), [value])
  return (...)
})

// 4. Debounce pour la recherche
import { useDebouncedCallback } from 'use-debounce'

const handleSearch = useDebouncedCallback((term: string) => {
  setSearchQuery(term)
}, 300)
```

### 9.6 Internationalisation (i18n)

La CNRA Suite est actuellement en français uniquement. Pour une future internationalisation :

```typescript
// Toutes les chaînes sont en fr-FR
// Les dates utilisent Intl.DateTimeFormat avec locale 'fr-FR'
// Les nombres utilisent Intl.NumberFormat avec locale 'fr-FR'

// Convention pour les clés de traduction (si i18n ajouté)
// common.save, common.cancel, common.loading
// media.type.television, media.type.radio
// alert.level.critique, alert.level.avertissement
```

---

## 10. Déploiement

### 10.1 Option A — Vercel (recommandé)

Vercel est l'hébergeur optimal pour les applications Next.js. Chaque module est un projet Vercel indépendant.

#### Étapes de déploiement

```bash
# 1. Installer Vercel CLI
npm install -g vercel

# 2. Déployer un module (exemple : mediabase)
cd C:\gravity\cnra-suite\mediabase
vercel

# 3. Configurer les variables d'environnement
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production

# 4. Déployer en production
vercel --prod
```

#### Configuration Vercel (`vercel.json`)

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "regions": ["cdg1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co"
        }
      ]
    }
  ]
}
```

#### URLs de production (exemple)

| Module | URL Vercel |
|--------|-----------|
| AntiDeep | `https://antideep.cnra.sn` |
| EduMedia | `https://edumedia.cnra.sn` |
| ElectroWatch | `https://electrowatch.cnra.sn` |
| MediaBase | `https://mediabase.cnra.sn` |
| MediaWatch | `https://mediawatch.cnra.sn` |
| Citoyen | `https://citoyen.cnra.sn` |

### 10.2 Option B — VPS Ubuntu avec PM2 + Nginx

Pour la souveraineté des données ou des contraintes de budget, le déploiement sur VPS est possible.

#### Configuration PM2

```javascript
// ecosystem.config.js (racine du serveur)
module.exports = {
  apps: [
    {
      name: 'antideep',
      cwd: '/srv/cnra-suite/antideep',
      script: 'node_modules/.bin/next',
      args: 'start --port 3001',
      env: { NODE_ENV: 'production', PORT: 3001 },
      instances: 1,
      autorestart: true,
      max_memory_restart: '512M',
    },
    {
      name: 'edumedia',
      cwd: '/srv/cnra-suite/edumedia',
      script: 'node_modules/.bin/next',
      args: 'start --port 3002',
      env: { NODE_ENV: 'production', PORT: 3002 },
      instances: 1,
      autorestart: true,
    },
    {
      name: 'electrowatch',
      cwd: '/srv/cnra-suite/electrowatch',
      script: 'node_modules/.bin/next',
      args: 'start --port 3003',
      env: { NODE_ENV: 'production', PORT: 3003 },
      instances: 2,  // Plus de charge (temps réel)
      exec_mode: 'cluster',
      autorestart: true,
    },
    {
      name: 'mediabase',
      cwd: '/srv/cnra-suite/mediabase',
      script: 'node_modules/.bin/next',
      args: 'start --port 3004',
      env: { NODE_ENV: 'production', PORT: 3004 },
      instances: 1,
      autorestart: true,
    },
    {
      name: 'mediawatch',
      cwd: '/srv/cnra-suite/mediawatch',
      script: 'node_modules/.bin/next',
      args: 'start --port 3008',
      env: { NODE_ENV: 'production', PORT: 3008 },
      instances: 2,
      exec_mode: 'cluster',
      autorestart: true,
    },
    {
      name: 'citoyen',
      cwd: '/srv/cnra-suite/citoyen',
      script: 'node_modules/.bin/next',
      args: 'start --port 3006',
      env: { NODE_ENV: 'production', PORT: 3006 },
      instances: 1,
      autorestart: true,
    },
  ],
}
```

#### Configuration Nginx

```nginx
# /etc/nginx/sites-available/cnra-suite

# AntiDeep
server {
    listen 80;
    server_name antideep.cnra.sn;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# ElectroWatch (WebSocket pour Realtime Supabase)
server {
    listen 80;
    server_name electrowatch.cnra.sn;
    
    location / {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";  # Important pour WebSocket
        proxy_set_header Host $host;
        proxy_read_timeout 86400;  # Timeout long pour Realtime
    }
}

# Répéter pour chaque module (edumedia:3002, mediabase:3004, mediawatch:3008, citoyen:3006)
```

```bash
# Activer SSL avec Let's Encrypt
sudo certbot --nginx -d antideep.cnra.sn -d edumedia.cnra.sn \
  -d electrowatch.cnra.sn -d mediabase.cnra.sn \
  -d mediawatch.cnra.sn -d citoyen.cnra.sn
```

### 10.3 Pipeline CI/CD (GitHub Actions)

```yaml
# .github/workflows/deploy-mediabase.yml
name: Deploy MediaBase

on:
  push:
    branches: [main]
    paths: ['mediabase/**']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: mediabase/package-lock.json
      
      - run: cd mediabase && npm ci
      - run: cd mediabase && npm run lint
      - run: cd mediabase && npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_MEDIABASE_PROJECT_ID }}
          working-directory: mediabase
          vercel-args: '--prod'
```

### 10.4 Checklist de déploiement

```
Avant déploiement :
[ ] Tests 100% passing (npm test dans workspace)
[ ] Build réussit (npm run build dans chaque module)
[ ] Variables d'environnement configurées sur la cible
[ ] Migrations Supabase appliquées
[ ] RLS activé sur toutes les tables sensibles
[ ] Indexes de performance créés

Après déploiement :
[ ] Pages principales accessibles (dashboard, liste principale)
[ ] Authentification fonctionnelle
[ ] Connexion Supabase Realtime active (ElectroWatch, MediaWatch)
[ ] Formulaires de saisie opérationnels
[ ] Charts Recharts s'affichent correctement
[ ] Responsive mobile vérifié sur Safari iOS et Chrome Android
```

---

## 11. Troubleshooting

### 11.1 Problèmes courants — Turbopack

**Problème : Module non trouvé avec Turbopack**

```
Error: Cannot find module '@/components/...'
```

Solution :
```typescript
// Vérifier tsconfig.json — les paths doivent être définis
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]        // Pour les modules sans src/
      "@/*": ["./src/*"]    // Pour ElectroWatch avec src/
    }
  }
}
```

**Problème : Turbopack ne recharge pas après modification CSS**

Solution : Ajouter dans `next.config.ts` :
```typescript
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.css': ['@tailwindcss/postcss'],
      },
    },
  },
}
```

**Problème : Conflit de version Tailwind CSS v4**

Tailwind v4 change le système de plugins PostCSS. Si vous voyez des erreurs de build :
```bash
# S'assurer que le bon plugin est installé
npm install @tailwindcss/postcss@latest --save-dev

# Vérifier postcss.config.js (PAS postcss.config.mjs)
# module.exports = { plugins: { '@tailwindcss/postcss': {} } }
```

### 11.2 Problèmes — Windows Junctions NTFS

**Contexte :** Le répertoire `cnra-suite/node_modules` est une junction NTFS pointant vers `cnra/mediawatch/node_modules`. Cette architecture permet de partager les dépendances entre modules.

**Problème : Junction cassée après déplacement de dossier**

Symptôme :
```
Error: Cannot find module 'next'
ENOENT: no such file or directory, scandir 'C:\gravity\cnra-suite\node_modules'
```

Solution :
```powershell
# Vérifier l'état de la junction
(Get-Item "C:\gravity\cnra-suite\node_modules").LinkType
# Doit retourner "Junction"

# Si cassée, la recréer (en admin)
Remove-Item "C:\gravity\cnra-suite\node_modules" -Force
cmd /c mklink /J "C:\gravity\cnra-suite\node_modules" "C:\gravity\cnra\mediawatch\node_modules"
```

**AVERTISSEMENT CRITIQUE :** Ne jamais supprimer le dossier cible (`cnra\mediawatch\node_modules`) — cela casserait la junction et tous les modules qui en dépendent.

**Problème : Antivirus bloque les junctions**

Certains antivirus Windows bloquent la création de liens symboliques. Solutions :
1. Ajouter une exception pour `C:\gravity\` dans l'antivirus
2. Désactiver temporairement la protection en temps réel lors de la création de junctions
3. Utiliser PowerShell en tant qu'administrateur

### 11.3 Problèmes — Ports

**Problème : Port déjà utilisé**

```bash
# Trouver le processus qui utilise le port 3001
netstat -ano | findstr :3001
# Ou
Get-NetTCPConnection -LocalPort 3001 | Select-Object -Property LocalPort, State, OwningProcess

# Arrêter le processus
Stop-Process -Id <PID> -Force
```

**Problème : MediaWatch sur port 3008 (pas 3005)**

Le port a été changé de 3005 à 3008. S'assurer que :
```json
// mediawatch/package.json
{
  "scripts": {
    "dev": "next dev --turbopack --port 3008",
    "start": "next start --port 3008"
  }
}
```

### 11.4 Problèmes — Supabase

**Problème : Erreur RLS — "new row violates row-level security policy"**

```sql
-- Vérifier les politiques actives
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'votre_table';

-- Désactiver temporairement RLS pour debug (JAMAIS en production)
ALTER TABLE votre_table DISABLE ROW LEVEL SECURITY;
```

**Problème : Realtime ne fonctionne pas**

```typescript
// Vérifier que la table est en REPLICA IDENTITY FULL
-- Dans Supabase SQL Editor :
ALTER TABLE alertes_desequilibre REPLICA IDENTITY FULL;

// Activer la publication Realtime pour la table
-- Dans Supabase Dashboard > Database > Replication
-- Activer la table dans "supabase_realtime" publication
```

**Problème : Clé ANON expire ou permissions insuffisantes**

```typescript
// Utiliser la service_role pour les opérations admin (côté serveur uniquement)
// lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,  // Jamais exposer côté client
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)
```

### 11.5 Problèmes — Build production

**Problème : TypeError: Cannot read properties of undefined (reading 'xxx') pendant le build**

Cause fréquente : composants Client accédant à des APIs navigateur (window, document) lors du SSR.

```typescript
// Solution : vérifier l'environnement
'use client'

useEffect(() => {
  // Code navigateur UNIQUEMENT dans useEffect
  if (typeof window !== 'undefined') {
    // Accès à window/localStorage/etc.
  }
}, [])
```

**Problème : Build échoue sur "Module not found" en CI**

```bash
# S'assurer que les node_modules sont installés avant build
npm ci  # Plus strict que npm install, préféré en CI
npm run build
```

### 11.6 Matrice de compatibilité

| Navigateur | Version min | Notes |
|-----------|------------|-------|
| Chrome | 109+ | Support complet |
| Firefox | 110+ | Support complet |
| Safari | 16.4+ | Vérifier WebSocket Realtime |
| Edge | 109+ | Support complet |
| Chrome Android | 109+ | Mobile tested |
| Safari iOS | 16.4+ | Tester le drawer sidebar |

---

## 12. Roadmap technique

### 12.1 Court terme (0–3 mois)

| Priorité | Fonctionnalité | Module | Effort |
|---------|---------------|--------|--------|
| Haute | Authentification SSO (CNRA) | Tous | M |
| Haute | Export PDF des rapports | MediaWatch, ElectroWatch | S |
| Haute | Notifications push (PWA) | ElectroWatch, MediaWatch | M |
| Moyenne | Mode hors-ligne (PWA) | Citoyen | L |
| Moyenne | API REST publique | MediaBase | M |
| Basse | Dark mode | Tous | S |

### 12.2 Moyen terme (3–6 mois)

| Fonctionnalité | Description | Module |
|---------------|-------------|--------|
| Intégration IA externe | API de détection deepfakes (ex: DeepMedia, Sensity) | AntiDeep |
| Cartographie médias | Carte Leaflet des médias sénégalais | MediaBase |
| Tableau de bord consolidé | Vue cross-modules pour la direction CNRA | Nouveau module |
| Application mobile | React Native ou PWA optimisée | Citoyen |
| Intégration BCEAO | Données financières des groupes médias | MediaBase |

### 12.3 Long terme (6–12 mois)

| Fonctionnalité | Description |
|---------------|-------------|
| Plateforme ECOWAS | Extension aux autres régulateurs d'Afrique de l'Ouest |
| IA de veille automatique | Scan automatique des flux TV/radio avec transcription |
| Blockchain pour les certifications EduMedia | Certificats vérifiables et infalsifiables |
| Interopérabilité API | Connexion aux bases de données RIARC, UAR |
| Authentification décentralisée | Intégration avec le SNDI sénégalais |

### 12.4 Dettes techniques à traiter

| Dette | Description | Urgence |
|-------|-------------|---------|
| Tests E2E | Ajouter Playwright pour les flux utilisateur critiques | Moyenne |
| Internationalisation | Préparer l'i18n pour le wolof | Basse |
| Monitoring APM | Intégrer Sentry ou Datadog | Haute |
| Cache Redis | Mettre en cache les statistiques lourdes (ElectroWatch) | Moyenne |
| Storybook | Documenter les composants UI | Basse |
| Rate limiting | Protéger les routes POST publiques (Citoyen) | Haute |

---

## 13. Annexes

### Annexe A — Structure complète de tous les fichiers

```
C:\gravity\cnra-suite\
│
├── package.json                    # workspace racine
├── vitest.config.ts                # config tests workspace
│
├── antideep/
│   ├── app/
│   │   ├── (app)/layout.tsx
│   │   ├── (app)/dashboard/page.tsx
│   │   ├── (app)/contenus/page.tsx
│   │   ├── (app)/contenus/[id]/page.tsx
│   │   ├── (app)/campagnes/page.tsx
│   │   ├── (app)/campagnes/[id]/page.tsx
│   │   ├── (app)/sources/page.tsx
│   │   ├── (app)/signatures/page.tsx
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── Toast.tsx
│   │   ├── PageSkeleton.tsx
│   │   └── EmptyState.tsx
│   ├── lib/
│   │   ├── supabase/client.ts
│   │   ├── supabase/server.ts
│   │   └── utils.ts
│   ├── types/index.ts
│   ├── next.config.ts
│   ├── postcss.config.js
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   └── package.json
│
├── electrowatch/
│   ├── src/
│   │   ├── app/(dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── campagnes/page.tsx
│   │   │   ├── campagnes/[id]/page.tsx
│   │   │   ├── interventions/page.tsx
│   │   │   ├── partis/page.tsx
│   │   │   ├── medias/page.tsx
│   │   │   └── alertes/page.tsx
│   │   ├── components/
│   │   │   ├── layout/Sidebar.tsx
│   │   │   ├── layout/Header.tsx
│   │   │   ├── dashboard/StatCard.tsx
│   │   │   ├── dashboard/AlerteItem.tsx
│   │   │   ├── charts/TempsDeparoleChart.tsx
│   │   │   ├── charts/EquilibreChart.tsx
│   │   │   └── ui/toast.tsx
│   │   ├── hooks/useStats.ts
│   │   ├── types/index.ts
│   │   └── lib/utils.ts
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   └── package.json
│
├── [edumedia, mediabase, mediawatch, citoyen — structure similaire à antideep]
│
├── node_modules -> [junction vers mediawatch/node_modules]
│
└── docs/
    └── DOCUMENTATION_TECHNIQUE.md
```

### Annexe B — Références et ressources

| Ressource | URL |
|-----------|-----|
| Next.js 16 Docs | https://nextjs.org/docs |
| React 19 Blog | https://react.dev/blog/2024/12/05/react-19 |
| Tailwind CSS v4 | https://tailwindcss.com/docs |
| Supabase Docs | https://supabase.com/docs |
| Supabase SSR | https://supabase.com/docs/guides/auth/server-side/nextjs |
| Recharts | https://recharts.org/en-US/api |
| Vitest | https://vitest.dev/guide |
| Testing Library | https://testing-library.com/docs/react-testing-library/intro |
| Lucide Icons | https://lucide.dev/icons |
| clsx | https://github.com/lukeed/clsx |
| tailwind-merge | https://github.com/dcastil/tailwind-merge |

### Annexe C — Variables d'environnement — Tableau récapitulatif

| Variable | Modules | Côté | Requis | Description |
|----------|---------|------|--------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Tous | Client + Server | Oui | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Tous | Client + Server | Oui | Clé anonyme publique |
| `SUPABASE_SERVICE_ROLE_KEY` | Tous | Server uniquement | Admin | Clé service (admin) |
| `NEXT_PUBLIC_APP_URL` | Tous | Client | Recommandé | URL publique du module |
| `AI_API_KEY` | AntiDeep | Server | Optionnel | Clé API modèle IA deepfake |
| `AI_API_ENDPOINT` | AntiDeep | Server | Optionnel | Endpoint API IA |
| `NEXT_PUBLIC_CNRA_BLUE` | ElectroWatch | Client | Optionnel | Couleur primaire CNRA |
| `NEXT_PUBLIC_CNRA_GOLD` | ElectroWatch | Client | Optionnel | Couleur secondaire CNRA |

### Annexe D — Commandes de référence rapide

```bash
# === DÉVELOPPEMENT ===

# Démarrer un module
cd C:\gravity\cnra-suite\[module] && npm run dev

# Vérifier les types TypeScript
npx tsc --noEmit

# Linter
npm run lint

# === TESTS ===

# Tous les tests
cd C:\gravity\cnra-suite && npm test

# Tests avec UI
npm run test:ui

# Couverture
npm run test:coverage

# Tests ElectroWatch
cd C:\gravity\cnra-suite\electrowatch && npm test

# === BUILD ===

# Build d'un module
cd C:\gravity\cnra-suite\[module] && npm run build

# Tester le build en local
npm run start

# === SUPABASE ===

# Générer les types TypeScript depuis Supabase
npx supabase gen types typescript --project-id [PROJECT_ID] > types/database.ts

# === WINDOWS JUNCTIONS ===

# Créer la junction (admin requis)
cmd /c mklink /J "C:\gravity\cnra-suite\node_modules" "C:\gravity\cnra\mediawatch\node_modules"

# Vérifier les junctions
(Get-Item "C:\gravity\cnra-suite\node_modules").LinkType

# === GIT ===

# Status de tous les modules
for ($i=1; $i -le 6; $i++) { 
  Write-Host "--- Module ---"; git -C "C:\gravity\cnra-suite" status 
}
```

---

*Documentation générée pour la CNRA Suite — Conseil National de Régulation de l'Audiovisuel du Sénégal*  
*Version 1.0.0 — Juin 2026*  
*Contact technique : mamadouastelwane@gmail.com*
