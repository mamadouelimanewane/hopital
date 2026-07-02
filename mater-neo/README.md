# Mater-Neo 👶

**Maternité & Néonatologie** — Suivi des grossesses, accouchements et soins intensifs néonatals à l'Hôpital Ndamatou de Touba, Sénégal.

Développé par **Processingenierie** · Hôpital Ndamatou Touba 🇸🇳

## Fonctionnalités

- 🤰 **Grossesses** — Dossiers de suivi, badges de risque, filtres et recherche
- 📈 **Partogramme** — Suivi électronique du travail (dilatation cervicale, BCF)
- 🛏️ **Néonatologie** — Gestion des 15 lits/couveuses avec monitoring en temps réel
- ❤️ **Accouchements** — Registre des naissances (voie basse / césarienne)
- 📊 **Tableau de bord** — KPIs, graphiques d'activité hebdomadaire

## Stack technique

- [Vite](https://vite.dev/) + [React 19](https://react.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) (via `@tailwindcss/vite`, sans `tailwind.config.js`)
- [react-router-dom](https://reactrouter.com/) v7
- [@supabase/supabase-js](https://supabase.com/docs/reference/javascript) — synchronisation optionnelle avec fallback localStorage
- [lucide-react](https://lucide.dev/) — icônes
- [recharts](https://recharts.org/) — graphiques
- clsx / tailwind-merge

## Démarrage

```bash
npm install
npm run dev
```

L'application démarre sur `http://localhost:5173` (port par défaut Vite).

### Build de production

```bash
npm run build
```

## Variables d'environnement

Créez un fichier `.env.local` à la racine (déjà présent, à compléter) :

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Si ces variables sont vides, l'application fonctionne normalement en mode **localStorage uniquement**
(un avertissement est affiché dans la console). Dès que les identifiants Supabase sont renseignés,
les données se synchronisent automatiquement (lecture au démarrage, écriture à chaque modification).

## Comptes de démonstration

| Rôle | Email | Mot de passe |
|---|---|---|
| Sage-Femme | a.ndoye@ndamatou.sn | sf2026 |
| Gynécologue | f.sarr@ndamatou.sn | gyn2026 |
| Pédiatre Néonat. | c.mbaye@ndamatou.sn | ped2026 |
| Administrateur | admin@ndamatou.sn | ndamatou2026 |

## Base de données

Le schéma SQL (tables `grossesses`, `accouchements`, `nouveau_nes`, `couveuses`) se trouve dans
[`supabase/schema.sql`](./supabase/schema.sql). RLS n'est pas configuré — à activer avant toute mise
en production avec des données patientes réelles.
