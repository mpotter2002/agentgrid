use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum TaskStatus {
    Open,
    InProgress,
    Submitted,
    Approved,
    Disputed,
    Resolved,
}

impl Default for TaskStatus {
    fn default() -> Self {
        TaskStatus::Open
    }
}

/// The main Task account.
/// PDA: [b"task", task_id.as_bytes()]
#[account]
pub struct Task {
    pub task_id: String,
    pub description: String,
    pub requester: Pubkey,
    pub assigned_agent: Option<Pubkey>,
    pub status: TaskStatus,
    pub stake_amount: u64,
    pub result_cid: Option<String>,
    pub parent_task_id: Option<String>,
    pub deadline_blocks: Option<u64>,
    pub created_at: u64,
    pub updated_at: u64,
    pub bump: u8,
}

/// A bid on a task.
/// PDA: [b"bid", task_id.as_bytes(), agent_pubkey.as_ref()]
#[account]
pub struct TaskBid {
    pub task_id: String,
    pub agent: Pubkey,
    pub bid_amount: u64,
    pub capabilities_hash: String,
    pub created_at: u64,
    pub bump: u8,
}
