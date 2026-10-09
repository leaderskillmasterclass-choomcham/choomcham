import { getProgram } from "./programs";

export const DELIVERY_FORMATS = ["onsite", "online", "hybrid", "undecided"] as const;
export const FORMAT_LABELS: Record<string, string> = { onsite: "ออนไซต์", online: "ออนไลน์", hybrid: "ไฮบริด", undecided: "ให้ทีมงานแนะนำ" };
export const DURATION_OPTIONS = ["ให้ทีมงานแนะนำ", "ครึ่งวัน", "1 วัน", "2 วัน", "หลายช่วง / Learning Journey"];
export interface ProposalBrief {
  program_slug: string; name: string; company: string; position: string; email: string; phone: string;
  participants: number; audience: string; challenge: string; outcomes: string; format: string;
  duration: string; timeline: string; location: string; budget: string; consent: boolean; website: string;
}
export function validateProposalBrief(input: unknown): { brief: ProposalBrief; errors: Record<string, string> } {
  const value = input && typeof input === "object" && !Array.isArray(input) ? input as Record<string, unknown> : {};
  const errors: Record<string, string> = {};
  const field = (key: string, max: number, required = false) => {
    const raw = value[key]; const text = typeof raw === "string" ? raw.trim() : "";
    if (required && !text) errors[key] = "กรุณากรอกข้อมูลนี้";
    if (text.length > max) errors[key] = `กรุณาใช้ไม่เกิน ${max} ตัวอักษร`;
    return text;
  };
  const program_slug = field("program_slug", 80, true);
  if (!getProgram(program_slug)) errors.program_slug = "กรุณาเลือกหลักสูตรที่มีในรายการ";
  const name = field("name", 120, true), company = field("company", 200, true);
  const email = field("email", 254, true);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "กรุณาระบุอีเมลที่ติดต่อได้";
  const rawParticipants = value.participants;
  const participants = typeof rawParticipants === "number" || typeof rawParticipants === "string" ? Number(rawParticipants) : NaN;
  if (!Number.isInteger(participants) || participants < 1 || participants > 10000) errors.participants = "ระบุจำนวนเต็มระหว่าง 1–10,000 คน";
  const audience = field("audience", 500, true), challenge = field("challenge", 2000, true), outcomes = field("outcomes", 2000, true);
  const format = field("format", 30, true), duration = field("duration", 80, true);
  if (!DELIVERY_FORMATS.includes(format as typeof DELIVERY_FORMATS[number])) errors.format = "กรุณาเลือกรูปแบบจัดอบรม";
  if (!DURATION_OPTIONS.includes(duration)) errors.duration = "กรุณาเลือกระยะเวลาจากรายการ";
  const consent = value.consent === true || value.consent === "on";
  if (!consent) errors.consent = "กรุณายินยอมให้ใช้ข้อมูลเพื่อติดต่อเรื่องข้อเสนอ";
  return { brief: { program_slug, name, company, email, participants, audience, challenge, outcomes, format, duration, consent,
    position: field("position", 120), phone: field("phone", 40), timeline: field("timeline", 200), location: field("location", 200), budget: field("budget", 200), website: field("website", 200) }, errors };
}

export function proposalLead(brief: ProposalBrief, submittedAt: string) {
  const program = getProgram(brief.program_slug)!;
  return {
    name: brief.name, company: brief.company, position: brief.position, email_or_line: brief.email,
    team_size: `${brief.participants} คน`, score: 0, result_level: "PROPOSAL_REQUEST", answers: [], status: "NEW",
    dimensions_scores: {
      form_type: "proposal_request", schema_version: 1, program_slug: program.slug, program_interest: `${program.code} — ${program.title}`,
      source_page: `/programs/${program.slug}`, timeline: brief.timeline,
      details: `โจทย์: ${brief.challenge}\nผลลัพธ์: ${brief.outcomes}`,
      proposal_brief: { ...brief, website: undefined, consent_recorded_at: submittedAt },
    },
  };
}
