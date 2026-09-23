export type Service = {
  title: string;
  description: string;
  imageUrl?: string;
};

export type SiteData = {
  heroTitle: string;
  heroEyebrow: string;
  heroText: string;
  aboutTitle: string;
  aboutText: string;
  aboutImageUrl: string;
  planityUrl: string;
  instagramUrl: string;
  phone: string;
  email: string;
  address: string;
  promotionEnabled: boolean;
  promotionTitle: string;
  promotionText: string;
  services: Service[];
};

export const fallbackSiteData: SiteData = {
  heroTitle: "L’élégance commence par vos cheveux.",
  heroEyebrow: "Celest Coiffure Élégance · Plaisance-du-Touch",
  heroText:
    "Un salon mixte, chaleureux et intimiste, pensé pour prendre le temps de vous conseiller et révéler un style qui vous ressemble.",
  aboutTitle: "Un salon pensé comme une parenthèse",
  aboutText:
    "Kevin vous accueille au centre de Plaisance-du-Touch dans un espace cosy, avec une approche personnalisée, des produits choisis avec soin et un vrai temps consacré au conseil.",
  aboutImageUrl:
    "https://celest-coiffure.fr/wp-content/uploads/2024/05/Celestcelest-copie-1024x913.webp",
  planityUrl:
    "https://www.planity.com/celest-coiffure-elegance-31830-plaisance-du-touch",
  instagramUrl: "https://www.instagram.com/celest.coiffure/",
  phone: "06 38 88 00 16",
  email: "kev-celest@live.fr",
  address: "10 rue des Écoles, 31830 Plaisance-du-Touch",
  promotionEnabled: true,
  promotionTitle: "Envie de changement ?",
  promotionText:
    "Réservez un diagnostic au salon pour définir la coupe, la couleur ou le soin le plus adapté à vos cheveux.",
  services: [
    {
      title: "Coupe",
      description:
        "Courte, mi-longue ou longue : une coupe adaptée à votre visage, votre style et votre quotidien.",
    },
    {
      title: "Couleur & balayage",
      description:
        "Couleurs, patines, mèches et balayages pensés pour votre carnation et votre base naturelle.",
    },
    {
      title: "Mise en forme",
      description:
        "Brushing, boucles, lissage ou permanente pour une finition maîtrisée et durable.",
    },
    {
      title: "Conseil",
      description:
        "Diagnostic et recommandations personnalisées pour entretenir vos cheveux au quotidien.",
    }
  ]
};
