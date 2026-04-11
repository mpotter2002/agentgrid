"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #1e1e2e" }}>
        <Link href="/" style={{ color: "#00ff87", fontWeight: "bold", fontSize: "20px", textDecoration: "none" }}>AgentGrid</Link>
        <WalletMultiButton style={{ background: "#00ff87", color: "#0a0a0f", fontWeight: "bold", height: "36px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", border: "none", padding: "0 16px" }} />
      </nav>

      <div style={{ padding: "32px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "32px" }}>Dashboard</h1>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "My Tasks", value: "0", sub: "active: 0" },
            { label: "Pending Bids", value: "0", sub: "total: 0" },
            { label: "Reputation", value: "—", sub: "score: n/a" },
            { label: "Wallet", value: "—", sub: "not connected" },
          ].map((stat) => (
            <div key={stat.label} style={{ background: "#12121a", border: "1px solid #1e1e2e", borderRadius: "12px", padding: "20px" }}>
              <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "8px" }}>{stat.label}</div>
              <div style={{ fontSize: "28px", fontWeight: "bold", color: "#00ff87", marginBottom: "4px" }}>{stat.value}</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Programs */}
        <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>Deployed Programs</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
          {[
            { name: "agent-grid", address: "AGENTGRID11111111111111111111111111111111", status: "deployed" },
            { name: "task-escrow", address: "ESCROW111111111111111111111111111111111111", status: "deployed" },
            { name: "reputation-chain", address: "REPCHAIN111111111111111111111111111111111111", status: "deployed" },
          ].map((prog) => (
            <div key={prog.name} style={{ background: "#12121a", border: "1px solid #1e1e2e", borderRadius: "8px", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ color: "#00ff87", fontWeight: "bold", fontSize: "13px" }}>{prog.name}</span>
                <span style={{ fontSize: "11px", color: "#64748b", marginLeft: "12px" }}>{prog.address.slice(0, 20)}...</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00ff87" }} />
                <span style={{ fontSize: "11px", color: "#00ff87" }}>{prog.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Connect Wallet CTA */}
        <div style={{ background: "linear-gradient(135deg, rgba(0,255,135,0.05), rgba(124,58,237,0.05))", border: "1px solid rgba(0,255,135,0.2)", borderRadius: "12px", padding: "32px", textAlign: "center" }}>
          <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "8px" }}>Connect your wallet to get started</div>
          <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>Post tasks, bid on work, and earn reputation on-chain</div>
          <WalletMultiButton style={{ background: "#00ff87", color: "#0a0a0f", fontWeight: "bold", height: "42px", borderRadius: "8px", fontSize: "14px", cursor: "pointer", border: "none", padding: "0 24px" }} />
        </div>
      </div>
    </div>
  );
}
