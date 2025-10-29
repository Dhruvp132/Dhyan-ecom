"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useNetworkStatus } from "@/hooks/use-network-status"

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [showFallback, setShowFallback] = useState(true) // Start with fallback to prevent flicker
  const { isSlowConnection } = useNetworkStatus()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // If slow connection detected, keep fallback
    if (isSlowConnection) {
      setShowFallback(true)
      return
    }

    const handleCanPlayThrough = async () => {
      try {
        // Video is ready to play without buffering
        await video.play()
        setVideoLoaded(true)
        setShowFallback(false)
        console.log("Video playing successfully")
      } catch (error) {
        console.error("Video play failed:", error)
        setShowFallback(true)
      }
    }

    const handleError = (e: Event) => {
      console.error("Video error:", e)
      setShowFallback(true)
    }

    video.addEventListener("canplaythrough", handleCanPlayThrough)
    video.addEventListener("error", handleError)

    // Try to load the video
    video.load()

    return () => {
      video.removeEventListener("canplaythrough", handleCanPlayThrough)
      video.removeEventListener("error", handleError)
    }
  }, [isSlowConnection])

  return (
    <section ref={containerRef} className="fixed top-20 left-0 w-full h-screen overflow-hidden bg-black z-0">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        {/* Always render video but hide it until loaded */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            !showFallback && videoLoaded ? "opacity-100" : "opacity-0"
          }`}
          poster="/fallback-video-image.png"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Fallback Image - shown while video loads or on error */}
        <Image
          src="/fallback-video-image.png"
          alt="COLT & CO. - Fashion collection showcase"
          fill
          priority
          className={`object-cover transition-opacity duration-700 ${
            showFallback || !videoLoaded ? "opacity-100" : "opacity-0"
          }`}
          sizes="100vw"
        />

        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 text-balance">COLT & CO.</h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl text-pretty">
          Elevate Your Shopping Experience - Discover the best products at the best prices
        </p>
        <button className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300">
          Shop All
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
