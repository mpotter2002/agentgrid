import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { AgentGrid, TaskEscrow, ReputationChain } from "./types";

const PROGRAM_IDS = {
  agentGrid: new PublicKey("AGENTGRID11111111111111111111111111111111"),
  taskEscrow: new PublicKey("ESCROW111111111111111111111111111111111111"),
  reputationChain: new PublicKey("REPCHAIN111111111111111111111111111111111"),
};

export const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com",
  "confirmed"
);

export function getProgram<T>(idl: any, programId: PublicKey, wallet: any, provider: AnchorProvider): Program<T> {
  return new Program<T>(idl as any, programId, provider) as Program<T>;
}

export { PROGRAM_IDS };
