import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
  async redirects() {
    return [
      { source: "/seja-nosso-parceiro", destination: "/seja-parceiro", permanent: true },
      { source: "/lancamentos", destination: "/empreendimentos?status=lancamento", permanent: true },
      { source: "/obrigado", destination: "/contato", permanent: true },
      { source: "/em-breve", destination: "/empreendimentos", permanent: true },
      { source: "/future-proofing-hospitals", destination: "/blog", permanent: true },
      { source: "/bike-parts-warehouse", destination: "/blog", permanent: true },
      { source: "/joy-hotel-casino", destination: "/blog", permanent: true },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [{ source: "/images/blog/:name", destination: "/api/media/:name" }],
    };
  },
};

export default nextConfig;
