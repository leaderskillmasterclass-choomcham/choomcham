import { authorize, json } from "./lib/admin-auth";
export async function onRequest(context: {
  request: Request;
  next: () => Promise<Response>;
  env: any;
}) {
  const { request, env } = context,
    path = new URL(request.url).pathname;
  if (path.startsWith("/api/")) {
    if (
      request.headers.get("Origin") &&
      request.headers.get("Origin") !== new URL(request.url).origin
    )
      return json({ error: "ไม่อนุญาตคำขอจากเว็บไซต์อื่น" }, 403);
    if (request.method === "OPTIONS")
      return new Response(null, { status: 204 });
    const publicRequest =
      path === "/api/lead" ||
      path === "/api/program-proposal" ||
      (path === "/api/r2" && request.method === "GET");
    if (!publicRequest) {
      const auth = await authorize(request, env);
      if (auth.response) return auth.response;
      if (
        (path === "/api/users" ||
          request.method === "DELETE" ||
          path === "/api/partners") &&
        auth.role !== "SUPERADMIN"
      )
        return json({ error: "ต้องใช้สิทธิ์ Super Admin" }, 403);
    }
  }
  const original = await context.next();
  const response = new Response(original.body, original);
  response.headers.delete("Access-Control-Allow-Origin");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  if (path.startsWith("/admin") || path.startsWith("/api/")) {
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}
