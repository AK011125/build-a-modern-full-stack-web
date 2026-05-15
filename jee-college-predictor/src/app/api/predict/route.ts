import { NextResponse } from "next/server";

import { predictColleges, type PredictorFilters } from "@/lib/predictor";

export const revalidate = 3600;

const fallbackFilters: PredictorFilters = {
  rank: 15000,
  category: "OPEN",
  quota: "ANY",
  gender: "ANY",
  branch: "ALL",
  collegeType: "ALL",
  maxFees: 8,
  minPackage: 0,
  search: "",
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<PredictorFilters>;
    const rank = Number(body.rank);

    if (!Number.isFinite(rank) || rank < 1) {
      return NextResponse.json({ error: "Rank must be a positive number." }, { status: 400 });
    }

    const filters: PredictorFilters = {
      ...fallbackFilters,
      ...body,
      rank,
      maxFees: Number(body.maxFees ?? fallbackFilters.maxFees),
      minPackage: Number(body.minPackage ?? fallbackFilters.minPackage),
    };

    const results = predictColleges(filters);
    return NextResponse.json({ total: results.length, data: results });
  } catch {
    return NextResponse.json({ error: "Invalid prediction request." }, { status: 400 });
  }
}
