import { useEffect, useState } from "react";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { adminFetch } from "~/lib/admin-api.client";
export default function AdminUsers() {
  const [users, setUsers] = useState<{ email: string; role: string }[]>([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    adminFetch("/api/users")
      .then((r) => r.json())
      .then((b) => setUsers(b.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  return (
    <AdminLayout
      title="บัญชีและสิทธิ์ผู้ดูแล"
      subtitle="สิทธิ์ตรวจสอบจากเซิร์ฟเวอร์ทุกครั้ง"
    >
      <section className="bg-white rounded-2xl border p-6 space-y-4">
        <p>
          สร้างหรือกู้คืนบัญชีใน Supabase Auth จากนั้นกำหนด ADMIN_EMAILS และ
          SUPER_ADMIN_EMAILS ที่ระบบโฮสต์ บัญชีต้องยืนยันอีเมลก่อนใช้งาน
        </p>
        <p>
          Admin: ดูและอัปเดต CRM ออกแบบหลักสูตร จัดการโครงการและอัปโหลดสื่อ ·
          Super Admin: เพิ่มสิทธิ์ดู Ledger รายชื่อผู้ดูแล และลบข้อมูล
        </p>
        {loading && <p role="status">กำลังโหลดสิทธิ์…</p>}
        {error && (
          <p role="alert" className="text-red-700">
            {error}
          </p>
        )}
        <div className="overflow-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-3">อีเมลที่ได้รับสิทธิ์</th>
                <th>บทบาท</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.email}>
                  <td className="p-3 border-t">{u.email}</td>
                  <td className="border-t">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
