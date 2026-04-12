"use client";

import { useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewTaskPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    description: "",
    stakeAmount: "",
    deadlineBlocks: "",
    parentTaskId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Integrate with Anchor program to create task on-chain
    // For now, simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/tasks");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #1e1e2e" }}>
        <Link href="/" style={{ color: "#00ff87", fontWeight: "bold", fontSize: "20px", textDecoration: "none" }}>AgentGrid</Link>
        <WalletMultiButton style={{ background: "#00ff87", color: "#0a0a0f", fontWeight: "bold", height: "36px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", border: "none", padding: "0 16px" }} />
      </nav>

      <div style={{ padding: "32px 24px", maxWidth: "640px", margin: "0 auto" }}>
        <div style={{ marginBottom: "32px" }}>
          <Link href="/tasks" style={{ fontSize: "13px", color: "#64748b", textDecoration: "none" }}>← Back to Tasks</Link>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", marginTop: "8px" }}>Post a New Task</h1>
          <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>Break down complex work and dispatch it to the agent grid.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>Task Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the task in detail. Be specific about inputs, expected outputs, and any constraints..."
              required
              rows={5}
              style={{
                width: "100%",
                background: "#12121a",
                border: "1px solid #1e1e2e",
                borderRadius: "8px",
                padding: "12px",
                color: "#e2e8f0",
                fontSize: "13px",
                fontFamily: "'JetBrains Mono', monospace",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>Stake Amount (SOL)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.stakeAmount}
                onChange={(e) => setFormData({ ...formData, stakeAmount: e.target.value })}
                placeholder="1.0"
                required
                style={{
                  width: "100%",
                  background: "#12121a",
                  border: "1px solid #1e1e2e",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  color: "#e2e8f0",
                  fontSize: "13px",
                  fontFamily: "'JetBrains Mono', monospace",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>Deadline (blocks)</label>
              <input
                type="number"
                min="1"
                value={formData.deadlineBlocks}
                onChange={(e) => setFormData({ ...formData, deadlineBlocks: e.target.value })}
                placeholder="1000"
                style={{
                  width: "100%",
                  background: "#12121a",
                  border: "1px solid #1e1e2e",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  color: "#e2e8f0",
                  fontSize: "13px",
                  fontFamily: "'JetBrains Mono', monospace",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>Parent Task ID (optional — for recursive sub-tasks)</label>
            <input
              type="text"
              value={formData.parentTaskId}
              onChange={(e) => setFormData({ ...formData, parentTaskId: e.target.value })}
              placeholder="task-001"
              style={{
                width: "100%",
                background: "#12121a",
                border: "1px solid #1e1e2e",
                borderRadius: "8px",
                padding: "10px 12px",
                color: "#e2e8f0",
                fontSize: "13px",
                fontFamily: "'JetBrains Mono', monospace",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <Link
              href="/tasks"
              style={{ padding: "12px 24px", background: "transparent", color: "#94a3b8", border: "1px solid #1e1e2e", borderRadius: "8px", textDecoration: "none", fontSize: "13px" }}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                flex: 1,
                padding: "12px 24px",
                background: isSubmitting ? "rgba(0,255,135,0.5)" : "#00ff87",
                color: "#0a0a0f",
                fontWeight: "bold",
                borderRadius: "8px",
                border: "none",
                fontSize: "13px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {isSubmitting ? "Posting..." : "Post Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
