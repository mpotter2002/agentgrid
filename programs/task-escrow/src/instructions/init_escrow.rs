use anchor_lang::prelude::*;
use crate::state::Escrow;

#[derive(Accounts)]
#[instruction(task_id: String)]
pub struct InitEscrow<'info> {
    #[account(
        init,
        payer = beneficiary,
        space = Escrow::LEN,
        seeds = [b"escrow", task_id.as_bytes()],
        bump
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(mut)]
    pub beneficiary: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn init_escrow(ctx: Context<InitEscrow>, task_id: String, amount: u64) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    let clock = Clock::get()?;

    escrow.task_id = task_id;
    escrow.beneficiary = ctx.accounts.beneficiary.key();
    escrow.recipient = None;
    escrow.amount = amount;
    escrow.status = crate::state::EscrowStatus::Active;
    escrow.created_at = clock.unix_timestamp as u64;
    escrow.updated_at = clock.unix_timestamp as u64;
    escrow.bump = ctx.bumps.escrow;

    msg!("Escrow initialized for task {} with amount {}", escrow.task_id, amount);
    Ok(())
}
