# Celest Coiffure — Vercel

Refonte du site Celest Coiffure pensée comme premier template de la **Partie Site Web**.

## Objectifs

- Déploiement Vercel sans serveur à maintenir
- Next.js 16
- Contenu éditable via Sanity
- Vercel Analytics + événements commerciaux
- Formulaire de contact via Vercel Function + Resend
- Réservation conservée sur Planity
- Pas de n8n, pas de base de données, pas de chatbot IA dans le socle

## Développement

```bash
npm install
cp .env.example .env.local
npm run dev
```

Les variables Sanity et Resend sont optionnelles au démarrage : le site possède des données de repli locales pour permettre le premier déploiement.
