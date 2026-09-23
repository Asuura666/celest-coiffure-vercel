import { createClient } from "next-sanity";
import { fallbackSiteData, type SiteData } from "./site-data";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const sanityConfigured = Boolean(projectId);

const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2026-09-01",
      useCdn: false,
    })
  : null;

const query = `*[_type == "siteSettings" && _id == "siteSettings"][0]{
  heroTitle,
  heroEyebrow,
  heroText,
  aboutTitle,
  aboutText,
  "aboutImageUrl": aboutImage.asset->url,
  planityUrl,
  instagramUrl,
  phone,
  email,
  address,
  promotionEnabled,
  promotionTitle,
  promotionText,
  services[]{
    title,
    description,
    "imageUrl": image.asset->url
  }
}`;

function withoutNulls<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== null && item !== undefined)
  ) as Partial<T>;
}

export async function getSiteData(): Promise<SiteData> {
  if (!client) return fallbackSiteData;

  try {
    const data = await client.fetch<Partial<SiteData> | null>(
      query,
      {},
      { cache: "no-store" }
    );

    if (!data) return fallbackSiteData;

    const cleanData = withoutNulls(data);

    return {
      ...fallbackSiteData,
      ...cleanData,
      services:
        data.services && data.services.length > 0
          ? data.services
          : fallbackSiteData.services,
      aboutImageUrl: data.aboutImageUrl || fallbackSiteData.aboutImageUrl,
    };
  } catch {
    return fallbackSiteData;
  }
}
