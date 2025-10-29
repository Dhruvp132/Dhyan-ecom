"use client"

import { useEffect } from "react"

export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      // Prevent scroll
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = "unset"
      }
    }
  }, [isLocked])
}
