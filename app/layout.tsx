import type React from 'react'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Suspense } from 'react'
import { PwaInstallBar } from '@/components/pwa-install-bar'
import { SideNav } from '@/components/side-nav'
import './globals.css'

export const metadata: Metadata = {
  title: 'Animal Shelter Helpline - Connect Animals in Need with Care',
  description:
    'Report injured or distressed animals and connect them with nearby shelters and foster care. 24/7 emergency animal support.',
  generator: 'v0.app',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

function AppLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      {/* Splash image */}
      <div className="relative h-40 w-40 md:h-56 md:w-56">
        {/* Using a plain img here to keep the file simple; Next will serve /splash.png from /public */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/splash.png"
          alt="Animal Helpline splash"
          className="h-full w-full object-contain"
        />
      </div>

      {/* Three loading dots that grow/shrink like a loading indicator */}
      <div className="loading-dots mt-8 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-white" />
        <span className="h-2 w-2 rounded-full bg-white" />
        <span className="h-2 w-2 rounded-full bg-white" />
      </div>
    </div>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<AppLoading />}>{children}</Suspense>
        <PwaInstallBar />
        <SideNav />
      </body>
    </html>
  )
}
