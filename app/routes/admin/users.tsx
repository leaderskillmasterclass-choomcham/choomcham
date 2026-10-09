import React, { useState, useEffect } from "react";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { 
  ShieldCheck, 
  UserCheck, 
  Crown, 
  UserPlus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  RefreshCw, 
  Lock, 
  Mail, 
  User, 
  Key, 
  ShieldAlert,
  Sparkles,
  Info
} from "lucide-react";

export function meta() {
  return [
    { title: "จัดการผู้ดูแลระบบ & สิทธิ์การใช้งาน (RBAC) | Choomcham House OS" },
  ];
}

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: "SUPERADMIN" | "ADMIN" | "OPERATOR" | string;
  created_at: string;
}

const INITIAL_USERS: AdminUser[] = [
  {
    id: "756695d0-48e1-44b9-b214-d2530145cfa8",
    email: "dend3v@gmail.com",
    full_name: "ครูเด่น (DenD3v)",
    role: "SUPERADMIN",
    created_at: new Date().toISOString()
  },
  {
    id: "267820d3-7d0d-4203-8d51-aaa22f31558e",
    email: "dencapvision@gmail.com",
    full_name: "ครูเด่น (CAP Vision)",
    role: "SUPERADMIN",
    created_at: new Date().toISOString()
  },
  {
    id: "3500fda1-5763-41ac-a3ba-680f192da85e",
    email: "choomchambranding@gmail.com",
    full_name: "Choomcham Branding (Admin)",
    role: "ADMIN",
    created_at: new Date().toISOString()
  }
];

const PERMISSIONS_MATRIX = [
  { module: "ภาพรวม Dashboard & Analytics", superadmin: true, admin: true, operator: true },
  { module: "ดูรายชื่อ Leads & รายละเอียด", superadmin: true, admin: true, operator: true },
  { module: "อัปเดตสถานะ CRM & บันทึกโน้ต", superadmin: true, admin: true, operator: true },
  { module: "ใช้งาน AI Content Studio V2.0", superadmin: true, admin: true, operator: true },
  { module: "ออกใบเสนอราคา (Proposal Engine)", superadmin: true, admin: true, operator: false },
  { module: "ดาวน์โหลดฐานข้อมูล Excel (.xlsx)", superadmin: true, admin: true, operator: false },
  { module: "จัดการโครงการ Transformation Projects", superadmin: true, admin: true, operator: false },
  { module: "ลบข้อมูล Lead ออกจากระบบ", superadmin: true, admin: false, operator: false },
  { module: "ดูและจัดการ Partner Equity Ledger", superadmin: true, admin: false, operator: false },
  { module: "เพิ่ม/แก้ไข/ตั้งค่าสิทธิ์ผู้ดูแลเว็บไซต์ (RBAC)", superadmin: true, admin: false, operator: false },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_USERS);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  // Form states
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"SUPERADMIN" | "ADMIN" | "OPERATOR">("ADMIN");

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const json = await res.json() as any;
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setUsers(json.data);
        }
      }
    } catch (e) {
      console.warn("Fetch /api/users error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newName) return;

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail,
          full_name: newName,
          password: newPassword || "choomcham2026",
          role: newRole
        })
      });

      if (res.ok) {
        const json = await res.json() as any;
        if (json.success && json.data) {
          setUsers(prev => [...prev.filter(u => u.email !== json.data.email), json.data]);
        }
      }
    } catch (err) {
      console.error("Error creating user:", err);
    } finally {
      setShowAddModal(false);
      setNewEmail("");
      setNewName("");
      setNewPassword("");
      setNewRole("ADMIN");
      loadUsers();
    }
  };

  const handleUpdateRole = async (userId: string, targetRole: string) => {
    try {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: targetRole } : u));
      await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role: targetRole })
      });
    } catch (err) {
      console.error("Update role error:", err);
    }
  };

  const handleDeleteUser = async (userId: string, email: string, name: string) => {
    if (email === "dend3v@gmail.com" || email === "dencapvision@gmail.com") {
      alert("ไม่สามารถลบ Super Admin หลักของระบบได้ครับ");
      return;
    }

    if (confirm(`คุณต้องการลบผู้ดูแล "${name} (${email})" ออกจากระบบหรือไม่?`)) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      await fetch(`/api/users?id=${userId}&email=${encodeURIComponent(email)}`, {
        method: "DELETE"
      });
    }
  };

  return (
    <AdminLayout
      title="ระบบตั้งผู้ดูแลเว็บไซต์ & สิทธิ์การใช้งาน (RBAC)"
      subtitle="กำหนดบทบาท Super Admin, Admin และ Operator พร้อมควบคุมสิทธิ์การเข้าถึงระบบ Choomcham House OS"
    >
      {/* Top Banner Notice */}
      <div className="mb-8 p-5 rounded-3xl bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-purple-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/30 flex items-center justify-center font-bold text-xl border border-purple-400/40 shrink-0">
            <Crown className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-white">Super Admin Management Portal</h2>
              <span className="text-[10px] bg-yellow-400 text-purple-950 font-extrabold px-2 py-0.5 rounded-full">
                สูงสุด
              </span>
            </div>
            <p className="text-xs text-purple-200 mt-0.5">
              บัญชี <strong>dend3v@gmail.com</strong> และ <strong>dencapvision@gmail.com</strong> ได้รับสิทธิ์ Super Admin ในการจัดการระบบ 100%
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl text-xs font-bold shadow-md shadow-pink-900/30 flex items-center justify-center gap-1.5 transition-all hover:scale-102"
          >
            <UserPlus className="w-4 h-4" />
            <span>เพิ่มผู้ดูแลใหม่</span>
          </button>

          <button
            onClick={loadUsers}
            disabled={isLoading}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs transition-colors"
            title="รีเฟรชข้อมูล"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-yellow-300" : ""}`} />
          </button>
        </div>
      </div>

      {/* 1. Admin Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">รายชื่อผู้ดูแลระบบทั้งหมด ({users.length} บัญชี)</h3>
            <p className="text-xs text-slate-500">จัดการบทบาทและระดับสิทธิ์การเข้าถึงข้อมูลของทีมงาน</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
            Role-Based Access Control (RBAC)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-6">ผู้ดูแล / สมาชิก</th>
                <th className="py-3.5 px-6">อีเมลเข้าสู่ระบบ</th>
                <th className="py-3.5 px-6">บทบาทปัจจุบัน (Role)</th>
                <th className="py-3.5 px-6">ปรับเปลี่ยนสิทธิ์</th>
                <th className="py-3.5 px-6 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {users.map((u) => {
                const isMasterSuperAdmin = u.email === "dend3v@gmail.com" || u.email === "dencapvision@gmail.com";
                return (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        {u.role === "SUPERADMIN" && <Crown className="w-4 h-4 text-amber-500 shrink-0" />}
                        {u.role === "ADMIN" && <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />}
                        {u.role === "OPERATOR" && <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />}
                        <span>{u.full_name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        ID: {u.id.slice(0, 12)}...
                      </div>
                    </td>

                    <td className="py-4 px-6 font-semibold text-slate-700">
                      {u.email}
                    </td>

                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                        u.role === "SUPERADMIN"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : u.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800 border border-purple-300"
                          : "bg-blue-100 text-blue-800 border border-blue-300"
                      }`}>
                        {u.role === "SUPERADMIN" ? "👑 Super Admin" : u.role === "ADMIN" ? "🛡️ Admin" : "⚙️ Operator"}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      {isMasterSuperAdmin ? (
                        <span className="text-[11px] text-slate-400 italic">Super Admin ถาวร</span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:bg-white focus:outline-hidden focus:border-purple-600 cursor-pointer"
                        >
                          <option value="SUPERADMIN">👑 Super Admin</option>
                          <option value="ADMIN">🛡️ Admin</option>
                          <option value="OPERATOR">⚙️ Operator</option>
                        </select>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      {isMasterSuperAdmin ? (
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                          Primary Super Admin
                        </span>
                      ) : (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.email, u.full_name)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                          title="ลบผู้ดูแล"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Permissions Matrix Reference Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">ตารางสิทธิ์การเข้าถึงระบบ (Role Permissions Matrix)</h3>
          <p className="text-xs text-slate-500">เปรียบเทียบขอบเขตความสามารถและระดับการเข้าถึงข้อมูลของแต่ละบทบาท</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-6">ฟังก์ชันการทำงาน / โมดูล</th>
                <th className="py-3.5 px-6 text-center text-amber-800 font-bold bg-amber-50/50">👑 Super Admin</th>
                <th className="py-3.5 px-6 text-center text-purple-800 font-bold bg-purple-50/50">🛡️ Admin</th>
                <th className="py-3.5 px-6 text-center text-blue-800 font-bold bg-blue-50/50">⚙️ Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PERMISSIONS_MATRIX.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-slate-800">{row.module}</td>
                  <td className="py-3.5 px-6 text-center bg-amber-50/20">
                    {row.superadmin ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs">✓</span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400 text-xs">✕</span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-center bg-purple-50/20">
                    {row.admin ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs">✓</span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400 text-xs">✕</span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-center bg-blue-50/20">
                    {row.operator ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs">✓</span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400 text-xs">✕</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold text-slate-900">เพิ่มผู้ดูแลระบบคนใหม่</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">ชื่อ-นามสกุล / ชื่อทีมงาน</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="เช่น คุณสมศักดิ์ มั่นคง"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">อีเมลผู้ใช้งาน (Email)</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="member@choomcham.house"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">รหัสผ่านเริ่มต้น (Password)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="หากเว้นว่างจะตั้งเป็น choomcham2026"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">ระดับสิทธิ์บทบาท (Role)</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:bg-white focus:outline-hidden focus:border-purple-600"
                >
                  <option value="OPERATOR">⚙️ Operator (ดู Lead, บันทึกโน้ต, สร้าง Content)</option>
                  <option value="ADMIN">🛡️ Admin (จัดการ Lead, ออก Proposal, ดาวน์โหลด Excel)</option>
                  <option value="SUPERADMIN">👑 Super Admin (สิทธิ์สูงสุดเต็มรูปแบบ)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-900/30 transition-colors"
                >
                  บันทึกผู้ดูแล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
