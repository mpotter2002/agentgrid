use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;
pub mod error;

use instructions::*;

declare_id!("AGENTGRID11111111111111111111111111111111");

#[program]
pub mod agent_grid {
    use super::*;

    /// Create a new task.
    /// If `parent_task_id` is Some, this is a sub-task in a recursive chain.
    pub fn create_task(
        ctx: Context<CreateTask>,
        task_id: String,
        description: String,
        stake_amount: u64,
        parent_task_id: Option<String>,
        deadline_blocks: Option<u64>,
    ) -> Result<()> {
        instructions::create_task(ctx, task_id, description, stake_amount, parent_task_id, deadline_blocks)
    }

    /// Post a bid on an open task.
    pub fn post_bid(
        ctx: Context<PostBid>,
        task_id: String,
        bid_amount: u64,
        capabilities_hash: String,
    ) -> Result<()> {
        instructions::post_bid(ctx, task_id, bid_amount, capabilities_hash)
    }

    /// Accept a bid and assign the task.
    pub fn accept_bid(ctx: Context<AcceptBid>, task_id: String, bid_pk: Pubkey) -> Result<()> {
        instructions::accept_bid(ctx, task_id, bid_pk)
    }

    /// Agent submits completed work (IPFS CID of results).
    pub fn submit_result(ctx: Context<SubmitResult>, task_id: String, result_cid: String) -> Result<()> {
        instructions::submit_result(ctx, task_id, result_cid)
    }

    /// Requester approves the submitted result.
    pub fn approve_result(ctx: Context<ApproveResult>, task_id: String) -> Result<()> {
        instructions::approve_result(ctx, task_id)
    }

    /// Either party raises a dispute.
    pub fn dispute(ctx: Context<Dispute>, task_id: String, reason: String) -> Result<()> {
        instructions::dispute(ctx, task_id, reason)
    }

    /// Arbiter resolves a disputed task.
    pub fn resolve_dispute(
        ctx: Context<ResolveDispute>,
        task_id: String,
        slash_bps: u16,
        resolver_fee_bps: u16,
    ) -> Result<()> {
        instructions::resolve_dispute(ctx, task_id, slash_bps, resolver_fee_bps)
    }
}
