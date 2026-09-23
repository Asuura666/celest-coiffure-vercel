"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
}

export default defineConfig({
  name: "celest",
  title: "Celest Coiffure",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Contenu du site")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
                  .title("Contenu du site")
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
  document: {
    actions: (prev, context) =>
      context.schemaType === "siteSettings"
        ? prev.filter(
            ({ action }) => action !== "duplicate" && action !== "delete"
          )
        : prev,
  },
});
