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
            value: "frame-ancestors 'self' https://*.framer.app https://framer.app",
          },
          // Do NOT set X-Frame-Options - CSP frame-ancestors takes precedence
          // Removing X-Frame-Options to avoid conflicts
        ],
      },
    ];
  },
};

module.exports = nextConfig;

