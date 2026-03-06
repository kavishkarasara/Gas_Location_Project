"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import { Navigation, MapPin, Search, CheckCircle2, XCircle, ArrowLeft, Crosshair, Sun, Moon, Globe } from "lucide-react";
import type { GasStation } from "@/lib/db";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const FALLBACK_LAT = 6.8850;
const FALLBACK_LNG = 79.8655;

type Lang = "EN" | "SI" | "TA";

const TRANSLATIONS = {
    EN: {
        usingLiveLocation: "Using your live location",
        locationFound: "You are currently in:",
        locationDenied: "Location denied",
        geoNotSupported: "Geolocation not supported",
        failedToLoad: "Failed to load gas stations",
        backToHome: "Back to Home",
        liveGasAvailability: "Live Gas Availability",
        searchLocations: "Search locations...",
        scanningStations: "Scanning for stations...",
        kmAway: "km away",
        updated: "Updated: ",
        getDirections: "Get Directions",
        noStations: "No stations found matching your search",
        languageName: "English"
    },
    SI: {
        usingLiveLocation: "ඔබේ සජීවී ස්ථානය භාවිත කරමින්",
        locationFound: "ඔබ දැනට සිටින්නේ:",
        locationDenied: "ස්ථානය ලබාගත නොහැක",
        geoNotSupported: "ස්ථානය සොයාගැනීමට සහය නොදක්වයි",
        failedToLoad: "දත්ත ලබාගැනීමේ දෝෂයක්",
        backToHome: "මුල් පිටුවට",
        liveGasAvailability: "සජීවී ගෑස් තොරතුරු",
        searchLocations: "ස්ථාන සොයන්න...",
        scanningStations: "දත්ත යාවත්කාලීන වෙමින් පවතී...",
        kmAway: "කි.මී දුරින්",
        updated: "යාවත්කාලීන කළේ: ",
        getDirections: "මග පෙන්වීම්",
        noStations: "ඔබේ සෙවීම සඳහා ස්ථාන හමු නොවීය",
        languageName: "සිංහල"
    },
    TA: {
        usingLiveLocation: "உங்கள் நேரடி இருப்பிடத்தைப் பயன்படுத்துகிறது",
        locationFound: "நீங்கள் தற்போது உள்ள இடம்:",
        locationDenied: "இருப்பிடம் மறுக்கப்பட்டது",
        geoNotSupported: "புவி இருப்பிடம் ஆதரிக்கப்படவில்லை",
        failedToLoad: "தரவை ஏற்றுவதில் பிழை",
        backToHome: "முகப்புக்குத் திரும்பு",
        liveGasAvailability: "தற்போதைய எரிவாயு இருப்பு",
        searchLocations: "இடங்களைத் தேடுக...",
        scanningStations: "நிலையங்களை தேடுகிறது...",
        kmAway: "கி.மீ தூரத்தில்",
        updated: "புதுப்பிக்கப்பட்டது: ",
        getDirections: "வழிகள்",
        noStations: "நிலையங்கள் கண்டறியப்படவில்லை",
        languageName: "தமிழ்"
    }
};

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d.toFixed(1);
}

export default function CustomerMap() {
    const [search, setSearch] = useState("");
    const [userLat, setUserLat] = useState(FALLBACK_LAT);
    const [userLng, setUserLng] = useState(FALLBACK_LNG);
    const [hasLocation, setHasLocation] = useState(false);

    const [theme, setTheme] = useState("dark");
    const [lang, setLang] = useState<Lang>("EN");

    // Derived state for the current translation
    const t = TRANSLATIONS[lang];
    const [locationStatus, setLocationStatus] = useState(t.usingLiveLocation);
    const [locationName, setLocationName] = useState("");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setUserLat(lat);
                    setUserLng(lng);
                    setHasLocation(true);
                    setLocationStatus(TRANSLATIONS[lang].usingLiveLocation);

                    try {
                        // OpenStreetMap Nominatim reverse geocoding
                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`);
                        const data = await res.json();
                        if (data && data.address) {
                            const name = data.address.city || data.address.town || data.address.village || data.address.suburb || data.name;
                            if (name) {
                                setLocationStatus(TRANSLATIONS[lang].locationFound);
                                setLocationName(name);
                            }
                        }
                    } catch (e) {
                        console.error("Reverse geocoding failed", e);
                    }
                },
                (error) => {
                    setLocationStatus(TRANSLATIONS[lang].locationDenied);
                    setHasLocation(false);
                }
            );
        } else {
            setLocationStatus(TRANSLATIONS[lang].geoNotSupported);
        }
    }, [lang]);

    const { data, error, isLoading } = useSWR<{ success: boolean; data: GasStation[] }>(
        "/api/gas-stations",
        fetcher,
        { refreshInterval: 2000 }
    );

    const cycleLanguage = () => {
        if (lang === "EN") setLang("SI");
        else if (lang === "SI") setLang("TA");
        else setLang("EN");
    };

    if (error) return <div style={{ padding: "40px", textAlign: "center" }}>{t.failedToLoad}</div>;

    let stations = data?.data || [];

    stations = stations.sort((a, b) => {
        const hasGasA = a.litro12_5kg || a.litro5kg || a.laugfs12_5kg || a.laugfs5kg;
        const hasGasB = b.litro12_5kg || b.litro5kg || b.laugfs12_5kg || b.laugfs5kg;

        if (hasGasA && !hasGasB) return -1;
        if (!hasGasA && hasGasB) return 1;

        const distA = getDistanceFromLatLonInKm(userLat, userLng, a.lat, a.lng);
        const distB = getDistanceFromLatLonInKm(userLat, userLng, b.lat, b.lng);
        return parseFloat(distA) - parseFloat(distB);
    });

    if (search) {
        stations = stations.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.location.toLowerCase().includes(search.toLowerCase()));
    }

    const renderBadge = (available: boolean, label: string) => (
        <div className={`badge ${available ? "badge-success" : "badge-danger"}`} style={{ display: "flex", width: "100%", justifyContent: "space-between", padding: "8px 12px" }}>
            <span>{label}</span>
            {available ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
        </div>
    );

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>
            <header style={{ marginBottom: "30px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#9ca3af" }}>
                        <ArrowLeft size={16} /> {t.backToHome}
                    </Link>

                    <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={cycleLanguage} className="btn btn-secondary" style={{ padding: "6px 12px", background: "var(--card-bg)" }}>
                            <Globe size={18} style={{ marginRight: "5px" }} /> {t.languageName}
                        </button>
                        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="btn btn-secondary" style={{ padding: "6px 12px", background: "var(--card-bg)" }}>
                            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
                    <div>
                        <h1 className="text-gradient" style={{ fontSize: "2.5rem" }}>{t.liveGasAvailability}</h1>
                        <p style={{ color: hasLocation ? "#34d399" : "#cbd5e1", display: "flex", alignItems: "center", gap: "8px" }}>
                            <Crosshair size={16} />
                            {locationStatus} {locationName && <span style={{ fontWeight: "bold", background: "rgba(52, 211, 153, 0.2)", padding: "2px 8px", borderRadius: "8px" }}>{locationName}</span>}
                        </p>
                    </div>

                    <div style={{ position: "relative", width: "100%", maxWidth: "300px" }}>
                        <Search size={20} style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                        <input
                            type="text"
                            placeholder={t.searchLocations}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="glass-panel"
                            style={{
                                width: "100%", padding: "12px 12px 12px 45px", borderRadius: "8px",
                                border: "1px solid var(--card-border)", outline: "none", fontSize: "16px", background: "transparent"
                            }}
                        />
                    </div>
                </div>
            </header>

            {isLoading ? (
                <div style={{ textAlign: "center", padding: "50px", color: "#9ca3af" }}>{t.scanningStations}</div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" }}>
                    {stations.map(station => (
                        <div key={station.id} className="glass-panel animate-fade-in" style={{ padding: "25px", display: "flex", flexDirection: "column", gap: "15px" }}>
                            <div>
                                <h3 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "5px" }}>{station.name}</h3>
                                <p style={{ color: "#9ca3af", display: "flex", alignItems: "center", gap: "5px", fontSize: "0.9rem" }}>
                                    <MapPin size={14} /> {station.location}
                                    <span style={{ marginLeft: "auto", background: "rgba(100,100,100,0.1)", padding: "2px 8px", borderRadius: "10px", fontSize: "0.8rem", color: "#60a5fa" }}>
                                        {getDistanceFromLatLonInKm(userLat, userLng, station.lat, station.lng)} {t.kmAway}
                                    </span>
                                </p>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "10px" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px", background: "var(--card-bg)", padding: "12px", borderRadius: "12px", border: "1px solid var(--card-border)" }}>
                                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "5px" }}>
                                        <Image src="/litro.png" alt="Litro Cylinder" width={60} height={90} style={{ objectFit: "contain", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))" }} />
                                    </div>
                                    <div style={{ fontSize: "0.9rem", color: "#60a5fa", fontWeight: "700", textAlign: "center", marginBottom: "5px" }}>LITRO</div>
                                    {renderBadge(station.litro12_5kg, "12.5 kg")}
                                    {renderBadge(station.litro5kg, "5 kg")}
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "8px", background: "var(--card-bg)", padding: "12px", borderRadius: "12px", border: "1px solid var(--card-border)" }}>
                                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "5px" }}>
                                        <Image src="/laugfs.png" alt="Laugfs Cylinder" width={60} height={90} style={{ objectFit: "contain", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))" }} />
                                    </div>
                                    <div style={{ fontSize: "0.9rem", color: "#fbbf24", fontWeight: "700", textAlign: "center", marginBottom: "5px" }}>LAUGFS</div>
                                    {renderBadge(station.laugfs12_5kg, "12.5 kg")}
                                    {renderBadge(station.laugfs5kg, "5 kg")}
                                </div>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "20px", borderTop: "1px solid var(--card-border)" }}>
                                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                                    {t.updated} {station.updatedAt ? new Date(station.updatedAt).toLocaleTimeString() : "N/A"}
                                </div>
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${station.lat},${station.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary"
                                    style={{ padding: "6px 14px", fontSize: "0.85rem", gap: "6px", display: "inline-flex", alignItems: "center" }}
                                >
                                    <Navigation size={14} /> {t.getDirections}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {stations.length === 0 && !isLoading && (
                <div style={{ textAlign: "center", padding: "50px", color: "#9ca3af", background: "var(--card-bg)", borderRadius: "16px" }}>
                    {t.noStations}
                </div>
            )}
        </div>
    );
}
