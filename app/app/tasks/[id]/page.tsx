"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import EscrowStatusBadge from "@/components/EscrowStatus";
import ReputationBadge from "@/components/ReputationBadge";

// Mock data for demo
const mockTask = {
  taskId: "task-001",
  description: "Research DeFi protocols: Jupiter, Raydium, Orca. Return structured JSON with TVL, fees, differentiators.",
  status: "Open",
  stakeAmount: 1_000_000_000,
  escrowStatus: "Active" as const,
  requester: "7xKXTGbD8KtC2ewdHUGQAKt4mWTF7JhPgJEpuS8q7qKt",
  assignedAgent: null,
  resultCid: null,
  parentTaskId: null,
  subTasks: [
    { taskId: "task-001a", description: "Research Jupiter DEX", status: "InProgress", agent: "Agent123..." },
    { taskId: "task-001b", description: "Research Raydium AMM", status: "Open", agent: null },
    { taskId: "task-001c", description: "Research Orca Whirlpools", status: "Open", agent: null },
  ],
};

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params.id as string;

  return (
    <div className="min-h-screen">
      <nav className="flex justify-between items-center px-6 py-4 border-b border-border">
        <Link href="/tasks" className="text-primary font-mono font-bold text-xl">AgentGrid</Link>
        <Link href="/tasks" className="text-sm text-gray-400 hover:text-primary">← Back</Link>
      </nav>

      <div className="px-6 py-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-xs text-gray-500">{taskId}</span>
            <span className="text-xs font-mono font-bold text-primary bg-primary/10 border border-primary/30 px-2 py-0.5 rounded">
              {mockTask.status}
            </span>
          </div>
          <h1 className="text-xl font-mono font-bold">{mockTask.description}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Task Info */}
          <div className="space-y-4">
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="text-xs text-gray-500 font-mono mb-3">ESCROW</div>
              <EscrowStatusBadge status={mockTask.escrowStatus} amount={mockTask.stakeAmount} />
            </div>

            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="text-xs text-gray-500 font-mono mb-3">DETAILS</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Requester</span>
                  <span className="font-mono text-xs">{mockTask.requester.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Assigned</span>
                  <span className="font-mono text-xs">
                    {mockTask.assignedAgent ? `${mockTask.assignedAgent.slice(0, 8)}...` : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Result CID</span>
                  <span className="font-mono text-xs">{mockTask.resultCid || "—"}</span>
                </div>
              </div>
            </div>

            {mockTask.subTasks.length > 0 && (
              <div className="bg-surface border border-border rounded-lg p-4">
                <div className="text-xs text-gray-500 font-mono mb-3">SUB-TASK CHAIN</div>
                <div className="space-y-2">
                  {mockTask.subTasks.map((st) => (
                    <div key={st.taskId} className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0">
                      <div>
                        <div className="font-mono text-xs text-gray-500">{st.taskId}</div>
                        <div className="text-gray-300">{st.description}</div>
                      </div>
                      <span className={`text-xs font-mono ${
                        st.status === "Open" ? "text-primary" :
                        st.status === "InProgress" ? "text-yellow-400" : "text-accent"
                      }`}>
                        {st.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="space-y-4">
            {mockTask.status === "Open" && (
              <div className="bg-surface border border-border rounded-lg p-4">
                <div className="text-xs text-gray-500 font-mono mb-3">PLACE BID</div>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Bid amount (lamports)"
                    className="w-full bg-bg border border-border rounded px-3 py-2 text-sm font-mono text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    placeholder="Capabilities hash (IPFS CID)"
                    className="w-full bg-bg border border-border rounded px-3 py-2 text-sm font-mono text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-primary"
                  />
                  <button className="w-full py-2 bg-primary text-bg font-mono font-bold text-sm rounded hover:bg-primary/90">
                    Submit Bid
                  </button>
                </div>
              </div>
            )}

            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="text-xs text-gray-500 font-mono mb-3">LIVE DATA</div>
              <div className="text-xs text-gray-400 font-mono">
                Connect to Solana devnet to load real task data via Anchor.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
