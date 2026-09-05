'use client';

import { useState } from 'react';

export function VoteButton({
  predictionId,
  choice,
  label,
  votes,
  totalVotes,
  disabled = false,
}: {
  predictionId: string;
  choice: 'A' | 'B';
  label: string;
  votes: number;
  totalVotes: number;
  disabled?: boolean;
}) {
  const [hasVoted, setHasVoted] = useState(false);
  const [localVotes, setLocalVotes] = useState(votes);
  const percentage = totalVotes > 0 ? Math.round((localVotes / totalVotes) * 100) : 50;

  const handleVote = async () => {
    if (hasVoted || disabled) return;

    setHasVoted(true);
    setLocalVotes(prev => prev + 1);

    try {
      await fetch(`/api/predict/${predictionId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice }),
      });
    } catch (error) {
      setHasVoted(false);
      setLocalVotes(prev => prev - 1);
      console.error('Failed to vote:', error);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={hasVoted || disabled}
      className={`relative w-full overflow-hidden rounded-lg border px-3.5 py-2.5 text-left transition-colors ${
        hasVoted
          ? 'border-line-strong bg-fill-subtle'
          : 'border-line bg-fill-subtle hover:border-line-strong hover:bg-fill'
      }`}
    >
      {/* 투표 후 채워지는 막대 — 배경으로 깔아야 글자를 가리지 않는다 */}
      {hasVoted && (
        <div
          className={`absolute inset-y-0 left-0 transition-[width] duration-500 ${
            choice === 'A' ? 'bg-blue-500/20' : 'bg-violet-500/20'
          }`}
          style={{ width: `${percentage}%` }}
        />
      )}
      <div className="relative flex items-center justify-between gap-3">
        <span className="t-body-sm text-slate-100">{label}</span>
        {hasVoted && (
          <span className="tnum t-body-sm font-semibold text-slate-200">
            {percentage}%
          </span>
        )}
      </div>
    </button>
  );
}
