/**
 * AgentGrid React Hooks
 * Use these inside components wrapped by WalletProvider.
 */

import { useEffect, useState, useCallback } from "react";
import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import {
  getPrograms,
  deriveTaskPda,
  deriveEscrowPda,
  deriveAgentRecordPda,
} from "./anchor";
import type { Cluster } from "./programs";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TaskStatus = "Open" | "InProgress" | "Submitted" | "Approved" | "Disputed" | "Resolved";

export interface TaskAccount {
  taskId: string;
  description: string;
  requester: PublicKey;
  assignedAgent: PublicKey | null;
  status: TaskStatus;
  stakeAmount: BN;
  resultCid: string | null;
  parentTaskId: string | null;
  deadlineBlocks: BN | null;
  createdAt: BN;
  updatedAt: BN;
  bump: number;
}

export interface BidAccount {
  taskId: string;
  agent: PublicKey;
  bidAmount: BN;
  capabilitiesHash: string;
  createdAt: BN;
  bump: number;
}

export interface EscrowAccount {
  taskId: string;
  beneficiary: PublicKey;
  recipient: PublicKey | null;
  amount: BN;
  status: "Active" | "Released" | "Slashed" | "Refunded";
  createdAt: BN;
  updatedAt: BN;
  bump: number;
}

// ---------------------------------------------------------------------------
// useTasks — fetch all tasks for a given requester
// ---------------------------------------------------------------------------

export function useTasks(requester?: PublicKey, cluster: Cluster = "devnet") {
  const [tasks, setTasks] = useState<TaskAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { agentGrid } = getPrograms(cluster);
      const accounts = await agentGrid.account.task.all();
      const decoded = accounts
        .map((account) => account.account as unknown as TaskAccount)
        .filter((task) => !requester || task.requester.equals(requester));
      setTasks(decoded);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [requester, cluster]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, refetch: fetchTasks };
}

// ---------------------------------------------------------------------------
// useTask — fetch a single task by taskId
// ---------------------------------------------------------------------------

export function useTask(taskId: string, cluster: Cluster = "devnet") {
  const [task, setTask] = useState<TaskAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!taskId) return;
    setLoading(true);
    setError(null);
    try {
      const { agentGrid } = getPrograms(cluster);
      const [pda] = deriveTaskPda(taskId);
      const t = await agentGrid.account.task.fetch(pda);
      setTask(t as unknown as TaskAccount);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Task not found");
      setTask(null);
    } finally {
      setLoading(false);
    }
  }, [taskId, cluster]);

  useEffect(() => { fetch(); }, [fetch]);

  return { task, loading, error, refetch: fetch };
}

// ---------------------------------------------------------------------------
// useTaskBids — fetch all bids for a task
// ---------------------------------------------------------------------------

export function useTaskBids(taskId: string, cluster: Cluster = "devnet") {
  const [bids, setBids] = useState<BidAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!taskId) return;
    setLoading(true);
    setError(null);
    try {
      const { agentGrid } = getPrograms(cluster);
      const allBids = await agentGrid.account.taskBid.all();
      const decoded = allBids
        .map((account) => account.account as unknown as BidAccount)
        .filter((bid) => bid.taskId === taskId);
      setBids(decoded);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to fetch bids");
    } finally {
      setLoading(false);
    }
  }, [taskId, cluster]);

  useEffect(() => { fetch(); }, [fetch]);

  return { bids, loading, error, refetch: fetch };
}

// ---------------------------------------------------------------------------
// useEscrow — fetch escrow for a task
// ---------------------------------------------------------------------------

export function useEscrow(taskId: string, cluster: Cluster = "devnet") {
  const [escrow, setEscrow] = useState<EscrowAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!taskId) return;
    setLoading(true);
    setError(null);
    try {
      const { taskEscrow } = getPrograms(cluster);
      const [pda] = deriveEscrowPda(taskId);
      const e = await taskEscrow.account.escrow.fetch(pda);
      setEscrow(e as unknown as EscrowAccount);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Escrow not found");
      setEscrow(null);
    } finally {
      setLoading(false);
    }
  }, [taskId, cluster]);

  useEffect(() => { fetch(); }, [fetch]);

  return { escrow, loading, error, refetch: fetch };
}

// ---------------------------------------------------------------------------
// useAgentRecord — fetch reputation record for an agent
// ---------------------------------------------------------------------------

export function useAgentRecord(agent: PublicKey, cluster: Cluster = "devnet") {
  const [record, setRecord] = useState<{
    tasksCompleted: number;
    reputationScore: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!agent) return;
    setLoading(true);
    setError(null);
    try {
      const { reputationChain } = getPrograms(cluster);
      const [pda] = deriveAgentRecordPda(agent);
      const r = await reputationChain.account.agentRecord.fetch(pda);
      // AgentRecord fields based on the Rust struct
      setRecord(r as unknown as { tasksCompleted: number; reputationScore: number });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Record not found");
      setRecord(null);
    } finally {
      setLoading(false);
    }
  }, [agent, cluster]);

  useEffect(() => { fetch(); }, [fetch]);

  return { record, loading, error, refetch: fetch };
}
