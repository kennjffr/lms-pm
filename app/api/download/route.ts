import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDownloadUrl } from "@/lib/s3";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const fileKey = searchParams.get("file");
  const fileName = searchParams.get("name") || undefined;

  if (!fileKey) {
    return new NextResponse("Missing file key", { status: 400 });
  }

  try {
    const downloadUrl = await getDownloadUrl(fileKey, fileName);
    return NextResponse.redirect(downloadUrl);
  } catch (error) {
    console.error("Download redirect error:", error);
    return new NextResponse("File download failed", { status: 500 });
  }
}
