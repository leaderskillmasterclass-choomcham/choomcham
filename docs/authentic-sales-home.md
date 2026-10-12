# หน้าแรกใหม่: องค์กรตัวจริง™

พัฒนาจาก main commit `439292b45f69d69203e4579bc5b7db6b0889ce6a` วันที่ 12 ตุลาคม 2026 ตามเนื้อหา Sale Page ที่ผู้ใช้ส่งในบทสนทนาและ `project_sources/19-2.-.md`.

## โครงสร้าง

| URL | หน้าที่ |
| --- | --- |
| `/` | Sale Page ใหม่ แนะนำ “องค์กรตัวจริง™” โดย Choomcham Branding |
| `/services` | หน้าเว็บเดิมครบทั้ง Rebirth, แบบประเมิน, กิจกรรม, บริการ และฟอร์มติดต่อ |
| `/programs` | เลือกหลักสูตรทั้ง 5 Levels และ Flagship |
| `/programs/:slug` | รายละเอียดหลักสูตรแต่ละระดับ |
| `/proposal/request` | กรอกโจทย์องค์กรเพื่อขอ Proposal |
| `/admin/...` | ระบบ Admin เดิม |

หน้าแรกใช้ layout/style แยก (`AuthenticHeader`, `authentic.css`) ไม่ใส่แบบประเมินหรือฟอร์มบริการลงไปใน Sale Page. หน้าเดิมย้ายไฟล์จาก `home.tsx` เป็น `services.tsx` พร้อมปรับชื่อ route types และ canonical; clientAction เดิมยังอยู่กับแบบฟอร์มเดิม

## เนื้อหาในหน้าแรก

1. “องค์กรมีคนเก่ง แต่ทำไมทีมยังไปได้ไม่เต็มศักยภาพ?” และปัญหา 5 ประเด็น
2. องค์กรตัวจริง™ / The Authentic Organization / “ตัวจริงต้องมีที่ยืน”
3. ประสบการณ์ที่ได้รับความไว้วางใจและโลโก้จากชุดที่ใช้ในเว็บเดิม
4. ทำไมเริ่มจากคน และ Authentic Organization Framework
5. REBORN → COMMUNICATION → TEAM → LEADER → CULTURE พร้อมคำอธิบายครบและปุ่มไปหลักสูตร/คำขอแต่ละระดับ
6. ความหมายของ “ตัวจริงต้องมีที่ยืน”
7. ไม่ใช่หลักสูตรสำเร็จรูป: บริบท 5 ด้านและรูปแบบออกแบบ 7 ประเภท
8. องค์กรที่เหมาะกับโปรแกรมและผลลัพธ์ที่มุ่งหวัง
9. Selected Experience: มาดามฟินและกังนัมคลินิก ตามข้อมูลที่ผู้ใช้ให้
10. About Choomcham Branding / ประสบการณ์กว่า 10 ปี / Brand DNA
11. ปิดด้วยคำถามเรื่องพื้นที่ให้คนเก่งและ CTA 3 แบบ

รูปกิจกรรมเป็นภาพจริงจากชุดเดิมในเว็บ ไม่ได้อ้างว่าภาพนี้เป็นภาพของมาดามฟินหรือกังนัมโดยเฉพาะ ไม่เพิ่ม Testimonial หรือคำรับรองลูกค้าที่ไม่มีต้นฉบับ โลโก้และรูปที่ใช้ในหน้าแรกเก็บเป็น static assets เพื่อให้แสดงผลได้โดยไม่ต้องเรียก R2 จากเบราว์เซอร์

## เส้นทาง CTA

- ปรึกษาโจทย์องค์กร → `/services?inquiry=consultation#contact`
- ขอรายละเอียดหลักสูตร → `/programs`
- ขอใบเสนอราคา → `/proposal/request`
- ขอ Proposal ของระดับที่เลือก → `/proposal/request?program=<slug>` และเลือกหลักสูตรให้แล้ว
- บริการทั้งหมด → `/services`
- ดูภาพกิจกรรม → `/services#experience`

ลิงก์เก่าในโปรแกรม/บทความ/CRM ถูกปรับไปหน้า services โดยตรง. หากเปิดลิงก์เดิม `/#zombie-check`, `/#model`, `/#pain` และหัวข้อ Rebirth เดิม หน้าแรกจะพาไป `/services#...` โดยคง bookmark ไว้. หัวข้อที่อยู่ใน Sale Page เช่น `#levels`, `#clients`, `#about`, `#contact` ยังอยู่หน้าแรก

## SEO และการเข้า URL โดยตรง

Prerender `/`, `/services`, `/programs` และหลักสูตร 6 โปรแกรม เป็น HTML ที่มี metadata/canonical ของแต่ละหน้า เพิ่ม `/services` ใน sitemap

เมื่อ prerender `/` React Router จะสร้าง `__spa-fallback.html` แยกออกมา จึงเพิ่มการเลือกเอกสาร SPA ใน Pages middleware สำหรับ Admin, Proposal request, topics และโปรแกรมที่ไม่ใช่ route prerender โดยคงการตรวจสิทธิ์ API และ security headers ไว้. ไม่เปลี่ยนสิทธิ์/ข้อมูล/ฐานข้อมูล Admin

อ้างอิง implementation: [React Router pre-rendering / SPA fallback](https://reactrouter.com/how-to/pre-rendering) และ [Cloudflare Pages Functions API / ASSETS.fetch](https://developers.cloudflare.com/pages/functions/api-reference/).

## ตรวจและนำเข้า

ไฟล์ชุดนี้เป็น incremental update จาก `439292b`. แตก ZIP แล้ววางไฟล์ **ภายใน ZIP ตรงระดับ root ของ repository** ตามโครงสร้าง `app/`, `functions/`, `public/`, `scripts/` ไม่ต้องสร้างโฟลเดอร์ชื่อ ZIP ซ้อนเข้าไปใน repo. ไม่ต้องรัน migration สำหรับงานนี้

```sh
npm ci
npm run typecheck
npm run test:programs
npm run test:courses
npm run test:admin
npm run test:db
npm run build
npx playwright install chromium
npm run test:home
npm run test:sales
npx wrangler pages functions build functions --outdir /tmp/choomcham-functions-check
```

ทดสอบ Admin UI ด้วยค่า fixture ตาม README แล้วคืน build เป็นค่าปกติก่อน deploy. CI เพิ่ม `test:sales` และปรับ test:home/test:ui ให้ทดสอบหน้าเดิมที่ `/services`

สำหรับตรวจ Pages runtime ในเครื่องปกติ สามารถรัน `npm run test:pages` หลัง build. สคริปต์นี้เปิด local runtime เท่านั้น ไม่ deploy และไม่เขียนฐานข้อมูล

## ผลตรวจรอบนี้

- TypeScript และ production build / prerender ผ่าน
- Programme mapping, course design, Admin API และ PostgreSQL tests ในสภาพแวดล้อมแยก ผ่าน
- Sales browser test: แยก HTML ของสองหน้า, H1/IDs/canonical, ปุ่มปรึกษา/รายละเอียด/Proposal ทุกระดับ, รูป static, เมนูมือถือ/Escape, จอ 320–1440px, bookmark เดิม และหน้า Admin โดยตรง ผ่าน
- Admin UI ด้วย fixtures: 9 หน้า, login/logout, สิทธิ์, state/error, project/ledger และไม่มี horizontal overflow ผ่าน
- หน้า services เดิม: โมเดลทั้ง 5 ขั้น เมนู และ Quiz 10 ข้อ ผ่าน
- ตรวจภาพ render เดสก์ท็อป/มือถือภายในแล้ว ไม่มีข้อมูลลูกค้าจริงถูกใช้ใน tests และไม่มีการส่งอีเมล/LINE จริง
- Pages Functions compile ผ่าน. การเปิด Cloudflare local runtime ในสภาพแวดล้อมนี้ถูกหยุดโดย `uv_interface_addresses` ของระบบ จึงยังไม่ได้ยืนยัน runtime จริงหลัง deploy ให้ตรวจ `npm run test:pages` หรือ preview ของ hosting ในเครื่อง/ระบบที่รองรับ

GitHub connector ยังตอบ `403 Resource not accessible by integration` ตอนสร้าง branch จึงยังไม่ได้ push, เปิด PR หรือ Deploy งานนี้
