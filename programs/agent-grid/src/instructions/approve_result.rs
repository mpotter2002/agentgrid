use anchor_lang::prelude::*;
use crate::state::{Task, TaskStatus};

#[derive(Accounts)]
#[instruction(task_id: String)]
pub struct ApproveResult<'info> {
    #[account(
        mut,
        seeds = [b"task", task_id.as_bytes()],
        bump,
        constraint = task.status == TaskStatus::Submitted @ crate::error::AgentGridError::InvalidTaskState,
        constraint = task.requester == approver.key() @ crate::error::AgentGridError::Unauthorized
    )]
    pub task: Account<'info, Task>,

    #[account(mut)]
    pub approver: Signer<'info>,
}

pub fn approve_result(ctx: Context<ApproveResult>, task_id: String) -> Result<()> {
    let task = &mut ctx.accounts.task;
    let clock = Clock::get()?;

    task.status = TaskStatus::Approved;
    task.updated_at = clock.unix_timestamp as u64;

    msg!("Result approved for task {}", task_id);
    Ok(())
}
