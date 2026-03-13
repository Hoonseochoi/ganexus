import { NextRequest, NextResponse } from "next/server";
import { destroyCurrentSession } from "@/src/lib/engines/session";

export async function POST(req: NextRequest) {
  await destroyCurrentSession();
  const url = new URL("/", req.url);
  return NextResponse.redirect(url, 302);
}

