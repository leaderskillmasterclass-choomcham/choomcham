import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";
const links = [
  ["#framework", "แนวคิด"],
  ["#levels", "5 ระดับ"],
  ["#experience", "ประสบการณ์"],
  ["/services", "บริการทั้งหมด"],
];
export function AuthenticHeader() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, []);
  return (
    <header className="auth-header">
      <div className="auth-container auth-nav-row">
        <Link
          className="auth-brand"
          to="/"
          aria-label="Choomcham Branding หน้าแรก"
        >
          <img src="/chumcham.png" alt="" width="44" height="44" />
          <span>
            CHOOMCHAM<small>BRANDING · ตัวจริงต้องมีที่ยืน</small>
          </span>
        </Link>
        <nav className="auth-desktop-nav" aria-label="เมนูหน้าแรก">
          {links.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <Link
          className="auth-button auth-button-small"
          to="/services?inquiry=consultation#contact"
        >
          ปรึกษาโจทย์องค์กร <ArrowUpRight size={16} />
        </Link>
        <button
          className="auth-menu-toggle"
          aria-expanded={open}
          aria-controls="auth-mobile-nav"
          aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          id="auth-mobile-nav"
          className="auth-mobile-nav"
          aria-label="เมนูมือถือหน้าแรก"
        >
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
              <ArrowUpRight size={16} />
            </a>
          ))}
          <Link
            to="/services?inquiry=consultation#contact"
            onClick={() => setOpen(false)}
          >
            ปรึกษาโจทย์องค์กร <ArrowUpRight size={16} />
          </Link>
          <Link to="/proposal/request" onClick={() => setOpen(false)}>
            ขอใบเสนอราคา <ArrowUpRight size={16} />
          </Link>
        </nav>
      )}
    </header>
  );
}
