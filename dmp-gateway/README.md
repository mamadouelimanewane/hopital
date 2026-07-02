# DMP-Gateway 🌍

Dossier Médical Partagé connecté au réseau national de santé sénégalais, développé pour l'Hôpital Ndamatou de Touba dans le cadre de son écosystème numérique hospitalier.

Interopérabilité **HL7 v2** et **FHIR R4** entre l'Hôpital Ndamatou et les autres établissements du réseau national (CHU Aristide Le Dantec Dakar, Hôpitaux Régionaux de Thiès, Saint-Louis, Kaolack, Hôpital de Ziguinchor, etc.).

## Fonctionnalités

- **Tableau de bord** — KPI de synchronisation, disponibilité réseau, volume horaire
- **Dossiers Partagés** — recherche et filtrage des dossiers patients synchronisés entre hôpitaux
- **Connecteurs** — supervision des points d'intégration HL7 v2 / FHIR R4 (statut, latence)
- **Journal de Synchronisation** — historique chronologique des événements de synchronisation
- **Réseau** — carte interactive des hôpitaux sénégalais connectés
- **Sécurité** — audit des accès et statut du chiffrement (TLS 1.3, AES-256)
- **Paramètres** — profil utilisateur et préférences de notification

## Stack technique

- [Vite](https://vite.dev/) + [React 19](https://react.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) (via `@tailwindcss/vite`)
- [react-router-dom](https://reactrouter.com/) v7
- [@supabase/supabase-js](https://supabase.com/docs/reference/javascript) — persistance optionnelle, avec repli automatique sur `localStorage`
- [lucide-react](https://lucide.dev/) — icônes
- [recharts](https://recharts.org/) — graphiques
- `clsx` / `tailwind-merge` — utilitaires de classes CSS

Thème sombre unique (pas de mode clair), interface entièrement en français.

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

Créez ou complétez le fichier `.env.local` à la racine :

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

L'application fonctionne parfaitement sans ces variables : les données sont alors gérées uniquement via `localStorage` (mode démo local). Si elles sont renseignées, l'application tente une synchronisation best-effort avec Supabase (voir `supabase/schema.sql` pour le schéma des tables).

## Comptes de démonstration

Voir l'écran de connexion pour les comptes rapides (`@ndamatou.sn`), couvrant les rôles Médecin, DIM (Département d'Information Médicale), Référent Interopérabilité et Administrateur.

---

Développé par **Processingenierie** · Hôpital Ndamatou Touba 🇸🇳
