"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useTask, useTaskBids, useEscrow } from "@/lib/hooks";
import { buildPostBidTx, buildAcceptBidTx, buildSubmitResultTx, buildApproveResultTx } from "@/lib/transactions";

const statusColors: Record<string, string> = {
  Open: "bg-emerald-950/50 text-emerald-400 border-emerald-800",
  InProgress: "bg-amber-950/50 text-amber-400 border-amber-800",
  Submitted: "bg-blue-950/50 text-blue-400 border-blue-800",
  Approved: "bg-indigo-950/50 text-indigo-400 border-indigo-800",
  Disputed: "bg-red-950/50 text-red-400 border-red-800",
  Resolved: "bg-slate-800 text-slate-300 border-slate-700",
};

function normalizeStatus(status: Record<string, unknown> | string | null | undefined): string {
  if (!status) return "Unknown";
  if (typeof status === "string") return status;
  const key = Object.keys(status)[0];
  return key ? key.charAt(0).toUpperCase() + key.slice(1) : "Unknown";
}

function formatSol(lamports: { toNumber?: () => number; toString: () => string } | number | bigint | null | undefined): string {
  if (lamports == null) return "0.00";
  const value =
    typeof lamports === "number" ? lamports
    : typeof lamports === "bigint" ? Number(lamports)
    : lamports.toNumber ? lamports.toNumber()
    : Number(lamports.toString());
  return (value / 1e9).toFixed(2);
}

function shortAddr(pk: { toBase58: () => string } | string | null | undefined): string {
  if (!pk) return "—";
  const s = typeof pk === "string" ? pk : pk.toBase58();
  return `${s.slice(0, 8)}...${s.slice(-4)}`;
}

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params.id as string;
  const { publicKey, sendTransaction, connected } = useWallet();
  const { connection } = useConnection();

  const { task, loading: taskLoading, error: taskError } = useTask(taskId);
  const { bids, loading: bidsLoading } = useTaskBids(taskId);
  const { escrow, loading: escrowLoading } = useEscrow(taskId);

  const [bidAmount, setBidAmount] = useState("");
  const [capHash, setCapHash] = useState("");
  const [resultCid, setResultCid] = useState("");
  const [txPending, setTxPending] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);

  const status = normalizeStatus(task?.status);

  async function handlePostBid() {
    if (!publicKey || !sendTransaction) { setTxError("Connect wallet first."); return; }
    const amount = Number(bidAmount);
    if (!Number.isFinite(amount) || amount <= 0) { setTxError("Enter a valid bid amount."); return; }
    setTxPending(true); setTxError(null);
    try {
      const tx = await buildPostBidTx({ taskId, bidAmount: amount, capabilitiesHash: capHash || "Qmdefault" }, publicKey);
      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction(sig, "confirmed");
      toast.success("Bid posted!");
      setBidAmount(""); setCapHash("");
    } catch (e: unknown) {
      setTxError(e instanceof Error ? e.message : "Bid failed");
      toast.error("Bid failed");
    } finally { setTxPending(false); }
  }

  async function handleAcceptBid(bidPk: string) {
    if (!publicKey || !sendTransaction) { setTxError("Connect wallet first."); return; }
    setTxPending(true); setTxError(null);
    try {
      const tx = await buildAcceptBidTx(taskId, new (require("@solana/web3.js").PublicKey)(bidPk), publicKey);
      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction(sig, "confirmed");
      toast.success("Bid accepted!");
    } catch (e: unknown) {
      setTxError(e instanceof Error ? e.message : "Accept failed");
      toast.error("Accept failed");
    } finally { setTxPending(false); }
  }

  async function handleSubmitResult() {
    if (!publicKey || !sendTransaction) { setTxError("Connect wallet first."); return; }
    if (!resultCid) { setTxError("Enter a result CID."); return; }
    setTxPending(true); setTxError(null);
    try {
      const tx = await buildSubmitResultTx(taskId, resultCid, publicKey);
      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction(sig, "confirmed");
      toast.success("Result submitted!");
      setResultCid("");
    } catch (e: unknown) {
      setTxError(e instanceof Error ? e.message : "Submit failed");
      toast.error("Submit failed");
    } finally { setTxPending(false); }
  }

  async function handleApprove() {
    if (!publicKey || !sendTransaction) { setTxError("Connect wallet first."); return; }
    setTxPending(true); setTxError(null);
    try {
      const tx = await buildApproveResultTx(taskId, publicKey);
      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction(sig, "confirmed");
      toast.success("Result approved!");
    } catch (e: unknown) {
      setTxError(e instanceof Error ? e.message : "Approve failed");
      toast.error("Approve failed");
    } finally { setTxPending(false); }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-6 py-3 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link href="/tasks" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Tasks</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
        <span className="font-bold text-lg text-white absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0 sm:text-xl">AgentGrid</span>
        <WalletMultiButton className="!bg-indigo-600 !hover:bg-indigo-500 !text-white !font-semibold !h-9 !px-3 !rounded-lg !text-xs !border-none" />
      </nav>

      <div className="px-4 md:px-6 py-6 md:py-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs text-slate-500 font-mono">{taskId}</span>
            {taskLoading ? <Skeleton className="h-5 w-20 bg-slate-800" /> : (
              <Badge variant="outline" className={`text-xs border ${statusColors[status] ?? "border-slate-700"}`}>
                {status.toUpperCase()}
              </Badge>
            )}
          </div>
          {taskLoading ? (
            <Skeleton className="h-6 w-3/4 bg-slate-800 mb-2" />
          ) : (
            <h1 className="text-lg md:text-xl font-semibold leading-relaxed text-white">
              {task?.description ?? taskError ?? "Task not found"}
            </h1>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            {/* Escrow */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-2 md:pb-3 pt-4 px-4 md:px-5">
                <CardTitle className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Escrow</CardTitle>
              </CardHeader>
              <CardContent className="px-4 md:px-5 pb-4">
                {escrowLoading ? <Skeleton className="h-4 w-full bg-slate-800" /> : escrow ? (
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${escrow.status === "Active" ? "bg-emerald-500" : "bg-slate-500"}`} />
                    <span className={escrow.status === "Active" ? "text-emerald-400 font-semibold text-sm" : "text-slate-400 text-sm"}>
                      {escrow.status}
                    </span>
                    <span className="text-white font-bold text-sm ml-auto">{formatSol(escrow.amount)} SOL</span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No escrow found for this task.</p>
                )}
              </CardContent>
            </Card>

            {/* Details */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-2 md:pb-3 pt-4 px-4 md:px-5">
                <CardTitle className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Details</CardTitle>
              </CardHeader>
              <CardContent className="px-4 md:px-5 pb-4 flex flex-col gap-2.5">
                {taskLoading ? (
                  Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-4 w-full bg-slate-800" />)
                ) : (
                  [
                    { label: "Requester", value: shortAddr(task?.requester) },
                    { label: "Assigned", value: shortAddr(task?.assignedAgent) },
                    { label: "Result CID", value: task?.resultCid ? `${task.resultCid.slice(0, 8)}...` : "—" },
                    { label: "Stake", value: task ? `${formatSol(task.stakeAmount)} SOL` : "—" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">{row.label}</span>
                      <span className="text-slate-300 font-mono text-xs">{row.value}</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Bids */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-2 md:pb-3 pt-4 px-4 md:px-5">
                <CardTitle className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Bids ({bids.length})</CardTitle>
              </CardHeader>
              <CardContent className="px-4 md:px-5 pb-4 flex flex-col gap-0">
                {bidsLoading ? (
                  Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-8 w-full bg-slate-800 mb-2" />)
                ) : bids.length === 0 ? (
                  <p className="text-xs text-slate-500 py-2">No bids yet.</p>
                ) : (
                  bids.map((bid) => (
                    <div key={bid.agent.toBase58()} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
                      <div>
                        <div className="text-xs text-slate-300 font-mono">{shortAddr(bid.agent)}</div>
                        <div className="text-xs text-indigo-400 mt-0.5">{formatSol(bid.bidAmount)} SOL</div>
                      </div>
                      {connected && publicKey && task?.requester?.equals(publicKey) && status === "Open" && (
                        <Button
                          size="sm"
                          className="!bg-emerald-700 hover:!bg-emerald-600 !text-white !text-xs !h-8"
                          onClick={() => handleAcceptBid(bid.agent.toBase58())}
                          disabled={txPending}
                        >
                          Accept
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            {/* Place Bid — only show for Open tasks, to agents */}
            {!connected ? (
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-2 md:pb-3 pt-4 px-4 md:px-5">
                  <CardTitle className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Place Bid</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 text-center">
                  <p className="text-sm text-slate-400 mb-4">Connect your wallet to place a bid.</p>
                  <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-500 !text-white !font-semibold !h-10 !px-4 !rounded-lg !text-sm !border-none" />
                </CardContent>
              </Card>
            ) : status === "Open" ? (
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-2 md:pb-3 pt-4 px-4 md:px-5">
                  <CardTitle className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Place Bid</CardTitle>
                </CardHeader>
                <CardContent className="px-4 md:px-5 pb-4 flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-500">Bid Amount (SOL)</label>
                    <Input type="number" step="0.1" min="0" value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder="0.5"
                      className="bg-slate-950 border-slate-700 text-slate-200 text-sm focus:border-indigo-500 h-10" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-500">Capabilities Hash <span className="text-slate-600">(optional)</span></label>
                    <Input type="text" value={capHash}
                      onChange={(e) => setCapHash(e.target.value)}
                      placeholder="QmXxx..."
                      className="bg-slate-950 border-slate-700 text-slate-200 text-sm focus:border-indigo-500 font-mono h-10" />
                  </div>
                  {txError && <p className="text-xs text-red-400">{txError}</p>}
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold mt-1 h-10 text-sm"
                    disabled={txPending} onClick={handlePostBid}>
                    {txPending ? "Posting..." : "Submit Bid"}
                  </Button>
                </CardContent>
              </Card>
            ) : null}

            {/* Submit Result — only for assigned agent */}
            {connected && publicKey && task?.assignedAgent?.equals(publicKey) && status === "InProgress" ? (
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-2 md:pb-3 pt-4 px-4 md:px-5">
                  <CardTitle className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Submit Result</CardTitle>
                </CardHeader>
                <CardContent className="px-4 md:px-5 pb-4 flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-500">Result CID (IPFS)</label>
                    <Input type="text" value={resultCid} onChange={(e) => setResultCid(e.target.value)}
                      placeholder="QmXYZ..."
                      className="bg-slate-950 border-slate-700 text-slate-200 text-sm focus:border-indigo-500 font-mono h-10" />
                  </div>
                  {txError && <p className="text-xs text-red-400">{txError}</p>}
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold h-10 text-sm"
                    disabled={txPending} onClick={handleSubmitResult}>
                    {txPending ? "Submitting..." : "Submit Result"}
                  </Button>
                </CardContent>
              </Card>
            ) : null}

            {/* Approve — only for requester when Submitted */}
            {connected && publicKey && task?.requester?.equals(publicKey) && status === "Submitted" ? (
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-2 md:pb-3 pt-4 px-4 md:px-5">
                  <CardTitle className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Review Result</CardTitle>
                </CardHeader>
                <CardContent className="px-4 md:px-5 pb-4 flex flex-col gap-3">
                  <p className="text-xs text-slate-400">The agent has submitted their result. Review it off-chain, then approve or dispute.</p>
                  {txError && <p className="text-xs text-red-400">{txError}</p>}
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold h-10 text-sm"
                    disabled={txPending} onClick={handleApprove}>
                    {txPending ? "Processing..." : "Approve Result"}
                  </Button>
                </CardContent>
              </Card>
            ) : null}

            {/* Live Data notice */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-2 md:pb-3 pt-4 px-4 md:px-5">
                <CardTitle className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Live On-Chain Data</CardTitle>
              </CardHeader>
              <CardContent className="px-4 md:px-5 pb-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  This page loads live data from the AgentGrid program on Solana devnet.
                  All task state, bids, and escrow are stored on-chain.
                </p>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-4 flex gap-3">
                <Link href="/tasks" className="flex-1">
                  <Button variant="outline" className="w-full border-slate-700 text-slate-400 hover:bg-slate-800 text-sm h-9">
                    Back
                  </Button>
                </Link>
                <Button variant="outline" className="flex-1 border-slate-700 text-slate-400 hover:bg-slate-800 text-sm h-9"
                  onClick={() => navigator.clipboard.writeText(window.location.href)}>
                  Share
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
