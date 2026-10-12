import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
const mainLinks = [
  ["#pain", "สภาวะองค์กร"],
  ["#model", "กระบวนการ Reborn"],
  ["#levels", "5 ระดับการเติบโต"],
  ["#programs", "หลักสูตรองค์กร"],
  ["#work", "วิธีทำงาน"],
] as const;
const groups = [
  {
    title: "ตรวจสุขภาพองค์กร",
    links: [
      ["#hero", "เกิดใหม่จากข้างใน"],
      ["#zombie-signals", "สัญญาณองค์กรหมดไฟ"],
      ["#zombie-check", "แบบประเมิน Zombie Check™"],
      ["#pain", "ปัญหาที่องค์กรกำลังเผชิญ"],
    ],
  },
  {
    title: "กระบวนการและหลักสูตร",
    links: [
      ["#belief", "ความเชื่อของชุ่มฉ่ำ"],
      ["#model", "Reset → Recreate"],
      ["#authentic-org", "องค์กรตัวจริง™"],
      ["#levels", "5 ระดับการเติบโต"],
      ["#programs", "5 Levels + Flagship"],
      ["#experience", "ประสบการณ์การเรียนรู้"],
    ],
  },
  {
    title: "เกี่ยวกับชุ่มฉ่ำ",
    links: [
      ["#rebirth-house", "บ้านสำหรับการเกิดใหม่"],
      ["#why", "ทำไมต้อง Choomcham House"],
      ["#work", "จักรวาลชุ่มฉ่ำ"],
      ["#about", "เกี่ยวกับเรา"],
      ["#clients", "ลูกค้าที่ไว้วางใจ"],
      ["#faq", "คำถามที่พบบ่อย"],
    ],
  },
];
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a
          href="#hero"
          className="site-brand"
          aria-label="บ้านชุ่มฉ่ำ หน้าหลัก"
        >
          <img src="/chumcham.png" alt="" width="42" height="42" />
          <span>
            CHOO<span className="text-brand-pink">M</span>CHAM
            <small>HOUSE · บ้านชุ่มฉ่ำ</small>
          </span>
        </a>
        <nav className="site-desktop-nav" aria-label="เมนูหลัก">
          {mainLinks.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <a href="#contact" className="site-header-cta">
          คุยกับชุ่มฉ่ำ <ArrowUpRight size={16} />
        </a>
        <button
          className="site-menu-toggle"
          type="button"
          aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
          aria-expanded={open}
          aria-controls="site-mobile-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav
          id="site-mobile-nav"
          className="site-mobile-nav"
          aria-label="เมนูมือถือ"
        >
          {groups.map((group) => (
            <div className="site-nav-group" key={group.title}>
              <p>{group.title}</p>
              {group.links.map(([href, label]) => (
                <a key={href} href={href} onClick={() => setOpen(false)}>
                  {label}
                  <ArrowUpRight size={16} />
                </a>
              ))}
            </div>
          ))}
          <a href="#contact" onClick={() => setOpen(false)}>
            นัดคุย / ขอ Proposal
            <ArrowUpRight size={16} />
          </a>
          <a
            href="/proposal?programSlug=from-zombie-to-living-organization"
            onClick={() => setOpen(false)}
          >
            ดูกรอบ Proposal ดิจิทัล
            <ArrowUpRight size={16} />
          </a>
        </nav>
      )}
    </header>
  );
}
