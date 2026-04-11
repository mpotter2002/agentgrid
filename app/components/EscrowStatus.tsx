"use client";

import { FC } from "react";

type EscrowStatus = "Active" | "Released" | "Slashed" | "Refunded";

interface EscrowStatusBadgeProps {
  status: EscrowStatus;
  amount: number;
}

const statusConfig: Record<EscrowStatus, { color: string; pulse: boolean }> = {
  Active: { color: "text-primary", pulse: true },
  Released: { color: "text-accent", pulse: false },
  Slashed: { color: "text-danger", pulse: false },
  Refunded: { color: "text-gray-400", pulse: false },
};

const EscrowStatusBadge: FC<EscrowStatusBadgeProps> = ({ status, amount }) => {
  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <div className={`relative flex items-center gap-1.5 ${config.color}`}>
        {config.pulse && (
          <span className="absolute -left-1.5 w-2 h-2 rounded-full bg-primary animate-ping opacity-75" />
        )}
        <span className={`w-2 h-2 rounded-full ${
          status === "Active" ? "bg-primary" :
          status === "Released" ? "bg-accent" :
          status === "Slashed" ? "bg-danger" : "bg-gray-400"
        }`} />
        <span className="text-xs font-mono font-bold">{status}</span>
      </div>
      <span className="text-xs font-mono text-gray-500">
        {(amount / 1e9).toFixed(2)} SOL
      </span>
    </div>
  );
};

export default EscrowStatusBadge;
