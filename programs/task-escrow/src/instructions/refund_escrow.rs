use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction::transfer;
use crate::state::Escrow;

#[derive(Accounts)]
#[instruction(task_id: String)]
pub struct RefundEscrow<'info> {
    #[account(
        mut,
        seeds = [b"escrow", task_id.as_bytes()],
        bump,
        constraint = escrow.status == crate::state::EscrowStatus::Active @ crate::error::EscrowError::InvalidEscrowState,
        constraint = escrow.beneficiary == refund_signer.key() @ crate::error::EscrowError::Unauthorized,
        constraint = escrow.recipient.is_none() // Cannot refund if already assigned
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(mut)]
    pub refund_signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn refund_escrow(ctx: Context<RefundEscrow>, _task_id: String) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    let clock = Clock::get()?;
    let beneficiary = escrow.beneficiary;
    let amount = escrow.amount;

    escrow.status = crate::state::EscrowStatus::Refunded;
    escrow.updated_at = clock.unix_timestamp as u64;

    // Transfer lamports back from escrow PDA to beneficiary
    let transfer_ix = transfer(&escrow.key(), &beneficiary, amount);
    anchor_lang::solana_program::program::invoke_signed(
        &transfer_ix,
        &[
            escrow.to_account_info(),
            ctx.accounts.refund_signer.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
        &[&[b"escrow", _task_id.as_bytes(), &[escrow.bump]]],
    )?;

    msg!(
        "Escrow refunded for task {} — {} lamports returned to {:?}",
        escrow.task_id,
        amount,
        beneficiary
    );

    Ok(())
}
