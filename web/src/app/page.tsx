"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_BASE = "http://localhost:3001";

interface WalletData {
  balance: number;
  currency: string;
  walletNumber: string;
  status: string;
}

interface Transaction {
  id: string;
  referenceNo: string;
  amount: number;
  transactionType: string;
  status: string;
  description: string;
  direction: "credit" | "debit";
  createdAt: string;
}

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositDesc, setDepositDesc] = useState("");
  const [sendTo, setSendTo] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [sendDesc, setSendDesc] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const router = useRouter();

  const getToken = () => localStorage.getItem("token");

  const fetchWallet = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/wallet/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setWallet(data);
      }
    } catch {}
  }, []);

  const fetchTransactions = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/wallet/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        const u = JSON.parse(storedUser);
        setUser(u);
        fetchWallet().finally(() => setLoading(false));
        fetchTransactions();
      } catch {
        localStorage.removeItem("user");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [fetchWallet, fetchTransactions]);

  const showMsg = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setWallet(null);
    router.refresh();
  };

  const handleDeposit = async () => {
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) return showMsg("Please enter a valid amount", "error");
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/wallet/deposit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ amount: amt, description: depositDesc || "Self deposit" }),
      });
      const data = await res.json();
      if (res.ok) {
        showMsg(`✅ PKR ${amt.toLocaleString()} deposited successfully!`, "success");
        setDepositAmount("");
        setDepositDesc("");
        setShowDepositModal(false);
        await fetchWallet();
        await fetchTransactions();
      } else {
        showMsg(data.message || "Deposit failed", "error");
      }
    } catch {
      showMsg("Network error. Is backend running?", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSend = async () => {
    const amt = parseFloat(sendAmount);
    if (!sendTo.trim()) return showMsg("Please enter recipient wallet number", "error");
    if (!amt || amt <= 0) return showMsg("Please enter a valid amount", "error");
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/wallet/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ toWalletNumber: sendTo, amount: amt, description: sendDesc }),
      });
      const data = await res.json();
      if (res.ok) {
        showMsg(`✅ PKR ${amt.toLocaleString()} sent successfully!`, "success");
        setSendTo("");
        setSendAmount("");
        setSendDesc("");
        setShowSendModal(false);
        await fetchWallet();
        await fetchTransactions();
      } else {
        showMsg(data.message || "Transfer failed", "error");
      }
    } catch {
      showMsg("Network error. Is backend running?", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const txIcon = (tx: Transaction) => {
    if (tx.transactionType === "deposit") return "↓";
    if (tx.direction === "credit") return "↓";
    return "↑";
  };

  const txColor = (tx: Transaction) => {
    if (tx.direction === "credit") return "#10b981";
    return "#ef4444";
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", fontFamily: "'Inter', 'Segoe UI', sans-serif", color: "#f1f5f9" }}>
      {/* Message Toast */}
      {message && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999,
          padding: "14px 22px", borderRadius: 12,
          background: message.type === "success" ? "linear-gradient(135deg, #064e3b, #065f46)" : "linear-gradient(135deg, #7f1d1d, #991b1b)",
          border: `1px solid ${message.type === "success" ? "#10b981" : "#ef4444"}`,
          color: "#fff", fontSize: 14, fontWeight: 500, boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
          animation: "slideIn 0.3s ease"
        }}>
          {message.text}
        </div>
      )}

      {/* Header */}
      <header style={{ padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700 }}>F</div>
          <span style={{ fontSize: 18, fontWeight: 700, background: "linear-gradient(135deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>FM Digital Bank</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {user ? (
            <>
              <span style={{ fontSize: 14, color: "#94a3b8" }}>👤 {user.firstName} {user.lastName}</span>
              <button onClick={handleLogout} style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", color: "#f87171", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#e2e8f0", textDecoration: "none", fontSize: 13 }}>Login</Link>
              <Link href="/register" style={{ padding: "8px 16px", borderRadius: 8, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>Register</Link>
            </>
          )}
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        {!user ? (
          /* Landing Page */
          <div style={{ textAlign: "center", paddingTop: 80 }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>🏦</div>
            <h1 style={{ fontSize: 48, fontWeight: 800, margin: "0 0 16px", background: "linear-gradient(135deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>FM Digital Bank</h1>
            <p style={{ fontSize: 18, color: "#94a3b8", marginBottom: 40, maxWidth: 500, margin: "0 auto 40px" }}>Pakistan ka smart digital bank. Apne paise manage karein asani se.</p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
              <Link href="/register" style={{ padding: "14px 32px", borderRadius: 12, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "#fff", textDecoration: "none", fontSize: 16, fontWeight: 700 }}>Account Kholein →</Link>
              <Link href="/login" style={{ padding: "14px 32px", borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#e2e8f0", textDecoration: "none", fontSize: 16 }}>Login</Link>
            </div>
          </div>
        ) : loading ? (
          <div style={{ textAlign: "center", paddingTop: 100, color: "#94a3b8" }}>Loading...</div>
        ) : (
          <>
            {/* Balance Card */}
            <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2d1b69 100%)", borderRadius: 24, padding: "36px 40px", marginBottom: 24, border: "1px solid rgba(99,102,241,0.3)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(139,92,246,0.1)" }} />
              <div style={{ position: "absolute", bottom: -60, left: -20, width: 180, height: 180, borderRadius: "50%", background: "rgba(59,130,246,0.08)" }} />
              <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase" }}>Total Balance</p>
              <h2 style={{ fontSize: 52, fontWeight: 800, margin: "0 0 4px", color: "#f1f5f9" }}>
                PKR {wallet ? Number(wallet.balance).toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
              </h2>
              {wallet && (
                <p style={{ fontSize: 13, color: "#64748b", marginBottom: 28 }}>Wallet: {wallet.walletNumber}</p>
              )}
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <button
                  id="btn-add-money"
                  onClick={() => setShowDepositModal(true)}
                  style={{ padding: "12px 28px", borderRadius: 12, background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700, letterSpacing: "0.02em" }}
                >
                  + Add Money
                </button>
                <button
                  id="btn-send-money"
                  onClick={() => setShowSendModal(true)}
                  style={{ padding: "12px 28px", borderRadius: 12, background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700 }}
                >
                  ↑ Send Money
                </button>
                <button
                  onClick={async () => { await fetchWallet(); await fetchTransactions(); showMsg("Refreshed!", "success"); }}
                  style={{ padding: "12px 20px", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#94a3b8", cursor: "pointer", fontSize: 14 }}
                >
                  ↻ Refresh
                </button>
              </div>
            </div>

            {/* Transactions */}
            <div style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(10px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.08)", padding: "28px 32px" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: "#e2e8f0" }}>Recent Transactions</h3>
              {transactions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 0", color: "#475569" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                  <p>Koi transaction nahi. "Add Money" se start karein!</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {transactions.map((tx) => (
                    <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 42, height: 42, borderRadius: "50%", background: tx.direction === "credit" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: txColor(tx) }}>
                          {txIcon(tx)}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#e2e8f0" }}>
                            {tx.transactionType === "deposit" ? "Amount Added" : tx.transactionType === "transfer" && tx.direction === "credit" ? "Money Received" : "Money Sent"}
                          </p>
                          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b" }}>{tx.description || tx.referenceNo} • {formatDate(tx.createdAt)}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: txColor(tx) }}>
                          {tx.direction === "credit" ? "+" : "-"}PKR {Number(tx.amount).toLocaleString("en-PK", { minimumFractionDigits: 2 })}
                        </p>
                        <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "rgba(16,185,129,0.1)", color: "#10b981" }}>{tx.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "linear-gradient(135deg, #1e293b, #0f172a)", borderRadius: 24, padding: "36px", width: "100%", maxWidth: 440, border: "1px solid rgba(99,102,241,0.3)", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#f1f5f9" }}>💰 Add Money</h2>
              <button onClick={() => setShowDepositModal(false)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 22 }}>✕</button>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 8 }}>Amount (PKR)</label>
              <input
                id="deposit-amount"
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="e.g. 5000"
                style={{ width: "100%", padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#f1f5f9", fontSize: 16, outline: "none", boxSizing: "border-box" }}
                onKeyDown={(e) => e.key === "Enter" && handleDeposit()}
              />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 8 }}>Note (optional)</label>
              <input
                type="text"
                value={depositDesc}
                onChange={(e) => setDepositDesc(e.target.value)}
                placeholder="e.g. Salary"
                style={{ width: "100%", padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#f1f5f9", fontSize: 15, outline: "none", boxSizing: "border-box" }}
              />
            </div>
            {/* Quick amounts */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
              {[1000, 5000, 10000, 50000].map(amt => (
                <button key={amt} onClick={() => setDepositAmount(String(amt))} style={{ flex: 1, padding: "10px 8px", borderRadius: 10, background: depositAmount === String(amt) ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.06)", border: `1px solid ${depositAmount === String(amt) ? "#10b981" : "rgba(255,255,255,0.1)"}`, color: depositAmount === String(amt) ? "#10b981" : "#94a3b8", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                  {amt >= 1000 ? `${amt/1000}K` : amt}
                </button>
              ))}
            </div>
            <button
              id="btn-confirm-deposit"
              onClick={handleDeposit}
              disabled={actionLoading || !depositAmount}
              style={{ width: "100%", padding: "16px", borderRadius: 14, background: actionLoading ? "#374151" : "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", cursor: actionLoading ? "not-allowed" : "pointer", fontSize: 16, fontWeight: 700 }}
            >
              {actionLoading ? "Processing..." : "Confirm Deposit"}
            </button>
          </div>
        </div>
      )}

      {/* Send Modal */}
      {showSendModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "linear-gradient(135deg, #1e293b, #0f172a)", borderRadius: 24, padding: "36px", width: "100%", maxWidth: 440, border: "1px solid rgba(59,130,246,0.3)", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#f1f5f9" }}>↑ Send Money</h2>
              <button onClick={() => setShowSendModal(false)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 22 }}>✕</button>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 8 }}>Recipient Wallet Number</label>
              <input
                id="send-to-wallet"
                type="text"
                value={sendTo}
                onChange={(e) => setSendTo(e.target.value)}
                placeholder="10-digit wallet number"
                style={{ width: "100%", padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#f1f5f9", fontSize: 15, outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 8 }}>Amount (PKR)</label>
              <input
                id="send-amount"
                type="number"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                placeholder="e.g. 2000"
                style={{ width: "100%", padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#f1f5f9", fontSize: 16, outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 8 }}>Note (optional)</label>
              <input
                type="text"
                value={sendDesc}
                onChange={(e) => setSendDesc(e.target.value)}
                placeholder="e.g. Rent"
                style={{ width: "100%", padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#f1f5f9", fontSize: 15, outline: "none", boxSizing: "border-box" }}
              />
            </div>
            {wallet && (
              <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20, textAlign: "center" }}>
                Available Balance: <strong style={{ color: "#10b981" }}>PKR {Number(wallet.balance).toLocaleString()}</strong>
              </p>
            )}
            <button
              id="btn-confirm-send"
              onClick={handleSend}
              disabled={actionLoading || !sendTo || !sendAmount}
              style={{ width: "100%", padding: "16px", borderRadius: 14, background: actionLoading ? "#374151" : "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff", border: "none", cursor: actionLoading ? "not-allowed" : "pointer", fontSize: 16, fontWeight: 700 }}
            >
              {actionLoading ? "Sending..." : "Send Money"}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: #475569; }
        input:focus { border-color: rgba(99,102,241,0.5) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        button:hover { opacity: 0.9; transform: translateY(-1px); transition: all 0.2s; }
      `}</style>
    </div>
  );
}
