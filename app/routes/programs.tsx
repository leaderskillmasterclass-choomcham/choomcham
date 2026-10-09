import { Link } from "react-router";
import { ProgramLayout } from "~/components/layout/ProgramLayout";
import { GROWTH_PROGRAMS, programUrl, requestUrl } from "~/lib/programs";

export function meta() { return [{ title: "5 Levels of Growth และหลักสูตรเรือธง | CHOOMCHAM HOUSE" }, { name: "description", content: "เลือกเส้นทางพัฒนาคน การสื่อสาร ทีม ผู้นำ และวัฒนธรรมองค์กร พร้อมขอ Proposal ที่ตรงโจทย์องค์กร" }, { tagName: "link", rel: "canonical", href: "https://choomcham.pages.dev/programs" }]; }
export default function Programs() {
  const flagship = GROWTH_PROGRAMS[5];
  return <ProgramLayout><section className="program-intro program-container"><span className="program-eyebrow">5 LEVELS OF GROWTH</span><h1>5 ระดับ สู่<br />“องค์กรตัวจริง”</h1><p className="program-lead">จากเข้าใจตัวเอง สื่อสารเป็น สร้างทีมเป็น นำคนเป็น จนกลายเป็นวัฒนธรรมองค์กรที่มั่นคง</p><p>เลือกจุดเริ่มต้นจากโจทย์ขององค์กร หรือเชื่อมหลายระดับเป็น Learning Journey เดียวกัน</p></section>
    <section className="program-container program-catalog" aria-label="หลักสูตรทั้ง 5 ระดับ">{GROWTH_PROGRAMS.slice(0, 5).map(program => <article key={program.slug} className="program-card"><span className="program-eyebrow" style={{ color: program.accent }}>{program.level} · {program.code}</span><h2>{program.title}</h2><p>{program.description}</p><div className="program-actions"><Link className="program-text-link" to={programUrl(program.slug)}>ดูรายละเอียดหลักสูตร →</Link><Link className="program-text-link" to={requestUrl(program.slug)}>ขอ Proposal →</Link></div></article>)}</section>
    <section className="program-container"><article className="program-flagship"><span className="program-eyebrow">🧟 → ✨ FLAGSHIP TRANSFORMATION PROGRAM</span><h2>{flagship.title}</h2><p>{flagship.description}</p><Link className="program-button" to={programUrl(flagship.slug)}>สำรวจหลักสูตรเรือธง →</Link></article></section>
  </ProgramLayout>;
}
