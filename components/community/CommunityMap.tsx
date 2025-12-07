"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { renderToStaticMarkup } from "react-dom/server";
import { MapPin } from "lucide-react";

// Create a custom marker icon using a React component rendered to HTML
const createCustomIcon = () => {
    const iconHtml = renderToStaticMarkup(
        <div className="relative flex items-center justify-center w-10 h-10">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
            <div className="relative flex items-center justify-center w-8 h-8 bg-primary rounded-full shadow-lg border-2 border-white text-white">
                <MapPin className="w-5 h-5 fill-current" />
            </div>
            {/* Nav triangle at bottom */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-t-[8px] border-t-primary border-r-[6px] border-r-transparent" />
        </div>
    );

    return L.divIcon({
        html: iconHtml,
        className: "custom-leaflet-marker", // We'll need to ensure this class doesn't add unwanted styles or use it to clear defaults
        iconSize: [40, 40],
        iconAnchor: [20, 40], // Tip of the pin
        popupAnchor: [0, -40],
    });
};

interface CommunityMapProps {
    lat: number;
    lng: number;
    startLat?: number;
    startLng?: number;
    popupText?: string;
    isMobile?: boolean;
    isCollapsed?: boolean;
    isInView?: boolean;
    className?: string;
}

function MapUpdater({ lat, lng, startLat, startLng, isInView }: { lat: number; lng: number; startLat?: number; startLng?: number; isInView?: boolean }) {
    const map = useMap();
    const prevLoc = useRef<{ lat: number; lng: number } | null>(null);
    const hasAnimated = useRef(false);

    // Reset animation state when card leaves view
    useEffect(() => {
        if (!isInView) {
            hasAnimated.current = false;
        }
    }, [isInView]);

    useEffect(() => {
        // Scenario 1: Animation from Previous Post (Cinematic Mode)
        if (startLat && startLng) {
            if (!hasAnimated.current) {
                // Initialize/Hold at start location
                map.setView([startLat, startLng], 17);

                // Only start animation when in view
                if (isInView) {
                    hasAnimated.current = true;
                    // Initial context pause
                    const timer = setTimeout(() => {
                        map.flyTo([lat, lng], 17, {
                            duration: 2.5,
                            easeLinearity: 0.25
                        });
                        prevLoc.current = { lat, lng };
                    }, 500);
                    return () => clearTimeout(timer);
                }
                return; // Wait until in view
            }
        }

        // Scenario 2: Standard Behavior (Desktop or No Previous Location)
        if (!prevLoc.current) {
            // First load: instant jump if no cinematic start
             if (!startLat) {
                map.setView([lat, lng], 17);
            }
            prevLoc.current = { lat, lng };
            return;
        }

        // Scenario 3: Updates after initial load (e.g. desktop side-map updates)
        // If we are already animated or didn't need to, fly to new prop updates
        map.flyTo([lat, lng], 17, {
            duration: 2.0,
            easeLinearity: 0.25
        });

        prevLoc.current = { lat, lng };
    }, [lat, lng, startLat, startLng, isInView, map]);
    return null;
}

export default function CommunityMap({
    lat,
    lng,
    startLat,
    startLng,
    popupText,
    isMobile = false,
    isCollapsed = false,
    isInView = true, // Default true for desktop/fallback
    className,
}: CommunityMapProps) {
    const [customIcon, setCustomIcon] = useState<L.DivIcon | null>(null);

    useEffect(() => {
        setCustomIcon(createCustomIcon());
    }, []);

    const mobileVariants = {
        expanded: {
            position: "absolute" as const,
            // Removed top: 0, left: 0 to avoid animating to "auto"
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            zIndex: 40,
            borderRadius: "0px",
        },
        collapsed: {
            position: "absolute" as const,
            // Removed top: "auto", left: "auto"
            right: "0%", // Keeps anchor at right
            bottom: "23%", // Animates from 0 to 23%
            width: "100px",  // Animates from 100% to 100px
            height: "100px", // Animates from 100% to 100px
            zIndex: 40,
            borderRadius: "16px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            border: "4px solid white",
        },
    };

    const mapLayer = (
        <MapContainer
            center={[lat, lng]}
            zoom={17}
            scrollWheelZoom={!isMobile}
            zoomControl={false} // Remove +/- controls
            attributionControl={false} // Remove attribution text
            className="h-full w-full bg-[#faebd7]"
            style={{ background: "#f8f5f2" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                maxZoom={20}
            />
            {customIcon && (
                <Marker position={[lat, lng]} icon={customIcon}>
                    {popupText && <Popup className="font-sans">{popupText}</Popup>}
                </Marker>
            )}
            <MapUpdater lat={lat} lng={lng} startLat={startLat} startLng={startLng} isInView={isInView} />
        </MapContainer>
    );

    if (!isMobile) {
        return (
            <div className={cn("h-full w-full", className)}>
                {mapLayer}
            </div>
        );
    }

    return (
        <motion.div
            initial="expanded"
            animate={isCollapsed ? "collapsed" : "expanded"}
            variants={mobileVariants}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // smooth spring-like curve
            className={cn("overflow-hidden bg-muted", className)}
        >
            {mapLayer}
        </motion.div>
    );
}
