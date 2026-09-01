import { Overline } from "@/components/Brand"
import { Button } from "@/components/ui/button"

// The clubhouse location. Training sessions themselves are circulated to members —
// this section just tells prospective runners where to find us.
const MAPS_QUERY = "D08 VK09, Ireland"

export default function TrainWithUs() {
  return (
    <section id="train" className="section-pad">
      <div
        className="wrap grid items-center gap-[clamp(2rem,5vw,4.5rem)] md:grid-cols-[0.85fr_1.15fr]"
        data-reveal
      >
        <div>
          <Overline>01 — Train with us</Overline>
          <h2 className="display-2 mt-4">Find us in the Phoenix Park</h2>
          <p className="mt-5 text-lg text-muted-foreground">
            The clubhouse is at the Park Gate Street end of the Phoenix Park. As you enter the park
            the clubhouse is on the left &mdash; the entrance is directly opposite Dublin Zoo, and
            free parking is available.
          </p>
          <p className="mt-4 text-lg text-muted-foreground">
            New runners are always welcome. Come down, say hello, and a coach will point you to the
            right group.
          </p>
          <Button asChild variant="link" className="mt-6 px-0">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAPS_QUERY)}`}
              target="_blank"
              rel="noreferrer"
            >
              Get directions →
            </a>
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border border-border shadow-sm">
          <iframe
            title="Civil Service Harriers clubhouse — Phoenix Park, Dublin"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(MAPS_QUERY)}&z=15&output=embed`}
            className="block h-80 w-full sm:h-110"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  )
}
