import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), "VITE_"), ...process.env };
  for (const [key, value] of Object.entries(env)) {
    if (!key.startsWith("VITE_") || typeof value !== "string") continue;
    if (/SERVICE_ROLE|SECRET|PRIVATE|ACCESS_TOKEN|RESEND_API_KEY/.test(key))
      throw new Error("Private credentials must not use the VITE_ prefix");
    if (value.startsWith("sb_secret_"))
      throw new Error(
        "Secret Supabase keys cannot be bundled into the browser",
      );
    if (value.startsWith("eyJ")) {
      let claims: any;
      try {
        claims = JSON.parse(
          Buffer.from(value.split(".")[1], "base64url").toString(),
        );
      } catch {}
      if (claims?.role === "service_role")
        throw new Error(
          "Supabase service role cannot be bundled into the browser",
        );
    }
  }
  return {
    plugins: [tailwindcss(), reactRouter()],
    resolve: {
      tsconfigPaths: true,
    },
  };
});
