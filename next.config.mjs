/** Espelha o site oficial ODA AL VINO no ambiente de teste. */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          destination: 'https://www.odaalvino.com.br/:path*',
        },
      ],
    };
  },
};
export default nextConfig;
