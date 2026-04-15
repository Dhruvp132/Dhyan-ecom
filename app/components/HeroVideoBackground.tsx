"use client"

import { useEffect, useRef, useState } from "react"
import { useNetworkStatus } from "@/hooks/use-network-status"

export default function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const revealTimeoutRef = useRef<number | null>(null)
  const [isReady, setIsReady] = useState(false)
  const { isSlowConnection } = useNetworkStatus()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isSlowConnection) {
      setIsReady(false)
      return
    }

    let cancelled = false

    const clearRevealTimeout = () => {
      if (revealTimeoutRef.current !== null) {
        window.clearTimeout(revealTimeoutRef.current)
        revealTimeoutRef.current = null
      }
    }

    const attemptPlay = async () => {
      try {
        await video.play()
        if (!cancelled && revealTimeoutRef.current === null) {
          revealTimeoutRef.current = window.setTimeout(() => {
            if (!cancelled) {
              setIsReady(true)
            }
            revealTimeoutRef.current = null
          }, 1000)
        }
      } catch (error) {
        console.error("Video play failed:", error)
        if (!cancelled) {
          clearRevealTimeout()
          setIsReady(false)
        }
      }
    }

    const handleCanPlayThrough = () => {
      void attemptPlay()
    }

    const handleError = (event: Event) => {
      console.error("Video error:", event)
      clearRevealTimeout()
      setIsReady(false)
    }

    video.addEventListener("canplaythrough", handleCanPlayThrough)
    video.addEventListener("error", handleError)
    video.load()

    return () => {
      cancelled = true
      clearRevealTimeout()
      video.removeEventListener("canplaythrough", handleCanPlayThrough)
      video.removeEventListener("error", handleError)
    }
  }, [isSlowConnection])

  if (isSlowConnection) {
    return null
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-out ${
        isReady ? "opacity-100" : "opacity-0"
      }`}
      poster="/fallback-video-image.v1.png"
    >
      <source src="/hero-video.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  )
}
