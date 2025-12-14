/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permet l'intégration dans iframe (pour Framer uniquement)
  async headers() {
    // CSP value for Framer embedding
    const cspFrameAncestors = "frame-ancestors 'self' https://*.framer.app https://framer.app https://*.framer.com https://framer.com";
    
    return [
      {
        // Specific rule for /book routes (including /book?embed=1)
        source: '/book/:path*',
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

