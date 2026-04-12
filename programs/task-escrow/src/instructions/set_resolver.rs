use anchor_lang::prelude::*;
use crate::state::Escrow;

/// Set the authorized resolver for an escrow (called by agent-grid via CPI
/// when a dispute is opened).
#[derive(Accounts)]
#[instruction(task_id: String)]
pub struct SetResolver<'info> {
    #[account(
        mut,
        seeds = [b"escrow", task_id.as_bytes()],
        bump,
        constraint = escrow.status == crate::state::EscrowStatus::Active @ crate::error::EscrowError::InvalidEscrowState,
        constraint = escrow.beneficiary == authority.key() @ crate::error::EscrowError::Unauthorized
    )]
    pub escrow: Account<'info, Escrow>,

    /// Must be the task/escrow owner (beneficiary)
    pub authority: Signer<'info>,
}

pub fn set_resolver(ctx: Context<SetResolver>, _task_id: String, resolver: Pubkey) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    let clock = Clock::get()?;
    escrow.resolver = resolver;
    escrow.updated_at = clock.unix_timestamp as u64;
    msg!("Resolver set to {:?} for escrow {}", resolver, escrow.task_id);
    Ok(())
}
