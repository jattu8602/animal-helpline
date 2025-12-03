'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

// We don't have the BeforeInstallPromptEvent type in TS by default, so use any
type DeferredPromptEvent = any

export function PwaInstallBar() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<DeferredPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  // Check if the app is running as an installed PWA
  const computeInstalledState = () => {
    if (typeof window === 'undefined') return false

    const isStandaloneDisplay =
      window.matchMedia?.('(display-mode: standalone)').matches ||
      // iOS Safari
      // @ts-expect-error - navigator.standalone is iOS only
      window.navigator.standalone === true

    return isStandaloneDisplay
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Initial install state: if not in standalone but we previously thought it was installed,
    // treat it as uninstalled (e.g. user removed the app).
    const storedInstalled =
      window.localStorage.getItem('pwa_installed') === 'true'
    const currentlyStandalone = computeInstalledState()

    if (currentlyStandalone) {
      setIsInstalled(true)
      window.localStorage.setItem('pwa_installed', 'true')
    } else if (storedInstalled && !currentlyStandalone) {
      // User likely uninstalled the app at some point; reset state so we can show install again
      setIsInstalled(false)
      window.localStorage.removeItem('pwa_installed')
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as DeferredPromptEvent)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
      window.localStorage.setItem('pwa_installed', 'true')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      )
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const choiceResult = await deferredPrompt.userChoice

    if (choiceResult.outcome === 'accepted') {
      // Browser will fire appinstalled after successful install
      // We don't mark installed here; we wait for that event.
    }

    setDeferredPrompt(null)
  }

  // Don't show anything on desktop; keep it mobile-focused
  if (typeof window !== 'undefined') {
    const isLargeScreen = window.matchMedia?.('(min-width: 768px)').matches
    if (isLargeScreen) return null
  }

  // If the app is installed, show a small confirmation bar
  if (isInstalled) {
    // Once installed, hide the bar entirely to avoid being annoying
    return null
  }

  // If we don't have a deferredPrompt yet, we can't trigger install UI reliably, so hide the bar.
  if (!deferredPrompt) return null

  return (
    <div className="fixed inset-x-0 top-0 z-50 border-t bg-background/95 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between gap-3 px-4 py-3">
        <div className="text-xs">
          <p className="font-semibold">Install Animal Helpline</p>
          <p className="text-muted-foreground">
            Add the app to your home screen for faster access.
          </p>
        </div>
        <Button size="sm" className="shrink-0" onClick={handleInstallClick}>
          Install app
        </Button>
      </div>
    </div>
  )
}
