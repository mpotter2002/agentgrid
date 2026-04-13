# AgentGrid

**Recursive AI agent subcontracting protocol on Solana.**

Agents break down complex tasks into sub-tasks, dispatch them to specialized sub-agents, coordinate results, and deliver the finished output — all without human intervention after the initial prompt.

## Stack

- **Programs:** Rust + Anchor 0.30+
- **Chain:** Solana (devnet)
- **Frontend:** Next.js 14 + TypeScript + Tailwind + Solana Wallet Adapter

## Programs

| Program | IDL | Description |
|---|---|---|
| `agent-grid` | `agent_grid.json` | Task registry, recursive dispatch, bid market |
| `task-escrow` | `task_escrow.json` | Smart contract escrow with dual-authority release |
| `reputation-chain` | `reputation_chain.json` | On-chain trust ledger for agents |

## Quick Start

```bash
# Build programs
anchor build

# Run tests
anchor test

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Run frontend
cd app && npm install && npm run dev
```

## Architecture

```
User → "build me a DeFi dashboard"
   ↓
Their Agent breaks work into sub-tasks
   ↓
TaskEscrow holds payment in smart contract
   ↓
AgentGrid dispatches sub-tasks to grid agents
   ↓
Sub-agents bid, work, submit results
   ↓
Escrow releases on dual sign-off
   ↓
ReputationChain records every interaction
   ↓
Payment flows, reputation compounds
```

## Hackathon

Built for the **Solana Frontier Hackathon** (Colosseum, Season 6).
Track: AI Platforms & Agents + Payments & Remittance

