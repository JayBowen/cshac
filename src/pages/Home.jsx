import Hero from "@/components/Hero"
import TrainWithUs from "@/components/TrainWithUs"
import Heritage from "@/components/Heritage"
import Faq from "@/components/Faq"
import JoinBanner from "@/components/JoinBanner"
import { useScrollReveal } from "@/lib/useScrollReveal"

export default function Home() {
  useScrollReveal()
  return (
    <>
      <Hero />
      <TrainWithUs />
      <Heritage />
      <Faq />
      <JoinBanner />
    </>
  )
}
