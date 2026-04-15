import Image from "next/image"
import HeroVideoBackground from "./HeroVideoBackground"

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
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 text-balance">COLT & CO.</h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl text-pretty">
          Elevate Your Shopping Experience - Discover the best products at the best prices
        </p>
        <button className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300">
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
