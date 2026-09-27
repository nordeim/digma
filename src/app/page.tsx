import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth";
import { DashboardView } from "@/components/dashboard-view";

export const dynamic = "force-dynamic";

// The workspace page resolves the session server-side; unauthenticated
// visitors are sent to the auth card (reads/mutations are session-gated at
// the API layer too).
export default async function HomePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?from_url=/");

  return <DashboardView user={user} />;
}
