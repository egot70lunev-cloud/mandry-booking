/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permet l'intégration dans iframe (pour Framer uniquement)
  async headers() {
    const cspValue = "frame-ancestors 'self' https://framer.app https://*.framer.app;";
    
    return [
      {
        // Apply CSP to /booking route (exact match)
        source: '/booking',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspValue,
          },
        ],
      },
      {
        // Apply CSP to /booking/:path* (including /booking?embed=1)
        source: '/booking/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspValue,
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

