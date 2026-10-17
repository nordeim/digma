# Session 280 — Session 148 Execution Log (the Ninety-Sixth Cycle — the Content-Type CSRF Gate Pass)

## The cycle at a glance

- **The audit**: the 96th Mode C audit — combined census **0C / 0H / 0M / 1L / 7I** (auditor A 0C/0H/0M/0L/5I over the 22-file client layer; auditor B 0C/0H/0M/1L/2I over server/infra/e2e; every finding lead-verified live at its seams)
- **The delivery**: S148-A the Content-Type CSRF gate (B148-L1 — the audit's Low, the first security-source fix since S136-A) · S148-B the marquee preview's two-term threshold (A148-I1 — the F88 form-alignment) · S148-C the deleteTeam errorTitle completion (A148-I2 — the S71-A family's missed member) · S148-D the five-posture registration batch (the `s148-residuals-note`) · S148-E the per-session pin family — **three source files edited** (validation.ts 309→336, canvas.tsx 1067→1075, teams-view.tsx 519→528; the layer total 13,878 → 13,895)
- **The gates**: unit **2085/2085 across 210 files** (the forecast held exactly — 2073 + 12 / 209 + 1; five honest prior-spec repairs: the s75/s76 behavioral Requests gained the CT header, the s58 in-flight-guard window widened 600→900) · lint 0 · typecheck 0 · build 27 routes · smoke **73/73** · e2e **262/262 zero flakes at BOTH runs** (6.7m baseline + 6.7m final) · mobile nav **9/9 the 125th session** · SEO **4/4** · pin families S128..S148 **289/289** · dimensions **814/814** (the s158 mapping) · DB pristine **1/2/6/1/3**
- **The parity**: the **124th reference audit NO DRIFT** — the clip pin byte-identical the **85th consecutive session**; evidence in `docs/screenshots/ref-audit-s158/`
- **The capture**: 86 shots re-taken — 64 fresh (the delivery), 22 byte-identical, **zero outside-window residue** (the window derived from the script's own shot calls)
- **The doctrine**: **F135** (the parse-gate-vs-transport-gate member + the over-coverage member)
- **The versions**: PAD v1.127.0 · digma_SKILL v1.126.0

## S148-A — the Content-Type CSRF gate (B148-L1 — the audit's Low, the FIX form)

`readBoundedJson` (src/lib/validation.ts) read and JSON-parsed the request body with **no Content-Type gate** — an HTML `<form method="POST" enctype="text/plain">` (the classic name/value trick) posts a body that parses as valid JSON, so the parse alone never barred the cross-site form POST. The public auth family **mints cookies on POST** (login:161, verify-otp:129) — the class is a **login-CSRF**: the attacker's session planted in the victim's jar (sameSite "lax" gates cookie SENDING on cross-site POSTs, never cookie SETTING — the exact asymmetry S136-A itself documented for the clear direction). The S136-A "JSON-body gate" claim and the PAD §6 CSRF row ("JSON-only APIs — no form-encoded mutations") **over-covered** the seam for eleven sessions (urlencoded forms fail the parse; text/plain forms do not — the B125-I2 over-coverage class at the parse seam). Blast radius: identity confusion + forced re-login; data-exposure delta nil (tenant-global data — the B136-L1 class).

**The closure**: a Content-Type not carrying `application/json` (case-insensitive; the `; charset=` suffix tolerated) is **unparseable-by-policy** — the null-on-unparseable contract, the body stream cancelled (the tooLarge fast-path's discipline), **zero call-site changes** (the 27 consumers keep their null-path 400/401 behavior — the login route's null path flows to the 401 envelope, no cookie minted on a gated body). **The consumer census lead-verified live across every family**: the client `call()` seam's body-conditional CT merge; the ten direct component fetch sites; the smoke suite's 50 body-carrying curls all carrying `-H "Content-Type: application/json"`; Playwright's `request.post` object-data default; the in-page e2e fetch headers (session58/60/61/65/78/85, export-png, mobile-properties — the shared `headers` const).

**The doctrine (F135 — the parse-gate-vs-transport-gate member)**: a JSON-parse seam blocks unparseable bodies, never form-originated transports — the enctype=text/plain form POST is JSON-parseable by construction, so a CSRF body-gate must check the Content-Type, never rely on parseability. **The over-coverage member**: a security claim's coverage must be re-derived at every seam it names, never inherited from the family's prior closures.

## S148-B — the marquee preview's two-term threshold (A148-I1 — the F88 form-alignment)

The marquee PREVIEW gate (canvas.tsx) gated on `drag.w > 2` alone while the COMMIT requires `drag.w > 2 && drag.h > 2` — a wide-but-thin drag (h ≤ 2) painted a live selection rectangle that never committed, an affordance that lied about its outcome. The preview now rides the commit's own two-term form (the cosmetic form-alignment; the commit semantics untouched; the registration comment at the seam).

## S148-C — the deleteTeam errorTitle completion (A148-I2 — the S71-A family's missed member)

teams-view's delete call omitted `errorTitle` while BOTH sibling delete surfaces (project-card:423, recent-view:138) pass `{ errorTitle: "Delete failed" }` — a failed team delete toasted the generic "Something went wrong". The option added; the three delete surfaces carry the same failure-toast copy.

## S148-D — the registration batch (the five Informational postures, one bracketed note)

The `s148-residuals-note` registers: **B148-I1** the LIKE wildcard semantics (projects GET search — `%`/`_` pass through; API-consumer-only, session-gated, parameterized); **B148-I2** the UTF-16 slice sibling census (duplicate:79, register:105, clampText, team.ts:20 — the S147 team.ts:11 carry's sibling enumeration); **A148-I3** the ImagePanel busy swallow (the safe direction — never a clobbered upload); **A148-I4** the logo dual-graph form (the only component-layer file without "use client" — deliberately usable from a server component); **A148-I5** the dashboard refresh hygiene (the unguarded refresh callback — a silent no-op under React 19).

## S148-E — the per-session pin family + the collateral

`tests/lows-s148.test.ts` — **12 pins: 8 RED / 4 survival**, the **BEHAVIORAL gate pins** at the readBoundedJson seam being the family's first (constructed Request objects — a text/plain and an urlencoded Request both answer null; an application/json Request still parses in the bare, charset-suffixed, and case-insensitive forms), beside the consumer-census survival pin (the call() CT merge + the smoke -d/CT parity derived at runtime), the two source-fix pins, the residuals-note pin, the audit-entry pins, the script-provenance pin (zero s147 residue), the docs re-anchor pin, and the pair-unity forms. The collateral: the count-family re-anchor **2085 = 2073 + 12 unit / 210 files** across every live claim site + the **55 spec constants** (28 UNIT + 27 FILES); the §11 re-anchors (canvas 1067→1075, teams-view 519→528, validation 309→336) with their S148 seam descriptions; the layer total 13,878 → 13,895.

## The honest prior-spec repairs (the S145-established convention)

Five breaks surfaced by the full unit gate after the GREEN phase, all repaired with narrations at their seams: `tests/request-surface-s75.test.ts` (three behavioral Requests gained the `content-type: application/json` header — a CT-less Request now answers null by design); `tests/server-lows-s76.test.ts` (the fast-path stream-cancel Request gained the header — the gate runs BEFORE the content-length fast path); `tests/low-batch-s58.test.ts` (the in-flight-guard window widened 600→900 — the S148-C registration comment pushed `setDeleting(false)` past the old window; the pin's intent unchanged).

## The deferral queue (F80, no silent drops)

The **id-stable PUT** stays the deferred queue's head — premises re-derived LIVE this cycle by auditor B, **all four holding**: (1) the four churn-consuming registrations all value-based or honest-refusal; (2) the index-stable remap at the markSaved boundary with the gesture-deferral gate intact; (3) the replace transaction's registered seams intact; (4) the value-based perimeter holding with zero uncensused members. The structural rewrite's regression risk continues to outweigh its churn-optimality benefit at this stability level — the judgment carried unchanged from the S128–S147 cycles. The S148-D posture batch joins the standing alternatives (the ~34px utility-chip touch floor, the B115-I2 SDK-socket ceiling, the aria-hidden convergence with the honest effective-nine count, the UTF-16 slice family) for the next dispatch.
