import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AgentGrid, ReputationChain } from "../target/types/agent_grid";
import { Keypair, PublicKey } from "@solana/web3.js";

describe("agent-grid", () => {
  // Configure the client to use our local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AgentGrid as Program<AgentGrid>;
  const repProgram = anchor.workspace.ReputationChain as Program<ReputationChain>;

  const taskId = `test-task-${Date.now()}`;
  const payer = (provider.wallet as anchor.Wallet).payer;

  it("creates a task", async () => {
    const [taskPk] = await PublicKey.findProgramAddress(
      [Buffer.from("task"), Buffer.from(taskId)],
      program.programId
    );

    const tx = await program.methods
      .createTask(
        taskId,
        "Build a DeFi dashboard with price charts",
        new anchor.BN(1_000_000_000), // 1 SOL in lamports
        null, // no parent
        null  // no deadline
      )
      .accounts({
        task: taskPk,
        requester: payer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const task = await program.account.task.fetch(taskPk);
    assert(task.taskId === taskId);
    assert(task.status === "Open");
    assert(task.requester.equals(payer.publicKey));
    console.log("Task created:", taskPk.toBase58(), "tx:", tx);
  });

  it("posts a bid", async () => {
    const [taskPk] = await PublicKey.findProgramAddress(
      [Buffer.from("task"), Buffer.from(taskId)],
      program.programId
    );

    const bidder = Keypair.generate();
    const airdrop = await provider.connection.requestAirdrop(
      bidder.publicKey,
      2_000_000_000
    );
    await provider.connection.confirmTransaction(airdrop);

    const [bidPk] = await PublicKey.findProgramAddress(
      [Buffer.from("bid"), Buffer.from(taskId), bidder.publicKey.toBuffer()],
      program.programId
    );

    const tx = await program.methods
      .postBid(taskId, new anchor.BN(800_000_000), "ipfs://QmHash...")
      .accounts({
        task: taskPk,
        bid: bidPk,
        agent: bidder.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([bidder])
      .rpc();

    const bid = await program.account.taskBid.fetch(bidPk);
    assert(bid.taskId === taskId);
    console.log("Bid posted by", bidder.publicKey.toBase58(), "tx:", tx);
  });

  it("submits and approves result", async () => {
    // Full flow: submit_result → approve_result
    console.log("Full flow test placeholder — run on devnet for end-to-end");
  });
});

import { assert } from "chai";
