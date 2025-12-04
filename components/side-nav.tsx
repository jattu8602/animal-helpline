'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  Home,
  Users,
  Building2,
  Film,
  User,
  Shield,
} from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

type NavItem = {
  label: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Community', href: '/community', icon: Users },
  { label: 'Shelters', href: '/maitri', icon: Building2 },
  { label: 'Reels', href: '/dashboard', icon: Film },
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'Admin', href: '/admin', icon: Shield, adminOnly: true },
]

export function SideNav() {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch('/api/admin/session', { credentials: 'include' })
        const data = await res.json()
        setIsAdmin(!!data.authenticated)
      } catch {
        setIsAdmin(false)
      }
    }

    checkAdmin()
  }, [])

  // Only show on medium+ screens
  return (
    <>
      {/* Desktop Nav */}
      <div className="pointer-events-none fixed left-[4%] top-1/2 z-[1000] hidden -translate-y-1/2 md:flex">
        <nav className="pointer-events-auto flex min-h-[500px] flex-col items-center gap-8 rounded-full bg-card/90 px-3 py-10 shadow-lg backdrop-blur">
          {/* Logo */}
          <div className="mb-2 rounded-full bg-background p-1 shadow-sm">
            <div className="relative h-10 w-10">
              <Image
                src="/logo.png"
                alt="Animal Helpline logo"
                fill
                className="rounded-full object-contain"
              />
            </div>
          </div>

          <div className="h-px w-8 bg-border" />

          {/* Nav icons */}
          <div className="flex flex-col items-center gap-6">
            {navItems
              .filter((item) => !item.adminOnly || isAdmin)
              .map((item) => {
                const Icon = item.icon
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href)

                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={8}>
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                )
              })}
          </div>
        </nav>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-[1001] border-t bg-background/80 backdrop-blur md:hidden">
        <nav className="flex h-16 items-center justify-around px-4">
          {navItems
            .filter((item) => !item.adminOnly) // Always hide admin on mobile
            .map((item) => {
              const Icon = item.icon
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center gap-1 rounded-lg p-2 transition-colors ${
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              )
            })}
        </nav>
      </div>
    </>
  )
}









