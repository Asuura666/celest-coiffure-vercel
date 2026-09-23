# Déploiement Vercel — Celest

## 1. Importer le repo dans Vercel

- New Project
- Importer `Asuura666/celest-coiffure-vercel`
- Framework détecté : Next.js
- Déployer une première fois

Le site fonctionne immédiatement avec les contenus de repli locaux.

## 2. Activer Sanity

Créer un projet Sanity puis ajouter dans Vercel :

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET=production`

Redéployer puis ouvrir `/studio`.

Créer un document **Contenu du site** et renseigner les champs. Le frontend lit Sanity avec un cache de 60 secondes. Aucun serveur ni base PostgreSQL à maintenir.

## 3. Activer le formulaire

Créer/configurer Resend et vérifier un domaine d'envoi. Ajouter :

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `CONTACT_TO_EMAIL`

Le formulaire utilise une Vercel Function (`/api/contact`) et envoie :
1. la demande au salon ;
2. un accusé de réception automatique au visiteur.

Aucun n8n n'est nécessaire.

## 4. Analytics

Activer Web Analytics et Speed Insights dans le projet Vercel.

Événements présents dans le code :
- `PlanityClick`
- `PhoneClick`
- `InstagramClick`
- `ContactSubmission`

Les événements personnalisés nécessitent une offre Vercel compatible.

## 5. Domaine

Le domaine doit rester la propriété du client. Ajouter `celest-coiffure.fr` au projet Vercel uniquement lorsque la nouvelle version a été validée sur l'URL de preview.

## Principe d'exploitation

Ce projet ne doit dépendre d'aucun VPS personnel :
- pas de Docker
- pas de nginx
- pas de PostgreSQL
- pas de systemd
- pas de n8n
- pas de réservation auto-hébergée

Planity reste le système de réservation.
