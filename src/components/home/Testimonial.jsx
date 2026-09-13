import { Button } from "@/components/ui/Button";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

export default function Testimonial() {
  return (
    <section className="section pt-0">
      <div className="testimonial">
        <div>
          <div className="flex gap-1 text-warning">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star className="size-5 fill-current" key={i} />
            ))}
          </div>
          <blockquote>
            &ldquo;TaskMint gives me clear instructions and reliable approvals.
            I can fit useful work between classes and track every coin I
            earn.&rdquo;
          </blockquote>
          <p>
            <b>Leila Morgan</b> · Verified worker
          </p>
        </div>

        <div className="flex gap-2">
          <Button size="icon" variant="outline" aria-label="Previous testimonial">
            <ChevronLeft />
          </Button>
          <Button size="icon" variant="outline" aria-label="Next testimonial">
            <ChevronRight />
          </Button>
        </div>
      </div>
    </section>
  );
}
