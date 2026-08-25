// Quick test to verify Supabase anon key works
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read .env.local manually
const envPath = resolve(__dirname, "../.env.local");
const envContent = readFileSync(envPath, "utf8");
const envVars = {};
envContent.split("\n").forEach(line => {
  const [key, ...vals] = line.split("=");
  if (key && !key.startsWith("#")) {
    envVars[key.trim()] = vals.join("=").trim();
  }
});

const SUPABASE_URL = envVars["SUPABASE_URL"];
const SUPABASE_ANON_KEY = envVars["SUPABASE_ANON_KEY"];

console.log("Testing Supabase connection...");
console.log("URL:", SUPABASE_URL);
console.log("Key (first 30 chars):", SUPABASE_ANON_KEY?.slice(0, 30) + "...");

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test insert
const { data, error } = await supabase
  .from("leads")
  .insert([
    {
      name: "Test Script Lead",
      company: "CAP Vision Institute",
      position: "HR Director",
      email_or_line: "test-script@cap.co.th",
      team_size: "21-100 คน",
      score: 10,
      result_level: "ZOMBIE",
      answers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    }
  ])
  .select();

if (error) {
  console.error("❌ Insert failed:", error.message);
  console.error("Details:", error);
} else {
  console.log("✅ Insert SUCCESS! Lead saved:");
  console.log(JSON.stringify(data, null, 2));
}
