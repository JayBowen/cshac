import { useEffect } from "react"

// Reveals [data-reveal] elements as they scroll into view. Called once per page
// so it re-observes the elements each route mounts (pages mount/unmount on
// navigation). Honours prefers-reduced-motion via the CSS in index.css.
export function useScrollReveal() {
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
  }, [])
}
