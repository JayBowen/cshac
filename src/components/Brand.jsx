import { Link } from "react-router-dom"
import { asset } from "@/lib/asset"
import { cn } from "@/lib/utils"

// The club crest (public/crest.png). It's a fixed-colour maroon mark that stays true
// to brand on light surfaces; on dark/low-contrast backgrounds it gets a crisp white
// outline (.crest-ring) so the shield reads against the background.
export function Crest({ className = "", onDark = false }) {
  return (
    <img
      src={asset("crest.png")}
      alt=""
      aria-hidden="true"
      className={cn("object-contain", onDark && "crest-ring", className)}
    />
  )
}

export function Wordmark({ className = "", onDark = false }) {
  return (
    <Link to="/" className={cn("inline-flex items-center gap-2.5", className)}>
      <Crest onDark={onDark} className="size-9 shrink-0 sm:size-10" />
      <span className="leading-none">
        <span
          className={cn(
            "block font-slab text-[0.95rem] font-semibold uppercase tracking-wider sm:text-[1.02rem]",
            onDark ? "text-white" : "text-primary"
          )}
        >
          Civil Service Harriers
        </span>
        <span
          className={cn(
            "mt-1 block font-sans text-[0.56rem] uppercase tracking-[0.18em]",
            onDark ? "text-white/55" : "text-muted-foreground"
          )}
        >
          Athletic Club · Est. 1867
        </span>
      </span>
    </Link>
  )
}

export function Overline({ children, light = false, className = "" }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-3 text-[0.72rem] font-medium uppercase tracking-[0.2em]",
        light ? "text-white/85" : "text-primary",
        className
      )}
    >
      <span className={cn("h-px w-6", light ? "bg-white/60" : "bg-primary/50")} />
      {children}
    </p>
  )
}
