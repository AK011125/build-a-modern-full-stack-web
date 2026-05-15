"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowUpDown,
  BarChart3,
  Bookmark,
  Building2,
  ExternalLink,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  allBranches,
  allStates,
  colleges,
  getAnalytics,
  predictColleges,
  type College,
  type CollegeType,
  type Gender,
  type PredictorFilters,
  type Quota,
  type SeatType,
} from "@/lib/predictor";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories: SeatType[] = ["OPEN", "EWS", "OBC-NCL", "SC", "ST"];
const quotas: Array<Quota | "ANY"> = ["ANY", "AI", "HS", "OS"];
const genders: Array<Gender | "ANY"> = ["ANY", "Gender-Neutral", "Female-only"];
const collegeTypes: Array<CollegeType | "ALL"> = ["ALL", "NIT", "IIIT", "GFTI", "State", "Private"];

const defaultFilters: PredictorFilters = {
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

export default function PredictorForm() {
  const [filters, setFilters] = useState<PredictorFilters>(defaultFilters);
  const [page, setPage] = useState(1);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("jee-bookmarks") ?? "[]") as string[];
  });

  const analytics = useMemo(() => getAnalytics(), []);
  const predictions = useMemo(() => predictColleges(filters), [filters]);
  const pageSize = 12;
  const paginated = predictions.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(predictions.length / pageSize));
  const bookmarkedColleges = colleges.filter((college) => bookmarks.includes(college.id));
  const comparedColleges = compareIds.map((id) => colleges.find((college) => college.id === id)).filter(Boolean) as College[];

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  function updateFilter<K extends keyof PredictorFilters>(key: K, value: PredictorFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  function toggleBookmark(id: string) {
    setBookmarks((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem("jee-bookmarks", JSON.stringify(next));
      return next;
    });
  }

  function toggleCompare(id: string) {
    setCompareIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      return [...current, id].slice(-3);
    });
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Colleges indexed" value={`${analytics.totalColleges}+`} icon={<Building2 />} />
        <MetricCard label="Cutoff rows" value={analytics.totalCutoffs.toLocaleString("en-IN")} icon={<SlidersHorizontal />} />
        <MetricCard label="Branches" value={analytics.branches.toString()} icon={<ArrowUpDown />} />
        <MetricCard label="Saved colleges" value={bookmarks.length.toString()} icon={<Bookmark />} />
      </section>

      <Card className="border-white/10 bg-white/[0.03] text-white shadow-2xl shadow-indigo-950/30">
        <CardHeader className="border-b border-white/10">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold">Predictor Dashboard</CardTitle>
              <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                Search JoSAA-style recommendations by rank, quota, category, branch, fees and placement outcomes.
              </p>
            </div>
            <Badge className="w-fit border-emerald-400/30 bg-emerald-400/10 text-emerald-200">
              2024 seed data ready for official import
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-5">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Field label="JEE Main rank">
              <Input
                type="number"
                value={filters.rank}
                min={1}
                onChange={(event) => updateFilter("rank", Number(event.target.value || 1))}
                className="h-11 border-white/10 bg-black/30 text-white"
              />
            </Field>
            <Field label="Category">
              <Select value={filters.category} onValueChange={(value) => updateFilter("category", value as SeatType)}>
                <SelectTrigger className="h-11 w-full border-white/10 bg-black/30 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>{categories.map((category) => <SelectItem key={category} value={category}>{category}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Quota">
              <Select value={filters.quota} onValueChange={(value) => updateFilter("quota", value as Quota | "ANY")}>
                <SelectTrigger className="h-11 w-full border-white/10 bg-black/30 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>{quotas.map((quota) => <SelectItem key={quota} value={quota}>{quota === "ANY" ? "Any quota" : quota}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Gender pool">
              <Select value={filters.gender} onValueChange={(value) => updateFilter("gender", value as Gender | "ANY")}>
                <SelectTrigger className="h-11 w-full border-white/10 bg-black/30 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>{genders.map((gender) => <SelectItem key={gender} value={gender}>{gender === "ANY" ? "Any gender pool" : gender}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Branch">
              <Select value={filters.branch} onValueChange={(value) => updateFilter("branch", value ?? "ALL")}>
                <SelectTrigger className="h-11 w-full border-white/10 bg-black/30 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value="ALL">All branches</SelectItem>
                  {allBranches.map((branch) => <SelectItem key={branch} value={branch}>{branch}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="College type">
              <Select value={filters.collegeType} onValueChange={(value) => updateFilter("collegeType", value as CollegeType | "ALL")}>
                <SelectTrigger className="h-11 w-full border-white/10 bg-black/30 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>{collegeTypes.map((type) => <SelectItem key={type} value={type}>{type === "ALL" ? "All colleges" : type}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Max fees / year">
              <Select value={String(filters.maxFees)} onValueChange={(value) => updateFilter("maxFees", Number(value))}>
                <SelectTrigger className="h-11 w-full border-white/10 bg-black/30 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>{[1, 2, 3, 5, 8, 12].map((fee) => <SelectItem key={fee} value={String(fee)}>Under ₹{fee}L</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Min avg package">
              <Select value={String(filters.minPackage)} onValueChange={(value) => updateFilter("minPackage", Number(value))}>
                <SelectTrigger className="h-11 w-full border-white/10 bg-black/30 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>{[0, 8, 12, 16, 20].map((pkg) => <SelectItem key={pkg} value={String(pkg)}>{pkg ? `₹${pkg}L+` : "Any package"}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
              <Input
                value={filters.search}
                onChange={(event) => updateFilter("search", event.target.value)}
                placeholder="Search college, city, state or type"
                className="h-11 border-white/10 bg-black/30 pl-10 text-white"
              />
            </div>
            <Button
              variant="outline"
              className="h-11 border-white/10 bg-white/5 text-white hover:bg-white/10"
              onClick={() => setFilters(defaultFilters)}
            >
              Reset filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/10">
            <div>
              <CardTitle>Recommended options</CardTitle>
              <p className="mt-1 text-sm text-zinc-400">{predictions.length.toLocaleString("en-IN")} branch-seat matches found</p>
            </div>
            <Badge className="bg-indigo-400/15 text-indigo-200">Rank {filters.rank.toLocaleString("en-IN")}</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/10">
              {paginated.map((prediction) => (
                <article key={`${prediction.college.id}-${prediction.cutoff.branch}-${prediction.cutoff.quota}-${prediction.cutoff.seatType}-${prediction.cutoff.gender}`} className="grid gap-4 p-4 transition hover:bg-white/[0.04] lg:grid-cols-[1fr_auto]">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={badgeClass(prediction.college.type)}>{prediction.college.type}</Badge>
                      <Badge className={chanceClass(prediction.chance)}>{prediction.chance}</Badge>
                      <span className="text-xs text-zinc-500">{prediction.cutoff.quota} • {prediction.cutoff.seatType} • {prediction.cutoff.gender}</span>
                    </div>
                    <div>
                      <button onClick={() => setSelectedCollege(prediction.college)} className="text-left text-lg font-semibold text-white hover:text-indigo-200">
                        {prediction.college.name}
                      </button>
                      <p className="text-sm text-zinc-400">{prediction.cutoff.branch}</p>
                    </div>
                    <div className="grid gap-3 text-sm text-zinc-300 sm:grid-cols-4">
                      <MiniStat label="Closing rank" value={prediction.cutoff.closingRank?.toLocaleString("en-IN") ?? "Entrance"} />
                      <MiniStat label="Rank gap" value={prediction.rankGap === null ? "Exam" : prediction.rankGap.toLocaleString("en-IN")} />
                      <MiniStat label="Avg package" value={`₹${prediction.college.averagePackageLpa}L`} />
                      <MiniStat label="Fees" value={`₹${prediction.college.feesLpa}L`} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 lg:flex-col lg:items-end lg:justify-center">
                    <Button size="sm" variant="outline" className="border-white/10 bg-white/5 text-white" onClick={() => toggleBookmark(prediction.college.id)}>
                      <Bookmark className={bookmarks.includes(prediction.college.id) ? "fill-current" : ""} />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/10 bg-white/5 text-white" onClick={() => toggleCompare(prediction.college.id)}>
                      Compare
                    </Button>
                  </div>
                </article>
              ))}
            </div>

            {predictions.length === 0 && (
              <div className="p-10 text-center text-zinc-400">
                No matches yet. Try relaxing fees, package, branch or quota filters.
              </div>
            )}

            <div className="flex items-center justify-between border-t border-white/10 p-4 text-sm text-zinc-400">
              <span>Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</Button>
                <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <aside className="space-y-6">
          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="size-4" /> Analytics</CardTitle></CardHeader>
            <CardContent className="h-72">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.byType}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
                    <XAxis dataKey="type" stroke="#a1a1aa" fontSize={12} />
                    <YAxis stroke="#a1a1aa" fontSize={12} />
                    <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8 }} />
                    <Bar dataKey="colleges" fill="#818cf8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full animate-pulse rounded-xl bg-white/[0.04]" />
              )}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader><CardTitle>Compare colleges</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {comparedColleges.length === 0 && <p className="text-sm text-zinc-400">Add up to 3 colleges from recommendations.</p>}
              {comparedColleges.map((college) => (
                <div key={college.id} className="rounded-lg border border-white/10 bg-black/20 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{college.name}</p>
                    <button className="text-xs text-zinc-500 hover:text-white" onClick={() => toggleCompare(college.id)}>Remove</button>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-zinc-400">
                    <span>₹{college.averagePackageLpa}L avg</span>
                    <span>₹{college.feesLpa}L fees</span>
                    <span>NIRF {college.nirfRank ?? "NA"}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader><CardTitle>Saved colleges</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {bookmarkedColleges.length === 0 && <p className="text-sm text-zinc-400">Saved colleges appear here and persist in this browser.</p>}
              {bookmarkedColleges.slice(0, 5).map((college) => (
                <button key={college.id} onClick={() => setSelectedCollege(college)} className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-black/20 p-3 text-left hover:bg-white/5">
                  <span>{college.name}</span>
                  <Star className="size-4 fill-amber-300 text-amber-300" />
                </button>
              ))}
            </CardContent>
          </Card>
        </aside>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {allStates.slice(0, 9).map((state) => (
          <Card key={state} className="border-white/10 bg-white/[0.03] text-white">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium">{state}</p>
                <p className="text-xs text-zinc-500">{colleges.filter((college) => college.state === state).length} colleges indexed</p>
              </div>
              <MapPin className="size-4 text-indigo-300" />
            </CardContent>
          </Card>
        ))}
      </section>

      <CollegeDialog college={selectedCollege} onOpenChange={(open) => !open && setSelectedCollege(null)} />
    </div>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <Card className="border-white/10 bg-white/[0.03] text-white">
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
        </div>
        <div className="rounded-lg bg-indigo-400/10 p-2 text-indigo-200 [&_svg]:size-5">{icon}</div>
      </CardContent>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</span>
      {children}
    </label>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-3">
      <p className="text-[11px] uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 font-medium text-white">{value}</p>
    </div>
  );
}

function CollegeDialog({ college, onOpenChange }: { college: College | null; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={Boolean(college)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto border-white/10 bg-zinc-950 text-white sm:max-w-3xl">
        {college && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">{college.fullName}</DialogTitle>
              <DialogDescription className="flex flex-wrap items-center gap-2 text-zinc-400">
                <Badge className={badgeClass(college.type)}>{college.type}</Badge>
                <span>{college.city}, {college.state}</span>
                <a href={college.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-indigo-200">
                  Official site <ExternalLink className="size-3" />
                </a>
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 md:grid-cols-4">
              <MiniStat label="NIRF" value={college.nirfRank ? `#${college.nirfRank}` : "NA"} />
              <MiniStat label="Average package" value={`₹${college.averagePackageLpa}L`} />
              <MiniStat label="Highest package" value={`₹${college.highestPackageLpa}L`} />
              <MiniStat label="Fees / year" value={`₹${college.feesLpa}L`} />
            </div>
            <div className="rounded-xl border border-white/10">
              <div className="grid grid-cols-4 border-b border-white/10 p-3 text-xs uppercase tracking-wide text-zinc-500">
                <span>Branch</span><span>Quota</span><span>Seat</span><span>Closing rank</span>
              </div>
              {college.cutoffs.slice(0, 10).map((cutoff) => (
                <div key={`${cutoff.branch}-${cutoff.quota}-${cutoff.seatType}-${cutoff.gender}`} className="grid grid-cols-4 gap-2 border-b border-white/5 p-3 text-sm last:border-0">
                  <span>{cutoff.branch}</span>
                  <span>{cutoff.quota}</span>
                  <span>{cutoff.seatType}</span>
                  <span>{cutoff.closingRank?.toLocaleString("en-IN") ?? "Entrance"}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function badgeClass(type: CollegeType) {
  const classes: Record<CollegeType, string> = {
    NIT: "border-indigo-400/30 bg-indigo-400/10 text-indigo-200",
    IIIT: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
    GFTI: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    State: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    Private: "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-200",
  };
  return classes[type];
}

function chanceClass(chance: string) {
  if (chance === "Safe") return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  if (chance === "Moderate") return "border-amber-400/30 bg-amber-400/10 text-amber-200";
  if (chance === "Exam-based") return "border-sky-400/30 bg-sky-400/10 text-sky-200";
  return "border-rose-400/30 bg-rose-400/10 text-rose-200";
}
