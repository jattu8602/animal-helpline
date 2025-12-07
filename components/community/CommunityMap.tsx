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
    popupText?: string;
    isMobile?: boolean;
    isCollapsed?: boolean;
    className?: string;
}

function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
    const map = useMap();
    const prevLoc = useRef<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        if (!prevLoc.current) {
            // First load: instant jump
            map.setView([lat, lng], 17);
            prevLoc.current = { lat, lng };
            return;
        }

        // Subsequent updates: Fly with animation
        // flyTo automatically zooms out and in for distant points
        map.flyTo([lat, lng], 17, {
            duration: 2.0, // Slower duration to emphasize the "flight"
            easeLinearity: 0.1
        });

        prevLoc.current = { lat, lng };
    }, [lat, lng, map]);
    return null;
}

export default function CommunityMap({
    lat,
    lng,
    popupText,
    isMobile = false,
    isCollapsed = false,
    className,
}: CommunityMapProps) {
    const [customIcon, setCustomIcon] = useState<L.DivIcon | null>(null);

    useEffect(() => {
        setCustomIcon(createCustomIcon());
    }, []);

    const mobileVariants = {
        expanded: {
            position: "absolute" as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            zIndex: 40,
            borderRadius: "0px",
        },
        collapsed: {
            position: "absolute" as const,
            top: "auto",
            left: "auto",
            right: "5%",
            bottom: "5%",
            width: "120px",
            height: "120px",
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
            <MapUpdater lat={lat} lng={lng} />
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
