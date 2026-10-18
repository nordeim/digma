#!/usr/bin/env bash
# scripts/witness-restore.sh — the post-e2e witness restore, MECHANICAL
# named-list form (Session 156, S156-A — the capture-script mechanical-
# restore hardening, closing the B121-I1 suggestion carried in the
# deferred queue since session 121; the s153 over-catch incident's
# structural prevention — the S147 named-window doctrine at the
# operator-side form).
#
# THE CONTRACT (the s153 lesson made mechanical):
#   1. The NAMED list below is EVERY docs/screenshots path the e2e
#      suite writes (16 paths, derived live from the spec grep —
#      pinned by tests/lows-s156.test.ts's live-derivation guard: a
#      new spec write goes RED until this list updates).
#   2. The restore touches EXACTLY the named list — never the
#      modified-file list, never a broad checkout (the s153 over-catch
#      class: a broad checkout over the modified files reverted the
#      cycle's unstaged deliverables).
#   3. The SAFETY ASSERTION: the set of files whose modifications the
#      run removed MUST be a subset of the named list — anything else
#      ABORTS non-zero (the s153 lesson as a runtime invariant).
#   4. Byte-identical re-captures (the deterministic renders) are
#      no-ops; the actually-changing subset (the 11-and-varying
#      witnesses) is restored regardless.
#
# Usage (after `bun run test:e2e`, with the dev server stopped):
#   bash scripts/witness-restore.sh
set -u

# The named witness list — every docs/screenshots path the e2e suite
# writes (the live derivation: grep -ohE 'docs/screenshots/...' over
# tests/e2e/*.ts; each member names its spec site in birth order).
WITNESSES=(
  "docs/screenshots/ref-audit-s52/ref-02-mobile-editor-header-390.png"
  "docs/screenshots/ref-audit-s72/clone-09-slider-one-undo.png"
  "docs/screenshots/ref-audit-s72/clone-10-soft-leave-persisted.png"
  "docs/screenshots/ref-audit-s73/clone-11-thumbnail-painted.png"
  "docs/screenshots/ref-audit-s74/clone-12-mobile-slider-one-undo.png"
  "docs/screenshots/ref-audit-s75/clone-13-mid-drag-close-convergence.png"
  "docs/screenshots/ref-audit-s76/clone-15-bare-focus-convergence.png"
  "docs/screenshots/ref-audit-s77/clone-18-revocation-redirect.png"
  "docs/screenshots/ref-audit-s77/clone-19-dashboard-list-empty-state.png"
  "docs/screenshots/ref-audit-s78/clone-18-marquee-visual-footprint.png"
  "docs/screenshots/ref-audit-s78/clone-19-session-expired-terminal.png"
  "docs/screenshots/ref-audit-s79/clone-21-knob-posture-verify-card.png"
  "docs/screenshots/ref-audit-s80/clone-21-card-a11y-stretched-button.png"
  "docs/screenshots/ref-audit-s80/clone-22-layers-row-select-button.png"
  "docs/screenshots/ref-audit-s81/clone-21-exit-single-put.png"
  "docs/screenshots/ref-audit-s81/clone-22-login-403-fold.png"
)

# The tracked-path guard: every named path must be KNOWN to git before
# any checkout (a typo'd or deleted path cannot silently pass).
for w in "${WITNESSES[@]}"; do
  git ls-files --error-unmatch -- "$w" >/dev/null 2>&1 || {
    echo "WITNESS-RESTORE FAILED: $w is not a tracked path (fix the named list)" >&2
    exit 1
  }
done

# The before census: the unstaged-modified tracked files (the e2e
# witnesses + the cycle's own unstaged deliverables, if any).
before=$(git diff --name-only | sort)
before_count=$(printf '%s' "$before" | grep -c . || true)

# The restore: EXACTLY the named list — never the modified-file list,
# never a broad checkout (the S156-A mechanical form).
git checkout -- "${WITNESSES[@]}"

# The after census.
after=$(git diff --name-only | sort)
after_count=$(printf '%s' "$after" | grep -c . || true)

# The SAFETY ASSERTION (the s153 lesson as a runtime invariant): every
# file whose modification the run REMOVED must be a member of the named
# list — removed-but-unnamed means the run touched something it must
# never touch, and the run ABORTS non-zero.
removed=$(comm -23 <(printf '%s\n' "$before") <(printf '%s\n' "$after") | sort -u)
unnamed=$(printf '%s\n' "$removed" | grep . | while IFS= read -r f; do
  ok=0
  for w in "${WITNESSES[@]}"; do
    [ "$f" = "$w" ] && ok=1 && break
  done
  [ "$ok" = "0" ] && printf '%s\n' "$f"
done || true)
if [ -n "$(printf '%s\n' "$unnamed" | grep . || true)" ]; then
  echo "WITNESS-RESTORE SAFETY ASSERTION FAILED: modifications removed OUTSIDE the named list:" >&2
  printf '%s\n' "$unnamed" >&2
  exit 1
fi

# The census receipt (the operator-visible before/after record).
restored=$(printf '%s\n' "$removed" | grep -c . || true)
echo "WITNESS RESTORE (S156-A): ${#WITNESSES[@]} named, $before_count modified before, $restored restored, $after_count remain (the cycle's own deliverables — untouched by design)"
