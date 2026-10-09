import { Link } from "react-router";
import type { GrowthProgram } from "~/lib/programs";
import { requestUrl } from "~/lib/programs";

export function ProgramOutline({ program }: { program: GrowthProgram }) {
  return <article className="program-outline">
    <div className="program-actions no-print"><Link className="program-button secondary" to={`/programs/${program.slug}`}>กลับหน้าหลักสูตร</Link><button className="program-button" onClick={() => window.print()}>พิมพ์ / บันทึก PDF</button></div>
    <span className="program-eyebrow">COURSE DESIGN OUTLINE · กรอบสำหรับหารือ</span>
    <h1>{program.title}</h1><p>{program.description}</p>
    <p className="program-note">กรอบหลักสูตรเบื้องต้น ไม่ใช่ใบเสนอราคาที่ยืนยันแล้ว ทีมงานจะปรับตามบริบทองค์กรก่อนตกลงขอบเขต ระยะเวลา และงบประมาณ</p>
    <h2>1. กลุ่มเป้าหมายและโจทย์</h2><p>{program.audience}</p><ul>{program.pains.map(item => <li key={item}>{item}</li>)}</ul>
    <h2>2. วัตถุประสงค์การเรียนรู้</h2><ul>{program.objectives.map(item => <li key={item}>{item}</li>)}</ul>
    <h2>3. กระบวนการและผลงานจากการเรียนรู้</h2>
    {program.modules.map((module, i) => <section key={module.title} className="outline-module"><h3>{i + 1}. {module.title}</h3><p>{module.activity}</p><p><strong>ผลงาน:</strong> {module.output}</p></section>)}
    <h2>4. รูปแบบและระยะเวลา</h2><p>{program.duration}</p><p>ใช้การเรียนรู้จากประสบการณ์ การสะท้อนคิด การฝึกบทสนทนา และโจทย์จริงขององค์กร โดยปรับสัดส่วนกิจกรรมให้เหมาะกับผู้เรียน</p>
    <h2>5. สิ่งส่งมอบและการติดตามผล</h2><ul>{program.deliverables.map(item => <li key={item}>{item}</li>)}</ul><ul>{program.measures.map(item => <li key={item}>{item}</li>)}</ul>
    <h2>6. รายการที่ต้องยืนยันใน Proposal ขององค์กร</h2><p>บริบทและเป้าหมาย กลุ่มผู้เรียน จำนวนคน ตารางกิจกรรม รูปแบบ/สถานที่ ทีมวิทยากร สิ่งส่งมอบ เกณฑ์ประเมิน งบประมาณ ภาษี ค่าเดินทาง และเงื่อนไขการดำเนินงาน</p>
    <p>ตัวชี้วัดและผลลัพธ์เป็นเป้าหมายที่ต้องร่วมกำหนด การเปลี่ยนแปลงต่อเนื่องขึ้นกับการนำไปใช้และการสนับสนุนจากองค์กร</p>
    <Link className="program-button no-print" to={requestUrl(program.slug)}>ขอ Proposal สำหรับองค์กรของคุณ</Link>
  </article>;
}
