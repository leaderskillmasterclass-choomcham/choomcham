import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

async function main() {
  const prompt = process.argv.slice(2).join(" ") || "สวัสดี DeepSeek ทดสอบระบบ";
  // เลือกระหว่าง "deepseek-chat" (เร็ว/ตอบทั่วไป) หรือ "deepseek-reasoner" (R1 คิดวิเคราะห์ลึก)
  const modelName = process.env.DEEPSEEK_MODEL || "deepseek-chat";

  try {
    const stream = await openai.chat.completions.create({
      model: modelName,
      messages: [{ role: "user", content: prompt }],
      stream: true,
    });

    process.stdout.write(`\n[DeepSeek: ${modelName}]\n`);
    for await (const chunk of stream) {
      // ดึงข้อความตอบกลับปกติ
      process.stdout.write(chunk.choices[0]?.delta?.content || "");
    }
    process.stdout.write("\n\n");
  } catch (err) {
    console.error("\nDeepSeek API Error:", err.message);
  }
}

main();
