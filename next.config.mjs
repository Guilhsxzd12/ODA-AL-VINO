/** Projeto próprio da Videira. Mantém apenas as fontes do design de referência via origem. */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/oda/Fonts/:path*',
        destination: 'https://www.odaalvino.com.br/oda/Fonts/:path*',
      },
    ];
  },
};
export default nextConfig;
