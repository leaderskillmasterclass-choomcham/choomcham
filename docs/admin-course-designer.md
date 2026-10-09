# Admin Course Designer

ตัวออกแบบหลักสูตรที่ `/admin/courses` ใช้ Admin layout และ Supabase session เดียวกับทั้งโครงการ ดูผลตรวจและขั้นตอนตั้งค่าล่าสุดที่ [admin-production-readiness.md](admin-production-readiness.md).

- เลือก 5 Levels of Growth หรือ Flagship และนำ brief จากคำขอ Proposal จริงมาเริ่มออกแบบ
- เขียนโจทย์ ผลลัพธ์ วัตถุประสงค์ หลักฐาน กิจกรรม เวลา การประเมิน และขอบเขต
- เช็ก readiness ก่อน REVIEW/APPROVED; สถานะนี้เป็นการตรวจภายใน ไม่ใช่การอนุมัติงบของลูกค้า
- บันทึกฉบับทีมและประวัติ ผ่าน server API ที่ตรวจบัญชี/allowlist; revision ชนกันจะหยุดและให้รวมการแก้ไข
- เก็บร่างในเครื่อง นำเข้า/ส่งออก JSON และพิมพ์ preview เป็น PDF; การเก็บในเครื่องยังไม่ใช่การบันทึกในระบบทีม
- ไม่มี default price สมมุติ ไม่มีส่งข้อเสนอให้ลูกค้าอัตโนมัติ ไม่มี public URL ที่ใส่ข้อมูลส่วนตัวของลูกค้า

ใช้ migrations `20261009_course_designs.sql` และ `20261010_admin_security.sql` ตามคู่มือ ใช้ `ADMIN_EMAILS` และ `SUPER_ADMIN_EMAILS` ฝั่ง server เป็นสิทธิ์หลัก ค่า `COURSE_ADMIN_EMAILS` รองรับเฉพาะระหว่างย้าย configuration.

`npm run test:courses` ตรวจ domain/API และ `npm run test:db` ตรวจ revision transaction/RLS ในฐานข้อมูลแยก. `npm run test:ui` ตรวจ Admin integration โดยใช้ API fixtures.
