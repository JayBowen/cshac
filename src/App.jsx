import { useEffect } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Home from "@/pages/Home"
import History from "@/pages/History"
import Gallery from "@/pages/Gallery"

// Handles scroll position on navigation:
//  - a hash (e.g. /#train) scrolls to that section, waiting a frame for the
//    target page to mount first;
//  - a plain route change jumps to the top instantly (no long smooth scroll
//    up from the bottom of a page).
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      // The target may belong to a page that is mounting this same tick, so
      // retry on the next frame if it isn't in the DOM yet.
      const scrollToTarget = () => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: "smooth" })
      }
      if (document.getElementById(id)) scrollToTarget()
      else requestAnimationFrame(scrollToTarget)
      return
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [pathname, hash])

  return null
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
