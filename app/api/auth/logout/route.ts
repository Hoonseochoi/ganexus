import { NextRequest, NextResponse } from "next/server";
import { destroyCurrentSession } from "@/src/lib/engines/session";

export async function POST(_req: NextRequest) {
  await destroyCurrentSession();
  return NextResponse.json({ status: "ok" });
}

