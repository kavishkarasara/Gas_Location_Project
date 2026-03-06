"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Navigation, MapPin, CheckCircle2, XCircle, Clock } from "lucide-react";
import type { GasStation } from "@/lib/db";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function StationDetails() {
    const params = useParams();
    const searchParams = useSearchParams();

    const id = params.id as string;
    const uLat = searchParams.get("ulat");
    const uLng = searchParams.get("ulng");

    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        // Read theme from document or localStorage if we had one globally
        const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
        setTheme(currentTheme);
    }, []);

    const { data, error, isLoading } = useSWR<{ success: boolean; data: GasStation[] }>(
        "/api/gas-stations",
        fetcher,
        { refreshInterval: 5000 }
    );

    if (isLoading) return <div style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>Loading station details...</div>;
    if (error || !data?.success) return <div style={{ padding: "40px", textAlign: "center", color: "#f87171" }}>Failed to load station data.</div>;

    const station = data.data.find(s => s.id === id);

    if (!station) {
        return <div style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>Station not found.</div>;
    }

    const renderBadge = (available: boolean, label: string) => (
        <div className={`badge ${available ? "badge-success" : "badge-danger"}`} style={{ display: "flex", width: "100%", justifyContent: "space-between", padding: "10px 15px", fontSize: "1rem" }}>
            <span>{label}</span>
            {available ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
        </div>
    );

    // Google Maps Embed URL for Directions
    // saddr = start address, daddr = destination address
    const mapEmbedUrl = `https://maps.google.com/maps?saddr=${uLat || ''},${uLng || ''}&daddr=${station.lat},${station.lng}&output=embed`;
    const nativeMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${uLat || ''},${uLng || ''}&destination=${station.lat},${station.lng}`;

    return (
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
            <Link href="/map" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#9ca3af", marginBottom: "20px", textDecoration: "none" }}>
                <ArrowLeft size={18} /> Back to Map
            </Link>

            <div className="glass-panel animate-fade-in" style={{ padding: "30px", marginBottom: "30px" }}>
                <h1 className="text-gradient" style={{ fontSize: "2.5rem", marginBottom: "10px" }}>{station.name}</h1>
                <p style={{ color: "#9ca3af", display: "flex", alignItems: "center", gap: "8px", fontSize: "1.1rem", marginBottom: "20px" }}>
                    <MapPin size={18} /> {station.location}
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b", fontSize: "0.9rem", marginBottom: "30px" }}>
                    <Clock size={16} /> Last updated: {station.updatedAt ? new Date(station.updatedAt).toLocaleTimeString() : "N/A"}
                </div>

                <h2 style={{ fontSize: "1.5rem", marginBottom: "20px", color: "var(--text-color)" }}>Current Stock Availability</h2>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                    {/* Litro Details */}
                    <div style={{ background: "var(--card-bg)", padding: "20px", borderRadius: "16px", border: "1px solid var(--card-border)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
                            <Image src="/litro.png" alt="Litro" width={40} height={60} style={{ objectFit: "contain" }} />
                            <h3 style={{ color: "#60a5fa", fontSize: "1.4rem", margin: 0 }}>LITRO GAS</h3>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {renderBadge(station.litro12_5kg, "12.5 kg Cylinder")}
                            {renderBadge(station.litro5kg, "5 kg Cylinder")}
                        </div>
                    </div>

                    {/* Laugfs Details */}
                    <div style={{ background: "var(--card-bg)", padding: "20px", borderRadius: "16px", border: "1px solid var(--card-border)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
                            <Image src="/laugfs.png" alt="Laugfs" width={40} height={60} style={{ objectFit: "contain" }} />
                            <h3 style={{ color: "#fbbf24", fontSize: "1.4rem", margin: 0 }}>LAUGFS GAS</h3>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {renderBadge(station.laugfs12_5kg, "12.5 kg Cylinder")}
                            {renderBadge(station.laugfs5kg, "5 kg Cylinder")}
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-panel animate-fade-in" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
                    <h2 style={{ fontSize: "1.5rem", color: "var(--text-color)", margin: 0 }}>Live Route & Navigation</h2>
                    <a
                        href={nativeMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px" }}
                    >
                        <Navigation size={18} /> Open in Maps App
                    </a>
                </div>

                <div style={{ width: "100%", borderRadius: "16px", overflow: "hidden", border: "1px solid var(--card-border)", background: "var(--card-bg)", height: "450px" }}>
                    <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        src={mapEmbedUrl}
                    ></iframe>
                </div>
            </div>
        </div>
    );
}
