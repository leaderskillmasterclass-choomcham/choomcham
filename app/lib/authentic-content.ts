export const ORGANIZATION_PAINS = [
  "คนเก่ง แต่สื่อสารกันไม่รู้เรื่อง",
  "แต่ละทีมเก่ง แต่ต่างคนต่างทำ",
  "พนักงานรอคำสั่ง มากกว่ารู้สึกเป็นเจ้าของ",
  "หัวหน้าเก่งงาน แต่ยังไม่รู้ว่าจะนำ “คน” อย่างไร",
  "มี Vision / Core Values แต่ไม่เกิดขึ้นในการทำงานจริง",
];
export const AUTHENTIC_LEVELS = [
  {
    slug: "reborn",
    code: "REBORN",
    number: "01",
    title: "ตัวจริงของตัวเอง",
    color: "purple",
    intro: "ก่อนพัฒนางาน ต้องเริ่มจากการเข้าใจ “คนที่ทำงาน”",
    paragraphs: [
      "ค้นหาจุดแข็ง คุณค่า Mindset และบทบาทของตัวเอง",
      "ให้แต่ละคนมองเห็นว่า “ฉันมีคุณค่าอะไร และฉันมีที่ยืนตรงไหนในองค์กรนี้”",
      "เพราะคนที่เห็นคุณค่าของตัวเอง จะสามารถนำศักยภาพออกมาใช้ได้ชัดเจนขึ้น",
    ],
    from: "ฉันคือใคร?",
    to: "ฉันมีคุณค่าและที่ยืนในองค์กร",
  },
  {
    slug: "communication",
    code: "COMMUNICATION",
    number: "02",
    title: "ตัวจริงที่สื่อสารเป็น",
    color: "pink",
    intro:
      "หลายปัญหาในองค์กรไม่ได้เกิดจากคนไม่เก่ง แต่เกิดจาก “คนเก่งคุยกันไม่รู้เรื่อง”",
    paragraphs: [
      "พัฒนาการฟัง การสื่อสารอย่างเข้าใจ การ Feedback และการทำงานกับคนที่แตกต่าง",
    ],
    from: "ฉันเข้าใจของฉัน",
    to: "เราเข้าใจตรงกัน",
  },
  {
    slug: "team",
    code: "TEAM",
    number: "03",
    title: "ตัวจริงที่สร้างทีมเป็น",
    color: "green",
    intro:
      "องค์กรไม่ได้โตเพราะมี Hero เก่งอยู่ไม่กี่คน แต่โตเมื่อ “คนเก่งสามารถเก่งไปด้วยกัน”",
    paragraphs: [
      "สร้าง Trust Ownership Collaboration และ Shared Goal",
      "ให้แต่ละคนมองเห็นว่า งานของตัวเองเชื่อมโยงกับเป้าหมายใหญ่ขององค์กรอย่างไร",
    ],
    from: "นี่คืองานของฉัน",
    to: "นี่คือเป้าหมายของเรา",
  },
  {
    slug: "leader",
    code: "LEADER",
    number: "04",
    title: "ตัวจริงที่นำคนเป็น",
    color: "yellow",
    intro: "“เก่งงาน” ไม่ได้แปลว่า “นำคนเป็น”",
    paragraphs: [
      "พัฒนาหัวหน้าและ Future Leader ให้เข้าใจทั้ง งาน + คน",
      "เรียนรู้การสื่อสาร การ Feedback การสร้างแรงขับเคลื่อน และการดึงศักยภาพของทีมออกมา",
    ],
    from: "ทำงานเก่ง",
    to: "ทำให้คนอื่นเก่งขึ้นได้",
  },
  {
    slug: "culture",
    code: "CULTURE",
    number: "05",
    title: "องค์กรที่ “ตัวจริง” มีที่ยืน",
    color: "blue",
    intro: "Culture ที่แข็งแรงไม่ได้เกิดจากคำสวย ๆ บนกำแพง",
    paragraphs: [
      "แต่เกิดจากวิธีคิด วิธีพูด วิธีตัดสินใจ วิธีทำงาน และวิธีที่คนปฏิบัติต่อกัน",
      "จนคนในองค์กรตอบได้ว่า “พวกเราคือใคร” “พวกเราเชื่ออะไร” และ “พวกเราทำงานกันแบบไหน”",
      "เปลี่ยน Core Values",
    ],
    from: "สิ่งที่องค์กรเขียนไว้",
    to: "สิ่งที่คนในองค์กรทำจริง",
  },
] as const;
export const DESIGN_CONTEXT = [
  "ปัญหาที่องค์กรกำลังเจอ",
  "เป้าหมายของผู้บริหาร",
  "กลุ่มผู้เข้าอบรม",
  "วัฒนธรรมองค์กร",
  "ผลลัพธ์ที่ต้องการ",
];
export const TRAINING_FORMATS = [
  "In-house Training",
  "Communication Workshop",
  "Team Development",
  "Leadership Development",
  "Future Leader Program",
  "Culture Workshop",
  "Customized Organization Program",
];
export const ORGANIZATION_FIT = [
  "มีคนเก่ง แต่ Collaboration ยังไม่แข็งแรง",
  "ทีมต่างคนต่างทำ และต้องการสร้าง Shared Goal",
  "ต้องการเพิ่ม Ownership ให้พนักงาน",
  "กำลังพัฒนา Middle Management / Future Leader",
  "หัวหน้าเก่งงาน แต่ต้องการพัฒนาทักษะการนำคน",
  "ต้องการยกระดับ Communication ภายในองค์กร",
  "มี Vision / Mission / Core Values แต่ต้องการทำให้เกิดขึ้นในการทำงานจริง",
  "องค์กรกำลังโต และต้องการให้ “คน” โตทันธุรกิจ",
];
export const DESIRED_OUTCOMES = [
  "เข้าใจตัวเองมากขึ้น",
  "สื่อสารกันดีขึ้น",
  "Feedback กันเป็นขึ้น",
  "เข้าใจความแตกต่างของคนมากขึ้น",
  "มี Ownership กับงานมากขึ้น",
  "ทำงานร่วมกันได้ดีขึ้น",
  "หัวหน้านำคนได้ดีขึ้น",
  "ทั้งทีมเห็นเป้าหมายเดียวกันชัดขึ้น",
];
export const SELECTED_EXPERIENCE = [
  {
    name: "มาดามฟิน",
    tag: "CONTENT DIRECTION",
    before: "จากการทำ Content ที่ยังขาด Direction",
    after: "สู่การทำให้ทีมเห็นเป้าหมายและทิศทางของการสื่อสารชัดขึ้น",
  },
  {
    name: "กังนัมคลินิก",
    tag: "BRAND VALUE",
    before: "จาก Brand Value ที่ต้องการส่งต่อให้คนในองค์กร",
    after: "สู่การทำให้ทีมเข้าใจและสื่อสารคุณค่าของแบรนด์ได้ชัดเจนขึ้น",
  },
];
export const LEGACY_SERVICE_HASHES = new Set([
  "#zombie-check",
  "#zombie-signals",
  "#pain",
  "#belief",
  "#model",
  "#gallery",
  "#work",
  "#why",
  "#learning-framework",
  "#rebirth-house",
  "#faq",
]);
