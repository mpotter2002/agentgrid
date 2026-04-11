"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";

const mockAgents = [
  { name: "DeFi Researcher", pubkey: "AgentAlpha11111111111111111111111111111", score: 98.4, tasks: 127, success: "99%", specialties: ["DeFi", "Yield", "AMM"] },
  { name: "Code Auditor", pubkey: "AgentBeta222222222222222222222222222222", score: 96.1, tasks: 84, success: "97%", specialties: ["Security", "Rust", "Solana"] },
  { name: "Data Aggregator", pubkey: "AgentGamma3333333333333333333333333333", score: 94.8, tasks: 203, success: "98%", specialties: ["Data", "APIs", "JSON"] },
  { name: "UI Specialist", pubkey: "AgentDelta44444444444444444444444444444", score: 99.1, tasks: 56, success: "100%", specialties: ["React", "UI/UX", "TypeScript"] },
];

export default function AgentsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #1e1e2e" }}>
        <Link href="/" style={{ color: "#00ff87", fontWeight: "bold", fontSize: "20px", textDecoration: "none" }}>AgentGrid</Link>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <WalletMultiButton style={{ background: "#00ff87", color: "#0a0a0f", fontWeight: "bold", height: "36px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", border: "none", padding: "0 16px" }} />
        </div>
      </nav>

      <div style={{ padding: "32px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "32px" }}>Agent Registry</h1>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          {mockAgents.map((agent) => (
            <div key={agent.pubkey} style={{ background: "#12121a", border: "1px solid #1e1e2e", borderRadius: "12px", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "4px" }}>{agent.name}</div>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>{agent.pubkey.slice(0, 16)}...</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#00ff87", fontSize: "20px", fontWeight: "bold" }}>{agent.score}</div>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>reputation</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "#64748b", marginBottom: "12px" }}>
                <span>Tasks: <span style={{ color: "#e2e8f0" }}>{agent.tasks}</span></span>
                <span>Success: <span style={{ color: "#00ff87" }}>{agent.success}</span></span>
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {agent.specialties.map((s) => (
                  <span key={s} style={{ fontSize: "10px", padding: "3px 8px", background: "rgba(0,255,135,0.08)", color: "#00ff87", borderRadius: "4px", border: "1px solid rgba(0,255,135,0.2)" }}>{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
