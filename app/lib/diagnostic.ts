// 7 Dimensions Definition & Question Mapping
export interface DiagnosticDimension {
  id: string;
  nameTh: string;
  nameEn: string;
  description: string;
  iconName: string;
  maxScore: number;
}

export const DIAGNOSTIC_DIMENSIONS: Record<string, DiagnosticDimension> = {
  energy: {
    id: "energy",
    nameTh: "พลังงานในการทำงาน",
    nameEn: "Energy & Vitality",
    description: "ระดับพลังกาย พลังใจ และความสดชื่นในการเริ่มต้นทำงานแต่ละวัน",
    iconName: "Zap",
    maxScore: 8,
  },
  meaning: {
    id: "meaning",
    nameTh: "ความหมายและเป้าหมาย",
    nameEn: "Purpose & Meaning",
    description: "ความเข้าใจในคุณค่าของงานที่ทำ และการเชื่อมโยงกับเป้าหมายชีวิต",
    iconName: "Compass",
    maxScore: 8,
  },
  connection: {
    id: "connection",
    nameTh: "ความสัมพันธ์และความไว้ใจ",
    nameEn: "Connection & Trust",
    description: "ความผูกพัน ความจริงใจ และการร่วมมือกันข้ามทีมโดยไร้กำแพง Silo",
    iconName: "Heart",
    maxScore: 8,
  },
  voice: {
    id: "voice",
    nameTh: "ความกล้าแสดงความคิดเห็น",
    nameEn: "Open Voice & Feedback",
    description: "การกล้าพูด กล้าเสนอไอเดีย และความโปร่งใสในการสื่อสารทุกระดับ",
    iconName: "MessageSquare",
    maxScore: 8,
  },
  psychological_safety: {
    id: "psychological_safety",
    nameTh: "ความปลอดภัยทางจิตวิทยา",
    nameEn: "Psychological Safety",
    description: "บรรยากาศที่ทุกคนกล้าทดลอง ไม่กลัวการทำผิด และไม่มีการชี้นิ้วหาคนผิด",
    iconName: "ShieldCheck",
    maxScore: 8,
  },
  ownership: {
    id: "ownership",
    nameTh: "ความรู้สึกเป็นเจ้าของร่วม",
    nameEn: "Ownership & Proactivity",
    description: "ความกระตือรือร้นในการลงมือทำ แก้ปัญหาเชิงรุกโดยไม่ต้องรอคำสั่ง",
    iconName: "Target",
    maxScore: 8,
  },
  creativity: {
    id: "creativity",
    nameTh: "พลังการสร้างสรรค์สิ่งใหม่",
    nameEn: "Creativity & Innovation",
    description: "ความยืดหยุ่นในการปรับตัว และพลังในการริเริ่มนวัตกรรม",
    iconName: "Sparkles",
    maxScore: 8,
  },
};

export interface QuestionOption {
  text: string;
  score: number; // 1 - 4
}

export interface QuizQuestion {
  id: number;
  dimensionId: keyof typeof DIAGNOSTIC_DIMENSIONS;
  question: string;
  answers: QuestionOption[];
}

export const ZOMBIE_7D_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    dimensionId: "energy",
    question: "เช้าวันจันทร์ ในออฟฟิศของคุณ บรรยากาศส่วนใหญ่เป็นอย่างไร?",
    answers: [
      { text: "ซึมเศร้าเหมือนเดินอยู่ใน The Walking Dead ทุกคนจ้องจอเงียบงันสะท้อนความเหี่ยวเฉา", score: 1 },
      { text: "ทุกคนรีบเดินเข้าห้องทำงานตัวเอง หลีกเลี่ยงการสบตาและการคุยกันโดยไม่จำเป็น", score: 2 },
      { text: "ทักทายกันพอเป็นพิธีตามมารยาท แต่หน้าตาดูไม่มีความสุข", score: 3 },
      { text: "เต็มไปด้วยพลังงานบวก ทักทายกันด้วยรอยยิ้มและเสียงหัวเราะอย่างเป็นธรรมชาติ", score: 4 }
    ]
  },
  {
    id: 2,
    dimensionId: "voice",
    question: "เมื่อมีการประชุมทีม ไอเดียใหม่ๆ หรือการแลกเปลี่ยนความเห็นเกิดขึ้นบ่อยแค่ไหน?",
    answers: [
      { text: "เงียบกริบเหมือนป่าช้า... ทุกคนพยักหน้าเห็นด้วยเพื่อรีบจบการประชุมและแยกย้าย", score: 1 },
      { text: "หัวหน้าพูดคนเดียว 90% ของเวลา ที่เหลือฟังอย่างเดียวและจดบันทึก", score: 2 },
      { text: "มีเสนอไอเดียบ้าง แต่เป็นไอเดียเดิมๆ ที่ปลอดภัยและไม่เสี่ยงต่อการโดนวิจารณ์", score: 3 },
      { text: "ไอเดียพรั่งพรู ทุกคนกล้าเสนอความคิดเห็น กล้าทดลอง และกล้าท้าทายกันอย่างสร้างสรรค์", score: 4 }
    ]
  },
  {
    id: 3,
    dimensionId: "psychological_safety",
    question: "เวลาเกิดข้อผิดพลาดหรือปัญหาในงาน ทีมของคุณมีปฏิกิริยาอย่างไร?",
    answers: [
      { text: "ชี้นิ้วหาคนผิดทันที และหาทางปัดความรับผิดชอบให้พ้นตัวโดยเร็วที่สุด", score: 1 },
      { text: "พยายามปิดบังซ่อนปัญหาไว้ใต้พรมจนกว่าจะทนไม่ไหวและเกิดระเบิดขึ้น", score: 2 },
      { text: "รายงานปัญหาตามระบบ ส่งอีเมลอย่างเป็นทางการ แต่ต่างคนต่างแก้ในส่วนตัวเอง", score: 3 },
      { text: "เผชิญหน้าร่วมมือกันทันที วิเคราะห์หาสาเหตุจริงเพื่อแก้ไขและเรียนรู้ร่วมกันโดยไม่มีกำแพงแผนก", score: 4 }
    ]
  },
  {
    id: 4,
    dimensionId: "ownership",
    question: "ลักษณะการทำงานของพนักงานในองค์กรของคุณเป็นแบบใด?",
    answers: [
      { text: "ทำงานเหมือนหุ่นยนต์ สั่งอะไรทำแค่นั้น ไร้ความเห็น ไร้คำถาม และไร้การพัฒนาใดๆ", score: 1 },
      { text: "ทำตาม KPI ให้ผ่านไปวันๆ เพื่อเอาตัวรอด แต่ไม่เข้าใจหรือสนใจภาพใหญ่ขององค์กร", score: 2 },
      { text: "ตั้งใจทำงานตามหน้าที่ดี แต่ขาดความกระตือรือร้นและพลังริเริ่มสร้างสรรค์สิ่งใหม่", score: 3 },
      { text: "มีความรู้สึกเป็นเจ้าของงาน (Ownership) พร้อมลงมือทำ ทดลองสิ่งใหม่ และแก้ปัญหาเชิงรุก", score: 4 }
    ]
  },
  {
    id: 5,
    dimensionId: "connection",
    question: "ความร่วมมือกันระหว่างแผนกต่างๆ (Cross-functional Collaboration) เป็นอย่างไร?",
    answers: [
      { text: "ทำสงครามเย็นระหว่างแผนก โยนงาน ทะเลาะ และไม่ยอมแบ่งปันข้อมูลใดๆ", score: 1 },
      { text: "ประสานงานเฉพาะเท่าที่มีเอกสารส่งคำขออย่างเป็นทางการเท่านั้น ไม่อะลุ้มอล่วย", score: 2 },
      { text: "พูดคุยกันด้วยดีเมื่อเจอกัน แต่ลึกๆ ยังคงรักษาและปกป้องผลประโยชน์เฉพาะแผนกตัวเอง", score: 3 },
      { text: "ทำงานเชื่อมประสานเหมือนทีมเดียวกัน ช่วยเหลือเกื้อกูลเพื่อเป้าหมายรวมของบริษัท", score: 4 }
    ]
  },
  {
    id: 6,
    dimensionId: "meaning",
    question: "หัวหน้าทีมส่วนใหญ่ในองค์กรของคุณ ทำหน้าที่แบบใด?",
    answers: [
      { text: "คอยจับผิด ไมโครแมนเนจ สั่งงานและควบคุมแบบเบ็ดเสร็จทุกขั้นตอน", score: 1 },
      { text: "ทำตัวเหมือนเป็นบุรุษไปรษณีย์ ส่งผ่านคำสั่งจากเบื้องบนโดยไม่มีการแปลความหรือสร้างพลังใจ", score: 2 },
      { text: "คอยแก้ปัญหาเฉพาะหน้าให้ลูกน้อง เป็นนักดับเพลิงที่เหนื่อยและแบกรับความรับผิดชอบไว้คนเดียว", score: 3 },
      { text: "สร้างแรงบันดาลใจ สนับสนุน ปลดล็อกศักยภาพทีม และทำหน้าที่เป็นผู้นำแบบ Coach", score: 4 }
    ]
  },
  {
    id: 7,
    dimensionId: "creativity",
    question: "คนเก่งๆ มีฝีมือ (Talents) ในองค์กรของคุณมักจะอยู่ได้นานแค่ไหน?",
    answers: [
      { text: "เข้ามาแล้วหมดไฟและลาออกอย่างรวดเร็วภายใน 3-6 เดือนแรก", score: 1 },
      { text: "อยู่ไปสักพักแล้วไฟค่อยๆ มอดลง สุดท้ายกลายเป็นคนเฉื่อยชาไหลไปตามระบบ", score: 2 },
      { text: "อยู่ได้เรื่อยๆ เพราะเงินเดือนสวัสดิการดี แต่ไม่มีความรู้สึกตื่นเต้นท้าทายในงาน", score: 3 },
      { text: "เติบโตขึ้นเรื่อยๆ มีพื้นที่ให้สร้างผลงาน ได้เรียนรู้ และนำการขับเคลื่อนการเติบโตขององค์กร", score: 4 }
    ]
  },
  {
    id: 8,
    dimensionId: "creativity",
    question: "เมื่อองค์กรต้องเผชิญกับการเปลี่ยนแปลงเชิงโครงสร้างหรือระบบใหม่ คนตอบรับอย่างไร?",
    answers: [
      { text: "ต่อต้านอย่างรุนแรงแบบเงียบ บ่นในกลุ่มไลน์ลับ และปฏิเสธการปฏิบัติตาม", score: 1 },
      { text: "ยอมรับทำตามเพราะโดนบังคับ แต่เป็นการทำงานที่ปราศจากพลังและความใส่ใจ", score: 2 },
      { text: "คอยสังเกตการณ์อยู่ห่างๆ รอให้คนอื่นทำนำไปก่อน ค่อยๆ ปรับตัวตามอย่างช้าๆ", score: 3 },
      { text: "ตื่นเต้นกับการเปลี่ยนแปลง มองหาความท้าทาย และพร้อมทดลองคิดทำสิ่งใหม่ๆ ร่วมกัน", score: 4 }
    ]
  },
  {
    id: 9,
    dimensionId: "voice",
    question: "พนักงานระดับปฏิบัติการรู้สึกว่า 'เสียงหรือความคิดเห็น' ของพวกเขามีความหมายเพียงใด?",
    answers: [
      { text: "ไม่มีความหมายเลย พูดไปก็มีแต่ภัยเข้าตัว เงียบปากไว้คือทางรอดที่ดีที่สุด", score: 1 },
      { text: "มีกล่องรับฟังความคิดเห็น แต่ส่งไปแล้วก็เงียบหายเหมือนไม่มีอะไรเกิดขึ้น", score: 2 },
      { text: "หัวหน้ารับฟังในระดับแผนก แต่การตัดสินใจหลักของบริษัทมาจากผู้บริหารเบื้องบนเท่านั้น", score: 3 },
      { text: "เสียงทุกคนได้รับการใส่ใจ ความคิดเห็นดีๆ ถูกนำไปทดลองและเปลี่ยนเป็นแนวปฏิบัติจริง", score: 4 }
    ]
  },
  {
    id: 10,
    dimensionId: "energy",
    question: "ระดับพลังชีวิตของคนในองค์กรในตอนเย็นวันศุกร์ เป็นอย่างไร?",
    answers: [
      { text: "หมดสภาพเป็นศพเดินได้ ไร้พลังวิญญาณ นับถอยหลังรอเวลาเลิกงานตั้งแต่วันพุธ", score: 1 },
      { text: "รู้สึกโล่งอกที่รอดพ้นไปอีกหนึ่งสัปดาห์ แต่ก็เริ่มกังวลถึงวันจันทร์ล่วงหน้าตั้งแต่วันเสาร์", score: 2 },
      { text: "เหนื่อยล้าจากการทำงานปกติ แต่พึงพอใจและพร้อมใช้วันหยุดพักผ่อนเงียบๆ", score: 3 },
      { text: "มีความสุข ได้สร้างความสำเร็จร่วมกับทีม พลังงานยังเหลือล้นไปใช้ชีวิตและเรียนรู้เรื่องอื่น", score: 4 }
    ]
  }
];

export function calculateDimensionScores(answers: number[]) {
  const scores: Record<string, { current: number; max: number; percentage: number }> = {};
  
  Object.keys(DIAGNOSTIC_DIMENSIONS).forEach(dim => {
    scores[dim] = { current: 0, max: 0, percentage: 0 };
  });

  ZOMBIE_7D_QUESTIONS.forEach((q, idx) => {
    const ansScore = answers[idx] || 1;
    const dim = q.dimensionId;
    if (scores[dim]) {
      scores[dim].current += ansScore;
      scores[dim].max += 4;
    }
  });

  Object.keys(scores).forEach(dim => {
    if (scores[dim].max > 0) {
      scores[dim].percentage = Math.round((scores[dim].current / scores[dim].max) * 100);
    }
  });

  return scores;
}

export function getResultLevelInfo(totalScore: number) {
  if (totalScore >= 31) {
    return {
      level: "ALIVE",
      badge: "🌿 องค์กรมีชีวิต (Living Organization)",
      color: "emerald",
      bgClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      description: "องค์กรของคุณมีพลังชีวิตสูงมาก บุคลากรมี Connection มีความสุข และพร้อมสร้างสรรค์สิ่งใหม่ร่วมกัน",
      recommendation: "รักษาความสดชื่นนี้ไว้ พร้อมขยายผลลัพธ์ผ่านหลักสูตร LIVING ORGANIZATION เพื่อสร้างนวัตกรรมระดับก้าวกระโดด"
    };
  } else if (totalScore >= 23) {
    return {
      level: "TIRED",
      badge: "⚡ องค์กรเริ่มเหนื่อยล้า (Tired Phase)",
      color: "amber",
      bgClass: "bg-amber-50 text-amber-700 border-amber-200",
      description: "งานยังเดินหน้าได้ดี แต่เริ่มมีสัญญาณสะสมความเครียด คนเก่งเริ่มเหนื่อยล้า และพลังการคิดสิ่งใหม่เริ่มชะลอตัว",
      recommendation: "ควร Recharge พลังงานและ Reconnect ทีมงานทันที ก่อนที่ความล้าจะลุกลามจนกลายเป็นความเฉื่อยชาถาวร"
    };
  } else if (totalScore >= 15) {
    return {
      level: "FADED",
      badge: "🍂 พลังเริ่มจางหาย (Faded Organization)",
      color: "orange",
      bgClass: "bg-orange-50 text-orange-700 border-orange-200",
      description: "คนส่วนใหญ่ทำงานตามหน้าที่ เกิดกำแพงระหว่างแผนก (Silo) ขาดแรงบันดาลใจ และไม่มีใครกล้าออกเสียงเสนอไอเดีย",
      recommendation: "จำเป็นต้อง Reset ความสัมพันธ์ และ Reborn People ให้เห็นเป้าหมายร่วมกันใหม่อย่างเร่งด่วน"
    };
  } else {
    return {
      level: "ZOMBIE",
      badge: "🧟 องค์กรซอมบี้ (Zombie Organization)",
      color: "rose",
      bgClass: "bg-rose-50 text-rose-700 border-rose-200",
      description: "คนยังมาทำงานครบ แต่วิญญาณและความกระตือรือร้นหายไปหมด องค์กรอยู่ในภาวะอันตรายต่อการสูญเสียบุคลากรและศักยภาพ",
      recommendation: "ต้องการการผ่าตัดและชุบชีวิตอย่างจริงจัง (Organization Rebirth) เพื่อปลุกจิตวิญญาณคนและองค์กรจากข้างใน"
    };
  }
}
