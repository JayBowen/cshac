import { Button } from "@/components/ui/button"
import { asset } from "@/lib/asset"

export default function Hero() {
  return (
    <section className="relative flex items-end overflow-hidden bg-accent-deep text-white h-[150vw] sm:h-auto sm:min-h-[66.6667vw] xl:min-h-[min(92vh,900px)]">
      {/* Art-directed hero — three tiers:
          - < 640px   : tall two-runner portrait (h-[150vw] = 2:3, no crop)
          - 640–1279  : mid landscape group-run shot (min-h 66.6667vw = 3:2; only grass margins
                        trim on the narrowest widths, runners always stay in frame)
          - >= 1280px : full club group photo (tall hero, min-height) */}
      {/* TODO(launch): /hero-mid.jpg is a PLACEHOLDER (a copy of the group photo). Replace it with the
          clean, licensed 7-runner running shot — the version supplied was a watermarked FOTOP proof and
          can't ship. Keep it ~3:2, or adjust sm:min-h-[66.6667vw] if the real crop differs. */}
      {/* TODO(polish): below 640px the portrait is locked to 2:3 (h-[150vw]), so a wide-but-short
          window under 640px gets a very tall, scrolling hero. Optional: add an orientation query. */}
      {/* TODO(polish): each source is a single file per tier; consider srcset variants to trim the LCP. */}
      <picture>
        <source media="(min-width: 1280px)" srcSet={asset("hero-group.jpg")} />
        <source media="(min-width: 640px)" srcSet={asset("hero-mid.jpg")} />
        <img
          src={asset("hero-portrait.jpg")}
          alt="Civil Service Harriers members running in the Phoenix Park"
          className="absolute inset-0 h-full w-full object-cover object-[center_30%] xl:object-[center_42%]"
        />
      </picture>
      <div className="absolute inset-0 hero-scrim" />

      <div className="wrap relative pb-[clamp(3.5rem,9vh,6rem)] pt-[clamp(3rem,10vh,7rem)]">
        <img
          src={asset("crest.png")}
          alt="Civil Service Harriers crest"
          className="mb-6 hidden size-16 object-contain crest-ring sm:block"
        />
        <p className="hero-text inline-flex items-center gap-3 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-white/90">
          <span className="h-px w-6 bg-white/60" />
          Phoenix Park, Dublin · Est. 1867
        </p>

        <h1 className="display-1 hero-text mt-5 max-w-[15ch] font-serif">
          Ireland&rsquo;s <em className="italic">oldest</em> athletic club.
        </h1>

        <p className="hero-text mt-6 max-w-[46ch] text-lg text-white/90">
          Founded in 1867 and still running out of the Phoenix Park — every week, every pace, every
          age.
        </p>

        <div className="mt-9 flex flex-wrap gap-4">
          <Button asChild variant="onDark" size="lg">
            <a href="#join">Join the club</a>
          </Button>
          <Button asChild variant="outlineLight" size="lg">
            <a href="#about">Our story</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
