"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

// Create a custom marker icon using a React component rendered to HTML
const createCustomIcon = () => {
    const iconHtml = renderToStaticMarkup(
        <div className="relative flex items-center justify-center w-10 h-10">
            <div className="relative flex items-center justify-center w-8 h-8 bg-primary rounded-full shadow-lg border-2 border-white text-white">
                <MapPin className="w-5 h-5 fill-current" />
            </div>
            {/* Nav triangle at bottom */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-t-[8px] border-t-primary border-r-[6px] border-r-transparent" />
        </div>
    );

    return L.divIcon({
        html: iconHtml,
        className: "custom-leaflet-marker",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
    });
};

interface MapViewProps {
    lat: number;
    lng: number;
    popupText?: string;
    className?: string;
}

export default function MapView({ lat, lng, popupText, className }: MapViewProps) {
    const [customIcon, setCustomIcon] = useState<L.DivIcon | null>(null);

    useEffect(() => {
        setCustomIcon(createCustomIcon());
    }, []);

    return (
        <div className={className || "h-[200px] w-full rounded-md overflow-hidden"}>
            <MapContainer
                center={[lat, lng]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%", background: "#f8f5f2" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                {customIcon && (
                    <Marker position={[lat, lng]} icon={customIcon}>
                        {popupText && <Popup className="font-sans">{popupText}</Popup>}
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}
