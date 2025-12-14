/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permet l'intégration dans iframe (pour Framer uniquement)
  async headers() {
    // CSP value for Framer embedding (editor + published sites)
    const cspValue = "frame-ancestors 'self' https://framer.app https://*.framer.app https://framer.com https://*.framer.com;";
    
    return [
      {
        // Apply CSP globally to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspValue,
          },
          // X-Frame-Options is NOT set - CSP frame-ancestors takes precedence
        ],
      },
    ];
  },
};

module.exports = nextConfig;

