import { useEffect } from "react"

// Reveals [data-reveal] elements as they scroll into view. Called once per page
// so it re-observes the elements each route mounts (pages mount/unmount on
// navigation). Honours prefers-reduced-motion via the CSS in index.css.
// Pass `deps` when a page renders [data-reveal] elements after an async fetch
// (e.g. Gallery), so the DOM gets re-scanned once that content actually exists.
export function useScrollReveal(deps = []) {
  useEffect(() => {
    let io
    // Wait a frame before measuring: components like react-masonry-css correct
    // their own column layout asynchronously right after mount (a second React
    // update, not just paint), and observing elements before that settles means
    // IntersectionObserver checks their pre-correction position — confirmed via
    // testing that it doesn't reliably re-check once Masonry's own reflow moves
    // them into view afterward, leaving them stuck at opacity 0 forever.
    const raf = requestAnimationFrame(() => {
      const els = document.querySelectorAll("[data-reveal]:not(.is-visible)")
      io = new IntersectionObserver(
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
    })
    return () => {
      cancelAnimationFrame(raf)
      io?.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
