import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { 
  LayoutDashboard, 
  Users, 
  Kanban, 
  FolderKanban, 
  Handshake, 
  ArrowLeft, 
  ShieldCheck, 
  Bell, 
  Sparkles,
  LogOut,
  ExternalLink,
  FileText,
  Wand2,
  Crown,
  UserCheck,
  Image as ImageIcon
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; role: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("choomcham_admin_user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      } else {
        // Default guest/admin state
        setCurrentUser({
          email: "dend3v@gmail.com",
          name: "Kru Den",
          role: "SUPERADMIN"
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("choomcham_admin_user");
    navigate("/admin/login");
  };

  const navItems = [
    { label: "Executive Overview", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "B2B CRM Pipeline", path: "/admin/crm", icon: Kanban },
    { label: "Proposal Engine", path: "/admin/proposals", icon: FileText },
    { label: "ออกแบบหลักสูตรองค์กร", path: "/admin/courses", icon: Wand2 },
    { label: "AI Content Studio V2", path: "/admin/content-studio", icon: Sparkles },
    { label: "Gallery & R2 Media", path: "/admin/gallery", icon: ImageIcon },
    { label: "Projects Delivery", path: "/admin/projects", icon: FolderKanban },
    { label: "Partner & Ledger", path: "/admin/partners", icon: Handshake },
    { label: "Team & Roles (RBAC)", path: "/admin/users", icon: Users, isSuper: true },
  ];

  const getRoleBadge = (role?: string) => {
    switch (role?.toUpperCase()) {
      case "SUPERADMIN":
        return { label: "Super Admin", color: "bg-amber-500/20 text-amber-300 border-amber-500/30", icon: Crown };
      case "ADMIN":
        return { label: "Admin", color: "bg-purple-500/20 text-purple-300 border-purple-500/30", icon: ShieldCheck };
      default:
        return { label: "Operator", color: "bg-blue-500/20 text-blue-300 border-blue-500/30", icon: UserCheck };
    }
  };

  const roleInfo = getRoleBadge(currentUser?.role);
  const RoleIcon = roleInfo.icon;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800 antialiased">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0 shadow-xl">
        <div>
          {/* Logo & Brand */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 p-1 flex items-center justify-center shadow-md shadow-purple-900/50 border border-white/10">
                <img src="/chumcham.png" alt="Choomcham Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-white block">Choomcham OS</span>
                <span className="text-[11px] text-purple-400 font-medium tracking-wide uppercase block">Admin Platform</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 mt-2">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Management
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.isSuper && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                      RBAC
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Status & Links */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>ชมเว็บไซต์หน้าบ้าน</span>
            </span>
            <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded">Live</span>
          </Link>

          {/* User Profile Card */}
          <div className="flex items-center gap-3 pt-2 border-t border-slate-800/60 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500/30 to-purple-500/30 text-amber-300 flex items-center justify-center font-bold text-xs border border-amber-500/40 shrink-0">
              {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "KD"}
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-xs font-semibold text-slate-200 truncate flex items-center gap-1.5">
                <span>{currentUser?.name || "Kru Den"}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${roleInfo.color}`}>
                  <RoleIcon className="w-2.5 h-2.5" />
                  <span>{roleInfo.label}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-xs sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full border border-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Choomcham OS Live</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="ออกจากระบบ"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page Content Body */}
        <div className="p-6 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}

