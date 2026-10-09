#!/usr/bin/env bash
# Session 102 (S102-A / B-M1) — the one-off evidence repair for the
# hollow s111 artifacts: the s100/s101 capture scripts killed the flip
# server BEFORE the evidence curls, so the delivered
# ref-audit-s111/clone-58-robots-flipped.txt and
# clone-58-sitemap-flipped.xml are 0 bytes (the runtime flip itself was
# genuinely verified by the inline greps — only the persisted evidence
# was hollow). This script re-runs the corrected flip segment against
# the SAME delivered tree (the served bodies are a function of the
# code, not the moment) and re-saves the flipped + default bodies at
# the documented s111 paths, asserting non-empty (the fail-loud form
# the s102 capture script now carries).
set -u
cd /home/z/my-project/digma
unset DATABASE_URL

OUT=docs/screenshots
FLIP_PORT=3023

echo "=== the s111 flip-evidence repair (session 102, S102-A) ==="

# The flip server: DIGMA_SITE_URL set, the same form the capture uses.
DATABASE_URL="file:../db/custom.db" DIGMA_DISABLE_AI_LLM=1 DIGMA_SITE_URL="https://digma.example.com" PORT=$FLIP_PORT NODE_ENV=production \
  bun .next/standalone/server.js > /tmp/digma-repair102-flip.log 2>&1 &
SRV=$!
for i in $(seq 1 25); do curl -sf -m 2 "http://localhost:$FLIP_PORT/api/health" >/dev/null 2>&1 && break; sleep 1; done

# The capture server: env unset, the localhost forms.
DATABASE_URL="file:../db/custom.db" DIGMA_DISABLE_AI_LLM=1 PORT=3000 NODE_ENV=production \
  bun .next/standalone/server.js > /tmp/digma-repair102-main.log 2>&1 &
SRV2=$!
for i in $(seq 1 25); do curl -sf -m 2 "http://localhost:3000/api/health" >/dev/null 2>&1 && break; sleep 1; done

trap 'kill $SRV >/dev/null 2>&1; kill $SRV2 >/dev/null 2>&1' EXIT

# The inline flip verification (the same greps the capture carries):
FROBOTS=$(curl -s "http://localhost:$FLIP_PORT/robots.txt")
FOK=0
echo "$FROBOTS" | grep -qF "User-Agent: *" && FOK=$((FOK+1))
echo "$FROBOTS" | grep -q "Sitemap: https://digma.example.com/sitemap.xml" && FOK=$((FOK+1))
if [ "$FOK" -lt 2 ]; then echo "F42 CHECK FAILED: the flipped server's /robots.txt must carry the env origin, got: $FOK"; exit 1; fi
FSMAP=$(curl -s "http://localhost:$FLIP_PORT/sitemap.xml")
FSOK=0
echo "$FSMAP" | grep -q "<loc>https://digma.example.com/</loc>" && FSOK=$((FSOK+1))
echo "$FSMAP" | grep -q "<loc>https://digma.example.com/Teams</loc>" && FSOK=$((FSOK+1))
echo "$FSMAP" | grep -q "<loc>https://digma.example.com/Editor</loc>" && FSOK=$((FSOK+1))
if [ "$FSOK" -lt 3 ]; then echo "F42 CHECK FAILED: the flipped server's /sitemap.xml must carry the env origin URLs, got: $FSOK"; exit 1; fi
LOK=$(curl -s "http://localhost:3000/sitemap.xml" | grep -c "<loc>http://localhost:3000/")
if [ "$LOK" -lt 1 ]; then echo "F42 CHECK FAILED: the :3000 server (env unset) must keep the localhost forms"; exit 1; fi

# The evidence writes — BEFORE the kill (the S102-A ordering), with the
# fail-loud non-empty assertions (no || true mask):
curl -s "http://localhost:$FLIP_PORT/robots.txt" > "$OUT/ref-audit-s111/clone-58-robots-flipped.txt"
curl -s "http://localhost:$FLIP_PORT/sitemap.xml" > "$OUT/ref-audit-s111/clone-58-sitemap-flipped.xml"
curl -s "http://localhost:3000/robots.txt" > "$OUT/ref-audit-s111/clone-58-robots-default.txt"
for EV in clone-58-robots-flipped.txt clone-58-sitemap-flipped.xml clone-58-robots-default.txt; do
  if ! grep -q . "$OUT/ref-audit-s111/$EV"; then
    echo "F42 CHECK FAILED: the repaired evidence file $EV is EMPTY — the evidence must tell the truth about what it saw"
    exit 1
  fi
done

echo "repaired clone-58 robots/sitemap flipped + default text evidence at the s111 paths — all non-empty"
