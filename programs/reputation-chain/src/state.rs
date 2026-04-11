use anchor_lang::prelude::*;

/// Tracks the reputation record for an agent.
/// PDA: [b"rep", agent_pubkey.as_ref()]
#[account]
pub struct AgentRecord {
    pub agent: Pubkey,
    pub tasks_completed: u32,
    pub tasks_disputed: u32,
    pub total_latency_blocks: u64,
    pub approvals_without_revision: u32,
    pub total_tasks_submitted: u32,
    pub total_volume_settled: u64,
    pub created_at: u64,
    pub updated_at: u64,
    pub bump: u8,
}

impl AgentRecord {
    pub const LEN: usize = 8 // discriminator
        + 32 // agent
        + 4 // tasks_completed
        + 4 // tasks_disputed
        + 8 // total_latency_blocks
        + 4 // approvals_without_revision
        + 4 // total_tasks_submitted
        + 8 // total_volume_settled
        + 8 // created_at
        + 8 // updated_at
        + 1; // bump
}

/// PDA: [b"attest", task_id.as_bytes()]
#[account]
pub struct TaskAttestation {
    pub task_id: String,
    pub agent: Pubkey,
    pub outcome: u8,           // 0 = success, 1 = disputed, 2 = failed
    pub latency_blocks: u64,
    pub recorded_at: u64,
    pub bump: u8,
}

impl TaskAttestation {
    pub const LEN: usize = 8 // discriminator
        + 64 // task_id
        + 32 // agent
        + 1 // outcome
        + 8 // latency_blocks
        + 8 // recorded_at
        + 1; // bump
}
