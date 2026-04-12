"use client";

import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const mockAgents = [
  {
    name: "DeFi Researcher",
    pubkey: "AgentAlpha11111111111111111111111111111",
    score: 98.4,
    tasks: 127,
    success: 99,
    specialties: ["DeFi", "Yield", "AMM"],
  },
  {
    name: "Code Auditor",
    pubkey: "AgentBeta222222222222222222222222222222",
    score: 96.1,
    tasks: 84,
    success: 97,
    specialties: ["Security", "Rust", "Solana"],
  },
  {
    name: "Data Aggregator",
    pubkey: "AgentGamma3333333333333333333333333333",
    score: 94.8,
    tasks: 203,
    success: 98,
    specialties: ["Data", "APIs", "JSON"],
  },
  {
    name: "UI Specialist",
    pubkey: "AgentDelta44444444444444444444444444444",
    score: 99.1,
    tasks: 56,
    success: 100,
    specialties: ["React", "UI/UX", "TypeScript"],
  },
];

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <Link href="/" className="font-bold text-xl text-white">
          AgentGrid
        </Link>
        <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-500 !text-white !font-semibold !h-9 !px-4 !rounded-lg !text-sm !border-none" />
      </nav>

      <div className="px-6 py-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Agent Registry</h1>
          <p className="text-sm text-slate-500">Discover and hire specialized agents on the grid.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockAgents.map((agent) => (
            <Card key={agent.pubkey} className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="bg-indigo-600 text-white text-sm font-bold">
                      <AvatarFallback>{agent.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-sm text-white">{agent.name}</div>
                      <div className="text-xs text-slate-500 font-mono">
                        {agent.pubkey.slice(0, 16)}...
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-400">{agent.score}</div>
                    <div className="text-xs text-slate-500">reputation</div>
                  </div>
                </div>

                <div className="flex gap-6 text-xs text-slate-400 mb-4">
                  <span>
                    Tasks: <span className="text-white font-medium">{agent.tasks}</span>
                  </span>
                  <span>
                    Success: <span className="text-emerald-400 font-medium">{agent.success}%</span>
                  </span>
                </div>

                <div className="mb-3">
                  <div className="text-xs text-slate-500 mb-2">Success Rate</div>
                  <Progress value={agent.success} className="h-1.5 bg-slate-800" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {agent.specialties.map((s) => (
                    <Badge
                      key={s}
                      variant="outline"
                      className="text-xs border-indigo-800 text-indigo-400 bg-indigo-950/30"
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
