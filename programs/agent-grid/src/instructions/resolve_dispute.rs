use anchor_lang::prelude::*;
use crate::state::{Task, TaskStatus};
use crate::error::AgentGridError;

#[derive(Accounts)]
#[instruction(task_id: String)]
pub struct ResolveDispute<'info> {
    #[account(
        mut,
        seeds = [b"task", task_id.as_bytes()],
        bump,
        constraint = task.status == TaskStatus::Disputed @ AgentGridError::InvalidTaskState
    )]
    pub task: Account<'info, Task>,

    /// Arbiter — in production this would be a DAO or trusted resolver pool
    pub resolver: Signer<'info>,
}

pub fn resolve_dispute(
    ctx: Context<ResolveDispute>,
    task_id: String,
    slash_bps: u16,
    resolver_fee_bps: u16,
) -> Result<()> {
    require!(slash_bps <= 10000, AgentGridError::InvalidSlashBps);
    require!(resolver_fee_bps <= 2000, AgentGridError::ResolverFeeTooHigh);

    let task = &mut ctx.accounts.task;
    let clock = Clock::get()?;

    task.status = TaskStatus::Resolved;
    task.updated_at = clock.unix_timestamp as u64;

    // In production: emit an event that task-escrow program listens to
    // to execute the actual fund movement based on slash_bps
    msg!(
        "Dispute resolved for task {}. Slash: {} bps, Resolver fee: {} bps",
        task_id,
        slash_bps,
        resolver_fee_bps
    );
    msg!("Resolver: {}", ctx.accounts.resolver.key());

    Ok(())
}
