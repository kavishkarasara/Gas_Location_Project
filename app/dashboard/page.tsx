"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { LogOut, Fuel, CircleCheck, CircleX } from "lucide-react";
import type { GasStation } from "@/lib/db";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<{ id: string; name: string; stationId: string; role: string } | null>(null);

    useEffect(() => {
        const auth = localStorage.getItem("sellerAuth");
        if (!auth) {
            router.push("/dashboard/login");
        } else {
            setUser(JSON.parse(auth));
        }
    }, [router]);

    const { data, mutate } = useSWR<{ success: boolean; data: GasStation[] }>("/api/gas-stations", fetcher, {
        revalidateOnFocus: false, // Prevent auto-revalidation knocking out auth or states
    });

    const handleLogout = () => {
        localStorage.removeItem("sellerAuth");
        router.push("/");
    };

    const handleToggle = async (field: keyof GasStation, currentValue: boolean) => {
        if (!user) return;

        // Optimistic UI update
        const currentStations = data?.data || [];
        const updatedStations = currentStations.map(station => {
            if (station.id === user.stationId) {
                return { ...station, [field]: !currentValue };
            }
            return station;
        });

        mutate({ success: true, data: updatedStations }, false);

        // Actual API call
        await fetch("/api/gas-stations/update", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: user.stationId,
                updates: { [field]: !currentValue }
            }),
        });

        mutate(); // Re-validate
    };

    if (!user || !data) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <p>Loading Dashboard...</p>
            </div>
        );
    }

    const myStation = data.data.find(s => s.id === user.stationId);

    if (!myStation) {
        return <div style={{ padding: "40px", textAlign: "center" }}>Error: Station profile not found.</div>;
    }

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
                <div>
                    <h1 className="text-gradient" style={{ fontSize: "2rem" }}>Dealer Dashboard</h1>
                    <p style={{ color: "#9ca3af" }}>Welcome, {user.name} ({myStation.name})</p>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ display: "flex", gap: "8px" }}>
                    <LogOut size={16} /> Logout
                </button>
            </header>

            <div className="glass-panel animate-fade-in" style={{ padding: "30px" }}>
                <h2 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <Fuel color="#3b82f6" /> Stock Availability Controls
                </h2>
                <p style={{ color: "#cbd5e1", marginBottom: "30px", fontSize: "0.95rem" }}>
                    Toggle the buttons below to update your stock status in real-time. Customers looking for gas will immediately see these updates.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>

                    {/* Litro 12.5kg */}
                    <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "15px", background: "rgba(0,0,0,0.2)" }}>
                        <div style={{ fontSize: "1.2rem", fontWeight: "600", color: "#60a5fa" }}>Litro 12.5kg</div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ color: myStation.litro12_5kg ? "#34d399" : "#f87171", fontWeight: "500" }}>
                                {myStation.litro12_5kg ? "In Stock" : "Out of Stock"}
                            </span>
                            <button
                                onClick={() => handleToggle("litro12_5kg", myStation.litro12_5kg as boolean)}
                                className={`btn ${myStation.litro12_5kg ? "btn-secondary" : "btn-primary"}`}
                                style={{ padding: "8px 16px", background: myStation.litro12_5kg ? "" : "var(--primary)" }}
                            >
                                {myStation.litro12_5kg ? <CircleX size={18} /> : <CircleCheck size={18} />}
                                {myStation.litro12_5kg ? <span style={{ marginLeft: 5 }}>Mark Empty</span> : <span style={{ marginLeft: 5 }}>Mark Available</span>}
                            </button>
                        </div>
                    </div>

                    {/* Litro 5kg */}
                    <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "15px", background: "rgba(0,0,0,0.2)" }}>
                        <div style={{ fontSize: "1.2rem", fontWeight: "600", color: "#60a5fa" }}>Litro 5kg</div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ color: myStation.litro5kg ? "#34d399" : "#f87171", fontWeight: "500" }}>
                                {myStation.litro5kg ? "In Stock" : "Out of Stock"}
                            </span>
                            <button
                                onClick={() => handleToggle("litro5kg", myStation.litro5kg as boolean)}
                                className={`btn ${myStation.litro5kg ? "btn-secondary" : "btn-primary"}`}
                                style={{ padding: "8px 16px" }}
                            >
                                {myStation.litro5kg ? <CircleX size={18} /> : <CircleCheck size={18} />}
                                {myStation.litro5kg ? <span style={{ marginLeft: 5 }}>Mark Empty</span> : <span style={{ marginLeft: 5 }}>Mark Available</span>}
                            </button>
                        </div>
                    </div>

                    {/* Laugfs 12.5kg */}
                    <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "15px", background: "rgba(0,0,0,0.2)" }}>
                        <div style={{ fontSize: "1.2rem", fontWeight: "600", color: "#fbbf24" }}>Laugfs 12.5kg</div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ color: myStation.laugfs12_5kg ? "#34d399" : "#f87171", fontWeight: "500" }}>
                                {myStation.laugfs12_5kg ? "In Stock" : "Out of Stock"}
                            </span>
                            <button
                                onClick={() => handleToggle("laugfs12_5kg", myStation.laugfs12_5kg as boolean)}
                                className={`btn ${myStation.laugfs12_5kg ? "btn-secondary" : "btn-primary"}`}
                                style={{ padding: "8px 16px" }}
                            >
                                {myStation.laugfs12_5kg ? <CircleX size={18} /> : <CircleCheck size={18} />}
                                {myStation.laugfs12_5kg ? <span style={{ marginLeft: 5 }}>Mark Empty</span> : <span style={{ marginLeft: 5 }}>Mark Available</span>}
                            </button>
                        </div>
                    </div>

                    {/* Laugfs 5kg */}
                    <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "15px", background: "rgba(0,0,0,0.2)" }}>
                        <div style={{ fontSize: "1.2rem", fontWeight: "600", color: "#fbbf24" }}>Laugfs 5kg</div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ color: myStation.laugfs5kg ? "#34d399" : "#f87171", fontWeight: "500" }}>
                                {myStation.laugfs5kg ? "In Stock" : "Out of Stock"}
                            </span>
                            <button
                                onClick={() => handleToggle("laugfs5kg", myStation.laugfs5kg as boolean)}
                                className={`btn ${myStation.laugfs5kg ? "btn-secondary" : "btn-primary"}`}
                                style={{ padding: "8px 16px" }}
                            >
                                {myStation.laugfs5kg ? <CircleX size={18} /> : <CircleCheck size={18} />}
                                {myStation.laugfs5kg ? <span style={{ marginLeft: 5 }}>Mark Empty</span> : <span style={{ marginLeft: 5 }}>Mark Available</span>}
                            </button>
                        </div>
                    </div>

                </div>

                <div style={{ marginTop: "30px", fontSize: "0.85rem", color: "#64748b", textAlign: "right" }}>
                    Last updated: {new Date(myStation.updatedAt).toLocaleTimeString()}
                </div>
            </div>

            {/* Simulated Live Customer Insight section */}
            <div className="glass-panel animate-fade-in" style={{ padding: "30px", marginTop: "20px" }}>
                <h2 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "1.2rem", color: "#34d399" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    Live Customers Nearby
                </h2>
                <div style={{ background: "rgba(0,0,0,0.2)", padding: "15px", borderRadius: "12px", border: "1px solid var(--card-border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: "10px" }}>
                        <span style={{ color: "#cbd5e1" }}>Customers looking for gas near {myStation.location}:</span>
                        <span style={{ color: "#34d399", fontWeight: "bold" }}>{Math.floor(Math.random() * 50) + 12} Active</span>
                    </div>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", color: "#9ca3af", fontSize: "0.9rem" }}>
                        <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3b82f6", display: "inline-block" }}></span> Customer 2.1km away is searching for Litro 12.5kg</li>
                        <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fbbf24", display: "inline-block" }}></span> Customer 4.3km away is searching for Laugfs 5kg</li>
                        <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3b82f6", display: "inline-block" }}></span> Customer 0.8km away is viewing your profile</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
