use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction::transfer;
use crate::state::Escrow;

/// Release escrow — requires dual authorization:
/// Beneficiary (requester) AND recipient (agent) must both sign.
#[derive(Accounts)]
#[instruction(task_id: String)]
pub struct ReleaseEscrow<'info> {
    #[account(
        mut,
        seeds = [b"escrow", task_id.as_bytes()],
        bump,
        constraint = escrow.status == crate::state::EscrowStatus::Active @ crate::error::EscrowError::InvalidEscrowState,
        constraint = escrow.recipient.is_some() @ crate::error::EscrowError::Unauthorized
    )]
    pub escrow: Account<'info, Escrow>,

    /// Beneficiary (requester) must sign — they approved the result
    #[account(
        mut,
        constraint = beneficiary.key() == escrow.beneficiary @ crate::error::EscrowError::Unauthorized
    )]
    pub beneficiary: Signer<'info>,

    /// Recipient (agent) must also sign — they confirm the amount
    #[account(
        mut,
        constraint = recipient.key() == escrow.recipient.unwrap() @ crate::error::EscrowError::Unauthorized
    )]
    pub recipient: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn release_escrow(ctx: Context<ReleaseEscrow>, _task_id: String) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    let clock = Clock::get()?;
    let recipient_key = escrow.recipient.unwrap();
    let amount = escrow.amount;

    escrow.status = crate::state::EscrowStatus::Released;
    escrow.updated_at = clock.unix_timestamp as u64;

    // Transfer lamports from escrow PDA to recipient
    let transfer_ix = transfer(&escrow.key(), &recipient_key, amount);
    anchor_lang::solana_program::program::invoke_signed(
        &transfer_ix,
        &[
            escrow.to_account_info(),
            ctx.accounts.recipient.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
        &[&[b"escrow", _task_id.as_bytes(), &[escrow.bump]]],
    )?;

    msg!(
        "Escrow released for task {} — {} lamports sent to {:?}",
        escrow.task_id,
        amount,
        recipient_key
    );

    Ok(())
}
