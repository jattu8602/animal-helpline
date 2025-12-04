'use client'

import { useEffect, useState } from 'react'
import { ReportCard } from '@/components/report-card'
import { Loader2, User } from 'lucide-react'
import { Toaster, toast } from 'sonner'

export default function ProfilePage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const init = async () => {
      const deviceId = getCurrentDeviceId()
      if (!deviceId) {
        setLoading(false)
        return
      }

      try {
        const [reportsRes, adminRes] = await Promise.all([
          fetch('/api/reports'),
          fetch('/api/admin/session', { credentials: 'include' }),
        ])

        if (reportsRes.ok) {
          const allReports = await reportsRes.json()
          const ownReports = allReports.filter(
            (r: any) => r.user?.deviceId === deviceId,
          )
          setReports(ownReports)
        }

        if (adminRes.ok) {
          const data = await adminRes.json()
          setIsAdmin(!!data.authenticated)
        }
      } catch (error) {
        console.error('Error loading profile data:', error)
        toast.error('Failed to load your uploads')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  const getCurrentDeviceId = () => {
    if (typeof window === 'undefined') return null
    return (
      window.localStorage.getItem('animal_helpline_device_id') ||
      window.localStorage.getItem('animal_helpline_admin_device_id')
    )
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Your Profile</h1>
                <p className="text-sm text-muted-foreground">
                  View the reports you have uploaded.
                </p>
              </div>
            </div>

            {isAdmin && (
              <a
                href="/admin"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                <span>Go to Admin Panel</span>
              </a>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading your uploads...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mb-4 text-6xl">🐾</div>
              <h2 className="mb-2 text-2xl font-semibold">
                You haven&apos;t uploaded any reports yet
              </h2>
              <p className="text-muted-foreground">
                When you upload reports, they will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}



