import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { courseAuth } from "~/lib/course-auth.client";
import { adminFetch } from "~/lib/admin-api.client";
export function meta() {
  return [
    { title: "เข้าสู่ระบบผู้ดูแล | Choomcham" },
    { name: "robots", content: "noindex, nofollow" },
  ];
}
export default function AdminLogin() {
  const navigate = useNavigate(),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function login(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (!courseAuth) throw new Error("ยังไม่ได้ตั้งค่าระบบเข้าสู่ระบบ");
      const result = await courseAuth.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (result.error) throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      await adminFetch("/api/admin-session");
      setPassword("");
      localStorage.removeItem("choomcham_admin_user");
      navigate("/admin/dashboard", { replace: true });
    } catch (e) {
      setError((e as Error).message);
      await courseAuth?.auth.signOut();
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <form
        onSubmit={login}
        className="w-full max-w-md bg-white border rounded-3xl p-8 shadow-sm space-y-5"
      >
        <Link to="/" className="text-purple-700">
          Choomcham House
        </Link>
        <h1 className="text-2xl font-bold">เข้าสู่ระบบผู้ดูแล</h1>
        <p className="text-sm text-slate-500">
          ใช้บัญชีที่ได้รับสิทธิ์จากผู้ดูแลระบบ
        </p>
        <label className="block">
          อีเมล
          <input
            className="block border rounded-lg p-3 w-full mt-2"
            required
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block">
          รหัสผ่าน
          <input
            className="block border rounded-lg p-3 w-full mt-2"
            required
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && (
          <p role="alert" className="text-red-700">
            {error}
          </p>
        )}
        <button
          disabled={busy || !courseAuth}
          className="w-full p-3 rounded-lg bg-purple-700 text-white disabled:opacity-50"
        >
          {busy ? "กำลังตรวจสอบ…" : "เข้าสู่ระบบ"}
        </button>
        {!courseAuth && (
          <p role="alert">
            ระบบยังไม่ได้ตั้งค่าการเข้าสู่ระบบ กรุณาติดต่อผู้ดูแล
          </p>
        )}
      </form>
    </main>
  );
}
