import { cloudflarePages } from "@react-router/cloudflare";
import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  preset: cloudflarePages(),
} satisfies Config;
