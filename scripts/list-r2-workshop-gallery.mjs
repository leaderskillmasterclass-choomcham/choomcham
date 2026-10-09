import crypto from 'node:crypto';

const ACCOUNT_ID = "1af3cf042ce92dccf6c10ecb81c0181b";
const ACCESS_KEY_ID = "b8a19572c58da6fc4ce68cc3f299bdc6";
const SECRET_ACCESS_KEY = "e2499c1ccc5a5bd55a7ac1a5223e035cc0b127774605638d507b373af70ad1e6";
const BUCKET_NAME = "media";
const PUBLIC_DOMAIN = "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev";
const PREFIX = "Workshop_Gallery/";

function hmac(key, str) {
  return crypto.createHmac('sha256', key).update(str).digest();
}

function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

async function listR2() {
  const host = `${ACCOUNT_ID}.r2.cloudflarestorage.com`;
  const canonicalUri = `/${BUCKET_NAME}`;
  const canonicalQuery = `list-type=2&prefix=${encodeURIComponent(PREFIX)}`;
  const endpoint = `https://${host}${canonicalUri}?${canonicalQuery}`;

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.substring(0, 8);
  const region = "auto";
  const service = "s3";

  const payloadHash = sha256("");
  const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = "host;x-amz-content-sha256;x-amz-date";

  const canonicalRequest = ["GET", canonicalUri, canonicalQuery, canonicalHeaders, signedHeaders, payloadHash].join("\n");
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, credentialScope, sha256(canonicalRequest)].join("\n");

  const kDate = hmac("AWS4" + SECRET_ACCESS_KEY, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  const kSigning = hmac(kService, "aws4_request");
  const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');

  const authHeader = `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const res = await fetch(endpoint, {
    headers: {
      host: host,
      "x-amz-date": amzDate,
      "x-amz-content-sha256": payloadHash,
      Authorization: authHeader,
    },
  });

  const xml = await res.text();
  console.log("R2 Response status:", res.status);
  
  const items = [];
  const contentsRegex = /<Contents>([\s\S]*?)<\/Contents>/g;
  let match;
  while ((match = contentsRegex.exec(xml)) !== null) {
    const block = match[1];
    const keyMatch = /<Key>(.*?)<\/Key>/.exec(block);
    const sizeMatch = /<Size>(.*?)<\/Size>/.exec(block);
    if (keyMatch && keyMatch[1]) {
      const key = keyMatch[1];
      if (!key.endsWith("/") && !key.includes(".DS_Store")) {
        const parts = key.split("/");
        const filename = parts.pop() || key;
        const subfolder = parts.length > 1 ? parts.slice(1).join("/") : "General";
        items.push({
          key,
          size: sizeMatch ? parseInt(sizeMatch[1], 10) : 0,
          url: `${PUBLIC_DOMAIN}/${key}`,
          filename,
          subfolder
        });
      }
    }
  }

  console.log("Found Workshop_Gallery items count:", items.length);
  console.log("Found Workshop_Gallery items:", JSON.stringify(items, null, 2));
}

listR2().catch(console.error);
