import type { Config } from "@react-router/dev/config";
import { GROWTH_PROGRAMS } from "./app/lib/programs";

export default {
  ssr: false,
  prerender: ["/programs", ...GROWTH_PROGRAMS.map(program => `/programs/${program.slug}`)],
} satisfies Config;
