/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permet l'intégration dans iframe (pour Framer uniquement)
  async headers() {
    return [
      {
        // Apply CSP ONLY to /booking route (including /booking?embed=1)
        source: '/booking/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://framer.app https://*.framer.app;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

