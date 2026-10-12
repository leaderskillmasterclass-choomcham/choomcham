import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Plus,
  Sparkles,
} from "lucide-react";
import { AuthenticHeader } from "~/components/features/authentic/AuthenticHeader";
import { CUSTOMER_LOGOS } from "~/components/sections/CustomerLogos";
import {
  AUTHENTIC_LEVELS,
  ORGANIZATION_PAINS,
  DESIGN_CONTEXT,
  TRAINING_FORMATS,
  ORGANIZATION_FIT,
  DESIRED_OUTCOMES,
  SELECTED_EXPERIENCE,
  LEGACY_SERVICE_HASHES,
} from "~/lib/authentic-content";
import { programUrl } from "~/lib/programs";
export function meta() {
  const title =
    "องค์กรตัวจริง™ | พัฒนาคน ทีม ผู้นำ และวัฒนธรรมองค์กร — Choomcham Branding";
  const description =
    "องค์กรมีคนเก่ง แต่ทีมยังไปได้ไม่เต็มศักยภาพ? พัฒนาจากการเข้าใจตัวเอง สื่อสาร สร้างทีม นำคน จนถึงวัฒนธรรมองค์กร ผ่าน 5 Levels of Growth ภายใต้แนวคิด ตัวจริงต้องมีที่ยืน";
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://choomcham.pages.dev/" },
    {
      property: "og:image",
      content: "https://choomcham.pages.dev/chumcham.png",
    },
    { tagName: "link", rel: "canonical", href: "https://choomcham.pages.dev/" },
  ];
}
function ConsultLink({
  children = "ปรึกษาและออกแบบหลักสูตรสำหรับองค์กร",
  secondary = false,
}: {
  children?: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link
      className={`auth-button${secondary ? " auth-button-secondary" : ""}`}
      to="/services?inquiry=consultation#contact"
    >
      {children}
      <ArrowUpRight size={18} />
    </Link>
  );
}
export default function Home() {
  const location = useLocation(),
    navigate = useNavigate();
  useEffect(() => {
    if (LEGACY_SERVICE_HASHES.has(location.hash))
      navigate(`/services${location.hash}`, { replace: true });
  }, [location.hash, navigate]);
  return (
    <div className="authentic-page">
      <a className="auth-skip" href="#sales-main">
        ข้ามไปเนื้อหา
      </a>
      <AuthenticHeader />
      <main id="sales-main">
        <section id="hero" className="auth-hero">
          <div className="auth-container">
            <p className="auth-eyebrow">PEOPLE · TEAM · LEADERSHIP · CULTURE</p>
            <div className="auth-hero-grid">
              <div>
                <h1>
                  องค์กรมี <span className="auth-highlight">“คนเก่ง”</span>
                  <br />
                  แต่ทำไมทีมยังไปได้
                  <br />
                  ไม่เต็มศักยภาพ?
                </h1>
                <p className="auth-hero-lead">
                  ปัญหาอาจไม่ใช่เพราะองค์กร “ไม่มีคนเก่ง”
                  <br />
                  แต่อาจเพราะ...
                </p>
                <p className="auth-hero-quote">
                  คนเก่ง ยังไม่มีพื้นที่
                  <br />
                  ให้ศักยภาพได้ทำงานอย่างเต็มที่
                </p>
                <div className="auth-actions">
                  <ConsultLink />
                  <a className="auth-text-link" href="#levels">
                    รู้จัก 5 ระดับการเติบโต <ArrowDown size={17} />
                  </a>
                </div>
              </div>
              <aside className="auth-pain-note">
                <div className="auth-note-heading">
                  <span>ทีมของคุณกำลังเจอเรื่องนี้อยู่ไหม?</span>
                  <Sparkles size={20} />
                </div>
                <ol>
                  {ORGANIZATION_PAINS.map((pain, i) => (
                    <li key={pain}>
                      <span className="auth-note-number">0{i + 1}</span>
                      <p>{pain}</p>
                    </li>
                  ))}
                </ol>
                <div className="auth-note-footer">
                  <span>ศักยภาพของคน</span>
                  <ArrowRight size={18} />
                  <strong>พลังขององค์กร</strong>
                </div>
              </aside>
            </div>
            <div className="auth-hero-bottom">
              <span>THE AUTHENTIC ORGANIZATION</span>
              <span>เริ่มจากข้างใน · เติบโตไปด้วยกัน</span>
            </div>
          </div>
        </section>
        <section id="authentic-org" className="auth-intro auth-section">
          <div className="auth-container auth-intro-grid">
            <div>
              <p className="auth-eyebrow">THE AUTHENTIC ORGANIZATION</p>
              <h2 className="auth-large-title">
                องค์กรตัวจริง<span>™</span>
              </h2>
              <p className="auth-program-description">
                หลักสูตรพัฒนาคน ทีม ผู้นำ
                <br />
                และวัฒนธรรมองค์กร
              </p>
              <p>
                จากการเข้าใจ “ตัวเอง”
                <br />
                ไปสู่การสร้าง “องค์กรที่แข็งแรง”
              </p>
              <p className="auth-credit">โดย Choomcham Branding</p>
            </div>
            <div className="auth-intro-statement">
              <span className="auth-quote-mark" aria-hidden="true">
                “
              </span>
              <p>
                ตัวจริง
                <br />
                ต้องมี<span>ที่ยืน</span>
              </p>
              <span className="auth-statement-line" aria-hidden="true" />
              <small>คนที่มีศักยภาพ → องค์กรที่ดึงศักยภาพออกมาใช้ได้จริง</small>
            </div>
          </div>
          <div className="auth-container auth-intro-action">
            <ConsultLink />
          </div>
        </section>
        <section id="clients" className="auth-trust auth-section">
          <div className="auth-container">
            <div className="auth-section-heading">
              <p className="auth-eyebrow">TRUSTED EXPERIENCE</p>
              <h2>ประสบการณ์ที่ได้รับความไว้วางใจ</h2>
              <p>
                ประสบการณ์ด้านการอบรม การพัฒนาคน การสื่อสาร และการสร้างแบรนด์
                <br className="auth-desktop-break" />
                ให้กับองค์กรและแบรนด์ชั้นนำ
              </p>
            </div>
            <div className="auth-logos">
              {CUSTOMER_LOGOS.slice(0, 5).map((client, index) => (
                <figure key={client.name}>
                  <img
                    src={`/images/authentic/${["aot.png", "pea.png", "cfr.png", "land-houses.jpg", "urc.png"][index]}`}
                    alt={client.name}
                    width="160"
                    height="80"
                    loading="lazy"
                  />
                  <figcaption>{client.name}</figcaption>
                </figure>
              ))}
            </div>
            <p className="auth-trust-belief">
              เพราะเราเชื่อว่า องค์กรจะสื่อสารออกไปข้างนอกได้ดี
              <br />
              เมื่อ <strong>“คนข้างใน”</strong> เข้าใจตัวเอง เข้าใจกัน
              <br />
              และเข้าใจสิ่งที่องค์กรกำลังสร้าง
            </p>
          </div>
        </section>
        <section id="framework" className="auth-framework auth-section">
          <div className="auth-container">
            <div className="auth-framework-grid">
              <div>
                <p className="auth-eyebrow">START FROM WITHIN</p>
                <h2>
                  ทำไมต้องเริ่ม
                  <br />
                  จาก <span>“คน”?</span>
                </h2>
              </div>
              <div className="auth-framework-copy">
                <p>
                  เราไม่สามารถสร้าง Teamwork ที่ดี
                  ถ้าคนยังไม่เข้าใจตัวเองและคนรอบข้าง
                </p>
                <p>
                  เราไม่สามารถสร้าง Leader ที่ดี ถ้ายังสื่อสารและนำคนไม่เป็น
                </p>
                <p>
                  และเราไม่สามารถสร้าง Culture ที่แข็งแรง ด้วยการเขียน Core
                  Values ไว้บนกำแพงเพียงอย่างเดียว
                </p>
                <p className="auth-framework-emphasis">
                  เพราะสุดท้าย... วัฒนธรรมองค์กร
                  <br />
                  คือสิ่งที่ <strong>“คนในองค์กรทำจริง”</strong> ในทุก ๆ วัน
                </p>
              </div>
            </div>
            <div className="auth-framework-journey">
              <p className="auth-eyebrow">
                THE AUTHENTIC ORGANIZATION FRAMEWORK
              </p>
              <h3>
                การพัฒนาคนจากข้างใน
                <br />
                ไปสู่การเปลี่ยนแปลงระดับองค์กร
              </h3>
              <ol>
                {AUTHENTIC_LEVELS.map((level) => (
                  <li key={level.slug}>
                    <a href={`#level-${level.slug}`}>
                      <span>{level.number}</span>
                      <strong>{level.code}</strong>
                      <small>{level.title}</small>
                    </a>
                  </li>
                ))}
              </ol>
              <p className="auth-journey-caption">
                จาก <strong>“ฉันคือใคร?”</strong>
                <ArrowRight size={20} />
                ไปสู่ <strong>“พวกเราคือองค์กรแบบไหน?”</strong>
              </p>
            </div>
          </div>
        </section>
        <section id="levels" className="auth-levels auth-section">
          <div className="auth-container">
            <div className="auth-section-heading">
              <p className="auth-eyebrow">5 LEVELS OF GROWTH</p>
              <h2>5 ระดับ สู่ “องค์กรตัวจริง”</h2>
              <p>จากการเข้าใจคนหนึ่งคน สู่การเติบโตของทั้งองค์กร</p>
            </div>
            <div className="auth-level-list">
              {AUTHENTIC_LEVELS.map((level) => (
                <article
                  key={level.slug}
                  id={`level-${level.slug}`}
                  className={`auth-level auth-level-${level.color}`}
                >
                  <div className="auth-level-label">
                    <span className="auth-level-number">{level.number}</span>
                    <p>{level.code}</p>
                    <Link
                      to={programUrl(level.slug)}
                      className="auth-text-link"
                    >
                      ดูรายละเอียดหลักสูตร <ArrowUpRight size={17} />
                    </Link>
                  </div>
                  <div className="auth-level-content">
                    <h3>{level.title}</h3>
                    <p className="auth-level-intro">{level.intro}</p>
                    {level.paragraphs.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                    <div className="auth-level-shift">
                      <div>
                        <small>จาก</small>
                        <p>“{level.from}”</p>
                      </div>
                      <ArrowRight size={22} />
                      <div>
                        <small>
                          {level.slug === "reborn"
                            ? "เห็นตัวเองชัดขึ้น"
                            : "เป็น"}
                        </small>
                        <strong>“{level.to}”</strong>
                      </div>
                    </div>
                    <Link
                      className="auth-level-action"
                      to={`/proposal/request?program=${level.slug}`}
                    >
                      ออกแบบ {level.code} สำหรับองค์กร{" "}
                      <ArrowUpRight size={17} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            <div className="auth-level-footer">
              <p>
                เลือกเริ่มจากระดับที่ตอบโจทย์องค์กรของคุณ
                <br />
                หรือออกแบบ Learning Journey ต่อเนื่อง
              </p>
              <Link
                className="auth-button auth-button-secondary"
                to="/programs"
              >
                ดูทุกหลักสูตรและ Flagship <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
        <section id="meaning" className="auth-meaning auth-section">
          <div className="auth-container auth-meaning-grid">
            <div>
              <p className="auth-eyebrow">SPACE FOR YOUR BEST SELF</p>
              <h2>
                นี่คือความหมายของ
                <br />
                “ตัวจริงต้องมีที่ยืน”
              </h2>
              <p>
                เราไม่ได้เข้าไปเปลี่ยนทุกคนให้คิดเหมือนกัน
                <br />
                พูดเหมือนกัน หรือทำงานเหมือนกัน
              </p>
            </div>
            <div>
              <p>
                แต่ช่วยให้แต่ละคนรู้จักตัวเอง เห็นคุณค่าของตัวเอง
                <br />
                เข้าใจความแตกต่างของคนอื่น
              </p>
              <p>
                และสามารถนำ <strong>“ตัวจริงที่ดีที่สุดของตัวเอง”</strong>
                <br />
                มาทำงานร่วมกับคนอื่น เพื่อเป้าหมายเดียวกันได้
              </p>
              <p className="auth-person-chain">
                PERSON → COMMUNICATION → TEAM → LEADER → CULTURE
              </p>
              <p className="auth-meaning-result">
                จาก “คนที่มีศักยภาพ”
                <br />
                สู่ “องค์กรที่ดึงศักยภาพของคนออกมาใช้ได้จริง”
              </p>
            </div>
          </div>
        </section>
        <section id="programs" className="auth-custom auth-section">
          <div className="auth-container">
            <div className="auth-framework-grid">
              <div>
                <p className="auth-eyebrow">DESIGNED FOR YOUR ORGANIZATION</p>
                <h2>
                  ไม่ใช่หลักสูตร
                  <br />
                  <span>สำเร็จรูป</span>
                </h2>
                <p>เพราะแต่ละองค์กรมี “คน” และ “โจทย์” ไม่เหมือนกัน</p>
              </div>
              <div>
                <p>ก่อนเริ่มโปรแกรม ทีมชุ่มฉ่ำจะทำความเข้าใจ</p>
                <ol className="auth-context-list">
                  {DESIGN_CONTEXT.map((text, i) => (
                    <li key={text}>
                      <span>0{i + 1}</span>
                      {text}
                    </li>
                  ))}
                </ol>
                <p>
                  แล้วจึงออกแบบ <strong>Learning Journey</strong>{" "}
                  ให้เหมาะกับองค์กร
                </p>
              </div>
            </div>
            <div className="auth-format-block">
              <h3>สามารถออกแบบได้ทั้ง</h3>
              <ul>
                {TRAINING_FORMATS.map((f) => (
                  <li key={f}>
                    <Plus size={16} />
                    {f}
                  </li>
                ))}
              </ul>
              <p>
                เลือกอบรมเฉพาะหัวข้อได้ หรือออกแบบเป็น Development Journey
                ต่อเนื่อง
              </p>
              <div className="auth-actions">
                <ConsultLink />
                <Link className="auth-text-link" to="/services">
                  รู้จักบริการทั้งหมด <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section id="fit" className="auth-fit auth-section">
          <div className="auth-container">
            <div className="auth-section-heading">
              <p className="auth-eyebrow">IS THIS YOUR ORGANIZATION?</p>
              <h2>เหมาะกับองค์กรที่...</h2>
            </div>
            <ul>
              {ORGANIZATION_FIT.map((f) => (
                <li key={f}>
                  <Check size={20} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section id="outcomes" className="auth-outcomes auth-section">
          <div className="auth-container auth-outcome-grid">
            <div>
              <p className="auth-eyebrow">BEYOND THE TRAINING ROOM</p>
              <h2>
                ผลลัพธ์ที่เรา
                <br />
                อยากเห็น
              </h2>
              <p>
                เป้าหมายไม่ใช่แค่ “วันนี้อบรมสนุกมาก”
                <br />
                แต่คือเมื่อทุกคนกลับไปทำงานแล้ว...
              </p>
              <p className="auth-outcome-belief">
                เพราะการอบรมที่ดี ไม่ควรจบ
                <br />
                เมื่อเดินออกจากห้องอบรม
                <br />
                แต่ควรเริ่มเห็นผล
                <br />
                <strong>เมื่อทุกคนกลับไปทำงานจริง</strong>
              </p>
            </div>
            <ol>
              {DESIRED_OUTCOMES.map((o, i) => (
                <li key={o}>
                  <span>0{i + 1}</span>
                  {o}
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section id="experience" className="auth-experience auth-section">
          <div className="auth-container">
            <div className="auth-section-heading">
              <p className="auth-eyebrow">SELECTED EXPERIENCE</p>
              <h2>
                เมื่อคนเข้าใจทิศทาง
                <br />
                แบรนด์และทีมก็ไปด้วยกันได้
              </h2>
            </div>
            <div className="auth-case-grid">
              {SELECTED_EXPERIENCE.map((c) => (
                <article key={c.name}>
                  <p className="auth-eyebrow">{c.tag}</p>
                  <h3>{c.name}</h3>
                  <p>{c.before}</p>
                  <div className="auth-case-arrow">
                    <ArrowDown size={25} />
                  </div>
                  <p className="auth-case-after">{c.after}</p>
                </article>
              ))}
            </div>
            <figure className="auth-workshop-photo">
              <img
                src="/images/authentic/team-learning.jpg"
                alt="บรรยากาศการเรียนรู้ร่วมกันของทีมในกิจกรรมอบรม"
                width="1280"
                height="960"
                loading="lazy"
              />
              <figcaption>
                ภาพบรรยากาศกระบวนการเรียนรู้และการเชื่อมทีม
              </figcaption>
            </figure>
            <Link className="auth-text-link" to="/services#experience">
              ดูภาพบรรยากาศการอบรมและประสบการณ์ <ArrowUpRight size={18} />
            </Link>
          </div>
        </section>
        <section id="about" className="auth-about auth-section">
          <div className="auth-container auth-about-grid">
            <div>
              <p className="auth-eyebrow">ABOUT CHOOMCHAM</p>
              <h2>
                Choomcham
                <br />
                <span>Branding</span>
              </h2>
              <p>
                ผู้เชี่ยวชาญด้าน Branding Storytelling
                <br />
                Communication และการค้นหา Brand DNA
              </p>
              <p>
                จากประสบการณ์กว่า 10 ปี
                <br />
                ในการทำงานกับคน แบรนด์ และการสื่อสาร
              </p>
            </div>
            <div className="auth-about-belief">
              <span aria-hidden="true">“</span>
              <p>
                ของดีที่ไม่มีใครมองเห็น
                <br />
                อาจไม่ได้แปลว่ามันไม่ดี
              </p>
              <p>
                แต่อาจยังไม่มีพื้นที่
                <br />
                ให้คุณค่าของมันถูกมองเห็น
              </p>
              <small>จึงเป็นที่มาของแนวคิด</small>
              <strong>“ตัวจริงต้องมีที่ยืน”</strong>
            </div>
          </div>
        </section>
        <section id="contact" className="auth-final auth-section">
          <div className="auth-container">
            <p className="auth-eyebrow">THE AUTHENTIC ORGANIZATION</p>
            <h2>
              องค์กรของคุณ
              <br />
              อาจไม่จำเป็นต้อง<span>หาคนเก่งเพิ่ม</span>
            </h2>
            <p>แต่อาจต้องเริ่มจากคำถามว่า...</p>
            <blockquote>
              เราได้สร้างพื้นที่ให้คนเก่งที่มีอยู่แล้ว
              <br />
              แสดงศักยภาพเต็มที่หรือยัง?
            </blockquote>
            <div className="auth-final-brand">
              <strong>องค์กรตัวจริง™</strong>
              <p>
                หลักสูตรพัฒนาคน ทีม ผู้นำ และวัฒนธรรมองค์กร
                <br />
                โดย Choomcham Branding · “ตัวจริงต้องมีที่ยืน”
              </p>
            </div>
            <div className="auth-final-actions">
              <ConsultLink>ปรึกษาโจทย์องค์กร</ConsultLink>
              <Link
                className="auth-button auth-button-secondary"
                to="/programs"
              >
                ขอรายละเอียดหลักสูตร <ArrowRight size={18} />
              </Link>
              <Link
                className="auth-button auth-button-secondary"
                to="/proposal/request"
              >
                ขอใบเสนอราคา <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="auth-footer">
        <div className="auth-container">
          <div>
            <strong>CHOOMCHAM BRANDING</strong>
            <p>ตัวจริงต้องมีที่ยืน</p>
          </div>
          <nav aria-label="เมนูท้ายหน้า">
            <Link to="/services">บริการทั้งหมด</Link>
            <Link to="/programs">หลักสูตร</Link>
            <Link to="/services#zombie-check">เช็กพลังองค์กร</Link>
            <Link to="/services?inquiry=consultation#contact">ติดต่อ</Link>
          </nav>
          <small>© {new Date().getFullYear()} Choomcham</small>
        </div>
      </footer>
    </div>
  );
}
