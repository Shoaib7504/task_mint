import {
  ShieldCheck,
  Scale,
  Eye,
  HeartHandshake,
} from "lucide-react";

const trustFeatures = [
  [ShieldCheck, "Escrow payments", "Funds are held securely until work is verified and approved."],
  [Scale, "Fair dispute resolution", "Neutral reviews protect both workers and buyers."],
  [Eye, "Transparent ratings", "Every rating is public and tied to a real, completed task."],
  [HeartHandshake, "Community standards", "Clear guidelines keep the marketplace respectful and productive."],
];

export default function TrustSection() {
  return (
    <section id="trust" className="w-full bg-ink text-ink-foreground scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <span className="eyebrow dark">Built on trust</span>
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl md:text-4xl">
              A better way to get small things done.
            </h2>
            <p className="mt-3 text-sm text-ink-muted sm:text-base">
              Purpose-built protections for workers and buyers.
            </p>
          </div>

          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            {trustFeatures.map(([Icon, title, text]) => (
              <div className="dark-feature" key={String(title)}>
                <Icon className="size-5 text-success shrink-0" />
                <h3 className="text-base sm:text-lg">{String(title)}</h3>
                <p className="text-xs sm:text-sm">{String(text)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
