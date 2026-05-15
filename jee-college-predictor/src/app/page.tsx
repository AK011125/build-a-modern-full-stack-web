import PredictorForm from "@/components/predictor/PredictorForm";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAnalytics } from "@/lib/predictor";

export default function Home() {
  const analytics = getAnalytics();

  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,.24),transparent_35%),radial-gradient(circle_at_top_right,rgba(20,184,166,.16),transparent_30%)]">
        <div className="container mx-auto grid gap-12 px-6 py-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-20">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-indigo-300/20 bg-indigo-300/10 px-3 py-1 text-sm text-indigo-100">
              JoSAA/CSAB-ready counselling dashboard
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              JEE College Predictor for serious B.Tech counselling
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              Explore NITs, IIITs, GFTIs, state universities and top private colleges with quota-aware cutoffs,
              fees, placements, analytics, bookmarks and comparison tools.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="bg-white text-black hover:bg-zinc-200">
                Start Prediction
              </Button>

              <Button variant="outline" size="lg" className="border-white/15 bg-white/5 text-white hover:bg-white/10">
                {analytics.totalColleges}+ Colleges Indexed
              </Button>
            </div>

            <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3 text-sm text-zinc-400">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <span className="block text-2xl font-semibold text-white">{analytics.totalCutoffs.toLocaleString("en-IN")}</span>
                cutoff rows
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <span className="block text-2xl font-semibold text-white">{analytics.branches}</span>
                branches
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <span className="block text-2xl font-semibold text-white">5</span>
                college groups
              </div>
            </div>
          </div>

          <Card className="overflow-hidden border-white/10 bg-zinc-950/70 shadow-2xl shadow-indigo-950/40">
            <CardContent className="p-0">
              <Image
                src="/hero-counselling-dashboard.png"
                alt="JEE counselling dashboard preview"
                width={1200}
                height={700}
                className="w-full h-auto"
                priority
              />
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="container mx-auto px-6 py-12">
        <PredictorForm />
      </section>
    </main>
  );
}
