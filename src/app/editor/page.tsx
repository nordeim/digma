import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth";
import { EditorView } from "@/components/editor/editor-view";

export const metadata = { title: "Editor" };
export const dynamic = "force-dynamic";

export default async function EditorPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?from_url=/editor");

  return (
    <Suspense>
      <EditorView user={user} />
    </Suspense>
  );
}
