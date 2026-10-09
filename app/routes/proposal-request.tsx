import { Link, useFetcher, useSearchParams } from "react-router";
import { useEffect, useRef } from "react";
import type { Route } from "./+types/proposal-request";
import { ProgramLayout } from "~/components/layout/ProgramLayout";
import { GROWTH_PROGRAMS, getProgram } from "~/lib/programs";
import { DELIVERY_FORMATS, DURATION_OPTIONS, FORMAT_LABELS, validateProposalBrief } from "~/lib/proposal-request";

export function meta() { return [{ title: "ขอ Proposal หลักสูตรสำหรับองค์กร | CHOOMCHAM HOUSE" }, { name: "robots", content: "noindex" }]; }
export async function clientAction({ request }: Route.ClientActionArgs) {
  const values = Object.fromEntries(await request.formData());
  const { brief, errors } = validateProposalBrief(values);
  if (Object.keys(errors).length) return { success: false, error: "กรุณาตรวจสอบข้อมูลในแบบฟอร์ม", errors, requestId: "" };
  try {
    const response = await fetch("/api/program-proposal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(brief) });
    const data = await response.json();
    if (!response.ok || !data.success || typeof data.request_id !== "string" || !data.request_id || data.request_id.startsWith("edge-")) return { success: false, error: data.error || "ยังบันทึกคำขอไม่สำเร็จ กรุณาลองใหม่", errors: data.errors || {}, requestId: "" };
    return { success: true, error: "", errors: {}, requestId: data.request_id as string };
  } catch { return { success: false, error: "เชื่อมต่อระบบไม่สำเร็จ กรุณาลองใหม่ ข้อมูลในแบบฟอร์มยังอยู่", errors: {}, requestId: "" }; }
}
export default function ProposalRequest() {
  const [params] = useSearchParams(); const initialProgram = getProgram(params.get("program"));
  const fetcher = useFetcher<typeof clientAction>(); const busy = fetcher.state !== "idle";
  const status = useRef<HTMLDivElement>(null);
  useEffect(() => { if (fetcher.state === "idle" && fetcher.data) status.current?.focus(); }, [fetcher.data, fetcher.state]);
  const errorFor = (name: string) => fetcher.data?.errors?.[name];
  const label = (name: string, title: string, required = false) => <label htmlFor={`brief-${name}`}>{title}{required ? " *" : " (ไม่บังคับ)"}</label>;
  const error = (name: string) => errorFor(name) ? <small className="program-field-error" id={`error-${name}`}>{errorFor(name)}</small> : null;
  const attrs = (name: string) => ({ id: `brief-${name}`, name, "aria-invalid": !!errorFor(name), "aria-describedby": errorFor(name) ? `error-${name}` : undefined });
  return <ProgramLayout><div className="program-container program-section"><Link className="program-text-link" to={initialProgram ? `/programs/${initialProgram.slug}` : "/programs"}>← กลับไปดูหลักสูตร</Link><span className="program-eyebrow">LET’S DESIGN YOUR LEARNING JOURNEY</span><h1>ขอ Proposal<br />สำหรับองค์กรของคุณ</h1><p className="program-lead">เล่าโจทย์ที่อยากเปลี่ยน แล้วเราจะช่วยวางเส้นทางการเรียนรู้</p>
    <div className="program-request-grid"><aside className="program-request-aside"><h2>จากคำขอ สู่ข้อเสนอที่ตรงโจทย์</h2><ol><li>ส่งบริบทและความต้องการเบื้องต้น</li><li>ทีมงานติดต่อเพื่อยืนยันโจทย์และผลลัพธ์</li><li>ออกแบบกิจกรรม สิ่งส่งมอบ และวิธีวัดผล</li><li>นำเสนอขอบเขต ระยะเวลา และงบประมาณเพื่อพิจารณา</li></ol><p className="program-note">การส่งคำขอไม่มีค่าใช้จ่าย และยังไม่ใช่การจองอบรมหรือยืนยันราคา</p><Link className="program-text-link" to="/#contact">ช่องทางติดต่อทีมงาน →</Link></aside>
    <div>{fetcher.data && <div ref={status} tabIndex={-1} role={fetcher.data.success ? "status" : "alert"} className={`program-form-status ${fetcher.data.success ? "success" : "error"}`}><h2>{fetcher.data.success ? "ได้รับคำขอ Proposal แล้ว" : "ยังส่งคำขอไม่สำเร็จ"}</h2><p>{fetcher.data.success ? "ทีมงานจะใช้ข้อมูลนี้พูดคุยกับคุณผ่านช่องทางที่แจ้งไว้ เพื่อยืนยันโจทย์ก่อนจัดทำข้อเสนอ" : fetcher.data.error}</p>{fetcher.data.success && <><p>เลขอ้างอิง: {fetcher.data.requestId}</p><Link to="/programs" className="program-text-link">กลับไปดูทุกโปรแกรม →</Link></>}</div>}
    {!fetcher.data?.success && <fetcher.Form key={params.get("program") || ""} method="post" className="program-brief-form">
      <p>ช่องที่มี * จำเป็นสำหรับการติดต่อและออกแบบข้อเสนอ</p>
      <fieldset disabled={busy}><legend>01 · หลักสูตรและโจทย์องค์กร</legend>
        <div>{label("program_slug", "หลักสูตรที่สนใจ", true)}<select {...attrs("program_slug")} required defaultValue={initialProgram?.slug || ""}><option value="" disabled>เลือกหลักสูตร</option>{GROWTH_PROGRAMS.map(p => <option key={p.slug} value={p.slug}>{p.level} · {p.title}</option>)}</select>{error("program_slug")}</div>
        <div>{label("challenge", "ปัญหาหรือสถานการณ์ที่ต้องการพัฒนา", true)}<textarea {...attrs("challenge")} required maxLength={2000} rows={4} placeholder="เช่น ทีมข้ามแผนกส่งต่องานไม่ชัดเจน คนไม่กล้าพูดปัญหา" />{error("challenge")}</div>
        <div>{label("outcomes", "หลังอบรม อยากเห็นอะไรเปลี่ยนในงานจริง?", true)}<textarea {...attrs("outcomes")} required maxLength={2000} rows={3} placeholder="เช่น มีข้อตกลงการทำงานร่วมกัน และหัวหน้าให้ Feedback ได้ชัดเจน" />{error("outcomes")}</div>
      </fieldset>
      <fieldset disabled={busy}><legend>02 · กลุ่มผู้เรียนและรูปแบบ</legend>
        <div>{label("audience", "กลุ่มผู้เรียน / ระดับตำแหน่ง", true)}<input {...attrs("audience")} required maxLength={500} placeholder="เช่น หัวหน้างานและทีมปฏิบัติการ 3 แผนก" />{error("audience")}</div>
        <div className="program-two"><div>{label("participants", "จำนวนผู้เรียนโดยประมาณ (คน)", true)}<input {...attrs("participants")} type="number" min={1} max={10000} step={1} required />{error("participants")}</div><div>{label("format", "รูปแบบจัดอบรม", true)}<select {...attrs("format")} defaultValue="undecided">{DELIVERY_FORMATS.map(value => <option key={value} value={value}>{FORMAT_LABELS[value]}</option>)}</select>{error("format")}</div></div>
        <div className="program-two"><div>{label("duration", "ระยะเวลาที่สะดวก", true)}<select {...attrs("duration")} defaultValue={DURATION_OPTIONS[0]}>{DURATION_OPTIONS.map(value => <option key={value}>{value}</option>)}</select>{error("duration")}</div><div>{label("timeline", "ช่วงเวลาที่คาดว่าจะจัด")}<input {...attrs("timeline")} maxLength={200} placeholder="เช่น ไตรมาส 1 / ยังไม่กำหนด" />{error("timeline")}</div></div>
        <div className="program-two"><div>{label("location", "สถานที่ / จังหวัด")}<input {...attrs("location")} maxLength={200} />{error("location")}</div><div>{label("budget", "กรอบงบประมาณ")}<input {...attrs("budget")} maxLength={200} placeholder="ระบุช่วงงบ หรือให้ทีมงานแนะนำ" />{error("budget")}</div></div>
      </fieldset>
      <fieldset disabled={busy}><legend>03 · ผู้ประสานงาน</legend>
        <div className="program-two"><div>{label("name", "ชื่อผู้ติดต่อ", true)}<input {...attrs("name")} required maxLength={120} autoComplete="name" />{error("name")}</div><div>{label("company", "องค์กร / บริษัท", true)}<input {...attrs("company")} required maxLength={200} autoComplete="organization" />{error("company")}</div></div>
        <div>{label("position", "ตำแหน่ง")}<input {...attrs("position")} maxLength={120} autoComplete="organization-title" />{error("position")}</div>
        <div className="program-two"><div>{label("email", "อีเมลสำหรับติดต่อกลับ", true)}<input {...attrs("email")} type="email" required maxLength={254} autoComplete="email" />{error("email")}</div><div>{label("phone", "โทรศัพท์")}<input {...attrs("phone")} type="tel" maxLength={40} autoComplete="tel" />{error("phone")}</div></div>
        <div className="program-honeypot" aria-hidden="true"><label htmlFor="brief-website">Website</label><input id="brief-website" name="website" tabIndex={-1} autoComplete="off" /></div>
        <label className="program-consent"><input {...attrs("consent")} type="checkbox" required /><span>ยินยอมให้ทีมชุ่มฉ่ำใช้ข้อมูลที่ส่งเพื่อติดต่อ วิเคราะห์ความต้องการ และจัดทำข้อเสนอหลักสูตรนี้ *</span></label>{error("consent")}
        <p className="program-note">กรุณาระบุบริบทโดยไม่ใส่ข้อมูลส่วนบุคคลของพนักงานรายอื่น</p>
      </fieldset>
      <button className="program-button" type="submit" disabled={busy}>{busy ? "กำลังบันทึกคำขอ…" : "ส่งคำขอ Proposal"}</button><p className="program-note">ทีมงานจะยืนยันรายละเอียดก่อนเสนอราคา ไม่มีการสร้างใบเสนอราคาหรือส่งอีเมลอัตโนมัติจากแบบฟอร์มนี้</p>
    </fetcher.Form>}</div></div>
  </div></ProgramLayout>;
}
