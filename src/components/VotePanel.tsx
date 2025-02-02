"use client";

import { colors } from "@/styles/colors";

interface VotePanelProps {
  featureId: number;
  upvotes: number;
  downvotes: number;
  score: number;
  onUpvote: (featureId: number) => void;
  onDownvote: (featureId: number) => void;
  disabled: boolean;
  isAdmin?: boolean;
  onDelete?: (featureId: number) => void;
}

export function VotePanel({
  featureId,
  upvotes,
  downvotes,
  score,
  onUpvote,
  onDownvote,
  disabled,
  isAdmin,
  onDelete,
}: VotePanelProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <button
          onClick={() => onUpvote(featureId)}
          disabled={disabled}
          className={`flex items-center gap-1 rounded-lg bg-emerald-100 px-3 py-1.5 text-emerald-700 hover:bg-emerald-200 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          } transition-colors duration-200`}
          title="Upvote"
        >
          👍 {upvotes}
        </button>

        <div
          className={`px-2 font-medium ${
            score > 0
              ? "text-emerald-600"
              : score < 0
              ? colors.text.error
              : colors.text.muted
          }`}
        >
          {score}
        </div>

        <button
          onClick={() => onDownvote(featureId)}
          disabled={disabled}
          className={`flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-red-700 hover:bg-red-200 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          } transition-colors duration-200`}
          title="Downvote"
        >
          👎 {downvotes}
        </button>
      </div>
      
      {isAdmin && onDelete && (
        <button
          onClick={() => onDelete(featureId)}
          disabled={disabled}
          className={`rounded-lg p-1 ${colors.text.error} ${
            colors.interactive.hover.bg.light
          } ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          } transition-colors duration-200`}
          title="Delete feature request"
        >
          🗑️
        </button>
      )}
    </div>
  );
}
