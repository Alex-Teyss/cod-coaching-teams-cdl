"use client"

import { useEffect, useState } from "react"

export function NotificationBadge() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch("/api/notifications/count")
        if (response.ok) {
          const data = await response.json()
          setCount(data.count)
        }
      } catch (error) {
        console.error("Error fetching notification count:", error)
      }
    }

    fetchCount()

    // Rafraîchir le compteur toutes les 30 secondes
    const interval = setInterval(fetchCount, 30000)

    return () => clearInterval(interval)
  }, [])

  if (count === 0) return null

  return (
    <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
      {count > 9 ? "9+" : count}
    </span>
  )
}
