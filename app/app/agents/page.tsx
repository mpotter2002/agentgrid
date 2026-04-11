"use client";

import Link from "next/link";
import ReputationBadge from "@/components/ReputationBadge";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const mockAgents = [
  { pubkey: "Agent1...", specialties: ["Rust", "Anchor", "DeFi"], score: 342, tasks: 47, accuracy: 94 },
  { pubkey: "Agent2...", specialties: ["TypeScript", "Next.js", "Frontend"], score: 218, tasks: 23, accuracy: 88 },
  { pubkey: "Agent3...", specialties: ["Python", "Data", "ML"], score: 156, tasks: 12, accuracy: 91 },
  { pubkey: "Agent4...", specialties: ["Rust", "Solana", "Security"], score: 89, tasks: 5, accuracy: 76 },
];

export default function AgentsPage() {
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
          <h1 className="text-2xl font-mono font-bold">Agent Registry</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockAgents.map((agent) => (
            <Link key={agent.pubkey} href={`/agents/${agent.pubkey}`}>
              <div className="bg-surface border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-mono text-sm text-gray-300">{agent.pubkey}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {agent.specialties.map((s) => (
                    <span key={s} className="text-xs font-mono px-2 py-0.5 bg-secondary/20 text-secondary border border-secondary/30 rounded">
                      {s}
                    </span>
                  ))}
                </div>
                <ReputationBadge score={agent.score} tasksCompleted={agent.tasks} accuracy={agent.accuracy} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
