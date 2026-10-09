import { Link, useSearchParams } from "react-router";
import { getProgram } from "~/lib/programs";
import { ProgramLayout } from "~/components/layout/ProgramLayout";
import { ProgramOutline } from "~/components/features/programs/ProgramOutline";
export function meta() {
  return [
    { title: "กรอบหลักสูตร | Choomcham House" },
    { name: "robots", content: "noindex, nofollow" },
  ];
}
export default function ProposalView() {
  const [params] = useSearchParams();
  const program = getProgram(
    params.get("programSlug") || "from-zombie-to-living-organization",
  );
  return (
    <ProgramLayout>
      {program ? (
        <ProgramOutline program={program} />
      ) : (
        <div className="program-container program-section">
          <h1>ไม่พบกรอบหลักสูตรนี้</h1>
          <Link to="/programs">เลือกหลักสูตร</Link>
        </div>
      )}
    </ProgramLayout>
  );
}
