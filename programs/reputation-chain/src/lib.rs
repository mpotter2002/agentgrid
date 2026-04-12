use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;
pub mod error;

use instructions::*;

declare_id!("9fQZEEszAi9mixRX3NrCMVY6kdC6hkfNnijfMyhUXbFo");

#[program]
pub mod reputation_chain {
    use super::*;

    /// Register a new agent on the reputation chain.
    pub fn init_agent(ctx: Context<InitAgent>) -> Result<()> {
        instructions::init_agent(ctx)
    }

    /// Record a task outcome — called by escrow program CPI when task resolves.
    pub fn record_outcome(
        ctx: Context<RecordOutcome>,
        agent: Pubkey,
        task_id: String,
        outcome: u8,      // 0 = success, 1 = disputed, 2 = failed
        latency_blocks: u64,
    ) -> Result<()> {
        instructions::record_outcome(ctx, agent, task_id, outcome, latency_blocks)
    }

    /// Get the current reputation score for an agent (read-only, computed on-chain).
    pub fn get_score(ctx: Context<GetScore>) -> Result<ReputationScore> {
        instructions::get_score(ctx)
    }
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct ReputationScore {
    pub tasks_completed: u32,
    pub tasks_disputed: u32,
    pub avg_latency_blocks: u64,
    pub accuracy_score: u8,       // 0-100
    pub total_volume_settled: u64,
    pub composite_score: i64,
}
