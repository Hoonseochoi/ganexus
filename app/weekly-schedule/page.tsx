import { redirect } from "next/navigation";
import LandingPage from "@/app/components/LandingPage";
import WeeklyScheduleClient from "@/app/components/WeeklyScheduleClient";
import { getCurrentUser } from "@/src/lib/engines/auth";

export default async function WeeklySchedulePage() {
  const user = await getCurrentUser();

  if (!user) {
    return <LandingPage />;
  }

  if (user.role === "manager" && user.profile && !user.profile.is_approved) {
    redirect("/pending-approval");
  }

  return (
    <main className="h-screen bg-background-light">
      <WeeklyScheduleClient branchName={user.profile?.branch_name ?? null} />
    </main>
  );
}
