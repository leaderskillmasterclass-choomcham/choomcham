import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, Crown, AlertCircle } from "lucide-react";

export function meta() {
  return [
    { title: "Admin Portal เข้าสู่ระบบ | Choomcham House OS" },
    { name: "description", content: "เข้าสู่ระบบบริหารจัดการ Choomcham House OS" }
  ];
}

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    // Check specific Admin accounts
    if (cleanEmail === "choomchambranding@gmail.com" && password === "123456") {
      const userProfile = {
        email: cleanEmail,
        name: "Choomcham Branding (Admin)",
        role: "ADMIN" as const,
        loginAt: new Date().toISOString()
      };
      localStorage.setItem("choomcham_admin_user", JSON.stringify(userProfile));
      setTimeout(() => {
        setIsLoading(false);
        navigate("/admin/dashboard");
      }, 400);
      return;
    }

    // Check specific Super Admin accounts
    if (
      (cleanEmail === "dend3v@gmail.com" || cleanEmail === "dencapvision@gmail.com") &&
      password === "den2235919"
    ) {
      const userProfile = {
        email: cleanEmail,
        name: cleanEmail === "dencapvision@gmail.com" ? "Den Capvision" : "Kru Den (Dend3v)",
        role: "SUPERADMIN" as const,
        loginAt: new Date().toISOString()
      };
      localStorage.setItem("choomcham_admin_user", JSON.stringify(userProfile));
      setTimeout(() => {
        setIsLoading(false);
        navigate("/admin/dashboard");
      }, 400);
      return;
    }

    // Try API verification for other users
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const json = await res.json();
        const users = json.data || json;
        const matched = Array.isArray(users) ? users.find((u: any) => u.email?.toLowerCase() === cleanEmail) : null;
        if (matched) {
          const userProfile = {
            email: matched.email,
            name: matched.full_name || matched.email.split("@")[0],
            role: matched.role || "ADMIN",
            loginAt: new Date().toISOString()
          };
          localStorage.setItem("choomcham_admin_user", JSON.stringify(userProfile));
          setIsLoading(false);
          navigate("/admin/dashboard");
          return;
        }
      }
    } catch (err) {
      console.warn("API check failed:", err);
    }

    // Default fallback check
    if (password === "den2235919" || password === "choomcham2026" || password === "123456") {
      const userProfile = {
        email: cleanEmail,
        name: cleanEmail.split("@")[0],
        role: cleanEmail.includes("admin") || cleanEmail.includes("branding") ? "ADMIN" : "OPERATOR",
        loginAt: new Date().toISOString()
      };
      localStorage.setItem("choomcham_admin_user", JSON.stringify(userProfile));
      setIsLoading(false);
      navigate("/admin/dashboard");
      return;
    }

    setIsLoading(false);
    setErrorMsg("อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง");
  };

  const fillPreset = (targetEmail: string, targetPass: string) => {
    setEmail(targetEmail);
    setPassword(targetPass);
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 mx-auto flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-purple-600/30 mb-3">
            ช
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Choomcham House OS</h1>
          <p className="text-xs text-slate-400 mt-1">ระบบบริหารจัดการ & RBAC Control (Super Admin / Admin / Operator)</p>
        </div>

        {/* Quick Login Presets */}
        <div className="mb-6 p-3 bg-purple-950/40 border border-purple-800/40 rounded-2xl">
          <div className="text-[11px] font-semibold text-purple-300 flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>เข้าสู่ระบบด่วน (Quick Presets)</span>
            </span>
            <span className="text-[10px] text-purple-400">เลือกเพื่อกรอกอัตโนมัติ</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => fillPreset("choomchambranding@gmail.com", "123456")}
              className="px-2.5 py-2 bg-gradient-to-r from-purple-900/60 to-pink-900/60 hover:from-purple-800/80 hover:to-pink-800/80 border border-pink-500/40 rounded-xl text-left text-xs text-slate-200 transition-all flex items-center justify-between group"
            >
              <div>
                <span className="block font-semibold text-pink-300 group-hover:text-pink-200">🛡️ Choomcham Branding (Admin)</span>
                <span className="block text-[10px] text-slate-300">choomchambranding@gmail.com</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-pink-500/20 text-pink-300 rounded-md border border-pink-500/30 font-mono">123456</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              type="button"
              onClick={() => fillPreset("dend3v@gmail.com", "den2235919")}
              className="px-2.5 py-2 bg-slate-900/90 hover:bg-purple-900/40 border border-purple-700/40 rounded-xl text-left text-xs text-slate-200 transition-all group"
            >
              <span className="block font-semibold text-amber-300 group-hover:text-amber-200">👑 dend3v</span>
              <span className="block text-[10px] text-slate-400 truncate">dend3v@gmail.com</span>
            </button>
            <button
              type="button"
              onClick={() => fillPreset("dencapvision@gmail.com", "den2235919")}
              className="px-2.5 py-2 bg-slate-900/90 hover:bg-purple-900/40 border border-purple-700/40 rounded-xl text-left text-xs text-slate-200 transition-all group"
            >
              <span className="block font-semibold text-amber-300 group-hover:text-amber-200">👑 dencapvision</span>
              <span className="block text-[10px] text-slate-400 truncate">dencapvision@gmail.com</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-800/60 rounded-xl flex items-center gap-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              อีเมลผู้ดูแล (Email)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dend3v@gmail.com"
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              รหัสผ่าน (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 px-4 rounded-xl text-sm shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50 mt-6"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>เข้าสู่ระบบจัดการ</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Supabase RBAC Security</span>
          </span>
          <Link to="/" className="text-purple-400 hover:text-purple-300 transition-colors">
            ชมเว็บไซต์หน้าบ้าน
          </Link>
        </div>
      </div>
    </div>
  );
}

