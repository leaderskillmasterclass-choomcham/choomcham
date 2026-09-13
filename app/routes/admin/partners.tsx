import React from "react";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { Handshake, Award, Coins, PieChart, Users, Sparkles, TrendingUp } from "lucide-react";

export function meta() {
  return [
    { title: "Partner Network & Contribution Ledger | Choomcham House OS" },
  ];
}

export default function AdminPartners() {
  const ledgerEntries = [
    {
      id: "LED-101",
      partner: "ครูเด่น (Lead Master Fa)",
      project: "Creative Studio 88",
      type: "SOLUTION & FACILITATION",
      contribution: "40%",
      points: "40,000",
      status: "Verified",
    },
    {
      id: "LED-102",
      partner: "Partner Growth Team A",
      project: "Creative Studio 88",
      type: "MARKETING & LEAD GEN",
      contribution: "20%",
      points: "20,000",
      status: "Verified",
    },
    {
      id: "LED-103",
      partner: "Consultant Sales B",
      project: "Creative Studio 88",
      type: "SALES CLOSING",
      contribution: "20%",
      points: "20,000",
      status: "Verified",
    },
    {
      id: "LED-104",
      partner: "Operations & Logistics C",
      project: "Creative Studio 88",
      type: "OPERATION DELIVERY",
      contribution: "20%",
      points: "20,000",
      status: "Verified",
    },
  ];

  const pilotMetrics = [
    { label: "1. Customer Growth", value: "5 องค์กร", desc: "Target 10 Orgs in Pilot" },
    { label: "2. Gross Revenue", value: "฿750,000", desc: "โครงการ Transformation" },
    { label: "3. Actual Profit", value: "62%", desc: "อัตรากำไรหลังหักต้นทุนจัดส่ง" },
    { label: "4. Marketing / System Cost", value: "฿18,500", desc: "Cloudflare + Tooling Free Tier" },
    { label: "5. Time & Effort", value: "120 ชม.", desc: "Facilitation & Coaching Hours" },
    { label: "6. Customer CSAT / NPS", value: "9.6 / 10", desc: "ความพึงพอใจการ Reborn" },
  ];

  return (
    <AdminLayout
      title="Partner Network & Contribution Ledger"
      subtitle="ระบบบันทึกคุณค่าและการมีส่วนร่วม 4 ด้าน (Marketing, Sales, Solution, Operation) และตัวชี้วัด Pilot 3 เดือน"
    >
      {/* Pilot 6 Metrics Cards */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
          📊 Pilot 3-Month KPI Tracking (6 มิติหลัก)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pilotMetrics.map((m, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="text-xs font-semibold text-purple-700">{m.label}</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{m.value}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Contribution Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Contribution Ledger</h2>
            <p className="text-xs text-slate-500">บันทึกสัดส่วนการลงแรงและสร้างผลลัพธ์ของพาร์ทเนอร์รายโปรเจกต์</p>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-semibold">
            Transparent Equity Model
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-6">พาร์ทเนอร์ / สมาชิก</th>
                <th className="py-3.5 px-6">โปรเจกต์</th>
                <th className="py-3.5 px-6">มิติการมีส่วนร่วม (4 Dimensions)</th>
                <th className="py-3.5 px-6">สัดส่วน</th>
                <th className="py-3.5 px-6">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {ledgerEntries.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-900">{row.partner}</td>
                  <td className="py-4 px-6 text-xs text-slate-600">{row.project}</td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                      {row.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-800">{row.contribution}</td>
                  <td className="py-4 px-6">
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {row.status}
                    </span>
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
