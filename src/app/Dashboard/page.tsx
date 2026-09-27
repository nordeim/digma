import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth";
import { DashboardView } from "@/components/dashboard-view";

export const dynamic = "force-dynamic";

// /Dashboard — the capitalized route the reference app's own links use
// (its logo and "Dashboard" nav item both point here). The root "/" serves
// the identical view, exactly like the reference app where both / and
// /Dashboard render the dashboard.
export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?from_url=/Dashboard");

  return <DashboardView user={user} />;
}
