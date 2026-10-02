import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth";
import { EditorView } from "@/components/editor/editor-view";

export const metadata = { title: "Editor" };
export const dynamic = "force-dynamic";

export default async function EditorPage({
  searchParams,
}: {
  searchParams?: Promise<{ projectId?: string }>;
}) {
  // Session 58 (S58-C — the sixth audit's A-L-2): the session-expiry bounce
  // preserves the ?projectId the user was opening (the Next 16 searchParams
  // Promise prop). The old hardcoded /login?from_url=/Editor dropped the
  // query string — after re-login the user landed on /Editor in Untitled
  // mode instead of their project.
  const sp = await searchParams;
  const user = await getSessionUser();
  if (!user) {
    const target = sp?.projectId
      ? `/Editor?projectId=${encodeURIComponent(sp.projectId)}`
      : "/Editor";
    redirect(`/login?from_url=${encodeURIComponent(target)}`);
  }

  return (
    <Suspense>
      <EditorView user={user} />
    </Suspense>
  );
}
