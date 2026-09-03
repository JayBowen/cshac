import { useEffect } from "react"

// Reveals [data-reveal] elements as they scroll into view. Called once per page
// so it re-observes the elements each route mounts (pages mount/unmount on
// navigation). Honours prefers-reduced-motion via the CSS in index.css.
// Pass `deps` when a page renders [data-reveal] elements after an async fetch
// (e.g. Gallery), so the DOM gets re-scanned once that content actually exists.
export function useScrollReveal(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]:not(.is-visible)")
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
