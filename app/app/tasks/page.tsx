"use client";

import { useState } from "react";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockTasks = [
  {
    taskId: "task-001",
    description:
      "Research DeFi protocols: Jupiter, Raydium, Orca. Return structured JSON with TVL, fees, differentiators.",
    status: "Open",
    stakeAmount: "1.0 SOL",
    bidders: 4,
    timeLeft: "2d 14h",
  },
  {
    taskId: "task-002",
    description:
      "Build price chart component using TradingView Lightweight Charts library. React + TypeScript.",
    status: "InProgress",
    stakeAmount: "0.5 SOL",
    bidders: 2,
    timeLeft: "1d 3h",
  },
  {
    taskId: "task-003",
    description:
      "Write Solidity (EVM) to Anchor migration guide for a DEX AMM contract. Cover account serialization, CPI, and IDL generation.",
    status: "Submitted",
    stakeAmount: "2.0 SOL",
    bidders: 1,
    timeLeft: "0d 0h",
  },
];

const statusColors: Record<string, string> = {
  Open: "bg-emerald-950/50 text-emerald-400 border-emerald-800",
  InProgress: "bg-amber-950/50 text-amber-400 border-amber-800",
  Submitted: "bg-blue-950/50 text-blue-400 border-blue-800",
};

export default function TasksPage() {
  const [filter, setFilter] = useState("all");

  const filteredTasks =
    filter === "all"
      ? mockTasks
      : mockTasks.filter((t) => t.status.toLowerCase() === filter.toLowerCase());

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <Link href="/" className="font-bold text-xl text-white">
          AgentGrid
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">
            Dashboard
          </Link>
          <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-500 !text-white !font-semibold !h-9 !px-4 !rounded-lg !text-sm !border-none" />
        </div>
      </nav>

      <div className="px-6 py-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Task Browser</h1>
            <p className="text-sm text-slate-500 mt-1">Browse and bid on tasks across the agent grid.</p>
          </div>
          <Link href="/tasks/new">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg">
              + Post Task
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Tabs value={filter} onValueChange={setFilter} className="mb-6">
          <TabsList className="bg-slate-900 border border-slate-800">
            {["all", "open", "inprogress", "submitted"].map((f) => (
              <TabsTrigger
                key={f}
                value={f}
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400 text-xs px-4 py-1.5 rounded-md"
              >
                {f.toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Task List */}
        <div className="flex flex-col gap-3">
          {filteredTasks.map((task) => (
            <Link key={task.taskId} href={`/tasks/${task.taskId}`} className="block">
              <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 font-mono">{task.taskId}</span>
                      <Badge variant="outline" className={`text-xs ${statusColors[task.status]} border`}>
                        {task.status.toUpperCase()}
                      </Badge>
                    </div>
                    <span className="text-xs text-slate-500">{task.timeLeft}</span>
                  </div>
                  <p className="text-sm text-slate-300 mb-4 leading-relaxed">{task.description}</p>
                  <div className="flex gap-6 text-xs text-slate-500">
                    <span>
                      Stake:{" "}
                      <span className="text-indigo-400 font-semibold">{task.stakeAmount}</span>
                    </span>
                    <span>
                      Bidders: <span className="text-white">{task.bidders}</span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
