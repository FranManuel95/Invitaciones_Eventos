import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Fotos que suben las parejas al almacenamiento de Supabase.
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
  async redirects() {
    // El panel de demostración vivía en /panel/*; ahora cada evento tiene su ruta.
    return ["invitados", "transporte", "menus", "comunicaciones"].map((section) => ({
      source: `/panel/${section}`,
      destination: `/panel/demo/${section}`,
      permanent: false,
    }));
  },
};

export default nextConfig;
