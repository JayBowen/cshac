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
              href="https://www.google.com/maps/place/Civil+Service+Harriers+A.C./@53.351207,-6.3098865,17z/data=!3m1!4b1!4m6!3m5!1s0x48670c4c58146aed:0x97b1c35e8577f115!8m2!3d53.3512038!4d-6.3073116!16s%2Fg%2F11gzbhtfr!5m1!1e4?entry=ttu&g_ep=EgoyMDI2MDgzMC4wIKXMDSoASAFQAw%3D%3D"
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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2381.555819342587!2d-6.3098865229091645!3d53.351206974359314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48670c4c58146aed%3A0x97b1c35e8577f115!2sCivil%20Service%20Harriers%20A.C.!5e0!3m2!1sen!2sie!4v1788296096691!5m2!1sen!2sie"
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

