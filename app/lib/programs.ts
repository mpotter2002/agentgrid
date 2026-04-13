// Program IDs on devnet
export const PROGRAM_IDS = {
  agentGrid: "A85D8jc1K2ksr2kRip2XVYrdi25qddR3MMCCXMi8wj1k",
  taskEscrow: "8Exvze4gwdR1iLG8Azf7UH4g6YmB35krmf1rw9aDjaQQ",
  reputationChain: "9fQZEEszAi9mixRX3NrCMVY6kdC6hkfNnijfMyhUXbFo",
} as const;

// Program IDs on localnet
export const LOCALNET_PROGRAM_IDS = {
  agentGrid: "D6QtepyhbxccbbHiLspEPYs5se7bPwznikDNDQdRNti",
  taskEscrow: "58vuS5cVcddiYcvaANU6cu4UswpDATvKT3srkHADZKtq",
  reputationChain: "GasC46imEJKa8nm9FKYvQx8i35GYSsMdF2Ag1kqKeRsi",
} as const;

// Cluster type
export type Cluster = "devnet" | "localnet";
