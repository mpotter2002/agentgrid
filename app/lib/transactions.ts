/**
 * AgentGrid Transaction Builders
 * All write transactions against the AgentGrid, TaskEscrow, and ReputationChain programs.
 */

import {
  Transaction,
  PublicKey,
  ComputeBudgetProgram,
} from "@solana/web3.js";
import { Program, BN } from "@coral-xyz/anchor";
import { getPrograms, deriveTaskPda, deriveBidPda, deriveEscrowPda, deriveAgentRecordPda } from "./anchor";
import type { Cluster } from "./programs";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getIxBudget(microLamports = 200_000): Transaction {
  const tx = new Transaction();
  tx.add(ComputeBudgetProgram.requestUnits({ units: microLamports, additionalFee: 0 }));
  return tx;
}

// ---------------------------------------------------------------------------
// AgentGrid — Task operations
// ---------------------------------------------------------------------------

export interface CreateTaskParams {
  taskId: string;
  description: string;
  stakeAmount: number; // in SOL, will be converted to lamports
  parentTaskId?: string;
  deadlineBlocks?: number;
}

export async function buildCreateTaskTx(
  params: CreateTaskParams,
  requester: PublicKey,
  cluster: Cluster = "devnet"
): Promise<Transaction> {
  const { agentGrid } = getPrograms(cluster);
  const [taskPda] = deriveTaskPda(params.taskId);

  const stakeLamports = new BN(params.stakeAmount * 1e9);

  const tx = await agentGrid.methods
    .createTask(
      params.taskId,
      params.description,
      stakeLamports,
      params.parentTaskId ?? null,
      params.deadlineBlocks ? new BN(params.deadlineBlocks) : null
    )
    .accounts({
      task: taskPda,
      requester,
    })
    .transaction();

  const baseTx = getIxBudget();
  baseTx.add(tx);
  return baseTx;
}

export interface PostBidParams {
  taskId: string;
  bidAmount: number; // SOL
  capabilitiesHash: string;
}

export async function buildPostBidTx(
  params: PostBidParams,
  agent: PublicKey,
  cluster: Cluster = "devnet"
): Promise<Transaction> {
  const { agentGrid } = getPrograms(cluster);
  const [taskPda] = deriveTaskPda(params.taskId);
  const [bidPda] = deriveBidPda(params.taskId, agent);

  const bidLamports = new BN(params.bidAmount * 1e9);

  const tx = await agentGrid.methods
    .postBid(params.taskId, bidLamports, params.capabilitiesHash)
    .accounts({
      task: taskPda,
      bid: bidPda,
      agent,
    })
    .transaction();

  const baseTx = getIxBudget();
  baseTx.add(tx);
  return baseTx;
}

export async function buildAcceptBidTx(
  taskId: string,
  bidPk: PublicKey,
  requester: PublicKey,
  cluster: Cluster = "devnet"
): Promise<Transaction> {
  const { agentGrid } = getPrograms(cluster);
  const [taskPda] = deriveTaskPda(taskId);
  // accepted_bid PDA needs the bid's agent — fetch it to derive
  const bid = await agentGrid.account.taskBid.fetch(bidPk);
  const [acceptedBidPda] = deriveBidPda(taskId, bid.agent);

  const tx = await agentGrid.methods
    .acceptBid(taskId, bidPk)
    .accounts({
      task: taskPda,
      acceptedBid: acceptedBidPda,
      requester,
      bid: bidPk,
    })
    .transaction();

  const baseTx = getIxBudget();
  baseTx.add(tx);
  return baseTx;
}

export async function buildSubmitResultTx(
  taskId: string,
  resultCid: string,
  submitter: PublicKey,
  cluster: Cluster = "devnet"
): Promise<Transaction> {
  const { agentGrid } = getPrograms(cluster);
  const [taskPda] = deriveTaskPda(taskId);

  const tx = await agentGrid.methods
    .submitResult(taskId, resultCid)
    .accounts({
      task: taskPda,
      submitter,
    })
    .transaction();

  const baseTx = getIxBudget();
  baseTx.add(tx);
  return baseTx;
}

export async function buildApproveResultTx(
  taskId: string,
  approver: PublicKey,
  cluster: Cluster = "devnet"
): Promise<Transaction> {
  const { agentGrid } = getPrograms(cluster);
  const [taskPda] = deriveTaskPda(taskId);

  const tx = await agentGrid.methods
    .approveResult(taskId)
    .accounts({
      task: taskPda,
      approver,
    })
    .transaction();

  const baseTx = getIxBudget();
  baseTx.add(tx);
  return baseTx;
}

export async function buildDisputeTx(
  taskId: string,
  reason: string,
  disputer: PublicKey,
  cluster: Cluster = "devnet"
): Promise<Transaction> {
  const { agentGrid } = getPrograms(cluster);
  const [taskPda] = deriveTaskPda(taskId);

  const tx = await agentGrid.methods
    .dispute(taskId, reason)
    .accounts({
      task: taskPda,
      disputer,
    })
    .transaction();

  const baseTx = getIxBudget();
  baseTx.add(tx);
  return baseTx;
}

export async function buildResolveDisputeTx(
  taskId: string,
  slashBps: number,
  resolverFeeBps: number,
  resolver: PublicKey,
  cluster: Cluster = "devnet"
): Promise<Transaction> {
  const { agentGrid } = getPrograms(cluster);
  const [taskPda] = deriveTaskPda(taskId);

  const tx = await agentGrid.methods
    .resolveDispute(taskId, slashBps, resolverFeeBps)
    .accounts({
      task: taskPda,
      resolver,
    })
    .transaction();

  const baseTx = getIxBudget();
  baseTx.add(tx);
  return baseTx;
}

// ---------------------------------------------------------------------------
// TaskEscrow — Escrow operations
// ---------------------------------------------------------------------------

export interface InitEscrowParams {
  taskId: string;
  amount: number; // SOL
}

export async function buildInitEscrowTx(
  params: InitEscrowParams,
  beneficiary: PublicKey,
  cluster: Cluster = "devnet"
): Promise<Transaction> {
  const { taskEscrow } = getPrograms(cluster);
  const [escrowPda] = deriveEscrowPda(params.taskId);
  const lamports = new BN(params.amount * 1e9);

  const tx = await taskEscrow.methods
    .initEscrow(params.taskId, lamports)
    .accounts({
      escrow: escrowPda,
      beneficiary,
    })
    .transaction();

  const baseTx = getIxBudget();
  baseTx.add(tx);
  return baseTx;
}

export async function buildReleaseEscrowTx(
  taskId: string,
  beneficiary: PublicKey, // requester
  recipient: PublicKey,  // agent
  cluster: Cluster = "devnet"
): Promise<Transaction> {
  const { taskEscrow } = getPrograms(cluster);
  const [escrowPda] = deriveEscrowPda(taskId);

  const tx = await taskEscrow.methods
    .releaseEscrow(taskId)
    .accounts({
      escrow: escrowPda,
      beneficiary,
      recipient,
    })
    .transaction();

  const baseTx = getIxBudget();
  baseTx.add(tx);
  return baseTx;
}

export async function buildRefundEscrowTx(
  taskId: string,
  refundSigner: PublicKey,
  cluster: Cluster = "devnet"
): Promise<Transaction> {
  const { taskEscrow } = getPrograms(cluster);
  const [escrowPda] = deriveEscrowPda(taskId);

  const tx = await taskEscrow.methods
    .refundEscrow(taskId)
    .accounts({
      escrow: escrowPda,
      refundSigner,
    })
    .transaction();

  const baseTx = getIxBudget();
  baseTx.add(tx);
  return baseTx;
}

export async function buildSlashEscrowTx(
  taskId: string,
  slashBps: number,
  resolver: PublicKey,
  cluster: Cluster = "devnet"
): Promise<Transaction> {
  const { taskEscrow } = getPrograms(cluster);
  const [escrowPda] = deriveEscrowPda(taskId);

  const tx = await taskEscrow.methods
    .slashEscrow(taskId, slashBps)
    .accounts({
      escrow: escrowPda,
      resolver,
    })
    .transaction();

  const baseTx = getIxBudget();
  baseTx.add(tx);
  return baseTx;
}

// ---------------------------------------------------------------------------
// ReputationChain — Record outcome
// ---------------------------------------------------------------------------

export async function buildRecordOutcomeTx(
  agent: PublicKey,
  taskId: string,
  outcome: 0 | 1 | 2, // 0=success, 1=partial, 2=failed
  latencyBlocks: number,
  recorder: PublicKey,
  cluster: Cluster = "devnet"
): Promise<Transaction> {
  const { reputationChain } = getPrograms(cluster);
  const [recordPda] = deriveAgentRecordPda(agent);

  const tx = await reputationChain.methods
    .recordOutcome(agent, taskId, outcome, new BN(latencyBlocks))
    .accounts({
      record: recordPda,
      recorder,
    })
    .transaction();

  const baseTx = getIxBudget();
  baseTx.add(tx);
  return baseTx;
}
