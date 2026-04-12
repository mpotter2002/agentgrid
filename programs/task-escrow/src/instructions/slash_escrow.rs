use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction::transfer;
use crate::state::Escrow;
use crate::error::EscrowError;

#[derive(Accounts)]
#[instruction(task_id: String)]
pub struct SlashEscrow<'info> {
    #[account(
        mut,
        seeds = [b"escrow", task_id.as_bytes()],
        bump,
        constraint = escrow.status == crate::state::EscrowStatus::Active @ EscrowError::InvalidEscrowState,
        constraint = escrow.resolver == resolver.key() @ EscrowError::Unauthorized
    )]
    pub escrow: Account<'info, Escrow>,

    /// Arbiter — must match escrow.resolver set during dispute
    pub resolver: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn slash_escrow(ctx: Context<SlashEscrow>, task_id: String, slash_bps: u16) -> Result<()> {
    require!(slash_bps <= 10000, EscrowError::InvalidSlashBps);

    let escrow = &mut ctx.accounts.escrow;
    let clock = Clock::get()?;
    let resolver_key = ctx.accounts.resolver.key();

    escrow.status = crate::state::EscrowStatus::Slashed;
    escrow.updated_at = clock.unix_timestamp as u64;

    let slash_amount = (escrow.amount as u128)
        .saturating_mul(slash_bps as u128)
        / 10000u128;

    // Transfer slashed amount from escrow to resolver
    let transfer_ix = transfer(&escrow.key(), &resolver_key, slash_amount as u64);
    anchor_lang::solana_program::program::invoke_signed(
        &transfer_ix,
        &[
            escrow.to_account_info(),
            ctx.accounts.resolver.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
        &[&[b"escrow", task_id.as_bytes(), &[escrow.bump]]],
    )?;

    msg!(
        "Escrow slashed for task {} — {} bps = {} lamports slashed to {:?}",
        task_id,
        slash_bps,
        slash_amount as u64,
        resolver_key
    );

    Ok(())
}
