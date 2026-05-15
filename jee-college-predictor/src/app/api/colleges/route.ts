import { NextResponse } from "next/server";

import { colleges } from "@/lib/predictor";

export const revalidate = 86400;

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase().trim() ?? "";
  const type = searchParams.get("type");
  const state = searchParams.get("state");

  const data = colleges.filter((college) => {
    if (type && type !== "ALL" && college.type !== type) return false;
    if (state && college.state !== state) return false;
    if (!query) return true;
    return [college.name, college.fullName, college.city, college.state, college.type].some((value) =>
      value.toLowerCase().includes(query)
    );
  });

  return NextResponse.json({
    total: data.length,
    data,
  });
}
