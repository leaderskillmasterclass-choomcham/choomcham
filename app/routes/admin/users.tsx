import { useEffect, useState } from "react";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { adminFetch } from "~/lib/admin-api.client";
import { Crown, ShieldCheck, UserCheck, ShieldAlert, KeyRound } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState<{ email: string; role: string }[]>([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/api/users")
      .then((r) => r.json())
      .then((b) => {
        if (b.success && Array.isArray(b.data)) {
          setUsers(b.data);
        } else if (b.error) {
          setError(b.error);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const renderRoleBadge = (role: string) => {
    switch (role?.toUpperCase()) {
      case "SUPERADMIN":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-700 border border-amber-500/30">
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            Super Admin
          </span>
        );
      case "ADMIN":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-700 border border-purple-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            Admin
          </span>
        );
      case "OPERATOR":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-700 border border-blue-500/30">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            Operator
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {role}
          </span>
        );
    }
  };

  return (
    <AdminLayout
      title="บัญชีและสิทธิ์ผู้ดูแล (Team & Roles RBAC)"
      subtitle="ระบบตรวจสอบสิทธิ์ผ่าน Server-Side Allowlist และ Supabase Auth"
    >
      <div className="space-y-6 max-w-5xl">
        {/* Role Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center gap-2.5 text-amber-800 font-bold mb-2">
              <Crown className="w-5 h-5 text-amber-600" />
              <span>Super Admin</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              สิทธิ์สูงสุด: จัดการผู้ดูแล (RBAC), ดู Partner & Ledger, ลบ/Archive ข้อมูล, และเข้าถึงทุกส่วนของระบบ
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-purple-200/80 p-5 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center gap-2.5 text-purple-800 font-bold mb-2">
              <ShieldCheck className="w-5 h-5 text-purple-600" />
              <span>Admin</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              สิทธิ์หลัก: จัดการ CRM, ออกแบบหลักสูตร, ส่ง Proposal, จัดการ Projects Delivery, และจัดการ Gallery Media
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-blue-200/80 p-5 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center gap-2.5 text-blue-800 font-bold mb-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              <span>Operator</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              สิทธิ์ปฏิบัติการ: ดูข้อมูล CRM, ติดตามสถานะโครงการ, และใช้เครื่องมือสร้างร่างเนื้อหา Content Studio
            </p>
          </div>
        </div>

        {/* Users Table Card */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">รายชื่ออีเมลผู้ดูแลในระบบ (Active Allowlist)</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                กำหนดค่าผ่าน Environment Variables บน Cloudflare Pages และเปิดใช้งานบัญชีใน Supabase Auth
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <KeyRound className="w-3.5 h-3.5 text-purple-600" />
              <span>Server-enforced</span>
            </div>
          </div>

          {loading && (
            <div className="py-8 text-center text-slate-400 text-sm" role="status">
              กำลังตรวจสอบรายชื่อผู้ดูแล…
            </div>
          )}

          {error && (
            <div role="alert" className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && users.length === 0 && (
            <div className="py-8 text-center text-slate-500 text-sm">
              ไม่พบรายชื่อในระบบ หรือยังไม่ได้กำหนดตัวแปร ADMIN_EMAILS บนเซิร์ฟเวอร์
            </div>
          )}

          {!loading && users.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold">
                    <th className="py-3 px-4 rounded-l-xl">อีเมลผู้ดูแล</th>
                    <th className="py-3 px-4">ระดับสิทธิ์ (Role)</th>
                    <th className="py-3 px-4 rounded-r-xl text-right">สถานะการตรวจสอบ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {users.map((u) => (
                    <tr key={u.email} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-slate-900">
                        {u.email}
                      </td>
                      <td className="py-3.5 px-4">
                        {renderRoleBadge(u.role)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Authorized
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
