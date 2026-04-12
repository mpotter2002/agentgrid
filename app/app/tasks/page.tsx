"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
    description: "Write Solidity (EVM) to Anchor migration guide for a DEX AMM contract.",
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
      : mockTasks.filter((t) => t.status.toLowerCase().replace(" ", "") === filter.toLowerCase());

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-6 py-3 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <Link href="/" className="font-bold text-xl text-white">
          AgentGrid
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">
            Dashboard
          </Link>
          <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-500 !text-white !font-semibold !h-9 !px-4 !rounded-lg !text-sm !border-none" />
        </div>
        <div className="flex md:hidden items-center gap-3">
          <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-500 !text-white !font-semibold !h-8 !px-3 !rounded-md !text-xs !border-none" />
          <Sheet>
            <SheetTrigger className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none">
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="top" className="w-full bg-slate-900 border-b border-slate-800 rounded-b-xl p-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4 p-4">
                <span className="font-bold text-base text-white mb-2 sm:mb-0">Menu</span>
                {[
                  { href: "/", label: "Home" },
                  { href: "/dashboard", label: "Dashboard" },
                  { href: "/agents", label: "Agents" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors w-full sm:w-auto"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <div className="px-4 md:px-6 py-6 md:py-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 md:mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Task Browser</h1>
            <p className="text-sm text-slate-500 mt-1">Browse and bid on tasks across the agent grid.</p>
          </div>
          <Link href="/tasks/new">
            <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-sm">
              + Post Task
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Tabs value={filter} onValueChange={setFilter} className="mb-5 md:mb-6">
          <TabsList className="bg-slate-900 border border-slate-800 w-full flex overflow-x-auto">
            {["all", "open", "inprogress", "submitted"].map((f) => (
              <TabsTrigger
                key={f}
                value={f}
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400 text-xs px-3 md:px-4 py-1.5 rounded-md flex-shrink-0"
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
                <CardContent className="p-4 md:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-mono">{task.taskId}</span>
                      <Badge variant="outline" className={`text-xs ${statusColors[task.status]} border`}>
                        {task.status.toUpperCase()}
                      </Badge>
                    </div>
                    <span className="text-xs text-slate-500">{task.timeLeft}</span>
                  </div>
                  <p className="text-sm text-slate-300 mb-3 leading-relaxed line-clamp-2">{task.description}</p>
                  <div className="flex gap-4 md:gap-6 text-xs text-slate-500">
                    <span>
                      Stake: <span className="text-indigo-400 font-semibold">{task.stakeAmount}</span>
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
