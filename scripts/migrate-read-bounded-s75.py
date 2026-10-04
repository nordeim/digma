#!/usr/bin/env python3
"""Session 75 (S75-B): migrate the 14 parse sites onto readBoundedJson.

Replaces the uniform guard+parse pair:
    if (bodySizeRejected(request.headers.get("content-length"))) {
      return fail("VALIDATION", "<MSG>", 400);
    }

    const body = await request.json().catch(() => null);
with the seam consumption:
    const parsed = await readBoundedJson(request);
    if (parsed.tooLarge) {
      return fail("VALIDATION", "<MSG>", 400);
    }
    const body = parsed.value;

and swaps bodySizeRejected -> readBoundedJson in the import lists.
Asserts the anchor exists before replacing (the F57(4) silent-no-op
lesson); prints a per-file replacement count.
"""
import re
import sys
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

FILES = [
    "src/app/api/auth/login/route.ts",
    "src/app/api/auth/register/route.ts",
    "src/app/api/auth/verify-otp/route.ts",
    "src/app/api/auth/resend-otp/route.ts",
    "src/app/api/auth/forgot-password/route.ts",
    "src/app/api/auth/reset-password/route.ts",
    "src/app/api/projects/route.ts",
    "src/app/api/projects/[id]/route.ts",
    "src/app/api/projects/[id]/elements/route.ts",  # two sites (POST + PUT)
    "src/app/api/teams/route.ts",
    "src/app/api/teams/[id]/route.ts",
    "src/app/api/teams/[id]/members/route.ts",
    "src/app/api/ai-assistant/route.ts",
]

GUARD_PARSE = re.compile(
    r"  if \(bodySizeRejected\(request\.headers\.get\(\"content-length\"\)\)\) \{\n"
    r"    return fail\(\"VALIDATION\", \"(?P<msg>[^\"]+)\", 400\);\n"
    r"  \}\n"
    r"\n"
    r"  const body = await request\.json\(\)\.catch\(\(\) => null\);\n"
)

SEAM_FORM = (
    "  const parsed = await readBoundedJson(request);\n"
    "  if (parsed.tooLarge) {{\n"
    "    return fail(\"VALIDATION\", \"{msg}\", 400);\n"
    "  }}\n"
    "  const body = parsed.value;\n"
)


def migrate(rel: str) -> int:
    path = ROOT / rel
    text = path.read_text()
    matches = list(GUARD_PARSE.finditer(text))
    if not matches:
        print(f"NO MATCH: {rel}")
        return 0
    out = GUARD_PARSE.sub(lambda m: SEAM_FORM.format(msg=m.group("msg")), text)
    # The import swap: bodySizeRejected -> readBoundedJson (in the
    # named-import list; keep any siblings on the line).
    out2, n_import = re.subn(r"\bbodySizeRejected\b", "readBoundedJson", out)
    if n_import == 0:
        print(f"NO IMPORT MATCH: {rel}")
        return 0
    path.write_text(out2)
    print(f"OK: {rel} — {len(matches)} site(s), {n_import} import mention(s)")
    return len(matches)


def main() -> None:
    total = sum(migrate(rel) for rel in FILES)
    print(f"TOTAL SITES MIGRATED: {total}")
    if total != 14:
        print("EXPECTED 14 — MISMATCH", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
