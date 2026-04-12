use anchor_lang::prelude::*;

#[error_code]
pub enum EscrowError {
    #[msg("Escrow is not in Active state")]
    InvalidEscrowState,

    #[msg("Unauthorized — must be beneficiary or recipient")]
    Unauthorized,

    #[msg("Slashing basis points exceeds maximum (10000)")]
    InvalidSlashBps,

    #[msg("Funds insufficient for slash amount")]
    InsufficientFunds,

    #[msg("String exceeds maximum allowed length")]
    StringTooLong,
}
