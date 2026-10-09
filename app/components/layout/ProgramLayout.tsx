import { Link } from "react-router";
import type { ReactNode } from "react";

export function ProgramLayout({ children }: { children: ReactNode }) {
  return <div className="program-site">
    <a className="program-skip" href="#program-main">ข้ามไปเนื้อหา</a>
    <header className="program-header">
      <Link to="/" className="program-brand"><img src="/chumcham.png" width="40" height="40" alt="" /><span>CHOOMCHAM<small>HOUSE · เกิดใหม่จากข้างใน</small></span></Link>
      <nav aria-label="เมนูหลักสูตร"><Link to="/programs">ทุกโปรแกรม</Link><Link to="/#zombie-check">เช็กพลังองค์กร</Link></nav>
    </header>
    <main id="program-main">{children}</main>
    <footer className="program-footer"><strong>ตัวจริงต้องมีที่ยืน</strong><p>จากการเข้าใจคน สู่การเติบโตขององค์กร</p><Link to="/#contact">คุยกับ Choomcham House</Link></footer>
  </div>;
}
