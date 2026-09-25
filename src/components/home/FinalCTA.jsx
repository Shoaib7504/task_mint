import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function FinalCTA() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
      <div className="final-cta">
        <span className="eyebrow dark">Your next task is waiting</span>
        <h2>Ready to turn your time into rewards?</h2>
        <p>Join thousands earning flexibly or get your next task completed.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button size="xl" variant="success" asChild>
            <Link href="/register?role=worker">Start earning</Link>
          </Button>
          <Button size="xl" variant="darkOutline" asChild>
            <Link href="/register?role=buyer">Create a task</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
