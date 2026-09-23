# Déploiement Vercel — Celest

> État du POC validé le 23/09/2026.  
> Voir aussi `docs/ARCHITECTURE-CONFIGURATION.md` pour l'architecture complète, les incidents rencontrés et les choix d'exploitation.

## 1. Importer le repo dans Vercel

- New Project
- Importer `Asuura666/celest-coiffure-vercel`
- Framework détecté : Next.js
- Root Directory : `./`
- Build Command : défaut
- Output Directory : défaut

Le site peut démarrer avec les contenus locaux de fallback.

## 2. Connecter Sanity

L'intégration Sanity peut être ajoutée directement depuis Vercel Marketplace.

Variables nécessaires au code :

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
```

Le projet actuel utilise :

- projet Sanity : `project-pme`
- dataset : `production`

Le Studio est **embarqué dans Next.js** à l'adresse :

`/studio`

Il n'est donc pas nécessaire de déployer un Studio séparé chez Sanity. La page Sanity > Studios peut rester vide.

### CORS

Autoriser les origins Vercel utilisées par le Studio et le développement local.

### Authentification

Pendant le POC, la connexion via **GitHub** a fonctionné correctement. Le bouton Vercel renvoyait vers l'interface Marketplace au lieu du Studio.

## 3. Créer / éditer le contenu

Dans `/studio` :

- ouvrir **Contenu du site** ;
- renseigner les champs ;
- cliquer sur **Publish**.

Le document est un singleton d'ID :

`siteSettings`

Le frontend interroge explicitement cet ID.

Pendant la phase de validation, le contenu est lu sans cache :

- `useCdn: false`
- `cache: "no-store"`

Ainsi une publication Sanity doit être immédiatement visible sur le site.

## 4. Resend / formulaire

Variables :

```env
RESEND_API_KEY=
RESEND_FROM_EMAIL=
CONTACT_TO_EMAIL=
```

Le formulaire utilise la Vercel Function :

`/api/contact`

Elle doit :

1. envoyer la demande au salon ;
2. envoyer un accusé de réception au visiteur.

Le code est en place. Le test e-mail réel reste à effectuer avant mise en production.

## 5. Analytics

Le code inclut :

- Vercel Web Analytics
- Speed Insights

Événements présents :

- `PlanityClick`
- `PhoneClick`
- `InstagramClick`
- `ContactSubmission`

Vérifier leur activation et leur remontée dans le dashboard Vercel.

## 6. URLs Vercel

Chaque deployment possède une URL immuable avec un identifiant aléatoire.

Pour tester la version de production courante, utiliser l'URL stable du projet :

`https://celest-coiffure-vercel-ilane1.vercel.app`

ou vérifier dans **Deployments** que le commit voulu est marqué **Production**.

## 7. Domaine final

Le domaine doit rester la propriété du client.

Ne brancher `celest-coiffure.fr` qu'après :

- validation complète du contenu ;
- validation mobile / desktop ;
- test formulaire ;
- vérification Analytics ;
- mentions légales / confidentialité complètes ;
- validation de Planity.

## 8. Principe d'exploitation

Ce projet ne doit dépendre d'aucun VPS personnel :

- pas de Docker
- pas de nginx
- pas de PostgreSQL
- pas de systemd
- pas de n8n dans le socle
- pas de réservation auto-hébergée

Planity reste le système de réservation.

Le mode « service géré » signifie : **gestion du projet Vercel et du template, pas gestion d'un serveur client**.
