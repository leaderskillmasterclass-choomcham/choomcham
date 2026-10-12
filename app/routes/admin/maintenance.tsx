import { useEffect, useState } from "react";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { adminFetch } from "~/lib/admin-api.client";
import {
  Database,
  ShieldCheck,
  ShieldAlert,
  Archive,
  RotateCcw,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  FileText,
} from "lucide-react";

interface FixtureReport {
  name: string;
  company: string;
  score: number;
  expected: number;
  actual: number;
  matches: Array<{
    id: string;
    name: string;
    company: string;
    score: number;
    result_level: string;
    created_at: string;
  }>;
  matchedExpected: boolean;
}

interface MaintenanceData {
  fixtures: FixtureReport[];
  targetLeadIds: string[];
  totalExpected: number;
  totalMatched: number;
  linkedProjectsCount: number;
  linkedCoursesCount: number;
  safetyPassed: boolean;
  totalActiveLeadsCount: number;
  archivedCount: number;
  archivedLeads: Array<{
    id: string;
    name: string;
    company: string;
    score: number;
    result_level: string;
    archived_at: string;
  }>;
  auditRecords: Array<{
    batch_id: string;
    lead_id: string;
    archived_at: string;
    snapshot: any;
  }>;
}

export default function AdminMaintenance() {
  const [data, setData] = useState<MaintenanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showConfirmArchive, setShowConfirmArchive] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminFetch("/api/maintenance");
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      } else {
        setError(json.error || "ไม่สามารถโหลดข้อมูลระบบได้");
      }
    } catch (e: any) {
      setError(e.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleArchive = async () => {
    setActing(true);
    setError("");
    setSuccessMsg("");
    setShowConfirmArchive(false);
    try {
      const res = await adminFetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "archive" }),
      });
      const json = await res.json();
      if (json.success) {
        setSuccessMsg(json.message || "จัดเก็บข้อมูลเรียบร้อยแล้ว");
        await loadData();
      } else {
        setError(json.error || "เกิดข้อผิดพลาดในการจัดเก็บข้อมูล");
      }
    } catch (e: any) {
      setError(e.message || "ดำเนินการไม่สำเร็จ");
    } finally {
      setActing(false);
    }
  };

  const handleRestore = async (batchId?: string, leadId?: string) => {
    if (!window.confirm("ต้องการกู้คืนข้อมูลทดสอบนี้กลับสู่รายการ Active หรือไม่?")) {
      return;
    }
    setActing(true);
    setError("");
    setSuccessMsg("");
    try {
      const bodyPayload = leadId
        ? { action: "restore", leadIds: [leadId] }
        : { action: "restore", batchId };
      const res = await adminFetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });
      const json = await res.json();
      if (json.success) {
        setSuccessMsg(json.message || "กู้คืนข้อมูลเรียบร้อยแล้ว");
        await loadData();
      } else {
        setError(json.error || "เกิดข้อผิดพลาดในการกู้คืน");
      }
    } catch (e: any) {
      setError(e.message || "ดำเนินการไม่สำเร็จ");
    } finally {
      setActing(false);
    }
  };

  return (
    <AdminLayout
      title="การจัดการและล้างข้อมูลระบบ (Data Maintenance)"
      subtitle="ระบบตรวจสอบความปลอดภัยและจัดเก็บ Verified Test Leads (Production Safeguard)"
    >
      <div className="space-y-6 max-w-6xl pb-12">
        {/* Top Notification / Banner */}
        {error && (
          <div
            role="alert"
            className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3 shadow-xs"
          >
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">เกิดข้อผิดพลาด</div>
              <div>{error}</div>
            </div>
          </div>
        )}

        {successMsg && (
          <div
            role="status"
            className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3 shadow-xs"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">ดำเนินการสำเร็จ</div>
              <div>{successMsg}</div>
            </div>
          </div>
        )}

        {/* Safeguard Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Target Fixtures */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Test Fixtures พร้อมเก็บ
              </span>
              <Archive className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {data ? data.totalMatched : "-"}
              </span>
              <span className="text-xs text-slate-500">
                / {data ? data.totalExpected : 6} รายการ
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {data && data.totalMatched === 0
                ? "ไม่มี Test Leads ค้างในระบบแล้ว"
                : "ระบุตัวตนแน่ชัด 5 Fixtures"}
            </p>
          </div>

          {/* Card 2: Dependencies Check */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Downstream Dependencies
              </span>
              <Shield className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {data ? data.linkedProjectsCount + data.linkedCoursesCount : "-"}
              </span>
              <span className="text-xs text-emerald-600 font-semibold">รายการเชื่อมโยง</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {data && data.linkedProjectsCount === 0 && data.linkedCoursesCount === 0
                ? "ปลอดภัย: ไม่ผูกกับโปรเจกต์จริง"
                : "เตือน: มีการผูกกับโปรเจกต์"}
            </p>
          </div>

          {/* Card 3: Safety Status */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Safety Verification
              </span>
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="mt-1">
              {data?.safetyPassed ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  PASSED (พร้อมจัดเก็บ)
                </span>
              ) : data && data.totalMatched === 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
                  CLEAN (จัดเก็บครบแล้ว)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  จำนวนไม่ตรง 2+1+1+1+1
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              ตรวจสอบโครงสร้างตาม Pre-flight
            </p>
          </div>

          {/* Card 4: Archived in Vault */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                คลังจัดเก็บ (Archived Vault)
              </span>
              <Clock className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {data ? data.archivedCount : "-"}
              </span>
              <span className="text-xs text-purple-600 font-semibold">รายการในคลัง</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              สามารถกู้คืนได้ตลอดเวลา
            </p>
          </div>
        </div>

        {/* Section 1: Pre-flight Test Leads Fixture Check */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  รายการ Verified Test Fixtures (Exact Fixtures 2+1+1+1+1)
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                ตรวจจับเฉพาะ Fixtures ตรงตามเอกลักษณ์เฉพาะตัว ไม่แตะต้องลูกค้าจริงหรือ Leads อื่น
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => void loadData()}
                disabled={loading || acting}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>ตรวจสอบใหม่</span>
              </button>

              {data && data.totalMatched > 0 && (
                <button
                  type="button"
                  onClick={() => setShowConfirmArchive(true)}
                  disabled={loading || acting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>จัดเก็บ {data.totalMatched} Test Leads</span>
                </button>
              )}
            </div>
          </div>

          {/* Fixtures Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold">
                  <th className="py-3 px-4 rounded-l-xl">ชื่อเป้าหมาย (Fixture Name)</th>
                  <th className="py-3 px-4">องค์กร / บริษัท</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4 text-center">คาดหวัง (Expected)</th>
                  <th className="py-3 px-4 text-center">พบในระบบ (Actual)</th>
                  <th className="py-3 px-4 rounded-r-xl text-right">สถานะความปลอดภัย</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {data?.fixtures.map((fix, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {fix.name}
                      {fix.matches.length > 0 && (
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                          ID: {fix.matches.map((m) => m.id.slice(0, 8)).join(", ")}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{fix.company}</td>
                    <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700">
                      {fix.score}
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-600">
                      {fix.expected}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`font-bold font-mono px-2 py-0.5 rounded-md ${
                          fix.actual === fix.expected
                            ? "bg-emerald-100 text-emerald-800"
                            : fix.actual === 0
                            ? "bg-slate-100 text-slate-500"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {fix.actual}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {fix.actual === fix.expected ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          ตรงตามเงื่อนไข
                        </span>
                      ) : fix.actual === 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                          จัดเก็บไปแล้ว / ไม่พบ
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          <AlertTriangle className="w-3 h-3" />
                          จำนวนไม่ตรง
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Safety Explanation Box */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-600 leading-relaxed flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">
                นโยบายความปลอดภัยสูงสุด (Safe-Clean Protocol):
              </span>{" "}
              การจัดเก็บจะบันทึก Snapshot ไว้ในตาราง <code>test_cleanup_audit</code> เสมอ
              และปรับสถานะ <code>archived = true, is_test = true</code> โดยไม่ทำการลบข้อมูลออกจากดิสก์
              (No Hard Deletion) ทำให้สามารถกู้คืนกลับมาได้ทันทีหากต้องการ
            </div>
          </div>
        </section>

        {/* Section 2: Archived Vault & Restore */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                คลังประวัติ Test Leads ที่จัดเก็บแล้ว (Archived Vault)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                รายการ Leads ที่ถูกแยกออกจากการคำนวณและหน้า Dashboard / CRM
              </p>
            </div>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              {data?.archivedLeads.length || 0} รายการ
            </span>
          </div>

          {data && data.archivedLeads.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              ยังไม่มี Test Leads ที่ถูกจัดเก็บในคลังประวัติ
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold">
                    <th className="py-3 px-4 rounded-l-xl">ชื่อ - องค์กร</th>
                    <th className="py-3 px-4">ผลการประเมิน</th>
                    <th className="py-3 px-4">วันที่จัดเก็บ (Archived Date)</th>
                    <th className="py-3 px-4 rounded-r-xl text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {data?.archivedLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{lead.name}</div>
                        <div className="text-xs text-slate-500">{lead.company}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {lead.result_level} ({lead.score} คะแนน)
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500">
                        {lead.archived_at
                          ? new Date(lead.archived_at).toLocaleString("th-TH")
                          : "ก่อนหน้านี้"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => void handleRestore(undefined, lead.id)}
                          disabled={acting}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>กู้คืน</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Confirmation Modal */}
        {showConfirmArchive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-amber-800">
                <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-700">
                  <Archive className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    ยืนยันการจัดเก็บ Test Leads
                  </h3>
                  <p className="text-xs text-slate-500">
                    บันทึก Snapshot และย้ายเข้าคลังประวัติ
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="flex justify-between">
                  <span>จำนวนเป้าหมาย:</span>
                  <span className="font-bold text-slate-900">{data?.totalMatched} รายการ</span>
                </div>
                <div className="flex justify-between">
                  <span>บันทึก Snapshot Audit:</span>
                  <span className="font-semibold text-emerald-700">ใช่ (test_cleanup_audit)</span>
                </div>
                <div className="flex justify-between">
                  <span>ผลกระทบต่อลูกค้าจริง:</span>
                  <span className="font-semibold text-emerald-700">ไม่มี (Exact Match)</span>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                เมื่อกดยืนยัน รายการเหล่านี้จะถูกซ่อนออกจากหน้ารายงาน และหน้า CRM
                แต่ยังสามารถกู้คืนได้เสมอที่คลังประวัติด้านล่าง
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmArchive(false)}
                  disabled={acting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={() => void handleArchive()}
                  disabled={acting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {acting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>ยืนยันจัดเก็บทันที</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
