import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/engines/auth";
import { randomUUID } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json(
      { message: "공지 이미지 업로드는 관리자만 가능합니다." },
      { status: 403 },
    );
  }

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file") ?? formData?.get("image");
  if (!file || typeof file === "string") {
    return NextResponse.json(
      { message: "이미지 파일을 선택해주세요." },
      { status: 400 },
    );
  }

  const blob = file as Blob;
  if (!ALLOWED_TYPES.includes(blob.type)) {
    return NextResponse.json(
      { message: "JPEG, PNG, GIF, WebP만 업로드 가능합니다." },
      { status: 400 },
    );
  }
  if (blob.size > MAX_SIZE) {
    return NextResponse.json(
      { message: "파일 크기는 5MB 이하여야 합니다." },
      { status: 400 },
    );
  }

  const ext = blob.type === "image/jpeg" ? "jpg" : blob.type.split("/")[1] || "bin";
  const filename = `${randomUUID()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", "notices");
  await mkdir(dir, { recursive: true });
  const filePath = path.join(dir, filename);

  const buffer = Buffer.from(await blob.arrayBuffer());
  await writeFile(filePath, buffer);

  const url = `/uploads/notices/${filename}`;
  return NextResponse.json({ url });
}
