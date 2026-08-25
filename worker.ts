import { createRequestHandler } from "@react-router/cloudflare";
import * as build from "./build/server";

const requestHandler = createRequestHandler(build);

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return requestHandler(request, { cloudflare: { env, ctx } });
  },
} satisfies ExportedHandler<Env>;
