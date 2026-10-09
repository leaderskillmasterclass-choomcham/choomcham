import { useEffect, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { adminFetch } from "~/lib/admin-api.client";
const initialProject = {
  client_name: "",
  program_name: "REBORN",
  participants_count: 1,
  lead_consultant: "",
  status: "PLANNING",
  current_stage: "RESET",
};
const initialPartner = {
  partner_name: "",
  project_id: "",
  contribution_type: "SOLUTION",
  percentage: 0,
  amount: 0,
  status: "PENDING",
};
export default function Operations({
  resource,
}: {
  resource: "projects" | "partners";
}) {
  const project = resource === "projects";
  const [rows, setRows] = useState<any[]>([]),
    [document, setDocument] = useState<any>(
      project ? initialProject : initialPartner,
    ),
    [id, setId] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [ready, setReady] = useState(false);
  async function load() {
    setBusy(true);
    setError("");
    try {
      const r = await adminFetch(`/api/operations?resource=${resource}`);
      setRows((await r.json()).data);
      setReady(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    void load();
  }, [resource]);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await adminFetch("/api/operations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resource, id: id || undefined, document }),
      });
      setDocument(project ? initialProject : initialPartner);
      setId("");
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const fields = project
    ? [
        "client_name",
        "program_name",
        "participants_count",
        "lead_consultant",
        "status",
        "current_stage",
      ]
    : [
        "partner_name",
        "project_id",
        "contribution_type",
        "percentage",
        "amount",
        "status",
      ];
  const labels: Record<string, string> = {
    client_name: "องค์กร",
    program_name: "โปรแกรม",
    participants_count: "จำนวนผู้เรียน",
    lead_consultant: "ผู้รับผิดชอบ",
    status: "สถานะ",
    current_stage: "ขั้นตอน",
    partner_name: "พาร์ทเนอร์",
    project_id: "รหัสโครงการ (UUID)",
    contribution_type: "ประเภท",
    percentage: "สัดส่วน (%)",
    amount: "มูลค่า (บาท)",
  };
  const choices: Record<string, string[]> = {
    program_name: [
      "REBORN",
      "COMMUNICATION",
      "TEAM",
      "LEADER",
      "CULTURE",
      "LIVING ORGANIZATION",
      "REBORN PEOPLE",
      "ALIVE TEAM",
      "REBORN LEADER",
    ],
    status: project
      ? ["PLANNING", "IN_PROGRESS", "COMPLETED", "ON_HOLD"]
      : ["PENDING", "VERIFIED", "PAID"],
    current_stage: [
      "RESET",
      "RECONNECT",
      "RECHARGE",
      "REIMAGINE",
      "RECREATE",
      "COMPLETED",
    ],
    contribution_type: ["MARKETING", "SALES", "SOLUTION", "OPERATION"],
  };
  const fieldStyle = "block border rounded-lg p-2 w-full mt-2";
  return (
    <AdminLayout
      title={
        project ? "โครงการอบรมและการส่งมอบ" : "Partner Contribution Ledger"
      }
      subtitle="ข้อมูลจริงจากระบบ ไม่มีรายการตัวอย่าง"
    >
      <div className="space-y-6">
        <div className="flex justify-between">
          <p>{ready ? `${rows.length} รายการ` : "กำลังตรวจการเชื่อมต่อ"}</p>
          <button disabled={busy} onClick={load} className="underline">
            รีเฟรช
          </button>
        </div>
        {error && (
          <p role="alert" className="p-4 rounded-xl bg-red-50 text-red-700">
            {error}
          </p>
        )}
        <form onSubmit={save} className="p-6 bg-white border rounded-2xl">
          <h2 className="font-bold mb-4">
            {id ? "แก้ไขรายการ" : "เพิ่มรายการใหม่"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((key) => (
              <label key={key}>
                {labels[key]}
                {choices[key] ? (
                  <select
                    className={fieldStyle}
                    value={document[key]}
                    onChange={(e) =>
                      setDocument({ ...document, [key]: e.target.value })
                    }
                  >
                    {choices[key].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    className={fieldStyle}
                    required
                    type={typeof document[key] === "number" ? "number" : "text"}
                    min={key === "participants_count" ? 1 : 0}
                    max={key === "percentage" ? 100 : undefined}
                    step={
                      key === "participants_count"
                        ? 1
                        : typeof document[key] === "number"
                          ? "0.01"
                          : undefined
                    }
                    value={document[key]}
                    onChange={(e) =>
                      setDocument({
                        ...document,
                        [key]:
                          typeof document[key] === "number"
                            ? Number(e.target.value)
                            : e.target.value,
                      })
                    }
                  />
                )}
              </label>
            ))}
          </div>
          <button
            disabled={busy}
            className="mt-5 px-5 py-3 bg-purple-700 text-white rounded-xl"
          >
            {busy ? "กำลังดำเนินการ…" : "บันทึก"}
          </button>
          {id && (
            <button
              type="button"
              className="ml-4 underline"
              onClick={() => {
                setId("");
                setDocument(project ? initialProject : initialPartner);
              }}
            >
              ยกเลิกการแก้ไข
            </button>
          )}
        </form>
        <div className="bg-white border rounded-2xl overflow-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                {fields.map((k) => (
                  <th className="p-3" key={k}>
                    {labels[k]}
                  </th>
                ))}
                <th className="p-3">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  {fields.map((k) => (
                    <td className="p-3 border-t" key={k}>
                      {row[k]}
                    </td>
                  ))}
                  <td className="p-3 border-t">
                    <button
                      className="text-purple-700 underline"
                      onClick={() => {
                        setId(row.id);
                        setDocument(
                          Object.fromEntries(
                            fields.map((k) => [
                              k,
                              typeof (
                                project
                                  ? initialProject
                                  : (initialPartner as any)
                              )[k] === "number"
                                ? Number(row[k])
                                : row[k],
                            ]),
                          ),
                        );
                      }}
                    >
                      แก้ไข
                    </button>
                    {project && (
                      <small className="block break-all mt-2">{row.id}</small>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {ready && !rows.length && (
            <p className="p-6 text-slate-500">
              ยังไม่มีรายการ เริ่มเพิ่มข้อมูลจริงได้จากแบบฟอร์มด้านบน
            </p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
