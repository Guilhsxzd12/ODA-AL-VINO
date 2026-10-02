/** Espelha o site oficial, mas preserva os arquivos locais personalizados do cabeçalho. */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path((?!videira-logo\\.svg|_next/static/chunks/0ig_z31a~duel\\.js).*)',
          destination: 'https://www.odaalvino.com.br/:path',
        },
      ],
    };
  },
};
export default nextConfig;
