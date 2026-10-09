import { getProgram } from "./programs";

export type DesignStatus = "DRAFT" | "REVIEW" | "APPROVED";
export interface CourseDesign {
  schemaVersion: 1; title: string; programSlug: string; leadId: string;
  organization: string; audience: string; participants: number; challenge: string; businessGoal: string;
  format: string; location: string; timeline: string; availableMinutes: number; budgetExpectation: string; constraints: string;
  objectives: { id: string; behavior: string; evidence: string }[];
  modules: { id: string; title: string; minutes: number; objectiveIds: string[]; activity: string; output: string }[];
  evaluation: { baseline: string; after: string; followUp: string; owner: string };
  deliverables: string; organizationSupport: string; scope: string; investment: string; notes: string;
}
export interface DesignRecord { id: string; version: number; status: DesignStatus; document: CourseDesign; updated_at: string; updated_by?: string }
export interface ProposalLead { id: string; company: string; name?: string; team_size?: string; dimensions_scores?: { program_slug?: string; proposal_brief?: Record<string, unknown> } }
export const designMinutes = (design: CourseDesign) => design.modules.reduce((sum, module) => sum + module.minutes, 0);
export function newCourseDesign(slug = "reborn", lead?: ProposalLead): CourseDesign {
  const program = getProgram(slug) || getProgram("reborn")!;
  const brief = lead?.dimensions_scores?.proposal_brief || {};
  const text = (key: string) => typeof brief[key] === "string" ? brief[key] as string : "";
  const objectives = program.objectives.map((behavior, index) => ({ id: `o${index + 1}`, behavior, evidence: "" }));
  const modules = program.modules.map((module, index) => ({ id: `m${index + 1}`, title: module.title, minutes: program.level === "FLAGSHIP" ? 90 : 120, objectiveIds: [objectives[Math.min(index, objectives.length - 1)].id], activity: module.activity, output: module.output }));
  return { schemaVersion: 1, title: program.title, programSlug: program.slug, leadId: lead?.id || "", organization: lead?.company || "", audience: text("audience") || program.audience,
    participants: typeof brief.participants === "number" ? brief.participants : 0, challenge: text("challenge"), businessGoal: text("outcomes"), format: text("format") || "undecided", location: text("location"), timeline: text("timeline"), availableMinutes: modules.reduce((sum, item) => sum + item.minutes, 0),
    budgetExpectation: text("budget"), constraints: text("duration") ? `ระยะเวลาที่องค์กรแจ้ง: ${text("duration")}` : "", objectives, modules, evaluation: { baseline: "", after: "", followUp: "", owner: "" }, deliverables: program.deliverables.join("\n"), organizationSupport: "", scope: "", investment: "", notes: "ระยะเวลาและกิจกรรมเป็นต้นแบบสำหรับปรับร่วมกับองค์กร ยังไม่ใช่ขอบเขตที่ยืนยันแล้ว" };
}

// Validate imported/browser/server documents before they can be saved or rendered.
export function parseCourseDesign(input: unknown): CourseDesign | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const value = input as CourseDesign;
  const strings = ["title", "programSlug", "leadId", "organization", "audience", "challenge", "businessGoal", "format", "location", "timeline", "budgetExpectation", "constraints", "deliverables", "organizationSupport", "scope", "investment", "notes"] as const;
  if (value.schemaVersion !== 1 || !getProgram(value.programSlug) || strings.some(key => typeof value[key] !== "string" || value[key].length > 6000)) return null;
  if (!Number.isInteger(value.participants) || value.participants < 0 || value.participants > 10000 || !Number.isInteger(value.availableMinutes) || value.availableMinutes < 0 || value.availableMinutes > 100000) return null;
  if (!["onsite", "online", "hybrid", "undecided"].includes(value.format)) return null;
  const str = (v: unknown, max = 6000) => typeof v === "string" && v.length <= max;
  if (!Array.isArray(value.objectives) || value.objectives.length > 30 || value.objectives.some(o => !o || !str(o.id, 80) || !o.id || !str(o.behavior) || !str(o.evidence))) return null;
  const ids = new Set(value.objectives.map(o => o.id));
  if (ids.size !== value.objectives.length) return null;
  if (!Array.isArray(value.modules) || value.modules.length > 50 || value.modules.some(m => !m || !str(m.id, 80) || !m.id || !str(m.title) || !str(m.activity) || !str(m.output) || !Number.isInteger(m.minutes) || m.minutes < 0 || m.minutes > 10000 || !Array.isArray(m.objectiveIds) || m.objectiveIds.length > 30 || new Set(m.objectiveIds).size !== m.objectiveIds.length || m.objectiveIds.some(id => !ids.has(id)))) return null;
  if (new Set(value.modules.map(m => m.id)).size !== value.modules.length) return null;
  if (!value.evaluation || ["baseline", "after", "followUp", "owner"].some(key => !str(value.evaluation[key as keyof CourseDesign["evaluation"]]))) return null;
  // Whitelist properties to avoid carrying arbitrary import metadata into team storage.
  return { schemaVersion: 1, ...Object.fromEntries(strings.map(key => [key, value[key]])), participants: value.participants, availableMinutes: value.availableMinutes,
    objectives: value.objectives.map(({ id, behavior, evidence }) => ({ id, behavior, evidence })), modules: value.modules.map(({ id, title, minutes, objectiveIds, activity, output }) => ({ id, title, minutes, objectiveIds: [...objectiveIds], activity, output })), evaluation: { baseline: value.evaluation.baseline, after: value.evaluation.after, followUp: value.evaluation.followUp, owner: value.evaluation.owner } } as CourseDesign;
}
export function designReadiness(design: CourseDesign): string[] {
  const missing: string[] = [];
  const need = (value: string, label: string) => { if (!value.trim()) missing.push(label); };
  need(design.title, "ชื่อหลักสูตร"); need(design.organization, "องค์กร"); need(design.audience, "กลุ่มผู้เรียน"); need(design.challenge, "โจทย์องค์กร"); need(design.businessGoal, "ผลลัพธ์ในงานจริง");
  if (!design.participants) missing.push("จำนวนผู้เรียน");
  if (!design.objectives.length) missing.push("วัตถุประสงค์การเรียนรู้");
  design.objectives.forEach((objective, index) => { need(objective.behavior, `วัตถุประสงค์ ${index + 1}`); need(objective.evidence, `หลักฐานของวัตถุประสงค์ ${index + 1}`); if (!design.modules.some(module => module.objectiveIds.includes(objective.id))) missing.push(`กิจกรรมรองรับวัตถุประสงค์ ${index + 1}`); });
  if (!design.modules.length) missing.push("กิจกรรมการเรียนรู้");
  design.modules.forEach((module, index) => { need(module.title, `ชื่อกิจกรรม ${index + 1}`); need(module.activity, `กระบวนการกิจกรรม ${index + 1}`); need(module.output, `ผลงานกิจกรรม ${index + 1}`); if (!module.minutes) missing.push(`เวลากิจกรรม ${index + 1}`); if (!module.objectiveIds.length) missing.push(`วัตถุประสงค์ที่กิจกรรม ${index + 1} รองรับ`); });
  if (!design.availableMinutes || designMinutes(design) > design.availableMinutes) missing.push("เวลารวมต้องไม่เกินกรอบเวลาที่กำหนด");
  need(design.evaluation.baseline, "แผนประเมินก่อนเรียน"); need(design.evaluation.after, "แผนประเมินหลังเรียน"); need(design.evaluation.followUp, "การติดตามในงานจริง"); need(design.evaluation.owner, "ผู้รับผิดชอบติดตามผล"); need(design.deliverables, "สิ่งส่งมอบ"); need(design.organizationSupport, "สิ่งที่องค์กรต้องสนับสนุน"); need(design.scope, "ขอบเขตและเงื่อนไข"); need(design.investment, "งบประมาณหรือเงื่อนไขพิจารณาราคา");
  return missing;
}
