"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { getHealthStatus } from "@/lib/api"

export function HealthStatus() {
  const [status, setStatus] = useState<"healthy" | "unhealthy" | "loading">("loading")

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await getHealthStatus()
        setStatus("healthy")
      } catch {
        setStatus("unhealthy")
      }
    }

    checkHealth()

    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  if (status === "loading") {
    return (
      <Badge variant="outline" className="gap-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        Checking...
      </Badge>
    )
  }

  if (status === "healthy") {
    return (
      <Badge variant="outline" className="gap-1 text-green-600 border-green-200">
        <CheckCircle className="h-3 w-3" />
        API Healthy
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="gap-1 text-red-600 border-red-200">
      <XCircle className="h-3 w-3" />
      API Down
    </Badge>
  )
}
