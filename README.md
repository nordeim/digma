# Digma — Collaborative Design Workspace

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6-2d3748?logo=prisma)
![SQLite](https://img.shields.io/badge/DB-SQLite-003b57?logo=sqlite)

A production-grade, self-hosted clone of the reference Digma design workspace — a Figma-like app where teams create design files, sketch on a canvas with shape/text tools, steer an AI assistant that edits the canvas conversationally, and organize files into teams. Built as one deployable Next.js unit with cookie-session auth, a typed JSON API, and a Prisma/SQLite store.

## Overview

Digma gives every signed-in user a personal design workspace: a gradient-greeting dashboard with live Quick Stats, a Recently-opened file browser with sort/view controls, a Teams page with member invitations, and a full dark-themed canvas **Editor** (tools, layers, properties, zoom, autosave, undo/redo, AI assistant, presentation mode). The reference app shipped with a broken mobile navigation — its desktop nav was `hidden md:flex` with no fallback, leaving phones with no navigation at all (the Tailwind v4 "failure class A" documented in the repo's skills). This clone reproduces the desktop design faithfully and **fixes the mobile menu** with a hamburger + Sheet drawer that is focus-trapped, Escape-closable, scroll-locked, and pinned by an E2E regression suite.

## Key Features

| Feature | Description |
|---------|-------------|
| 🎨 **Canvas design editor** | DOM-element canvas over a 20px grid: draw rectangles/ellipses/lines/text/**labeled container frames**, marquee + click + shift-click selection, drag-move, 8-handle resize, rotate, opacity, fill/stroke/radius — all inline-styled like the reference |
| 🧰 **Tool rail + shortcuts** | Select/Hand/Frame/Rectangle/Ellipse/Line/Pen/Text/Image with `V H F R O L P T I` shortcuts (the map lives in ONE seam — `TOOL_SHORTCUTS` in `src/lib/editor.ts`, consumed by the toolbar titles, the keyboard handler, AND the help dialog), Space-to-pan, Ctrl+wheel zoom, `Delete`, `Ctrl+Z`/`Ctrl+Shift+Z`, `Ctrl+0` reset — plus a **Keyboard-shortcuts help dialog** (a keyboard-icon chip beside the zoom controls, or the `?` key, opens the full grouped map; the reference has no shortcut affordance at all — a pure clone superset) |
| 🗂 **Layers panel** | Reverse-ordered layer list with **precise drag-reorder** (drop-time index computation — a drop on a row's lower/upper half inserts directly below/above it; the reference's own drag is dead), per-layer visibility (eye — the toggle actually hides the element on the canvas), the reference's opacity-based lock (same lucide-lock icon, `opacity-50` ↔ `opacity-100`) — **locked elements are pointer WALLS: a drag over one never displaces the element beneath it, and a click preserves the current selection** (the reference's measured contract; the locked element renders `cursor-not-allowed` and a locked selection shows its outline without resize handles) — and the wall extends to the KEYBOARD: **Delete on a locked selection is a no-op, and Select All + Delete removes only the unlocked members** (the reference's own keyboard is dead — no parity data — so the clone's working keyboard stays coherent with the wall), and the reference's red **trash delete** (immediate, undo-recoverable — the one delete path that DELIBERATELY ignores the lock, exactly as the reference's own trash removed its locked layer), double-click rename with the reference's measured input chrome (`h-6 px-2 py-1` bordered editor input), live "N layers • N selected" counter
| ⚙️ **Properties panel** | The reference's five sections — Position & Size (X/Y/W/H inputs that never commit an empty draft — clearing a field keeps the element where it is, and blur restores the value), Corner Radius (slider with a DYNAMIC max — half the selected element's smaller side, `min(w,h)/2` — + per-corner inputs clamped to the same max), Fill & Stroke (a Radix Solid/Gradient/Image tablist with a white active segment — **all three tabs functional, exactly like the reference**: the Gradient tab edits a persisted angle + color-stop document painting linear/radial gradients live — **the Angle slider renders only for Linear gradients (a circle has no direction), the stop rows carry the reference's red-X remove button above the two-stop minimum**, the Image tab uploads a data-URL fill **and carries the reference's Background Size select (Cover/Contain/Auto/Stretch — painting background-size live, with the upload's cover+center default)**, a Solid hex edit clears all of it — swatch + hex rows, Stroke Width slider 0–20), Transform (rotation slider + number input + ° suffix, **per-element Scale 0.1–3.0x** — persisted, rendered as `translate(x,y) scale(s) rotate(r)`), Opacity (slider + number input + % suffix) — plus Text properties (the default font renders as `Inter, sans-serif` — the reference's measured fallback chain); "Canvas Properties" with a Background Color swatch + hex row when nothing is selected — **the change persists through the autosave** (the reference's own control is dead). All sliders render the reference's Radix-slider look (6px rounded track + 16px white thumb). Panel-toggle chips (bottom-left) independently show/hide the Layers, Components, and Properties panels — and render only where those panels can (hidden below md; the Properties chip waits for lg) |
| 🤖 **AI design assistant** | Chat panel below the canvas — LLM (`z-ai-web-dev-sdk`, server-side) parses instructions into element operations with a deterministic fallback parser ("Add 3 red circles", "Create a login form") — degrade-not-fail, never hard-fails. **The wall's AI contract:** an instruction-level delete never removes locked elements (the reference's own locked element survived its AI delete — measured), and the replies report the skip honestly. The reply bubble carries the reference's measured post-send footer — the "N action(s) performed" count and an orange **Revert** button that actually restores the pre-message canvas (itself undoable with Ctrl+Z). The "Try: …" suggestions line renders under the input ALWAYS (the reference's measured contract — it persists after every send) |
| 🕐 **Autosave + history** | 800ms-debounced full-list `PUT` with id remapping, "Saved / Saving… / Unsaved" badge, undo/redo history (60 snapshots) — one entry per gesture with full interleaving ownership: a typing burst followed by an immediate canvas drag keeps BOTH entries, slider drags / picker drags / typing bursts each coalesce to one, and a read-only field focus arms nothing (the autosave never loops on a held focus) — and a dead session is TERMINAL: one distinct "Session expired" toast, the badge honestly reads "Unsaved", and the machine stops (no infinite retry against a dead cookie) |
| 🖥 **Present mode** | Fullscreen, fit-to-viewport presentation of the canvas (Escape to exit on desktop; a 44px-touch-target "Exit presentation" button — no keyboard needed — on mobile, with body scroll lock and focus move/return, the same dialog contracts as the mobile-nav drawer); Share copies a deep link. On mobile the editor's top bar WRAPS so both Share and Present stay reachable at 390px (icon-only below sm, labels at ≥sm — the reference's own header clips them off-screen at mobile) |
| 📥 **Canvas export — PNG + SVG** | A "Download" chip in the editor's zoom cluster (the Keyboard chip's sibling — deliberately NOT in the header, where it would break the pinned tablet single-row geometry) opens a **format menu** with two items (session 54): **Download PNG** rasterizes the 1000×700 board — the same canvas area Present shows — at 2× into a real PNG download (2000×1400, magic-byte + IHDR e2e-pinned); **Download SVG** ships the serializer's own document as the TRUE vector artifact (the `<?xml`-declared, viewBox-pinned 1000×700 SVG — no rasterization, no webfont fidelity limit: a viewer with Inter installed renders text exactly). Both serialize through the pure, DOM-free SVG seam (`src/lib/export-png.ts`, unit-pinned mapping rules: the transform chain, the one paint chain with gradient/image serialization, the border-box stroke inset, the flex-centered text geometry) and share ONE anchor-trigger helper (`triggerBlobDownload`), named from the project, degrading to a toast on failure. Visible at every viewport — a pure clone superset (the reference has no export anywhere) |
| 🏠 **Dashboard** | Time-aware greeting hero (purple→pink→blue gradient, `<12 / <17 / evening` buckets and a FIRST-WORD greeted name — the reference's bundle-decoded contract; glass Quick Stats card fed by `/api/stats` with ACCESS-based "Active this week" — projects opened in the last 7 days; the hero's chrome renders FLAT at every viewport), Continue Working (4 most recent), All Projects with search + grid/list toggle |
| 🃏 **Project cards** | Live canvas thumbnails (content-bbox fit — a transparent hover overlay in the v4 opacity-modifier form; the fixed 320×200 painted space SCALES to its rendered slot — the min-fit + centering `thumbnailFit` seam, measured live so the list's 40×40 slot shows the whole mini-canvas), opened-date, the reference's gradient avatar pair (the first chip carries the REAL-USER initial + "You" title), ellipsis menu with the reference's INLINE rename row (input + Check/X icon buttons) + a "Delete project?" confirm dialog ("Yes, Delete / Cancel" — the reference's own guard, in chrome that matches the app) |
| 📅 **Recent** | Sort by Last Opened / Last Modified / Date Created / Name (all DESCENDING — the reference's measured `?sort=-<field>` contract), case-insensitive client-side search, grid/list views (the list renders the reference's separate p-3 cards with 40×40 live thumbnails, "Sep 30, 2026" dates, and per-row rename/delete menus), "N files found", and the reference's bare-search-icon "No files found" empty state |
| 👥 **Teams** | Create-team dialog (name/description/color + first member invite), member cards with avatar colors and role labels, invite-by-email + role, inline delete confirm — on the reference's decoded page chrome (the bordered header band, the flat `px-6` containers, the gradient-chip cards with the footer member count); the reference's own Create/Manage controls are dead chrome and its card renders only a count |
| 🔐 **Cookie-session auth** | scrypt password hashing + versioned HMAC sessions (`userId.version.expiry` — a password reset increments `tokenVersion` and evicts every previously minted cookie), per-IP rate limiting (10/15 min → 429 + `Retry-After`; the client key derives from the deploy-declared proxy topology — `DIGMA_PROXY_HOPS`, defaulting to one appending proxy), zero external auth dependencies |
| 🛡️ **Request-surface hardening** | 32 MB aggregate body cap on EVERY API route (checked BEFORE the parse — the two elements routes since session 67, the twelve remaining routes since session 68), PROJECT/TEAM/MEMBER creation ceilings (500/100/100), a dedicated 20/5-min assistant rate-limit bucket, the `DIGMA_DISABLE_IN_APP_OTP` knob closing the in-band OTP delivery for email-service deploys, and a deploy-DECLARED proxy trust depth (`DIGMA_PROXY_HOPS` — the per-IP limiter keys the client IP from your actual proxy topology: direct exposure, one appending proxy, or N) |
| 🚪 **Reference auth flow** | `/login` renders the auth card in FIVE reference-exact states: sign-in (logo + social buttons + "or" divider — a failed sign-in renders the reference's INLINE red alert "Invalid email or password" inside the form, no toast); **sign-up** (minimal card — "Back to sign in" link + "Create your account" h2, no logo/social, Confirm Password field with inline "Passwords do not match" validation, no name field — the API derives it from the email; the inputs carry NO client-side minLength, exactly like the reference — a weak password submits and its 400 "Password must be at least 8 characters long" renders as the inline alert); **verify** (the signup's follow-through — "Verify your email" with six auto-advancing digit inputs, a decrementing "N attempts remaining" wrong-code error, a timerless Resend; the FIFTH wrong code answers 429 "Too many failed attempts. Please request a new verification code." and locks the pending code until a Resend; the 6-digit code travels in the API response and renders in the card's info alert — the self-hosted no-email delivery; a login on an unverified account re-opens the card with a fresh code); **forgot** ("Reset your password" + email-only + "Send reset link" — the submit now calls the reset-request API); **sent** (the forgot follow-through — "Check your email" with the green alert, the in-app reset link (the self-hosted delivery — the blue info alert carries the response's `resetUrl` when the account exists), and the full-width back button; no email is actually sent); `?from_url=` return handling; Google/Microsoft/Facebook buttons render for parity and degrade to an explanatory toast (no OAuth credentials in a self-hosted clone) |
| 🔁 **Password-reset round-trip** | `/reset-password` — the reference's PUBLIC landing page (session 46): a non-empty `?token=` renders the "Set new password" form (New/Confirm Password with lock icons, no minLength, the "Must be at least 8 characters" hint, the mismatch guard, the primary "Reset password" + bare "Back to login" pair); anything else renders the "Invalid Reset Link" card (the red circle-alert + "This password reset link is invalid or has expired." + "Back to Login") — a DISTINCT simpler card family than the login card (flat gray-50 + rounded-lg shadow-lg). The API pair mirrors the reference's measured contract: `POST /api/auth/forgot-password` answers the no-enumeration 200 with the reference's exact message; `POST /api/auth/reset-password` takes `{reset_token, new_password}`, validates the token BEFORE the password, answers invalid tokens with 400 "Invalid or expired reset token", and clears the single-use token on success (the success card is the documented coherent superset — the reference's own valid-token path is unmeasurable, email-only) |
| 📱 **The mobile-navigation fix** | Hamburger (`md:hidden`, 44px target, stable aria-label + `aria-expanded`) opens a Radix Sheet drawer: focus-trapped, Escape + scrim close, scroll lock, links are SheetClose-wrapped so a tap navigates AND dismisses — pinned by 9 E2E checks at 390×844 |
| ✏️ **Mobile properties editing** | Below `lg` the properties panel does not exist — so a selected element (any type) surfaces an **Edit-properties chip** (bottom-right of the canvas, 44px touch floor, `lg:hidden`, the SlidersHorizontal icon) that opens a dark **bottom Sheet** carrying the SHARED `PropertiesSections` composition — the same type-conditional section stack the desktop panel renders (Position & Size, Corner Radius, Fill & Stroke, TEXT for text elements, Transform, Opacity; the fill-tab derivation included). One source, two surfaces: the section components and the layout composition live once in `properties-panel.tsx`, consumed by both. The reference's own mobile editor has no usable properties surface (its clipped 126px sliver + 24px chip targets) — a pure clone superset in the documented mobile-editor improvement family (S47-1/S48-2/S50-2) |
| 🌗 **Editor chrome** | GitHub-dark palette (`#0d1117`/`#161b22`/`#30363d`) measured from the reference: top bar (back, project name, Saved badge, undo/redo, avatars — the reference's "Alex Design"/"Sarah UI" placeholder cluster, with the real account in the first slot and the collaborator counter visible at every viewport — Share/Present), zoom pill, "N selected" badge |

## Screenshots

| Login | Dashboard | Editor |
|:---:|:---:|:---:|
| ![Login](docs/screenshots/01-login.png) | ![Dashboard](docs/screenshots/02-dashboard.png) | ![Editor](docs/screenshots/05-editor.png) |

| Recent | Teams | Editor (Untitled fallback) |
|:---:|:---:|:---:|
| ![Recent](docs/screenshots/03-recent.png) | ![Teams](docs/screenshots/04-teams.png) | ![Untitled editor](docs/screenshots/06-editor-untitled.png) |

<details>
<summary>Auth — the reference's per-mode card structure (sign-up + forgot)</summary>

| Sign-up | Sign-up (mismatch) | Forgot password |
|:---:|:---:|:---:|
| ![Sign-up](docs/screenshots/14-signup.png) | ![Sign-up validation](docs/screenshots/15-signup-validation.png) | ![Forgot](docs/screenshots/16-forgot.png) |

</details>

<details>
<summary>Mobile — including the navigation fix</summary>

| Dashboard | Navigation menu (the fix) | Teams | Editor |
|:---:|:---:|:---:|:---:|
| ![Mobile dashboard](docs/screenshots/07-mobile-dashboard.png) | ![Mobile menu](docs/screenshots/08-mobile-menu.png) | ![Mobile teams](docs/screenshots/09-mobile-teams.png) | ![Mobile editor](docs/screenshots/10-mobile-editor.png) |

</details>

<details>
<summary>Tablet (768)</summary>

![Tablet dashboard](docs/screenshots/11-tablet-dashboard.png)

</details>

<details>
<summary>Editor — panel toggles + Components panel (the chip bar)</summary>

![Editor with components panel](docs/screenshots/12-editor-components.png)

</details>

<details>
<summary>Editor — Transform section (rotation number input + the Scale slider, element at 2.0x + 15°)</summary>

![Editor transform scale](docs/screenshots/13-editor-transform-scale.png)

</details>

<details>
<summary>Editor — the keyboard-shortcuts help dialog (the ? key / the keyboard chip)</summary>

| Desktop | Mobile |
|:---:|:---:|
| ![Shortcuts dialog](docs/screenshots/23-shortcuts-dialog.png) | ![Shortcuts mobile](docs/screenshots/24-shortcuts-mobile.png) |

</details>

<details>
<summary>Editor — mobile properties editing (the Edit-properties chip + the bottom Sheet)</summary>

| The chip on a selected element | The bottom Sheet (the shared sections — the rectangle's five) |
|:---:|:---:|
| ![Mobile properties chip](docs/screenshots/25-mobile-properties-chip.png) | ![Mobile properties sheet](docs/screenshots/26-mobile-properties-sheet.png) |

</details>

<details>
<summary>Editor — mobile canvas properties (the Edit-canvas-properties chip + the Background Color Sheet — session 53)</summary>

| The canvas chip (nothing selected) | The bottom Sheet (the shared Background Color section) |
|:---:|:---:|
| ![Mobile canvas chip](docs/screenshots/29-mobile-canvas-chip.png) | ![Mobile canvas sheet](docs/screenshots/30-mobile-canvas-sheet.png) |

</details>

<details>
<summary>Editor — the canvas export format menu (PNG + SVG) and the success toasts</summary>

| The format menu (desktop) | The format menu (mobile) |
|:---:|:---:|
| ![Export menu desktop](docs/screenshots/27-export-menu-desktop.png) | ![Export menu mobile](docs/screenshots/28-export-menu-mobile.png) |

| The PNG toast | The SVG toast |
|:---:|:---:|
| ![PNG toast](docs/screenshots/31-export-png-toast.png) | ![SVG toast](docs/screenshots/32-export-svg-toast.png) |

</details>

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Web framework | Next.js (App Router) | 16.3 | 5 page routes + 16 API route handlers, standalone output |
| UI runtime | React | 19 | Component model |
| Language | TypeScript | 5 (strict) | Type safety end-to-end |
| Styling | Tailwind CSS | 4 | CSS-first `@theme` tokens in `globals.css` — **no `tailwind.config.js`** |
| Components | shadcn/ui on Radix | vendored | dialog, dropdown-menu, sheet, tabs, toast, button, input, label, textarea |
| Client state | Zustand | 5 | The editor store (elements, selection, tool, zoom, history) |
| Unit tests | Vitest | 5 | 574 checks on the pure domain seams + the `@theme`, slider-CSS, brand-mark, font-family validation, frame container-defaults, session-33 dynamic-contract (corner-radius max + the default font's fallback chain), session-35 greeting (the bundle-decoded 17:00 boundary + the first-word `greetingName`/"Designer" fallback), session-43 fill contracts (the min-2-guarded stop remove, the Background Size fit mapping + sanitize, the image paint's backgroundSize/Position), session-46 reset seams (`normalizeResetToken` + `resetTokenAlive`), session-48 shortcut seam (`TOOL_SHORTCUTS`/`toolForShortcut` — the single-source map), session-49 seams (`EDITOR_SHORTCUTS` — the help-dialog inventory with its Tools group derived from `TOOL_SHORTCUTS` + the label pins; `tests/canvas-memo.test.ts` — the CanvasElement `React.memo` source contract), the session-50 seam (`tests/text-section.test.ts` — the shared `TextSection` single-source contract), the session-51 export seams (`src/lib/export-png.test.ts`), the session-52 seams (`tests/properties-sections.test.ts` — the five shared section components + the `PropertiesSections` composer with its type-conditional gates, consumed by BOTH the desktop panel and the mobile Sheet), and the session-54 seams (`tests/export-menu.test.ts` — the `downloadSvg` export + the shared `triggerBlobDownload` anchor + the format-menu consumption + the honest "Download" trigger label; `tests/sheet-descriptions.test.ts` — the three mobile Sheets' `SheetDescription` purpose wiring), the session-55 seams (`tests/present-overlay.test.ts` + `tests/sheet-lifecycle.test.ts` — the layout-effect fit + the lg-crossing close listeners), and the session-56 integrity seams (`tests/gesture-undo.test.ts` — the store's gesture seam; `tests/autosave-machine.test.ts` — the serialized flush + the reference guard; `tests/present-integrity.test.ts`; `tests/image-whitelist.test.ts`; `tests/canvas-wheel.test.ts`; `tests/hit-test.test.ts`; `tests/route-envelope.test.ts`; `tests/nav-crossing.test.ts` — the md-crossing close + the bell Escape)  the session-57 integrity pins (gesture-lifecycle, autosave-identity, menu-standdown, space-pan, ai-patch, layers-a11y) — and the session-58 seams (recent-grid-rename, ellipsis-keyboard, redirect-integrity + safeFromUrl, header-search-sync, present-text, low-batch-s58: the grid rename DTO contract, the ellipsis keydown stop, the site-local from_url guard, the search re-derivation, the present pre-wrap contract, the team/stats/Retry-After/dead-ternary/Share-guard batch) — plus the session-59..63 integrity seams and the session-64 seams (the mobile update helper's gesture-aware commit, the surface-aware sliderGesture, the rotation-aware `boundsOf`, the resetUrl production gate, the register race guard + the reset cap, the `redactDatabaseUrl` log seam + the unified member color, and the editor Low batch: the single-sourced `isTypingTarget`, the canvas pointer capture, the TEXT color null-clear) — and the session-65 seams (`tests/thumbnail-fit.test.ts` — the `thumbnailFit` min-fit + centering behavioral pins + the measured wrapper wiring; `tests/slider-reset.test.ts` — the unmount reset seam + the load heal; `tests/number-coalesce.test.ts` — the field-surface burst coalescing on both number-input forms; `tests/low-batch-s65.test.ts` — the multi-@ redaction authority split + the greeting hydration suppression + the bell gray-500 + the dropzone drop handlers + the six dialog Close-X 44px sites; `tests/call-seam.test.ts` — the ONE shared client `call()` seam with zero per-view copies) |
| E2E tests | Playwright | 1.63 | 231 browser checks incl. the mobile-navigation regression suite, **the session-66 fixes suite (`tests/e2e/session66-fixes.spec.ts`: the type-then-drag two-undo — a typing burst followed by an immediate canvas drag keeps BOTH undo entries, pre-typing AND pre-drag; the bare-focus convergence — focusing a number field WITHOUT typing still converges the Saved badge; the picker-drag one-undo — one Ctrl+Z restores the pre-picker fill, not an intermediate color)**, **the session-65 fixes suite (`tests/e2e/session65-fixes.spec.ts`: the Recent LIST-view thumbnail containment — every painted element inside its rendered 40×40 slot; the mid-drag Sheet-close convergence — a slider drag alive at close never wedges the autosave, the badge reaches Saved; the number-field one-undo-per-burst — one Ctrl+Z restores the whole typed value, not one digit)**, **the session-52 mobile-properties suite (the Edit-properties chip's in-viewport 44px geometry at 390×844 for ANY single selection, the rectangle's five-section Sheet layout with the type-conditional gates asserted both ways, a non-TEXT Fill-Color edit round-trip that paints the canvas + persists through the autosave, the marquee multi-selection no-chip guard, the text round-trip + reload persistence, the scroll-lock/Escape/focus-return contract, the fresh-text workflow, and the lg-boundary guard — plus the session-55 lg-crossing pins (an OPEN element/canvas Sheet at 390×844 closes when the viewport grows to 1280 — the dialog unmounts and the desktop panel is the surface) — against a SELF-CONTAINED API-created fixture project, deleted per test + swept in afterAll)**, the session-51/54 export suite (the honestly-labeled Download trigger in the zoom cluster with the reference-measured trio's DOM boundary guarded, the FORMAT MENU offering both items, the menu-produced PNG download with the `.png` suggested filename + the PNG magic bytes + the 2× IHDR dimensions 2000×1400, the SVG download with the `.svg` suggested filename + the `<?xml`/`<svg` scaffold + the 1000×700 viewBox + the fixture's paint, the per-format success toasts, and the F35 in-viewport mobile geometry for the trigger + the tap-menu-item round-trip), the session-49 keyboard-shortcuts suite (the Keyboard chip in the zoom cluster opens the dialog, the nine-tool completeness listing, the View/Editing families, the `?` key + Escape + focus return, the stand-down guard while open, and the mobile chip reachability geometry at 390), the tablet-geometry header pins at 600 (the content-dependent wrap: the long seeded name wraps to the two-row header, the short name stays a single 48px row), the present-mode suite (the 44px exit touch floor, the device-coherent name — the Esc hint only at ≥640px — the body scroll lock, the focus move/return, tap-to-exit, and the desktop Escape regression), the editor-mobile-header suite (the Share/Present in-viewport geometry at 390×844 — reachability pinned as GEOMETRY, since Playwright's synthetic clicks reach off-viewport elements — plus the avatar guard, the tap round-trip, and the desktop 48px single-row guard), the Untitled-editor contract, the panel-toggle/properties suites (incl. the slider + segmented-pill chrome pins, the layer-row trash action, the session-19 layer-row action pins: the eye toggle hides the element on the canvas, the rename input's reference chrome, the lock icon's opacity flip — the session-21 functional-quality pins: the two drag-reorder precision tests, the number-input empty-draft test, the hex input's real accessible name — the session-23 locked-pointer-wall pins: the drag-wall, selection-preserving click, not-allowed cursor, outline-without-handles, and Select-All-drag-skips-locked tests — the session-25 keyboard-delete locked-contract pins: the locked-Delete no-op, the Select-All-Delete-keeps-locked, the unlocked-Delete control, and the trash-on-locked reference-parity boundary — and the session-27 AI-delete locked-contract pins: the locked-AI-delete no-op, the Select-All-AI-delete-keeps-locked, the unlocked-AI-delete control, and the reply-footer/Revert pin — plus the session-29 line/text element-type pins: the SVG diagonal line with NO box border, the line/ellipse Corner-Radius-hidden tests, the text panel's four-section layout, and the Font-Family/Text-Align functional tests), the AI no-crash regression pin (incl. the post-send "Try: …" line persistence), the FIVE-state auth-card suite (sign-up minimal card, Confirm Password validation, forgot state, the verify-email round-trip with the unverified-login recovery, the check-your-email transition, the inline sign-in error, and the session-45 weak-password inline-alert pin), the legacy-lowercase→canonical redirect pin (ADR-008, proven through the middleware→proxy migration), and the visual-parity suite (font, nav pill exact-match, toggles, Teams, zoom icons, AI panel, create-dialog icons/swatch/submit), plus the session-31 frame container pins (the labeled transparent container chrome, the label's zoom counter-scale, the seeded-frame contract, the thumbnail border-without-label) and the project delete-confirm pin (Cancel keeps, "Yes, Delete" removes), the session-33 dynamic-contract pins (the corner-radius max = `min(w,h)/2` with the per-corner clamp, the default text's "Inter, sans-serif" fallback chain, and the background-color-persists-across-reload test), the session-35 bundle-decoded pins (the ACCESS-based Quick Stats discriminator, the FLAT mobile hero at 390×844, and the sm-breakpoint buttons-row left alignment), the session-37 pins (the avatar-stack "Sarah UI" title + ungated mobile counter, the Teams bordered header band + flat-px-6 containers at desktop AND mobile, the team-card chrome, the member-list superset guard, and the 6 × h-48 loading skeleton), and the session-39 pins (the name-sort DESCENDING discriminator, the list-view structure with its thumbnail/date/menu contracts, the list-delete superset guard, the zoom clamps [10%, 500%], and the search-empty state), and the session-43 pins (the stop-remove control with its min-2 guard, the Angle Linear-only gate, and the Background Size select with its live paint + reload persistence), and the session-56 integrity specs (the gesture-undo single-Ctrl+Z regression pin, the autosave mid-flight race pin, the present-mode Delete stand-down, the BMP unsupported-image toast, the scale-2 outer-region hit test, the nav drawer's md-crossing close, and the bell's Escape dismissal)  the session-57 editor-integrity suite (pointercancel recovery, exit-flight identity, menu stand-down, space activation, select-all flip) — and the session-58 fixes suite (the grid rename immediacy, the ellipsis keyboard no-navigation, the header-search sync, the present multi-line fidelity, the Share Untitled guard, the team delete in-flight guard, the stats refresh) + the from_url open-redirect pins |
| ORM | Prisma | 6 | Schema, client, `db push`, seed |
| Database | SQLite | — | Zero-config local persistence (`db/custom.db`) |
| Auth | Node `crypto` (scrypt + HMAC) | — | Cookie sessions, no external auth service |
| AI | z-ai-web-dev-sdk | 0.0.x | Server-side assistant; deterministic fallback |
| Icons | lucide-react | 0.5.x | Icon set |
| Runtime | Bun (or Node ≥ 20) | — | Dev server, scripts, TS execution |

## Architecture

```mermaid
flowchart LR
    B[Browser] -->|GET / · /Dashboard · /Recent · /Teams · /Editor| P["Next.js pages (server components)<br/>session gate — redirect to /login"]
    M[legacy /recent · /teams · …] -->|307 redirect| P
    P --> B
    B -->|GET /login| L[Login route<br/>auth card]
    B -->|fetch JSON| A["API route handlers<br/>/api/* (16 routes)"]
    A -->|Prisma Client| D[("SQLite<br/>db/custom.db")]
    A -->|server-side| Z[z-ai-web-dev-sdk<br/>assistant commands]
    B -->|Zustand editor store| B
```

Every page resolves the session server-side and redirects unauthenticated visitors to `/login?from_url=…`. Client views fetch their data through the ONE shared `call()` envelope unwrapper in `src/lib/call.ts` (failures become destructive toasts, never render crashes — no view carries a local copy; the session-65 seam). The editor owns its state in one Zustand store — mutations push history snapshots and flip the store to `unsaved`, which a debounced effect flushes as a full-list `PUT` (server replaces the element set transactionally and returns fresh ids, which the store remaps so selection survives).

## File Hierarchy

```
📂 prisma/
  📄 schema.prisma          # 6 models: User, Project, DesignElement, Team, TeamMember (+relations)
  📄 seed.ts                # Idempotent demo workspace (user, 2 projects w/ canvas, team + 3 members)
📂 public/
  📄 logo.svg               # Brand mark (recreated from the reference: split pills + cyan circle on black)
📂 scripts/
  📄 smoke-test.sh          # 58-check E2E suite vs the production standalone server
📂 src/
  📂 app/
    📄 page.tsx             # Dashboard (session gate → DashboardView)
    📄 login/page.tsx       # Auth card route (3 states, from_url handling)
    📂 Dashboard/           # /Dashboard (canonical) — also served at /
    📂 Recent/              # /Recent files view
    📂 Teams/               # /Teams view
    📂 Editor/              # /Editor?projectId= — the canvas editor
    📄 layout.tsx           # Inter via next/font, Toaster, globals
    📄 globals.css          # Tailwind 4 @theme tokens (shadcn + editor palettes)
    📂 api/                 # 16 route handlers (auth, projects, elements, teams, stats, ai-assistant, health)
  📂 components/
    📂 editor/              # editor-view (shell/shortcuts/autosave/present/panel chips), canvas,
    │                       # toolbar, layers-panel, components-panel, properties-panel,
    │                       # ai-assistant, editor-store
    📄 app-header.tsx       # Shared chrome + THE MobileNav fix (hamburger + Sheet)
    📄 login-screen.tsx     # LoginCard (3 states, social degrade)
    📄 dashboard-view.tsx   # Hero, Quick Stats, Continue Working, All Projects
    📄 recent-view.tsx      # Sort/search/views
    📄 teams-view.tsx       # Team cards, create + invite dialogs
    📄 project-card.tsx     # Card + thumbnail + Create Project dialog
    📄 logo.tsx             # Inline SVG brand mark
    📂 ui/                  # shadcn primitives (button, dialog, dropdown-menu, sheet, tabs, toaster…)
  📄 proxy.ts              # Legacy lowercase routes → canonical 307 redirects (Next 16 `proxy` convention)
  📂 hooks/
    📄 use-toast.ts         # globalThis-backed toast store (useSyncExternalStore-safe)
  📂 lib/
    📄 editor.ts            # Element types, defaults, bounds/fit math — unit tested
    📄 editor-store? → components/editor/editor-store.ts
    📄 auth.ts              # scrypt + HMAC sessions, cookie lifecycle
    📄 api.ts               # ok()/fail() envelope + requireSession()
    📄 db-path.ts           # SQLite URL resolution (standalone chdir trap) — unit tested
    📄 db.ts                # Prisma singleton
    📄 rate-limit.ts        # Fixed-window per-IP auth throttling — unit tested
    📄 ai-assistant.ts      # Assistant fallback parser + LLM sanitizer — unit tested
    📄 team.ts              # Invite normalization — unit tested
    📄 greeting.ts          # Time-aware greeting — unit tested
    📄 validation.ts        # Manual guards (enums, clamps, length caps)
    📄 utils.ts             # cn() class merge
📂 tests/
  📂 e2e/                   # Playwright: auth, mobile-navigation (the fix), workspace,
  │                         # untitled-editor, editor-panels (chip toggles + properties)
  📄 db-path.test.ts        # The SQLite URL contract
📄 docs/
  📂 screenshots/           # App screenshots used by this README
```

## Quick Start

Requires **Bun** (recommended) or **Node.js ≥ 20** with npm.

```bash
# 1. Install dependencies
bun install                # or: npm install

# 2. Configure environment
cp .env.example .env       # defaults are correct for local use

# 3. Create + seed the database
bun run db:push            # or: npx prisma db push
bun run db:seed            # or: npx tsx prisma/seed.ts

# 4. Start the dev server
bun run dev                # or: npm run dev
```

Open <http://localhost:3000> and sign in with the seeded demo account:

| Email | Password |
|-------|----------|
| `demo@digma.app` | `Digma1234!` |

### Verify Setup

```bash
curl http://localhost:3000/api/health
# {"status":"ok","app":"digma","ts":"…"}

# Full end-to-end verification (58 checks: auth, CRUD, validation, rate limit, pages)
./scripts/smoke-test.sh    # builds must exist: run `bun run build` first
```

### Production

```bash
bun run build              # next build + standalone assembly
bun run start              # serves .next/standalone/server.js on :3000
```

## Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | SQLite connection string. Relative `file:` paths resolve against `prisma/schema.prisma` (the CLI rule) — `src/lib/db-path.ts` implements the same rule at runtime and handles the standalone server's `chdir` into `.next/standalone`. | `file:../db/custom.db` |
| `AUTH_SECRET` | Production | HMAC secret for session cookies. Generate with `openssl rand -hex 32`. Falls back to an insecure dev constant when unset. | — |
| `DIGMA_DISABLE_AI_LLM` | Optional | Set to `1` to force the AI assistant's deterministic fallback (the e2e suite pins its exact replies this way; also a production force-degrade knob). | — |
| `DIGMA_DISABLE_IN_APP_RESET` | Optional | Set to `1` to suppress the self-hosted in-app password-reset link (the forgot-password response stops carrying `resetUrl`; the no-enumeration 200 is unchanged). Set it when a real email service owns the reset delivery — the live single-use token never rides an API payload. | — |
| `DIGMA_REPO_ROOT` | Optional | Explicit repo-root anchor for SQLite path resolution (container escape hatch). | — |

## API Reference

All endpoints return `{ "ok": true, "data": … }` or `{ "ok": false, "error": { "code", "message" } }`. 🔒 = requires session cookie.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Liveness probe |
| `/api/auth/register` | POST | Create account (name, email, password) — rate-limited |
| `/api/auth/login` | POST | Sign in, sets session cookie — rate-limited (10/IP/15 min, then `429 RATE_LIMITED`) |
| `/api/auth/logout` | POST | Clear session |
| `/api/auth/me` | GET | Current user |
| `/api/stats` 🔒 | GET | Dashboard Quick Stats (projects, teams, active this week, plan) |
| `/api/projects` 🔒 | GET / POST | List (search, template filters) / create |
| `/api/projects/[id]` 🔒 | GET / PATCH / DELETE | Detail (with elements) / rename·re-color·touch / delete |
| `/api/projects/[id]/duplicate` 🔒 | POST | Copy project + elements |
| `/api/projects/[id]/elements` 🔒 | GET / POST / PUT | List / add one / full-list replace (autosave, transactional) |
| `/api/teams` 🔒 | GET / POST | List with members / create (+ optional first member) |
| `/api/teams/[id]` 🔒 | PATCH / DELETE | Rename / delete |
| `/api/teams/[id]/members` 🔒 | POST | Invite by email + role |
| `/api/ai-assistant` 🔒 | POST | Assistant chat → `{ reply, operations[] }` (LLM first, deterministic fallback) |

## Design System

Measured from the reference app. Light workspace: white surfaces on a `gray-50 → white → purple-50` wash, `purple-600 → pink-600 → blue-600` gradient hero, glass `bg-white/10 backdrop-blur-lg` stats card, `text-2xl font-bold` section heads, purple-600 accents, Inter type. Editor: GitHub-dark chrome.

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-background` | `#ffffff` | Page background |
| `--color-foreground` | `#0f172a` | Primary text (slate-900) |
| `--color-primary` | `#8b5cf6` | Purple-500 accents, active states |
| `--color-muted-foreground` | `#6b7280` | Secondary text (gray-500) |
| `--color-border` | `#e5e7eb` | Borders, inputs (gray-200) |
| `--color-editor-bg` | `#0d1117` | Editor canvas background |
| `--color-editor-panel` | `#161b22` | Editor panels, top bar, toolbar |
| `--color-editor-border` | `#30363d` | Editor borders/dividers |
| `--color-editor-text` | `#e6edf3` | Editor text |

Tokens are declared as **literal hex values in a plain `@theme` block** in `src/app/globals.css` — `var()` chains inside `@theme` are dropped by the current Tailwind v4 build (the Scandi Haven hard-won lesson), **and that rule extends to font tokens**: pointing `--font-sans` at `var(--font-inter)` compiles but computes to *guaranteed-invalid* at `:root` (next/font scopes the variable to `<body>`), silently rendering the whole app in the UA serif default — the v1.5.0 font fix ships literal font names and `tests/theme.test.ts` pins the contract. There is **no `tailwind.config.js` by design**: a leftover legacy config is the #1 cause of the "flat/minimal look" bug documented in the Tailwind v4 skills. Because the reference app ships the Tailwind v3 palette (via CDN), every consumed v4 default scale is **pinned to its v3 hex** in the same `@theme` block — v4's oklch-tuned palette renders visibly different (its blue-600 is `#155DFC` vs the reference's `#2563EB`).

Status colors: blue `#3B82F6` (default fill/active tool), green `#10B981` (Saved badge, Present), amber (Saving…), red `#EF4444` (destructive).

## Testing

```bash
bun run test              # unit tests — 574 checks on the pure domain seams
bun run test:e2e          # Playwright — 231 browser checks (needs `bun run build` first)
./scripts/smoke-test.sh   # curl E2E — 58 checks against the production build
```

The unit layer (Vitest) pins the pure seams — including the brand-mark source contract (`tests/brand-mark.test.ts`: the six measured hexes, the cyan circle counter, the dual render modes, no gradient chip backing): the SQLite URL resolution incl. the standalone `chdir` trap (`src/lib/db-path.ts`, pinned by `tests/db-path.test.ts`), the Tailwind v4 `@theme` contract (`tests/theme.test.ts` — literal font names with no `var()` chains, literal-hex color tokens, no legacy config), the assistant's deterministic parser + LLM-output sanitizer (`ai-assistant.test.ts`), the editor's geometry/default seams (`editor.test.ts`), the fixed-window rate limiter (`rate-limit.test.ts`), invite normalization (`team.test.ts`), and the greeting boundaries (`greeting.test.ts`).

The Playwright layer boots the production standalone server on :3100 with its own scratch database (`db/e2e.db`, schema-pushed + seeded by the global setup); a setup project signs the demo user in ONCE and shares the cookie via storageState (the auth rate limiter makes per-test logins a trap). The suites pin: the login round-trip (wrong password, valid credentials, authed redirect), **the auth-card state structure** (sign-up swaps to the reference's minimal card — "Back to sign in" + "Create your account" h2, no logo/social buttons, Confirm Password with inline "Passwords do not match" validation, no name field; forgot renders "Reset your password" + email-only + "Send reset link"; the back-link returns to the sign-in card), the workspace surface (dashboard stats/cards, path routes, 404 guard, create-project dialog, editor load with layers), the Untitled-editor contract (unknown/missing projectId → working editor, create-on-first-save, URL adoption), — and — the highest-regression-risk chrome — **the mobile navigation fix**: trigger visibility below `md` with 44px targets, drawer opens with all links, link taps navigate AND close, Escape closes with focus return, focus stays trapped, scroll locks (`data-scroll-locked`), and the hamburger never appears at ≥768. A dedicated `editor-panels` suite pins the reference's panel-toggle chips (independent Layers/Components/Properties visibility, default ON/OFF/ON, chips hidden where their panels can't render — below md, Properties chip below lg), the Layers header Select All/Deselect All flip, **the layer-row trash hover action** (the reference's third row action — eye, lock, and the red trash that deletes immediately; session 17), the properties panel's TYPE-CONDITIONAL section layout (session 29: RECTANGLE keeps the five sections — Position & Size, Corner Radius, Fill & Stroke, Transform, Opacity; LINE/ELLIPSE hide Corner Radius; TEXT renders Position & Size | TEXT | Transform | Opacity with the Font Family combobox + segmented Text Align buttons; Canvas Properties → Background Color row) and the line element's SVG diagonal rendering (no box border — at the canvas, thumbnail, and present sites), and the Transform section's scale contract (slider 0.1–3.0, "1.0x" readout, persisted transform chain). An AI-assistant regression test pins the degrade-not-fail contract — a submitted command must answer, mutate the canvas, and leave the page fully interactive (the reference app itself crashes blank-screen on the same input). A `parity` suite pins the measured reference chrome: the app renders Inter (never the UA serif default), the desktop nav carries the active-state pill on the current route (the session-10 reversal — session 8's "no pill" reading was a pre-hydration snapshot of the SPA; the settled reference renders `bg-purple-50 text-purple-700`, pinned on two routes), the active view toggle is the reference's near-black `#171717`, the Teams page is flat (no gradient wash) with solid blue-600 Create Team buttons, the zoom controls are magnifier icons (in-first), the AI panel follows the reference chrome (h-80 column, blue Bot header glyph, avatar-chip message rows with timestamps below the bubble, separate blue send button, and the `Try:` suggestions hint line under the input — the session-14 reversal of session 8's "no line" misread), the login card carries no demo-account hint and nothing renders below it, and the login chip carries the recreated brand mark (six measured shapes on the black field — no gradient backing; pinned by `tests/brand-mark.test.ts`).

The smoke suite boots the production standalone server and runs 58 checks: health, auth (valid/invalid/unauthenticated), all read endpoints (envelope asserted), project CRUD incl. rename + full-list element PUT + invalid-type rejection, team + member validation, the AI assistant (fallback adds exactly 3 circles; blank message 400), page renders, the 404 guard, logout invalidation, the login rate limit (429), the session-45 auth round-trips (the register→verify→resend flow, the weak-password 400 with the reference's exact message, the verify-otp 429 exhaustion ceiling with its lock, and the post-lock resend recovery — the section runs under its own X-Forwarded-For rate-limit bucket), and the session-46 password-reset round-trip (the no-enumeration 200 + the in-app reset URL, the invalid-token 400, the token-before-password ordering, the weak-password 400, the successful reset with its old/new password flip, the single-use replay, and the demo-password restore — under its own two XFF buckets).

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `Error code 14: Unable to open the database file` | A parent workspace `.env` or exported shell var injects an absolute `DATABASE_URL` pointing elsewhere; or the server started outside the repo root | Start via `bun run start`/`bun run dev`; check the `[db] DATABASE_URL ->` startup log line; prefer relative `file:../db/custom.db` |
| Login suddenly returns 429 | Per-IP rate limit engaged (10 attempts / 15 min) | Wait for the window to reset (see `Retry-After`) or restart the server to clear in-memory buckets |
| Toasts never appear | (Fixed) the toast store is `globalThis`-backed so split client chunks share it — if you fork the code, keep that pattern | See `src/hooks/use-toast.ts` |
| "Continue with Google" shows a toast instead of signing in | Expected — the self-hosted clone carries no OAuth credentials (documented deviation) | Wire a real provider in `login-screen.tsx` if needed |
| AI assistant answers but adds generic shapes | SDK unavailable → deterministic fallback engaged (by design) | Configure the SDK environment for LLM-shaped plans |
| Prisma `P1003` / missing tables | Database not initialized | `bun run db:push && bun run db:seed` |

## License

No license file is present in this repository; all rights are reserved by default. Add an explicit license before redistributing.
