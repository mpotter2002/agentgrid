use anchor_lang::prelude::*;
use crate::state::Escrow;
use crate::error::EscrowError;

#[derive(Accounts)]
#[instruction(task_id: String)]
pub struct SlashEscrow<'info> {
    #[account(
        mut,
        seeds = [b"escrow", task_id.as_bytes()],
        bump,
        constraint = escrow.status == crate::state::EscrowStatus::Active @ EscrowError::InvalidEscrowState
    )]
    pub escrow: Account<'info, Escrow>,

    /// Arbiter — in production this is the dispute resolver (DAO, oracle, etc.)
    pub resolver: Signer<'info>,
}

pub fn slash_escrow(ctx: Context<SlashEscrow>, task_id: String, slash_bps: u16) -> Result<()> {
    require!(slash_bps <= 10000, EscrowError::InvalidSlashBps);

    let escrow = &mut ctx.accounts.escrow;
    let clock = Clock::get()?;

    escrow.status = crate::state::EscrowStatus::Slashed;
    escrow.updated_at = clock.unix_timestamp as u64;

    let slash_amount = (escrow.amount as u128)
        .saturating_mul(slash_bps as u128)
        / 10000u128;

    msg!(
        "Escrow slashed for task {} — {} bps = {} lamports slashed",
        task_id,
        slash_bps,
        slash_amount as u64
    );
    msg!("Resolver: {}", ctx.accounts.resolver.key());

    Ok(())
}
