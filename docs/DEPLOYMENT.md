# Deployment Guide

Digma ships as a single Next.js **standalone** build with a SQLite file
database — one process, zero external services. This guide covers the
supported production paths and the environment contract.

## 1. Build

```bash
bun install
bun run build          # next build + standalone assembly (.next/standalone)
```

The build compiles the 7 page routes, the 18 API route files, and the 2
SEO metadata routes (`/robots.txt` + `/sitemap.xml` — session 99's S99-G,
the reference-measured parity pair; 27 routes total), then copies
`.next/static` and `public/` into
`.next/standalone/` (see the `build` script in `package.json`).
`next.config.ts` pins `outputFileTracingRoot` to the repo root — keep it;
the standalone trace depends on it.

## 2. Run

```bash
bun run start          # NODE_ENV=production bun .next/standalone/server.js
```

The server listens on port 3000 by default (`PORT` overrides). Always start
it from the repo root via the npm/bun script — the scripts guarantee the
working directory that the SQLite path resolution and the standalone trace
rely on. Session 78 (S78-G / B-L5) corrected this line to the code's real
mechanism: cookies are marked `Secure` whenever `NODE_ENV=production` (the
ONLY scheme logic in the repo — `src/lib/auth.ts`; no forwarded header is
read). Serve the app over HTTPS, or behind a TLS-terminating proxy that
speaks HTTPS to the browser — plain-HTTP self-hosting (even behind a
proxy that forwards `X-Forwarded-Proto`) will not retain the session
cookie.

**Proxy topology and rate limiting (session 69, S69-A):** the per-IP rate
limiter derives its client key from `x-forwarded-for` using the trust depth
you DECLARE with `DIGMA_PROXY_HOPS` (default 1 — exactly one appending
proxy, the limiter keying on the last hop that proxy appended). Declare
what you actually run: a direct-exposure deploy must set `0` (the header
family is ignored — one honest shared bucket instead of a per-request
rotation that fully bypasses the limits); two or more appending proxies
must set `N` (the limiter keys on the client IP the Nth proxy preserved —
the last hop there is the innermost proxy's own IP and would collapse
every user into one bucket). See `.env.example` for the full semantics.

## 3. Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | SQLite connection string. See §4. |
| `AUTH_SECRET` | **Yes in production** | HMAC secret for session cookies. Generate with `openssl rand -hex 32`. An insecure dev constant is used when unset — never ship that. |
| `DIGMA_REPO_ROOT` | No | Explicit repo-root anchor for SQLite path resolution (the container escape hatch — see §4). |
| `DIGMA_PROXY_HOPS` | No | The declared proxy-topology trust depth for the rate limiter (default 1 = one appending proxy; 0 = direct exposure — client-supplied forwarding headers ignored; N = N appending proxies). See §2 and `.env.example`. |
| `DIGMA_DISABLE_IN_APP_RESET` | **Yes for public deploys** | Suppresses the self-hosted in-app password-reset link (the reset token never rides an API payload — a real email service must own the delivery). |
| `DIGMA_DISABLE_IN_APP_OTP` | **Yes for public deploys** | Suppresses the in-response OTP verification-code delivery on register/login/resend (a real email service must own the delivery). |
| `DIGMA_DISABLE_AI_LLM` | No | Force-degrades the AI assistant to the deterministic fallback parser (no LLM calls). |
| `DIGMA_SITE_URL` | No | The public origin the SEO surfaces declare — `/robots.txt`'s sitemap pointer and `/sitemap.xml`'s absolute URLs. Unset = `http://localhost:3000` (the local default). Read per-request at runtime (session 100, S100-A: the two metadata routes are `force-dynamic` — an operator who builds once in CI/Docker and configures at deploy time gets the live value, not the build-time one). |

**Public-deploy posture (ADR-014, session 69):** with the two delivery knobs
UNSET, the self-hosted demo posture hands the reset URL / OTP code to any
caller that knows an account's email — bounded only by the rate limiter,
which a mis-declared proxy topology can leave bypassable. For any
internet-facing deploy set BOTH delivery knobs (and declare
`DIGMA_PROXY_HOPS` honestly); the single-tenant demo posture (any registered
account reads/mutates the whole workspace — the reference app's own model)
is fine for self-hosted single-user use and is the only documented posture.

**The resend-otp asymmetry (session 80, S80-E):** the three code-delivery
sites do NOT share an ownership gate. Register delivers the code only to
the registrant; login's unverified branch regenerates only after
`verifyPassword`; but `POST /api/auth/resend-otp` regenerates and delivers
the fresh code to ANY caller who knows the email — no password proof, no
session — and `verify-otp` opens the session on that code. The chain only
reaches UNVERIFIED accounts (a verified account's login goes through the
password first), which bounds it to the window between register and verify.
Single-tenant self-hosted: acceptable (the documented posture above). Any
internet-facing deploy: the knobs close it — with `DIGMA_DISABLE_IN_APP_OTP=1`
the delivered code is null and the chain is dead.

## 4. Database location (§4 — the `.env.example` reference)

`DATABASE_URL` accepts three forms:

1. **Relative `file:` URL (the default, zero-config local story).**
   ```
   DATABASE_URL="file:../db/custom.db"
   ```
   Relative URLs resolve against the **`prisma/` directory that owns
   `schema.prisma`** — exactly like the Prisma CLI — so this string points
   at `<repo>/db/custom.db` for `prisma db push`, `prisma/seed.ts`,
   `next build` and the running server alike, regardless of the process
   working directory. The resolution rule lives in
   `src/lib/db-path.ts` and is pinned by `tests/db-path.test.ts`.

2. **Absolute `file:` URL (recommended for production).**
   ```
   DATABASE_URL="file:/var/lib/digma/custom.db"
   ```
   Absolute paths pass through untouched — immune to any working-directory
   ambiguity across service managers, containers, or cron wrappers. Point
   them at a persisted volume and back the file up.

3. **PostgreSQL.** Switch `provider = "postgresql"` in
   `prisma/schema.prisma`, set a `postgresql://` URL, then
   `bun run db:push && bun run db:seed`.

Initialize (or reset) the database with:

```bash
bun run db:push        # apply schema (db push — no migrations folder)
bun run db:seed        # idempotent demo workspace (wipes domain tables)
```

`db/*.db` is gitignored; every fresh clone recreates it from the two
commands above (`cp .env.example .env` first).

**Hazard (session 81, S81-E / B81-I4):** `db:push` runs with
`--accept-data-loss` — the dev-sandbox convenience flag is on the
documented provisioning path. Against a FRESH database it is harmless
(schema creation only), but run against an EXISTING production
database after a schema drift it DROPS columns/tables without
prompting. A production host that needs a schema refresh should
re-provision deliberately: stop the server, back up `db/custom.db`,
then re-push and re-seed — the single-tenant self-hosted posture
(the two-command story) is the intended flow, not an in-place
migration.

**Environment trap (bit the team repeatedly):** a parent workspace `.env`
or an exported shell `DATABASE_URL` shadows the repo's relative URL with an
absolute path to a different (or missing) file — symptom: `Error code 14:
Unable to open the database file`, and the Prisma CLI reports a datasource
path OUTSIDE the repo. The `[db] DATABASE_URL -> …` startup log line is the
diagnostic. Fix: `unset DATABASE_URL` before any `bun run` command, and
never keep a parent `.env` above the repo. In containers where the repo
root is ambiguous, set `DIGMA_REPO_ROOT=/app` instead of an absolute
`DATABASE_URL` to keep the relative-path story intact.

## 5. Updating

```bash
git pull
bun install
bunx prisma generate   # after schema changes
bun run db:push
bun run build
# restart the server process
```

**One-time session eviction when crossing the session-67 boundary:**
deploying the tokenVersion-auth build (session 67+) over a pre-session-67
build evicts EVERY previously minted session cookie on the first request
after the restart — the new `getSessionUser` compares the cookie's embedded
version against the database's `tokenVersion` column (absent in older
tokens), so every signed-in user is bounced to `/login` exactly ONCE and
re-login mints a versioned cookie. Do not schedule this deploy mid-workday
if you can avoid it; subsequent deploys do not repeat the eviction (only a
password reset increments the version for an individual account).

## 6. Verification checklist

```bash
curl -s https://your-host/api/health          # {"status":"ok",...}
bun run lint && bun run typecheck && bun run test
./scripts/smoke-test.sh                       # 63 smoke checks (local, dev server stopped)
bun run test:e2e                              # 262 Playwright checks (local, needs a build)
```

## 7. Common production issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| `Error code 14: Unable to open the database file` | Server started from a directory that has no `prisma/schema.prisma` and no absolute `DATABASE_URL` — or a parent `.env`/exported `DATABASE_URL` shadowed the repo's relative URL | Start via `bun run start` with `DATABASE_URL` unset, or set an absolute `file:` URL (§4) |
| Logins loop back to `/login` | `AUTH_SECRET` changed between restarts | Keep the secret stable across restarts |
| Rate-limited logins (429) | 10 attempts/IP/15 min fixed window | Wait for `Retry-After`, or restart to clear the in-memory buckets (single-node) |
| The UI suddenly renders in a serif font | A `var()` chain crept back into an `@theme` font token (ADR-004a) | Keep `--font-sans` literal; `tests/theme.test.ts` is the gate |
