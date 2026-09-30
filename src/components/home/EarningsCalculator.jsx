"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import { ArrowRight } from "lucide-react";

const RATE = 12; // $ per hour estimate

export default function EarningsCalculator() {
  const [hours, setHours] = useState([5]);
  const monthly = hours[0] * RATE * 4;

  return (
    <section id="earnings" className="section scroll-mt-20">
      <div className="earnings-panel">
        <div>
          <span className="eyebrow">Earnings calculator</span>
          <h2 className="mt-4 text-2xl font-bold sm:text-3xl md:text-4xl">
            See what your spare time could earn.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Adjust your weekly task time for a simple estimate.
          </p>

          <div className="mt-6 sm:mt-9">
            <div className="flex justify-between text-xs sm:text-sm font-semibold">
              <span>Hours per week</span>
              <span className="text-primary">{hours[0]} hours</span>
            </div>
            <Slider
              value={hours}
              onValueChange={setHours}
              min={1}
              max={30}
              step={1}
              className="mt-4 sm:mt-5"
            />
            <div className="mt-2.5 flex justify-between text-xs text-muted-foreground">
              <span>1 hour</span>
              <span>30 hours</span>
            </div>
          </div>
        </div>

        <div className="estimate">
          <span className="text-xs sm:text-sm">Estimated monthly earnings</span>
          <strong className="text-3xl sm:text-4xl md:text-5xl my-2">${monthly.toFixed(0)}</strong>
          <small className="mb-4 sm:mb-6">≈ {(monthly * 10).toFixed(0)} coins</small>
          <Button size="lg" className="w-full sm:w-auto" asChild>
            <Link href="/register">
              Start earning <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
