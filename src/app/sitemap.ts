import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = siteUrl();
  if (!url) return [];
  return ["", "/ejemplos", "/aviso-legal", "/privacidad"].map((path) => ({
    url: `${url}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.5,
  }));
}
