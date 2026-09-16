import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
const envPath = path.join(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim();
        process.env[key] = val;
      }
    }
  });
}

const LINE_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const TARGET_USER_ID = process.env.LINE_TARGET_USER_ID;

console.log("==================================================");
console.log("📱 LINE OA FLEX MESSAGE NOTIFICATION TEST");
console.log("==================================================");

if (!LINE_TOKEN || LINE_TOKEN.includes("PASTE_")) {
  console.error("❌ Error: Missing or invalid LINE_CHANNEL_ACCESS_TOKEN in .env.local");
  process.exit(1);
}

// 1. Verify Bot Information
async function getBotInfo() {
  console.log("\n1️⃣  Checking LINE Official Account Info...");
  try {
    const res = await fetch("https://api.line.me/v2/bot/info", {
      headers: { Authorization: `Bearer ${LINE_TOKEN}` }
    });
    const data = await res.json();
    if (res.ok) {
      console.log(`✅ เชื่อมต่อสำเร็จกับ LINE OA: "${data.displayName}" (ID: @${data.basicId})`);
      return data;
    } else {
      console.error("❌ Bot Info Error:", data);
      return null;
    }
  } catch (err) {
    console.error("❌ Bot Info Exception:", err.message);
    return null;
  }
}

// 2. Build High-End Choomcham House Flex Message
function createChoomchamFlexMessage() {
  return {
    type: "flex",
    altText: "🧟 [Lead ใหม่] คุณธนกร เลิศวิริยะ (Apex Tech Innovations) - ZOMBIE",
    contents: {
      type: "bubble",
      size: "giga",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: "#4044A5",
        paddingAll: "20px",
        contents: [
          {
            type: "text",
            text: "🧟 ZOMBIE ORGANIZATION CHECK™",
            color: "#FDE047",
            weight: "bold",
            size: "xxs"
          },
          {
            type: "text",
            text: "มีผู้ส่งผลประเมินองค์กรใหม่",
            color: "#FFFFFF",
            weight: "bold",
            size: "lg",
            margin: "xs"
          }
        ]
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            contents: [
              { type: "text", text: "บริษัท:", color: "#64748B", size: "sm", flex: 2 },
              { type: "text", text: "Apex Tech Innovations", color: "#0F172A", weight: "bold", size: "sm", flex: 4 }
            ]
          },
          {
            type: "box",
            layout: "horizontal",
            contents: [
              { type: "text", text: "ผู้ติดต่อ:", color: "#64748B", size: "sm", flex: 2 },
              { type: "text", text: "คุณธนกร (Chief People Officer)", color: "#0F172A", size: "sm", flex: 4 }
            ]
          },
          {
            type: "box",
            layout: "horizontal",
            contents: [
              { type: "text", text: "ช่องทางติดต่อ:", color: "#64748B", size: "sm", flex: 2 },
              { type: "text", text: "LINE: @apex_hr", color: "#E3346B", weight: "bold", size: "sm", flex: 4 }
            ]
          },
          {
            type: "box",
            layout: "horizontal",
            contents: [
              { type: "text", text: "ผลประเมิน:", color: "#64748B", size: "sm", flex: 2 },
              { type: "text", text: "ZOMBIE (14/40 คะแนน)", color: "#E11D48", weight: "bold", size: "sm", flex: 4 }
            ]
          },
          {
            type: "box",
            layout: "vertical",
            backgroundColor: "#F8FAFC",
            paddingAll: "12px",
            cornerRadius: "10px",
            margin: "md",
            contents: [
              { type: "text", text: "🎯 จุดที่รั่วไหลรุนแรง:", color: "#334155", weight: "bold", size: "xs" },
              { type: "text", text: "Voice & Feedback (36%), Connection & Trust (42%) เกิดภาวะ Silo หนัก", color: "#64748B", size: "xxs", wrap: true, margin: "xs" }
            ]
          }
        ]
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "button",
            style: "primary",
            color: "#4044A5",
            action: {
              type: "uri",
              label: "เปิดดูบน Choomcham CRM",
              uri: "https://choomcham.pages.dev/admin/crm"
            }
          }
        ]
      }
    }
  };
}

// 3. Send Flex Message (Push or Broadcast)
async function sendFlexNotification() {
  const flexMessage = createChoomchamFlexMessage();

  if (TARGET_USER_ID && !TARGET_USER_ID.includes("PASTE_")) {
    console.log(`\n2️⃣  Sending Push Flex Message to User ID: ${TARGET_USER_ID}...`);
    try {
      const res = await fetch("https://api.line.me/v2/bot/message/push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LINE_TOKEN}`
        },
        body: JSON.stringify({
          to: TARGET_USER_ID,
          messages: [flexMessage]
        })
      });
      const data = await res.json();
      if (res.ok) {
        console.log("✅ ส่ง Flex Message แบบ Push สำเร็จเรียบร้อย!");
      } else {
        console.error("❌ LINE Push Error:", data);
      }
    } catch (err) {
      console.error("❌ Exception:", err.message);
    }
  } else {
    console.log("\n2️⃣  Target User ID is empty -> Sending via Broadcast API (ส่งเข้าผู้ติดตามทุกคน)...");
    try {
      const res = await fetch("https://api.line.me/v2/bot/message/broadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LINE_TOKEN}`
        },
        body: JSON.stringify({
          messages: [flexMessage]
        })
      });
      const data = await res.json();
      if (res.ok) {
        console.log("✅ ส่ง Flex Message ผ่าน Broadcast API สำเร็จเรียบร้อย! (ตรวจสอบในแชท LINE OA ได้ทันที)");
      } else {
        console.error("❌ LINE Broadcast Error:", data);
      }
    } catch (err) {
      console.error("❌ Exception:", err.message);
    }
  }
}

async function run() {
  const bot = await getBotInfo();
  if (bot) {
    await sendFlexNotification();
  }
}

run();
