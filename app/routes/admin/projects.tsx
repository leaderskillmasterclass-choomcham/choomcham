import React from "react";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { FolderKanban, CheckCircle2, Clock, Sparkles, Building2, User, ArrowRight } from "lucide-react";

export function meta() {
  return [
    { title: "Transformation Project Delivery | Choomcham House OS" },
  ];
}

export default function AdminProjects() {
  const projects = [
    {
      id: "PRJ-001",
      client: "Creative Studio 88",
      program: "REBORN PEOPLE & ALIVE TEAM",
      participants: "28 คน",
      currentStage: "STAGE 2: RECONNECT",
      stages: [
        { name: "RESET", done: true },
        { name: "RECONNECT", current: true },
        { name: "RECHARGE", done: false },
        { name: "REIMAGINE", done: false },
        { name: "RECREATE", done: false },
      ],
      leadConsultant: "ครูเด่น / Facilitator Team",
      status: "In Progress",
      startDate: "1 ก.ย. 2026",
    },
    {
      id: "PRJ-002",
      client: "BioHealth Global",
      program: "LIVING ORGANIZATION TRANSFORMATION",
      participants: "85 คน",
      currentStage: "STAGE 1: RESET",
      stages: [
        { name: "RESET", current: true },
        { name: "RECONNECT", done: false },
        { name: "RECHARGE", done: false },
        { name: "REIMAGINE", done: false },
        { name: "RECREATE", done: false },
      ],
      leadConsultant: "Partner Lead A",
      status: "Planning",
      startDate: "15 ต.ค. 2026",
    },
  ];

  return (
    <AdminLayout
      title="Transformation Project Delivery"
      subtitle="ติดตามความคืบหน้าโครงการส่งมอบการ Reborn องค์กรลูกค้าตาม Process Model: Reset → Recreate"
    >
      <div className="space-y-6">
        {projects.map((prj) => (
          <div key={prj.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-md">
                    {prj.id}
                  </span>
                  <span className="text-xs text-slate-400">เริ่ม: {prj.startDate}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">{prj.client}</h2>
                <p className="text-xs text-purple-600 font-semibold">{prj.program} • ({prj.participants})</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-500">Lead Consultant</div>
                  <div className="text-xs font-bold text-slate-800">{prj.leadConsultant}</div>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-full">
                  {prj.status}
                </span>
              </div>
            </div>

            {/* 5-Stage Transformation Visual Flow */}
            <div className="mt-6">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Rebirth Process Milestones:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {prj.stages.map((st, idx) => (
                  <div
                    key={st.name}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      st.done
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : st.current
                        ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-900/20"
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    }`}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-1">
                      Step 0{idx + 1}
                    </div>
                    <div className="text-xs font-bold">{st.name}</div>
                    <div className="text-[10px] mt-1 opacity-80">
                      {st.done ? "✓ เสร็จสิ้น" : st.current ? "● กำลังดำเนินงาน" : "รอดำเนินการ"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
