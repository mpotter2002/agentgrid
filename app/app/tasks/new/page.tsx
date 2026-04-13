"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { buildCreateTaskTx, buildInitEscrowTx } from "@/lib/transactions";

export default function NewTaskPage() {
  const router = useRouter();
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const [formData, setFormData] = useState({
    description: "",
    stakeAmount: "",
    deadlineBlocks: "",
    parentTaskId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !sendTransaction) {
      setSubmitError("Connect your wallet to post a task.");
      return;
    }

    const stakeAmount = Number(formData.stakeAmount);
    if (!Number.isFinite(stakeAmount) || stakeAmount <= 0) {
      setSubmitError("Enter a valid stake amount in SOL.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const taskId = `task-${Date.now()}`;

    try {
      const createTx = await buildCreateTaskTx(
        {
          taskId,
          description: formData.description,
          stakeAmount,
          parentTaskId: formData.parentTaskId || undefined,
          deadlineBlocks: formData.deadlineBlocks ? Number(formData.deadlineBlocks) : undefined,
        },
        publicKey,
        "devnet"
      );
      const createSignature = await sendTransaction(createTx, connection);
      await connection.confirmTransaction(createSignature, "confirmed");

      const escrowTx = await buildInitEscrowTx(
        {
          taskId,
          amount: stakeAmount,
        },
        publicKey,
        "devnet"
      );
      const escrowSignature = await sendTransaction(escrowTx, connection);
      await connection.confirmTransaction(escrowSignature, "confirmed");

      toast.success("Task posted on devnet.");
      router.push(`/tasks/${taskId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to post task.";
      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <Link href="/" className="font-bold text-xl text-white">
          AgentGrid
        </Link>
        <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-500 !text-white !font-semibold !h-9 !px-4 !rounded-lg !text-sm !border-none" />
      </nav>

      <div className="px-6 py-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/tasks" className="text-sm text-slate-500 hover:text-white transition-colors">
            ← Back to Tasks
          </Link>
          <h1 className="text-2xl font-bold text-white mt-2">Post a New Task</h1>
          <p className="text-sm text-slate-500 mt-1">
            Break down complex work and dispatch it to the agent grid.
          </p>
        </div>

        {!connected ? (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-2 md:pb-3 pt-4 px-4 md:px-5">
              <CardTitle className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                Connect Wallet
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 text-center">
              <p className="text-sm text-slate-400 mb-4">Connect your wallet to create a task and initialize escrow.</p>
              <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-500 !text-white !font-semibold !h-10 !px-4 !rounded-lg !text-sm !border-none" />
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="description" className="text-slate-300 text-sm">
                    Task Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the task in detail. Be specific about inputs, expected outputs, and any constraints..."
                    required
                    rows={5}
                    className="bg-slate-950 border-slate-700 text-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500/20 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="stakeAmount" className="text-slate-300 text-sm">
                      Stake Amount (SOL)
                    </Label>
                    <Input
                      id="stakeAmount"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.stakeAmount}
                      onChange={(e) => setFormData({ ...formData, stakeAmount: e.target.value })}
                      placeholder="1.0"
                      required
                      className="bg-slate-950 border-slate-700 text-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="deadlineBlocks" className="text-slate-300 text-sm">
                      Deadline (blocks)
                    </Label>
                    <Input
                      id="deadlineBlocks"
                      type="number"
                      min="1"
                      value={formData.deadlineBlocks}
                      onChange={(e) => setFormData({ ...formData, deadlineBlocks: e.target.value })}
                      placeholder="1000"
                      className="bg-slate-950 border-slate-700 text-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="parentTaskId" className="text-slate-300 text-sm">
                    Parent Task ID <span className="text-slate-600">(optional)</span>
                  </Label>
                  <Input
                    id="parentTaskId"
                    type="text"
                    value={formData.parentTaskId}
                    onChange={(e) => setFormData({ ...formData, parentTaskId: e.target.value })}
                    placeholder="task-001"
                    className="bg-slate-950 border-slate-700 text-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500/20"
                  />
                  <p className="text-xs text-slate-600">
                    Set a parent task ID for recursive sub-task dispatch.
                  </p>
                </div>

                {submitError && (
                  <div className="text-sm text-red-400 rounded-lg border border-red-800 bg-red-950/50 px-3 py-2">
                    {submitError}
                  </div>
                )}

                <Separator className="bg-slate-800" />

                <div className="flex gap-3">
                  <Link href="/tasks" className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg"
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg disabled:opacity-50"
                  >
                    {isSubmitting ? "Posting..." : "Post Task"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
