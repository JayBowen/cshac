import { Link } from "react-router-dom"
import { Wordmark } from "@/components/Brand"
import { asset } from "@/lib/asset"

// Links with an `href` are external (open in a new tab); links with a `to` are live
// (react-router routes or /#section anchors); links with neither are placeholders
// and render as a dead href="#".
const COLUMNS = [
  {
    title: "The Club",
    links: [
      { label: "About", to: "/#about" },
      { label: "History", to: "/history" },
      { label: "Gallery", to: "/gallery" },
    ],
  },

  {
    title: "Get involved",
    links: [
      { label: "Join the club", to: "/#join" },
      {
        label: "Club kit",
        href: "https://www.jfsports.ie/product-category/club-shop/civil-service-harriers-ac/",
      },

      {
        label: "Contact us",
        href: "mailto:cshnewmembers@gmail.com"
      }
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-foreground text-white/70">
      <div className="wrap py-[clamp(3.5rem,7vw,5rem)]">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Wordmark onDark />
            <p className="mt-5 max-w-[34ch] text-sm text-white/60">
              Founded 1867. Training from the clubhouse in the Phoenix Park, Dublin 8 — all paces,
              all ages, all welcome.
            </p>
            <div className="mt-5 flex gap-3">
              <Social label="Instagram">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </Social>
              <Social label="Strava" fill>
                <path d="M10.7 2 4.5 14.4h3.7L10.7 9.5l2.5 4.9h3.6L10.7 2Zm2.6 12.4 1.7 3.3 1.7-3.3H19l-3.4 6.6-3.4-6.6h1.1Z" />
              </Social>
              <Social label="Facebook" fill>
                <path d="M14.5 8.5V7c0-.9.2-1.4 1.5-1.4h1.6V2.4c-.4-.1-1.4-.2-2.6-.2-2.6 0-4.2 1.6-4.2 4.4v1.9H8v3.4h2.8V22h3.5v-9.9h2.7l.4-3.4h-2.9Z" />
              </Social>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-white">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.href ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-white"
                      >
                        {l.label}
                      </a>
                    ) : l.to ? (
                      <Link to={l.to} className="transition-colors hover:text-white">
                        {l.label}
                      </Link>
                    ) : (
                      // TODO(launch): placeholder — no destination yet.
                      <a href="#" className="transition-colors hover:text-white">
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6 text-[0.82rem] text-white/55">
          <span className="font-slab uppercase tracking-[0.14em] text-white/70">Est. 1867</span>
          <div className="flex flex-wrap items-center gap-5">
            <a
              href={asset("docs/privacy-policy.pdf")}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Privacy Policy
            </a>
            <a
              href={asset("docs/privacy-statement.pdf")}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Privacy Statement
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function Social({ label, children, fill = false }) {
  return (
    // TODO(launch): replace href="#" with the club's real Instagram / Strava / Facebook URLs.
    <a
      href="#"
      aria-label={label}
      className="grid size-9 place-items-center rounded-full border border-white/20 transition-colors hover:border-primary hover:bg-primary"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-4"
        fill={fill ? "currentColor" : "none"}
        stroke={fill ? "none" : "currentColor"}
        strokeWidth="1.8"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </a>
  )
}
