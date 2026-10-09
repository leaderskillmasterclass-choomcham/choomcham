# ผลตรวจและชุดปรับปรุง Admin — 9 ตุลาคม 2026

**สถานะ: โค้ดและการทดสอบในสภาพแวดล้อมแยกผ่านแล้ว ยังไม่ได้นำขึ้น production และยังไม่ได้เคลียร์ฐานข้อมูล production**

ฐานต้นทาง: `origin/main` commit `847bb06` ของ `leaderskillmasterclass-choomcham/choomcham`.

## สิ่งที่ตรวจพบจริง

เปิด `/admin/dashboard` จากเบราว์เซอร์ที่ไม่ได้เข้าสู่ระบบแล้วเห็นหน้ารายงานและ Leads 9 รายการ บัญชีถูกแสดงเป็น Super Admin โดยไม่มีการยืนยันตัวตนจริง โค้ดเดิมยังมีการเข้าสู่ระบบแบบรหัสผ่านฝังใน source, การตรวจอีเมลอย่างเดียว, API ส่วนตัวไม่ตรวจสิทธิ์, RLS เปิดให้อ่าน/เขียนกว้าง และคีย์บริการฝังในบางสคริปต์/Media API

พบรายการทดสอบที่ระบุได้ 6 รายการจากหน้าจอจริง อีก 3 รายการไม่ถูกถือว่าเป็นข้อมูลทดสอบโดยอัตโนมัติ **ไม่มีการลบหรือแก้ไขข้อมูลจริงระหว่างการตรวจนี้**

## สิ่งที่ปรับแล้ว

| ส่วน | พฤติกรรมใหม่ |
| --- | --- |
| Login และทุกหน้า Admin | Supabase Auth email/password + ยืนยันอีเมล + ตรวจ allowlist ฝั่งเซิร์ฟเวอร์; localStorage เดิมไม่มีสิทธิ์อนุญาตเข้าระบบ |
| บทบาท | Admin และ Super Admin; บทบาทเดียวกันทั้งเมนู หน้าเว็บ และ API; ไม่มี Operator ที่แสดงสิทธิ์ไม่ตรงกับระบบจริง |
| API ส่วนตัว | Middleware ตรวจ token, บัญชี และสิทธิ์ก่อนเข้าถึงข้อมูล; ไม่มี CORS `*`; ข้อมูลส่วนตัว `no-store` |
| CRM | ใช้ API ที่ยืนยันตัวตน ไม่มี direct Supabase fallback; เปลี่ยน UI หลังระบบยืนยันสำเร็จ; เก็บ Lead ถาวรแทน hard delete; error แสดงให้ผู้ใช้เห็น |
| Dashboard | ใช้ข้อมูลจริง; ไม่มี Benchmark ตัวอย่าง; Won เท่านั้นนับเป็น conversion; สัดส่วนภาวะองค์กรใช้เฉพาะแบบประเมิน |
| หลักสูตรและ Proposal | ใช้ layout/session เดียวกัน; `/admin/proposals` พาเข้าตัวออกแบบหลักสูตร; ยังมีประวัติ/ป้องกัน revision ชนกัน/ส่งตรวจ/พิมพ์ PDF |
| หน้าข้อเสนอ public | แสดงกรอบหลักสูตรตามโปรแกรม ไม่มีราคาเริ่มต้นสมมุติหรือข้อมูลลูกค้าใน URL; ข้อเสนอเฉพาะองค์กรใช้ preview/PDF ใน Admin |
| Projects | เพิ่ม/แก้ไขข้อมูลจริงและสถานะส่งมอบ ผ่าน API; รองรับ 5 Levels + Flagship และชื่อโปรแกรมเก่าสำหรับข้อมูลเดิม |
| Partner Ledger | เพิ่ม/แก้ไขบันทึกจริง เฉพาะ Super Admin; เอารายได้/กำไร/CSAT และ Partner ตัวอย่างออก |
| Team & Roles | แสดง allowlist จริง; ตั้งบัญชี/กู้คืนรหัสผ่านใน Supabase Auth และกำหนดสิทธิ์ที่ hosting; ไม่มีสร้างบัญชีด้วยรหัสผ่านเริ่มต้น |
| Content Studio | ระบุว่าเป็นเครื่องมือร่างจากเทมเพลต ไม่อ้างว่าเชื่อม AI ที่ยังไม่มี |
| Gallery | ใช้ R2 binding ที่โครงการมีอยู่; ตรวจประเภท/ขนาดไฟล์; ห้ามทับไฟล์ชื่อซ้ำ; เก็บสำเนา `_archive` ก่อนนำไฟล์ออก; อ่านรายการครบตาม cursor |
| แบบประเมิน/ฟอร์มติดต่อ | คำนวณคะแนนบนเซิร์ฟเวอร์; ไม่ตอบสำเร็จเมื่อฐานข้อมูลไม่พร้อม; escape HTML อีเมล; ไม่มี LINE broadcast ข้อมูลลูกค้า |
| สคริปต์ทดสอบเก่า | ปิดสคริปต์ที่เพิ่มข้อมูลจริง/ส่งแจ้งเตือนจริง/เปลี่ยนรหัสผ่านอัตโนมัติ; ใช้ชุดทดสอบแยกแทน |
| คีย์บริการ | นำค่าที่ฝังใน source ออก; build ปฏิเสธ service-role/secret ใน `VITE_*` |

การเก็บ Lead ถาวรคืนได้ด้วย `archived=false, archived_at=null` โดยผู้มีสิทธิ์ฐานข้อมูล สื่อคืนได้โดยคัดลอกจาก `_archive/...` ไป `originalKey` ตาม metadata หลังตรวจความถูกต้อง ประวัติหลักสูตรยังเก็บครบ

## ผลทดสอบ

| การตรวจ | ผล / ขอบเขต |
| --- | --- |
| `npm run typecheck` | ผ่าน |
| `npm run test:programs` | ผ่าน: 6 โปรแกรม, consent, validation, origin, payload, DB failure |
| `npm run test:courses` | ผ่าน: templates, mapping, readiness, import, auth, actor provenance, revision conflict |
| `npm run test:admin` | ผ่าน: unauth/allowlist/ยืนยันอีเมล/roles/CORS/no-store, validation, archive, DB failure, scoring, notification escaping, R2 backup/collision |
| `npm run test:db` | ผ่านใน PostgreSQL แยก (PGlite): schema/migrations/RLS, immutable history, conflict, rollback, fixture cleanup 6 รายการ, dependency guard และ recovery |
| `npm run test:ui` | ผ่าน: Admin 9 routes, localStorage ปลอม, login/logout, role guards, empty/error, project create/edit, ledger create, load หลักสูตร, จอ 390px, salepage 6 โปรแกรม, quiz 10 ข้อ; API ถูกจำลอง ไม่เขียนระบบจริง |
| Build | ผ่าน: production build และ prerender 7 หน้าขาย; ปฏิเสธ service-role key ที่ prefix `VITE_*` ในการตรวจแยก |
| Pages Functions build | ผ่าน `wrangler pages functions build` |
| Visual review | ตรวจภาพ desktop 1440px และ mobile 390px แล้ว |

ไม่มีการส่งอีเมล/LINE จริงหรือสร้าง Leads ใน production ระหว่างการทดสอบ ยังไม่ได้ยืนยัน delivery ของการแจ้งเตือนจริง, บัญชีจริงทุกคน, R2 binding จริง และ workflow ฐานข้อมูลจริงหลัง deploy

## ขั้นตอนนำขึ้นระบบจริง

1. **เปลี่ยนคีย์ที่เคยฝังใน source**: Supabase service-role และ R2 credentials เดิมยังอาจอยู่ใน Git history/สำเนาเดิม; การลบ source อย่างเดียวไม่เพิกถอนคีย์ ตรวจ/เปลี่ยนรหัสผ่านบัญชีเดิมที่เคยฝังในโค้ดด้วย โดยเจ้าของระบบดำเนินการผ่านหน้า provider
2. สำรองฐานข้อมูล production และตรวจตาราง/constraints เดิม เทียบ schema ก่อน migration
3. ฐานข้อมูลใหม่: รัน `supabase/schema.sql`; ฐานเดิม: **อย่ารัน schema ซ้ำ** เพราะมี trigger เดิม จากนั้นรัน `20261009_course_designs.sql` (หากยังไม่เคยรัน) และ `20261010_admin_security.sql` ตามลำดับ Migration ทำแบบ transaction และไม่ลบ rows; หากมี legacy result/program type นอกชุดที่รองรับจะหยุดเพื่อให้ตรวจข้อมูลก่อน
4. ตั้ง public build vars `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (anon/publishable เท่านั้น)
5. ตั้ง server secrets `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAILS`, `SUPER_ADMIN_EMAILS` โดยรายการ Super Admin ต้องอยู่ใน ADMIN_EMAILS ด้วย; ไม่มี allowlist จะปฏิเสธการเข้าถึงทั้งหมด `COURSE_ADMIN_EMAILS` รองรับชั่วคราวเฉพาะเมื่อ ADMIN_EMAILS ไม่มีค่า
6. สร้าง/ตรวจบัญชี Supabase Auth ยืนยันอีเมลและปิด public signup หากไม่ใช้ ตั้ง callback/site URL ให้ตรง deployment; ใช้บัญชีที่ระบุใน allowlist
7. ตรวจ `CHOOMCHAM_R2_BUCKET` binding และ `R2_PUBLIC_DOMAIN`; ตรงกับ bucket ที่ใช้จริง ไม่ต้องใช้ S3 credentials สำหรับ Gallery API ใหม่
8. ตรวจ Resend sender domain/ผู้รับจริง และ LINE recipient ID จริง การตรวจ delivery ให้ทำหลัง deployment ด้วยผู้รับที่อนุมัติ; ไม่มี broadcast fallback
9. นำไฟล์ชุดอัปเดตเข้า branch ใหม่ `npm ci`, run tests, build แล้วนำขึ้น Cloudflare Pages ด้วย env ของ production; รัน smoke tests ด้วยบัญชีจริง
10. ตรวจ `/api/leads`, `/api/media`, `/api/users`, `/api/course-designs` โดยไม่ส่ง token: ต้อง 401 (503 เมื่อระบบยังไม่ตั้งค่า) และต้องไม่มีข้อมูลส่วนตัว บัญชีที่ไม่มีสิทธิ์ต้อง 403
11. ทดสอบ create/edit/save/reload หลักสูตร, CRM, Project, Ledger, สื่อ และ public intake ที่มี consent จริงในสภาพแวดล้อม staging ก่อนเปิดใช้งาน production

## เคลียร์ข้อมูลทดสอบ

ไฟล์ `supabase/maintenance/archive_verified_test_leads.sql` แยกออกจาก migrations และ **ไม่รันอัตโนมัติ**.

| ชื่อที่ตรวจพบ | องค์กร | จำนวนที่คาด |
| --- | --- | --- |
| คุณทดสอบ ระบบชุ่มฉ่ำ | Choomcham Test Corp Ltd. | 2 |
| Test Script Lead | CAP Vision Institute | 1 |
| Anon Role Test | TestCo | 1 |
| RLS Test | Test Co | 1 |
| เด่น ทดสอบ 2 | เด่น | 1 |

รันเฉพาะ preview ก่อน ตรวจ IDs/จำนวน/ข้อมูลต้นฉบับ แล้วจึงรัน transaction ส่วนที่สองเมื่อยืนยันว่าเป็นชุดทดสอบจริง สคริปต์ตรวจคู่ชื่อ/องค์กร/คะแนนแบบตรงตัว, จำนวนต้องครบ 6, หยุดเมื่อมี project/course เชื่อมอยู่, เก็บ snapshot ใน `test_cleanup_audit` และ archive จากหน้ารายงาน มี recovery SQL ไม่ลบบัญชี Auth ไม่ลบสื่อจริง และไม่ใช้ `DELETE FROM leads` หรือ `LIKE '%test%'`

## สิ่งที่ยังติดขัด

GitHub connector ตอบ `403 Resource not accessible by integration` ตอนสร้าง branch จึงยัง push/เปิด PR ไม่ได้ ไม่มีสิทธิ์ Supabase/Cloudflare ในสภาพแวดล้อมนี้ จึงยังไม่ได้รัน production migration, archive test rows, เปลี่ยนคีย์ หรือ deploy ผลทดสอบในรายงานนี้ไม่ใช่การรับรอง production หลัง deployment

อ้างอิง API R2: [Cloudflare Workers API reference](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/) — binding, conditional writes ด้วย `If-None-Match`, cursor และ object metadata.
