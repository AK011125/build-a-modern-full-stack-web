"use client";

import { useState } from "react";
import { colleges } from "@/lib/predictor";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PredictorForm() {
  const [rank, setRank] = useState("");
  const [results, setResults] = useState<typeof colleges>([]);

  const handlePredict = () => {
    const userRank = Number(rank);

    const filtered = colleges.filter(
      (college) => userRank <= college.cutoff
    );

    setResults(filtered);
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 text-white">
      <CardContent className="p-6 space-y-6">

        <div>
          <h2 className="text-3xl font-bold">
            Predict Your College
          </h2>

          <p className="text-zinc-400 mt-2">
            Enter your JEE rank and get instant recommendations
          </p>
        </div>

        <div className="flex gap-4">
          <Input
            placeholder="Enter JEE Rank"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            className="bg-zinc-800 border-zinc-700"
          />

          <Button onClick={handlePredict}>
            Predict
          </Button>
        </div>

        <div className="space-y-4">
          {results.map((college, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-zinc-800 border border-zinc-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">
                    {college.name}
                  </h3>

                  <p className="text-zinc-400">
                    {college.branch}
                  </p>
                </div>

                <Badge>
                  Cutoff {college.cutoff}
                </Badge>
              </div>
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  );
}