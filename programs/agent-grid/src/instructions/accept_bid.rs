use anchor_lang::prelude::*;
use crate::state::{Task, TaskBid, TaskStatus};

#[derive(Accounts)]
#[instruction(task_id: String, agent_key: Pubkey)]
pub struct AcceptBid<'info> {
    #[account(
        mut,
        seeds = [b"task", task_id.as_bytes()],
        bump,
        constraint = task.status == TaskStatus::Open @ crate::error::AgentGridError::InvalidTaskState,
        constraint = task.requester == requester.key() @ crate::error::AgentGridError::Unauthorized
    )]
    pub task: Account<'info, Task>,

    #[account(
        mut,
        seeds = [b"bid", task_id.as_bytes(), agent_key.as_ref()],
        bump,
        constraint = accepted_bid.task_id == task_id @ crate::error::AgentGridError::BidNotFound,
        constraint = accepted_bid.agent == agent_key @ crate::error::AgentGridError::BidNotFound
    )]
    pub accepted_bid: Account<'info, TaskBid>,

    #[account(mut)]
    pub requester: Signer<'info>,
}

pub fn accept_bid(ctx: Context<AcceptBid>, task_id: String, agent_key: Pubkey) -> Result<()> {
    let task = &mut ctx.accounts.task;
    let clock = Clock::get()?;

    // The accepted bid's agent becomes the assigned agent
    task.assigned_agent = Some(ctx.accounts.accepted_bid.agent);
    task.status = TaskStatus::InProgress;
    task.updated_at = clock.unix_timestamp as u64;

    msg!("Bid accepted for task {}. Agent: {:?}", task_id, task.assigned_agent);
    Ok(())
}
