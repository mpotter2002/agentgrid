use anchor_lang::prelude::*;
use crate::state::{Task, TaskStatus};

#[derive(Accounts)]
#[instruction(task_id: String)]
pub struct SubmitResult<'info> {
    #[account(
        mut,
        seeds = [b"task", task_id.as_bytes()],
        bump,
        constraint = task.status == TaskStatus::InProgress @ crate::error::AgentGridError::InvalidTaskState,
        constraint = task.assigned_agent == Some(submitter.key()) @ crate::error::AgentGridError::Unauthorized
    )]
    pub task: Account<'info, Task>,

    #[account(mut)]
    pub submitter: Signer<'info>,
}

pub fn submit_result(ctx: Context<SubmitResult>, task_id: String, result_cid: String) -> Result<()> {
    let task = &mut ctx.accounts.task;
    let clock = Clock::get()?;

    task.result_cid = Some(result_cid);
    task.status = TaskStatus::Submitted;
    task.updated_at = clock.unix_timestamp as u64;

    msg!("Result submitted for task {}", task_id);
    Ok(())
}
