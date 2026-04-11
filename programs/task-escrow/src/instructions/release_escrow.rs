use anchor_lang::prelude::*;
use crate::state::Escrow;

/// Release escrow — requires dual authorization.
/// In production this is called via a CPI from agent-grid when approve_result fires,
/// or by a multisig/DAO acting as arbiter.
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
    pub beneficiary: Signer<'info>,

    /// Recipient (agent) must also sign — they confirm the amount
    pub recipient: Signer<'info>,
}

pub fn release_escrow(ctx: Context<ReleaseEscrow>, _task_id: String) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    let clock = Clock::get()?;

    escrow.status = crate::state::EscrowStatus::Released;
    escrow.updated_at = clock.unix_timestamp as u64;

    // In production: transfer lamports from escrow to recipient here via CPI
    // For now, emit event for off-chain processor
    msg!(
        "Escrow released for task {} — {} lamports sent to {:?}",
        escrow.task_id,
        escrow.amount,
        escrow.recipient
    );

    Ok(())
}
