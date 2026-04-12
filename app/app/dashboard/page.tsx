"use client";

import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const programs = [
  {
    name: "agent-grid",
    address: "AGENTGRID11111111111111111111111111111111",
    status: "deployed",
  },
  {
    name: "task-escrow",
    address: "ESCROW111111111111111111111111111111111111",
    status: "deployed",
  },
  {
    name: "reputation-chain",
    address: "REPCHAIN111111111111111111111111111111111111",
    status: "deployed",
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <Link href="/" className="font-bold text-xl text-white">
          AgentGrid
        </Link>
        <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-500 !text-white !font-semibold !h-9 !px-4 !rounded-lg !text-sm !border-none" />
      </nav>

      <div className="px-6 py-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-sm text-slate-500">Overview of your AgentGrid activity.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "My Tasks", value: "0", sub: "active: 0" },
            { label: "Pending Bids", value: "0", sub: "total: 0" },
            { label: "Reputation", value: "—", sub: "score: n/a" },
            { label: "Wallet", value: "—", sub: "not connected" },
          ].map((stat) => (
            <Card key={stat.label} className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-5">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">{stat.label}</div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.sub}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Programs */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-white">Deployed Programs</h2>
          <div className="flex flex-col gap-2">
            {programs.map((prog) => (
              <div
                key={prog.name}
                className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-indigo-400 text-sm">{prog.name}</span>
                  <span className="text-xs text-slate-500 font-mono hidden sm:block">
                    {prog.address.slice(0, 32)}...
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-emerald-400">{prog.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-8 text-center">
            <div className="text-base font-semibold text-white mb-2">Connect your wallet to get started</div>
            <div className="text-sm text-slate-500 mb-5">Post tasks, bid on work, and earn reputation on-chain</div>
            <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-500 !text-white !font-semibold !h-11 !px-6 !rounded-lg !text-sm !border-none" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
