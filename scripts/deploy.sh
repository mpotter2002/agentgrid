#!/usr/bin/env bash
# AgentGrid — Deploy all programs to Solana devnet
# Requires: anchor 0.30.1, solana CLI, Rust 1.85.0
# Usage: bash scripts/deploy.sh

set -e

echo "=== AgentGrid Deploy Script ==="
echo "Target: Solana devnet"
echo ""

# Check environment
if ! command -v anchor &> /dev/null; then
    echo "ERROR: anchor CLI not found. Install with: npm install -g @coral-xyz/anchor-cli"
    exit 1
fi

if ! command -v solana &> /dev/null; then
    echo "ERROR: solana CLI not found."
    exit 1
fi

# Check wallet is configured
WALLET_PUBKEY=$(solana-keygen pubkey 2>/dev/null || echo "")
if [ -z "$WALLET_PUBKEY" ]; then
    echo "ERROR: No solana wallet found. Run: solana-keygen new --outfile ~/.config/solana/id.json"
    exit 1
fi
echo "Wallet: $WALLET_PUBKEY"

# Check balance
BALANCE=$(solana balance --url devnet 2>/dev/null | awk '{print $1}' || echo "0")
echo "Balance: $BALANCE SOL"
echo ""

# Required SOL for 3 programs (1.6 SOL minimum, 2.0 recommended)
REQUIRED=2.0
CURRENT=$(echo "$BALANCE" | sed 's/ SOL//')
IS_NUMERIC=$(echo "$BALANCE" | grep -c "^[0-9]*\.\?[0-9]* SOL$")

if [ "$IS_NUMERIC" != "1" ]; then
    echo "WARNING: Could not parse balance. Proceeding anyway..."
elif (( $(echo "$CURRENT < $REQUIRED" | bc -l) )); then
    echo "WARNING: Balance ($CURRENT SOL) < recommended ($REQUIRED SOL)"
    echo "You may need additional SOL for all 3 programs."
    echo "Try: solana airdrop 2 --url devnet"
    echo ""
fi

cd "$(dirname "$0")/.."

echo "=== Building programs ==="
cargo build-sbf
echo ""

echo "=== Syncing program IDs ==="
anchor keys sync
echo ""

echo "=== Deploying programs ==="

PROGRAMS=("task_escrow" "reputation_chain" "agent_grid")
for prog in "${PROGRAMS[@]}"; do
    SO_FILE="target/deploy/${prog}.so"
    if [ ! -f "$SO_FILE" ]; then
        echo "ERROR: $SO_FILE not found. Run 'cargo build-sbf' first."
        exit 1
    fi
    echo "Deploying ${prog}..."
    anchor program deploy "$SO_FILE" --provider.cluster devnet
    echo ""
done

echo "=== Verifying deployments ==="
anchor program show task_escrow --provider.cluster devnet || true
anchor program show reputation_chain --provider.cluster devnet || true
anchor program show agent_grid --provider.cluster devnet || true

echo ""
echo "=== Deployment complete! ==="
echo "Update Anchor.toml with new program IDs if changed."
echo "Then run: vercel --prod (from app/ directory)"
