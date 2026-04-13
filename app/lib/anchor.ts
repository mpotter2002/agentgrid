import { Connection, PublicKey, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { AnchorProvider, Program, Idl } from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { PROGRAM_IDS, LOCALNET_PROGRAM_IDS, Cluster } from "./programs";

// IDL imports — copy these files from target/idl/ at build time
import agentGridIdl from "@/idl/agent_grid.json";
import taskEscrowIdl from "@/idl/task_escrow.json";
import reputationChainIdl from "@/idl/reputation_chain.json";

export { PROGRAM_IDS, LOCALNET_PROGRAM_IDS, type Cluster };

// Cluster RPC URLs
const CLUSTER_RPC: Record<Cluster, string> = {
  devnet: "https://api.devnet.solana.com",
  localnet: "http://localhost:8899",
};

/**
 * Build an Anchor provider from the connected wallet.
 * Call this inside a component that uses useWallet(), or pass wallet manually.
 */
export function getAnchorProvider(wallet: Parameters<AnchorProvider["constructor"]>[0], cluster: Cluster = "devnet") {
  const connection = new Connection(CLUSTER_RPC[cluster], "confirmed");
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
    skipPreflight: false,
  });
  return provider;
}

/**
 * Get typed programs for the given cluster.
 * Returns AgentGrid, TaskEscrow, and ReputationChain programs.
 */
export function getPrograms(cluster: Cluster = "devnet") {
  const idls = {
    agentGrid: agentGridIdl as Idl,
    taskEscrow: taskEscrowIdl as Idl,
    reputationChain: reputationChainIdl as Idl,
  };

  const ids = cluster === "devnet" ? PROGRAM_IDS : PROGRAM_IDS; // same IDs for now, use LOCALNET_PROGRAM_IDS for localnet

  const agentGrid = new Program(idls.agentGrid, ids.agentGrid);
  const taskEscrow = new Program(idls.taskEscrow, ids.taskEscrow);
  const reputationChain = new Program(idls.reputationChain, ids.reputationChain);

  return {
    agentGrid,
    taskEscrow,
    reputationChain,
    ids,
  };
}

// ---------------------------------------------------------------------------
// PDA Derivation Helpers
// ---------------------------------------------------------------------------

/**
 * Derive a Task PDA: ["task", task_id]
 */
export function deriveTaskPda(taskId: string, programId: string = PROGRAM_IDS.agentGrid) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("task"), Buffer.from(taskId)],
    new PublicKey(programId)
  );
}

/**
 * Derive a Bid PDA: ["bid", task_id, bidder_pubkey]
 */
export function deriveBidPda(taskId: string, bidder: PublicKey, programId: string = PROGRAM_IDS.agentGrid) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("bid"), Buffer.from(taskId), bidder.toBuffer()],
    new PublicKey(programId)
  );
}

/**
 * Derive an AcceptedBid PDA: ["accepted_bid", task_id, agent]
 */
export function deriveAcceptedBidPda(taskId: string, agent: PublicKey, programId: string = PROGRAM_IDS.agentGrid) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("accepted_bid"), Buffer.from(taskId), agent.toBuffer()],
    new PublicKey(programId)
  );
}

/**
 * Derive an Escrow PDA: ["escrow", task_id]
 */
export function deriveEscrowPda(taskId: string, programId: string = PROGRAM_IDS.taskEscrow) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("escrow"), Buffer.from(taskId)],
    new PublicKey(programId)
  );
}

/**
 * Derive an AgentRecord PDA: ["agent_record", agent_pubkey]
 */
export function deriveAgentRecordPda(agent: PublicKey, programId: string = PROGRAM_IDS.reputationChain) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("agent_record"), agent.toBuffer()],
    new PublicKey(programId)
  );
}

// ---------------------------------------------------------------------------
// Type helpers from IDL
// ---------------------------------------------------------------------------

export type TaskAccount = Awaited<ReturnType<typeof getPrograms>>["agentGrid"]["account"]["task"]["fetch"] extends infer T ? T : never;
export type BidAccount = Awaited<ReturnType<typeof getPrograms>>["agentGrid"]["account"]["bid"]["fetch"] extends infer T ? T : never;
export type EscrowAccount = Awaited<ReturnType<typeof getPrograms>>["taskEscrow"]["account"]["escrow"]["fetch"] extends infer T ? T : never;
export type AgentRecordAccount = Awaited<ReturnType<typeof getPrograms>>["reputationChain"]["account"]["agentRecord"]["fetch"] extends infer T ? T : never;
