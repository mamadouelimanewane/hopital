# Hemo-Care 🩸

Centre d'Hémodialyse — Gestion de la planification et du suivi des séances de dialyse à l'Hôpital Ndamatou de Touba, Sénégal.

Développé par **Processingenierie** · Hôpital Ndamatou Touba 🇸🇳

## Fonctionnalités

- **Tableau de bord** — KPIs (patients actifs, séances du jour, générateurs disponibles, taux d'occupation) et graphiques d'activité
- **Patients** — suivi des patients, poids sec, historique des séances
- **Planning** — planification et suivi des séances de dialyse
- **Générateurs** — état et maintenance des générateurs de dialyse
- **Suivi Poids** — évolution du poids avant/après séance par patient
- **Paramètres** — profil, notifications, gestion des données

## Stack technique

- [Vite](https://vite.dev/) + [React 19](https://react.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) (via `@tailwindcss/vite`)
- [react-router-dom v7](https://reactrouter.com/)
- [@supabase/supabase-js](https://supabase.com/docs/reference/javascript)
- [lucide-react](https://lucide.dev/) (icônes)
- [recharts](https://recharts.org/) (graphiques)
- clsx / tailwind-merge

## Démarrage

```bash
npm install
npm run dev
```

L'application est disponible sur `http://localhost:5173`.

### Build de production

```bash
npm run build
npm run preview
```

## Variables d'environnement

Créez un fichier `.env.local` à la racine (déjà présent, à compléter) :

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

L'application fonctionne entièrement en local (localStorage) si ces variables sont vides — la synchronisation Supabase est une amélioration best-effort et échoue silencieusement en leur absence.

## Comptes de démonstration

| Rôle | Email | Mot de passe |
|---|---|---|
| Néphrologue | ca.mbacke@ndamatou.sn | nephro2026 |
| Infirmier(ère) | a.ndoye@ndamatou.sn | inf2026 |
| Technicien | m.fall@ndamatou.sn | tech2026 |
| Admin | admin@ndamatou.sn | ndamatou2026 |

## Base de données

Le schéma SQL Supabase (`supabase/schema.sql`) définit 3 tables : `patients`, `seances`, `generateurs`. Row Level Security n'est pas configuré — voir le commentaire en tête du fichier avant toute mise en production.
