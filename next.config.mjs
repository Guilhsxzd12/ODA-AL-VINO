/** Proxy temporário para reproduzir exatamente o pacote baixado do site no ambiente testevino. */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          destination: 'https://wwwodaalvinocom.vercel.app/:path*',
        },
      ],
    };
  },
};
export default nextConfig;
