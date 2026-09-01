import { Overline } from "@/components/Brand"
import { Button } from "@/components/ui/button"
import { stories } from "@/data"

export default function Journal() {
  return (
    <section id="journal" className="section-pad">
      <div className="wrap" data-reveal>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-[52ch]">
            <Overline>02 — The Journal</Overline>
            <h2 className="display-2 mt-4">Stories from the club</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Race reports, member profiles and dispatches from 150 years of the archive.
            </p>
          </div>
          <Button asChild variant="link" className="px-0">
            <a href="#">All stories →</a>
          </Button>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((s) => (
            <a key={s.title} href="#" className="group flex flex-col">
              <div className="overflow-hidden rounded-lg">
                <img
                  src={s.img}
                  alt=""
                  loading="lazy"
                  className={`aspect-[4/3] w-full object-cover transition-all duration-500 group-hover:scale-[1.03] ${
                    s.archival ? "grayscale group-hover:grayscale-0" : ""
                  }`}
                />
              </div>
              <span className="mt-4 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-primary">
                {s.tag}
              </span>
              <h3 className="mt-2 font-serif text-xl leading-snug">{s.title}</h3>
              <p className="mt-2 text-muted-foreground">{s.excerpt}</p>
              <span className="mt-3 text-sm font-medium text-primary">Read →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
