# CNRA Suite — Applications gouvernementales

Suite de 6 applications digitales développées pour le **Conseil National de Régulation de l'Audiovisuel du Sénégal (CNRA)** par Processingenierie.

---

## Applications

| Application | Description | Port | Dépôt |
|-------------|-------------|------|-------|
| **ElectroWatch** | Surveillance des résultats électoraux en temps réel | 3005 | [cnra-electrowatch](https://github.com/mamadouelimanewane/cnra-electrowatch) |
| **Citoyen** | Participation citoyenne et signalements audiovisuels | 3006 | [cnra-citoyen](https://github.com/mamadouelimanewane/cnra-citoyen) |
| **MediaBase** | Registre national des médias audiovisuels | 3007 | [cnra-mediabase](https://github.com/mamadouelimanewane/cnra-mediabase) |
| **MediaWatch** | Monitoring du temps de parole et surveillance | 3008 | [cnra-mediawatch](https://github.com/mamadouelimanewane/cnra-mediawatch) |
| **AntiDeep** | Détection de deepfakes et désinformation audiovisuelle | 3009 | [cnra-antideep](https://github.com/mamadouelimanewane/cnra-antideep) |
| **EduMedia** | Éducation aux médias et littératie médiatique | 3010 | [cnra-edumedia](https://github.com/mamadouelimanewane/cnra-edumedia) |

---

## Stack technique

- **Framework** : Next.js 16.2.9 (App Router, Turbopack, TypeScript)
- **UI** : Tailwind CSS v4, Recharts, Lucide React
- **Backend** : Supabase (PostgreSQL, Auth, RLS, Realtime)
- **Déploiement** : Ports 3005–3010

---

## Lancer toutes les applications

```bash
# Installer les dépendances dans chaque app
cd electrowatch && npm install && npm run dev -- -p 3005 &
cd ../citoyen    && npm install && npm run dev -- -p 3006 &
cd ../mediabase  && npm install && npm run dev -- -p 3007 &
cd ../mediawatch && npm install && npm run dev -- -p 3008 &
cd ../antideep   && npm install && npm run dev -- -p 3009 &
cd ../edumedia   && npm install && npm run dev -- -p 3010 &
```

---

## Base de données

Toutes les applications partagent le même projet **Supabase**.  
Les migrations SQL sont disponibles dans `<app>/supabase/migrations/`.

| Migration | Tables |
|-----------|--------|
| `001_electrowatch.sql` | resultats_votes, bureaux_vote, candidats, partis, alertes_fraude |
| `002_citoyen.sql` | signalements, medias_citoyen, categories, votes_signalement |
| `003_mediabase.sql` | medias, groupes_media, journalistes, programmes, audits_media, stats_audience |
| `004_mediawatch.sql` | monitoring_sessions, temps_parole, alertes_monitoring, observations_contenu, rapports_veille |
| `005_antideep.sql` | contenus_analyses, campagnes_desinfo, sources_suspectes, signatures_deepfake, alertes_antideep |
| `006_edumedia.sql` | etablissements, ressources, modules_formation, formations, quiz, certificats |

---

*Développé par **Processingenierie** — Offre spontanée pour le CNRA Sénégal*
