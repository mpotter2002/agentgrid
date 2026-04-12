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
        constraint = task.status == TaskStatus::Disputed @ AgentGridError::InvalidTaskState,
        // Only requester, assigned agent, or a registered resolver can resolve
        constraint = task.requester == resolver.key()
            || task.assigned_agent == Some(resolver.key())
            @ AgentGridError::Unauthorized
    )]
    pub task: Account<'info, Task>,

    /// Arbiter — must be task requester, assigned agent, or authorized resolver
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

    // Emit an event for off-chain listeners to trigger escrow slash via CPI
    msg!(
        "Dispute resolved for task {}. Slash: {} bps, Resolver fee: {} bps",
        task_id,
        slash_bps,
        resolver_fee_bps
    );
    msg!("Resolver: {}", ctx.accounts.resolver.key());

    Ok(())
}
