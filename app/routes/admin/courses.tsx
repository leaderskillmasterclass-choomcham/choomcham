import { AdminLayout } from "~/components/admin/AdminLayout";
import { Link, useSearchParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import { GROWTH_PROGRAMS } from "~/lib/programs";
import { courseAuth } from "~/lib/course-auth.client";
import {
  designReadiness,
  newCourseDesign,
  parseCourseDesign,
} from "~/lib/course-design";
import type {
  CourseDesign,
  DesignRecord,
  DesignStatus,
  ProposalLead,
} from "~/lib/course-design";
import { CourseEditor } from "~/components/features/courses/CourseEditor";
import { CoursePreview } from "~/components/features/courses/CoursePreview";

export function meta() {
  return [
    { title: "ออกแบบหลักสูตรองค์กร | Choomcham Admin" },
    { name: "robots", content: "noindex, nofollow" },
  ];
}
const DRAFT_KEY = "choomcham-course-local-draft-v1";
const statusLabels = {
  DRAFT: "ร่าง",
  REVIEW: "รอตรวจภายใน",
  APPROVED: "ผ่านตรวจภายใน",
};

export default function AdminCourses() {
  const [params] = useSearchParams();
  const [design, setDesign] = useState<CourseDesign>(() => newCourseDesign());
  const [base, setBase] = useState(() => JSON.stringify(newCourseDesign()));
  const [baseStatus, setBaseStatus] = useState<DesignStatus>("DRAFT");
  const draftId = useRef(crypto.randomUUID());
  const [record, setRecord] = useState<{ id: string; version: number } | null>(
    null,
  );
  const [status, setStatus] = useState<DesignStatus>("DRAFT");
  const [records, setRecords] = useState<DesignRecord[]>([]),
    [leads, setLeads] = useState<ProposalLead[]>([]);
  const [history, setHistory] = useState<
    {
      version: number;
      document: CourseDesign;
      status: DesignStatus;
      created_at: string;
    }[]
  >([]);
  const [user, setUser] = useState("");
  const [busy, setBusy] = useState(false),
    [preview, setPreview] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    error: boolean;
  } | null>(null);
  const [template, setTemplate] = useState("reborn"),
    [leadId, setLeadId] = useState(params.get("leadId") || "");
  const messageRef = useRef<HTMLDivElement>(null),
    fileRef = useRef<HTMLInputElement>(null);
  const dirty = JSON.stringify(design) !== base || status !== baseStatus;
  const persisted = records.find((item) => item.id === record?.id);
  const previewStatus =
    persisted &&
    JSON.stringify(persisted.document) === JSON.stringify(design) &&
    persisted.status === status
      ? status
      : "DRAFT";
  const missing = designReadiness(design);
  const notice = (text: string, error = false) => setMessage({ text, error });
  const replace = (
    next: CourseDesign,
    saved?: { id: string; version: number },
    nextStatus: DesignStatus = "DRAFT",
  ) => {
    setDesign(next);
    setBase(JSON.stringify(next));
    setBaseStatus(nextStatus);
    setRecord(saved || null);
    setStatus(nextStatus);
    setHistory([]);
    setPreview(false);
    draftId.current = crypto.randomUUID();
  };
  const mayReplace = () =>
    !dirty ||
    window.confirm(
      "ร่างนี้ยังมีการแก้ไขที่ไม่ได้บันทึก ต้องการแทนที่หรือไม่? แนะนำให้บันทึกร่างในเครื่องก่อน",
    );
  useEffect(() => {
    if (!courseAuth) return;
    let active = true;
    courseAuth.auth.getSession().then(({ data }) => {
      if (active) setUser(data.session?.user.email || "");
    });
    const { data } = courseAuth.auth.onAuthStateChange((_event, session) =>
      setUser(session?.user.email || ""),
    );
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    messageRef.current?.focus();
  }, [message]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  async function api(path = "", options: RequestInit = {}) {
    const session = await courseAuth?.auth.getSession();
    if (!session?.data.session?.access_token)
      throw new Error(
        "กรุณาเข้าสู่ระบบด้วยบัญชีที่ได้รับสิทธิ์ก่อนใช้ข้อมูลทีม",
      );
    const response = await fetch(`/api/course-designs${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.data.session.access_token}`,
        ...options.headers,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "ดำเนินการไม่สำเร็จ");
    return result;
  }
  async function loadTeam() {
    setBusy(true);
    try {
      const [courses, inquiries] = await Promise.all([
        api(),
        api("?resource=leads"),
      ]);
      const valid = (Array.isArray(courses.data) ? courses.data : []).filter(
        (r: DesignRecord) =>
          parseCourseDesign(r.document) &&
          typeof r.id === "string" &&
          Number.isInteger(r.version),
      );
      setRecords(valid);
      setLeads(Array.isArray(inquiries.data) ? inquiries.data : []);
      notice("โหลดหลักสูตรและคำขอ Proposal ของทีมแล้ว");
    } catch (error) {
      notice((error as Error).message, true);
    } finally {
      setBusy(false);
    }
  }
  async function saveTeam() {
    if (!parseCourseDesign(design)) {
      notice(
        "ข้อมูลหลักสูตรมีรูปแบบไม่ถูกต้อง ตรวจจำนวนผู้เรียน เวลากิจกรรม และความยาวข้อความ",
        true,
      );
      return;
    }
    if (status !== "DRAFT" && missing.length) {
      notice("ยังส่งตรวจไม่ได้ กรุณาเติมข้อมูลตามรายการตรวจความพร้อม", true);
      return;
    }
    setBusy(true);
    try {
      const result = await api("", {
        method: "POST",
        body: JSON.stringify({
          id: record?.id || draftId.current,
          expectedVersion: record?.version || 0,
          status,
          document: design,
        }),
      });
      const saved = result.data as DesignRecord;
      if (
        !result.success ||
        !saved?.id ||
        !Number.isInteger(saved.version) ||
        !parseCourseDesign(saved.document)
      )
        throw new Error("ระบบยังไม่ยืนยันการบันทึก กรุณาลองใหม่");
      setRecord({ id: saved.id, version: saved.version });
      setBase(JSON.stringify(design));
      setBaseStatus(saved.status);
      setHistory([]);
      setRecords((current) => [
        saved,
        ...current.filter((item) => item.id !== saved.id),
      ]);
      notice(
        `บันทึกในระบบทีมแล้ว · ฉบับ ${saved.version} · ${statusLabels[saved.status]}`,
      );
    } catch (error) {
      notice((error as Error).message, true);
    } finally {
      setBusy(false);
    }
  }
  function saveLocal() {
    if (!parseCourseDesign(design)) {
      notice("ตรวจข้อมูลหลักสูตรก่อนบันทึกร่าง", true);
      return;
    }
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(design));
      setBase(JSON.stringify(design));
      setBaseStatus(status);
      notice("เก็บร่างในเบราว์เซอร์นี้แล้ว ยังไม่ได้บันทึกในระบบทีม");
    } catch {
      notice("เก็บร่างในเครื่องไม่สำเร็จ กรุณาดาวน์โหลดไฟล์ร่างแทน", true);
    }
  }
  function exportDraft() {
    if (!parseCourseDesign(design)) {
      notice("ตรวจข้อมูลก่อนดาวน์โหลด", true);
      return;
    }
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(design, null, 2)], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "choomcham-course-draft.json";
    link.click();
    URL.revokeObjectURL(url);
  }
  async function importDraft(file?: File) {
    if (!file) return;
    try {
      if (file.size > 100000) throw new Error("ไฟล์ร่างใหญ่เกินไป");
      const parsed = parseCourseDesign(JSON.parse(await file.text()));
      if (!parsed) throw new Error("ไฟล์นี้ไม่ใช่ร่างหลักสูตรที่รองรับ");
      if (mayReplace()) {
        replace(parsed);
        notice("นำเข้าเป็นร่างใหม่แล้ว ยังไม่บันทึกในระบบทีม");
      }
    } catch (error) {
      notice((error as Error).message, true);
    }
  }
  const updateDesign = (next: CourseDesign) => {
    setDesign(next);
    if (status !== "DRAFT") setStatus("DRAFT");
  };
  return (
    <AdminLayout
      title="ออกแบบหลักสูตรองค์กร"
      subtitle="โจทย์องค์กร → หลักสูตร → Proposal"
    >
      <div className="course-admin">
        {message && (
          <div
            className={`course-notice ${message.error ? "error" : ""}`}
            ref={messageRef}
            tabIndex={-1}
            role={message.error ? "alert" : "status"}
          >
            {message.text}
          </div>
        )}
        <a href="#course-content" className="course-link no-print">
          ไปพื้นที่เขียนหลักสูตร ↓
        </a>
        <div className="course-workspace">
          <aside className="course-sidebar no-print">
            <section className="course-panel">
              <h2>ข้อมูลทีม</h2>
              <button
                disabled={busy}
                className="course-button"
                onClick={loadTeam}
              >
                {busy ? "กำลังดำเนินการ…" : "โหลดหลักสูตร / คำขอองค์กร"}
              </button>
              <small>บัญชีเดียวกับ Choomcham Admin</small>
            </section>
            <section className="course-panel">
              <h2>เริ่มออกแบบ</h2>
              <label htmlFor="course-template">ต้นแบบหลักสูตร</label>
              <select
                id="course-template"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
              >
                {GROWTH_PROGRAMS.map((program) => (
                  <option key={program.slug} value={program.slug}>
                    {program.level} · {program.code}
                  </option>
                ))}
              </select>
              <button
                className="course-button secondary"
                disabled={busy}
                onClick={() => {
                  if (mayReplace()) {
                    replace(newCourseDesign(template));
                    notice(
                      "เริ่มร่างจากต้นแบบแล้ว ปรับตามบริบทองค์กรก่อนส่งตรวจ",
                    );
                  }
                }}
              >
                สร้างร่างจากต้นแบบ
              </button>
              <label htmlFor="course-lead">คำขอ Proposal จากองค์กร</label>
              <select
                id="course-lead"
                value={leadId}
                disabled={!leads.length}
                onChange={(e) => setLeadId(e.target.value)}
              >
                <option value="">เลือกคำขอที่โหลดจากทีม</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.company} · {lead.name || "ผู้ประสานงาน"}
                  </option>
                ))}
              </select>
              <button
                className="course-button secondary"
                disabled={busy || !leads.some((lead) => lead.id === leadId)}
                onClick={() => {
                  const lead = leads.find((l) => l.id === leadId);
                  if (lead && mayReplace()) {
                    replace(
                      newCourseDesign(
                        lead.dimensions_scores?.program_slug || template,
                        lead,
                      ),
                    );
                    notice(
                      "นำโจทย์องค์กรเข้าร่างแล้ว เติมหลักฐาน กิจกรรม และแผนวัดผลก่อนเสนอ",
                    );
                  }
                }}
              >
                ออกแบบจากโจทย์องค์กร
              </button>
            </section>
            <section className="course-panel">
              <h2>หลักสูตรที่ทีมบันทึก</h2>
              {!records.length && <p>ยังไม่มีรายการที่โหลด</p>}
              <div className="course-saved-list">
                {records.map((item) => (
                  <button
                    key={item.id}
                    disabled={busy}
                    onClick={() => {
                      if (mayReplace())
                        replace(
                          item.document,
                          { id: item.id, version: item.version },
                          item.status,
                        );
                    }}
                  >
                    <strong>{item.document.title}</strong>
                    <small>
                      {item.document.organization || "ยังไม่ระบุองค์กร"} · ฉบับ{" "}
                      {item.version} · {statusLabels[item.status]}
                    </small>
                  </button>
                ))}
              </div>
            </section>
            <section className="course-panel">
              <h2>เก็บและย้ายร่าง</h2>
              <button className="course-button secondary" onClick={saveLocal}>
                เก็บร่างในเครื่อง
              </button>
              <button
                className="course-link"
                onClick={() => {
                  try {
                    const saved = parseCourseDesign(
                      JSON.parse(localStorage.getItem(DRAFT_KEY) || "null"),
                    );
                    if (!saved) {
                      notice("ไม่พบร่างที่รองรับในเบราว์เซอร์นี้", true);
                      return;
                    }
                    if (mayReplace()) {
                      replace(saved);
                      notice("เปิดร่างในเครื่องเป็นร่างใหม่แล้ว");
                    }
                  } catch {
                    notice("เปิดร่างไม่สำเร็จ", true);
                  }
                }}
              >
                เปิดร่างในเครื่อง
              </button>
              <button className="course-link" onClick={exportDraft}>
                ดาวน์โหลดไฟล์ร่าง
              </button>
              <button
                className="course-link"
                onClick={() => fileRef.current?.click()}
              >
                นำเข้าไฟล์ร่าง
              </button>
              <input
                hidden
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                onChange={(e) => {
                  void importDraft(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
              <small>
                ร่างในเครื่องอยู่เฉพาะเบราว์เซอร์นี้
                การนำเข้าและเปิดร่างในเครื่องจะสร้างร่างใหม่
              </small>
            </section>
          </aside>
          <main id="course-content" className="course-main">
            <section className="course-toolbar no-print">
              <div>
                <strong>
                  {record ? `ฉบับทีม ${record.version}` : "ร่างใหม่"}
                </strong>
                <span>
                  {dirty ? " · มีการแก้ไขที่ยังไม่บันทึก" : " · พร้อมแก้ไข"}
                </span>
              </div>
              <div className="course-actions">
                <button
                  className="course-button secondary"
                  onClick={() => setPreview(!preview)}
                >
                  {preview ? "กลับไปเขียนหลักสูตร" : "ดูข้อเสนอสำหรับองค์กร"}
                </button>
                <button
                  className="course-button secondary"
                  onClick={() => {
                    setPreview(true);
                    requestAnimationFrame(() =>
                      requestAnimationFrame(() => window.print()),
                    );
                  }}
                >
                  พิมพ์ / PDF
                </button>
                <label htmlFor="course-status" className="sr-only">
                  สถานะการตรวจภายใน
                </label>
                <select
                  id="course-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as DesignStatus)}
                >
                  <option value="DRAFT">ร่าง</option>
                  <option value="REVIEW" disabled={!!missing.length}>
                    รอตรวจภายใน
                  </option>
                  <option value="APPROVED" disabled={!!missing.length}>
                    ผ่านตรวจภายใน
                  </option>
                </select>
                <button
                  className="course-button"
                  disabled={busy || !user}
                  onClick={saveTeam}
                >
                  บันทึกในระบบทีม
                </button>
              </div>
            </section>
            <section className="course-readiness no-print">
              <strong>
                {missing.length
                  ? `ยังต้องเติม ${missing.length} รายการก่อนส่งตรวจ`
                  : "ข้อมูลพร้อมสำหรับการตรวจภายใน"}
              </strong>
              <p>
                สถานะตรวจภายในไม่ใช่การอนุมัติซื้อของลูกค้า
                และไม่ใช่การยืนยันราคาอัตโนมัติ
              </p>
              {missing.length > 0 && (
                <details>
                  <summary>ดูรายการที่ต้องเติม</summary>
                  <ul>
                    {missing.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </details>
              )}
            </section>
            {preview ? (
              <CoursePreview design={design} status={previewStatus} />
            ) : (
              <CourseEditor design={design} onChange={updateDesign} />
            )}
            {record && (
              <section className="course-panel no-print">
                <h2>ประวัติฉบับทีม</h2>
                <button
                  disabled={busy}
                  className="course-button secondary"
                  onClick={async () => {
                    setBusy(true);
                    try {
                      const result = await api(
                        `?resource=history&id=${encodeURIComponent(record.id)}`,
                      );
                      setHistory(
                        (result.data || []).filter(
                          (item: { document: unknown }) =>
                            parseCourseDesign(item.document),
                        ),
                      );
                      notice("โหลดประวัติฉบับทีมแล้ว");
                    } catch (error) {
                      notice((error as Error).message, true);
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  โหลดประวัติการแก้ไข
                </button>
                {history.map((item) => (
                  <div className="course-history-row" key={item.version}>
                    <span>
                      ฉบับ {item.version} · {statusLabels[item.status]} ·{" "}
                      {new Date(item.created_at).toLocaleString("th-TH")}
                    </span>
                    <button
                      className="course-link"
                      onClick={() => {
                        if (mayReplace()) {
                          setDesign(item.document);
                          setStatus("DRAFT");
                          notice(
                            `นำเนื้อหาฉบับ ${item.version} กลับมาแก้ไขแล้ว กดบันทึกเพื่อสร้างฉบับใหม่`,
                          );
                        }
                      }}
                    >
                      นำเนื้อหากลับมาแก้ไข
                    </button>
                  </div>
                ))}
              </section>
            )}
          </main>
        </div>
      </div>
    </AdminLayout>
  );
}
