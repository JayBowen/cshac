import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Masonry from "react-masonry-css"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import PageHeader from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { galleryAsset } from "@/lib/galleryAsset"
import { listGalleryImages } from "@/lib/galleryList"
import { useScrollReveal } from "@/lib/useScrollReveal"

// Photos aren't bundled with the app, and there's no manifest to maintain either —
// the gallery bucket is listed directly at runtime (see lib/galleryList.js), so
// uploading new photos to S3 is the only step needed to update the live site.
export default function Gallery() {
  const [images, setImages] = useState(null) // null = still loading
  const [failed, setFailed] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null)

  useEffect(() => {
    listGalleryImages()
      .then(setImages)
      .catch((err) => {
        console.error(err)
        setFailed(true)
      })
  }, [])

  useScrollReveal([images])

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

  // Varied heights so the loading state reads as a photo grid rather than a uniform block.
  const skeletonHeights = [280, 200, 340, 240, 300, 220, 260, 320, 200, 280, 240, 300]

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
            {/* Same sticky-bar-plus-rule shape as a loaded year header, so only the
                year number and photos pop in once loaded — the layout itself doesn't move. */}
            <div className="sticky top-[74px] z-10 border-b border-border bg-background/95 backdrop-blur-sm">
              <div className="wrap py-4">
                <div aria-hidden="true" className="h-8 w-20 animate-pulse rounded-md bg-foreground/10" />
              </div>
            </div>

            <div className="wrap pb-12 pt-6">
              <Masonry
                breakpointCols={breakpointCols}
                className="flex gap-5"
                columnClassName="flex flex-col gap-5"
              >
                {skeletonHeights.map((height, i) => (
                  <div
                    key={i}
                    aria-hidden="true"
                    className="animate-pulse rounded-xl bg-foreground/10"
                    style={{ height }}
                  />
                ))}
              </Masonry>
            </div>
          </div>
        ) : images.length === 0 ? (
          <p className="wrap text-center text-muted-foreground">No photos yet — check back soon.</p>
        ) : (
          sections.map((section) => (
            <div key={section.year}>
              {/* Sticky under the 74px site header, like Google Photos' pinned month labels. */}
              <div className="sticky top-[74px] z-10 border-b border-border bg-background/95 backdrop-blur-sm">
                <div className="wrap py-4">
                  <h2 className="font-serif text-2xl text-primary">{section.year}</h2>
                </div>
              </div>

              <div className="wrap pb-12 pt-6">
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
                      <button
                        type="button"
                        onClick={() => setActiveIndex(gi)}
                        aria-label="View larger photo"
                        className="group block w-full cursor-zoom-in"
                      >
                        <img
                          src={galleryAsset(img.thumb)}
                          alt=""
                          loading="lazy"
                          className="h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        />
                      </button>
                    </figure>
                  ))}
                </Masonry>
              </div>
            </div>
          ))
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
