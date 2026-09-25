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
          <h2 className="mt-5 text-4xl">
            See what your spare time could earn.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Adjust your weekly task time for a simple estimate.
          </p>

          <div className="mt-9">
            <div className="flex justify-between text-sm font-semibold">
              <span>Hours per week</span>
              <span>{hours[0]} hours</span>
            </div>
            <Slider
              value={hours}
              onValueChange={setHours}
              min={1}
              max={30}
              step={1}
              className="mt-5"
            />
            <div className="mt-3 flex justify-between text-xs text-muted-foreground">
              <span>1 hour</span>
              <span>30 hours</span>
            </div>
          </div>
        </div>

        <div className="estimate">
          <span>Estimated monthly earnings</span>
          <strong>${monthly.toFixed(0)}</strong>
          <small>≈ {(monthly * 10).toFixed(0)} coins</small>
          <Button size="lg" asChild>
            <Link href="/register">
              Start earning <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
