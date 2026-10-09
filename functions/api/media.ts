// Cloudflare Serverless Function: /api/media
// Manages Media & Gallery on Cloudflare R2 Bucket "media"

const ACCOUNT_ID = "1af3cf042ce92dccf6c10ecb81c0181b";
const ACCESS_KEY_ID = "b8a19572c58da6fc4ce68cc3f299bdc6";
const SECRET_ACCESS_KEY = "e2499c1ccc5a5bd55a7ac1a5223e035cc0b127774605638d507b373af70ad1e6";
const BUCKET_NAME = "media";
const PUBLIC_DOMAIN = "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev";

// Helper for AWS Signature v4 in Cloudflare Workers environment (using Web Crypto API)
async function hmac(key: ArrayBuffer | Uint8Array | string, str: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const keyData: BufferSource = typeof key === "string" ? encoder.encode(key) : (key as BufferSource);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(str));
}

async function sha256Hex(data: ArrayBuffer | Uint8Array | string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer: BufferSource = typeof data === "string" ? encoder.encode(data) : (data as BufferSource);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// GET: List R2 Objects in folder/prefix
export async function onRequestGet(context: { request: Request; env: any }) {
  const { request, env } = context;
  const url = new URL(request.url);
  const prefix = url.searchParams.get("prefix") || "Alive_Model/";

  const accountId = env.CLOUDFLARE_ACCOUNT_ID || ACCOUNT_ID;
  const accessKeyId = env.R2_ACCESS_KEY_ID || ACCESS_KEY_ID;
  const secretAccessKey = env.R2_SECRET_ACCESS_KEY || SECRET_ACCESS_KEY;
  const bucket = env.R2_BUCKET_NAME || BUCKET_NAME;
  const publicDomain = env.R2_PUBLIC_DOMAIN || PUBLIC_DOMAIN;

  try {
    const host = `${accountId}.r2.cloudflarestorage.com`;
    const canonicalUri = `/${bucket}`;
    const canonicalQuery = `list-type=2&prefix=${encodeURIComponent(prefix)}`;
    const endpoint = `https://${host}${canonicalUri}?${canonicalQuery}`;

    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
    const dateStamp = amzDate.substring(0, 8);
    const region = "auto";
    const service = "s3";

    const payloadHash = await sha256Hex("");
    const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
    const signedHeaders = "host;x-amz-content-sha256;x-amz-date";

    const canonicalRequest = ["GET", canonicalUri, canonicalQuery, canonicalHeaders, signedHeaders, payloadHash].join("\n");
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const stringToSign = ["AWS4-HMAC-SHA256", amzDate, credentialScope, await sha256Hex(canonicalRequest)].join("\n");

    const kDate = await hmac("AWS4" + secretAccessKey, dateStamp);
    const kRegion = await hmac(kDate, region);
    const kService = await hmac(kRegion, service);
    const kSigning = await hmac(kService, "aws4_request");
    const signature = bufferToHex(await hmac(kSigning, stringToSign));

    const authHeader = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const r2Res = await fetch(endpoint, {
      headers: {
        host: host,
        "x-amz-date": amzDate,
        "x-amz-content-sha256": payloadHash,
        Authorization: authHeader,
      },
    });

    if (!r2Res.ok) {
      const errText = await r2Res.text();
      return new Response(JSON.stringify({ error: `R2 API Error: ${errText}`, status: r2Res.status }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const xml = await r2Res.text();

    // Parse XML contents
    const items: Array<{ key: string; size: number; lastModified: string; url: string; name: string }> = [];
    const contentsRegex = /<Contents>([\s\S]*?)<\/Contents>/g;
    let match;

    while ((match = contentsRegex.exec(xml)) !== null) {
      const block = match[1];
      const keyMatch = /<Key>(.*?)<\/Key>/.exec(block);
      const sizeMatch = /<Size>(.*?)<\/Size>/.exec(block);
      const modMatch = /<LastModified>(.*?)<\/LastModified>/.exec(block);

      if (keyMatch && keyMatch[1]) {
        const key = keyMatch[1];
        // Skip directory placeholder
        if (key.endsWith("/")) continue;

        const size = sizeMatch ? parseInt(sizeMatch[1], 10) : 0;
        const lastModified = modMatch ? modMatch[1] : "";
        const filename = key.split("/").pop() || key;

        items.push({
          key,
          size,
          lastModified,
          url: `${publicDomain}/${key}`,
          name: filename,
        });
      }
    }

    return new Response(JSON.stringify({ success: true, count: items.length, prefix, items }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// POST: Upload file to R2
export async function onRequestPost(context: { request: Request; env: any }) {
  const { request, env } = context;

  const accountId = env.CLOUDFLARE_ACCOUNT_ID || ACCOUNT_ID;
  const accessKeyId = env.R2_ACCESS_KEY_ID || ACCESS_KEY_ID;
  const secretAccessKey = env.R2_SECRET_ACCESS_KEY || SECRET_ACCESS_KEY;
  const bucket = env.R2_BUCKET_NAME || BUCKET_NAME;
  const publicDomain = env.R2_PUBLIC_DOMAIN || PUBLIC_DOMAIN;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "Alive_Model/";
    let customFilename = (formData.get("filename") as string) || "";

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Sanitize filename
    const origName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = customFilename ? customFilename.replace(/[^a-zA-Z0-9._-]/g, "_") : origName;
    
    // Ensure folder has trailing slash
    const normalizedFolder = folder.endsWith("/") ? folder : `${folder}/`;
    const key = `${normalizedFolder}${filename}`;

    const host = `${accountId}.r2.cloudflarestorage.com`;
    const canonicalUri = `/${bucket}/${key}`;
    const endpoint = `https://${host}${canonicalUri}`;

    const arrayBuffer = await file.arrayBuffer();
    const contentType = file.type || "image/jpeg";

    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
    const dateStamp = amzDate.substring(0, 8);
    const region = "auto";
    const service = "s3";

    const payloadHash = await sha256Hex(arrayBuffer);
    const canonicalHeaders = `content-type:${contentType}\nhost:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
    const signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date";

    const canonicalRequest = ["PUT", canonicalUri, "", canonicalHeaders, signedHeaders, payloadHash].join("\n");
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const stringToSign = ["AWS4-HMAC-SHA256", amzDate, credentialScope, await sha256Hex(canonicalRequest)].join("\n");

    const kDate = await hmac("AWS4" + secretAccessKey, dateStamp);
    const kRegion = await hmac(kDate, region);
    const kService = await hmac(kRegion, service);
    const kSigning = await hmac(kService, "aws4_request");
    const signature = bufferToHex(await hmac(kSigning, stringToSign));

    const authHeader = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const r2Res = await fetch(endpoint, {
      method: "PUT",
      headers: {
        host: host,
        "content-type": contentType,
        "x-amz-date": amzDate,
        "x-amz-content-sha256": payloadHash,
        Authorization: authHeader,
      },
      body: arrayBuffer,
    });

    if (!r2Res.ok) {
      const errText = await r2Res.text();
      return new Response(JSON.stringify({ error: `R2 Upload Failed: ${errText}` }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const publicUrl = `${publicDomain}/${key}`;

    return new Response(
      JSON.stringify({
        success: true,
        key,
        url: publicUrl,
        filename,
        size: file.size,
        contentType,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// DELETE: Remove object from R2
export async function onRequestDelete(context: { request: Request; env: any }) {
  const { request, env } = context;
  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  if (!key) {
    return new Response(JSON.stringify({ error: "Missing key parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const accountId = env.CLOUDFLARE_ACCOUNT_ID || ACCOUNT_ID;
  const accessKeyId = env.R2_ACCESS_KEY_ID || ACCESS_KEY_ID;
  const secretAccessKey = env.R2_SECRET_ACCESS_KEY || SECRET_ACCESS_KEY;
  const bucket = env.R2_BUCKET_NAME || BUCKET_NAME;

  try {
    const host = `${accountId}.r2.cloudflarestorage.com`;
    const canonicalUri = `/${bucket}/${key}`;
    const endpoint = `https://${host}${canonicalUri}`;

    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
    const dateStamp = amzDate.substring(0, 8);
    const region = "auto";
    const service = "s3";

    const payloadHash = await sha256Hex("");
    const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
    const signedHeaders = "host;x-amz-content-sha256;x-amz-date";

    const canonicalRequest = ["DELETE", canonicalUri, "", canonicalHeaders, signedHeaders, payloadHash].join("\n");
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const stringToSign = ["AWS4-HMAC-SHA256", amzDate, credentialScope, await sha256Hex(canonicalRequest)].join("\n");

    const kDate = await hmac("AWS4" + secretAccessKey, dateStamp);
    const kRegion = await hmac(kDate, region);
    const kService = await hmac(kRegion, service);
    const kSigning = await hmac(kService, "aws4_request");
    const signature = bufferToHex(await hmac(kSigning, stringToSign));

    const authHeader = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const r2Res = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        host: host,
        "x-amz-date": amzDate,
        "x-amz-content-sha256": payloadHash,
        Authorization: authHeader,
      },
    });

    if (!r2Res.ok) {
      const errText = await r2Res.text();
      return new Response(JSON.stringify({ error: `R2 Delete Failed: ${errText}` }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, key }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
