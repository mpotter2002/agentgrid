"use client";

import { useCallback, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useAnchorPrograms } from "./usePrograms";
import { BN } from "@coral-xyz/anchor";

export interface AgentData {
  address: PublicKey;
  owner: PublicKey;
  score: number;
  tasksCompleted: number;
  tasksFailed: number;
  totalEarnings: BN;
  registeredAt: BN;
  name?: string;
  skills?: string[];
  rate?: number;
}

export function useAgent() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { reputation } = useAnchorPrograms();
  
  const [isRegistered, setIsRegistered] = useState(false);
  const [agentData, setAgentData] = useState<AgentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get agent PDA for a wallet
  const getAgentPDA = useCallback((walletAddress: PublicKey) => {
    if (!reputation) return null;
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("agent"), walletAddress.toBuffer()],
      reputation.programId
    );
    return pda;
  }, [reputation]);

  // Check if current wallet is registered as agent
  const checkRegistration = useCallback(async () => {
    if (!wallet.publicKey || !reputation) {
      setIsRegistered(false);
      setAgentData(null);
      return;
    }

    try {
      setLoading(true);
      const agentPDA = getAgentPDA(wallet.publicKey);
      if (!agentPDA) return;

      const account = await reputation.account.agent.fetchNullable(agentPDA);
      
      if (account) {
        setIsRegistered(true);
        setAgentData({
          address: agentPDA,
          owner: account.owner,
          score: account.score.toNumber(),
          tasksCompleted: account.tasksCompleted.toNumber(),
          tasksFailed: account.tasksFailed.toNumber(),
          totalEarnings: account.totalEarnings,
          registeredAt: account.registeredAt,
        });
      } else {
        setIsRegistered(false);
        setAgentData(null);
      }
    } catch (e) {
      console.error("Error checking agent registration:", e);
      setIsRegistered(false);
      setAgentData(null);
    } finally {
      setLoading(false);
    }
  }, [wallet.publicKey, reputation, getAgentPDA]);

  // Register as agent
  const registerAgent = useCallback(async (name: string, skills: string[], rate: number) => {
    if (!wallet.publicKey || !reputation || !wallet.signTransaction) {
      throw new Error("Wallet not connected");
    }

    try {
      setLoading(true);
      setError(null);

      const agentPDA = getAgentPDA(wallet.publicKey);
      if (!agentPDA) throw new Error("Could not derive agent PDA");

      await reputation.methods
        .initAgent()
        .accounts({
          agent: agentPDA,
          owner: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      // Store metadata (in a real app, this would be on-chain or IPFS)
      // For now, we'll use localStorage as a quick solution
      const metadata = {
        name,
        skills,
        rate,
        address: agentPDA.toBase58(),
      };
      localStorage.setItem(`agent_${agentPDA.toBase58()}`, JSON.stringify(metadata));

      await checkRegistration();
      return agentPDA;
    } catch (e: any) {
      console.error("Error registering agent:", e);
      setError(e.message || "Failed to register agent");
      throw e;
    } finally {
      setLoading(false);
    }
  }, [wallet.publicKey, reputation, getAgentPDA, checkRegistration]);

  // Get agent metadata from localStorage
  const getAgentMetadata = useCallback((agentAddress: PublicKey) => {
    const stored = localStorage.getItem(`agent_${agentAddress.toBase58()}`);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  }, []);

  // Load all registered agents
  const getAllAgents = useCallback(async () => {
    if (!reputation) return [];

    try {
      const accounts = await reputation.account.agent.all();
      return accounts.map((acc: any) => {
        const metadata = getAgentMetadata(acc.publicKey);
        return {
          address: acc.publicKey,
          owner: acc.account.owner,
          score: acc.account.score.toNumber(),
          tasksCompleted: acc.account.tasksCompleted.toNumber(),
          tasksFailed: acc.account.tasksFailed.toNumber(),
          totalEarnings: acc.account.totalEarnings,
          registeredAt: acc.account.registeredAt,
          name: metadata?.name || "Anonymous Agent",
          skills: metadata?.skills || [],
          rate: metadata?.rate || 0,
        };
      });
    } catch (e) {
      console.error("Error fetching agents:", e);
      return [];
    }
  }, [reputation, getAgentMetadata]);

  // Check registration on mount and when wallet changes
  useEffect(() => {
    checkRegistration();
  }, [checkRegistration]);

  return {
    isRegistered,
    agentData,
    loading,
    error,
    registerAgent,
    checkRegistration,
    getAllAgents,
    getAgentPDA,
  };
}
