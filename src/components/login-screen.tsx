"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Lock, Mail, MailCheck, ShieldCheck } from "lucide-react";

import { LogoMark } from "@/components/logo";
import { toast } from "@/hooks/use-toast";

// Session 43, RA-58/RA-59: the reference's auth card carries FIVE states —
// sign-in / sign-up / forgot (the three measured in prior sessions) plus
// the signup's "Verify your email" follow-through and the forgot submit's
// "Check your email" success card. The two new states port the reference's
// minimal-card chrome (icon circle + h2 + centered copy) with the
// SELF-HOSTED delivery deviation: no email service exists, so the 6-digit
// verification code travels in the API response and renders in the card's
// info alert (documented in the PAD's deviation ledger).
type AuthMode = "signin" | "signup" | "forgot" | "verify" | "sent";

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
  // Session 43, RA-60: the sign-in failure renders the reference's INLINE
  // alert inside the form (its exact text and red family) — no toast.
  const [authError, setAuthError] = React.useState("");
  // Session 43, RA-58: the verify-email card's state — the six digit inputs
  // and the in-app-delivered code (the self-hosted deviation).
  const [digits, setDigits] = React.useState<string[]>(["", "", "", "", "", ""]);
  const [verifyCodeHint, setVerifyCodeHint] = React.useState("");
  const [verifyError, setVerifyError] = React.useState("");

  function enterVerify(code: string) {
    setVerifyCodeHint(code);
    setVerifyError("");
    setDigits(["", "", "", "", "", ""]);
    setMode("verify");
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return;
    setAuthError("");

    if (mode === "forgot") {
      // Session 43, RA-59: the reference's forgot submit transitions the
      // card to its "Check your email" success state (POST
      // /auth/reset-password-request 200). The clone carries no mail service
      // — the card is the UI-state port and the no-email deviation is
      // documented (the demo account's reset lives in db:seed).
      setMode("sent");
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
        if (response.status === 403 && body?.error?.code === "VERIFY_EMAIL" && body?.verificationCode) {
          // Session 43: the unverified account's WORKING recovery path — the
          // login regenerated the code and the card re-opens (the reference
          // answers the same state with the generic dead-end error).
          enterVerify(String(body.verificationCode));
          return;
        }
        // Session 43, RA-60: the sign-in failure renders the reference's
        // inline alert (its exact text from the route) — no toast.
        setAuthError(body?.error?.message ?? "Invalid email or password");
        return;
      }

      if (mode === "signup") {
        // Session 43, RA-58: the register opens NO session — the card
        // transitions to the verify-email state carrying the delivered code
        // (the self-hosted in-app delivery; the reference emails it).
        enterVerify(String(body?.data?.verificationCode ?? ""));
        return;
      }

      // Auth navigation uses router.refresh()-friendly navigation (never
      // window.location) so the server components re-resolve the session.
      router.push(fromUrl);
      router.refresh();
    } catch {
      setAuthError("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Session 43, RA-58: the verify-email submit — POST /api/auth/verify-otp
  // with the six concatenated digits. A verified code opens the session
  // (the route sets the cookie) and navigates; a wrong code renders the
  // reference's decrementing "N attempts remaining" inline error.
  async function onVerifySubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return;
    const code = digits.join("");
    if (!/^\d{6}$/.test(code)) {
      setVerifyError("Enter the 6-digit code from your email");
      return;
    }
    setSubmitting(true);
    setVerifyError("");
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok || !body?.ok) {
        setVerifyError(body?.error?.message ?? "Invalid verification code.");
        return;
      }
      setVerifyCodeHint("");
      router.push(fromUrl);
      router.refresh();
    } catch {
      setVerifyError("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Session 43, RA-58: the reference's Resend — POST /api/auth/resend-otp,
  // NO cooldown (live-measured timerless), regenerating the code and
  // resetting the attempts counter.
  async function onResend() {
    if (submitting) return;
    setSubmitting(true);
    setVerifyError("");
    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok || !body?.ok) {
        setVerifyError(body?.error?.message ?? "Could not resend the code.");
        return;
      }
      setVerifyCodeHint(String(body?.data?.verificationCode ?? ""));
      setDigits(["", "", "", "", "", ""]);
    } catch {
      setVerifyError("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Session 43, RA-58: the six digit inputs auto-advance on entry (the
  // reference's live-measured behavior — typing into input[0] focuses
  // input[1]) and retreat on Backspace over an empty cell.
  function onDigitChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => prev.map((d, i) => (i === index ? digit : d)));
    if (digit && index < 5) {
      document.getElementById(`otp-digit-${index + 1}`)?.focus();
    }
  }

  function onDigitKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      event.preventDefault();
      document.getElementById(`otp-digit-${index - 1}`)?.focus();
    }
  }

  function onDigitPaste(event: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    event.preventDefault();
    setDigits((prev) => {
      const next = [...prev];
      for (let i = 0; i < 6; i += 1) next[i] = pasted[i] ?? "";
      return next;
    });
    const focusIndex = Math.min(pasted.length, 5);
    document.getElementById(`otp-digit-${focusIndex}`)?.focus();
  }

  function socialToast(provider: string) {
    toast.show({
      title: `${provider} sign-in unavailable`,
      description:
        "This self-hosted clone carries no OAuth credentials — use the email form below (or seed the demo account).",
    });
  }

  const minimal = mode !== "signin" && mode !== "sent";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-2xl border-0 bg-white/95 text-card-foreground shadow-2xl backdrop-blur-sm">
          <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200" />
          <div className="p-8 sm:p-10 md:px-10 md:pb-10 md:pt-12">
            <div className="flex flex-col items-center space-y-6 text-center sm:space-y-8">
              {/* Sign-up, forgot, and verify switch to the reference's minimal
                  card family: a "Back to sign in" link, an h2, and the bare
                  form — no logo chip, no social buttons, no "or" divider.
                  Only the sign-in state carries the full branded card. The
                  sent card carries NO top back-link — its "Back to sign in"
                  is the reference's FULL-WIDTH bottom button (RA-59). */}
              {minimal && (
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setConfirmError("");
                    setAuthError("");
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
                    {/* The reference's chip: the brand mark itself fills the
                     * circle (object-fit: cover on its hosted image) — the
                     * black field is the mark's own, no gradient backing. */}
                    <LogoMark className="h-full w-full" />
                  </span>
                </div>
              )}

              <div className="space-y-2 sm:space-y-3">
                {mode === "verify" ? (
                  /* Session 43, RA-58 — the reference's verify-email header:
                   * the shield-check icon circle + the h2 + the email line. */
                  <>
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 sm:mb-4 sm:h-16 sm:w-16">
                      <ShieldCheck className="h-7 w-7 text-slate-700 sm:h-8 sm:w-8" aria-hidden />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                      Verify your email
                    </h2>
                    <p className="text-sm text-slate-600 sm:text-base">
                      We&apos;ve sent a 6-digit code to
                      <br />
                      <span className="font-medium text-slate-900">{email}</span>
                    </p>
                  </>
                ) : mode === "sent" ? (
                  /* Session 43, RA-59 — the reference's check-your-email
                   * header: the mail icon circle + the h2 + the email line. */
                  <>
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 sm:mb-4 sm:h-16 sm:w-16">
                      <MailCheck className="h-7 w-7 text-slate-700 sm:h-8 sm:w-8" aria-hidden />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                      Check your email
                    </h2>
                    <p className="text-sm text-slate-600 sm:text-base">
                      We&apos;ve sent password reset instructions to
                      <br />
                      <span className="font-medium text-slate-900">{email || "your email"}</span>
                    </p>
                  </>
                ) : minimal ? (
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
                {mode === "verify" ? (
                  /* Session 43, RA-58 — the reference's verify-email card body:
                   * the six auto-advancing digit inputs, the helper line, the
                   * slate-900 submit, and the timerless Resend row. The
                   * self-hosted delivery note (the blue info alert) replaces
                   * the reference's email — no mail service exists here. */
                  <form onSubmit={onVerifySubmit} className="space-y-4 sm:space-y-6">
                    <div>
                      <div className="flex items-center justify-center gap-1.5">
                        {digits.map((digit, index) => (
                          <input
                            key={index}
                            id={`otp-digit-${index}`}
                            type="text"
                            inputMode="numeric"
                            autoComplete={index === 0 ? "one-time-code" : "off"}
                            value={digit}
                            onChange={(e) => onDigitChange(index, e.target.value)}
                            onKeyDown={(e) => onDigitKeyDown(index, e)}
                            onPaste={onDigitPaste}
                            aria-label={`Verification code digit ${index + 1}`}
                            className="h-11 w-10 rounded-lg border border-input bg-background px-3 py-2 text-center text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          />
                        ))}
                      </div>
                      <p className="mt-3 text-center text-xs text-slate-500">
                        Enter the verification code sent to your email
                      </p>
                    </div>

                    {verifyCodeHint && (
                      <div
                        role="status"
                        className="w-full rounded-xl border border-blue-200 bg-blue-50/70 p-4"
                      >
                        <p className="text-sm text-blue-700">
                          Self-hosted mode: no email service is configured — your verification code is{" "}
                          <span className="font-semibold">{verifyCodeHint}</span>
                        </p>
                      </div>
                    )}

                    {verifyError && (
                      <div
                        role="alert"
                        className="w-full rounded-xl border border-red-200 bg-red-50/70 p-4"
                      >
                        <p className="text-sm text-red-700">{verifyError}</p>
                      </div>
                    )}

                    <div className="space-y-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex h-10 w-full items-center justify-center gap-1 rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 sm:h-11"
                      >
                        {submitting ? "Please wait…" : "Verify email"}
                      </button>
                      <div className="text-center">
                        <p className="text-sm text-slate-600">
                          Didn&apos;t receive the code?{" "}
                          <button
                            type="button"
                            onClick={onResend}
                            disabled={submitting}
                            className="font-medium text-slate-700 transition-colors hover:text-slate-900 disabled:opacity-50"
                          >
                            Resend
                          </button>
                        </p>
                      </div>
                    </div>
                  </form>
                ) : mode === "sent" ? (
                  /* Session 43, RA-59 — the reference's check-your-email card
                   * body: the green alert + the FULL-WIDTH "Back to sign in"
                   * button (no top back-link on this state). The clone sends
                   * no email — the documented self-hosted deviation. */
                  <div className="space-y-4 sm:space-y-6">
                    <div
                      role="alert"
                      className="w-full rounded-xl border border-green-200 bg-green-50/70 p-4"
                    >
                      <p className="text-sm text-green-700">
                        Please check your email for the password reset link. It may take a few minutes to arrive.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signin");
                        setAuthError("");
                      }}
                      className="flex w-full items-center justify-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden />
                      Back to sign in
                    </button>
                  </div>
                ) : (
                  <>
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
                          {/* Session 45, RA-63: NO minLength here — the
                           * reference's auth inputs carry none (measured:
                           * minLength -1 on both cards; the "Min. 8
                           * characters" placeholder is a hint, not a
                           * constraint). A client-side minLength would block
                           * submission with the browser's NATIVE validation
                           * bubble and mask the API's 400, which renders as
                           * the reference's inline alert instead. */}
                          <input
                            id="password"
                            type="password"
                            required
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

                  {/* Session 43, RA-60 — the reference's sign-in failure
                      renders an INLINE alert inside the form (measured:
                      role=alert, bg-red-50/70 border-red-200 rounded-xl,
                      text-red-700 text-sm, "Invalid email or password";
                      no toast). Shown for the sign-in and sign-up failure
                      paths (the reference's register conflicts render the
                      same alert family). */}
                  {authError && (
                    <div
                      role="alert"
                      className="w-full rounded-xl border border-red-200 bg-red-50/70 p-4"
                    >
                      <p className="text-sm text-red-700">{authError}</p>
                    </div>
                  )}

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
                          onClick={() => { setMode("forgot"); setAuthError(""); }}
                          className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
                        >
                          Forgot password?
                        </button>
                        <button
                          type="button"
                          onClick={() => { setMode("signup"); setAuthError(""); }}
                          className="text-sm text-slate-500 transition-colors hover:text-slate-700"
                        >
                          Need an account?{" "}
                          <span className="font-medium text-slate-700">Sign up</span>
                        </button>
                      </div>
                    )}
                  </div>
                </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reference parity (measured session 10): NOTHING renders below
            the auth card — no workspace footer, no demo-account hint (the
            demo credentials live in README/AGENTS). */}
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
