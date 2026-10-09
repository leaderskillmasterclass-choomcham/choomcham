import type { CourseDesign, DesignStatus } from "~/lib/course-design";
import { designMinutes } from "~/lib/course-design";
import { FORMAT_LABELS } from "~/lib/proposal-request";

export function CoursePreview({ design, status }: { design: CourseDesign; status: DesignStatus }) {
  return <article className="course-preview">
    <p className="course-kicker">CHOOMCHAM HOUSE · องค์กรตัวจริง™</p><h1>{design.title || "หลักสูตรสำหรับองค์กร"}</h1>
    <p className="course-preview-status">{status === "APPROVED" ? "ผ่านตรวจภายใน" : status === "REVIEW" ? "รอตรวจภายใน" : "ร่างเพื่อหารือ"} · ต้องยืนยันขอบเขตและเงื่อนไขกับองค์กรก่อนดำเนินงาน</p>
    <h2>บริบทและเป้าหมาย</h2><p><strong>องค์กร:</strong> {design.organization || "รอยืนยัน"}</p><p>{design.challenge || "รอยืนยันโจทย์องค์กร"}</p><p><strong>ผลลัพธ์ที่ต้องการ:</strong> {design.businessGoal || "รอยืนยัน"}</p>
    <h2>กลุ่มผู้เรียนและรูปแบบ</h2><p>{design.audience} · {design.participants || "รอยืนยันจำนวน"} คน</p><p>{FORMAT_LABELS[design.format]} · {design.location || "รอยืนยันสถานที่"} · {design.timeline || "รอยืนยันช่วงเวลา"}</p><p>กิจกรรมรวม {designMinutes(design)} นาที / กรอบเวลาที่มี {design.availableMinutes} นาที</p>
    <h2>วัตถุประสงค์และหลักฐานการเรียนรู้</h2><ol>{design.objectives.map((o, i) => <li key={o.id}><strong>{i + 1}. {o.behavior}</strong><p>หลักฐาน: {o.evidence || "รอกำหนดเกณฑ์"}</p></li>)}</ol>
    <h2>แผนกิจกรรม</h2>{design.modules.map((module, i) => <section className="course-preview-module" key={module.id}><h3>{i + 1}. {module.title} · {module.minutes} นาที</h3><p>{module.activity}</p><p><strong>ผลงาน:</strong> {module.output}</p><small>รองรับวัตถุประสงค์: {module.objectiveIds.map(id => design.objectives.findIndex(o => o.id === id) + 1).join(", ") || "รอกำหนด"}</small></section>)}
    <h2>สิ่งส่งมอบ</h2><p>{design.deliverables}</p><h2>การประเมินและติดตาม</h2><p><strong>ก่อนเรียน:</strong> {design.evaluation.baseline || "รอกำหนด"}</p><p><strong>หลังเรียน:</strong> {design.evaluation.after || "รอกำหนด"}</p><p><strong>ติดตามในงานจริง:</strong> {design.evaluation.followUp || "รอกำหนด"}</p><p><strong>ผู้รับผิดชอบ:</strong> {design.evaluation.owner || "รอยืนยัน"}</p>
    <h2>ขอบเขตและการดำเนินงาน</h2><p>{design.scope || "รอยืนยันขอบเขต"}</p><p><strong>สิ่งที่องค์กรสนับสนุน:</strong> {design.organizationSupport || "รอยืนยัน"}</p><h2>งบประมาณและเงื่อนไข</h2><p>{design.investment || "รอประเมินตามขอบเขต ไม่ใช่ใบเสนอราคาที่ยืนยันแล้ว"}</p>{design.notes && <><h2>หมายเหตุ</h2><p>{design.notes}</p></>}
  </article>;
}
