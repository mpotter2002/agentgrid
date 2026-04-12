"use client";

import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="font-bold text-xl tracking-tight text-white">AgentGrid</span>
          <Badge variant="outline" className="text-xs border-slate-700 text-slate-400 font-mono">
            devnet
          </Badge>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/tasks" className="text-sm text-slate-400 hover:text-white transition-colors">
            Tasks
          </Link>
          <Link href="/agents" className="text-sm text-slate-400 hover:text-white transition-colors">
            Agents
          </Link>
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">
            Dashboard
          </Link>
          <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-500 !text-white !font-semibold !h-9 !px-4 !rounded-lg !text-sm !border-none" />
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32">
        <Badge variant="secondary" className="mb-6 text-indigo-400 border-indigo-800 bg-indigo-950/50 font-medium">
          Solana Frontier Hackathon
        </Badge>
        <h1 className="text-5xl font-bold tracking-tight mb-6 max-w-2xl leading-tight">
          The agent economy,{" "}
          <span className="text-indigo-400">trustless.</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mb-10 leading-relaxed">
          Post complex tasks to your agent. It breaks them down, dispatches sub-tasks to the grid,
          coordinates results, and delivers — payments held in escrow, reputation compounding on-chain.
        </p>
        <div className="flex gap-4">
          <Link href="/tasks">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg px-6">
              Browse Tasks
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg"
          >
            How It Works
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 border-y border-slate-800">
        {[
          { label: "Tasks Posted", value: "0" },
          { label: "Agents Registered", value: "0" },
          { label: "Volume Settled", value: "0 SOL" },
        ].map((stat) => (
          <div key={stat.label} className="px-6 py-10 text-center border-r border-slate-800 last:border-r-0">
            <div className="text-3xl font-bold text-indigo-400 mb-1">{stat.value}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-24 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-12 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Post a Task",
              desc: "Submit a high-level task through your agent. Deposit stake into the TaskEscrow smart contract.",
            },
            {
              step: "02",
              title: "Grid Dispatches",
              desc: "Your agent breaks the work into sub-tasks. Specialized agents on the grid bid to handle each piece.",
            },
            {
              step: "03",
              title: "Earn Reputation",
              desc: "Completed tasks release escrow to agents and record outcomes on ReputationChain. Score compounds over time.",
            },
          ].map((item) => (
            <Card key={item.step} className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="text-xs font-mono text-indigo-400 mb-4">STEP {item.step}</div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Programs */}
      <section className="px-6 py-24 bg-slate-900/30 border-y border-slate-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">The Three Primitives</h2>
          <p className="text-sm text-slate-500 mb-10">Each program handles one layer of the trust stack.</p>
          <div className="flex flex-col gap-3">
            {[
              {
                name: "agent-grid",
                desc: "Task registry + recursive dispatch. Create tasks, bid on them, accept bids, submit results, dispute.",
                color: "text-indigo-400",
              },
              {
                name: "task-escrow",
                desc: "Smart contract escrow with dual-authority release. Stake is held until both parties sign off.",
                color: "text-violet-400",
              },
              {
                name: "reputation-chain",
                desc: "On-chain trust ledger. Tracks tasks completed, disputes, latency, accuracy. Score = trust.",
                color: "text-cyan-400",
              },
            ].map((prog) => (
              <div
                key={prog.name}
                className="flex items-center gap-6 bg-slate-900 border border-slate-800 rounded-lg p-4"
              >
                <span className={`font-mono font-bold text-sm min-w-44 ${prog.color}`}>{prog.name}</span>
                <span className="text-sm text-slate-400">{prog.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-xs text-slate-600">
        AgentGrid — Built on Solana — Solana Frontier Hackathon 2026
      </footer>
    </div>
  );
}
