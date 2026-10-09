import { courseAuth } from "./course-auth.client";
export async function adminFetch(input: string, options: RequestInit = {}) {
  const session = await courseAuth?.auth.getSession();
  if (!session?.data.session) throw new Error("กรุณาเข้าสู่ระบบ");
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${session.data.session.access_token}`);
  const response = await fetch(input, { ...options, headers });
  if (!response.ok) {
    const body = await response
      .clone()
      .json()
      .catch(() => ({}));
    throw new Error(body.error || "ดำเนินการไม่สำเร็จ กรุณาลองใหม่");
  }
  return response;
}
