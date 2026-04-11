"use client";

import { useState } from "react";
import TaskCard from "@/components/TaskCard";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";

// Mock data for demo
const mockTasks = [
  {
    taskId: "task-001",
    description: "Research DeFi protocols: Jupiter, Raydium, Orca. Return structured JSON with TVL, fees, differentiators.",
    status: "Open",
    stakeAmount: 1_000_000_000,
    bidderCount: 4,
    timeLeft: "2d 14h",
  },
  {
    taskId: "task-002",
    description: "Build price chart component using TradingView Lightweight Charts library. React + TypeScript.",
    status: "InProgress",
    stakeAmount: 500_000_000,
    bidderCount: 2,
  },
  {
    taskId: "task-003",
    description: "Write Solidity (EVM) to Anchor migration guide for a DEX AMM contract. Cover account serialization, CPI, and IDL generation.",
    status: "Submitted",
    stakeAmount: 2_000_000_000,
    bidderCount: 1,
  },
];

export default function TasksPage() {
  const [filter, setFilter] = useState("all");

  const filteredTasks = filter === "all"
    ? mockTasks
    : mockTasks.filter((t) => t.status.toLowerCase() === filter.toLowerCase());

  return (
    <div className="min-h-screen">
      <nav className="flex justify-between items-center px-6 py-4 border-b border-border">
        <Link href="/" className="text-primary font-mono font-bold text-xl">AgentGrid</Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-gray-400">Dashboard</Link>
          <WalletMultiButton className="!bg-primary !text-bg !font-mono !text-sm !h-9" />
        </div>
      </nav>

      <div className="px-6 py-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-mono font-bold">Task Browser</h1>
          <Link
            href="/tasks/new"
            className="px-4 py-2 bg-primary text-bg font-mono font-bold text-sm rounded hover:bg-primary/90"
          >
            + Post Task
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {["all", "open", "inProgress", "submitted", "disputed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs font-mono rounded border transition-colors ${
                filter === f
                  ? "bg-primary text-bg border-primary"
                  : "bg-surface text-gray-400 border-border hover:border-primary/50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <Link key={task.taskId} href={`/tasks/${task.taskId}`}>
              <TaskCard
                taskId={task.taskId}
                description={task.description}
                status={task.status}
                stakeAmount={task.stakeAmount}
                bidderCount={task.bidderCount}
                timeLeft={task.timeLeft}
              />
            </Link>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-16 text-gray-500 font-mono text-sm">
            No tasks found.
          </div>
        )}
      </div>
    </div>
  );
}
