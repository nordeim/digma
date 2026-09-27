import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth";
import { TeamsView } from "@/components/teams-view";

export const metadata = { title: "Teams" };
export const dynamic = "force-dynamic";

export default async function TeamsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?from_url=/Teams");

  return <TeamsView user={user} />;
}
