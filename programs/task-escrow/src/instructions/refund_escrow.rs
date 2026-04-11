use anchor_lang::prelude::*;
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

    pub refund_signer: Signer<'info>,
}

pub fn refund_escrow(ctx: Context<RefundEscrow>, _task_id: String) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    let clock = Clock::get()?;

    escrow.status = crate::state::EscrowStatus::Refunded;
    escrow.updated_at = clock.unix_timestamp as u64;

    msg!(
        "Escrow refunded for task {} — {} lamports returned to {:?}",
        escrow.task_id,
        escrow.amount,
        escrow.beneficiary
    );

    Ok(())
}
