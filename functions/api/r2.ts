export async function onRequestPost(context: { request: Request; env: any }) {
  const { request, env } = context;
  const r2Bucket = env.CHOOMCHAM_R2_BUCKET;

  if (!r2Bucket) {
    return new Response(JSON.stringify({ error: "R2 Bucket not bound" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const customKey = formData.get("key") as string;

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
    ) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const key =
      customKey ||
      `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    if (!/^[a-zA-Z0-9_./-]+$/.test(key) || key.includes(".."))
      return new Response(JSON.stringify({ error: "รหัสไฟล์ไม่ถูกต้อง" }), {
        status: 400,
      });
    const arrayBuffer = await file.arrayBuffer();

    const saved = await r2Bucket.put(key, arrayBuffer, {
      httpMetadata: { contentType: file.type || "application/octet-stream" },
      onlyIf: new Headers({ "If-None-Match": "*" }),
    });

    if (!saved)
      return new Response(
        JSON.stringify({ error: "ชื่อไฟล์ซ้ำ กรุณาใช้ชื่อใหม่" }),
        { status: 409 },
      );
    const publicUrl = env.R2_PUBLIC_DOMAIN
      ? `${env.R2_PUBLIC_DOMAIN.replace(/\/$/, "")}/${key.split("/").map(encodeURIComponent).join("/")}`
      : `/api/r2?key=${encodeURIComponent(key)}`;

    return new Response(
      JSON.stringify({ success: true, key, url: publicUrl }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function onRequestGet(context: { request: Request; env: any }) {
  const { request, env } = context;
  const r2Bucket = env.CHOOMCHAM_R2_BUCKET;
  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  if (!r2Bucket || !key) {
    return new Response(JSON.stringify({ error: "Missing bucket or key" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const object = await r2Bucket.get(key);
  if (!object) {
    return new Response("Asset not found", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("Cache-Control", "public, max-age=31536000");

  return new Response(object.body, { headers });
}
