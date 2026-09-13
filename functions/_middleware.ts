// Cloudflare Pages Functions Global Middleware (Edge Proxy Layer)
export async function onRequest(context: { request: Request; next: () => Promise<Response>; env: any }) {
  const { request, next } = context;

  // Handle CORS preflight for all edge endpoints
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // Execute request pipeline
  const response = await next();

  // Create new response with hardened edge security headers
  const newResponse = new Response(response.body, response);
  newResponse.headers.set("Access-Control-Allow-Origin", "*");
  newResponse.headers.set("X-Content-Type-Options", "nosniff");
  newResponse.headers.set("X-Frame-Options", "DENY");
  newResponse.headers.set("X-XSS-Protection", "1; mode=block");
  newResponse.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  newResponse.headers.set("X-Edge-Proxy", "Cloudflare-Choomcham-Gateway");

  return newResponse;
}
