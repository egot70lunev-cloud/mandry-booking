import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Collect request headers
  const requestHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    requestHeaders[key] = value;
  });

  // Create response
  const response = NextResponse.json({
    timestamp: new Date().toISOString(),
    request: {
      url: request.url,
      method: request.method,
      headers: requestHeaders,
    },
    note: 'Check browser DevTools Network tab to see actual response headers. CSP and X-Frame-Options are set by next.config.js headers() function.',
  });

  // Add CORS headers for easier debugging
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  // Note: Response headers set by next.config.js will be visible in browser DevTools
  // We can't read them here because they're applied at the Next.js framework level

  return response;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
