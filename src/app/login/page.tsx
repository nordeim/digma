import { Suspense } from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { getSessionUser } from "@/lib/auth";
import { LoginScreen } from "@/components/login-screen";

export const metadata: Metadata = {
  title: "Sign in",
};

export const dynamic = "force-dynamic";

// The real /login route: authenticated visits bounce straight back to the
// workspace (reference behavior); signed-out visitors get the auth card.
export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/");

  return (
    <Suspense>
      <LoginScreen />
    </Suspense>
  );
}
