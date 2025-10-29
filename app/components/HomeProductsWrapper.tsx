"use client"

import { useEffect, useRef, useState } from "react"
import HomeProducts from "./HomeProducts"

export default function HomeProductsWrapper() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const element = containerRef.current
      const elementTop = element.getBoundingClientRect().top
      const windowHeight = window.innerHeight

      // Calculate scroll progress - reaches 1 when element is half visible
      // This makes opacity reach 100% much sooner
      const progress = Math.max(0, Math.min(1, (windowHeight - elementTop) / (windowHeight * 0.5)))

      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial call
    
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <style jsx>{`
        /* Smooth scroll behavior for better UX */
        html {
          scroll-behavior: smooth;
        }

        /* Optimize animations for reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
      
      <section
        ref={containerRef}
        className="relative w-full min-h-screen bg-white px-4 py-16 md:py-24 pb-0 z-20"
        style={{
          marginTop: "100vh",
          transform: `translateY(${Math.max(0, scrollProgress * 50)}px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* Background blur effect that increases on scroll */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent pointer-events-none"
          style={{
            opacity: scrollProgress * 0.3,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 
              className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 text-balance"
              style={{
                opacity: Math.min(1, 0.7 + scrollProgress * 0.3),
                transform: `translateY(${Math.max(0, (1 - scrollProgress) * 20)}px)`,
                transition: "all 0.3s ease-out",
              }}
            >
              Featured Products
            </h2>
            <p 
              className="text-gray-600 text-lg max-w-2xl mx-auto text-pretty"
              style={{
                opacity: Math.min(1, 0.7 + scrollProgress * 0.3),
                transform: `translateY(${Math.max(0, (1 - scrollProgress) * 15)}px)`,
                transition: "all 0.3s ease-out",
              }}
            >
              Explore our curated collection of premium products
            </p>
          </div>

          {/* Products Grid */}
          <div
            style={{
              opacity: Math.min(1, 0.7 + scrollProgress * 0.3),
              transform: `translateY(${Math.max(0, (1 - scrollProgress) * 20)}px)`,
              transition: "all 0.3s ease-out",
            }}
          >
            <HomeProducts />
          </div>

          {/* CTA Button */}
          <div 
            className="flex justify-center mt-12 md:mt-16"
            style={{
              opacity: Math.min(1, 0.7 + scrollProgress * 0.3),
              transform: `translateY(${Math.max(0, (1 - scrollProgress) * 20)}px)`,
              transition: "all 0.3s ease-out",
            }}
          >
            <button className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-300">
              View All Products
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
