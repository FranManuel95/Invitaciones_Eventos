import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/** Con dominio propio (SITE_URL) se indexa solo lo público; sin él, nada. */
export default function robots(): MetadataRoute.Robots {
  const url = siteUrl();
  if (!url) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/ejemplos", "/aviso-legal", "/privacidad"],
      // Invitaciones, álbumes, paneles y editor son privados aunque alguien enlace a ellos.
      disallow: ["/i/", "/album/", "/panel", "/editor", "/entrar", "/unirse/", "/auth/"],
    },
    sitemap: `${url}/sitemap.xml`,
  };
}
