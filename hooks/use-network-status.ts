"use client"

import { useEffect, useState } from "react"

interface NetworkInformation extends EventTarget {
  downlink?: number
  effectiveType?: "4g" | "3g" | "2g" | "slow-2g"
  rtt?: number
  saveData?: boolean
}

export function useNetworkStatus() {
  const [isSlowConnection, setIsSlowConnection] = useState(false)
  const [effectiveType, setEffectiveType] = useState<string>("4g")

  useEffect(() => {
    // Check if Network Information API is available
    const connection =
      (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

    if (!connection) {
      // Fallback: assume good connection if API not available
      setIsSlowConnection(false)
      return
    }

    const updateConnectionStatus = () => {
      const networkInfo = connection as NetworkInformation

      // Determine if connection is slow
      const isSlow =
        networkInfo.effectiveType === "2g" ||
        networkInfo.effectiveType === "3g" ||
        networkInfo.effectiveType === "slow-2g" ||
        networkInfo.saveData === true ||
        (networkInfo.downlink !== undefined && networkInfo.downlink < 1)

      setIsSlowConnection(isSlow)
      setEffectiveType(networkInfo.effectiveType || "4g")
    }

    // Check initial status
    updateConnectionStatus()

    // Listen for connection changes
    connection.addEventListener("change", updateConnectionStatus)

    return () => {
      connection.removeEventListener("change", updateConnectionStatus)
    }
  }, [])

  return { isSlowConnection, effectiveType }
}
