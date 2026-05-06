import PredictorForm from "@/components/predictor/PredictorForm";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="container mx-auto px-6 py-20">
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              JEE College Predictor
            </h1>

            <p className="mt-6 text-lg text-gray-300">
              Predict the best colleges and branches based on your
              JEE rank, category, home state and percentile.
            </p>

            <div className="flex gap-4 mt-8">
              <Button size="lg">
                Start Prediction
              </Button>

              <Button variant="outline" size="lg">
                Explore Colleges
              </Button>
            </div>
          </div>

          <Card className="overflow-hidden border-none bg-zinc-900">
            <CardContent className="p-0">
              <Image
                src="/hero-counselling-dashboard.png"
                alt="Dashboard"
                width={1200}
                height={700}
                className="w-full h-auto"
              />
            </CardContent>
          </Card>

        </div>

      </section>
      <section className="container mx-auto px-6 pb-20">
        <PredictorForm />
      </section>
    </main>
  );
}