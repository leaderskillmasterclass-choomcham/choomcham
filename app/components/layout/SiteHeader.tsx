import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [
  ["#clients", "ลูกค้าที่ไว้วางใจ"],
  ["#levels", "แนวทางพัฒนา"],
  ["#programs", "โปรแกรม"],
  ["#experience", "ประสบการณ์"],
  ["#faq", "คำถามที่พบบ่อย"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a href="#authentic-org" className="site-brand" aria-label="บ้านชุ่มฉ่ำ หน้าหลัก">
          <img src="/chumcham.png" alt="" width="42" height="42" />
          <span>CHOO<span className="text-brand-pink">M</span>CHAM<small>HOUSE · บ้านชุ่มฉ่ำ</small></span>
        </a>
        <nav className="site-desktop-nav" aria-label="เมนูหลัก">
          {links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <a href="#contact" className="site-header-cta">คุยกับชุ่มฉ่ำ <ArrowUpRight size={16} /></a>
        <button className="site-menu-toggle" type="button" aria-label={open ? "ปิดเมนู" : "เปิดเมนู"} aria-expanded={open} aria-controls="site-mobile-nav" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && <nav id="site-mobile-nav" className="site-mobile-nav" aria-label="เมนูมือถือ">
        {links.map(([href, label]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}<ArrowUpRight size={16} /></a>)}
        <a href="#zombie-check" onClick={() => setOpen(false)}>เช็กพลังขององค์กร<ArrowUpRight size={16} /></a>
        <a href="#contact" onClick={() => setOpen(false)}>คุยกับ Choomcham House<ArrowUpRight size={16} /></a>
      </nav>}
    </header>
  );
}
