'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Lottie from 'lottie-react'
import { MapPin } from 'lucide-react'

interface LocationPermissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRequestLocation: () => void
  error?: string | null
}

export function LocationPermissionDialog({
  open,
  onOpenChange,
  onRequestLocation,
  error,
}: LocationPermissionDialogProps) {
  const [animationData, setAnimationData] = useState<any>(null)

  useEffect(() => {
    // Load the cute cat animation
    fetch('/anime/Cat Pookie.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error('Failed to load animation', err))
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Enable Location
          </DialogTitle>
          <DialogDescription className="text-center">
            We need your location to help rescuers find the animal.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          {/* Animation */}
          <div className="w-48 h-48">
            {animationData && (
              <Lottie animationData={animationData} loop={true} />
            )}
          </div>

          <div className="space-y-4 w-full">
            {error && (
              <div className="bg-blue-50 text-blue-700 p-4 rounded-xl text-sm font-medium border border-blue-100 shadow-sm">
                {/* Mobile/Tablet Message */}
                <p className="block md:hidden flex items-center justify-center gap-2">
                  <span>📱</span> Please turn on your device location manually.
                </p>
                {/* Desktop Message */}
                <p className="hidden md:block">
                  Please allow location permissions from the icon 🔒/ℹ️ in the URL bar.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Button
                className="w-full gap-2 text-lg py-6 rounded-full"
                onClick={onRequestLocation}
              >
                <MapPin className="h-5 w-5" />
                Turn on Location
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
