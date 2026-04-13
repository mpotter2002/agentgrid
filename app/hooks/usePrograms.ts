"use client";

import { useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import {
  getPrograms,
  PROGRAM_IDS,
  deriveTaskPda,
  deriveBidPda,
  deriveEscrowPda,
  deriveAgentRecordPda,
  deriveAcceptedBidPda,
  type TaskAccount,
  type EscrowAccount,
  type AgentRecordAccount,
} from "@/lib/anchor";

const DEVNET_RPC = "https://api.devnet.solana.com";

/**
 * Returns an AnchorProvider wired to the connected wallet.
 * Returns null if wallet is not connected.
 */
export function useAnchorProvider() {
  const { wallet, publicKey, signTransaction, signAllTransactions } = useWallet();

  return useMemo(() => {
    if (!wallet || !publicKey || !signTransaction || !signAllTransactions) {
      return null;
    }

    const connection = new Connection(DEVNET_RPC, "confirmed");
    const anchorWallet = {
      publicKey,
      signTransaction,
      signAllTransactions,
    };

    const provider = new AnchorProvider(connection, anchorWallet, {
      commitment: "confirmed",
      skipPreflight: false,
    });

    return provider;
  }, [wallet, publicKey, signTransaction, signAllTransactions]);
}

/**
 * Returns typed Anchor programs.
 * Note: this returns programs WITHOUT a provider set — for read-only use.
 * For transactions, use useAnchorProgramsWithProvider().
 */
export function useAnchorPrograms() {
  return useMemo(() => getPrograms("devnet"), []);
}

/**
 * Returns typed Anchor programs with the connected wallet as signer.
 * Throws if wallet is not connected.
 */
export function useAnchorProgramsWithProvider() {
  const provider = useAnchorProvider();

  return useMemo(() => {
    if (!provider) return null;
    const programs = getPrograms("devnet");

    // Re-create programs with the provider's wallet as signer
    const agentGrid = programs.agentGrid;
    const taskEscrow = programs.taskEscrow;
    const reputationChain = programs.reputationChain;

    return {
      ...programs,
      provider,
      agentGrid,
      taskEscrow,
      reputationChain,
    };
  }, [provider]);
}

// ---------------------------------------------------------------------------
// Data Fetching Hooks
// ---------------------------------------------------------------------------

/**
 * Fetch a single task account by taskId string.
 */
export async function fetchTask(taskId: string): Promise<TaskAccount | null> {
  try {
    const programs = getPrograms("devnet");
    const [pda] = deriveTaskPda(taskId);
    const account = await (programs.agentGrid.account as any).Task.fetch(pda);
    return account as TaskAccount;
  } catch {
    return null;
  }
}

/**
 * Fetch an escrow account by taskId.
 */
export async function fetchEscrow(taskId: string): Promise<EscrowAccount | null> {
  try {
    const programs = getPrograms("devnet");
    const [pda] = deriveEscrowPda(taskId);
    const account = await (programs.taskEscrow.account as any).Escrow.fetch(pda);
    return account as EscrowAccount;
  } catch {
    return null;
  }
}

/**
 * Fetch an agent's reputation record.
 */
export async function fetchAgentRecord(agent: PublicKey): Promise<AgentRecordAccount | null> {
  try {
    const programs = getPrograms("devnet");
    const [pda] = deriveAgentRecordPda(agent);
    const account = await (programs.reputationChain.account as any).AgentRecord.fetch(pda);
    return account as AgentRecordAccount;
  } catch {
    return null;
  }
}

/**
 * Derive all PDAs for a given taskId — useful for task detail pages.
 */
export function useTaskPDAs(taskId: string) {
  return useMemo(() => {
    const [taskPda] = deriveTaskPda(taskId);
    const [escrowPda] = deriveEscrowPda(taskId);
    return { taskPda, escrowPda };
  }, [taskId]);
}
