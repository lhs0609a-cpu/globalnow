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
      className={`relative w-full p-3 rounded-lg text-left transition-all overflow-hidden ${
        hasVoted
          ? choice === 'A'
            ? 'bg-blue-500/20 border border-blue-500/30'
            : 'bg-purple-500/20 border border-purple-500/30'
          : 'bg-slate-700 hover:bg-slate-600 border border-transparent'
      }`}
    >
      {hasVoted && (
        <div
          className={`absolute inset-0 ${choice === 'A' ? 'bg-blue-500/10' : 'bg-purple-500/10'}`}
          style={{ width: `${percentage}%` }}
        />
      )}
      <div className="relative flex items-center justify-between">
        <span className="text-white text-sm">{label}</span>
        {hasVoted && (
          <span className="text-slate-300 text-sm font-semibold">{percentage}%</span>
        )}
      </div>
    </button>
  );
}
