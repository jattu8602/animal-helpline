"use client";

import { useState, useEffect } from "react";
import PostCard from "./PostCard";
import CommunityMap from "./CommunityMap";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Simple hook to detect mobile view
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);
    return isMobile;
}

// Mock Data Generation
const MOCK_REPORTS = Array.from({ length: 15 }).map((_, i) => ({
    id: `mock-${i + 1}`,
    imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1000&auto=format&fit=crop", // Generic dog image
    latitude: 28.6139 + (Math.random() - 0.5) * 0.1, // Around New Delhi
    longitude: 77.2090 + (Math.random() - 0.5) * 0.1,
    location: `Area Sector ${i + 1}, New Delhi`,
    createdAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
    analysisResult: {
        animalType: i % 2 === 0 ? "dog" : "cat",
        isInjured: i % 3 === 0,
        injuryDetails: {
            severity: i % 3 === 0 ? "medium" : "low",
            condition: i % 3 === 0 ? "Visible leg injury, needs assistance." : "Appears healthy but hungry.",
        },
        environment: {
            description: "Urban street side"
        }
    },
    // New Fields
    keyPoints: [
        "Found near the market area",
        "Seems very dehydrated",
        "Friendly but scared",
        "Has a collar but no tag",
        "Needs immediate vet attention"
    ],
    description: "This poor soul has been wandering around the sector market for the past few days. Shopkeepers have been feeding it, but it looks like it has a leg injury that is getting worse. We suspect it might be abandoned or lost. The dog is gentle and doesn't show aggression, but whimpers when moving. Urgently looking for a foster or a shelter that can take it in for medical treatment and rehabilitation.",
    likes: [],
    comments: []
}));

export default function CommunityFeed() {
    const [reports, setReports] = useState<any[]>(MOCK_REPORTS);
    const [loading, setLoading] = useState(false); // No loading needed for mock data
    const [activeReport, setActiveReport] = useState<any>(MOCK_REPORTS[0]);
    const isMobile = useIsMobile();

    // Removed API fetch logic for now

    const [mapCollapsed, setMapCollapsed] = useState(false);

    // Allow mobile updates to activeReport
    const handleInView = (report: any) => {
        setActiveReport(report);
    };

    // Mobile: Auto-collapse map logic
    useEffect(() => {
        if (!isMobile) return;

        setMapCollapsed(false); // Expand on new report
        const timer = setTimeout(() => {
            setMapCollapsed(true);
        }, 2500);

        return () => clearTimeout(timer);
    }, [activeReport, isMobile]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (isMobile) {
        // Mobile Layout: Global Map + Snap Scroll Feed
        return (
            <div className="relative h-screen overflow-hidden flex flex-col bg-[#FBF8F0]">
                {/* Global Background Map */}
                <div className="absolute inset-0 z-0">
                    {activeReport && activeReport.latitude && activeReport.longitude ? (
                        <CommunityMap
                            lat={activeReport.latitude}
                            lng={activeReport.longitude}
                            popupText={activeReport.location}
                            isMobile={true}
                            isCollapsed={mapCollapsed}
                        />
                    ) : (
                        <div className="h-full w-full bg-[#faebd7]" />
                    )}
                </div>

                {/* Sticky Header */}
                <header className="sticky top-0 z-50 bg-[#FBF8F0]/95 backdrop-blur-sm border-b px-4 py-3 flex-shrink-0">
                     <h1 className="text-xl font-bold">Community</h1>
                </header>

                {/* Content Feed */}
                <div className="flex-1 overflow-y-auto snap-y snap-mandatory [&::-webkit-scrollbar]:hidden w-full pb-20 z-10">
                    <div className="pb-10">
                        {reports.map((report) => (
                            <PostCard
                                key={report.id}
                                report={report}
                                isMobile={true}
                                onInView={handleInView}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Desktop Layout: Split View with Rounding & Snap
    return (
        <div className="flex h-screen overflow-hidden md:pl-[10%] bg-[#FBF8F0] p-6 gap-6">
            {/* Left Side: Scrollable Feed */}
            <div className="w-1/2 h-full bg-background rounded-3xl shadow-lg border overflow-hidden flex flex-col">
                <div className="p-6 border-b flex-shrink-0 bg-white z-10">
                    <h1 className="text-3xl font-bold">Community Feed</h1>

                </div>

                {/* Scroll Area with Snap */}
                <div className="flex-1 overflow-y-auto snap-y snap-mandatory [&::-webkit-scrollbar]:hidden scroll-smooth p-6 pt-0">
                    {reports.map((report) => (
                        <PostCard
                            key={report.id}
                            report={report}
                            isMobile={false}
                            onInView={handleInView}
                        />
                    ))}
                    {reports.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground">
                            No reports found.
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side: Dynamic Map */}
            <div className="w-1/2 h-full bg-muted rounded-3xl shadow-lg overflow-hidden border relative">
                {activeReport && activeReport.latitude && activeReport.longitude ? (
                    <CommunityMap
                        lat={activeReport.latitude}
                        lng={activeReport.longitude}
                        popupText={activeReport.location}
                        isMobile={false}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <p>No location selected</p>
                    </div>
                )}
            </div>
        </div>
    );
}
