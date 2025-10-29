"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface ParallaxContentProps {
  children: React.ReactNode
  speed?: number // 0.5 = 50% of scroll speed
}

export function ParallaxContent({ children, speed = 0.5 }: ParallaxContentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [parallaxOffset, setParallaxOffset] = useState(0)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            const scrollY = window.scrollY
            const elementTop = rect.top + scrollY

            // Only apply parallax when element is in view
            if (scrollY < elementTop + window.innerHeight) {
              setParallaxOffset((scrollY - elementTop) * speed)
            }
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed])

  return (
    <div
      ref={containerRef}
      style={{
        transform: `translateY(${parallaxOffset}px)`,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  )
}
