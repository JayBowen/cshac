import { Link } from "react-router-dom"
import PageHeader from "@/components/PageHeader"
import { Overline } from "@/components/Brand"
import { Button } from "@/components/ui/button"
import { milestones, famousAthletes } from "@/data"
import { useScrollReveal } from "@/lib/useScrollReveal"

export default function History() {
  useScrollReveal()

  return (
    <>
      <PageHeader
        overline="Since 1867"
        title="Ireland's oldest athletic club."
        intro="Founded in 1867 and opened over time to all, reformed in the 1920s and still racing today — a short timeline of the club, drawn from our own archive and added to as more comes to light."
      />

      <section className="section-pad">
        <div className="wrap">
          <ol className="mx-auto max-w-[820px]">
            {milestones.map((m, i) => {
              const last = i === milestones.length - 1
              return (
                <li
                  key={`${m.year}-${i}`}
                  data-reveal
                  className="relative grid grid-cols-[auto_1fr] gap-x-6 sm:gap-x-10"
                >
                  {/* Timeline rail: claret dot + connecting line (line omitted on the last row). */}
                  <div className="flex flex-col items-center" aria-hidden="true">
                    <span className="mt-2 size-3.5 shrink-0 rounded-full bg-primary ring-4 ring-primary/15" />
                    {!last ? <span className="w-px flex-1 bg-border" /> : null}
                  </div>

                  <div className={last ? "pb-0" : "pb-12"}>
                    <div className="font-serif text-[1.9rem] leading-none text-primary">
                      {m.year}
                    </div>
                    <h2 className="mt-2.5 font-serif text-xl">{m.title}</h2>
                    <p className="mt-3 max-w-[54ch] text-muted-foreground">{m.body}</p>
                    {m.placeholder ? (
                      <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                        To follow
                      </span>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      {/* Famous alumni — see famousAthletes in data.js */}
      <section className="section-pad bg-paper-2">
        <div className="wrap">
          <div className="mx-auto max-w-[820px] text-center" data-reveal>
            <div className="flex justify-center">
              <Overline>Famous alumni</Overline>
            </div>
            <h2 className="display-3 mt-5 font-serif">The names who ran with us</h2>
            <p className="mx-auto mt-5 max-w-[52ch] text-muted-foreground">
              The club has had thousands of members down the years. These are a few of the more
              famous to have pulled on the singlet — from Olympians to the author of Dracula.
            </p>
          </div>

          <ul className="mx-auto mt-14 grid max-w-[980px] gap-5 sm:grid-cols-2">
            {famousAthletes.map((a) => (
              <li
                key={a.name}
                data-reveal
                className="rounded-xl border border-border bg-card p-6 sm:p-7"
              >
                <h3 className="font-serif text-2xl">{a.name}</h3>
                <div className="mt-1.5 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-primary">
                  {a.meta}
                </div>
                <p className="mt-3.5 text-[0.95rem] leading-relaxed text-muted-foreground">
                  {a.body}
                </p>
              </li>
            ))}
          </ul>

          <div
            className="mx-auto mt-16 flex max-w-[980px] flex-wrap items-center gap-4 border-t border-border pt-10"
            data-reveal
          >
            <p className="mr-auto max-w-[40ch] text-muted-foreground">
              Have a photograph, a result or a story from the club&rsquo;s past? We&rsquo;d love to
              add it.
            </p>
            <Button asChild variant="outline">
              <Link to="/gallery">See the gallery</Link>
            </Button>
            <Button asChild>
              <Link to="/#join">Join the club</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
