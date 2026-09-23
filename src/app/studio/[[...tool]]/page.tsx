"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export default function StudioPage() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return (
      <main style={{ padding: 40, fontFamily: "sans-serif" }}>
        <h1>Sanity n’est pas encore configuré.</h1>
        <p>
          Ajoutez NEXT_PUBLIC_SANITY_PROJECT_ID et NEXT_PUBLIC_SANITY_DATASET
          dans Vercel, puis redéployez.
        </p>
      </main>
    );
  }

  return <NextStudio config={config} />;
}
