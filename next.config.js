/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permet l'intégration dans iframe (pour Framer)
  async headers() {
    return [
      {
        // Page /booking accessible depuis n'importe quel iframe (pour Framer)
        source: '/booking/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors *",
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
        ],
      },
      {
        // Page /book aussi accessible en iframe (pour le flow complet)
        source: '/book/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors *",
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

