import { useEffect, useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { Wordmark } from "@/components/Brand"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// `route: true` items are their own pages and get an active underline via NavLink;
// the rest would be hash links back to sections on the home page. Home uses `end`
// so "/" only reads as active on the home page, not on every route beneath it.
const NAV = [
  { label: "Home", to: "/", route: true, end: true },
  { label: "Gallery", to: "/gallery", route: true },
  { label: "History", to: "/history", route: true },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  // Slide down to the "Run with us" (#join) section. When it's on the current page
  // (the home page) scroll to it directly for the same smooth glide as the hero
  // button; otherwise fall through to the <Link>, which routes home and lets
  // ScrollManager scroll to it once Home has mounted.
  const handleJoinClick = (e) => {
    setOpen(false)
    const el = document.getElementById("join")
    if (el) {
      e.preventDefault()
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <header
      id="top"
      className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md"
    >
      <div className="wrap flex h-[74px] items-center justify-between gap-4">
        <Wordmark />

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) =>
            n.route ? (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  cn(
                    "text-[0.92rem] font-medium transition-colors hover:text-foreground",
                    isActive ? "text-foreground" : "text-foreground/75"
                  )
                }
              >
                {n.label}
              </NavLink>
            ) : (
              <Link
                key={n.to}
                to={n.to}
                className="text-[0.92rem] font-medium text-foreground/75 transition-colors hover:text-foreground"
              >
                {n.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link to="/#join" onClick={handleJoinClick}>
              Join the club
            </Link>
          </Button>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-foreground/5 md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "absolute inset-x-0 top-full overflow-hidden border-border bg-background/95 shadow-lg backdrop-blur-md transition-[max-height] duration-300 ease-out md:hidden",
          open ? "max-h-96 border-b" : "max-h-0"
        )}
      >
        <nav className="wrap flex flex-col py-2">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="border-b border-border/60 py-3.5 text-base font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {n.label}
            </Link>
          ))}
          <Button asChild size="lg" className="mb-2 mt-4 w-full">
            <Link to="/#join" onClick={handleJoinClick}>
              Join the club
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
