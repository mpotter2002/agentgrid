"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Loader2, RefreshCw } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { RegisterAgentModal } from "@/components/RegisterAgentModal";
import { useAgent, AgentData } from "@/hooks/useAgent";

export default function AgentsContent() {
  const wallet = useWallet();
  const { isRegistered, getAllAgents } = useAgent();
  
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      const allAgents = await getAllAgents();
      setAgents(allAgents);
    } catch (e: any) {
      setError(e.message || "Failed to fetch agents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [getAllAgents]);

  const calculateSuccessRate = (agent: AgentData) => {
    const total = agent.tasksCompleted + agent.tasksFailed;
    if (total === 0) return 0;
    return Math.round((agent.tasksCompleted / total) * 100);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-6 py-3 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <Link href="/" className="font-bold text-xl text-white">
          AgentGrid
        </Link>
        <div className="hidden md:flex items-center gap-4">
          <RegisterAgentModal onRegistered={fetchAgents} />
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
                <div className="mb-2 sm:mb-0">
                  <RegisterAgentModal onRegistered={fetchAgents} />
                </div>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Agent Registry</h1>
            <p className="text-sm text-slate-500">
              {agents.length} specialized agent{agents.length !== 1 ? 's' : ''} on the grid
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAgents}
              disabled={loading}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <div className="hidden md:block">
              <RegisterAgentModal onRegistered={fetchAgents} />
            </div>
          </div>
        </div>

        {/* My Agent Status */}
        {wallet.connected && isRegistered && (
          <div className="mb-6 p-4 bg-emerald-950/30 border border-emerald-800/50 rounded-lg">
            <p className="text-sm text-emerald-400">
              ✅ You are registered as an agent! Browse tasks to start earning.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-950/30 border border-red-800/50 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Agents Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold text-white mb-2">No agents yet</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Be the first to register as an agent and start earning by completing tasks on the grid.
            </p>
            <RegisterAgentModal onRegistered={fetchAgents} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent) => {
              const successRate = calculateSuccessRate(agent);
              return (
                <Card key={agent.address.toBase58()} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="bg-indigo-600 text-white text-sm font-bold w-10 h-10">
                          <AvatarFallback>
                            {(agent.name || "A").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-sm text-white">{agent.name || "Anonymous Agent"}</div>
                          <div className="text-xs text-slate-500 font-mono hidden sm:block">
                            {agent.address.toBase58().slice(0, 20)}...
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-400">{agent.score}</div>
                        <div className="text-xs text-slate-500">reputation</div>
                      </div>
                    </div>

                    <div className="flex gap-4 md:gap-6 text-xs text-slate-400 mb-4">
                      <span>Tasks: <span className="text-white font-medium">{agent.tasksCompleted}</span></span>
                      <span>Success: <span className="text-emerald-400 font-medium">{successRate}%</span></span>
                      <span>Rate: <span className="text-white font-medium">{agent.rate || 0} SOL/hr</span></span>
                    </div>

                    <div className="mb-3">
                      <div className="text-xs text-slate-500 mb-2">Success Rate</div>
                      <Progress value={successRate} className="h-1.5 bg-slate-800" />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(agent.skills || []).slice(0, 5).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs border-indigo-800 text-indigo-400 bg-indigo-950/30">
                          {skill}
                        </Badge>
                      ))}
                      {(agent.skills || []).length > 5 && (
                        <Badge variant="outline" className="text-xs border-slate-700 text-slate-500">
                          +{agent.skills.length - 5} more
                        </Badge>
                      )}
                    </div>

                    {wallet.publicKey?.toBase58() === agent.owner.toBase58() && (
                      <div className="mt-4 pt-4 border-t border-slate-800">
                        <Badge className="bg-emerald-950/50 text-emerald-400 border-emerald-800">
                          This is you
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
