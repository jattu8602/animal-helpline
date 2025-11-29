"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardStats } from "@/components/dashboard-stats"
import { ReportCard } from "@/components/report-card"
import { mockReports, type AnimalReport } from "@/lib/mock-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DashboardPage() {
  const [reports, setReports] = useState(mockReports)
  const [filterUrgency, setFilterUrgency] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const handleStatusChange = (reportId: string, newStatus: AnimalReport["status"]) => {
    setReports((prev) => prev.map((report) => (report.id === reportId ? { ...report, status: newStatus } : report)))
  }

  const filteredReports = reports.filter((report) => {
    const urgencyMatch = filterUrgency === "all" || report.urgency === filterUrgency
    const statusMatch = filterStatus === "all" || report.status === filterStatus
    return urgencyMatch && statusMatch
  })

  const pendingReports = filteredReports.filter((r) => r.status === "pending")
  const assignedReports = filteredReports.filter((r) => r.status === "assigned")
  const rescuedReports = filteredReports.filter((r) => r.status === "rescued")

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <DashboardStats />

          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-bold text-foreground">Animal Reports</h2>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Select value={filterUrgency} onValueChange={setFilterUrgency}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Urgencies</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="rescued">Rescued</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({filteredReports.length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({pendingReports.length})</TabsTrigger>
                <TabsTrigger value="assigned">Assigned ({assignedReports.length})</TabsTrigger>
                <TabsTrigger value="rescued">Rescued ({rescuedReports.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {filteredReports.map((report) => (
                    <ReportCard key={report.id} report={report} onStatusChange={handleStatusChange} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="pending" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {pendingReports.map((report) => (
                    <ReportCard key={report.id} report={report} onStatusChange={handleStatusChange} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="assigned" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {assignedReports.map((report) => (
                    <ReportCard key={report.id} report={report} onStatusChange={handleStatusChange} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="rescued" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {rescuedReports.map((report) => (
                    <ReportCard key={report.id} report={report} onStatusChange={handleStatusChange} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
