import { useState } from "react";
import {
  Zap,
  ShieldAlert,
  AlertCircle,
  Users,
  Flame,
  Heart,
  Lightbulb,
  Sparkles,
  Compass,
  ArrowRight,
} from "lucide-react";

const TRANSFORMATION_STEPS = [
  {
    id: "reset",
    title: "RESET",
    subtitle: "หยุดวงจรเดิม",
    desc: "หยุดวงจรการทำงานแบบหุ่นยนต์ เพื่อมองเห็นสิ่งที่กำลังเกิดขึ้นกับตัวเองและทีมอย่างแท้จริง สะท้อนความตระหนักรู้แรก",
  },
  {
    id: "reconnect",
    title: "RECONNECT",
    subtitle: "กลับมาเชื่อมกัน",
    desc: "กลับมาเชื่อมโยงกับตัวเอง ค้นพบความต้องการที่แท้จริง และเปิดใจเชื่อมโยงกับคนรอบข้างแบบไร้กำแพงกั้น",
  },
  {
    id: "recharge",
    title: "RECHARGE",
    subtitle: "เติมพลังชีวิต",
    desc: "เติมพลังงานความสดใหม่ แรงบันดาลใจ และความรื่นเริงใจที่เป็นธรรมชาติของจิตวิญญาณมนุษย์",
  },
  {
    id: "reimagine",
    title: "REIMAGINE",
    subtitle: "มองมุมใหม่",
    desc: "มองงาน มองทีม และมองอนาคตขององค์กรด้วยเลนส์และมุมมองใหม่ที่เป็นไปได้และสร้างสรรค์",
  },
  {
    id: "recreate",
    title: "RECREATE",
    subtitle: "ลงมือสร้างใหม่",
    desc: "นำสิ่งที่คุณและทีมร่วมค้นพบกลับไปสร้างวิธีทำงาน วิธีการสื่อสาร และการลงมือทำจริงในออฟฟิศ",
  },
];

export function RebirthHero() {
  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center justify-center py-20 px-6 overflow-hidden bg-brand-purple text-brand-white"
    >
      {/* Decorative organic shapes */}
      <div className="absolute top-20 left-1/4 w-80 h-80 bg-brand-yellow/10 rounded-full blur-[100px] pointer-events-none animate-pulse-glow"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-brand-pink/10 rounded-full blur-[120px] pointer-events-none animate-float"></div>

      <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
        {/* Official Logo Badge */}
        <div className="mb-6 relative group">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white p-2.5 shadow-2xl shadow-brand-pink/25 ring-4 ring-white/20 group-hover:scale-105 transition-transform duration-300 mx-auto">
            <img
              src="/chumcham.png"
              alt="บ้านชุ่มฉ่ำ Choomcham House"
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-pill border border-brand-pink/30 bg-brand-pink/10 text-white text-xs font-bold uppercase tracking-widest mb-8 font-display">
          <Zap className="w-3.5 h-3.5" />
          ช่วยคนและองค์กร “เกิดใหม่จากข้างใน”
        </div>

        <h1
          id="rebirth-hero-title"
          className="text-4xl sm:text-6xl md:text-7xl font-sans font-extrabold tracking-tight leading-tight mb-8 max-w-4xl text-balance"
        >
          องค์กรของคุณกำลังมีคนที่ยังมาทำงาน <br />
          แต่
          <span className="text-brand-yellow relative">
            ไม่มีพลัง
            <span className="absolute left-0 bottom-1 w-full h-1.5 bg-brand-yellow/20 rounded"></span>
          </span>
          ในการสร้างอะไรใหม่หรือเปล่า?
        </h1>

        <p className="text-lg sm:text-xl text-brand-surface max-w-3xl leading-relaxed mb-12 text-balance font-normal">
          คนยังอยู่ครบ งานยังเดิน แต่ความสดใส ความกระตือรือร้น{" "}
          <br className="hidden sm:inline" />
          และพลังบางอย่างกำลังหายไป... Choomcham House ช่วยองค์กรปลุกพลังคน{" "}
          <br className="hidden sm:inline" />
          เชื่อมทีม และสร้างการเปลี่ยนแปลงจากข้างใน
        </p>

        {/* Metaphor Visual Banner */}
        <div className="inline-flex items-center gap-4 px-6 py-3 rounded-md bg-brand-white/10 border border-brand-white/10 mb-12 text-xs sm:text-sm font-semibold tracking-wide font-display">
          <span className="text-white/70 line-through">
            Zombie Organization
          </span>
          <span className="text-brand-yellow font-display">→</span>
          <span className="text-brand-green font-display glow-green">
            Living Organization
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-6 justify-center w-full max-w-md">
          <a
            href="#zombie-check"
            className="w-full sm:w-auto px-8 py-4 rounded-pill bg-brand-pink text-brand-white font-display font-bold text-lg tracking-wide hover:shadow-[0_0_25px_rgba(227,52,107,0.5)] hover:scale-105 transition-all duration-300 text-center"
          >
            ให้ทีมของคุณเกิดใหม่
          </a>
          <a
            href="#contact"
            className="w-full sm:w-auto px-8 py-4 rounded-pill border border-brand-white/30 bg-brand-white/5 hover:bg-brand-white/15 text-brand-white font-display font-semibold text-lg transition-all duration-300 text-center"
          >
            คุยกับเรา
          </a>
        </div>
      </div>
    </section>
  );
}

export function OrganizationPain() {
  return (
    <section
      id="pain"
      className="py-24 px-6 bg-brand-surface border-b border-brand-border relative"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-brand-pink text-xs font-bold tracking-widest uppercase block font-display">
            01 — คุณกำลังมี “Zombie Organization” หรือเปล่า?
          </span>
          <h2 className="text-3xl sm:text-5xl font-sans font-extrabold max-w-3xl mx-auto leading-tight mt-2">
            เมื่อองค์กรเริ่มขาดลมหายใจ... มันคือภาวะกัดกินพลังสร้างสรรค์
          </h2>
        </div>

        {/* Asymmetric / Offset cards layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="p-8 rounded-lg bg-brand-white border border-brand-border shadow-sm hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-md bg-brand-pink/10 flex items-center justify-center mb-6">
              <ShieldAlert className="w-6 h-6 text-brand-pink" />
            </div>
            <h3 className="text-lg font-bold mb-3 font-display">
              Zombie Workers
            </h3>
            <p className="text-brand-gray text-sm leading-relaxed">
              พนักงานมาตรงเวลา แต่ทำงานเฉพาะตามสั่งแบบเฉื่อยชา
              ไร้จิตวิญญาณและความคิดริเริ่ม
            </p>
          </div>

          <div className="p-8 rounded-lg bg-brand-white border border-brand-border shadow-sm hover:-translate-y-1 transition-all duration-300 md:translate-y-4">
            <div className="w-12 h-12 rounded-md bg-brand-yellow/10 flex items-center justify-center mb-6">
              <AlertCircle className="w-6 h-6 text-brand-yellow" />
            </div>
            <h3 className="text-lg font-bold mb-3 font-display">
              Idea Graveyard
            </h3>
            <p className="text-brand-gray text-sm leading-relaxed">
              ห้องประชุมที่เงียบงัน ทุกคนพยักหน้าเห็นด้วยเพื่อรีบจบประชุม
              แต่ไม่มีใครเสนออะไรใหม่ๆ
            </p>
          </div>

          <div className="p-8 rounded-lg bg-brand-white border border-brand-border shadow-sm hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-md bg-brand-blue/10 flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-brand-blue" />
            </div>
            <h3 className="text-lg font-bold mb-3 font-display">
              Silo Division
            </h3>
            <p className="text-brand-gray text-sm leading-relaxed">
              การแยกขอบเขตปกป้องเขตแดน ไม่มีความร่วมมือในแนวราบ
              ต่างฝ่ายต่างอยู่สงครามเย็น
            </p>
          </div>

          <div className="p-8 rounded-lg bg-brand-white border border-brand-border shadow-sm hover:-translate-y-1 transition-all duration-300 md:translate-y-4">
            <div className="w-12 h-12 rounded-md bg-brand-pink/10 flex items-center justify-center mb-6">
              <Flame className="w-6 h-6 text-brand-pink" />
            </div>
            <h3 className="text-lg font-bold mb-3 font-display">
              Talent Burnout
            </h3>
            <p className="text-brand-gray text-sm leading-relaxed">
              คนเก่งแบกงานจนหมดพลัง มอดไหม้ไปกับระบบจับผิด
              และเงียบถอดจิตรอลาออกเงียบๆ
            </p>
          </div>
        </div>

        {/* Overlap Statement Card */}
        <div className="relative bg-brand-white rounded-lg p-10 md:p-12 text-center border border-brand-pink/20 max-w-4xl mx-auto shadow-md mt-24">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-pink/5 rounded-full blur-[80px] pointer-events-none"></div>

          <h3 className="text-2xl sm:text-4xl font-display font-black text-brand-black mb-6 leading-tight">
            “สิ่งที่น่ากลัวที่สุดไม่ใช่คนลาออก{" "}
            <br className="hidden sm:inline" />
            แต่คือ...{" "}
            <span className="text-brand-pink">
              คนยังอยู่ แต่ใจไม่ได้อยู่กับองค์กรแล้ว
            </span>
            ”
          </h3>
          <p className="text-brand-gray max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            การฟื้นฟูสภาวะนี้ไม่ใช่อัดชุดวิชาการธรรมดากลบปัญหา
            แต่คือการพาพวกเขากลับมารู้สึกตัว เชื่อมต่อกับคนรอบข้าง
            และเกิดความหมายในการสร้างสรรค์ใหม่อีกครั้ง
          </p>
        </div>
      </div>
    </section>
  );
}

export function RebirthBelief() {
  return (
    <section
      id="belief"
      className="py-24 px-6 relative bg-brand-purple text-brand-white"
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-brand-yellow text-xs font-bold tracking-widest uppercase block font-display">
              02 — เราเชื่อว่า...
            </span>
            <h2 className="text-3xl sm:text-5xl font-sans font-extrabold leading-tight">
              องค์กรจะมีชีวิตได้ <br />
              เมื่อคนข้างใน <br />
              <span className="text-brand-yellow relative">
                มีชีวิต
                <span className="absolute left-0 bottom-1 w-full h-1 bg-brand-yellow/30 rounded"></span>
              </span>
            </h2>
            <p className="text-brand-surface leading-relaxed text-sm sm:text-base">
              องค์กรไม่สามารถเปลี่ยนได้อย่างยั่งยืนด้วยการเปลี่ยนแค่ Strategy,
              Process หรือ KPI ใหม่ๆ เพราะสุดท้ายแล้ว...
            </p>
            <div className="text-xl sm:text-2xl font-display font-black text-brand-yellow">
              คนคือคนที่ทำให้องค์กรมีชีวิต
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                num: "01 / หยุด",
                title: "Stop",
                desc: "หยุดการทำงานสภาวะหุ่นยนต์มาส่องดูสภาวะตัวเอง",
              },
              {
                num: "02 / มองตัวเอง",
                title: "Reflect",
                desc: "มองลึกทำความเข้าใจความจริงของความคิดและสภาวะในปัจจุบัน",
              },
              {
                num: "03 / เชื่อมกับคนอื่น",
                title: "Connect",
                desc: "เปิดใจสร้างความเชื่อมโยงที่จริงใจกับคนในทีมงาน",
              },
              {
                num: "04 / เติมพลัง",
                title: "Re-energize",
                desc: "ฟื้นไฟพลังงานความสดใหม่ แรงบันดาลใจในการทำงาน",
              },
              {
                num: "05 / เห็นความเป็นไปได้ใหม่",
                title: "Re-frame",
                desc: "มองเห็นมุมมองแปลกใหม่ในการแก้ไขปัญหาร่วมกัน",
              },
              {
                num: "06 / กลับไปสร้างสิ่งใหม่",
                title: "Recreate",
                desc: "นำทัศนคติที่ดีกลับไปสรรค์สร้างพฤติกรรมในที่ทำงาน",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg bg-brand-white/10 border border-brand-white/10 hover:bg-brand-white/15 transition-all"
              >
                <div className="text-brand-yellow font-display font-bold text-sm mb-2">
                  {item.num}
                </div>
                <h4 className="font-bold text-base mb-1 text-brand-white">
                  {item.title}
                </h4>
                <p className="text-brand-surface text-xs leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function TransformationModel() {
  const [transStep, setTransStep] = useState(0);
  return (
    <section
      id="model"
      className="py-24 px-6 bg-brand-white text-brand-black border-b border-brand-border relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-brand-pink text-xs font-bold tracking-widest uppercase block font-display">
            04 — OUR TRANSFORMATION
          </span>
          <h2 className="text-3xl sm:text-5xl font-sans font-extrabold mb-4 mt-2">
            จาก Zombie → Alive
          </h2>
          <p className="text-brand-gray text-sm sm:text-base max-w-2xl mx-auto">
            โมเดลการเรียนรู้เปลี่ยนผ่านระดับพลังงานขององค์กรคุณ
          </p>
        </div>

        {/* Slider container grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Graphic side */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center rounded-full bg-brand-surface border border-brand-border shadow-inner">
              {/* Dynamic Backdrop Glow based on Step */}
              <div
                className={`absolute inset-0 rounded-full blur-[45px] opacity-25 transition-all duration-1000 ${
                  transStep === 0
                    ? "bg-brand-gray"
                    : transStep === 1
                      ? "bg-brand-purple"
                      : transStep === 2
                        ? "bg-brand-pink"
                        : transStep === 3
                          ? "bg-brand-yellow"
                          : "bg-brand-green"
                }`}
              ></div>

              {/* Transforming Center Orb */}
              <div
                className={`relative w-44 h-44 rounded-full border flex flex-col items-center justify-center text-center p-5 transition-all duration-1000 shadow-lg ${
                  transStep === 0
                    ? "border-brand-gray/30 bg-brand-white text-brand-gray"
                    : transStep === 1
                      ? "border-brand-purple/30 bg-brand-purple/10 text-brand-purple glow-purple"
                      : transStep === 2
                        ? "border-brand-pink/30 bg-brand-pink/10 text-brand-pink glow-pink"
                        : transStep === 3
                          ? "border-brand-yellow/30 bg-brand-yellow/10 text-brand-yellow glow-amber"
                          : "border-brand-green/30 bg-brand-green/10 text-brand-green glow-green"
                }`}
              >
                <div
                  className="absolute -inset-1 border border-dashed rounded-full motion-safe:animate-spin"
                  style={{ animationDuration: "24s" }}
                ></div>

                <span className="text-[9px] uppercase font-bold tracking-widest opacity-60 font-display">
                  Journey Stage
                </span>
                <span
                  data-model-stage
                  aria-live="polite"
                  className="text-lg md:text-xl font-display font-black tracking-wider mt-1.5 uppercase"
                >
                  {TRANSFORMATION_STEPS[transStep].title}
                </span>
                <span className="text-xs font-semibold mt-1">
                  {TRANSFORMATION_STEPS[transStep].subtitle}
                </span>
              </div>
            </div>

            {/* Bullets control */}
            <div className="flex gap-3 mt-8">
              {TRANSFORMATION_STEPS.map((_, i) => (
                <button
                  type="button"
                  aria-label={`ขั้นตอน ${i + 1}: ${TRANSFORMATION_STEPS[i].title}`}
                  aria-pressed={transStep === i}
                  key={i}
                  onClick={() => setTransStep(i)}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                    transStep === i
                      ? "bg-brand-pink scale-125 w-8"
                      : "bg-brand-gray/30 hover:bg-brand-gray/70"
                  }`}
                ></button>
              ))}
            </div>
          </div>

          {/* Steps control column */}
          <div className="lg:col-span-6 space-y-4">
            {TRANSFORMATION_STEPS.map((step, idx) => (
              <button
                type="button"
                aria-pressed={transStep === idx}
                key={step.id}
                onClick={() => setTransStep(idx)}
                className={`w-full text-left p-5 rounded-lg border transition-all duration-500 block ${
                  transStep === idx
                    ? "border-brand-pink bg-brand-pink/5 shadow-md"
                    : "border-brand-border hover:border-brand-border/15 bg-brand-white hover:bg-brand-surface"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-display ${
                      transStep === idx
                        ? "bg-brand-pink text-brand-white"
                        : "bg-brand-surface border border-brand-border text-brand-gray"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <h4
                      className={`text-base font-display font-black tracking-wider ${
                        transStep === idx
                          ? "text-brand-pink"
                          : "text-brand-black"
                      }`}
                    >
                      {step.title}
                    </h4>
                    <span className="text-xs text-brand-gray font-semibold">
                      {step.subtitle}
                    </span>
                  </div>
                </div>
                {transStep === idx && (
                  <p className="mt-3 text-brand-gray text-xs sm:text-sm leading-relaxed animate-fade-in pl-11">
                    {step.desc}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Rebirth Output block */}
        <div className="mt-16 p-8 rounded-lg bg-brand-surface border border-brand-border text-center text-lg md:text-xl font-bold font-display">
          คนมีชีวิต <span className="text-brand-pink font-semibold">→</span>{" "}
          ทีมมีพลัง <span className="text-brand-purple font-semibold">→</span>{" "}
          องค์กรมีชีวิต{" "}
          <span className="text-brand-green font-semibold">
            Living Organization
          </span>
        </div>
      </div>
    </section>
  );
}

export function WhyChoomcham() {
  return (
    <section
      id="why"
      className="py-24 px-6 relative bg-brand-purple text-brand-white"
    >
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-brand-yellow text-xs font-bold tracking-widest uppercase block mb-3 font-display">
          09 — WHY CHOOMCHAM HOUSE?
        </span>
        <h2 className="text-3xl sm:text-5xl font-sans font-extrabold mb-10 mt-2">
          เราไม่ได้เชื่อว่าคนต้องถูก “แก้”
        </h2>

        <div className="bg-brand-white/10 border border-brand-white/10 rounded-lg p-10 md:p-12 text-left relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-pink/5 rounded-full blur-[80px] pointer-events-none"></div>

          <p className="text-lg sm:text-xl text-brand-surface leading-relaxed mb-8">
            เราเชื่อว่าคนทำงานจำนวนมากไม่ได้มีความบกพร่องที่ต้องสั่งซ่อมแซมแก้ไขแบบเครื่องจักร{" "}
            <br className="hidden sm:inline" />
            พวกเขาเพียงต้องการ พื้นที่ที่อนุญาตให้เขาได้:
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center text-xs font-bold mb-8 font-display">
            <div className="p-4 rounded-md bg-brand-white/5 border border-brand-white/10 text-brand-white">
              หยุด
            </div>
            <div className="p-4 rounded-md bg-brand-white/5 border border-brand-white/10 text-brand-yellow">
              หายใจ
            </div>
            <div className="p-4 rounded-md bg-brand-white/5 border border-brand-white/10 text-brand-green">
              มองเห็นตัวเอง
            </div>
            <div className="p-4 rounded-md bg-brand-white/5 border border-brand-white/10 text-brand-blue">
              กลับมาเชื่อมกับคนอื่น
            </div>
            <div className="p-4 rounded-md bg-brand-white/10 border border-brand-yellow/30 text-brand-yellow bg-brand-yellow/5">
              ค้นพบพลังของตัวเอง
            </div>
          </div>

          <div className="text-center md:text-right text-lg md:text-xl font-display font-black text-brand-yellow tracking-wider">
            นี่คือเหตุผลที่เราเรียกที่นี่ว่า{" "}
            <span className="underline decoration-brand-yellow">
              CHOOMCHAM HOUSE
            </span>{" "}
            — บ้านสำหรับการเกิดใหม่
          </div>
        </div>
      </div>
    </section>
  );
}

export function ChoomchamEcosystem() {
  return (
    <section
      id="work"
      className="py-24 px-6 bg-brand-white text-brand-black border-b border-brand-border"
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-brand-purple text-xs font-bold tracking-widest uppercase block font-display">
              10 — ABOUT CHOOMCHAM
            </span>
            <h2 className="text-3xl sm:text-5xl font-sans font-extrabold leading-tight mt-2">
              จักรวาลชุ่มฉ่ำ <br />
              <span className="text-brand-purple">CHOOMCHAM</span>
            </h2>
            <p className="text-brand-gray leading-relaxed text-sm sm:text-base">
              Choomcham House เป็นหนึ่งในธุรกิจภายใต้จักรวาล CHOOMCHAM
              ผู้ช่วยขับเคลื่อนการปฏิรูปแบรนด์และการตื่นรู้ทางธุรกิจ
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-8 rounded-lg bg-brand-surface border border-brand-border hover:border-brand-purple/20 transition-all">
              <span className="text-brand-purple font-display font-black text-lg block mb-3 uppercase">
                Choomcham Branding
              </span>
              <p className="text-brand-gray text-xs sm:text-sm leading-relaxed mb-4">
                ช่วยธุรกิจวิเคราะห์ วางทิศทางแบรนด์ ออกแบบภาพลักษณ์แบรนด์
                และการทำการตลาดเพื่อสร้างการเกิดใหม่ภายนอกในสายตาตลาด
              </p>
              <span className="text-xs font-bold text-brand-purple font-display">
                “เกิดใหม่ในสายตาตลาด”
              </span>
            </div>

            <div className="p-8 rounded-lg bg-brand-surface border border-brand-pink/20 bg-brand-pink/5 hover:border-brand-pink/30 transition-all">
              <span className="text-brand-pink font-display font-black text-lg block mb-3 uppercase">
                Choomcham House
              </span>
              <p className="text-brand-gray text-xs sm:text-sm leading-relaxed mb-4">
                มุ่งสร้างประสบการณ์การเรียนรู้ ประสานวัฒนธรรมองค์กร
                พัฒนาศักยภาพผู้นำและพนักงาน
                เพื่อการเกิดใหม่ทางสภาวะจิตวิญญาณจากข้างใน
              </p>
              <span className="text-xs font-bold text-brand-pink font-display">
                “เกิดใหม่จากข้างใน”
              </span>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center text-xl font-display font-black text-brand-green tracking-wide">
          เพราะเราเชื่อว่า: แบรนด์ที่มีชีวิต ต้องเริ่มจากคนที่มีชีวิต
        </div>
      </div>
    </section>
  );
}

export function ZombieSignals() {
  return (
    <section
      id="zombie-signals"
      className="py-24 px-6 relative bg-brand-white text-brand-black border-b border-brand-border"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-brand-pink text-xs font-bold tracking-widest uppercase block font-display">
              01 — คุณกำลังมี “Zombie Organization” หรือเปล่า?
            </span>
            <h2 className="text-3xl sm:text-5xl font-sans font-extrabold leading-tight">
              คนในองค์กรไม่ได้แย่ลง แต่พวกเขาอาจกำลัง{" "}
              <span className="text-brand-pink">“หมดชีวิต”</span> กับการทำงาน
            </h2>
            <p className="text-brand-gray leading-relaxed">
              งานยังดำเนินไปได้ปกติ แต่หากสังเกตดีๆ
              พลังงานสร้างสรรค์ในองค์กรของคุณกำลังหดหายและกลายเป็นซอมบี้ไปทีละส่วน
            </p>
            <div className="p-6 rounded-lg border border-brand-pink/20 bg-brand-pink/5 relative overflow-hidden">
              <h4 className="text-sm font-bold text-brand-black mb-1">
                🚨 สิ่งที่น่ากลัวที่สุดไม่ใช่คนลาออก...
              </h4>
              <p className="text-brand-pink font-display font-black text-xl md:text-2xl leading-snug">
                แต่คือ... คนยังอยู่ แต่ใจไม่ได้อยู่กับองค์กรแล้ว
              </p>
            </div>
          </div>

          {/* Symptoms Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "มาทำงานตรงเวลา แต่ทำแค่ตามหน้าที่",
              "ประชุมเยอะ แต่ไม่มีไอเดียใหม่",
              "ทุกคนทำงานของตัวเอง แต่ไม่รู้สึกเป็นทีม",
              "ไม่ค่อยกล้าเสนอความคิดเห็น",
              "ต้องคอยกระตุ้นตลอด",
              "คนเก่งเริ่มหมดไฟ",
              "งานยังเดิน แต่ไม่มีพลัง",
              "ทุกคนรอวันหยุด",
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-md bg-brand-surface border border-brand-border hover:border-brand-pink/25 transition-all flex items-start gap-3"
              >
                <span className="w-5 h-5 rounded-full bg-brand-pink/15 text-brand-pink flex items-center justify-center text-xs shrink-0 mt-0.5">
                  🧟
                </span>
                <span className="text-sm sm:text-base text-brand-gray font-medium">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function WhatIsChoomchamHouse() {
  return (
    <section
      id="rebirth-house"
      className="py-24 px-6 bg-brand-white text-brand-black border-b border-brand-border"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-brand-purple text-xs font-bold tracking-widest uppercase block font-display">
            03 — CHOOMCHAM HOUSE คืออะไร?
          </span>
          <h2 className="text-3xl sm:text-5xl font-sans font-extrabold mb-4 mt-2">
            บ้านสำหรับการเกิดใหม่ของคนทำงาน
          </h2>
          <p className="text-brand-gray text-base sm:text-lg max-w-2xl mx-auto">
            เราออกแบบประสบการณ์การเรียนรู้และการพัฒนาคน
            สำหรับองค์กรที่ต้องการให้คน “เปลี่ยนจากข้างใน”
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 p-8 rounded-lg bg-brand-surface border border-brand-border">
            <h4 className="text-lg font-bold mb-4 text-brand-purple font-display">
              ไม่ใช่แค่กลับไปทำงานเก่งขึ้น...
            </h4>
            <p className="text-brand-gray text-sm leading-relaxed mb-6">
              แต่เป็นการกลับไปแบบมีพลังชีวิต มีความสัมพันธ์ที่ดีกับคนรอบข้าง
              และต้องการขับเคลื่อนสิ่งใหม่ร่วมกันอย่างแท้จริง
            </p>
            <div className="w-16 h-1 bg-brand-pink rounded-full"></div>
          </div>

          {/* Qualities list */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "มีพลังขึ้น",
                desc: "ปลุกจิตวิญญาณแห่งความตื่นตัว ฟื้นคืนไฟแรงบันดาลใจ",
              },
              {
                title: "เชื่อมกันมากขึ้น",
                desc: "สลายกำแพงแผนก คุยกันลึกซึ้งด้วยความเข้าใจ",
              },
              {
                title: "กล้าคิดมากขึ้น",
                desc: "สลายความกลัวการล้มเหลว กล้าปลดปล่อยพลังจินตนาการ",
              },
              {
                title: "กล้าสร้างมากขึ้น",
                desc: "มีสภาวะผู้เริ่มทำ ลงมือสร้างสรรค์สิ่งใหม่แบบเชิงรุก",
              },
              {
                title: "อยากมีส่วนร่วมกับองค์กรอีกครั้ง",
                desc: "เชื่อมโยงความเชื่อมั่นเข้ากับเป้าหมายองค์กร",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-lg bg-brand-surface border border-brand-border hover:border-brand-purple/20 transition-all ${
                  idx === 4 ? "sm:col-span-2" : ""
                }`}
              >
                <h4 className="font-display font-bold text-lg text-brand-purple mb-1.5 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-pink" /> {item.title}
                </h4>
                <p className="text-brand-gray text-xs sm:text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function RebirthLearningFramework() {
  return (
    <section
      id="learning-framework"
      className="py-24 px-6 bg-brand-white text-brand-black border-b border-brand-border relative"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-brand-pink text-xs font-bold tracking-widest uppercase block mb-3 font-display">
            06 — เราไม่ได้ทำ Training แบบเดิม
          </span>
          <h2 className="text-3xl sm:text-5xl font-sans font-extrabold mb-6 leading-tight mt-2">
            เพราะคนไม่ได้เปลี่ยนเพราะ “ฟังเก่งขึ้น”
          </h2>
          <p className="text-brand-gray text-base sm:text-lg max-w-2xl mx-auto">
            คนเปลี่ยนเมื่อเขารู้สึก เห็น เข้าใจ
            และเกิดการตัดสินใจนำไปลงมือทำด้วยตนเอง
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
          <div className="space-y-6">
            <p className="text-brand-gray text-sm sm:text-base leading-relaxed">
              พนักงานจะเกิดการมีส่วนร่วมและตกผลึกจนเปลี่ยนสภาวะในที่ทำงานได้จริง
              ต้องผ่าน 4 จุดสัมผัสความรู้สึก:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4.5 rounded-md bg-brand-surface border border-brand-border">
                <span className="text-brand-pink font-display font-bold text-base block mb-1">
                  รู้สึกบางอย่าง
                </span>
                <span className="text-brand-gray text-xs">
                  เกิดความเข้าใจและอารมณ์ร่วมภายใน
                </span>
              </div>
              <div className="p-4.5 rounded-md bg-brand-surface border border-brand-border">
                <span className="text-brand-yellow font-display font-bold text-base block mb-1">
                  เห็นบางอย่าง
                </span>
                <span className="text-brand-gray text-xs">
                  มองเห็นความผิดปกติและทางออกในสภาวะจริง
                </span>
              </div>
              <div className="p-4.5 rounded-md bg-brand-surface border border-brand-border">
                <span className="text-brand-blue font-display font-bold text-base block mb-1">
                  เข้าใจบางอย่าง
                </span>
                <span className="text-brand-gray text-xs">
                  เข้าใจความหมายในภาพใหญ่และการประสาน
                </span>
              </div>
              <div className="p-4.5 rounded-md bg-brand-pink/5 border border-brand-pink/20 text-brand-pink">
                <span className="font-display font-bold text-base block mb-1">
                  ตัดสินใจทำบางอย่าง
                </span>
                <span className="text-xs">
                  ลงมือเปลี่ยนพฤติกรรมด้วยพลังสมัครใจ
                </span>
              </div>
            </div>
          </div>

          {/* Choomcham formula box */}
          <div className="p-8 rounded-lg bg-brand-surface border border-brand-border relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-pink/5 rounded-full blur-[80px] pointer-events-none"></div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-purple mb-6 font-display">
              ⚡ Choomcham Learning Framework:
            </h4>
            <div className="space-y-4 text-xs sm:text-sm font-semibold">
              <div className="p-3 bg-brand-white rounded-md border border-brand-border flex items-center justify-between">
                <span>Learning + Experience</span>
                <span className="text-brand-pink font-bold">+</span>
              </div>
              <div className="p-3 bg-brand-white rounded-md border border-brand-border flex items-center justify-between">
                <span>Reflection + Connection</span>
                <span className="text-brand-yellow font-bold">+</span>
              </div>
              <div className="p-3 bg-brand-green/10 rounded-md border border-brand-green/20 text-brand-green flex items-center justify-between">
                <span>Action (ลงมือจริง)</span>
                <span className="font-bold">= Reborn</span>
              </div>
            </div>
            <p className="text-brand-gray text-xs leading-relaxed mt-6">
              *เพื่อสร้างความเปลี่ยนแปลงที่ยังอยู่กับทีมงานหลังจบการอบรม
              ไม่หายไปเมื่อเดินออกจากห้องเรียน
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
