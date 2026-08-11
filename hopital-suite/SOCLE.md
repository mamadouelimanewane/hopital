# Socle du parcours patient

Fondation du système hospitalier, construite **à côté** des 45 maquettes
de démonstration, qui restent intactes et inchangées.

## Le principe

Un module n'est pas une application : c'est une vue sur le parcours
d'un patient. Trois clés portent l'ensemble.

| Clé | Ce qu'elle désigne | Durée de vie |
|---|---|---|
| `IPP` | Le patient | À vie, ne change jamais |
| `NDA` | Une venue | De l'arrivée à la sortie |
| `mouvement` | Où il se trouve | Un par unité traversée |

Et une règle : **la validation clinique d'un acte et l'émission de sa
ligne de facture sont le même geste.** Un acte non capturé au moment
où il a lieu ne sera jamais facturé.

## Qui fait quoi

L'accès est fermé par défaut : sans session, chaque route répond 401.
Le rôle décide de ce qui est permis, et **l'identité de l'acteur vient
de la session, jamais du navigateur**. Un client qui envoie
`prescripteur: "Dr. Usurpateur"` voit la prescription signée du nom du
compte réellement connecté.

| Rôle | Peut |
|---|---|
| `accueil` | rechercher, admettre, fusionner des dossiers |
| `medecin` | prescrire, consulter |
| `infirmier` | prélever, consulter |
| `technicien` | prélever, saisir un résultat |
| `biologiste` | saisir un résultat, **valider** — donc déclencher la facturation |
| `manipulateur` | programmer et réaliser un examen d'imagerie |
| `chirurgien` | consentement, programmation, incision, implants, sortie de salle |
| `anesthesiste` | consultation d'anesthésie, induction |
| `radiologue` | interpréter et **signer** un compte rendu — donc facturer |
| `bloc` | valider la liste de vérification — geste d'équipe, pas signature hiérarchique |
| `pharmacien` | viser une prescription, dispenser, enregistrer un retour |
| `facturation` | clôturer et facturer |
| `admin` | tout, mais tracé sous son identité réelle |

La session est un JWT dans un cookie `HttpOnly` : invisible au
JavaScript de la page, donc involable par une faille d'affichage.

## Démarrer

### Avec un Postgres jetable, sans rien installer

```bash
npm run db:serveur-test      # terminal 1 — Postgres WASM sur :5433
npm run dev                  # terminal 2
```

Créer `.env.local` à partir de `.env.example` :

```
DATABASE_URL=postgres://postgres@127.0.0.1:5433/postgres
PGSSL_DISABLE=1
PGPOOL_MAX=1
JWT_SECRET=<48 octets aléatoires>
```

Générer le secret :

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Écran de travail : http://localhost:3001/socle

Le serveur de test crée neuf comptes — un par rôle — avec le mot de
passe `socle-local`. Rien n'est conservé : à l'arrêt, la base disparaît.

### Avec un vrai Postgres

```bash
npm run db:migrate                                        # applique db/schema.sql
npm run db:creer-utilisateur accueil accueil "Nom Prénom"  # un compte par personne
npm run dev
```

`DATABASE_URL` accepte Neon, Supabase ou une instance locale.
`PGPOOL_MAX` peut alors être retiré. Le mot de passe est généré et
affiché une seule fois — il n'est jamais passé en argument, pour ne
pas rester dans l'historique du shell.

## Organisation

```
db/
  schema.sql          23 tables : personnel, patient, séjour, mouvement,
                      actes, stock, facturation, journal
  catalogue.mjs       50 actes tarifés et le stock pharmaceutique initial
  migrate.mjs         application du schéma
  creer-utilisateur.mjs  création d'un compte du personnel
  serveur-test.mjs    Postgres jetable pour le développement

lib/
  db.ts               accès base, exécuteur remplaçable pour les tests
  identite.ts         normalisation, réduction phonétique, rapprochement de doublons
  admission.ts        création patient, ouverture de séjour, qualification du payeur
  facturation.ts      tarifs datés, émission des lignes, contrôles, clôture
  auth.ts             bcrypt, session JWT, matrice de permissions
  laboratoire.ts      prescription → prélèvement → résultat → validation
  imagerie.ts         demande → programmation → réalisation → compte rendu → signature
  pharmacie.ts        prescription → analyse → dispensation → administration
  bloc.ts             consentement → programmation → 3 vérifications → sortie de salle
  hebergement.ts      nuitées, tarif par catégorie, calcul rejouable

app/api/socle/        routes HTTP
app/socle/            écran de travail
tests/                193 assertions sur un vrai Postgres
```

## Ce qui est couvert

**Identitovigilance.** La réduction phonétique rapproche les graphies
d'un même nom (Ndiaye/Ndiay, Sarr/Sar, Thiam/Tiam, Ba/Bah, Fatou/Fatu)
sans confondre des noms distincts (Diop/Diouf, Sow/Sarr, Sy/Sylla).
Elle sert à **proposer** des candidats : la décision revient toujours à
l'agent d'accueil. Fusionner deux personnes distinctes est plus grave
qu'un doublon.

**Admission.** IPP et NDA lisibles, séquentiels par année. Un seul
séjour ouvert à la fois par patient. Le triage n'est accepté que pour
une entrée par les urgences. Huit régimes de couverture modélisés,
dont CMU, IPM, mutuelle et prise en charge sociale.

**Facturation.** Le tarif est daté : une revalorisation ne réécrit
jamais une facture ancienne. La ligne fige le montant et le taux
appliqués. Le plafond de prise en charge est respecté au centime.
La clôture refuse de s'exécuter s'il reste des actes validés sans
ligne de facture.

**Laboratoire.** Prescription, prélèvement, résultat, validation. La
validation biologique est le geste qui facture.

**Imagerie.** Même principe, trois différences réelles :

- l'examen est **programmé** avant d'être réalisé — il occupe une machine ;
- la **dose délivrée** est tracée à la réalisation, exigée pour tout
  examen irradiant, et cumulée sur la vie du patient plutôt que sur le
  séjour, comme l'impose la radioprotection ;
- un examen injecté consomme un **produit de contraste**, facturé en
  ligne distincte : un scanner injecté produit deux lignes, pas une.

La signature du compte rendu par le radiologue est le geste qui
facture — l'examen et son contraste, dans la même transaction.

**Pharmacie.** Le plateau le plus éloigné des deux autres : une ligne
de prescription engendre plusieurs administrations, donc plusieurs
lignes de facture.

- rien ne sort sans **analyse pharmaceutique** favorable ; un refus
  arrête les lignes et devient infranchissable ;
- le **stock** est une contrainte, pas un compteur indicatif : on ne
  dispense pas ce qu'on n'a pas, et chaque mouvement est tracé ;
- c'est l'**administration au lit** qui facture, pas la dispensation.
  Ce qui est dispensé puis rendu n'a jamais été consommé par le
  patient : le retour recrédite le stock et ne coûte rien.

**Bloc opératoire.** Le seul plateau dont l'enjeu premier n'est pas la
facturation mais la sécurité. Cinq barrières, qui bloquent réellement :

- **consentement éclairé** signé et non révoqué,
- **consultation d'anesthésie** réalisée,
- puis la liste de vérification en **trois temps** — avant induction,
  avant incision, avant sortie de salle. Une liste partiellement
  remplie est refusée en nommant les points manquants : l'accepter
  reviendrait à en faire une formalité.

Les **implants** sont tracés au numéro de lot, et `porteursDuLot()`
retrouve les patients concernés — c'est ce qu'exige un rappel de
dispositif, des années après.

La facturation est composite : acte chirurgical, anesthésie,
occupation de salle à l'heure entamée, surveillance
post-interventionnelle, et chaque implant posé.

**Hébergement.** La seule facturation sans geste soignant — elle court
pendant que le patient dort.

- on compte des **nuitées**, pas des jours : entrer et sortir le même
  jour ne produit aucune journée, cela relève de l'ambulatoire ;
- chaque nuit est facturée au **tarif de l'unité où elle a été
  passée** : un patient transféré de réanimation en chambre commune
  ne paie pas la réanimation pour ses nuits en chambre commune ;
- le calcul est **rejouable** — la clé (mouvement, nuit) interdit de
  facturer deux fois. On peut le lancer chaque matin et à la clôture
  sans se demander ce qui a déjà été fait.

**Pharmacie.** Le plateau le plus éloigné des deux autres : une ligne
de prescription engendre plusieurs administrations, donc plusieurs
lignes de facture. Trois règles le structurent :

- rien ne sort de la pharmacie sans **avis pharmaceutique favorable** ;
  un refus arrête les lignes et devient infranchissable ;
- on ne dispense que ce qu'on a — le **stock** est une contrainte, avec
  traçabilité de chaque mouvement et alerte de seuil ;
- c'est l'**administration** au lit du patient qui facture, pas la
  dispensation. Ce qui est dispensé puis rendu n'a jamais été consommé
  et ne doit rien coûter au patient.

## Tests

```bash
npm test
```

193 assertions, dont les quatre plateaux de bout en bout et le contrôle
d'accès rôle par rôle, exécutées sur un véritable Postgres compilé en
WebAssembly — schéma, transactions et contraintes réellement éprouvés,
aucun serveur requis. La suite tourne en une quarantaine de secondes.

## Limites connues

- Les montants du catalogue sont **indicatifs**. La grille officielle
  de l'établissement et les nomenclatures de la tutelle doivent les
  remplacer avant toute mise en service.
- Bloc opératoire, hébergement (prix de journée) et recouvrement
  restent à brancher — le schéma les prévoit déjà, et les trois
  plateaux livrés servent de modèle.
- Pas encore de renouvellement de mot de passe ni de verrouillage
  après échecs répétés.
- Le chiffrement au repos et la politique de conservation dépendent de
  l'hébergement retenu : à arbitrer avec l'établissement.
