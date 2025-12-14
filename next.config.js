/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permet l'intégration dans iframe (pour Framer uniquement)
  async headers() {
    // CSP value for Framer embedding - ONLY framer.app domains
    const cspFrameAncestors = "frame-ancestors 'self' https://framer.app https://*.framer.app";
    
    return [
      {
        // Specific rule for /booking route (including /booking?embed=1)
        // This must come BEFORE the general rule to ensure priority
        source: '/booking/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspFrameAncestors,
          },
        ],
      },
      {
        // Apply to ALL other routes (pages and API)
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspFrameAncestors,
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

