/** Projeto próprio da Videira. */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/oda/Fonts/:path*',
        destination: 'https://www.odaalvino.com.br/oda/Fonts/:path*',
      },
      {
        source: '/vinho/:slug',
        destination: '/vinho?slug=:slug',
      },
      {
        source: '/politicas/:slug',
        destination: '/politicas?slug=:slug',
      },
    ];
  },
};
export default nextConfig;
