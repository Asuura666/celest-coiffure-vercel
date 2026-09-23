# Celest Coiffure — Architecture, configuration et état validé

> Dernière mise à jour : 23/09/2026  
> Objectif : conserver une trace complète du POC qui sert de base à la **Partie Site Web**.

## 1. Principe retenu

Le projet doit rester un site vitrine commercial **sans infrastructure personnelle à exploiter**.

Architecture cible :

```text
GitHub
  ↓ push
Vercel
  ├─ Next.js
  ├─ Vercel Functions
  ├─ Web Analytics / Speed Insights
  └─ domaine client
       ↓
     Sanity
       └─ contenu éditable par le client

Formulaire
  ↓
Vercel Function
  ↓
Resend
  ├─ e-mail salon
  └─ accusé de réception visiteur

Réservation
  ↓
Planity (service externe existant)
```

Le socle standard ne doit donc pas nécessiter :

- VPS personnel
- Docker
- nginx
- PostgreSQL
- systemd
- sauvegardes serveur maison
- n8n
- réservation auto-hébergée
- chatbot IA

n8n ne sera ajouté que pour une automatisation avancée qui justifie réellement son exploitation.

## 2. Repository et déploiement

Repository :

`Asuura666/celest-coiffure-vercel`

Branche de production :

`main`

Vercel déploie automatiquement chaque push GitHub.

Important : les URL Vercel contenant un identifiant aléatoire correspondent à **un deployment immuable**. Pour tester la version courante, utiliser l'URL stable du projet ou le deployment marqué `Production`.

URL stable utilisée pendant le POC :

`https://celest-coiffure-vercel-ilane1.vercel.app`

Le domaine final `celest-coiffure.fr` ne doit être branché qu'après validation complète.

## 3. Stack

- Next.js 16
- React 19
- Vercel
- Sanity
- next-sanity
- Resend
- Vercel Analytics
- Vercel Speed Insights
- Planity pour la réservation

## 4. Variables d'environnement

Les noms suivants sont utilisés. **Ne jamais committer leurs valeurs secrètes.**

### Sanity

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
```

L'intégration Vercel Marketplace Sanity ajoute également plusieurs variables `SANITY_...` et tokens. Ces tokens sont secrets et ne doivent jamais être exposés dans le frontend ou GitHub.

### Resend

```env
RESEND_API_KEY=
RESEND_FROM_EMAIL=
CONTACT_TO_EMAIL=
```

Le flux Resend a été testé de bout en bout. Attention : l'intégration Vercel peut ne pas injecter correctement `RESEND_API_KEY` dans le runtime du projet. Toujours vérifier explicitement sa présence dans les Environment Variables du projet après installation.

## 5. Configuration Sanity

Projet Sanity actuel :

`project-pme`

Dataset :

`production`

Le dataset est public, ce qui est cohérent ici : il ne doit contenir que du contenu destiné au site public.

### Studio embarqué

Le Studio Sanity n'est **pas** déployé sur l'hébergement Sanity.

Il est embarqué directement dans l'application Next.js :

`/studio`

Fichiers principaux :

- `sanity.config.ts`
- `sanity.cli.ts`
- `src/app/studio/[[...tool]]/page.tsx`
- `sanity/schemaTypes/siteSettings.ts`

Dans `sanity.config.ts` :

```ts
basePath: "/studio"
```

Il est donc normal que la page **Sanity > Studios** affiche « no studios deployed ». Nous n'utilisons pas `sanity deploy`.

### Authentification Studio

Pendant le POC, le bouton de connexion **Vercel** redirigeait vers l'interface Marketplace Sanity au lieu d'ouvrir le Studio.

La connexion via **GitHub** a permis d'accéder correctement au Studio embarqué.

À retenir : si l'authentification Vercel boucle vers le dashboard, utiliser une méthode de connexion Sanity associée au même compte/e-mail, par exemple GitHub ou Google.

### CORS

Sanity doit autoriser les origines Vercel utilisées par le Studio.

Configuration observée pendant le POC :

```text
https://celest-coiffure-vercel-ilane1.vercel.app
https://celest-coiffure-vercel-*-ilane1.vercel.app
http://localhost:3333
```

Credentials autorisés pour le Studio.

À terme, limiter les origins au strict nécessaire.

## 6. Modèle de contenu

Le type Sanity principal est :

`siteSettings`

Il contient notamment :

- titre principal
- sur-titre
- texte d'introduction
- titre / texte À propos
- photo principale
- lien Planity
- Instagram
- téléphone
- e-mail
- adresse
- activation d'une offre
- titre de l'offre
- texte de l'offre
- services

### Singleton

Le contenu du site est volontairement un **singleton**.

ID du document :

`siteSettings`

Le Studio ouvre directement ce document au lieu d'afficher une collection de documents.

La suppression et la duplication sont désactivées pour ce type.

Le frontend doit toujours viser explicitement :

```groq
*[_type == "siteSettings" && _id == "siteSettings"][0]
```

Ceci évite de lire accidentellement un ancien document `siteSettings`.

## 7. Lecture du contenu côté frontend

Fichier :

`src/lib/sanity.ts`

État actuel pendant la validation :

```ts
useCdn: false
```

et :

```ts
{ cache: "no-store" }
```

Ce choix est volontaire pour le POC : une publication dans Sanity doit être visible immédiatement.

Plus tard, pour réduire les requêtes, on pourra remettre du cache avec :

- revalidation périodique ;
- ou webhook Sanity → revalidation Next.js.

### Fallbacks

Le site possède des données locales dans :

`src/lib/site-data.ts`

Si Sanity est indisponible ou non configuré, ces données permettent au site de rester affichable.

Important : Sanity renvoie `null` pour certains champs non renseignés. Les valeurs `null` sont supprimées avant fusion afin qu'elles **n'écrasent pas les fallbacks**.

Cette correction a résolu un crash serveur observé après création d'un document Sanity partiellement rempli.

## 8. Validation CMS effectuée

Test validé le 23/09/2026 :

1. ouverture de `/studio` ;
2. connexion au Studio ;
3. modification de `Contenu du site` ;
4. activation de l'offre du moment ;
5. publication de :
   - titre : `Test offre de la rentrée`
   - texte : `Je suis un test`
6. affichage confirmé sur le frontend Vercel.

Flux validé :

```text
Sanity Studio
  ↓ Publish
Content Lake
  ↓
Next.js sur Vercel
  ↓
site mis à jour
```

Aucun commit GitHub ou redéploiement n'est nécessaire pour une modification de contenu.

## 9. Formulaire et Resend

Le formulaire utilise :

`src/app/api/contact/route.ts`

Flux prévu :

```text
Visiteur
  ↓
POST /api/contact
  ↓
Vercel Function
  ↓
Resend
  ├─ notification au salon
  └─ confirmation au visiteur
```

Protection minimale déjà présente :

- validation des champs
- champ honeypot
- consentement obligatoire
- longueur de message limitée
- aucune base de données

État : **test réel Resend validé le 23/09/2026** avec `onboarding@resend.dev` et l'adresse du compte Resend comme destinataire de test. Sans domaine vérifié, Resend limite l'envoi aux adresses autorisées de test.

## 9.1. Personnalisation des emails

Les emails Resend ne doivent pas rester en texte brut en production.

Le template cible doit permettre, par client :

- logo
- couleurs de marque
- nom de l'entreprise
- texte personnalisé
- récapitulatif de la demande
- bouton CTA (Planity, prise de rendez-vous, devis, etc.)
- téléphone / adresse / réseaux sociaux
- footer et mentions utiles

Deux modèles sont prévus :

1. **Notification entreprise** : email reçu par le commerçant avec les informations du prospect.
2. **Accusé de réception client** : email HTML brandé confirmant la bonne réception de la demande.

L'objectif est d'en faire un composant réutilisable dans le futur template générique de la Partie Site Web, alimenté par la configuration du client.

État : **à implémenter après validation complète du POC**.

## 10. Analytics

Le code inclut :

- Vercel Analytics
- Speed Insights

Événements prévus :

- `PlanityClick`
- `PhoneClick`
- `InstagramClick`
- `ContactSubmission`

État : **Vercel Web Analytics validé le 23/09/2026**. Les visiteurs et pages vues remontent correctement dans le dashboard Vercel. Les événements personnalisés sont instrumentés dans le code, mais leur utilisation en production dépend du plan Vercel retenu.

Les Analytics restent anonymes : ils ne doivent pas être utilisés comme une base de leads identifiés.

## 11. Réservation

Aucun système de réservation n'est développé ou hébergé par nous.

Le site redirige vers Planity.

C'est volontaire afin d'éviter de reprendre la charge opérationnelle de l'ancien projet Confort Zone : DB, calendrier, sauvegardes, disponibilité, maintenance, etc.

## 12. Règle d'exploitation pour la Partie Site Web

Le modèle commercial doit rester scalable :

> « Géré par nous » signifie gérer le projet Vercel et le template, pas gérer un serveur dédié au client.

Le client doit rester propriétaire de son domaine.

Si un client quitte le service, le projet peut être transféré ou remis au client plutôt que maintenir une dépendance permanente à notre infrastructure.

Le CMS doit permettre au client de modifier seul :

- textes
- images
- offres
- horaires
- coordonnées
- services

Les modifications de structure ou les développements spécifiques restent des prestations séparées.

## 13. Incidents rencontrés et solutions

### Studio Sanity vide dans le dashboard

**Symptôme :** Sanity > Studios affichait aucun Studio.

**Cause :** normal, car le Studio est embarqué dans Next.js/Vercel.

**Solution :** utiliser `/studio`, ne pas utiliser `sanity deploy`.

### Connexion Vercel redirige vers Sanity Dashboard

**Solution validée :** connexion au Studio via GitHub.

### Publication Sanity non visible

Plusieurs causes ont été éliminées :

- ancienne URL de deployment Vercel immuable ;
- cache Sanity / Next ;
- requête non déterministe sur plusieurs documents `siteSettings`.

Corrections :

- utiliser le deployment courant / URL stable ;
- `useCdn: false` ;
- `cache: "no-store"` ;
- singleton `_id == "siteSettings"`.

### Server error après publication

**Cause :** des champs Sanity non renseignés revenaient en `null` et écrasaient les valeurs locales de fallback.

**Solution :** filtrer les `null` / `undefined` avant la fusion.

### Formulaire en 503 — `Contact service not configured`

**Symptôme :** `POST /api/contact` répond 503.

**Cause validée :** une ou plusieurs variables d'environnement Resend ne sont pas disponibles dans le runtime de la Function.

**Diagnostic ajouté :** la Function loggue uniquement le **nom** des variables manquantes, jamais leur valeur.

Variables obligatoires :

```text
RESEND_API_KEY
RESEND_FROM_EMAIL
CONTACT_TO_EMAIL
```

**À retenir :**

1. vérifier les variables au niveau **du projet Vercel**, pas seulement l'intégration Marketplace ;
2. `RESEND_API_KEY` doit être de type Secret ;
3. après toute modification d'une Environment Variable, créer un **nouveau deployment** ;
4. tester l'URL du nouveau deployment ou l'URL stable de production, pas une ancienne URL immuable.

### Resend 403 — `You can only send testing emails to your own email address`

**Symptôme :** la Function fonctionne, contacte Resend, mais reçoit un 403 `validation_error`.

**Cause :** avec `onboarding@resend.dev`, Resend est en mode test et limite les destinataires tant qu'aucun domaine n'est vérifié.

**Solution POC validée :**

- `RESEND_FROM_EMAIL=Celest Coiffure <onboarding@resend.dev>`
- `CONTACT_TO_EMAIL` = adresse autorisée du compte Resend
- utiliser cette même adresse comme destinataire pendant le test

Pour la production :

- vérifier un domaine du client dans Resend ;
- configurer SPF / DKIM ;
- utiliser une adresse du domaine vérifié comme expéditeur ;
- ne pas dépendre de `resend.dev`.

### Analytics affiche 0 visiteur

**Symptôme :** Vercel Analytics reste sur l'écran Get Started ou affiche 0.

**Vérifications :**

- `@vercel/analytics` installé ;
- `<Analytics />` présent dans le layout ;
- site redéployé ;
- visiter réellement l'URL de production ;
- désactiver temporairement un bloqueur de contenu si nécessaire.

**Validation :** le POC a remonté correctement visiteurs, pages vues et pages visitées.

### Ancienne URL Vercel testée par erreur

Les URL contenant un hash de deployment sont **immuables**.

Exemple :

```text
celest-coiffure-vercel-xxxxxxxxx-ilane1.vercel.app
```

Un nouveau push GitHub ne modifie jamais cette URL.

Toujours vérifier :

- le dernier deployment marqué `Production` ;
- ou l'URL stable du projet.


## 14. Prochaines étapes

- [x] tester le formulaire Resend de bout en bout ;
- [x] vérifier / activer Vercel Web Analytics ;
- valider Speed Insights et les événements personnalisés sur le plan Vercel retenu ;
- compléter les mentions légales et confidentialité ;
- migrer les vrais contenus et images Celest dans Sanity ;
- améliorer le design ;
- valider le responsive ;
- brancher le domaine final après recette ;
- décider ensuite d'une stratégie de cache/revalidation ;
- transformer ce projet en template générique pour les futurs clients.

## 15. Commits importants du POC

Quelques corrections structurantes :

- `3989f92` — configuration du Studio embarqué
- `060c658` — singleton Sanity
- `ca26cc1` — désactivation du cache pendant validation
- `ca76aa3` — requête explicite du singleton
- `0496496` — conservation des fallbacks pour les champs Sanity vides


## 16. Runbook anti-erreurs — nouveau client Site Web

Suivre cet ordre pour chaque nouveau site.

### A. Création

1. créer / cloner le template GitHub ;
2. importer le repository dans Vercel ;
3. vérifier que le premier build est `Ready` ;
4. utiliser l'URL stable du projet pour les tests courants.

### B. Sanity

1. connecter/créer un projet Sanity ;
2. créer le dataset `production` ;
3. vérifier :
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET=production`
4. conserver le Studio embarqué sur `/studio` avec `basePath: "/studio"` ;
5. configurer les CORS du domaine Vercel ;
6. si le bouton Vercel boucle vers le dashboard Sanity, se connecter via GitHub/Google avec le compte autorisé ;
7. utiliser un singleton `siteSettings`, jamais une liste libre pour les paramètres globaux ;
8. tester une publication avant de continuer.

### C. Contenu / fallback

Le frontend doit :

- viser explicitement `_id == "siteSettings"` ;
- tolérer un document Sanity partiellement rempli ;
- ne jamais laisser `null` écraser une valeur de fallback ;
- conserver un fallback local suffisant pour afficher le site si Sanity est indisponible.

### D. Resend

1. installer / connecter Resend ;
2. vérifier manuellement les trois variables runtime :
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `CONTACT_TO_EMAIL`
3. faire un **redeploy après toute modification** de variable ;
4. pour un POC sans domaine : utiliser `onboarding@resend.dev` et un destinataire autorisé ;
5. pour la production : vérifier le domaine du client et SPF/DKIM ;
6. contrôler les erreurs retournées par `resend.emails.send()`, ne jamais afficher un faux succès ;
7. vérifier l'envoi dans Resend > Emails.

### E. Analytics

1. conserver `<Analytics />` dans le layout ;
2. conserver Speed Insights si souhaité ;
3. visiter le site après déploiement pour générer les premières données ;
4. vérifier visiteurs et pages vues dans Vercel ;
5. instrumenter les conversions avec des noms stables :
   - `PlanityClick`
   - `PhoneClick`
   - `InstagramClick`
   - `ContactSubmission`
6. ne jamais considérer Analytics comme une base de leads identifiés ;
7. prévoir le futur portail client pour afficher ces métriques via l'API Analytics.

### F. Mise en production

Avant de brancher le domaine réel :

- contenu final validé ;
- responsive validé ;
- CMS validé ;
- formulaire validé ;
- emails validés ;
- Analytics validé ;
- réservation externe validée ;
- mentions légales / confidentialité complètes ;
- propriétaire du domaine identifié ;
- stratégie de transfert/sortie client connue.

### G. Principe d'architecture à ne pas casser

Le socle Site Web doit rester :

```text
GitHub + Vercel + Sanity + Resend + service de réservation externe
```

Ne pas réintroduire VPS, Docker, PostgreSQL, n8n ou autre infrastructure persistante dans l'offre standard sauf besoin réellement justifié et facturé séparément.

---

Ce document doit être mis à jour lorsqu'une décision d'architecture ou d'exploitation change.
