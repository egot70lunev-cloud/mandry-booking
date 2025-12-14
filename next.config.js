/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permet l'intégration dans iframe (pour Framer uniquement)
  async headers() {
    // CSP value for Framer embedding (editor + preview + published sites)
    // Includes all Framer embed origins
    const cspValue = "frame-ancestors 'self' https://framer.app https://*.framer.app https://framer.com https://*.framer.com https://*.framer.website https://framerusercontent.com https://*.framerusercontent.com;";
    
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
      {
        // Apply CSP globally to all other routes
        source: '/:path*',
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

