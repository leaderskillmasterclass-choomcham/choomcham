import { createContext, useContext, useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { courseAuth } from "~/lib/course-auth.client";
import { adminFetch } from "~/lib/admin-api.client";
type User = { email: string; name: string; role: string };
const AdminContext = createContext<User | null>(null);
export const useAdminUser = () => useContext(AdminContext);
export default function AdminGuard() {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null),
    [error, setError] = useState(""),
    [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true,
      generation = 0;
    async function verify(clear = true) {
      const run = ++generation;
      if (active && clear) {
        setReady(false);
        setUser(null);
      }
      try {
        const res = await adminFetch("/api/admin-session");
        const body = await res.json();
        if (active && run === generation) {
          setUser(body.data);
          setError("");
        }
      } catch (e) {
        if (active && run === generation) {
          setUser(null);
          setError((e as Error).message);
        }
      } finally {
        if (active && run === generation) setReady(true);
      }
    }
    localStorage.removeItem("choomcham_admin_user");
    void verify();
    const subscription = courseAuth?.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        generation++;
        setUser(null);
        setError("กรุณาเข้าสู่ระบบ");
        setReady(true);
        return;
      }
      // Refreshing a token for the same session must not discard an unsaved course.
      setTimeout(() => {
        if (active)
          void verify(
            event !== "TOKEN_REFRESHED" && event !== "INITIAL_SESSION",
          );
      }, 0);
    });
    return () => {
      active = false;
      subscription?.data.subscription.unsubscribe();
    };
  }, []);
  if (!ready)
    return (
      <main className="p-10" role="status">
        กำลังตรวจสอบสิทธิ์ผู้ดูแล…
      </main>
    );
  if (!user)
    return (
      <main className="max-w-lg mx-auto p-8">
        <h1 className="text-2xl font-bold">เข้าสู่ระบบผู้ดูแล</h1>
        <p className="my-4" role="alert">
          {error}
        </p>
        <Link className="text-purple-700 underline" to="/admin/login">
          ไปหน้าเข้าสู่ระบบ
        </Link>
      </main>
    );
  if (
    ["/admin/users", "/admin/partners"].includes(location.pathname) &&
    user.role !== "SUPERADMIN"
  )
    return (
      <main className="p-8">
        <p role="alert">หน้านี้ต้องใช้สิทธิ์ Super Admin</p>
        <Link to="/admin/dashboard">กลับภาพรวม</Link>
      </main>
    );
  return (
    <AdminContext.Provider value={user}>
      <Outlet />
    </AdminContext.Provider>
  );
}
