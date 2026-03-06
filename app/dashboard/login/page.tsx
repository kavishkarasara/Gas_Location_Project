"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";

export default function DealerLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (data.success) {
                // Mock auth persistence
                localStorage.setItem("sellerAuth", JSON.stringify(data.user));
                router.push("/dashboard");
            } else {
                setError(data.error || "Login failed");
            }
        } catch {
            setError("An error occurred during login.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "20px" }}>
            <div className="glass-panel animate-fade-in" style={{ width: "100%", maxWidth: "400px", padding: "40px 30px" }}>
                <h2 className="text-gradient" style={{ textAlign: "center", marginBottom: "30px" }}>Dealer Login</h2>

                {error && (
                    <div className="badge badge-danger" style={{ display: "flex", marginBottom: "20px", width: "100%", justifyContent: "center" }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div style={{ position: "relative" }}>
                        <User size={20} style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{
                                width: "100%", padding: "12px 12px 12px 45px", borderRadius: "8px",
                                border: "1px solid var(--card-border)", background: "rgba(0,0,0,0.2)", color: "white", outline: "none", fontSize: "16px"
                            }}
                        />
                    </div>

                    <div style={{ position: "relative" }}>
                        <Lock size={20} style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                        <input
                            type="password"
                            placeholder="Password (admin / 1234)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: "100%", padding: "12px 12px 12px 45px", borderRadius: "8px",
                                border: "1px solid var(--card-border)", background: "rgba(0,0,0,0.2)", color: "white", outline: "none", fontSize: "16px"
                            }}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", marginTop: "10px", height: "45px" }}>
                        {loading ? "Authenticating..." : "Login"}
                    </button>

                    <p style={{ textAlign: "center", fontSize: "0.9rem", color: "#9ca3af", marginTop: "10px" }}>
                        Don't have a shop account? <a href="/dashboard/signup" style={{ color: "#60a5fa" }}>Register here</a>
                    </p>
                </form>
            </div>
        </div>
    );
}
