import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("topics/:slug", "routes/topic.tsx"),
  route("admin", "routes/admin/index.tsx"),
  route("admin/login", "routes/admin/login.tsx"),
  route("admin/dashboard", "routes/admin/dashboard.tsx"),
  route("admin/crm", "routes/admin/crm.tsx"),
  route("admin/projects", "routes/admin/projects.tsx"),
  route("admin/partners", "routes/admin/partners.tsx"),
] satisfies RouteConfig;
