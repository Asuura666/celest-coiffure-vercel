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

Les variables Resend sont déjà présentes dans Vercel via l'intégration, mais le flux e-mail doit encore être testé de bout en bout et le domaine d'envoi doit être vérifié avant mise en production réelle.

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

État : instrumentation dans le code, activation / validation dashboard Vercel encore à confirmer.

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

## 14. Prochaines étapes

- [x] tester le formulaire Resend de bout en bout ;
- vérifier / activer Analytics et Speed Insights ;
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

---

Ce document doit être mis à jour lorsqu'une décision d'architecture ou d'exploitation change.
