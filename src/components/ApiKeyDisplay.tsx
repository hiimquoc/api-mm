"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

interface ApiKeyDisplayProps {
  apiKey: string;
}

export function ApiKeyDisplay({ apiKey }: ApiKeyDisplayProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono">
        {isVisible ? apiKey : '••••••••••••••••'}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleVisibility}
        aria-label={isVisible ? "Hide API key" : "Show API key"}
      >
        {isVisible ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
} 