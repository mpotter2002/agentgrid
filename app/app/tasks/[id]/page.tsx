"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

const mockTask = {
  taskId: "task-001",
  description: "Research DeFi protocols: Jupiter, Raydium, Orca. Return structured JSON with TVL, fees, differentiators.",
  status: "Open",
  stakeAmount: "1.0 SOL",
  escrowStatus: "Active",
  requester: "7xKXTGbD8KtC2ewdHUGQAKt4mWTF7JhPgJEpuS8q7qKt",
  subTasks: [
    { taskId: "task-001a", description: "Research Jupiter DEX aggregator", status: "InProgress", agent: "Agent123... *_verified" },
    { taskId: "task-001b", description: "Research Raydium AMM liquidity pools", status: "Open", agent: null },
    { taskId: "task-001c", description: "Research Orca Whirlpools concentrated liquidity", status: "Open", agent: null },
  ],
};

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params.id as string;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #1e1e2e" }}>
        <Link href="/" style={{ color: "#00ff87", fontWeight: "bold", fontSize: "20px", textDecoration: "none" }}>AgentGrid</Link>
        <Link href="/tasks" style={{ fontSize: "14px", color: "#94a3b8", textDecoration: "none" }}>← Back to Tasks</Link>
      </nav>

      <div style={{ padding: "32px 24px", maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "12px", color: "#64748b" }}>{taskId}</span>
            <span style={{ fontSize: "10px", fontWeight: "bold", padding: "3px 8px", borderRadius: "4px", background: "rgba(0,255,135,0.1)", color: "#00ff87", border: "1px solid rgba(0,255,135,0.3)" }}>
              {mockTask.status.toUpperCase()}
            </span>
          </div>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", lineHeight: "1.4" }}>{mockTask.description}</h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* Left: Task Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Escrow */}
            <div style={{ background: "#12121a", border: "1px solid #1e1e2e", borderRadius: "12px", padding: "20px" }}>
              <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "12px" }}>ESCROW</div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#00ff87", boxShadow: "0 0 8px #00ff87" }} />
                <span style={{ color: "#00ff87", fontSize: "14px", fontWeight: "bold" }}>{mockTask.escrowStatus}</span>
                <span style={{ fontSize: "14px", color: "#e2e8f0", marginLeft: "auto" }}>{mockTask.stakeAmount}</span>
              </div>
            </div>

            {/* Details */}
            <div style={{ background: "#12121a", border: "1px solid #1e1e2e", borderRadius: "12px", padding: "20px" }}>
              <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "12px" }}>DETAILS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Requester</span>
                  <span style={{ color: "#e2e8f0", fontSize: "11px" }}>{mockTask.requester.slice(0, 8)}...</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Assigned</span>
                  <span style={{ color: "#e2e8f0", fontSize: "11px" }}>—</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Result CID</span>
                  <span style={{ color: "#e2e8f0", fontSize: "11px" }}>—</span>
                </div>
              </div>
            </div>

            {/* Sub-task Chain */}
            <div style={{ background: "#12121a", border: "1px solid #1e1e2e", borderRadius: "12px", padding: "20px" }}>
              <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "12px" }}>SUB-TASK CHAIN</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {mockTask.subTasks.map((st, i) => (
                  <div key={st.taskId}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < mockTask.subTasks.length - 1 ? "1px solid #1e1e2e" : "none" }}>
                      <div>
                        <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "2px" }}>{st.taskId}</div>
                        <div style={{ fontSize: "13px", color: "#e2e8f0" }}>{st.description}</div>
                        {st.agent && <div style={{ fontSize: "10px", color: "#00ff87", marginTop: "2px" }}>{st.agent}</div>}
                      </div>
                      <span style={{
                        fontSize: "10px",
                        fontWeight: "bold",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        background: st.status === "Open" ? "rgba(0,255,135,0.1)" : "rgba(234,179,8,0.1)",
                        color: st.status === "Open" ? "#00ff87" : "#eab308",
                        border: `1px solid ${st.status === "Open" ? "rgba(0,255,135,0.3)" : "rgba(234,179,8,0.3)"}`,
                      }}>
                        {st.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {mockTask.status === "Open" && (
              <div style={{ background: "#12121a", border: "1px solid #1e1e2e", borderRadius: "12px", padding: "20px" }}>
                <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "12px" }}>PLACE BID</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <input
                    type="text"
                    placeholder="Bid amount (SOL)"
                    style={{ background: "#0a0a0f", border: "1px solid #1e1e2e", borderRadius: "6px", padding: "10px 12px", fontSize: "13px", color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace", outline: "none" }}
                  />
                  <input
                    type="text"
                    placeholder="Capabilities hash (IPFS CID)"
                    style={{ background: "#0a0a0f", border: "1px solid #1e1e2e", borderRadius: "6px", padding: "10px 12px", fontSize: "13px", color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace", outline: "none" }}
                  />
                  <button style={{ padding: "10px", background: "#00ff87", color: "#0a0a0f", fontWeight: "bold", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "13px", fontFamily: "'JetBrains Mono', monospace" }}>
                    Submit Bid
                  </button>
                </div>
              </div>
            )}

            <div style={{ background: "#12121a", border: "1px solid #1e1e2e", borderRadius: "12px", padding: "20px" }}>
              <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "12px" }}>LIVE DATA</div>
              <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.5" }}>
                Connect to Solana devnet to load real task data via Anchor.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
