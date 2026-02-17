import { Prediction } from '@/types/prediction';
import { VoteButton } from '@/components/news/VoteButton';
import { Badge } from '@/components/ui/Badge';

export function PredictionCard({ prediction }: { prediction: Prediction }) {
  const totalVotes = prediction.votesA + prediction.votesB;

  return (
    <div className="bg-slate-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="info">{prediction.category}</Badge>
        <span className="text-slate-500 text-xs">
          마감: {new Date(prediction.deadline).toLocaleDateString('ko-KR')}
        </span>
      </div>
      <h3 className="text-white font-semibold mb-1">{prediction.questionKo}</h3>
      {prediction.description && (
        <p className="text-slate-400 text-sm mb-4">{prediction.description}</p>
      )}
      <div className="space-y-2">
        <VoteButton
          predictionId={prediction.id}
          choice="A"
          label={prediction.optionAKo}
          votes={prediction.votesA}
          totalVotes={totalVotes}
        />
        <VoteButton
          predictionId={prediction.id}
          choice="B"
          label={prediction.optionBKo}
          votes={prediction.votesB}
          totalVotes={totalVotes}
        />
      </div>
      <p className="text-slate-500 text-xs mt-3 text-center">
        총 {totalVotes.toLocaleString()}명 참여
      </p>
    </div>
  );
}
