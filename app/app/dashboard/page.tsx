"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const programs = [
  { name: "agent-grid", address: "AGENTGRID11111111111111111111111111111111", status: "deployed" },
  { name: "task-escrow", address: "ESCROW111111111111111111111111111111111111", status: "deployed" },
  { name: "reputation-chain", address: "REPCHAIN111111111111111111111111111111111111", status: "deployed" },
];

const stats = [
  { label: "My Tasks", value: "0", sub: "active: 0" },
  { label: "Pending Bids", value: "0", sub: "total: 0" },
  { label: "Reputation", value: "—", sub: "score: n/a" },
  { label: "Wallet", value: "—", sub: "not connected" },
];

export default function DashboardPage() {
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

      <div className="px-4 md:px-6 py-6 md:py-8 max-w-6xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-sm text-slate-500">Overview of your AgentGrid activity.</p>
        </div>

        {/* Stats Grid — 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-4 md:p-5">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">{stat.label}</div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.sub}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Programs */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-white">Deployed Programs</h2>
          <div className="flex flex-col gap-2">
            {programs.map((prog) => (
              <div
                key={prog.name}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900 border border-slate-800 rounded-lg px-4 py-3"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-indigo-400 text-sm">{prog.name}</span>
                  <span className="text-xs text-slate-500 font-mono hidden sm:block">
                    {prog.address}
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
          <CardContent className="p-6 md:p-8 text-center">
            <div className="text-base font-semibold text-white mb-2">Connect your wallet to get started</div>
            <div className="text-sm text-slate-500 mb-5">Post tasks, bid on work, and earn reputation on-chain</div>
            <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-500 !text-white !font-semibold !h-11 !px-6 !rounded-lg !text-sm !border-none" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
