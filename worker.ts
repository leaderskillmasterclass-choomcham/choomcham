// @ts-nocheck
import { createRequestHandler } from "@react-router/node";

export default {
  async fetch(request: Request, env: any, ctx: any) {
    // Cloudflare Pages / Worker fetch handler adapter
    return new Response("Choomcham Platform Edge Ready", { status: 200 });
  },
};
