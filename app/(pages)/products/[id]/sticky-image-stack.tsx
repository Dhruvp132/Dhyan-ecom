"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Image from "next/image"

interface StackedImage {
  id: number
  src: string
  alt: string
}

interface StickyImageStackProps {
  images: string[]
  productName: string
  onStackingStateChange?: (isStacking: boolean, progress: number) => void
  // When mode is "controlled", the parent controls progress [0..1]
  mode?: "auto" | "controlled"
  progress?: number
  // When true, do not apply internal sticky layout; useful when parent is pinned
  disableInternalSticky?: boolean
  // Toggle internal thumbnail buttons below the stack
  showThumbnails?: boolean
}

export default function StickyImageStack({ 
  images, 
  productName, 
  onStackingStateChange,
  mode = "auto",
  progress,
  disableInternalSticky = false,
  showThumbnails = true,
}: StickyImageStackProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [stackedImages, setStackedImages] = useState<number[]>([0])
  const [isStacking, setIsStacking] = useState(false)
  const [stackProgress, setStackProgress] = useState(0)
  // Smoothed render progress for ultra-smooth motion regardless of scroll event cadence
  const [renderProgress, setRenderProgress] = useState(0)
  const targetProgressRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [stageHeight, setStageHeight] = useState<number>(0)

  const PRODUCT_IMAGES: StackedImage[] = useMemo(() => (
    images.map((src, index) => ({
      id: index + 1,
      src,
      alt: `${productName} - View ${index + 1}`,
    }))
  ), [images, productName])
  const canStack = PRODUCT_IMAGES.length > 1

  // Auto mode: compute progress from scroll; Controlled mode: derive from provided progress
  useEffect(() => {
    if (mode === "controlled") {
      const p = Math.max(0, Math.min(progress ?? 0, 1))
      if (!canStack) {
        // No stacking when there's only one image
        setStackedImages([0])
        setActiveImageIndex(0)
        setIsStacking(false)
        setStackProgress(p)
        onStackingStateChange?.(false, p)
        return
      }
      setStackProgress(p)
      const seg = 1 / PRODUCT_IMAGES.length
      const allImagesStacked = p >= 0.999 && (Math.floor(p * PRODUCT_IMAGES.length) + 1) === PRODUCT_IMAGES.length
      setIsStacking(!allImagesStacked && p > 0)
      onStackingStateChange?.(!allImagesStacked && p > 0, p)
      return
    }

    const handleScroll = () => {
      if (!containerRef.current || !scrollContainerRef.current) return
      if (!canStack) return

  const containerRect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Stacking starts when container enters viewport and continues as user scrolls
      const stackingStartThreshold = windowHeight * 0.6
      const containerTop = containerRect.top

      // Only stack when container is visible in viewport
      if (containerTop > windowHeight || containerTop < -containerRect.height) {
        setIsStacking(false)
        setStackProgress(0)
        onStackingStateChange?.(false, 0)
        return
      }

      // Progress increases as container moves up the screen
      const stackingDistance = windowHeight * 1.2
      const scrollProgress = Math.max(0, (stackingStartThreshold - containerTop) / stackingDistance)
      const normalizedProgress = Math.min(scrollProgress, 1)

      setStackProgress(normalizedProgress)
      const seg = 1 / PRODUCT_IMAGES.length
      const allImagesStacked = normalizedProgress >= 0.95 && (Math.floor(normalizedProgress * PRODUCT_IMAGES.length) + 1) === PRODUCT_IMAGES.length
      setIsStacking(!allImagesStacked && normalizedProgress > 0)
      onStackingStateChange?.(!allImagesStacked && normalizedProgress > 0, normalizedProgress)
    }

    if (!canStack) return
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [mode, progress, onStackingStateChange, PRODUCT_IMAGES.length, canStack])

  // Smooth-driven visibility: derive stacked images and active index from renderProgress
  useEffect(() => {
    const total = PRODUCT_IMAGES.length
    if (!canStack) {
      setStackedImages([0])
      setActiveImageIndex(0)
      return
    }
    const p = Math.max(0, Math.min(renderProgress, 1))
    let imagesToStack = Math.min(Math.floor(p * total) + 1, total)
    const seg = 1 / total
    // Early thresholds consistent with forward path
    if (p >= seg * 0.1 && imagesToStack < 2) {
      imagesToStack = 2
    }
    if (total >= 3 && p >= seg * 1.1 && imagesToStack < 3) {
      imagesToStack = 3
    }
    setStackedImages(Array.from({ length: imagesToStack }, (_, i) => i))
    setActiveImageIndex(Math.min(imagesToStack - 1, total - 1))
    // Keep isStacking consistent with p but avoid flapping near 0/1
    const allImagesStacked = imagesToStack === total && p >= 0.999
    setIsStacking(!allImagesStacked && p > 0.001)
  }, [renderProgress, PRODUCT_IMAGES.length, canStack])

  // RAF-driven smoothing toward the latest stackProgress
  useEffect(() => {
    targetProgressRef.current = stackProgress
    if (rafRef.current !== null) return // already animating

    const tick = () => {
      const current = renderProgress
      const target = targetProgressRef.current
  // Exponential smoothing factor; lower = smoother/slower
  const alpha = 0.08
      const next = current + (target - current) * alpha
      if (Math.abs(next - target) < 0.001) {
        setRenderProgress(target)
        rafRef.current = null
        return
      }
      setRenderProgress(next)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [stackProgress, renderProgress])

  // Measure stage height to make the entering cards start from outside the frame
  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const measure = () => setStageHeight(el.getBoundingClientRect().height)
    measure()
    const onResize = () => measure()
    window.addEventListener('resize', onResize)
    let ro: ResizeObserver | null = null
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(measure)
      ro.observe(el)
    }
    return () => {
      window.removeEventListener('resize', onResize)
      ro?.disconnect()
    }
  }, [])

  return (
    <div ref={containerRef} className="space-y-6">
      <div
        ref={scrollContainerRef}
        className={`relative h-96 md:h-[500px] lg:h-[600px] bg-secondary/60 rounded-xl overflow-visible transition-all duration-300 ${
          !disableInternalSticky && isStacking && canStack ? "sticky top-8" : ""
        }`}
        style={{ perspective: 1000, WebkitPerspective: 1000 } as React.CSSProperties}
      >
        <div className="relative w-full h-full">
          {stackedImages.map((imageIndex, stackIndex) => {
            // Compute per-card local progress for nicer entrance from bottom
            const total = PRODUCT_IMAGES.length
            const globalP = renderProgress
            // Custom segment boundaries: make the 2nd image start at half the first segment
            let start = stackIndex / total
            let end = (stackIndex + 1) / total
            if (stackIndex === 1) {
              const firstSeg = 1 / total
              // Start a tenth into the first segment for an earlier reveal; finish by its end
              start = firstSeg * 0.1
              end = firstSeg * 1.0
            }
            if (stackIndex === 2) {
              const seg = 1 / total
              // Start early into the second segment and finish by its end
              start = seg * 1.1
              end = seg * 2.0
            }
            const local = Math.max(0, Math.min(1, (globalP - start) / Math.max(0.0001, end - start)))

            // Easing for smoother motion (slightly slower decel)
            const ease = (t: number) => 1 - Math.pow(1 - t, 4)
            const lp = ease(local)

            // Keep the first image static; animate others as cards entering from bottom
            const baseOffset = 20 // distance between stacked cards
            // Start from below the visible frame so it appears from outside
            const enterFrom = Math.max(220, stageHeight * 0.85)
            const targetY = stackIndex * baseOffset
            const translateY = stackIndex === 0 ? 0 : (1 - lp) * enterFrom + lp * targetY
            // Keep same size as the first image (no scale)
            const scale = 1
            const rotateX = stackIndex === 0 ? 0 : (1 - lp) * 6
            // Stronger blur at the start for a crisper crossfade
            const blurStart = 12
            const blur = stackIndex === 0 ? 0 : (1 - lp) * blurStart
            // Crossfade: ramp opacity up faster in the first half of progress
            const fadeIn = Math.max(0, Math.min(1, lp / 0.5))
            const opacity = stackIndex === 0 ? 1 : fadeIn
            const shadowOpacity = stackIndex === 0 ? 0 : 0.08 + stackIndex * 0.05 + lp * 0.05
            const z = 10 + stackIndex

            return (
              <div
                key={imageIndex}
                className="absolute inset-0 pointer-events-none"
                style={{
                  willChange: 'transform, filter, opacity',
                  transform: `translateY(${translateY}px) scale(${scale}) rotateX(${rotateX}deg) translateZ(0)`,
                  zIndex: z,
                  filter: `blur(${blur}px)`,
                  opacity,
                  // We animate via RAF to ensure smoothness; avoid CSS transitions that can stutter with scroll
                }}
              >
                {/* Card wrapper for border/shadow; keep same dimensions as first (inset-0) */}
                <div
                  className={`absolute inset-0 rounded-xl overflow-hidden bg-background`}
                  style={{
                    boxShadow: stackIndex === 0 ? 'none' : `0 ${8 + stackIndex * 4}px ${24 + stackIndex * 8}px rgba(0,0,0,${shadowOpacity})`,
                    border: 'none'
                  }}
                >
                  <Image
                    src={PRODUCT_IMAGES[imageIndex].src || "/placeholder.svg"}
                    alt={PRODUCT_IMAGES[imageIndex].alt}
                    fill
                    className="object-cover"
                    priority={imageIndex === 0}
                    loading={imageIndex === 0 ? "eager" : "lazy"}
                  />

                  {/* Gloss highlight on active/last card */}
                  {stackIndex !== 0 && imageIndex === stackedImages[stackedImages.length - 1] && (
                    <div className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.25), rgba(255,255,255,0) 40%)',
                        mixBlendMode: 'screen',
                        opacity: 0.7
                      }}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* <div
          className={`absolute bottom-4 right-4 bg-primary/80 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            isStacking ? "sticky" : ""
          }`}
        >
          {activeImageIndex + 1} / {PRODUCT_IMAGES.length}
        </div> */}
      </div>

      {showThumbnails && (
        <div
          className={`grid grid-cols-4 gap-3 transition-all duration-300 ${
            !disableInternalSticky && isStacking ? "sticky top-96 md:top-[520px] lg:top-[620px] bg-background py-4 z-40" : ""
          }`}
        >
          {PRODUCT_IMAGES.map((image, index) => (
            <button
              key={image.id}
              onClick={() => {
                setActiveImageIndex(index)
                setStackedImages(Array.from({ length: index + 1 }, (_, i) => i))
              }}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
                index <= activeImageIndex ? "border-primary" : "border-border hover:border-muted-foreground"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
