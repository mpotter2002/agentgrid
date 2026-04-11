use anchor_lang::prelude::*;
use crate::state::AgentRecord;
use crate::{ReputationScore, reputation_chain};

#[derive(Accounts)]
pub struct GetScore<'info> {
    pub record: Account<'info, AgentRecord>,
}

pub fn get_score(ctx: Context<GetScore>) -> Result<ReputationScore> {
    let record = &ctx.accounts.record;

    let avg_latency = if record.tasks_completed > 0 {
        record.total_latency_blocks / record.tasks_completed as u64
    } else {
        0
    };

    let accuracy_score = if record.total_tasks_submitted > 0 {
        ((record.approvals_without_revision as u64)
            .saturating_mul(100)
            / record.total_tasks_submitted as u64) as u8
    } else {
        0
    };

    // Composite score formula:
    // (tasks_completed * 10) - (tasks_disputed * 30) + (accuracy * 20) - (avg_latency / 100)
    let composite_score = (record.tasks_completed as i64 * 10)
        - (record.tasks_disputed as i64 * 30)
        + (accuracy_score as i64 * 20)
        - (avg_latency as i64 / 100);

    msg!(
        "Reputation score for {}: tasks={}, disputed={}, accuracy={}, avg_latency={}, score={}",
        record.agent,
        record.tasks_completed,
        record.tasks_disputed,
        accuracy_score,
        avg_latency,
        composite_score
    );

    Ok(ReputationScore {
        tasks_completed: record.tasks_completed,
        tasks_disputed: record.tasks_disputed,
        avg_latency_blocks: avg_latency,
        accuracy_score,
        total_volume_settled: record.total_volume_settled,
        composite_score,
    })
}
