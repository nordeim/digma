#!/usr/bin/env bash
# Explicit-list bootstrap for sandbox environments (run from the repo
# root). package.json is the SINGLE SOURCE OF TRUTH — this list is
# regenerated from it (session 69, S69-B: the script had drifted — it
# missed live packages and installed dead ones). The parity is pinned
# by tests/dependency-hygiene-s69.test.ts in BOTH directions: every
# package.json entry must appear here, and nothing here may be absent
# from package.json. bun install / npm install (no arguments) reads
# package.json directly and is always in sync — prefer that when the
# toolchain is available.
npm install @prisma/client @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slot @radix-ui/react-tabs class-variance-authority clsx lucide-react next prisma react react-dom tailwind-merge z-ai-web-dev-sdk zustand @playwright/test @tailwindcss/postcss @types/react @types/react-dom bun-types eslint eslint-config-next tailwindcss tw-animate-css typescript vitest
