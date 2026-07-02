# Waste-Control 🗑️

Gestion des Déchets Médicaux — Traçabilité complète des déchets infectieux et hospitaliers (DASRI) à l'Hôpital Ndamatou de Touba, Sénégal.

Application faisant partie de l'écosystème digital de l'Hôpital Ndamatou (développé par **Processingenierie**), aux côtés de modules comme blood-sync, ambu-track et smart-pharma.

## Fonctionnalités

- 🏷️ **Traçabilité** — suivi par code-barres de chaque collecte, de la production à la destruction
- ⚖️ **Pesée** — contrôle des volumes de déchets par zone et par type
- 📦 **Containers** — suivi des niveaux de remplissage avec alertes (>80%)
- 🔥 **Destruction** — registre des lots d'incinération avec certificats
- 📜 **Conformité** — rapports réglementaires et suivi des seuils environnementaux

## Stack technique

- [Vite](https://vitejs.dev/) + React 19 + TypeScript
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- React Router v7
- Supabase JS (synchronisation optionnelle, fallback localStorage)
- Recharts (visualisation de données)
- Lucide React (icônes)

## Démarrage

```bash
npm install
npm run dev
```

L'application est disponible sur `http://localhost:5173`.

Build de production :

```bash
npm run build
```

## Variables d'environnement

Créez un fichier `.env.local` (déjà présent, vide par défaut) :

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Si ces variables sont vides, l'application fonctionne intégralement en mode local (localStorage) — aucune configuration Supabase n'est requise pour l'utiliser.

## Comptes de démonstration

| Rôle | Email | Mot de passe |
|---|---|---|
| Agent de Collecte | m.ndao@ndamatou.sn | agent2026 |
| Superviseur | a.ba@ndamatou.sn | super2026 |
| Hygiéniste | c.gueye@ndamatou.sn | hyg2026 |
| Administrateur | admin@ndamatou.sn | ndamatou2026 |

## Base de données

Le schéma SQL (tables `collectes`, `containers`, `destructions`) se trouve dans `supabase/schema.sql`. RLS n'est pas configuré — à activer avant toute mise en production.

---

Développé par Processingenierie · Hôpital Ndamatou Touba 🇸🇳
