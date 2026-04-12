use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction::transfer;
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
    // String length validation
    require!(task_id.len() <= 64, crate::error::EscrowError::StringTooLong);

    let escrow = &mut ctx.accounts.escrow;
    let clock = Clock::get()?;
    let benef = ctx.accounts.beneficiary.key();

    escrow.task_id = task_id.clone();
    escrow.beneficiary = benef;
    escrow.recipient = None;
    escrow.amount = amount;
    escrow.status = crate::state::EscrowStatus::Active;
    escrow.resolver = Pubkey::default();
    escrow.created_at = clock.unix_timestamp as u64;
    escrow.updated_at = clock.unix_timestamp as u64;
    escrow.bump = ctx.bumps.escrow;

    // Transfer lamports from beneficiary into the escrow PDA
    let transfer_ix = transfer(&benef, &escrow.key(), amount);
    anchor_lang::solana_program::program::invoke_signed(
        &transfer_ix,
        &[
            ctx.accounts.beneficiary.to_account_info(),
            escrow.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
        &[&[b"escrow", task_id.as_bytes(), &[ctx.bumps.escrow]]],
    )?;

    msg!("Escrow initialized for task {} with amount {}", escrow.task_id, amount);
    Ok(())
}
