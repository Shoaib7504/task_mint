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
    <section className="section bg-ink text-ink-foreground">
      <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
        <div>
          <span className="eyebrow dark">Built on trust</span>
          <h2 className="mt-5 text-4xl">
            A better way to get small things done.
          </h2>
          <p className="mt-4 text-ink-muted">
            Purpose-built protections for workers and buyers.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {trustFeatures.map(([Icon, title, text]) => (
            <div className="dark-feature" key={String(title)}>
              <Icon className="size-5 text-success" />
              <h3>{String(title)}</h3>
              <p>{String(text)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
