# CHOOMCHAM HOUSE

เว็บไซต์ 5 Levels of Growth + Flagship และระบบ Admin สำหรับ CRM, ออกแบบหลักสูตร/Proposal, โครงการอบรม, Partner Ledger และสื่อ

React Router SPA/prerender + Cloudflare Pages Functions + Supabase Auth/PostgreSQL + R2

## เริ่มต้น

```sh
npm ci
npm run dev
```

## ตรวจโค้ดและฐานข้อมูลแยก

```sh
npm run typecheck
npm run test:programs
npm run test:courses
npm run test:admin
npm run test:db
npm run build
npx wrangler pages functions build functions --outdir /tmp/choomcham-functions-check
```

## ตรวจ UI ด้วย fixtures (ไม่มี production side effects)

```sh
VITE_SUPABASE_URL=https://admin-test.invalid VITE_SUPABASE_ANON_KEY=test-public-placeholder npm run build
npx playwright install chromium
npm run test:ui
npm run build
```

ใช้ provider จริงสำหรับ production build เท่านั้น ค่า fixture ใช้เฉพาะทดสอบ UI. `npm run dev` แสดง frontend; ต้องใช้ Pages runtime หรือ deployment เพื่อให้ `/api/*` ทำงานจริง

## ตั้งค่าระบบและนำขึ้นใช้งาน

อ่าน [ผลตรวจและคู่มือ production](docs/admin-production-readiness.md) ก่อน deploy โดยเฉพาะ migration, server allowlists, การเปลี่ยนคีย์เดิม และการเคลียร์ข้อมูลทดสอบแบบกู้คืนได้ ดู [Course Designer](docs/admin-course-designer.md) สำหรับขั้นตอนออกแบบหลักสูตร

การบันทึกข้อมูล Admin ใช้ API ที่ตรวจ Supabase user + email confirmation + allowlist ฝั่งเซิร์ฟเวอร์ ค่า public `VITE_*` ต้องไม่มี service-role หรือ secret. ชุดข้อมูลตัวอย่างไม่ถูก preload และสคริปต์ทดสอบเก่าที่มีผลต่อ production ถูกปิดแล้ว

สถานะชุดอัปเดต: ผ่าน automated checks ในสภาพแวดล้อมแยก แต่ต้องตั้งค่า/นำขึ้นโฮสต์และตรวจระบบจริงตามคู่มือก่อนเปิดใช้งาน
