/** Projeto próprio da Videira. */
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
