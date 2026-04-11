use anchor_lang::prelude::*;
use crate::state::{Task, TaskStatus};

#[derive(Accounts)]
#[instruction(task_id: String)]
pub struct Dispute<'info> {
    #[account(
        mut,
        seeds = [b"task", task_id.as_bytes()],
        bump,
        constraint = task.status == TaskStatus::Submitted 
            || task.status == TaskStatus::InProgress 
            @ crate::error::AgentGridError::InvalidTaskState,
        constraint = task.requester == disputer.key() 
            || task.assigned_agent == Some(disputer.key()) 
            @ crate::error::AgentGridError::Unauthorized
    )]
    pub task: Account<'info, Task>,

    #[account(mut)]
    pub disputer: Signer<'info>,
}

pub fn dispute(ctx: Context<Dispute>, task_id: String, reason: String) -> Result<()> {
    let task = &mut ctx.accounts.task;
    let clock = Clock::get()?;

    task.status = TaskStatus::Disputed;
    task.updated_at = clock.unix_timestamp as u64;

    msg!("Dispute raised on task {}: {}", task_id, reason);
    msg!("Disputer: {}", ctx.accounts.disputer.key());
    Ok(())
}
