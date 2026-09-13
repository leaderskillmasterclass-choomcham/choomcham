import React, { useState } from "react";
import { Link } from "react-router";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { DimensionRadarChart } from "~/components/DimensionRadarChart";
import { 
  Users, 
  Flame, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  PhoneCall, 
  Download,
  Filter,
  Sparkles,
  Calendar,
  Building2
} from "lucide-react";
import { DIAGNOSTIC_DIMENSIONS } from "~/lib/diagnostic";

export function meta() {
  return [
    { title: "Executive Overview | Choomcham House OS" },
  ];
}

export default function AdminDashboard() {
  // Mock comprehensive data for executive overview
  const stats = [
    { label: "Total Leads สะสม", value: "148", change: "+24% เดือนนี้", icon: Users, color: "text-purple-600 bg-purple-50" },
    { label: "รอนัด Consultation", value: "12", change: "ต้องติดต่อใน 24 ชม.", icon: PhoneCall, color: "text-pink-600 bg-pink-50" },
    { label: "สัดส่วน Zombie / Faded", value: "68%", change: "มีความต้องการด่วน", icon: AlertTriangle, color: "text-rose-600 bg-rose-50" },
    { label: "Conversion Rate", value: "34.2%", change: "+4.1% vs สัปดาห์ก่อน", icon: TrendingUp, color: "text-emerald-600 bg-emerald-50" },
  ];

  // Average 7 Dimension scores across all assessed organizations
  const benchmarkScores = {
    energy: { current: 3.8, max: 8, percentage: 48 },
    meaning: { current: 5.2, max: 8, percentage: 65 },
    connection: { current: 3.4, max: 8, percentage: 42 },
    voice: { current: 2.9, max: 8, percentage: 36 },
    psychological_safety: { current: 3.1, max: 8, percentage: 39 },
    ownership: { current: 4.6, max: 8, percentage: 58 },
    creativity: { current: 3.6, max: 8, percentage: 45 },
  };

  const recentLeads = [
    {
      id: "lead-1",
      name: "คุณธนกร เลิศวิริยะ",
      company: "Apex Tech Innovations Co., Ltd.",
      position: "Chief People Officer",
      teamSize: "100-250 คน",
      score: 14,
      resultLevel: "ZOMBIE",
      time: "10 นาทีที่แล้ว",
      status: "NEW",
    },
    {
      id: "lead-2",
      name: "คุณศศิธร รัตนพงศ์",
      company: "Siam Retail Group",
      position: "HRD Director",
      teamSize: "500+ คน",
      score: 21,
      resultLevel: "FADED",
      time: "2 ชั่วโมงที่แล้ว",
      status: "CONTACTED",
    },
    {
      id: "lead-3",
      name: "คุณวิทวัส เจริญผล",
      company: "Digital Synergy Agency",
      position: "Managing Director",
      teamSize: "30-50 คน",
      score: 26,
      resultLevel: "TIRED",
      time: "5 ชั่วโมงที่แล้ว",
      status: "CONSULTATION",
    },
    {
      id: "lead-4",
      name: "คุณนลินี สุวรรณเวช",
      company: "BioHealth Global",
      position: "Head of Culture & Talent",
      teamSize: "50-100 คน",
      score: 34,
      resultLevel: "ALIVE",
      time: "เมื่อวานนี้",
      status: "PROPOSAL",
    },
  ];

  return (
    <AdminLayout
      title="Executive Overview & Analytics"
      subtitle="ภาพรวมสถิติการประเมินสุขภาพองค์กร B2B และสถานะการเติบโตของ Choomcham House"
    >
      {/* 1. Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((st, i) => {
          const Icon = st.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{st.label}</span>
                <div className={`p-2 rounded-xl ${st.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">{st.value}</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">{st.change}</div>
            </div>
          );
        })}
      </div>

      {/* 2. Main Analytics Grid: 7 Dimensions Benchmark & Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* 7 Dimensions Radar Breakdown */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">7 Dimensions Benchmark Analysis</h2>
              <p className="text-xs text-slate-500">จุดแข็งและจุดอ่อนเฉลี่ยของทุกองค์กรที่ทำแบบประเมิน</p>
            </div>
            <span className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-medium border border-purple-200">
              Zombie Index™ Engine
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
            <div className="flex justify-center">
              <DimensionRadarChart scores={benchmarkScores} size={280} />
            </div>

            <div className="space-y-2.5">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                3 จุดที่องค์กรส่วนใหญ่กำลังรั่วไหล:
              </div>

              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-2.5">
                <span className="text-sm">🗣️</span>
                <div>
                  <div className="text-xs font-bold text-rose-900">Voice & Feedback (36%)</div>
                  <div className="text-[11px] text-rose-700">พนักงานไม่กล้าออกเสียง กลัวกระทบความสัมพันธ์</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-2.5">
                <span className="text-sm">🛡️</span>
                <div>
                  <div className="text-xs font-bold text-amber-900">Psychological Safety (39%)</div>
                  <div className="text-[11px] text-amber-700">ไม่กล้าทดลองสิ่งใหม่เพราะกลัวการถูกชี้นิ้วหาคนผิด</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 flex items-start gap-2.5">
                <span className="text-sm">🤝</span>
                <div>
                  <div className="text-xs font-bold text-purple-900">Connection & Trust (42%)</div>
                  <div className="text-[11px] text-purple-700">เกิดกำแพงระหว่างแผนก (Silo) ทำงานตัดขาดจากกัน</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Maturity Level Distribution */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Maturity Level Breakdown</h2>
              <span className="text-xs text-slate-400">Total 148 Orgs</span>
            </div>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-rose-700">🧟 Zombie (ภาวะวิกฤต)</span>
                  <span className="text-slate-700">42 องค์กร (28%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: "28%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-orange-700">🍂 Faded (พลังจางหาย)</span>
                  <span className="text-slate-700">59 องค์กร (40%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: "40%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-amber-700">⚡ Tired (เริ่มเหนื่อยล้า)</span>
                  <span className="text-slate-700">33 องค์กร (22%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: "22%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-700">🌿 Alive (มีชีวิตชีวา)</span>
                  <span className="text-slate-700">14 องค์กร (10%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: "10%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-purple-200">Rebirth Target Goal</div>
              <div className="text-sm font-bold mt-0.5">เปลี่ยน 100 Zombie สู่ Living Org</div>
            </div>
            <Link
              to="/admin/crm"
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold backdrop-blur-sm transition-all flex items-center gap-1"
            >
              <span>เปิด CRM</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Recent Leads Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Diagnostic Leads</h2>
            <p className="text-xs text-slate-500">รายชื่อองค์กรล่าสุดที่ทำแบบประเมิน Zombie Index™</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/crm"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>จัดการบน CRM Pipeline</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-6">ผู้ติดต่อ / องค์กร</th>
                <th className="py-3.5 px-6">ตำแหน่ง / ขนาดทีม</th>
                <th className="py-3.5 px-6">ผลประเมิน</th>
                <th className="py-3.5 px-6">คะแนน</th>
                <th className="py-3.5 px-6">สถานะ CRM</th>
                <th className="py-3.5 px-6 text-right">เวลา</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-900">{lead.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      <span>{lead.company}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-xs font-medium text-slate-700">{lead.position}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{lead.teamSize}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      lead.resultLevel === "ZOMBIE" ? "bg-rose-100 text-rose-700 border border-rose-200" :
                      lead.resultLevel === "FADED" ? "bg-orange-100 text-orange-700 border border-orange-200" :
                      lead.resultLevel === "TIRED" ? "bg-amber-100 text-amber-700 border border-amber-200" :
                      "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    }`}>
                      {lead.resultLevel}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-800">
                    {lead.score} <span className="text-xs font-normal text-slate-400">/40</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-xs font-medium px-2 py-1 rounded bg-slate-100 text-slate-700">
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right text-xs text-slate-400">
                    {lead.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
