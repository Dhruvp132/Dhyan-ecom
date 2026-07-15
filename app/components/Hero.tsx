import Image from "next/image"
import HeroVideoBackground from "./HeroVideoBackground"
import { TextAnimate } from "@/components/ui/text-animate"

export default function Hero() {
  return (
    <section className="fixed top-20 left-0 w-full h-screen overflow-hidden bg-black z-0">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/fallback-video-image.v1.png"
          alt="COLT & CO. - Fashion collection showcase"
          fill
          priority
          quality={90}
          className="object-cover"
          sizes="100vw"
        />

        <HeroVideoBackground />

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#0b4476] mb-4 text-balance">
          <TextAnimate animation="slideUp" by="word">
            COLT & CO.
          </TextAnimate>
        </h1>
        <p className="text-lg md:text-xl text-[#ECF2F5] mb-8 max-w-2xl text-pretty">
          Elevate Your Shopping Experience - Discover the best products at the best prices
        </p>
        <button className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-[#ECF2F5] hover:text-[#2F5A8A] transition-colors duration-300 shadow-[0_10px_30px_rgba(35,68,108,0.18)]">
          Shop All
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
