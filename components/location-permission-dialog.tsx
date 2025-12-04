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
      <DialogContent className="sm:max-w-md text-center border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            Enable Location
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            We need your location to help rescuers find the animal quickly.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          {/* Animation */}
          <div className="w-48 h-48 relative">
            <div className="absolute inset-0 bg-orange-100/50 rounded-full blur-3xl" />
            {animationData && (
              <Lottie animationData={animationData} loop={true} className="relative z-10" />
            )}
          </div>

          <div className="space-y-4 w-full">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100 shadow-sm animate-in fade-in slide-in-from-top-2">
                {/* Mobile/Tablet Message */}
                <p className="block md:hidden flex flex-col items-center gap-2">
                  <span className="text-2xl">📱</span>
                  <span>Please turn on your device location manually in settings.</span>
                </p>
                {/* Desktop Message */}
                <p className="hidden md:block">
                  Please allow location permissions from the icon 🔒/ℹ️ in the URL bar.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Button
                className="w-full gap-2 text-lg py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 border-0"
                onClick={onRequestLocation}
              >
                <MapPin className="h-5 w-5 animate-bounce" />
                Turn on Location
              </Button>

              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground rounded-full"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
