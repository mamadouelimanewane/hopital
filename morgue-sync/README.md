# Morgue-Sync 🕊️

Gestion Funéraire — Administration numérisée, respectueuse et transparente des décès à l'Hôpital Ndamatou de Touba, Sénégal.

Module faisant partie de l'écosystème digital hospitalier développé par **Processingenierie** pour l'Hôpital Ndamatou Touba.

## Fonctionnalités

- **Registre des défunts** — suivi des dossiers, service d'origine, statut des démarches
- **Casiers réfrigérés** — disponibilité, température, occupation en temps réel
- **Démarches administratives** — certificats de décès, autorisations de transfert et d'inhumation
- **Accompagnement des familles** — contacts, visites, notes de suivi
- **Tableau de bord** — indicateurs clés et activité de la semaine

## Stack technique

- [Vite](https://vite.dev/) + [React 19](https://react.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) (via `@tailwindcss/vite`)
- [react-router-dom v7](https://reactrouter.com/)
- [@supabase/supabase-js](https://supabase.com/docs/reference/javascript)
- [lucide-react](https://lucide.dev/) (icônes)
- [recharts](https://recharts.org/) (graphiques)
- clsx + tailwind-merge

## Démarrage

```bash
npm install
npm run dev
```

L'application est accessible sur `http://localhost:5173`.

### Build de production

```bash
npm run build
npm run preview
```

## Variables d'environnement

Créer un fichier `.env.local` à la racine (déjà présent, à compléter si besoin) :

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

L'application fonctionne intégralement sans ces variables : les données sont alors
conservées uniquement en `localStorage` (mode hors-ligne / démo). Si les variables
sont renseignées, l'application tente une synchronisation best-effort avec Supabase
au démarrage et à chaque modification, avec repli automatique sur le cache local en
cas d'erreur réseau.

## Base de données

Le schéma SQL des tables (`defunts`, `casiers`, `demarches`, `familles`) se trouve
dans [`supabase/schema.sql`](./supabase/schema.sql). Aucune politique RLS n'est
définie par défaut — à configurer avant toute mise en production.

## Comptes de démonstration

| Rôle | Email | Mot de passe |
|---|---|---|
| Agent Mortuaire | c.mbaye@ndamatou.sn | agent2026 |
| Responsable Administratif | a.ndoye@ndamatou.sn | resp2026 |
| Médecin Légiste | s.kane@ndamatou.sn | med2026 |
| Administrateur | admin@ndamatou.sn | ndamatou2026 |

---

Développé par Processingenierie · Hôpital Ndamatou Touba 🇸🇳
