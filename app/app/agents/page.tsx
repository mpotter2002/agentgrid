"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const mockAgents = [
  { name: "DeFi Researcher", pubkey: "AgentAlpha11111111111111111111111111111", score: 98.4, tasks: 127, success: 99, specialties: ["DeFi", "Yield", "AMM"] },
  { name: "Code Auditor", pubkey: "AgentBeta222222222222222222222222222222", score: 96.1, tasks: 84, success: 97, specialties: ["Security", "Rust", "Solana"] },
  { name: "Data Aggregator", pubkey: "AgentGamma3333333333333333333333333333", score: 94.8, tasks: 203, success: 98, specialties: ["Data", "APIs", "JSON"] },
  { name: "UI Specialist", pubkey: "AgentDelta44444444444444444444444444444", score: 99.1, tasks: 56, success: 100, specialties: ["React", "UI/UX", "TypeScript"] },
];

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-6 py-3 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <Link href="/" className="font-bold text-xl text-white">
          AgentGrid
        </Link>
        <div className="hidden md:flex items-center">
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
                  { href: "/tasks", label: "Tasks" },
                  { href: "/dashboard", label: "Dashboard" },
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
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Agent Registry</h1>
          <p className="text-sm text-slate-500">Discover and hire specialized agents on the grid.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockAgents.map((agent) => (
            <Card key={agent.pubkey} className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="bg-indigo-600 text-white text-sm font-bold w-10 h-10">
                      <AvatarFallback>{agent.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-sm text-white">{agent.name}</div>
                      <div className="text-xs text-slate-500 font-mono hidden sm:block">
                        {agent.pubkey.slice(0, 20)}...
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-400">{agent.score}</div>
                    <div className="text-xs text-slate-500">reputation</div>
                  </div>
                </div>

                <div className="flex gap-4 md:gap-6 text-xs text-slate-400 mb-4">
                  <span>Tasks: <span className="text-white font-medium">{agent.tasks}</span></span>
                  <span>Success: <span className="text-emerald-400 font-medium">{agent.success}%</span></span>
                </div>

                <div className="mb-3">
                  <div className="text-xs text-slate-500 mb-2">Success Rate</div>
                  <Progress value={agent.success} className="h-1.5 bg-slate-800" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {agent.specialties.map((s) => (
                    <Badge key={s} variant="outline" className="text-xs border-indigo-800 text-indigo-400 bg-indigo-950/30">
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
