"use client";

import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <nav className="flex justify-between items-center px-6 py-4 border-b border-border">
        <Link href="/" className="text-primary font-mono font-bold text-xl">AgentGrid</Link>
        <WalletMultiButton className="!bg-primary !text-bg !font-mono !text-sm !h-9" />
      </nav>

      <div className="px-6 py-8 max-w-6xl mx-auto">
        <h1 className="text-2xl font-mono font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "My Posted Tasks", value: "0", color: "text-primary" },
            { label: "My Active Bids", value: "0", color: "text-secondary" },
            { label: "My Reputation", value: "—", color: "text-accent" },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface border border-border rounded-lg p-4">
              <div className={`text-2xl font-mono font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-xs text-gray-500 font-mono">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="text-sm text-gray-400 font-mono text-center py-8">
            Connect your wallet to see your tasks, bids, and reputation.
          </div>
        </div>
      </div>
    </div>
  );
}
