"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

interface VideoBackgroundProps {
  videoSrc: string
  fallbackImageSrc: string
  alt: string
}

export function VideoBackground({ videoSrc, fallbackImageSrc, alt }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showVideo, setShowVideo] = useState(false)
  const [isLowBandwidth, setIsLowBandwidth] = useState(false)

  // Detect network conditions and user preferences
  useEffect(() => {
    const checkNetworkConditions = async () => {
      if ("connection" in navigator) {
        const connection = (navigator as any).connection
        const effectiveType = connection?.effectiveType
        const saveData = connection?.saveData

        if (effectiveType === "3g" || effectiveType === "2g" || saveData) {
          setIsLowBandwidth(true)
        } else {
          setIsLowBandwidth(false)
        }
      } else {
        setIsLowBandwidth(false)
      }
    }

    checkNetworkConditions()
  }, [])

  useEffect(() => {
    if (isLowBandwidth) {
      setShowVideo(false)
      return
    }

    const video = videoRef.current
    if (!video) return

    const attemptPlay = async () => {
      try {
        await video.play()
        setShowVideo(true)
      } catch (error) {
        console.log("[v0] Video autoplay failed:", error)
        setShowVideo(false)
      }
    }

    const handleLoadedMetadata = () => {
      attemptPlay()
    }

    const handleCanPlay = () => {
      if (!showVideo) {
        attemptPlay()
      }
    }

    const handleError = (e: Event) => {
      console.log("[v0] Video error:", (e.target as HTMLVideoElement).error?.message)
      setShowVideo(false)
    }

    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("canplay", handleCanPlay)
    video.addEventListener("error", handleError)

    if (video.src !== videoSrc) {
      video.src = videoSrc
      video.load()
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("canplay", handleCanPlay)
      video.removeEventListener("error", handleError)
    }
  }, [isLowBandwidth, videoSrc, showVideo])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <Image
        src={fallbackImageSrc || "/placeholder.svg"}
        alt={alt}
        fill
        priority
        quality={85}
        className={`object-cover transition-opacity duration-500 ${showVideo ? "opacity-0" : "opacity-100"}`}
        sizes="100vw"
      />

      {!isLowBandwidth && (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            showVideo ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          crossOrigin="anonymous"
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  )
}
