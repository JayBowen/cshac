import { useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { galleryAsset } from "@/lib/galleryAsset"

// Full-screen photo viewer for the Gallery grid. `index === null` means closed.
// Follows the same hand-rolled overlay + Escape-key pattern as Header's mobile nav.
export default function Lightbox({ images, index, onClose, onNavigate }) {
  const open = index !== null
  const dialogRef = useRef(null)
  const triggerRef = useRef(null)

  // Remember what had focus before opening, so it can be restored on close.
  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement
      dialogRef.current?.focus()
    } else {
      triggerRef.current?.focus?.()
    }
  }, [open])

  // Lock page scroll while the lightbox is up.
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") onNavigate(-1)
      if (e.key === "ArrowRight") onNavigate(1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose, onNavigate])

  if (!open) return null

  const img = images[index]

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      tabIndex={-1}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 outline-none"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 grid size-11 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X className="size-6" aria-hidden="true" />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onNavigate(-1)
            }}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:left-4"
          >
            <ChevronLeft className="size-7" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onNavigate(1)
            }}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:right-4"
          >
            <ChevronRight className="size-7" aria-hidden="true" />
          </button>
        </>
      )}

      <img
        src={galleryAsset(img.full)}
        alt=""
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
      />
    </div>
  )
}
