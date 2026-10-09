import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("topics/:slug", "routes/topic.tsx"),
  route("programs", "routes/programs.tsx"),
  route("programs/:slug", "routes/program.tsx"),
  route("proposal/request", "routes/proposal-request.tsx"),
  route("proposal", "routes/proposal.tsx"),
  route("admin", "routes/admin/index.tsx"),
  route("admin/login", "routes/admin/login.tsx"),
  route("admin/dashboard", "routes/admin/dashboard.tsx"),
  route("admin/crm", "routes/admin/crm.tsx"),
  route("admin/proposals", "routes/admin/proposals.tsx"),
  route("admin/content-studio", "routes/admin/content-studio.tsx"),
  route("admin/gallery", "routes/admin/gallery.tsx"),
  route("admin/projects", "routes/admin/projects.tsx"),
  route("admin/partners", "routes/admin/partners.tsx"),
  route("admin/users", "routes/admin/users.tsx"),
] satisfies RouteConfig;
