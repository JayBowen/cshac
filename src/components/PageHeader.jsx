import { Overline } from "@/components/Brand"

// Compact dark banner reused by the interior pages (History, Gallery) so they
// share the home hero's heritage look without repeating a full-height photo hero.
export default function PageHeader({ overline, title, intro }) {
  return (
    <section className="relative overflow-hidden bg-accent-deep text-white">
      <span
        aria-hidden="true"
        className="watermark pointer-events-none absolute -bottom-24 -right-8 select-none font-serif font-medium text-white/[0.05]"
      >
        1867
      </span>

      <div
        className="wrap relative py-[clamp(4rem,11vw,7.5rem)]"
        data-reveal
      >
        <Overline light>{overline}</Overline>
        <h1 className="display-2 mt-5 max-w-[18ch] font-serif">{title}</h1>
        {intro ? (
          <p className="mt-6 max-w-[54ch] text-lg text-white/85">{intro}</p>
        ) : null}
      </div>
    </section>
  )
}
