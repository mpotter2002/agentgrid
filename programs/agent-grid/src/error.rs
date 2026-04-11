use anchor_lang::prelude::*;

#[error_code]
pub enum AgentGridError {
    #[msg("Task is not in the correct state for this operation")]
    InvalidTaskState,

    #[msg("Task not found")]
    TaskNotFound,

    #[msg("Bid not found")]
    BidNotFound,

    #[msg("Unauthorized access")]
    Unauthorized,

    #[msg("Deadline has passed")]
    DeadlinePassed,

    #[msg("Invalid slash basis points")]
    InvalidSlashBps,

    #[msg("Resolver fee too high")]
    ResolverFeeTooHigh,
}
