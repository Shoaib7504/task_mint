const steps = [
  {
    n: 1,
    title: "Sign up free",
    text: "Create your account in seconds—no fees, no commitments.",
  },
  {
    n: 2,
    title: "Pick a task",
    text: "Browse verified tasks that match your skills and interests.",
  },
  {
    n: 3,
    title: "Do the work",
    text: "Follow clear instructions and submit your proof.",
  },
  {
    n: 4,
    title: "Earn coins",
    text: "Get approved fast and watch your balance grow.",
  },
];

export default function HowItWorks() {
  return (
    <section className="section">
      <div className="section-head">
        <span className="eyebrow">Built for momentum</span>
        <h2>From spare minutes to earned rewards</h2>
        <p>A focused process with clear expectations at every step.</p>
      </div>

      <div className="relative mt-10 grid grid-cols-2 gap-5 md:mt-14 md:grid-cols-4">
        {/* connector line */}
        <div className="absolute left-[12%] right-[12%] top-7 hidden h-px bg-border md:block" />

        {steps.map((s) => (
          <div key={s.n} className="relative text-center">
            <span className="relative z-10 mx-auto grid size-14 place-items-center rounded-full border-4 border-background bg-primary font-bold text-primary-foreground shadow-brand">
              {s.n}
            </span>
            <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {s.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
