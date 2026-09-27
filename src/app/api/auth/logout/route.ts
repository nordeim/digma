import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";
import { ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = ok({ signedOut: true });
  await clearSessionCookie(response);
  return response;
}
