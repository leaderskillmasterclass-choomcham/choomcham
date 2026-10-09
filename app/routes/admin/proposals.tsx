import { Navigate, useSearchParams } from "react-router";
export default function AdminProposals() {
  const [params] = useSearchParams();
  const lead = params.get("leadId");
  return (
    <Navigate
      to={
        lead
          ? `/admin/courses?leadId=${encodeURIComponent(lead)}`
          : "/admin/courses"
      }
      replace
    />
  );
}
