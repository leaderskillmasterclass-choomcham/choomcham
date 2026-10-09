import * as XLSX from "xlsx";

/**
 * Helper to trigger browser file download from Blob
 */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export CRM Leads & Assessment Data to Excel (.xlsx)
 */
export function exportLeadsToExcel(leads: any[], filename = "choomcham_leads_database") {
  const formattedData = leads.map((item, index) => {
    return {
      "ลำดับ": index + 1,
      "รหัส Lead": item.id || "-",
      "วันที่ส่งข้อมูล": item.createdAt || (item.created_at ? new Date(item.created_at).toLocaleString("th-TH") : "-"),
      "ชื่อผู้ติดต่อ": item.name || "-",
      "บริษัท / องค์กร": item.company || "-",
      "ตำแหน่งงาน": item.position || "-",
      "ช่องทางติดต่อ (Tel / LINE / Email)": item.emailOrLine || item.email_or_line || "-",
      "ขนาดทีม / ความสนใจ": item.teamSize || item.team_size || "-",
      "คะแนนประเมิน (/40)": item.score !== undefined ? item.score : "-",
      "ระดับสภาวะองค์กร": item.resultLevel || item.result_level || "-",
      "สถานะ CRM": item.status || "NEW",
      "บันทึกโน้ตจากทีมงาน": item.notes || "-",
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // Set column widths for readability
  worksheet["!cols"] = [
    { wch: 6 },  // ลำดับ
    { wch: 36 }, // รหัส Lead
    { wch: 20 }, // วันที่
    { wch: 22 }, // ชื่อผู้ติดต่อ
    { wch: 26 }, // บริษัท
    { wch: 20 }, // ตำแหน่ง
    { wch: 30 }, // ช่องทางติดต่อ
    { wch: 18 }, // ขนาดทีม
    { wch: 18 }, // คะแนน
    { wch: 18 }, // ระดับสภาวะ
    { wch: 15 }, // สถานะ CRM
    { wch: 40 }, // โน้ต
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Leads & Assessment");

  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadBlob(blob, `${filename}_${dateStr}.xlsx`);
}

/**
 * Export Executive Overview & 7 Dimensions Report
 */
export function exportExecutiveReportToExcel(
  stats: any[],
  maturityCounts: Record<string, number>,
  dimensionScores: Record<string, any>,
  leads: any[]
) {
  const workbook = XLSX.utils.book_new();

  // Sheet 1: Executive KPI Summary
  const kpiData = stats.map((s, idx) => ({
    "ลำดับ": idx + 1,
    "ตัวชี้วัด (KPI)": s.label,
    "ค่าสถิติปัจจุบัน": s.value,
    "หมายเหตุ": s.change || "",
  }));
  const kpiSheet = XLSX.utils.json_to_sheet(kpiData);
  kpiSheet["!cols"] = [{ wch: 8 }, { wch: 30 }, { wch: 20 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(workbook, kpiSheet, "KPI Overview");

  // Sheet 2: 7 Dimensions Average
  const dimData = Object.entries(dimensionScores).map(([key, val]: [string, any], idx) => ({
    "ลำดับ": idx + 1,
    "มิติสุขภาพองค์กร": key,
    "คะแนนเฉลี่ย": val.current,
    "คะแนนเต็ม": val.max,
    "คิดเป็นร้อยละ (%)": `${val.percentage}%`,
  }));
  const dimSheet = XLSX.utils.json_to_sheet(dimData);
  dimSheet["!cols"] = [{ wch: 8 }, { wch: 28 }, { wch: 15 }, { wch: 15 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(workbook, dimSheet, "7 Dimensions Benchmark");

  // Sheet 3: Maturity Distribution
  const matData = Object.entries(maturityCounts).map(([key, count], idx) => ({
    "ลำดับ": idx + 1,
    "ระดับสภาวะ": key,
    "จำนวนองค์กร": count,
    "สัดส่วน (%)": leads.length > 0 ? `${Math.round((count / leads.length) * 100)}%` : "0%",
  }));
  const matSheet = XLSX.utils.json_to_sheet(matData);
  matSheet["!cols"] = [{ wch: 8 }, { wch: 20 }, { wch: 15 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(workbook, matSheet, "Maturity Distribution");

  // Sheet 4: Raw Leads
  const rawLeadsData = leads.map((l, idx) => ({
    "ลำดับ": idx + 1,
    "วันที่": l.createdAt || (l.created_at ? new Date(l.created_at).toLocaleString("th-TH") : "-"),
    "ชื่อผู้ติดต่อ": l.name,
    "บริษัท": l.company,
    "ตำแหน่ง": l.position,
    "ติดต่อ": l.emailOrLine || l.email_or_line,
    "ขนาดทีม": l.teamSize || l.team_size || "-",
    "คะแนน": l.score,
    "สภาวะ": l.resultLevel || l.result_level,
    "สถานะ CRM": l.status,
  }));
  const leadsSheet = XLSX.utils.json_to_sheet(rawLeadsData);
  leadsSheet["!cols"] = [
    { wch: 8 }, { wch: 20 }, { wch: 22 }, { wch: 25 }, { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 15 }
  ];
  XLSX.utils.book_append_sheet(workbook, leadsSheet, "All Diagnostic Leads");

  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadBlob(blob, `choomcham_executive_report_${dateStr}.xlsx`);
}

/**
 * Export Transformation Projects to Excel
 */
export function exportProjectsToExcel(projects: any[]) {
  const formattedData = projects.map((p, idx) => ({
    "ลำดับ": idx + 1,
    "รหัสโครงการ": p.id,
    "ลูกค้า / องค์กร": p.client || p.client_name,
    "หลักสูตร Transformation": p.program || p.program_name,
    "จำนวนผู้เข้าร่วม": p.participants || `${p.participants_count || 0} คน`,
    "ขั้นตอนปัจจุบัน": p.currentStage || p.current_stage,
    "Lead Consultant": p.leadConsultant || p.lead_consultant,
    "สถานะ": p.status,
    "วันเริ่มต้น": p.startDate || p.start_date,
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  worksheet["!cols"] = [
    { wch: 8 }, { wch: 15 }, { wch: 25 }, { wch: 35 }, { wch: 18 }, { wch: 25 }, { wch: 25 }, { wch: 15 }, { wch: 15 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transformation Projects");

  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadBlob(blob, `choomcham_projects_delivery_${dateStr}.xlsx`);
}

/**
 * Export Partner Contribution Ledger to Excel
 */
export function exportPartnersLedgerToExcel(ledger: any[], metrics: any[]) {
  const workbook = XLSX.utils.book_new();

  // Sheet 1: Ledger Entries
  const ledgerData = ledger.map((l, idx) => ({
    "ลำดับ": idx + 1,
    "รหัสรายการ": l.id,
    "พาร์ทเนอร์ / สมาชิก": l.partner || l.partner_name,
    "โครงการ": l.project || l.project_name || "-",
    "มิติการมีส่วนร่วม": l.type || l.contribution_type,
    "สัดส่วนส่วนแบ่ง": l.contribution || `${l.percentage}%`,
    "สถานะ": l.status,
  }));
  const ledgerSheet = XLSX.utils.json_to_sheet(ledgerData);
  ledgerSheet["!cols"] = [
    { wch: 8 }, { wch: 15 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 18 }, { wch: 15 }
  ];
  XLSX.utils.book_append_sheet(workbook, ledgerSheet, "Contribution Ledger");

  // Sheet 2: KPI Metrics
  const metricsData = metrics.map((m, idx) => ({
    "ลำดับ": idx + 1,
    "ตัวชี้วัด Pilot 3 เดือน": m.label,
    "ค่าผลลัพธ์": m.value,
    "คำอธิบาย": m.desc,
  }));
  const metricsSheet = XLSX.utils.json_to_sheet(metricsData);
  metricsSheet["!cols"] = [{ wch: 8 }, { wch: 30 }, { wch: 20 }, { wch: 35 }];
  XLSX.utils.book_append_sheet(workbook, metricsSheet, "Pilot 3M KPIs");

  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadBlob(blob, `choomcham_partner_ledger_${dateStr}.xlsx`);
}
