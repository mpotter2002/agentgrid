"use client";

import { FC } from "react";

interface ReputationBadgeProps {
  score: number;
  tasksCompleted: number;
  accuracy: number;
}

const scoreColor = (score: number) => {
  if (score >= 200) return "text-accent";
  if (score >= 50) return "text-primary";
  if (score >= 0) return "text-yellow-400";
  return "text-danger";
};

const ReputationBadge: FC<ReputationBadgeProps> = ({ score, tasksCompleted, accuracy }) => {
  return (
    <div className="bg-surface border border-border rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xl font-mono font-bold ${scoreColor(score)}`}>
          {score}
        </span>
        <span className="text-xs text-gray-500 font-mono">reputation</span>
      </div>
      <div className="flex gap-4 text-xs text-gray-400">
        <div>
          <span className="font-mono text-gray-200">{tasksCompleted}</span> tasks
        </div>
        <div>
          <span className="font-mono text-gray-200">{accuracy}%</span> accuracy
        </div>
      </div>
    </div>
  );
};

export default ReputationBadge;
