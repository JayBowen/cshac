import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import Masonry from "react-masonry-css"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import PageHeader from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { galleryAsset } from "@/lib/galleryAsset"
import { listGalleryImages } from "@/lib/galleryList"
import { useScrollReveal } from "@/lib/useScrollReveal"

// Matches the site header's height, so the sticky tab bar sits flush against
// it rather than floating below or hiding under it. Shared between the
// sticky bar's own CSS and the tab-switch scroll math below — keep both in
// sync if the header height ever changes.
const STICKY_TOP = 74

// Keeps a per-tile skeleton up until its own image has actually decoded, rather
// than swapping in a collapsed/zero-height <img> the moment the listing loads —
// we don't know each photo's real dimensions ahead of time (no manifest), so
// there's nothing to size a placeholder against otherwise. The pre-load <img>
// stays absolutely positioned (not display:none) rather than hidden outright —
// loading="lazy" decides whether to fetch based on the element's position in
// the layout, and an element with no box at all never gets close enough to
// the viewport to trigger that.
function GalleryThumb({ src, onClick }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="View larger photo"
      className={`group relative block w-full cursor-zoom-in overflow-hidden ${loaded ? "" : "aspect-4/3"}`}
    >
      {!loaded && (
        <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-foreground/10" />
      )}
      <img
        src={src}
        alt=""
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={
          loaded
            ? "h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            : "absolute inset-0 h-full w-full opacity-0"
        }
      />
    </button>
  )
}

// Photos aren't bundled with the app, and there's no manifest to maintain either —
// the gallery bucket is listed directly at runtime (see lib/galleryList.js), so
// uploading new photos to S3 is the only step needed to update the live site.
//
// Years are tabs rather than one long scroll: an earlier scroll-to-year-anchor
// version broke because tiles above the target were still mid-load (each one
// grows from a small skeleton to its real size in GalleryThumb), which could
// drift the target hundreds of px away right after landing on it. Tabs sidestep
// that entirely — switching years never scrolls past other years' content — and
// Radix only mounts the active tab's panel by default, so at most one year's
// photos are ever in the DOM at once.
export default function Gallery() {
  const [images, setImages] = useState(null) // null = still loading
  const [failed, setFailed] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null)
  const [activeYear, setActiveYear] = useState(null)
  const stickyBarRef = useRef(null)
  const contentAnchorRef = useRef(null)

  const handleYearChange = (v) => {
    setActiveYear(Number(v))
    // Land on the new tab's content from the top, not wherever you happened to
    // be scrolled to in the previous tab — otherwise switching from deep in a
    // 350-photo year to a 3-photo year could leave you scrolled past its end.
    //
    // Measured off a plain (non-sticky) marker placed right after the sticky
    // bar, not the sticky bar itself — confirmed via testing that offsetTop on
    // a sticky element stops reflecting its natural document position once
    // it's actually stuck, instead tracking current scroll position. The bar's
    // own height is still safe to read directly (sticky only overrides where
    // it *renders*, not its size), so contentEl.offsetTop - barHeight gives
    // the bar's natural top, and subtracting STICKY_TOP on top of that lands
    // the content flush under wherever the bar ends up actually pinned.
    // Deliberately not a flat "-74": the Tabs root's own flex `gap-2` sits
    // between the bar and this marker too, and baking that (or the grid's own
    // pt-6) into a second hardcoded constant would silently drift out of sync
    // the moment either spacing value changes — confirmed via Playwright that
    // doing so left the first row's top either cropped under the bar or
    // floating in a gap below it, depending on which constant was off.
    const contentEl = contentAnchorRef.current
    const barEl = stickyBarRef.current
    if (contentEl && barEl) {
      const barHeight = barEl.getBoundingClientRect().height
      window.scrollTo({ top: contentEl.offsetTop - barHeight - STICKY_TOP - 24, behavior: "smooth" })
    }
  }

  useEffect(() => {
    listGalleryImages()
      .then((data) => {
        setImages(data)
        const years = [...new Set(data.map((img) => img.year))].sort((a, b) => b - a)
        setActiveYear(years[0] ?? null)
      })
      .catch((err) => {
        console.error(err)
        setFailed(true)
      })
  }, [])

  useScrollReveal([images, activeYear])

  // Newest year first, then newest upload first within a year — Google Photos-style.
  const sortedImages = images
    ? [...images].sort(
      (a, b) => b.year - a.year || new Date(b.lastModified) - new Date(a.lastModified)
    )
    : []

  const sections = []
  let globalIndex = 0
  for (const img of sortedImages) {
    const entry = { img, globalIndex: globalIndex++ }
    const current = sections[sections.length - 1]
    if (current?.year === img.year) current.items.push(entry)
    else sections.push({ year: img.year, items: [entry] })
  }

  const slides = sortedImages.map((img) => ({ src: galleryAsset(img.full), alt: "" }))

  // Matches the site's sm (640px) / lg (1024px) breakpoints. react-masonry-css assigns
  // items to columns round-robin and never reassigns them, unlike CSS `columns`, which
  // rebalances (and reshuffles on-screen) every time an image's real height resolves.
  const breakpointCols = { default: 3, 1023: 2, 639: 1 }

  // Just one row (matching the default 3-column breakpoint), not a whole fake
  // grid — measured via Playwright that the real first tab can be anywhere from
  // a handful of photos to ~350 for the busiest real year, so no guessed block
  // *count* is ever right. Each block uses aspect-4/3, the same ratio
  // GalleryThumb falls back to before its own image loads, rather than a
  // guessed pixel height: measured via Playwright that real gallery photos are
  // reliably ~4:3 (phone camera default) in one orientation or the other, so
  // this shape already matches almost every real photo almost exactly — the
  // guessed-height version that preceded this was measuring a *bigger* jump
  // than swapping straight to GalleryThumb's own placeholder would.
  const SKELETON_BLOCK_COUNT = 3

  return (
    <>
      <PageHeader
        overline="The club in photos"
        title="Faces, races and Sunday mornings in the Park."
        intro="A few pictures of the club out training and racing. We'll keep adding to this as members send more in."
      />

      <section className="section-pad">
        {failed ? (
          <p className="wrap text-center text-muted-foreground">
            Couldn&rsquo;t load the gallery right now — try again shortly.
          </p>
        ) : images === null ? (
          <div>
            {/* Same sticky-bar-plus-rule shape as the loaded tab bar, so only the
                year labels and photos pop in once loaded — the layout doesn't move. */}
            <div
              className="sticky z-10 border-b border-border bg-background/95 backdrop-blur-sm"
              style={{ top: STICKY_TOP }}
            >
              <div className="wrap py-4">
                <div
                  aria-hidden="true"
                  className="inline-flex h-11 items-center gap-1 rounded-full bg-muted p-1"
                >
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-[75px] animate-pulse rounded-full bg-foreground/10" />
                  ))}
                </div>
              </div>
            </div>

            <div className="wrap pb-12 pt-6">
              <Masonry
                breakpointCols={breakpointCols}
                className="flex gap-5"
                columnClassName="flex flex-col gap-5"
              >
                {Array.from({ length: SKELETON_BLOCK_COUNT }, (_, i) => (
                  <div
                    key={i}
                    aria-hidden="true"
                    className="aspect-4/3 animate-pulse rounded-xl bg-foreground/10"
                  />
                ))}
              </Masonry>
            </div>
          </div>
        ) : images.length === 0 ? (
          <p className="wrap text-center text-muted-foreground">No photos yet — check back soon.</p>
        ) : (
          <Tabs value={String(activeYear)} onValueChange={handleYearChange}>
            <div
              ref={stickyBarRef}
              className="sticky z-10 border-b border-border bg-background/95 backdrop-blur-sm"
              style={{ top: STICKY_TOP }}
            >
              {/* overflow-x-auto: on narrow screens a full year range won't fit in
                  one row, so the tab strip scrolls horizontally rather than wrapping
                  (wrapped tabs stop looking like tabs). The gradient hints there's
                  more to scroll to — confirmed on a 375px viewport that the tab strip
                  is genuinely scrollable but gave no visual sign of it otherwise. */}
              <div className="relative">
                <div className="wrap overflow-x-auto py-4">
                  <TabsList>
                    {sections.map((section) => (
                      <TabsTrigger key={section.year} value={String(section.year)}>
                        {section.year}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-linear-to-l from-background/95 to-transparent"
                />
              </div>
            </div>
            {sections.map((section) => (
              <TabsContent key={section.year} value={String(section.year)}>
                <div className="wrap pb-12 pt-6">
                  {/* Only one year's TabsContent is ever mounted at a time, so this
                      ref lands on whichever is currently active — reading it before
                      React swaps to the *new* tab is fine, since every year shares
                      this exact wrapper (same padding), so its position is the same
                      regardless of which one is mounted. Placed inside the padded
                      wrapper itself, right before Masonry, so there's no additional
                      gap or padding left unaccounted for between this marker and the
                      real first row — confirmed via Playwright that measuring from
                      outside this wrapper (even one flex-gap-2 step above) left a
                      32px gap (the gap plus this div's own pt-6) between the sticky
                      bar and the first row after switching tabs. */}
                  <div ref={contentAnchorRef} aria-hidden="true" />
                  <Masonry
                    breakpointCols={breakpointCols}
                    className="flex gap-5"
                    columnClassName="flex flex-col gap-5"
                  >
                    {section.items.map(({ img, globalIndex: gi }) => (
                      <figure
                        key={img.thumb}
                        data-reveal
                        className="overflow-hidden rounded-xl border border-border bg-card"
                      >
                        <GalleryThumb
                          src={galleryAsset(img.thumb)}
                          onClick={() => setActiveIndex(gi)}
                        />
                      </figure>
                    ))}
                  </Masonry>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}

        <Lightbox
          open={activeIndex !== null}
          close={() => setActiveIndex(null)}
          slides={slides}
          index={activeIndex ?? 0}
          on={{ view: ({ index }) => setActiveIndex(index) }}
          styles={{ container: { backgroundColor: "rgba(0, 0, 0, .85)" } }}
          controller={{ closeOnBackdropClick: true }}
        />

        <div className="wrap flex flex-wrap items-center gap-4 border-t border-border pt-10" data-reveal>
          <p className="mr-auto max-w-[42ch] text-muted-foreground">
            Got photos from a race or a session? Send them our way and we&rsquo;ll add them here.
          </p>
          <Button asChild variant="outline">
            <Link to="/history">Read our history</Link>
          </Button>
          <Button asChild>
            <Link to="/#join">Join the club</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
