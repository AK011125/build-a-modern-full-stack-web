import { NextResponse } from "next/server";

import { getAnalytics } from "@/lib/predictor";

export const revalidate = 86400;

export function GET() {
  return NextResponse.json(getAnalytics());
}
