/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Genera un servidor autocontenido para facilitar el empaquetado en Docker (Fase 5)
  output: 'standalone',
};

export default nextConfig;
