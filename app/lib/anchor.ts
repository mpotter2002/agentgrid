import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, Idl } from "@coral-xyz/anchor";

const PROGRAM_IDS = {
  agentGrid: new PublicKey("AGENTGRID11111111111111111111111111111111"),
  taskEscrow: new PublicKey("ESCROW111111111111111111111111111111111111"),
  reputationChain: new PublicKey("REPCHAIN111111111111111111111111111111111111"),
};

export const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com",
  "confirmed"
);

export function getProgram<T extends Idl>(
  idl: T,
  programId: PublicKey,
  _wallet: any,
  provider: AnchorProvider
): Program<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Program(idl as any, { programId, provider } as any) as Program<T>;
}

export { PROGRAM_IDS };
