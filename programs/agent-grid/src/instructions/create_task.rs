use anchor_lang::prelude::*;
use crate::state::{Task, TaskStatus};

#[derive(Accounts)]
#[instruction(task_id: String)]
pub struct CreateTask<'info> {
    #[account(
        init,
        payer = requester,
        space = Task::LEN,
        seeds = [b"task", task_id.as_bytes()],
        bump
    )]
    pub task: Account<'info, Task>,

    #[account(mut)]
    pub requester: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn create_task(
    ctx: Context<CreateTask>,
    task_id: String,
    description: String,
    stake_amount: u64,
    parent_task_id: Option<String>,
    deadline_blocks: Option<u64>,
) -> Result<()> {
    // String length validation to prevent serialization failures
    require!(task_id.len() <= 64, crate::error::AgentGridError::StringTooLong);
    require!(description.len() <= 256, crate::error::AgentGridError::StringTooLong);
    if let Some(ref pid) = parent_task_id {
        require!(pid.len() <= 64, crate::error::AgentGridError::StringTooLong);
    }

    let task = &mut ctx.accounts.task;
    let clock = Clock::get()?;

    task.task_id = task_id;
    task.description = description;
    task.requester = ctx.accounts.requester.key();
    task.assigned_agent = None;
    task.status = TaskStatus::Open;
    task.stake_amount = stake_amount;
    task.result_cid = None;
    task.parent_task_id = parent_task_id;
    task.deadline_blocks = deadline_blocks;
    task.created_at = clock.unix_timestamp as u64;
    task.updated_at = clock.unix_timestamp as u64;
    task.bump = ctx.bumps.task;

    msg!("Task created: {} by {}", task.task_id, task.requester);
    Ok(())
}

impl Task {
    pub const LEN: usize = 8 // discriminator
        + 64 // task_id (String)
        + 256 // description (String)
        + 32 // requester
        + 33 // assigned_agent (Option<Pubkey>)
        + 1 // status (enum)
        + 8 // stake_amount
        + 65 // result_cid (Option<String>)
        + 65 // parent_task_id (Option<String>)
        + 9 // deadline_blocks (Option<u64>)
        + 8 // created_at
        + 8 // updated_at
        + 1; // bump
}
