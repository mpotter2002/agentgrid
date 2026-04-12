use anchor_lang::prelude::*;

#[error_code]
pub enum ReputationError {
    #[msg("Agent record not initialized")]
    AgentNotFound,

    #[msg("Invalid outcome value (must be 0, 1, or 2)")]
    InvalidOutcome,

    #[msg("Unauthorized — must be the agent to record own outcome")]
    Unauthorized,

    #[msg("String exceeds maximum allowed length")]
    StringTooLong,
}
