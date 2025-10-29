"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

interface MainImageDisplayProps {
  images: string[]
  productName: string
  activeImageIndex: number
  onStackingStateChange?: (isStacking: boolean, progress: number) => void
}

export default function MainImageDisplay({ 
  images, 
  productName, 
  activeImageIndex,
  onStackingStateChange 
}: MainImageDisplayProps) {
  const [isSticking, setIsSticking] = useState(false)
  const [navHeight, setNavHeight] = useState<number>(64) // default ~64px
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Measure navbar height (sticky top-0 container). Use a ResizeObserver for robustness.
    const selector = 'div.sticky.top-0'
    const navEl = document.querySelector(selector) as HTMLDivElement | null

    const measureNav = () => {
      const h = navEl?.getBoundingClientRect().height || 64
      setNavHeight((prev) => (Math.abs(prev - h) > 0.5 ? h : prev))
    }

    measureNav()
    const onResize = () => measureNav()
    window.addEventListener('resize', onResize)

    let ro: ResizeObserver | null = null
    if (navEl && 'ResizeObserver' in window) {
      ro = new ResizeObserver(() => measureNav())
      ro.observe(navEl)
    }

    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const shouldStick = rect.top <= navHeight && rect.bottom > navHeight
      if (isSticking !== shouldStick) {
        setIsSticking(shouldStick)
        onStackingStateChange?.(shouldStick, shouldStick ? 1 : 0)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    // Trigger once on mount
    handleScroll()

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', handleScroll)
      ro?.disconnect()
    }
  }, [onStackingStateChange, navHeight, isSticking])

  return (
    <div ref={containerRef} className="w-full">
      <div
        className={`sticky h-[520px] md:h-[640px] lg:h-[760px] bg-secondary rounded-lg overflow-hidden transition-all duration-300`}
        style={{ top: navHeight } as React.CSSProperties}
      >
        <div className="relative w-full h-full">
          <Image
            src={images[activeImageIndex] || "/placeholder.svg"}
            alt={`${productName} - View ${activeImageIndex + 1}`}
            fill
            className="object-cover transition-opacity duration-500"
            priority={activeImageIndex === 0}
            loading={activeImageIndex === 0 ? "eager" : "lazy"}
          />
        </div>

        {/* Image counter */}
        <div className="absolute bottom-4 right-4 bg-primary/80 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
          {activeImageIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  )
}
