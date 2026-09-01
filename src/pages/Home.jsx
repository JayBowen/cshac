import Hero from "@/components/Hero"
import TrainWithUs from "@/components/TrainWithUs"
import Heritage from "@/components/Heritage"
import Medals from "@/components/Medals"
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
      <Medals />
      <Faq />
      <JoinBanner />
    </>
  )
}
