import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth";
import { RecentView } from "@/components/recent-view";

export const metadata = { title: "Recent" };
export const dynamic = "force-dynamic";

export default async function RecentPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?from_url=/Recent");

  return (
    <Suspense>
      <RecentView user={user} />
    </Suspense>
  );
}
