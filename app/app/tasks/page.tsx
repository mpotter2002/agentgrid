"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { getPrograms } from "@/lib/anchor";
import { useTasks, type TaskAccount } from "@/lib/hooks";

const statusColors: Record<string, string> = {
  Open: "bg-emerald-950/50 text-emerald-400 border-emerald-800",
  InProgress: "bg-amber-950/50 text-amber-400 border-amber-800",
  Submitted: "bg-blue-950/50 text-blue-400 border-blue-800",
  Approved: "bg-indigo-950/50 text-indigo-400 border-indigo-800",
  Disputed: "bg-red-950/50 text-red-400 border-red-800",
  Resolved: "bg-slate-800 text-slate-300 border-slate-700",
};

function normalizeStatus(status: TaskAccount["status"] | Record<string, unknown> | null | undefined) {
  if (typeof status === "string") {
    return status;
  }
  const raw = Object.keys(status ?? {})[0];
  return raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : "Unknown";
}

function formatSol(lamports: { toNumber?: () => number; toString: () => string } | number | bigint | null | undefined) {
  if (lamports == null) {
    return "0.00";
  }
  const value =
    typeof lamports === "number"
      ? lamports
      : typeof lamports === "bigint"
        ? Number(lamports)
        : lamports.toNumber
          ? lamports.toNumber()
          : Number(lamports.toString());
  return (value / 1e9).toFixed(2);
}

function formatRequester(address: string) {
  return `${address.slice(0, 8)}...${address.slice(-4)}`;
}

export default function TasksPage() {
  const [filter, setFilter] = useState("all");
  const { connection } = useConnection();
  const { tasks, loading, error } = useTasks();
  const [bidCounts, setBidCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;

    async function loadBidCounts() {
      try {
        const { agentGrid } = getPrograms("devnet");
        const allBids = await agentGrid.account.taskBid.all();
        if (cancelled) {
          return;
        }
        const counts = allBids.reduce<Record<string, number>>((acc, item) => {
          const taskId = item.account.taskId as string;
          acc[taskId] = (acc[taskId] ?? 0) + 1;
          return acc;
        }, {});
        setBidCounts(counts);
      } catch {
        if (!cancelled) {
          setBidCounts({});
        }
      }
    }

    void loadBidCounts();

    return () => {
      cancelled = true;
    };
  }, [connection]);

  const filteredTasks = useMemo(() => {
    const normalized = [...tasks].sort((a, b) => b.createdAt.toNumber() - a.createdAt.toNumber());
    if (filter === "all") {
      return normalized;
    }
    return normalized.filter((task) => normalizeStatus(task.status).toLowerCase() === filter.toLowerCase());
  }, [filter, tasks]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
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

        {error && (
          <Card className="bg-slate-900/50 border-red-800 mb-3">
            <CardContent className="p-4 md:p-5 text-sm text-red-400">
              Failed to load tasks from devnet: {error}
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col gap-3">
          {loading &&
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-4 md:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-20 bg-slate-800" />
                      <Skeleton className="h-5 w-20 bg-slate-800" />
                    </div>
                    <Skeleton className="h-4 w-24 bg-slate-800" />
                  </div>
                  <Skeleton className="h-4 w-full bg-slate-800 mb-2" />
                  <Skeleton className="h-4 w-4/5 bg-slate-800 mb-3" />
                  <div className="flex gap-4 md:gap-6">
                    <Skeleton className="h-4 w-24 bg-slate-800" />
                    <Skeleton className="h-4 w-24 bg-slate-800" />
                  </div>
                </CardContent>
              </Card>
            ))}

          {!loading && !error && filteredTasks.length === 0 && (
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-5 text-center">
                <p className="text-sm text-slate-400">
                  {tasks.length === 0 ? "No tasks found on devnet yet." : "No tasks match the selected filter."}
                </p>
              </CardContent>
            </Card>
          )}

          {!loading &&
            filteredTasks.map((task) => {
              const status = normalizeStatus(task.status);
              const requester = task.requester.toBase58();
              return (
                <Link key={task.taskId} href={`/tasks/${task.taskId}`} className="block">
                  <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
                    <CardContent className="p-4 md:p-5">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 font-mono">{task.taskId}</span>
                          <Badge variant="outline" className={`text-xs ${statusColors[status] ?? "border-slate-700"} border`}>
                            {status.toUpperCase()}
                          </Badge>
                        </div>
                        <span className="text-xs text-slate-500">
                          {task.deadlineBlocks ? `${task.deadlineBlocks.toString()} blocks` : formatRequester(requester)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 mb-3 leading-relaxed line-clamp-2">{task.description}</p>
                      <div className="flex gap-4 md:gap-6 text-xs text-slate-500">
                        <span>
                          Stake: <span className="text-indigo-400 font-semibold">{formatSol(task.stakeAmount)} SOL</span>
                        </span>
                        <span>
                          Bidders: <span className="text-white">{bidCounts[task.taskId] ?? 0}</span>
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
}
