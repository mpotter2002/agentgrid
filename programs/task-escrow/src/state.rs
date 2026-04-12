use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum EscrowStatus {
    Active,
    Released,
    Slashed,
    Refunded,
}

impl Default for EscrowStatus {
    fn default() -> Self {
        EscrowStatus::Active
    }
}

/// Escrow account holding funds pending task completion.
/// PDA: [b"escrow", task_id.as_bytes()]
#[account]
pub struct Escrow {
    pub task_id: String,
    pub beneficiary: Pubkey,       // Original depositor (requester)
    pub recipient: Option<Pubkey>, // Agent who will receive funds (set on accept)
    pub amount: u64,
    pub status: EscrowStatus,
    pub resolver: Pubkey,          // Authorized resolver (set when dispute opens)
    pub created_at: u64,
    pub updated_at: u64,
    pub bump: u8,
}

impl Escrow {
    pub const LEN: usize = 8  // discriminator
        + 64                    // task_id
        + 32                    // beneficiary
        + 33                    // recipient (Option<Pubkey>)
        + 8                     // amount
        + 1                     // status
        + 32                    // resolver
        + 8                     // created_at
        + 8                     // updated_at
        + 1;                    // bump
}
