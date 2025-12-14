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
        ],
      },
    ];
  },
};

module.exports = nextConfig;

