import { Overline } from "@/components/Brand"

const FAQS = [
  {
    q: "Is the club only for civil servants?",
    a: "A lot of people ask this — but don't worry, it's just our name. The club is open to all new members. We were formed in 1867 and named Civil Service Harriers because most of the members back then were civil servants.",
  },
  // TODO(decision): this publishes exact training times. Training plans are members-only —
  // decide whether to keep the times public here or remove them for consistency.
  {
    q: "When do you train?",
    a: "Training is at 7pm every Tuesday and Thursday, and 9am on Saturday. On Sundays, members meet at the clubhouse at 9am for a long run followed by coffee — though that one isn't a coached session.",
  },
  // TODO(launch): "Drop us an email" should be a real mailto: link (confirm the address, e.g. cshnewmembers@gmail.com) instead of plain text.
  {
    q: "When can I join?",
    a: "Any time of year. Drop us an email and we'll arrange for you to join one of our training sessions and try it out for a couple of weeks.",
  },
  {
    q: "Is the club open to all ages?",
    a: "All members must be 18 years old or over.",
  },
  {
    q: "What standard are members?",
    a: "Every standard — from elite athletes to complete beginners.",
  },
  {
    q: "How fit do I need to be?",
    a: "New members should be comfortably able to jog 5km before coming to a training session. As always, check with your doctor before starting any new exercise programme.",
  },
]

export default function Faq() {
  return (
    <section id="faq" className="section-pad bg-secondary">
      <div
        className="wrap grid gap-[clamp(2rem,5vw,4.5rem)] md:grid-cols-[0.8fr_1.2fr]"
        data-reveal
      >
        <div>
          <Overline>03 — Good to know</Overline>
          <h2 className="display-2 mt-4">Frequently asked questions</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            The things people ask most before their first run with us.
          </p>
        </div>

        <dl className="border-t border-border">
          {FAQS.map((f) => (
            <div key={f.q} className="border-b border-border py-6">
              <dt className="font-serif text-xl leading-snug">{f.q}</dt>
              <dd className="mt-2 max-w-[62ch] text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
