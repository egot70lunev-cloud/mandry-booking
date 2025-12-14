/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permet l'intégration dans iframe (pour Framer uniquement)
  async headers() {
    return [
      {
        // Apply to ALL routes (pages and API)
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            // Allow framing from self and Framer domains (including preview subdomains)
            value: "frame-ancestors 'self' https://*.framer.app https://*.framer.website",
          },
          // X-Frame-Options is NOT set - CSP frame-ancestors takes precedence
        ],
      },
    ];
  },
};

module.exports = nextConfig;

