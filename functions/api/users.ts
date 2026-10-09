import { authorize, emails, json } from "../lib/admin-auth";
// Access is configured server-side. This endpoint never creates users with default passwords.
export async function onRequestGet({
  request,
  env,
}: {
  request: Request;
  env: any;
}) {
  const auth = await authorize(request, env);
  if (auth.response) return auth.response;
  if (auth.role !== "SUPERADMIN")
    return json({ error: "ต้องใช้สิทธิ์ Super Admin" }, 403);
  const allowed = emails(env.ADMIN_EMAILS || env.COURSE_ADMIN_EMAILS),
    supers = emails(env.SUPER_ADMIN_EMAILS),
    operators = emails(env.OPERATOR_EMAILS);
  return json({
    success: true,
    data: allowed.map((email) => ({
      email,
      role: supers.includes(email)
        ? "SUPERADMIN"
        : operators.includes(email)
        ? "OPERATOR"
        : "ADMIN",
    })),
  });
}
const configuredAccess = () =>
  json(
    {
      error:
        "จัดการบัญชีใน Supabase Auth และกำหนดสิทธิ์ผ่าน ADMIN_EMAILS / SUPER_ADMIN_EMAILS ฝั่งเซิร์ฟเวอร์",
    },
    405,
  );
export const onRequestPost = configuredAccess;
export const onRequestPut = configuredAccess;
export const onRequestDelete = configuredAccess;
