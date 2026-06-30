"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(Array.isArray(data.message) ? data.message.join(", ") : data.message || "Registration failed");
        return;
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/");
    } catch {
      setError("Network error — is the backend running on port 3001?");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#f1f5f9",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block",
    fontSize: 13,
    fontWeight: 600 as const,
    color: "#94a3b8",
    marginBottom: 8,
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", padding: 16, fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 460, background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: "40px 36px", boxShadow: "0 40px 80px rgba(0,0,0,0.5)" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #10b981, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800, margin: "0 auto 16px", color: "#fff" }}>F</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#f1f5f9", margin: "0 0 6px" }}>Account Kholein</h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>FM Digital Bank join karein — bilkul free!</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#f87171", fontSize: 14 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Name row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>First Name</label>
              <input id="reg-firstname" type="text" name="firstName" required value={formData.firstName} onChange={handleChange} placeholder="Ali" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input id="reg-lastname" type="text" name="lastName" required value={formData.lastName} onChange={handleChange} placeholder="Hassan" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Email Address</label>
            <input id="reg-email" type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="ali@email.com" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Phone Number</label>
            <input id="reg-phone" type="text" name="phone" required value={formData.phone} onChange={handleChange} placeholder="03001234567" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input id="reg-password" type="password" name="password" required minLength={6} value={formData.password} onChange={handleChange} placeholder="••••••••" style={inputStyle} />
          </div>

          <button
            id="btn-register"
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "15px", borderRadius: 12, background: loading ? "#374151" : "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer", fontSize: 16, fontWeight: 700, marginTop: 4 }}
          >
            {loading ? "Creating account..." : "Account Banayein →"}
          </button>
        </form>

        <p style={{ marginTop: 24, textAlign: "center", fontSize: 14, color: "#64748b" }}>
          Pehle se account hai?{" "}
          <Link href="/login" style={{ color: "#60a5fa", textDecoration: "none", fontWeight: 600 }}>
            Login karein
          </Link>
        </p>
      </div>

      <style>{`
        input::placeholder { color: #475569; }
        input:focus { border-color: rgba(99,102,241,0.6) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.2); }
      `}</style>
    </div>
  );
}
