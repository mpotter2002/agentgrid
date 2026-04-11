use anchor_lang::prelude::*;
use crate::state::{Task, TaskBid, TaskStatus};

#[derive(Accounts)]
#[instruction(task_id: String)]
pub struct PostBid<'info> {
    #[account(
        seeds = [b"task", task_id.as_bytes()],
        bump,
        constraint = task.status == TaskStatus::Open @ crate::error::AgentGridError::InvalidTaskState
    )]
    pub task: Account<'info, Task>,

    #[account(
        init,
        payer = agent,
        space = TaskBid::LEN,
        seeds = [b"bid", task_id.as_bytes(), agent.key().as_ref()],
        bump
    )]
    pub bid: Account<'info, TaskBid>,

    #[account(mut)]
    pub agent: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn post_bid(
    ctx: Context<PostBid>,
    task_id: String,
    bid_amount: u64,
    capabilities_hash: String,
) -> Result<()> {
    let bid = &mut ctx.accounts.bid;
    let clock = Clock::get()?;

    bid.task_id = task_id;
    bid.agent = ctx.accounts.agent.key();
    bid.bid_amount = bid_amount;
    bid.capabilities_hash = capabilities_hash;
    bid.created_at = clock.unix_timestamp as u64;
    bid.bump = ctx.bumps.bid;

    msg!("Bid posted by {} for task {}", bid.agent, bid.task_id);
    Ok(())
}

impl TaskBid {
    pub const LEN: usize = 8 // discriminator
        + 64 // task_id
        + 32 // agent
        + 8 // bid_amount
        + 64 // capabilities_hash
        + 8 // created_at
        + 1; // bump
}
