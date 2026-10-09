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
  return json({
    success: true,
    data: { email: auth.user!.email, name: auth.user!.email, role: auth.role },
  });
}
