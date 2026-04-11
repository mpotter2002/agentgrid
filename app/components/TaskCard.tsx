"use client";

import { FC } from "react";

interface TaskCardProps {
  taskId: string;
  description: string;
  status: string;
  stakeAmount: number;
  bidderCount: number;
  timeLeft?: string;
  onClick?: () => void;
}

const statusColors: Record<string, string> = {
  Open: "text-primary",
  InProgress: "text-yellow-400",
  Submitted: "text-secondary",
  Approved: "text-accent",
  Disputed: "text-danger",
  Resolved: "text-gray-400",
};

const TaskCard: FC<TaskCardProps> = ({
  taskId,
  description,
  status,
  stakeAmount,
  bidderCount,
  timeLeft,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-surface border border-border rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="font-mono text-xs text-gray-500">{taskId.slice(0, 12)}...</span>
        <span className={`text-xs font-mono font-bold ${statusColors[status] || "text-gray-400"}`}>
          {status}
        </span>
      </div>
      <p className="text-sm text-gray-200 mb-3 line-clamp-2">{description}</p>
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span className="font-mono">{stakeAmount} lamports</span>
        <span>{bidderCount} bid{bidderCount !== 1 ? "s" : ""}</span>
        {timeLeft && <span>{timeLeft}</span>}
      </div>
    </div>
  );
};

export default TaskCard;
