use anchor_lang::prelude::*;
use crate::state::AgentRecord;

#[derive(Accounts)]
pub struct InitAgent<'info> {
    #[account(
        init,
        payer = agent,
        space = AgentRecord::LEN,
        seeds = [b"rep", agent.key().as_ref()],
        bump
    )]
    pub record: Account<'info, AgentRecord>,

    #[account(mut)]
    pub agent: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn init_agent(ctx: Context<InitAgent>) -> Result<()> {
    let record = &mut ctx.accounts.record;
    let clock = Clock::get()?;

    record.agent = ctx.accounts.agent.key();
    record.tasks_completed = 0;
    record.tasks_disputed = 0;
    record.total_latency_blocks = 0;
    record.approvals_without_revision = 0;
    record.total_tasks_submitted = 0;
    record.total_volume_settled = 0;
    record.created_at = clock.unix_timestamp as u64;
    record.updated_at = clock.unix_timestamp as u64;
    record.bump = ctx.bumps.record;

    msg!("Agent registered on ReputationChain: {}", record.agent);
    Ok(())
}
