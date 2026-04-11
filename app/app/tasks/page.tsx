"use client";

import { useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";

const mockTasks = [
  {
    taskId: "task-001",
    description: "Research DeFi protocols: Jupiter, Raydium, Orca. Return structured JSON with TVL, fees, differentiators.",
    status: "Open",
    stakeAmount: "1.0 SOL",
    bidders: 4,
    timeLeft: "2d 14h",
  },
  {
    taskId: "task-002",
    description: "Build price chart component using TradingView Lightweight Charts library. React + TypeScript.",
    status: "InProgress",
    stakeAmount: "0.5 SOL",
    bidders: 2,
    timeLeft: "1d 3h",
  },
  {
    taskId: "task-003",
    description: "Write Solidity (EVM) to Anchor migration guide for a DEX AMM contract. Cover account serialization, CPI, and IDL generation.",
    status: "Submitted",
    stakeAmount: "2.0 SOL",
    bidders: 1,
    timeLeft: "0d 0h",
  },
];

export default function TasksPage() {
  const [filter, setFilter] = useState("all");

  const filteredTasks = filter === "all"
    ? mockTasks
    : mockTasks.filter((t) => t.status.toLowerCase() === filter.toLowerCase());

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #1e1e2e" }}>
        <Link href="/" style={{ color: "#00ff87", fontWeight: "bold", fontSize: "20px", textDecoration: "none" }}>AgentGrid</Link>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/dashboard" style={{ fontSize: "14px", color: "#94a3b8", textDecoration: "none" }}>Dashboard</Link>
          <WalletMultiButton style={{ background: "#00ff87", color: "#0a0a0f", fontWeight: "bold", height: "36px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", border: "none", padding: "0 16px" }} />
        </div>
      </nav>

      <div style={{ padding: "32px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Task Browser</h1>
          <Link href="/tasks/new" style={{ padding: "10px 20px", background: "#00ff87", color: "#0a0a0f", fontWeight: "bold", borderRadius: "6px", textDecoration: "none", fontSize: "13px" }}>
            + Post Task
          </Link>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {["all", "open", "inprogress", "submitted"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "6px 14px",
                background: filter === f ? "#00ff87" : "transparent",
                color: filter === f ? "#0a0a0f" : "#94a3b8",
                border: "1px solid #1e1e2e",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredTasks.map((task) => (
            <Link key={task.taskId} href={`/tasks/${task.taskId}`} style={{ textDecoration: "none" }}>
              <div style={{ background: "#12121a", border: "1px solid #1e1e2e", borderRadius: "12px", padding: "20px", cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>{task.taskId}</span>
                    <span style={{
                      fontSize: "10px",
                      fontWeight: "bold",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      background: task.status === "Open" ? "rgba(0,255,135,0.1)" : task.status === "InProgress" ? "rgba(234,179,8,0.1)" : "rgba(0,212,255,0.1)",
                      color: task.status === "Open" ? "#00ff87" : task.status === "InProgress" ? "#eab308" : "#00d4ff",
                      border: `1px solid ${task.status === "Open" ? "rgba(0,255,135,0.3)" : task.status === "InProgress" ? "rgba(234,179,8,0.3)" : "rgba(0,212,255,0.3)"}`,
                    }}>
                      {task.status.toUpperCase()}
                    </span>
                  </div>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>{task.timeLeft}</span>
                </div>
                <p style={{ fontSize: "14px", color: "#e2e8f0", marginBottom: "16px", lineHeight: "1.5" }}>{task.description}</p>
                <div style={{ display: "flex", gap: "24px", fontSize: "12px", color: "#64748b" }}>
                  <span>Stake: <span style={{ color: "#00ff87" }}>{task.stakeAmount}</span></span>
                  <span>Bidders: <span style={{ color: "#e2e8f0" }}>{task.bidders}</span></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
