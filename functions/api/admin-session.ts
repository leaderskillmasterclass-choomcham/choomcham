import { authorize, json } from "../lib/admin-auth";
export async function onRequestGet({
  request,
  env,
}: {
  request: Request;
  env: any;
}) {
  const auth = await authorize(request, env);
  if (auth.response) return auth.response;
  const userMeta = auth.user!.user_metadata || {};
  const displayName =
    userMeta.display_name || userMeta.name || userMeta.full_name || auth.user!.email;
  return json({
    success: true,
    data: { email: auth.user!.email, name: displayName, role: auth.role },
  });
}
