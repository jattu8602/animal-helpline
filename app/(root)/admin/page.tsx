'use client'

import { useEffect, useState } from 'react'
import { ReportCard } from '@/components/report-card'
import { Loader2, Shield, LogOut } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

type AuthState = 'checking' | 'unauthenticated' | 'authenticated'

export default function AdminPage() {
  const [authState, setAuthState] = useState<AuthState>('checking')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [reports, setReports] = useState<any[]>([])
  const [loadingReports, setLoadingReports] = useState(true)

  useEffect(() => {
    const init = async () => {
      const deviceId = ensureAdminDeviceId()
      try {
        const res = await fetch('/api/admin/session', {
          credentials: 'include',
        })
        const data = await res.json()
        if (data.authenticated) {
          setAuthState('authenticated')
          await fetchReports()
        } else {
          setAuthState('unauthenticated')
        }
      } catch (error) {
        console.error('Error checking admin session:', error)
        setAuthState('unauthenticated')
      }
    }

    init()
  }, [])

  const ensureAdminDeviceId = () => {
    if (typeof window === 'undefined') return null
    let id = window.localStorage.getItem('animal_helpline_admin_device_id')
    if (!id) {
      if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        id = crypto.randomUUID()
      } else {
        id = Math.random().toString(36).slice(2)
      }
      window.localStorage.setItem('animal_helpline_admin_device_id', id)
    }
    return id
  }

  const fetchReports = async () => {
    try {
      setLoadingReports(true)
      const res = await fetch('/api/reports', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setReports(data)
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
      toast.error('Failed to load reports')
    } finally {
      setLoadingReports(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const deviceId = ensureAdminDeviceId()
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password, deviceId }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Invalid admin credentials')
        setIsSubmitting(false)
        return
      }

      setAuthState('authenticated')
      setPassword('')
      toast.success('Logged in as admin')
      await fetchReports()
    } catch (error) {
      console.error('Error logging in:', error)
      toast.error('Failed to login')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      })
      setAuthState('unauthenticated')
      setReports([])
      toast.success('Logged out')
    } catch (error) {
      console.error('Error logging out:', error)
      toast.error('Failed to logout')
    }
  }

  const renderLogin = () => {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <div className="w-full max-w-md px-4">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Shield className="h-4 w-4" />
                <span>Admin Access</span>
              </div>
              <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
              <CardDescription>
                Enter the admin username and password configured in the server
                environment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Username</label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    placeholder="Admin username"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="Admin password"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (authState === 'checking') {
    return (
      <>
        <Toaster position="top-center" richColors />
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Checking admin session...</p>
        </div>
      </>
    )
  }

  if (authState === 'unauthenticated') {
    return (
      <>
        <Toaster position="top-center" richColors />
        {renderLogin()}
      </>
    )
  }

  // Authenticated admin dashboard
  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-10 flex items-start justify-between gap-4">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Admin Dashboard
                </span>
              </div>
              <h1 className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-5xl font-bold text-transparent">
                Admin Dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
                Manage and respond to all animal rescue reports.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-1 flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Content */}
          {loadingReports ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mb-4 text-6xl">📋</div>
              <h3 className="mb-2 text-2xl font-semibold">No Reports Yet</h3>
              <p className="text-muted-foreground">
                All animal rescue reports will appear here as they are
                submitted.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Total Reports:{' '}
                  <span className="font-semibold text-foreground">
                    {reports.length}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Pending:{' '}
                  <span className="font-semibold text-orange-600">
                    {reports.filter((r) => r.status === 'pending').length}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {reports.map((report) => (
                  <ReportCard key={report.id} report={report} isAdmin={true} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
