import { Suspense } from "react";
import type { Metadata } from "next";

import { ResetPasswordScreen } from "@/components/reset-password-screen";

export const metadata: Metadata = {
  title: "Reset password",
};

export const dynamic = "force-dynamic";

// Session 46, RA-65: the reference's /reset-password landing page. PUBLIC
// and session-agnostic — the reference renders it while logged in (no
// redirect; unlike /login, which bounces authenticated visits to the
// workspace). The two card states key on the ?token= query param (RA-66)
// inside the client component, which needs useSearchParams — hence the
// Suspense boundary (the stream renders the fallback until the client
// mounts, matching the /login route's structure).
export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordScreen />
    </Suspense>
  );
}
