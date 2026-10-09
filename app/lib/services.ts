import { getResultLevelInfo, calculateDimensionScores } from "./diagnostic";
import { adminFetch } from "./admin-api.client";
export async function fetchLeadsFromSupabase(context?: any) {
  const res = await adminFetch("/api/leads");
  const body = await res.json();
  body.data = (body.data || []).map((row: any) => {
    if (
      ["ALIVE", "TIRED", "FADED", "ZOMBIE"].includes(row.result_level) &&
      Array.isArray(row.answers) &&
      row.answers.length === 10 &&
      row.answers.every((v: any) => Number.isInteger(v) && v >= 1 && v <= 4)
    ) {
      const score = row.answers.reduce((sum: number, v: number) => sum + v, 0);
      return {
        ...row,
        score,
        result_level: getResultLevelInfo(score).level,
        dimensions_scores: calculateDimensionScores(row.answers),
      };
    }
    return row;
  });
  return body;
}
export async function updateLeadStatusInSupabase(
  context: any,
  id: string,
  status: string,
  notes?: string,
) {
  const res = await adminFetch("/api/leads", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status, notes }),
  });
  return await res.json();
}
export async function deleteLeadFromSupabase(context: any, id: string) {
  const res = await adminFetch(`/api/leads?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return await res.json();
}
// Poll only the authenticated server API; no broad realtime table subscription.
export function subscribeToLeadsRealtime(onPayload: (payload: any) => void) {
  const timer = setInterval(() => onPayload({ refresh: true }), 60000);
  return () => clearInterval(timer);
}
