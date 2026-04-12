use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;
pub mod error;

use instructions::*;

declare_id!("8Exvze4gwdR1iLG8Azf7UH4g6YmB35krmf1rw9aDjaQQ");

#[program]
pub mod task_escrow {
    use super::*;

    /// Initialize an escrow for a task. Stake + payment deposited.
    pub fn init_escrow(
        ctx: Context<InitEscrow>,
        task_id: String,
        amount: u64,
    ) -> Result<()> {
        instructions::init_escrow(ctx, task_id, amount)
    }

    /// Release escrow — requires BOTH requester AND agent signatures.
    pub fn release_escrow(ctx: Context<ReleaseEscrow>, task_id: String) -> Result<()> {
        instructions::release_escrow(ctx, task_id)
    }

    /// Slash escrow based on arbiter decision.
    pub fn slash_escrow(
        ctx: Context<SlashEscrow>,
        task_id: String,
        slash_bps: u16,
    ) -> Result<()> {
        instructions::slash_escrow(ctx, task_id, slash_bps)
    }

    /// Refund escrow if task cancelled before assignment.
    pub fn refund_escrow(ctx: Context<RefundEscrow>, task_id: String) -> Result<()> {
        instructions::refund_escrow(ctx, task_id)
    }
}
