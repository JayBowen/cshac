import { Link } from "react-router-dom"
import { Overline } from "@/components/Brand"
import { Button } from "@/components/ui/button"
import { stats } from "@/data"

export default function Heritage() {
  return (
    <section id="about" className="section-pad relative overflow-hidden bg-accent-deep text-white">
      <span
        aria-hidden="true"
        className="watermark pointer-events-none absolute -bottom-24 -right-8 select-none font-serif font-medium text-white/[0.05]"
      >
        1867
      </span>

      <div className="wrap relative mx-auto max-w-[900px] text-center" data-reveal>
        <div className="flex justify-center">
          <Overline light>Since 1867</Overline>
        </div>
        <h2 className="display-3 mt-5 font-serif">
          Ireland&rsquo;s oldest athletic club — and still the fastest way to fall in love with the
          Phoenix Park.
        </h2>

        <div className="mt-12 flex flex-wrap justify-center gap-[clamp(2rem,6vw,5rem)]">
          {stats.map((s) => (
            <div key={s.l}>
              <div className="font-serif text-[2.8rem] leading-none">{s.n}</div>
              <div className="mt-2 text-[0.72rem] uppercase tracking-[0.14em] text-white/70">
                {s.l}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button asChild variant="outlineLight">
            <Link to="/history">Read the club history</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
