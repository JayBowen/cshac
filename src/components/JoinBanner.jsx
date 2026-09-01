import { Button } from "@/components/ui/button"
import { JOIN_URL } from "@/lib/links"

export default function JoinBanner() {
  return (
    <section id="join" className="section-pad bg-primary text-white">
      <div className="wrap mx-auto max-w-[720px] text-center" data-reveal>
        <h2 className="display-3 font-serif">Run with us.</h2>
        {/* TODO(launch): confirm the real annual membership fee — "€120 a year" is unverified — or remove the sentence. */}
        <p className="mt-4 text-lg text-white/85">
          Your first session is free. Come down to the Park, meet the group, and see if we&rsquo;re
          your kind of club. Membership is €120 a year.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild variant="onDark" size="lg">
            <a href={JOIN_URL} target="_blank" rel="noopener noreferrer">
              Become a member
            </a>
          </Button>
          <Button asChild variant="outlineLight" size="lg">
            <a href="#train">Find the clubhouse</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
