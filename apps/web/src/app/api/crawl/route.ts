import { NextResponse } from "next/server";

import { getCrawlJobViews } from "@/lib/crawl-status";

export const dynamic = "force-dynamic";

/** Trạng thái các job crawl đang chạy — UI poll mỗi 2s. */
export async function GET() {
  return NextResponse.json({ jobs: await getCrawlJobViews() });
}
