"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CircleAlert, CheckCircle2, Lock } from "lucide-react";

import { normalizeResetToken } from "@/lib/validation";

// Session 46, RA-65/RA-66: the reference's /reset-password landing page.
// A DISTINCT, simpler card family from the login card (measured live):
// the page wrapper is a FLAT bg-gray-50 (not the login's slate gradient)
// and the card is rounded-lg + shadow-lg + plain bg-white (not the login's
// rounded-2xl + shadow-2xl + bg-white/95 backdrop-blur), with the padding
// p-6 pt-12 pb-10 px-12.
//
// Two states key on the ?token= query param: only a NON-EMPTY token opens
// the "Set new password" form — a missing, empty, or differently-named
// param renders the "Invalid Reset Link" card (RA-66, measured on ?code=…
// and ?token=). The token's server-side validity is checked at SUBMIT
// (400 "Invalid or expired reset token" — the token BEFORE the password).
// The valid-token success path is unmeasurable on the reference (its token
// is email-only) — the "done" card below is the documented coherent
// superset (the ADR-014 family).
//
// The measured details ported verbatim: the red circle-alert icon
// (h-10 w-10) on the invalid state; the capitalization asymmetry ("Back
// to Login" on the invalid state vs "Back to login" on the form state);
// NO eye toggle and NO minLength on either input (the RA-63 family — a
// client-side minLength would mask the API's inline alert with the
// browser's native bubble); the "Must be at least 8 characters" helper
// (a hint, not a constraint); and the bare w-full text-gray-600
// link-button under the primary.

export function ResetPasswordScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // RA-66: the state derives from the param — re-derived on every render
  // so a param change (or the post-submit done flip) can never desync.
  const token = React.useMemo(
    () => normalizeResetToken(searchParams.get("token")),
    [searchParams],
  );
  const [resetDone, setResetDone] = React.useState(false);
  const phase = resetDone ? "done" : token ? "form" : "invalid";

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return;
    setError("");

    // The reference's client-side mismatch guard: the INLINE alert, no
    // submit (the same guard family as its register card).
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      // The reference's exact field names (measured via its FastAPI 422
      // on a wrong shape): reset_token + new_password.
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reset_token: token, new_password: password }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok || !body?.ok) {
        // The reference's inline destructive alert family — the invalid
        // token (or the weak password) renders INSIDE the form.
        setError(body?.error?.message ?? "Invalid or expired reset token");
        return;
      }
      setResetDone(true);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const primaryButton =
    "flex h-11 w-full items-center justify-center rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:pointer-events-none disabled:opacity-50";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-lg border-0 bg-white text-card-foreground shadow-lg">
        {phase === "invalid" && (
          <div className="space-y-6 p-6 px-12 pb-10 pt-12 text-center">
            <CircleAlert className="mx-auto h-10 w-10 text-red-600" aria-hidden />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Invalid Reset Link</h2>
              <p className="text-gray-600">This password reset link is invalid or has expired.</p>
            </div>
            {/* Capital L on this state (measured; the form state's reads
                "Back to login" — the reference's own asymmetry). */}
            <button type="button" onClick={() => router.push("/login")} className={primaryButton}>
              Back to Login
            </button>
          </div>
        )}

        {phase === "form" && (
          <div className="space-y-8 p-6 px-12 pb-10 pt-12">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold text-gray-900">Set new password</h2>
              <p className="text-gray-600">Enter your new password for Digma</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden />
                  {/* NO minLength (RA-63 family): the weak password submits
                   * and the API's 400 renders as the inline alert below. */}
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 w-full rounded-md border border-gray-200 bg-gray-50/50 pl-10 text-base placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
                <p className="text-xs text-gray-500">Must be at least 8 characters</p>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden />
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 w-full rounded-md border border-gray-200 bg-gray-50/50 pl-10 text-base placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
              </div>

              {error && (
                <div role="alert" className="w-full rounded-lg border border-red-200 bg-red-50/50 p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-3">
                <button type="submit" disabled={submitting} className={primaryButton}>
                  {submitting ? "Please wait…" : "Reset password"}
                </button>
                {/* The bare link-button (measured: w-full text-sm
                    text-gray-600 hover:text-gray-700, 20px tall). */}
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="w-full text-sm text-gray-600 transition-colors hover:text-gray-700"
                >
                  Back to login
                </button>
              </div>
            </form>
          </div>
        )}

        {phase === "done" && (
          // The coherent superset (the reference's own success path is
          // unmeasurable — email-only tokens): the sent-card family — the
          // green icon + heading, the green status alert, and the
          // full-width back button to the sign-in card.
          <div className="space-y-6 p-6 px-12 pb-10 pt-12 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-green-600" aria-hidden />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Password reset</h2>
              <p className="text-gray-600">Your password has been reset successfully.</p>
            </div>
            <div role="status" className="w-full rounded-lg border border-green-200 bg-green-50/70 p-4">
              <p className="text-sm text-green-700">You can now sign in with your new password.</p>
            </div>
            <button type="button" onClick={() => router.push("/login")} className={primaryButton}>
              Back to login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
