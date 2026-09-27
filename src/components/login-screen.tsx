"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Lock, Mail } from "lucide-react";

import { LogoMark } from "@/components/logo";
import { toast } from "@/hooks/use-toast";

type AuthMode = "signin" | "signup" | "forgot";

/**
 * LoginCard — the /login auth card, measured from the reference app: a white
 * card on a slate gradient, circular logo chip with the ring + glow, the
 * three social buttons, an "or" divider, and the email/password form. The
 * social buttons render for visual parity but degrade to an explanatory
 * toast — a self-hosted clone carries no OAuth credentials (documented
 * deviation, same doctrine as the AI fallbacks).
 */
export function LoginScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const fromUrl = params.get("from_url") || "/";

  const [mode, setMode] = React.useState<AuthMode>("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [confirmError, setConfirmError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return;

    if (mode === "forgot") {
      toast.show({
        title: "Reset link sent",
        description:
          email.trim()
            ? `If an account exists for ${email.trim()}, a password reset link is on its way.`
            : "Enter your email above and we'll send reset instructions.",
      });
      return;
    }

    // Sign-up carries the reference's inline Confirm Password guard: a
    // mismatch renders the red inline error and blocks submission (the
    // live app shows "Passwords do not match" in a text-red-700 alert).
    if (mode === "signup" && password !== confirmPassword) {
      setConfirmError("Passwords do not match");
      return;
    }
    setConfirmError("");

    setSubmitting(true);
    try {
      const endpoint = mode === "signin" ? "/api/auth/login" : "/api/auth/register";
      // The reference's sign-up form has NO name field — the register API
      // derives the display name from the email local-part.
      const payload = mode === "signin" ? { email, password } : { email, password, name: email.split("@")[0] };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => null);

      if (!response.ok || !body?.ok) {
        toast.error(
          "Sign in failed",
          body?.error?.message ?? "Something went wrong. Please try again.",
        );
        return;
      }

      // Auth navigation uses router.refresh()-friendly navigation (never
      // window.location) so the server components re-resolve the session.
      router.push(fromUrl);
      router.refresh();
    } catch {
      toast.error("Network error", "Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function socialToast(provider: string) {
    toast.show({
      title: `${provider} sign-in unavailable`,
      description:
        "This self-hosted clone carries no OAuth credentials — use the email form below (or seed the demo account).",
    });
  }

  const minimal = mode !== "signin";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-2xl border-0 bg-white/95 text-card-foreground shadow-2xl backdrop-blur-sm">
          <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200" />
          <div className="p-8 sm:p-10 md:px-10 md:pb-10 md:pt-12">
            <div className="flex flex-col items-center space-y-6 text-center sm:space-y-8">
              {/* Sign-up and forgot switch to the reference's minimal card:
                  a "Back to sign in" link, an h2, and the bare form — no
                  logo chip, no social buttons, no "or" divider. Only the
                  sign-in state carries the full branded card. */}
              {minimal && (
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setConfirmError("");
                  }}
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors -mb-2"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  Back to sign in
                </button>
              )}

              {!minimal && (
                <div className="group relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 opacity-30 blur-xl transition-opacity duration-300 group-hover:opacity-40" />
                  <span className="relative flex h-20 w-20 shrink-0 overflow-hidden rounded-full shadow-lg ring-4 ring-white/50 transition-all duration-300 group-hover:shadow-xl sm:h-24 sm:w-24">
                    <span className="flex aspect-square h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                      <LogoMark className="h-10 w-10 sm:h-12 sm:w-12" />
                    </span>
                  </span>
                </div>
              )}

              <div className="space-y-2 sm:space-y-3">
                {minimal ? (
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    {mode === "signup" ? "Create your account" : "Reset your password"}
                  </h2>
                ) : (
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Welcome to Digma
                  </h1>
                )}
                {!minimal && (
                  <p className="text-sm font-medium text-slate-500 sm:text-base">Sign in to continue</p>
                )}
                {mode === "forgot" && (
                  <p className="text-sm text-slate-600 sm:text-base">
                    Enter your email and we&apos;ll send you a link to reset your password
                  </p>
                )}
              </div>

              <div className="w-full">
                {mode === "signin" && (
                  <>
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => socialToast("Google")}
                        className="group flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-[16px] font-medium text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
                      >
                        <GoogleIcon />
                        <span>Continue with Google</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => socialToast("Microsoft")}
                        className="group flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-[16px] font-medium text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
                      >
                        <MicrosoftIcon />
                        <span>Continue with Microsoft</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => socialToast("Facebook")}
                        className="group flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-[16px] font-medium text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
                      >
                        <FacebookIcon />
                        <span>Continue with Facebook</span>
                      </button>
                    </div>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="h-px w-full bg-slate-200" role="none" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-3 font-medium tracking-wider text-slate-500">or</span>
                      </div>
                    </div>
                  </>
                )}

                <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-sm font-medium text-slate-700">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
                        <input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 text-base placeholder:text-slate-600 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 sm:h-12"
                        />
                      </div>
                    </div>

                    {mode !== "forgot" && (
                      <div className="space-y-1.5">
                        <label htmlFor="password" className="text-sm font-medium text-slate-700">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
                          <input
                            id="password"
                            type="password"
                            required
                            minLength={8}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={mode === "signup" ? "Min. 8 characters" : "••••••••"}
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 text-base placeholder:text-slate-600 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 sm:h-12"
                          />
                        </div>
                      </div>
                    )}

                    {mode === "signup" && (
                      <div className="space-y-1.5">
                        <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
                          <input
                            id="confirmPassword"
                            type="password"
                            required
                            minLength={8}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter password"
                            aria-invalid={confirmError ? true : undefined}
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 text-base placeholder:text-slate-600 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 sm:h-12"
                          />
                        </div>
                        {confirmError && (
                          <div
                            role="alert"
                            className="flex items-center gap-2 text-sm text-red-700"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4 shrink-0"
                              aria-hidden
                            >
                              <circle cx="12" cy="12" r="10" />
                              <line x1="12" x2="12" y1="8" y2="12" />
                              <line x1="12" x2="12.01" y1="16" y2="16" />
                            </svg>
                            <p>{confirmError}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex h-11 w-full items-center justify-center gap-1 rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 sm:h-12"
                    >
                      {submitting
                        ? "Please wait…"
                        : mode === "signin"
                          ? "Sign in"
                          : mode === "signup"
                            ? "Create account"
                            : "Send reset link"}
                    </button>

                    {mode === "signin" && (
                      <div className="flex flex-col items-center justify-between gap-2 sm:flex-row sm:gap-0">
                        <button
                          type="button"
                          onClick={() => setMode("forgot")}
                          className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
                        >
                          Forgot password?
                        </button>
                        <button
                          type="button"
                          onClick={() => setMode("signup")}
                          className="text-sm text-slate-500 transition-colors hover:text-slate-700"
                        >
                          Need an account?{" "}
                          <span className="font-medium text-slate-700">Sign up</span>
                        </button>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 hidden text-center text-xs text-slate-400 sm:block">
          New here? The seed ships a demo account —{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5">demo@digma.app / Digma1234!</code>
        </p>
        <p className="mt-8 text-center text-xs text-slate-400 sm:hidden" aria-hidden>
          &nbsp;
        </p>

        <div className="mt-4 text-center">
          <Link href="/login" className="text-xs text-slate-400 hover:text-slate-600">
            Digma — design workspace
          </Link>
        </div>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path fill="#F25022" d="M1 1h10v10H1z" />
      <path fill="#00A4EF" d="M13 1h10v10H13z" />
      <path fill="#7FBA00" d="M1 13h10v10H1z" />
      <path fill="#FFB900" d="M13 13h10v10H13z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
