use anchor_lang::prelude::*;
use crate::state::{AgentRecord, TaskAttestation};
use crate::error::ReputationError;

#[derive(Accounts)]
#[instruction(agent: Pubkey, task_id: String)]
pub struct RecordOutcome<'info> {
    #[account(
        mut,
        seeds = [b"rep", agent.as_ref()],
        bump
    )]
    pub record: Account<'info, AgentRecord>,

    #[account(
        init,
        payer = recorder,
        space = TaskAttestation::LEN,
        seeds = [b"attest", task_id.as_bytes()],
        bump
    )]
    pub attestation: Account<'info, TaskAttestation>,

    #[account(mut)]
    pub recorder: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn record_outcome(
    ctx: Context<RecordOutcome>,
    agent: Pubkey,
    task_id: String,
    outcome: u8,
    latency_blocks: u64,
) -> Result<()> {
    require!(outcome <= 2, ReputationError::InvalidOutcome);

    let record = &mut ctx.accounts.record;
    let attestation = &mut ctx.accounts.attestation;
    let clock = Clock::get()?;

    // Update attestation
    attestation.task_id = task_id.clone();
    attestation.agent = agent;
    attestation.outcome = outcome;
    attestation.latency_blocks = latency_blocks;
    attestation.recorded_at = clock.unix_timestamp as u64;
    attestation.bump = ctx.bumps.attestation;

    // Update agent record
    record.total_tasks_submitted += 1;
    record.total_latency_blocks = record.total_latency_blocks.saturating_add(latency_blocks);

    match outcome {
        0 => {
            // Success
            record.tasks_completed += 1;
            record.approvals_without_revision += 1;
        },
        1 => {
            // Disputed
            record.tasks_completed += 1;
            record.tasks_disputed += 1;
        },
        2 => {
            // Failed
            record.tasks_completed += 1;
        },
        _ => return err!(ReputationError::InvalidOutcome),
    }

    record.updated_at = clock.unix_timestamp as u64;

    msg!(
        "Outcome recorded for agent {}: task {} = outcome {}, latency {} blocks",
        agent,
        task_id,
        outcome,
        latency_blocks
    );

    Ok(())
}
