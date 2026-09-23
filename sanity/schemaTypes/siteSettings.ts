import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Contenu du site",
  type: "document",
  fields: [
    defineField({ name: "heroEyebrow", title: "Sur-titre", type: "string" }),
    defineField({ name: "heroTitle", title: "Titre principal", type: "string" }),
    defineField({ name: "heroText", title: "Texte d'introduction", type: "text" }),
    defineField({ name: "aboutTitle", title: "Titre À propos", type: "string" }),
    defineField({ name: "aboutText", title: "Texte À propos", type: "text" }),
    defineField({
      name: "aboutImage",
      title: "Photo principale",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "planityUrl", title: "Lien Planity", type: "url" }),
    defineField({ name: "instagramUrl", title: "Instagram", type: "url" }),
    defineField({ name: "phone", title: "Téléphone", type: "string" }),
    defineField({ name: "email", title: "E-mail", type: "string" }),
    defineField({ name: "address", title: "Adresse", type: "string" }),
    defineField({
      name: "promotionEnabled",
      title: "Afficher l'offre du moment",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "promotionTitle", title: "Titre de l'offre", type: "string" }),
    defineField({ name: "promotionText", title: "Texte de l'offre", type: "text" }),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Nom", type: "string" },
            { name: "description", title: "Description", type: "text" },
            { name: "image", title: "Image", type: "image", options: { hotspot: true } },
          ],
        },
      ],
    }),
  ],
});
