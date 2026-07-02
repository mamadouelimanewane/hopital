# Supply-Chain — Logistique & Fournisseurs

Application de gestion de l'approvisionnement non-médical (restauration, blanchisserie,
fournisseurs) de l'Hôpital Ndamatou de Touba, Sénégal.

Développé par **Processingenierie** · Hôpital Ndamatou Touba 🇸🇳

## Fonctionnalités

- Tableau de bord avec KPIs (commandes en cours, ruptures de stock, taux de conformité des
  livraisons, dépense mensuelle) et graphiques de dépenses par catégorie
- Suivi des commandes fournisseurs avec filtres par statut
- Annuaire des fournisseurs (alimentation, blanchisserie, fournitures, équipement)
- Suivi de la blanchisserie (flux linge propre / sale)
- Suivi de l'approvisionnement des cuisines avec alertes de réassort
- Suivi des livraisons et de leur conformité
- Authentification simulée (comptes de démonstration)

## Stack technique

- [Vite](https://vite.dev) + [React 19](https://react.dev) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) (via `@tailwindcss/vite`)
- [react-router-dom](https://reactrouter.com) v7
- [@supabase/supabase-js](https://supabase.com) (synchronisation optionnelle, best-effort)
- [lucide-react](https://lucide.dev) (icônes)
- [recharts](https://recharts.org) (graphiques)
- clsx + tailwind-merge

## Démarrage

```bash
npm install
npm run dev
```

L'application est ensuite accessible sur `http://localhost:5173`.

### Build de production

```bash
npm run build
npm run preview
```

## Variables d'environnement

Créez un fichier `.env.local` (déjà présent, vide par défaut) avec :

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

L'application fonctionne entièrement **sans** ces variables : les données sont alors
stockées uniquement dans le `localStorage` du navigateur. Si les variables sont renseignées,
l'application tente une synchronisation best-effort avec Supabase (voir `supabase/schema.sql`
pour le schéma des tables) et retombe silencieusement sur le cache local en cas d'échec.

## Comptes de démonstration

| Rôle                  | Email                  | Mot de passe    |
|------------------------|-------------------------|-----------------|
| Agent Logistique       | m.ndoye@ndamatou.sn     | agent2026       |
| Chef Service Achats    | a.sarr@ndamatou.sn      | achats2026      |
| Économe Général        | c.mbacke@ndamatou.sn    | econome2026     |
| Administrateur         | admin@ndamatou.sn       | ndamatou2026    |

## Structure

```
src/
  components/     Layout (sidebar + topbar)
  contexts/       AuthContext, DataStore (localStorage + Supabase), NotificationContext
  lib/             utils (cn helper), supabase client
  pages/           Landing, Login, Dashboard, Commandes, Fournisseurs,
                   Blanchisserie, Restauration, Livraisons, Parametres
supabase/
  schema.sql       Schéma SQL (tables commandes, fournisseurs, livraisons, stocks_non_medicaux)
```
