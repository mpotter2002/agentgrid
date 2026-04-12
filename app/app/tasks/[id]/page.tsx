"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const mockTask = {
  taskId: "task-001",
  description:
    "Research DeFi protocols: Jupiter, Raydium, Orca. Return structured JSON with TVL, fees, differentiators.",
  status: "Open",
  stakeAmount: "1.0 SOL",
  escrowStatus: "Active",
  requester: "7xKXTGbD8KtC2ewdHUGQAKt4mWTF7JhPgJEpuS8q7qKt",
  subTasks: [
    {
      taskId: "task-001a",
      description: "Research Jupiter DEX aggregator",
      status: "InProgress",
      agent: "Agent123... *_verified",
    },
    {
      taskId: "task-001b",
      description: "Research Raydium AMM liquidity pools",
      status: "Open",
      agent: null,
    },
    {
      taskId: "task-001c",
      description: "Research Orca Whirlpools concentrated liquidity",
      status: "Open",
      agent: null,
    },
  ],
};

const statusColors: Record<string, string> = {
  Open: "bg-emerald-950/50 text-emerald-400 border-emerald-800",
  InProgress: "bg-amber-950/50 text-amber-400 border-amber-800",
  Submitted: "bg-blue-950/50 text-blue-400 border-blue-800",
};

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params.id as string;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <Link href="/" className="font-bold text-xl text-white">
          AgentGrid
        </Link>
        <Link href="/tasks" className="text-sm text-slate-400 hover:text-white transition-colors">
          ← Back to Tasks
        </Link>
      </nav>

      <div className="px-6 py-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs text-slate-500 font-mono">{taskId}</span>
            <Badge variant="outline" className={`text-xs border ${statusColors[mockTask.status]}`}>
              {mockTask.status.toUpperCase()}
            </Badge>
          </div>
          <h1 className="text-xl font-semibold leading-relaxed text-white">{mockTask.description}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            {/* Escrow Card */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Escrow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-emerald-400 font-semibold text-sm">{mockTask.escrowStatus}</span>
                  <span className="text-white font-bold text-sm ml-auto">{mockTask.stakeAmount}</span>
                </div>
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Details
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {[
                  { label: "Requester", value: `${mockTask.requester.slice(0, 8)}...` },
                  { label: "Assigned", value: "—" },
                  { label: "Result CID", value: "—" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">{row.label}</span>
                    <span className="text-slate-300 font-mono text-xs">{row.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Sub-task Chain */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Sub-task Chain
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-0">
                {mockTask.subTasks.map((st, i) => (
                  <div
                    key={st.taskId}
                    className={`flex items-start justify-between py-3 ${i < mockTask.subTasks.length - 1 ? "border-b border-slate-800" : ""}`}
                  >
                    <div className="flex-1">
                      <div className="text-xs text-slate-500 font-mono mb-1">{st.taskId}</div>
                      <div className="text-sm text-slate-300">{st.description}</div>
                      {st.agent && (
                        <div className="text-xs text-indigo-400 mt-1">{st.agent}</div>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ml-3 shrink-0 border ${statusColors[st.status]}`}
                    >
                      {st.status.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            {/* Place Bid */}
            {mockTask.status === "Open" && (
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    Place Bid
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-500">Bid Amount (SOL)</label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="0.5"
                      className="bg-slate-950 border-slate-700 text-slate-200 text-sm focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-500">Capabilities Hash (IPFS CID)</label>
                    <Input
                      type="text"
                      placeholder="QmXxx..."
                      className="bg-slate-950 border-slate-700 text-slate-200 text-sm focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold mt-1">
                    Submit Bid
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Live Data */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Live Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Connect to Solana devnet to load real task data via Anchor.
                </p>
              </CardContent>
            </Card>

            {/* Task Actions */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Link href="/tasks" className="flex-1">
                    <Button variant="outline" className="w-full border-slate-700 text-slate-400 hover:bg-slate-800 text-sm">
                      Back
                    </Button>
                  </Link>
                  <Button variant="outline" className="flex-1 border-slate-700 text-slate-400 hover:bg-slate-800 text-sm">
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
