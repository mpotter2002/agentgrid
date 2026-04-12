"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Menu, ArrowLeft } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-6 py-3 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link href="/tasks" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Tasks</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
        <span className="font-bold text-lg text-white absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0 sm:text-xl">AgentGrid</span>
        <div className="w-8 sm:w-auto" />
      </nav>

      <div className="px-4 md:px-6 py-6 md:py-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs text-slate-500 font-mono">{taskId}</span>
            <Badge variant="outline" className={`text-xs border ${statusColors[mockTask.status]}`}>
              {mockTask.status.toUpperCase()}
            </Badge>
          </div>
          <h1 className="text-lg md:text-xl font-semibold leading-relaxed text-white">{mockTask.description}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            {/* Escrow Card */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-2 md:pb-3 pt-4 px-4 md:px-5">
                <CardTitle className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Escrow</CardTitle>
              </CardHeader>
              <CardContent className="px-4 md:px-5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-emerald-400 font-semibold text-sm">{mockTask.escrowStatus}</span>
                  <span className="text-white font-bold text-sm ml-auto">{mockTask.stakeAmount}</span>
                </div>
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-2 md:pb-3 pt-4 px-4 md:px-5">
                <CardTitle className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Details</CardTitle>
              </CardHeader>
              <CardContent className="px-4 md:px-5 pb-4 flex flex-col gap-2.5">
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
              <CardHeader className="pb-2 md:pb-3 pt-4 px-4 md:px-5">
                <CardTitle className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Sub-task Chain</CardTitle>
              </CardHeader>
              <CardContent className="px-4 md:px-5 pb-4 flex flex-col gap-0">
                {mockTask.subTasks.map((st, i) => (
                  <div
                    key={st.taskId}
                    className={`flex items-start justify-between py-3 ${i < mockTask.subTasks.length - 1 ? "border-b border-slate-800" : ""}`}
                  >
                    <div className="flex-1 min-w-0 mr-3">
                      <div className="text-xs text-slate-500 font-mono mb-1">{st.taskId}</div>
                      <div className="text-sm text-slate-300 leading-relaxed">{st.description}</div>
                      {st.agent && <div className="text-xs text-indigo-400 mt-1">{st.agent}</div>}
                    </div>
                    <Badge variant="outline" className={`text-xs shrink-0 border ${statusColors[st.status]}`}>
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
                <CardHeader className="pb-2 md:pb-3 pt-4 px-4 md:px-5">
                  <CardTitle className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Place Bid</CardTitle>
                </CardHeader>
                <CardContent className="px-4 md:px-5 pb-4 flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-500">Bid Amount (SOL)</label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="0.5"
                      className="bg-slate-950 border-slate-700 text-slate-200 text-sm focus:border-indigo-500 h-10"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-500">Capabilities Hash (IPFS CID)</label>
                    <Input
                      type="text"
                      placeholder="QmXxx..."
                      className="bg-slate-950 border-slate-700 text-slate-200 text-sm focus:border-indigo-500 font-mono h-10"
                    />
                  </div>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold mt-1 h-10 text-sm">
                    Submit Bid
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Live Data */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-2 md:pb-3 pt-4 px-4 md:px-5">
                <CardTitle className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Live Data</CardTitle>
              </CardHeader>
              <CardContent className="px-4 md:px-5 pb-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Connect to Solana devnet to load real task data via Anchor.
                </p>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-4 flex gap-3">
                <Link href="/tasks" className="flex-1">
                  <Button variant="outline" className="w-full border-slate-700 text-slate-400 hover:bg-slate-800 text-sm h-9">
                    Back
                  </Button>
                </Link>
                <Button variant="outline" className="flex-1 border-slate-700 text-slate-400 hover:bg-slate-800 text-sm h-9">
                  Share
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
