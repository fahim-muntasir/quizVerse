import { Trophy, Medal, Award } from 'lucide-react';
import { cn } from '@/libs/utils';

type Participant = {
  name: string;
  score: number;
  rank: number;
  badge: string;
}

type TopParticipantsProps = {
  categories: {
    [key: string]: Participant[];
  };
}

export default function TopParticipants({ categories }: TopParticipantsProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <Award className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 2:
        return 'bg-gray-300/10 text-gray-300 border-gray-300/20';
      case 3:
        return 'bg-amber-600/10 text-amber-600 border-amber-600/20';
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <div className="bg-[#1C1C1C] border border-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        Top Participants
      </h2>

      <div className="space-y-6">
        {Object.entries(categories).map(([category, participants]) => (
          <div key={category} className="space-y-3">
            <h3 className="text-lg font-medium text-white capitalize">{category}</h3>
            {participants.map((participant, index) => (
              <div
                key={index}
                className="bg-[#343434] p-4 rounded-lg border border-gray-700 hover:border-green-500/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#1C1C1C] p-2 rounded-full">
                      {getRankIcon(participant.rank)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{participant.name}</p>
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full border inline-block mt-1",
                        getBadgeColor(participant.rank)
                      )}>
                        {participant.badge}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-500 font-bold text-lg">{participant.score}%</p>
                    <p className="text-xs text-gray-400">Rank #{participant.rank}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}