/**
 * AgentGrid React Hooks
 * Use these inside components wrapped by WalletProvider.
 */

import { useEffect, useState, useCallback } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Program, BN } from "@coral-xyz/anchor";
import {
  getPrograms,
  deriveTaskPda,
  deriveBidPda,
  deriveEscrowPda,
  deriveAgentRecordPda,
} from "./anchor";
import type { Cluster } from "./programs";
import type { CreateTaskParams, PostBidParams } from "./transactions";

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
  const { connection } = useConnection();
  const [tasks, setTasks] = useState<TaskAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!requester) return;
    setLoading(true);
    setError(null);
    try {
      const { agentGrid } = getPrograms(cluster);
      // Fetch tasks for this requester by filtering account data
      // Note: Anchor doesn't support easy "WHERE" filtering client-side
      // For production, use GPA (getProgramAccounts) with memcmp
      // Here we use a simple filter on the decoded accounts
      const accounts = await connection.getProgramAccounts(
        agentGrid.programId,
        {
          filters: [
            { memcmp: { offset: 0, bytes: requester.toBase58() } },
          ],
        }
      );

      const decoded: TaskAccount[] = [];
      for (const acc of accounts) {
        try {
          const task = await agentGrid.account.task.fetch(acc.pubkey);
          decoded.push(task as unknown as TaskAccount);
        } catch {
          // skip non-task accounts
        }
      }
      setTasks(decoded);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [connection, requester, cluster]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, refetch: fetchTasks };
}

// ---------------------------------------------------------------------------
// useTask — fetch a single task by taskId
// ---------------------------------------------------------------------------

export function useTask(taskId: string, cluster: Cluster = "devnet") {
  const { connection } = useConnection();
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
  }, [connection, taskId, cluster]);

  useEffect(() => { fetch(); }, [fetch]);

  return { task, loading, error, refetch: fetch };
}

// ---------------------------------------------------------------------------
// useTaskBids — fetch all bids for a task
// ---------------------------------------------------------------------------

export function useTaskBids(taskId: string, cluster: Cluster = "devnet") {
  const { connection } = useConnection();
  const [bids, setBids] = useState<BidAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!taskId) return;
    setLoading(true);
    setError(null);
    try {
      const { agentGrid } = getPrograms(cluster);
      // Use getProgramAccounts to find all bid accounts for this task
      // The bid PDA seeds are [b"bid", task_id, agent_pubkey]
      // We need to scan since we don't know the agent pubkeys
      const allBids = await connection.getProgramAccounts(agentGrid.programId, {
        filters: [{ dataSize: agentGrid.account.taskBid.size }],
      });

      const decoded: BidAccount[] = [];
      for (const acc of allBids) {
        try {
          const bid = await agentGrid.account.taskBid.fetch(acc.pubkey);
          if ((bid as unknown as BidAccount).taskId === taskId) {
            decoded.push(bid as unknown as BidAccount);
          }
        } catch {
          // skip
        }
      }
      setBids(decoded);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to fetch bids");
    } finally {
      setLoading(false);
    }
  }, [connection, taskId, cluster]);

  useEffect(() => { fetch(); }, [fetch]);

  return { bids, loading, error, refetch: fetch };
}

// ---------------------------------------------------------------------------
// useEscrow — fetch escrow for a task
// ---------------------------------------------------------------------------

export function useEscrow(taskId: string, cluster: Cluster = "devnet") {
  const { connection } = useConnection();
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
  }, [connection, taskId, cluster]);

  useEffect(() => { fetch(); }, [fetch]);

  return { escrow, loading, error, refetch: fetch };
}

// ---------------------------------------------------------------------------
// useAgentRecord — fetch reputation record for an agent
// ---------------------------------------------------------------------------

export function useAgentRecord(agent: PublicKey, cluster: Cluster = "devnet") {
  const { connection } = useConnection();
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
  }, [connection, agent, cluster]);

  useEffect(() => { fetch(); }, [fetch]);

  return { record, loading, error, refetch: fetch };
}
