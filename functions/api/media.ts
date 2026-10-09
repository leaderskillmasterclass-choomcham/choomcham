// Use the existing Cloudflare R2 binding; no embedded S3 credentials.
import { json } from "../lib/admin-auth";
const validKey = (key: unknown): key is string =>
  typeof key === "string" &&
  key.length > 0 &&
  key.length <= 500 &&
  !key.includes("..") &&
  !/[\x00-\x1f\\]/.test(key) &&
  !key.startsWith("/");
const publicUrl = (env: any, key: string) =>
  `${(env.R2_PUBLIC_DOMAIN || "").replace(/\/$/, "")}/${key.split("/").map(encodeURIComponent).join("/")}`;
export async function onRequestGet({
  request,
  env,
}: {
  request: Request;
  env: any;
}) {
  if (!env.CHOOMCHAM_R2_BUCKET || !env.R2_PUBLIC_DOMAIN)
    return json(
      { error: "ยังไม่ได้ตั้งค่า R2 binding และ public domain" },
      503,
    );
  const url = new URL(request.url),
    prefix = url.searchParams.get("prefix") || "Alive_Model/";
  if (!validKey(prefix)) return json({ error: "โฟลเดอร์ไม่ถูกต้อง" }, 400);
  try {
    const list = await env.CHOOMCHAM_R2_BUCKET.list({
      prefix,
      limit: 1000,
      cursor: url.searchParams.get("cursor") || undefined,
    });
    const items = list.objects
      .filter((o: any) => !o.key.endsWith("/"))
      .map((o: any) => ({
        key: o.key,
        size: o.size,
        lastModified: o.uploaded.toISOString(),
        url: publicUrl(env, o.key),
        name: o.key.split("/").pop(),
      }));
    return json({
      success: true,
      count: items.length,
      prefix,
      items,
      cursor: list.truncated ? list.cursor : null,
    });
  } catch {
    return json({ error: "โหลดสื่อไม่สำเร็จ" }, 503);
  }
}
export async function onRequestPost({
  request,
  env,
}: {
  request: Request;
  env: any;
}) {
  if (!env.CHOOMCHAM_R2_BUCKET || !env.R2_PUBLIC_DOMAIN)
    return json(
      { error: "ยังไม่ได้ตั้งค่า R2 binding และ public domain" },
      503,
    );
  if (Number(request.headers.get("Content-Length")) > 21 * 1024 * 1024)
    return json({ error: "ไฟล์ใหญ่เกินไป" }, 413);
  try {
    const form = await request.formData(),
      file = form.get("file");
    if (
      !(file instanceof File) ||
      file.size > 20 * 1024 * 1024 ||
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "application/pdf",
      ].includes(file.type)
    )
      return json({ error: "รองรับภาพและ PDF ขนาดไม่เกิน 20 MB" }, 400);
    const folder = String(form.get("folder") || "Alive_Model/"),
      supplied = String(form.get("filename") || "");
    const filename = (
      supplied || `${crypto.randomUUID()}-${file.name}`
    ).replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `${folder.replace(/\/$/, "")}/${filename}`;
    if (!validKey(key)) return json({ error: "รหัสไฟล์ไม่ถูกต้อง" }, 400);
    const saved = await env.CHOOMCHAM_R2_BUCKET.put(
      key,
      await file.arrayBuffer(),
      {
        httpMetadata: { contentType: file.type },
        onlyIf: new Headers({ "If-None-Match": "*" }),
      },
    );
    if (!saved)
      return json({ error: "ชื่อไฟล์นี้มีอยู่แล้ว กรุณาใช้ชื่อใหม่" }, 409);
    return json({
      success: true,
      key,
      url: publicUrl(env, key),
      filename,
      size: file.size,
      contentType: file.type,
    });
  } catch {
    return json({ error: "อัปโหลดไม่สำเร็จ" }, 503);
  }
}
export async function onRequestDelete({
  request,
  env,
}: {
  request: Request;
  env: any;
}) {
  if (!env.CHOOMCHAM_R2_BUCKET)
    return json({ error: "ยังไม่ได้ตั้งค่า R2 binding" }, 503);
  const key = new URL(request.url).searchParams.get("key");
  if (!validKey(key)) return json({ error: "รหัสไฟล์ไม่ถูกต้อง" }, 400);
  // Recoverable archive rather than permanent object deletion.
  try {
    const original = await env.CHOOMCHAM_R2_BUCKET.get(key);
    if (!original) return json({ error: "ไม่พบไฟล์" }, 404);
    const archiveKey = `_archive/${crypto.randomUUID()}/${key}`;
    const archive = await env.CHOOMCHAM_R2_BUCKET.put(
      archiveKey,
      original.body,
      {
        httpMetadata: original.httpMetadata,
        customMetadata: {
          originalKey: key,
          archivedAt: new Date().toISOString(),
        },
      },
    );
    if (!archive) return json({ error: "สำรองไฟล์ไม่สำเร็จ" }, 503);
    await env.CHOOMCHAM_R2_BUCKET.delete(key);
    return json({ success: true, archiveKey });
  } catch {
    return json({ error: "เก็บไฟล์ถาวรไม่สำเร็จ" }, 503);
  }
}
