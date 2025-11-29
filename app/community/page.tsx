"use client";

import { useEffect, useState } from "react";
import { ReportCard } from "@/components/report-card";
import { Loader2, Heart } from "lucide-react";
import { Toaster } from "sonner";

export default function CommunityPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await fetch("/api/reports");
            if (res.ok) {
                const data = await res.json();
                setReports(data);
            }
        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Toaster position="top-center" richColors />
            <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-10 text-center">
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full">
                            <Heart className="h-5 w-5 text-primary fill-primary" />
                            <span className="text-sm font-medium text-primary">Community Support</span>
                        </div>
                        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Community Feed
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Together we can make a difference. View reported cases and show your support.
                        </p>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                            <p className="text-muted-foreground">Loading reports...</p>
                        </div>
                    ) : reports.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="mb-4 text-6xl">🐾</div>
                            <h3 className="text-2xl font-semibold mb-2">No Reports Yet</h3>
                            <p className="text-muted-foreground">
                                Be the first to report an animal in need!
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6 text-sm text-muted-foreground text-center">
                                Showing {reports.length} {reports.length === 1 ? "report" : "reports"}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {reports.map((report) => (
                                    <ReportCard key={report.id} report={report} isAdmin={false} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
