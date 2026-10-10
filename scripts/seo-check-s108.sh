#!/usr/bin/env bash
# Session 108 — the per-session SEO runtime-delivery check (the S108-A
# fail-loud form). Both metadata routes force-dynamic, the DIGMA_SITE_URL
# knob answering at REQUEST time — asserted, not echoed.
# Born echo-only this cycle (B-L1 — the F89 evidence-truth family's
# newest member: nothing asserted the served bodies, the exit code was
# 0 regardless of drift, and a squatted port would have answered the
# health loop while the curls measured the wrong server — the S99-F
# family). The closure: the port-squat refusal BEFORE the boot, the
# server-up gate, the knob-origin assertions (positive + the
# no-localhost negative on BOTH bodies — the S100-A build-time-bake
# class caught in both directions), and the PASS/FAIL counter form with
# exit 1 on any failure (lesson F95: an evidence script that only
# echoes is hollow evidence; a NEW script form must land with its gate
# in the same commit). The flip control (knob unset -> the localhost
# default) stays the capture witness's birth-labeled form (clone-58).
set -u
cd /home/z/my-project/digma
unset DATABASE_URL

SEO_PORT=3005

# S99-F (the port-squat refusal): an already-answering port means a
# zombie server — the curls would measure the WRONG server while the
# script still exits 0. Refuse to run.
if curl -sf -m 2 "http://localhost:$SEO_PORT/api/health" >/dev/null 2>&1; then
  echo "F89 CHECK FAILED: port $SEO_PORT already answers (a zombie server) — refusing to measure the wrong server" >&2
  exit 1
fi

# The hermetic boot (the sibling uniformity form — the six-knob env -u
# strip on ONE line; DIGMA_SITE_URL is the KNOB UNDER TEST, never
# stripped) + the AI degrade + the production node.
env -u DIGMA_PROXY_HOPS -u DIGMA_DISABLE_IN_APP_RESET -u DIGMA_DISABLE_IN_APP_OTP -u DIGMA_REPO_ROOT -u HOSTNAME -u KEEP_ALIVE_TIMEOUT \
  DIGMA_DISABLE_AI_LLM=1 DIGMA_SITE_URL=https://digma.example.com \
  PORT=$SEO_PORT NODE_ENV=production \
  bun .next/standalone/server.js > /tmp/digma-seo-s108.log 2>&1 &
SRV=$!
trap 'kill $SRV >/dev/null 2>&1' EXIT

# The server-up gate: a boot that never answers is a failed check,
# never a curl-into-the-void.
UP=0
for i in $(seq 1 25); do
  curl -sf -m 2 "http://localhost:$SEO_PORT/api/health" >/dev/null 2>&1 && { UP=1; break; }
  sleep 1
done
if [ "$UP" != "1" ]; then
  echo "F89 CHECK FAILED: the SEO server never came up on :$SEO_PORT" >&2
  exit 1
fi

PASS=0; FAIL=0
ok() { PASS=$((PASS+1)); echo "PASS: $1"; }
bad() { FAIL=$((FAIL+1)); echo "FAIL: $1"; }

ROBOTS=$(curl -s "http://localhost:$SEO_PORT/robots.txt")
SITEMAP=$(curl -s "http://localhost:$SEO_PORT/sitemap.xml")

# ---- 1 — robots.txt carries the knob origin in its Sitemap pointer ----
case "$ROBOTS" in
  *"Sitemap: https://digma.example.com/sitemap.xml"*)
    ok "robots.txt sitemap pointer carries the knob origin (https://digma.example.com)";;
  *)
    bad "robots.txt sitemap pointer missing the knob origin (https://digma.example.com)";;
esac

# ---- 2 — robots.txt never answers the build-time localhost default ----
case "$ROBOTS" in
  *localhost*)
    bad "robots.txt carries localhost under the knob (the build-time bake)";;
  *)
    ok "robots.txt carries no localhost under the knob";;
esac

# ---- 3 — sitemap.xml's loc URLs carry the knob origin ----
N_LOC=$(printf '%s' "$SITEMAP" | grep -c "<loc>https://digma.example.com/" || true)
if [ "${N_LOC:-0}" -ge 1 ]; then
  ok "sitemap.xml loc URLs carry the knob origin ($N_LOC urls)"
else
  bad "sitemap.xml loc URLs missing the knob origin"
fi

# ---- 4 — sitemap.xml never answers the build-time localhost default ----
case "$SITEMAP" in
  *localhost*)
    bad "sitemap.xml carries localhost under the knob (the build-time bake)";;
  *)
    ok "sitemap.xml carries no localhost under the knob";;
esac

echo "----------------------------------------"
echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 108, S108-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"
[ "$FAIL" = "0" ] || exit 1
