export interface GrowthProgram {
  slug: string; level: string; code: string; title: string; hook: string; description: string;
  audience: string; pains: string[]; objectives: string[]; deliverables: string[];
  modules: { title: string; activity: string; output: string }[];
  measures: string[]; duration: string; accent: string;
}

// Proposed learning architecture. Scope, schedule and fees are confirmed after discovery.
export const GROWTH_PROGRAMS: GrowthProgram[] = [
  {
    slug: "reborn", level: "LEVEL 1", code: "REBORN", title: "ตัวจริงของตัวเอง",
    hook: "ก่อนพัฒนางาน เริ่มจากคนที่รู้ว่าตัวเองมีคุณค่าอะไร",
    description: "ค้นพบจุดแข็ง คุณค่า และบทบาท เชื่อมความหมายของตัวเองกับงานที่ทำ เพื่อเริ่มเติบโตจากข้างใน",
    audience: "พนักงานทุกระดับ ทีมที่กำลังเปลี่ยนแปลง และบุคลากรที่ต้องการทบทวนบทบาทการทำงาน",
    pains: ["ทำงานไปวัน ๆ แต่ไม่เห็นความหมาย", "มีศักยภาพ แต่ไม่มั่นใจที่จะนำออกมาใช้", "ไม่ชัดว่าตัวเองมีส่วนต่อเป้าหมายทีมอย่างไร"],
    objectives: ["ระบุจุดแข็งและคุณค่าของตนเองพร้อมตัวอย่างจากงานจริง", "อธิบายความเชื่อมโยงระหว่างบทบาทตนกับเป้าหมายองค์กร", "ออกแบบพฤติกรรมใหม่ที่ลงมือทำและติดตามได้"],
    modules: [
      { title: "รู้จักตัวจริง", activity: "ทบทวนประสบการณ์ที่มีความหมายและสะท้อนจุดแข็งเป็นคู่", output: "แผนที่จุดแข็งและคุณค่าส่วนบุคคล" },
      { title: "เชื่อมตัวเองกับงาน", activity: "สำรวจความเชื่อที่จำกัดตัวเองและเชื่อมบทบาทกับผู้ได้รับประโยชน์", output: "แผนที่คุณค่าของบทบาท" },
      { title: "ก้าวแรกของการเกิดใหม่", activity: "เลือกสถานการณ์จริง ฝึกเปลี่ยนมุมมอง และวางแผนทดลอง", output: "แผนปฏิบัติการส่วนบุคคล 30 วัน" },
    ],
    deliverables: ["Strength & Value Map", "Role Contribution Canvas", "แผนทดลองพฤติกรรมและแบบสะท้อนการเรียนรู้"],
    measures: ["ความชัดเจนเรื่องจุดแข็งและบทบาทก่อน–หลัง", "หลักฐานการนำจุดแข็งไปใช้จากแผน 30 วัน", "การสะท้อนผลร่วมกับหัวหน้าหรือคู่เรียนรู้"],
    duration: "Workshop 1 วัน หรือแบ่งเป็นช่วงเรียนรู้ รวมประมาณ 6 ชั่วโมง", accent: "#4044A5",
  },
  {
    slug: "communication", level: "LEVEL 2", code: "COMMUNICATION", title: "ตัวจริงที่สื่อสารเป็น",
    hook: "จากฉันเข้าใจของฉัน สู่เรากำลังเข้าใจเรื่องเดียวกัน",
    description: "ฝึกฟังให้เข้าใจ พูดให้ชัด และให้ Feedback ที่นำไปใช้ได้ ผ่านสถานการณ์การทำงานจริง",
    audience: "พนักงาน หัวหน้างาน และทีมที่ต้องประสานงานหรือสื่อสารข้ามความแตกต่าง",
    pains: ["คุยเรื่องเดียวกันแต่เข้าใจคนละอย่าง", "Feedback กลายเป็นความขัดแย้งหรือความเงียบ", "คนในทีมไม่กล้าถามหรือเสนอความคิดเห็น"],
    objectives: ["ฟังและสรุปความเข้าใจโดยแยกข้อเท็จจริงออกจากการตีความ", "สื่อสารความต้องการและข้อตกลงในการทำงานอย่างชัดเจน", "ฝึก Feedback ที่ระบุสถานการณ์ พฤติกรรม และแนวทางไปต่อ"],
    modules: [
      { title: "ฟังให้ถึงคน", activity: "Active Listening และฝึกทวนความเข้าใจในคู่สนทนา", output: "Listening Checklist" },
      { title: "พูดให้ถึงเป้าหมาย", activity: "ออกแบบข้อความและคำถามจากโจทย์ประสานงานจริง", output: "Conversation Canvas" },
      { title: "Feedback ที่พาไปต่อ", activity: "ฝึกบทสนทนา STAR Feedback และทบทวนกับเพื่อน", output: "Feedback Script และข้อตกลงการสื่อสาร" },
    ],
    deliverables: ["แบบฝึกฟังและทวนความเข้าใจ", "บทสนทนา Feedback จากกรณีขององค์กร", "กติกาการสื่อสารที่ทีมร่วมออกแบบ"],
    measures: ["Rubric การฟังและความชัดเจนจาก role-play", "คุณภาพข้อตกลงที่ได้จากบทสนทนา", "ติดตามตัวอย่างบทสนทนาที่นำไปใช้หลังอบรม"],
    duration: "Workshop 1 วัน และเลือกเพิ่มช่วงฝึกติดตามผล", accent: "#C82358",
  },
  {
    slug: "team", level: "LEVEL 3", code: "TEAM", title: "ตัวจริงที่สร้างทีมเป็น",
    hook: "จากฉันทำงานของฉัน สู่เป้าหมายที่เรารับผิดชอบร่วมกัน",
    description: "สร้างความไว้ใจ ความชัดเจนในบทบาท และ Ownership เพื่อเชื่อมทีมข้ามกำแพงแผนก",
    audience: "ทีมงานเดียวกัน ทีมข้ามสายงาน และทีมโครงการที่ต้องส่งมอบผลลัพธ์ร่วมกัน",
    pains: ["ต่างคนต่างทำและส่งต่องานโดยไม่เห็นภาพรวม", "บทบาททับซ้อนหรือไม่มีผู้รับผิดชอบชัดเจน", "ทีมไม่พูดถึงปัญหาจนกระทบผลลัพธ์"],
    objectives: ["ระบุเป้าหมายร่วมและสิ่งที่แต่ละบทบาทต้องส่งมอบ", "สร้างกติกาที่ช่วยให้ทีมถาม ขอความช่วยเหลือ และเรียนรู้จากข้อผิดพลาด", "ออกแบบการทดลองทำงานร่วมกันจากโจทย์จริง"],
    modules: [
      { title: "Reconnect ทีม", activity: "แลกเปลี่ยนมุมมองและจำลองงานที่ต้องพึ่งพากัน", output: "แผนที่ความสัมพันธ์และจุดติดขัด" },
      { title: "Shared Goal & Ownership", activity: "ทำ Team Canvas และตกลงบทบาทในการส่งต่องาน", output: "Team Charter และ Role Map" },
      { title: "ทีมที่เรียนรู้ร่วมกัน", activity: "ฝึก retrospective และออกแบบการทดลองปรับวิธีทำงาน", output: "Team Experiment 30 วัน" },
    ],
    deliverables: ["Team Charter", "ข้อตกลงบทบาทและการประสานงาน", "แผนทดลองของทีมและแบบ retrospective"],
    measures: ["ความชัดเจนเรื่องเป้าหมายและบทบาทก่อน–หลัง", "หลักฐานการใช้ข้อตกลงในงานจริง", "ตัวชี้วัดงานร่วมที่ตกลงกับองค์กร เช่น รอบส่งต่องาน"],
    duration: "Workshop 1–2 วัน พร้อมทางเลือกติดตามการทดลองของทีม", accent: "#8A6500",
  },
  {
    slug: "leader", level: "LEVEL 4", code: "LEADER", title: "ตัวจริงที่นำคนเป็น",
    hook: "จากหัวหน้าที่แบกทุกอย่าง สู่ผู้นำที่ทำให้คนเติบโต",
    description: "พัฒนาการตระหนักรู้ตนเอง การโค้ช การมอบหมายงาน และการให้ Feedback เพื่อสร้างทีมที่รับผิดชอบได้",
    audience: "หัวหน้างาน Team Lead ผู้จัดการ และบุคลากรที่กำลังเตรียมบทบาทผู้นำ",
    pains: ["หัวหน้าแก้ทุกเรื่องจนไม่มีเวลาพัฒนาทีม", "มอบหมายงานแล้วต้องกลับมาทำเอง", "คุยเรื่องผลงานยากและทีมรอคำสั่ง"],
    objectives: ["ระบุรูปแบบการนำและผลที่มีต่อทีม", "ฝึกคำถามโค้ชและ Feedback ในสถานการณ์จริง", "มอบหมายงานโดยกำหนดผลลัพธ์ อำนาจตัดสินใจ และจุดติดตาม"],
    modules: [
      { title: "รู้ทันตัวเองในฐานะผู้นำ", activity: "สะท้อนเหตุการณ์กดดันและรูปแบบการตอบสนอง", output: "Leadership Reflection Map" },
      { title: "นำผ่านบทสนทนา", activity: "ฝึก coaching triad และ performance conversation", output: "แนวทางสนทนาแบบโค้ช" },
      { title: "มอบหมายให้เติบโต", activity: "ออกแบบการมอบหมายงานจริงและ peer consultation", output: "Delegation Canvas และแผนพัฒนาทีม" },
    ],
    deliverables: ["Leadership Development Plan", "Coaching & Feedback Toolkit", "ข้อตกลงมอบหมายงานและแผนติดตาม"],
    measures: ["Rubric ทักษะโค้ชและมอบหมายงานจากการฝึก", "Feedback จากทีมตามเกณฑ์ที่ตกลง", "ติดตามการทดลองใช้พฤติกรรมผู้นำในงานจริง"],
    duration: "Workshop 2 วัน หรือ Learning Journey แบบแบ่งช่วง", accent: "#087D67",
  },
  {
    slug: "culture", level: "LEVEL 5", code: "CULTURE", title: "องค์กรที่ตัวจริงมีที่ยืน",
    hook: "ทำให้ค่านิยมออกจากกำแพง มาอยู่ในวิธีทำงานทุกวัน",
    description: "ร่วมแปล Core Values เป็นพฤติกรรม วิธีตัดสินใจ และกิจวัตรที่องค์กรนำไปใช้และติดตามได้",
    audience: "ผู้บริหาร HR / People & Culture และตัวแทนทีมที่ร่วมขับเคลื่อนวัฒนธรรม",
    pains: ["มี Core Values แต่แต่ละทีมตีความไม่ตรงกัน", "พฤติกรรมที่องค์กรส่งเสริมไม่สอดคล้องกับสิ่งที่ประกาศ", "กิจกรรมวัฒนธรรมจบแล้วไม่เชื่อมกับงานประจำ"],
    objectives: ["แปลงค่านิยมเป็นพฤติกรรมที่สังเกตได้", "ออกแบบกิจวัตรที่สนับสนุนความไว้ใจและการเรียนรู้", "กำหนดเจ้าของงานและหลักฐานติดตาม Culture Pilot"],
    modules: [
      { title: "เห็นวัฒนธรรมที่เป็นจริง", activity: "สำรวจเหตุการณ์ วิธีตัดสินใจ และประสบการณ์ของคนในองค์กร", output: "Culture Reality Map" },
      { title: "Values into Behaviors", activity: "ร่วมออกแบบตัวอย่างพฤติกรรมและสิ่งที่ไม่สอดคล้องกับค่านิยม", output: "Behavior Playbook" },
      { title: "Culture in Action", activity: "เลือกทีมทดลอง ออกแบบ rituals และวิธีรับฟังผล", output: "Culture Pilot Roadmap" },
    ],
    deliverables: ["Values-to-Behavior Matrix", "Culture Rituals & Playbook", "Pilot Roadmap พร้อมผู้รับผิดชอบและเกณฑ์ติดตาม"],
    measures: ["ความชัดเจนและความสอดคล้องของพฤติกรรมกับ Values", "การใช้กิจวัตรใหม่ในทีมทดลอง", "Pulse Feedback และหลักฐานพฤติกรรมระหว่าง Pilot"],
    duration: "Discovery + Co-design Workshop + Pilot ตามขอบเขตที่ตกลง", accent: "#247DA2",
  },
  {
    slug: "from-zombie-to-living-organization", level: "FLAGSHIP", code: "LIVING ORGANIZATION", title: "From Zombie to Living Organization",
    hook: "ชุบชีวิตคน เชื่อมพลังทีม และสร้างองค์กรที่เติบโตจากข้างใน",
    description: "หลักสูตรเรือธงในการชุบชีวิตคน ทีม และองค์กร เปลี่ยนภาวะหมดไฟเฉื่อยชา สู่องค์กรตัวจริงที่มีพลังสร้างสรรค์ ผ่านเส้นทางพัฒนาที่เลือกให้ตรงโจทย์องค์กร",
    audience: "องค์กรที่ต้องการพัฒนาคน ทีม ผู้นำ และวัฒนธรรมอย่างเชื่อมโยง โดยมีผู้สนับสนุนโครงการและทีม HR ร่วมขับเคลื่อน",
    pains: ["คนยังทำงาน แต่พลังและความหมายค่อย ๆ หายไป", "ทีมติด Silo ผู้นำแบกงาน และความไว้ใจลดลง", "ต้องการเปลี่ยนแปลงต่อเนื่องมากกว่ากิจกรรมครั้งเดียว"],
    objectives: ["ร่วมระบุโจทย์และจุดเริ่มต้นของการเปลี่ยนแปลง", "เชื่อมพฤติกรรมส่วนบุคคล การสื่อสาร ทีม และผู้นำกับเป้าหมายองค์กร", "ทดลองวิธีทำงานใหม่และติดตามหลักฐานก่อนขยายผล"],
    modules: [
      { title: "REBORN PEOPLE · Level 1", activity: "Reset ความเชื่อ สำรวจคุณค่าและบทบาท แล้ว Recharge พลังการทำงาน", output: "Individual Growth Plan" },
      { title: "ALIVE TEAM · Levels 2–3", activity: "Reconnect ผ่านการฟัง Feedback และเป้าหมายร่วม", output: "Team Charter และ Collaboration Experiment" },
      { title: "REBORN LEADER · Level 4", activity: "Reimagine การนำคนผ่านการโค้ชและการมอบหมายงาน", output: "Leadership Action Plan" },
      { title: "LIVING CULTURE · Level 5", activity: "Recreate พฤติกรรมและกิจวัตร พร้อมทดลองในงานจริง", output: "Culture Pilot และแผนขยายผล" },
    ],
    deliverables: ["Discovery Brief และ Learning Journey ขององค์กร", "แผนปฏิบัติการระดับคน ทีม และผู้นำ", "Culture Pilot Roadmap และรายงานติดตามตามขอบเขต"],
    measures: ["Baseline ที่ร่วมกำหนดก่อนเริ่มโครงการ", "หลักฐานการทดลองพฤติกรรมของแต่ละโมดูล", "Review ผลกับผู้สนับสนุนโครงการก่อนขยายผล"],
    duration: "ออกแบบเป็น Learning Journey หลายช่วง พร้อม Pilot และ Review", accent: "#4044A5",
  },
];

export const getProgram = (slug: string | null | undefined) => GROWTH_PROGRAMS.find(program => program.slug === slug);
export const programUrl = (slug: string) => `/programs/${slug}`;
export const requestUrl = (slug: string) => `/proposal/request?program=${encodeURIComponent(slug)}`;
