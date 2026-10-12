# นำเนื้อหาหน้าแรก CHOOMCHAM HOUSE กลับมา

หมายเหตุ: ในรุ่น Sale Page ใหม่ เนื้อหาที่คืนในงานนี้อยู่ที่ `/services`; หน้าแรก `/` เป็นองค์กรตัวจริง™ ดู [คู่มือหน้าแรกใหม่](authentic-sales-home.md).

วันที่: 12 ตุลาคม 2026

อ้างอิงภาพหน้าจอ 5 ภาพที่ผู้ใช้แนบ, preview `https://df1e75fc.choomcham.pages.dev/` และ source ใน commit `25570e75b9757caaa5c65104fa0cc8e4c957a634`.

พัฒนาต่อจาก `main` ล่าสุด `48f67a6` เพื่อเก็บงาน Admin, Proposal Engine และ Content Studio ที่ผู้ใช้เพิ่มต่อไว้ ไม่ย้อนทั้ง repository ไป commit เก่า

## ส่วนที่กลับมา

- หน้าเปิดสีม่วง “องค์กรของคุณกำลังมีคนที่ยังมาทำงาน แต่ไม่มีพลังในการสร้างอะไรใหม่หรือเปล่า?”
- สัญญาณองค์กรหมดไฟ 8 ข้อ และข้อความ “คนในองค์กรไม่ได้แย่ลง...”
- การ์ด Zombie Workers / Idea Graveyard / Silo Division / Talent Burnout
- ความเชื่อ “องค์กรจะมีชีวิตได้ เมื่อคนข้างในมีชีวิต” พร้อม Stop → Reflect → Connect → Re-energize → Re-frame → Recreate
- เรื่องราว “บ้านสำหรับการเกิดใหม่ของคนทำงาน”
- โมเดล Reset → Reconnect → Recharge → Reimagine → Recreate พร้อมปุ่มเลือกขั้นตอนและวงกลมแสดงรายละเอียด
- Learning Framework: Learning + Experience + Reflection + Connection + Action = Reborn
- Why Choomcham House และจักรวาล Choomcham Branding / Choomcham House

## การเชื่อมกับเว็บปัจจุบัน

หน้าเปิดเดิมกลับเป็น H1 หลัก ส่วน Hero องค์กรตัวจริงยังอยู่ต่อจากโมเดลโดยใช้ H2 คงหน้าหลักสูตร 5 Levels + Flagship, การขอ Proposal, ภาพกิจกรรม, ลูกค้า, FAQ และแบบฟอร์มติดต่อปัจจุบัน

เมนู Desktop เชื่อมไปสภาวะองค์กร/กระบวนการ/5 ระดับ/หลักสูตร/วิธีทำงาน เมนูมือถือแบ่งหมวดและเข้าถึงทุกส่วนที่กลับมา รวมถึงกรอบ Proposal ดิจิทัล ใช้ Escape ปิดเมนูและปิดเมื่อเลือกหัวข้อ ลิงก์เก่า `#hero`, `#pain`, `#belief`, `#model`, `#work`, `#why` กลับมาแล้ว; `#gallery` เชื่อมตำแหน่งคลังภาพปัจจุบัน

ไม่ได้เปลี่ยนระบบ Auth/API/ฐานข้อมูล และไม่ได้ส่งข้อมูลทดสอบหรือแจ้งเตือนไป production

## ผลตรวจ

- `npm run typecheck`: ผ่าน
- `npm run build`: ผ่าน พร้อม prerender หลักสูตรเดิม
- `npm run test:home`: ผ่าน — ส่วนที่คืน/ส่วนที่คงไว้, H1 เดียว, IDs ไม่ซ้ำ, โมเดลทั้ง 5 ขั้น, ลิงก์เมนู Desktop/Mobile, Escape, จอ 320/390/768/1280/1440px ไม่มีแนวนอนล้น, แบบประเมิน 10 ข้อ
- `npm run test:programs`: ผ่าน
- `npm run test:courses`: ผ่าน
- ตรวจภาพ render ของ Hero, Model, การ์ดปัญหา และมือถือแล้ว

ชุดทดสอบหน้าแรกตรวจ built frontend และปิด remote requests ไม่ยืนยัน API หรือการส่งฟอร์มจริง ไม่มีการ deploy ระหว่างตรวจ

## นำเข้าโปรเจกต์

1. สร้าง branch จาก main `48f67a6` หรือใหม่กว่า หากมีการแก้ไฟล์เดียวกันหลังจากนั้นให้รวมการเปลี่ยนแปลงก่อน
2. แตก ZIP แล้ววางไฟล์ตามโครงสร้างเดิม มีเฉพาะไฟล์ที่เพิ่ม/แก้รอบนี้ ไม่ใช่ repository ทั้งชุด
3. `npm ci`, `npm run typecheck`, `npm run build`
4. ทดสอบหน้าแรก: `npx playwright install chromium` แล้ว `npm run test:home`
5. ตรวจ preview และ Deploy ผ่านขั้นตอนปกติของโครงการ ไม่มี migration สำหรับงานนี้

GitHub connector ตอบ `403 Resource not accessible by integration` ตอนสร้าง branch จึงยัง push/เปิด PR และ deploy ไม่ได้
