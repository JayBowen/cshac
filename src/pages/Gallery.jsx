import { Link } from "react-router-dom"
import PageHeader from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { galleryImages } from "@/data"
import { asset } from "@/lib/asset"
import { useScrollReveal } from "@/lib/useScrollReveal"

export default function Gallery() {
  useScrollReveal()

  return (
    <>
      <PageHeader
        overline="The club in photos"
        title="Faces, races and Sunday mornings in the Park."
        intro="A few pictures of the club out training and racing. We'll keep adding to this as members send more in."
      />

      <section className="section-pad">
        <div className="wrap">
          {/* CSS-columns masonry: figures flow top-to-bottom, then across, keeping
              each photo's natural aspect ratio without cropping. */}
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [column-fill:_balance]">
            {galleryImages.map((img) => (
              <figure
                key={img.src}
                data-reveal
                className="group mb-5 break-inside-avoid overflow-hidden rounded-xl border border-border bg-card"
              >
                <img
                  src={asset(img.src)}
                  alt={img.alt}
                  width={img.w}
                  height={img.h}
                  loading="lazy"
                  className="h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              </figure>
            ))}
          </div>

          <div
            className="mt-16 flex flex-wrap items-center gap-4 border-t border-border pt-10"
            data-reveal
          >
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
        </div>
      </section>
    </>
  )
}
