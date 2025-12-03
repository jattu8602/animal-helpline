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
}

export function LocationPermissionDialog({
  open,
  onOpenChange,
  onRequestLocation,
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

          <div className="space-y-2 w-full">
            <Button
              className="w-full gap-2 text-lg py-6 rounded-full"
              onClick={onRequestLocation}
            >
              <MapPin className="h-5 w-5" />
              Turn on Location
            </Button>
            <p className="text-xs text-muted-foreground">
              Please allow location access in your browser popup
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
