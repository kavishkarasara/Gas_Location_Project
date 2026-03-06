"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Store, MapPin, User, Lock, Crosshair } from "lucide-react";

export default function DealerSignup() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        shopName: "",
        location: "",
        lat: "",
        lng: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                localStorage.setItem("sellerAuth", JSON.stringify(data.user));
                router.push("/dashboard");
            } else {
                setError(data.error || "Registration failed");
            }
        } catch {
            setError("An error occurred during sign up.");
        } finally {
            setLoading(false);
        }
    };

    const getLocation = () => {
        setGettingLocation(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData({
                        ...formData,
                        lat: position.coords.latitude.toString(),
                        lng: position.coords.longitude.toString()
                    });
                    setGettingLocation(false);
                },
                (error) => {
                    setError("Failed to get location. Please enter manually.");
                    setGettingLocation(false);
                }
            );
        } else {
            setError("Geolocation is not supported by your browser");
            setGettingLocation(false);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "20px" }}>
            <div className="glass-panel animate-fade-in" style={{ width: "100%", maxWidth: "500px", padding: "40px 30px" }}>
                <h2 className="text-gradient" style={{ textAlign: "center", marginBottom: "10px" }}>Register Dealer</h2>
                <p style={{ textAlign: "center", color: "#9ca3af", marginBottom: "30px", fontSize: "0.9rem" }}>Create a new shop and let customers find you</p>

                {error && (
                    <div className="badge badge-danger" style={{ display: "flex", marginBottom: "20px", width: "100%", justifyContent: "center" }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                        <div style={{ position: "relative" }}>
                            <User size={20} style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                            <input
                                type="text"
                                placeholder="Username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                                style={{
                                    width: "100%", padding: "12px 12px 12px 45px", borderRadius: "8px",
                                    border: "1px solid var(--card-border)", background: "rgba(0,0,0,0.2)", color: "white", outline: "none"
                                }}
                            />
                        </div>
                        <div style={{ position: "relative" }}>
                            <Lock size={20} style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                            <input
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                style={{
                                    width: "100%", padding: "12px 12px 12px 45px", borderRadius: "8px",
                                    border: "1px solid var(--card-border)", background: "rgba(0,0,0,0.2)", color: "white", outline: "none"
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ position: "relative" }}>
                        <Store size={20} style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                        <input
                            type="text"
                            placeholder="Shop Name (e.g. Mahinda Gas Center)"
                            value={formData.shopName}
                            onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                            required
                            style={{
                                width: "100%", padding: "12px 12px 12px 45px", borderRadius: "8px",
                                border: "1px solid var(--card-border)", background: "rgba(0,0,0,0.2)", color: "white", outline: "none"
                            }}
                        />
                    </div>

                    <div style={{ position: "relative" }}>
                        <MapPin size={20} style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                        <input
                            type="text"
                            placeholder="Address / Area Description"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            required
                            style={{
                                width: "100%", padding: "12px 12px 12px 45px", borderRadius: "8px",
                                border: "1px solid var(--card-border)", background: "rgba(0,0,0,0.2)", color: "white", outline: "none"
                            }}
                        />
                    </div>

                    <div style={{ background: "rgba(0,0,0,0.1)", padding: "15px", borderRadius: "8px", border: "1px solid var(--card-border)" }}>
                        <label style={{ display: "block", marginBottom: "10px", color: "#cbd5e1", fontSize: "0.9rem" }}>Shop GPS Coordinates</label>
                        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                            <input type="text" placeholder="Latitude" value={formData.lat} onChange={(e) => setFormData({ ...formData, lat: e.target.value })} required style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--card-border)", background: "rgba(0,0,0,0.2)", color: "white", outline: "none" }} />
                            <input type="text" placeholder="Longitude" value={formData.lng} onChange={(e) => setFormData({ ...formData, lng: e.target.value })} required style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--card-border)", background: "rgba(0,0,0,0.2)", color: "white", outline: "none" }} />
                        </div>
                        <button type="button" onClick={getLocation} className="btn btn-secondary" style={{ width: "100%", fontSize: "0.9rem", padding: "8px" }}>
                            <Crosshair size={16} style={{ marginRight: "8px" }} /> {gettingLocation ? "Detecting..." : "Use Current Location"}
                        </button>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", marginTop: "10px", height: "45px" }}>
                        {loading ? "Creating Shop..." : "Register"}
                    </button>

                    <p style={{ textAlign: "center", fontSize: "0.9rem", color: "#9ca3af", marginTop: "10px" }}>
                        Already have an account? <Link href="/dashboard/login" style={{ color: "#60a5fa" }}>Login here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
