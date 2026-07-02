# Indoor-Guide

Navigation interne et gestion des visiteurs dans le complexe hospitalier de l'Hôpital Ndamatou de Touba, Sénégal.

Application développée par **Processingenierie** dans le cadre de l'écosystème digital de l'Hôpital Ndamatou Touba 🇸🇳.

## Fonctionnalités

- 📍 **Carte 3D** — Plan interactif du complexe hospitalier
- 🚶 **Itinéraires** — Guidage pas-à-pas jusqu'à n'importe quelle zone
- 🎫 **Visiteurs** — Gestion des badges et horaires d'entrée/sortie
- 🅿️ **Parking** — Suivi en temps réel des places disponibles

## Stack technique

- [Vite](https://vite.dev/) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) (via `@tailwindcss/vite`)
- [react-router-dom](https://reactrouter.com/) v7
- [@supabase/supabase-js](https://supabase.com/) (avec repli automatique sur `localStorage` si non configuré)
- [lucide-react](https://lucide.dev/) pour les icônes
- [recharts](https://recharts.org/) pour les graphiques

## Démarrage

```bash
npm install
npm run dev
```

L'application sera accessible sur `http://localhost:5173`.

### Build de production

```bash
npm run build
npm run preview
```

## Variables d'environnement

Créez un fichier `.env.local` à la racine (déjà présent, à compléter si besoin) :

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Si ces variables sont vides, l'application fonctionne normalement en utilisant uniquement le `localStorage` du navigateur pour la persistance des données (mode démo / hors-ligne).

## Comptes de démonstration

| Rôle              | Email                  | Mot de passe   |
|-------------------|-------------------------|---------------|
| Agent de Guidage  | c.ba@ndamatou.sn        | guide2026      |
| Agent Accueil     | f.ndao@ndamatou.sn      | accueil2026    |
| Agent Sécurité    | m.sarr@ndamatou.sn      | secu2026       |
| Administrateur    | admin@ndamatou.sn       | ndamatou2026   |

## Base de données

Le schéma SQL (tables `visiteurs`, `zones`, `places_parking`) se trouve dans [`supabase/schema.sql`](./supabase/schema.sql). Pensez à configurer les politiques RLS avant toute mise en production.
