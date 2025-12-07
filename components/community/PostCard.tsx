"use client";

import { useEffect, useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import dynamic from "next/dynamic";

const CommunityMap = dynamic(() => import("./CommunityMap"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-muted animate-pulse rounded-2xl" />,
});
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface PostCardProps {
    report: any;
    isMobile: boolean;
    onInView?: (report: any) => void;
    prevLat?: number;
    prevLng?: number;
    shouldLoadMap?: boolean;
}

export default function PostCard({ report, isMobile, onInView, prevLat, prevLng, shouldLoadMap = true }: PostCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mapCollapsed, setMapCollapsed] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);

                if (entry.isIntersecting) {
                    // Notify parent that this card is in view
                    if (onInView) onInView(report);

                    // For mobile: trigger map collapse animation after delay
                    if (isMobile) {
                        setMapCollapsed(false); // Reset first
                        const timer = setTimeout(() => {
                            setMapCollapsed(true);
                        }, 2500);
                        return () => clearTimeout(timer);
                    }
                } else {
                    if (isMobile) setMapCollapsed(false);
                }
            },
            { threshold: 0.6 } // Needs to be mostly visible
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, [isMobile, onInView, report]);

    const severity = report.analysisResult?.injuryDetails?.severity;
    const isInjured = report.analysisResult?.isInjured;
    const createdDate = report.createdAt ? new Date(report.createdAt) : new Date();

    // Prioritize AI analysis result, fallback to root level (e.g. for mock data)
    const keyPoints = report.analysisResult?.keyPoints || report.keyPoints;
    const description = report.analysisResult?.description || report.description;
    const statusLabel = report.analysisResult?.statusLabel || report.analysisResult?.injuryDetails?.severity || "Unknown";

    // Determine badge variant based on status
    const getBadgeVariant = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'critical' || s === 'medical help' || s === 'high') return 'destructive'; // Red
        if (s === 'needs food' || s === 'medium') return 'secondary'; // Green (default secondary is green)
        return 'secondary'; // Default Green for Safe/Healthy
    };

    const ImageModal = () => (
        <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
            <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 border-none bg-transparent shadow-none flex items-center justify-center z-[9999]">
                 <DialogHeader className="sr-only">
                    <DialogTitle>Image of {report.analysisResult?.animalType || "Animal"}</DialogTitle>
                </DialogHeader>
                <div className="relative w-full h-full flex items-center justify-center">
                    <img
                        src={report.imageUrl}
                        alt="Full view"
                        className="max-w-full max-h-[85vh] object-contain rounded-lg"
                    />
                     <button
                        onClick={() => setIsImageModalOpen(false)}
                        className="absolute -top-10 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-colors"
                    >
                        {/* Custom Close X if needed, distinct from Dialog's default */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );

    if (isMobile) {
        // Mobile Layout: Full container height, just content. Map is global in CommunityFeed.
        return (
            <>
                <div
                    ref={cardRef}
                    className="relative w-full h-[calc(100vh-80px)] snap-start shrink-0 flex flex-col bg-background rounded-2xl overflow-hidden shadow-sm border mb-4"
                >
                    {/* Background/Content Layer */}
                    <div className="flex-1 flex flex-col h-full bg-[#fbf8f0]">
                        {/* Image Section */}
                        <div
                            className="relative h-[55%] w-full shrink-0 cursor-pointer"
                            onClick={() => setIsImageModalOpen(true)}
                        >
                            <img
                                src={report.imageUrl}
                                alt="Animal"
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-x-0 top-0 p-3 flex justify-between items-start z-10 pointer-events-none">
                                {isInjured && (
                                    <Badge variant="destructive" className="shadow-sm">
                                        🚨 Injured
                                    </Badge>
                                )}
                                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-sm bg-white/80 backdrop-blur-sm hover:bg-white pointer-events-auto">
                                    <Heart className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="flex-1 p-4 overflow-y-auto no-scrollbar">
                            <div className="flex justify-between items-start mb-1">
                                <div>
                                    <h2 className="text-xl font-bold capitalize leading-tight">
                                        {report.analysisResult?.animalType || "Unknown Animal"}
                                    </h2>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                        <MapPin className="h-3 w-3" />
                                        {report.location || "Unknown Location"}
                                    </p>
                                </div>
                                <span className="text-[10px] text-muted-foreground whitespace-nowrap bg-white/50 px-2 py-1 rounded-full border">
                                    {formatDistanceToNow(createdDate, { addSuffix: true })}
                                </span>
                            </div>

                            <div className="space-y-3 mt-3">
                                <div className="flex items-center gap-2">
                                    <Badge variant={getBadgeVariant(statusLabel)} className="text-[10px] px-2 h-5 capitalize">
                                        {statusLabel}
                                    </Badge>
                                </div>

                                {/* Key Points - Compact */}
                                {keyPoints && (
                                    <ul className="grid grid-cols-1 gap-1">
                                        {keyPoints.slice(0, 4).map((point: string, idx: number) => (
                                            <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1.5 leading-snug">
                                                <span className="text-primary/70 mt-0.5">•</span>
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {/* Description - Truncated/Compact */}
                                {description && (
                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                                        {description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Map Overlay Layer */}
                    {shouldLoadMap && report.latitude && report.longitude && (
                        <CommunityMap
                            lat={report.latitude}
                            lng={report.longitude}
                            startLat={prevLat}
                            startLng={prevLng}
                            isMobile={true}
                            isCollapsed={mapCollapsed}
                            popupText={report.location}
                            isInView={isInView}
                            className="pointer-events-none"
                        />
                    )}
                </div>
                <ImageModal />
            </>
        );
    }

    // Desktop Layout: Snap Card
    return (
        <>
            <div ref={cardRef} className="bg-card text-card-foreground rounded-2xl border shadow-sm overflow-hidden mb-8 w-full snap-start shrink-0 flex flex-col h-[calc(100vh-140px)]">
                <div
                    className="relative h-[55%] bg-muted group cursor-pointer overflow-hidden"
                    onClick={() => setIsImageModalOpen(true)}
                >
                    <img
                        src={report.imageUrl}
                        alt="Animal"
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 top-0 p-4 flex justify-between items-start pointer-events-none">
                        {isInjured && (
                            <Badge variant="destructive" className="text-sm px-3 py-1 shadow-md">
                                🚨 Injured
                            </Badge>
                        )}
                        <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full shadow-md bg-white/90 hover:bg-white transition-all hover:scale-110 pointer-events-auto">
                            <Heart className="h-5 w-5 text-red-500" />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 p-5 overflow-y-auto no-scrollbar bg-[#fbf8f0]/50">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h3 className="text-xl font-bold capitalize">
                                {report.analysisResult?.animalType || "Unknown Animal"}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{report.location || "Unknown Location"}</span>
                            </div>
                        </div>
                        <span className="text-xs text-muted-foreground bg-white px-2 py-1 rounded-md border shadow-sm h-fit">
                            {formatDistanceToNow(createdDate, { addSuffix: true })}
                        </span>
                    </div>

                    <div className="space-y-4">
                        {/* Status Badge */}
                        <div className="mb-2">
                             <Badge variant={getBadgeVariant(statusLabel)} className="text-xs px-2 py-0.5 capitalize shadow-sm">
                                {statusLabel}
                            </Badge>
                        </div>

                        {/* Key Points */}
                        {keyPoints && (
                            <div className="bg-white/60 p-3 rounded-xl border border-black/5">
                                <ul className="text-sm text-foreground/80 space-y-1.5">
                                    {keyPoints.slice(0, 4).map((point: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <span className="text-primary block mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                                            <span className="leading-snug">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Description */}
                        {description && (
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <ImageModal />
        </>
    );
}
