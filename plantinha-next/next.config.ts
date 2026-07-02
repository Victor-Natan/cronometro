import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/index.html", destination: "/" },
      { source: "/diario.html", destination: "/diario" },
      { source: "/declaracoes.html", destination: "/declaracoes" },
      { source: "/historias.html", destination: "/historias" },
      { source: "/desenho.html", destination: "/desenhos" },
      { source: "/desenhos.html", destination: "/desenhos" },
      { source: "/memoria.html", destination: "/memoria" },
      { source: "/recordacao1ano.html", destination: "/recordacao-1-ano" },
      { source: "/recordacao-1-ano.html", destination: "/recordacao-1-ano" },
    ];
  },
};

export default nextConfig;
