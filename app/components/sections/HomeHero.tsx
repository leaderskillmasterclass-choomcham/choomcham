import { ArrowRight, ArrowUpRight, Check, Sprout } from "lucide-react";

const journey = ["เข้าใจตัวเอง", "สื่อสารเป็น", "สร้างทีม", "นำคน", "สร้างวัฒนธรรม"];

export function HomeHero() {
  return (
    <section id="authentic-org" className="home-hero">
      <div className="hero-orbit" aria-hidden="true" />
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow"><span /> PEOPLE & ORGANIZATION TRANSFORMATION</p>
          <h1>องค์กรมีชีวิต<br />เมื่อ<span className="hero-highlight">คนข้างใน</span><br />ได้เป็นตัวจริง</h1>
          <p className="hero-description">ช่วยคนและองค์กร เกิดใหม่จากข้างใน<br />ผ่านประสบการณ์ที่ทำให้คนเข้าใจตัวเอง เชื่อมถึงกัน<br className="hidden sm:block" /> และกลับไปเปลี่ยนวิธีทำงานจริง</p>
          <div className="hero-actions">
            <a href="#contact" className="button-primary">คุยกับ Choomcham House <ArrowUpRight size={19} /></a>
            <a href="#zombie-check" className="button-secondary">เช็กพลังขององค์กร <ArrowRight size={18} /></a>
          </div>
          <p className="hero-note"><Check size={15} /> แบบประเมิน 10 ข้อ · เห็นผลเบื้องต้นโดยไม่ต้องกรอกข้อมูล</p>
        </div>
        <div className="hero-visual">
          <div className="hero-photo-frame">
            <svg className="hero-growth-art" viewBox="0 0 500 450" aria-hidden="true">
              <path d="M40 420 C160 430 90 170 260 220 S480 150 490 20" fill="none" stroke="#FFFFFF" strokeOpacity=".18" strokeWidth="2" />
              <circle cx="418" cy="150" r="112" fill="none" stroke="#FFFFFF" strokeOpacity=".12" strokeWidth="1" />
              <circle cx="418" cy="150" r="83" fill="none" stroke="#FFFFFF" strokeOpacity=".12" strokeWidth="1" />
              <path d="M300 320 C335 260 405 260 438 310 C466 360 423 405 362 402 C307 401 276 367 300 320" fill="#08B192" />
              <circle cx="77" cy="130" r="27" fill="#E8BD32" />
              <circle cx="95" cy="326" r="7" fill="#E8BD32" />
              <circle cx="430" cy="58" r="5" fill="#FFFFFF" />
              <path d="M355 342 L382 370 L430 320" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="hero-art-copy"><small>THE AUTHENTIC ORGANIZATION</small><p>GROW.<br />FROM<br /><span>WITHIN.</span></p></div>
            <div className="hero-photo-caption"><span className="hero-photo-dot" /> คน → ทีม → วัฒนธรรม</div>
          </div>
          <div className="hero-insight-card"><span className="hero-insight-icon"><Sprout size={24} /></span><div><small>OUR BELIEF</small><p>ตัวจริงต้องมีที่ยืน</p><span>จากศักยภาพของคน สู่พลังขององค์กร</span></div></div>
          <span className="hero-photo-label">FROM WITHIN,<br />TOGETHER.</span>
        </div>
      </div>
      <div className="hero-journey">
        <p><strong>องค์กรตัวจริง™</strong><span>5 ระดับของการเติบโต</span></p>
        <ol>{journey.map((label, index) => <li key={label}><span>0{index + 1}</span>{label}</li>)}</ol>
      </div>
    </section>
  );
}
