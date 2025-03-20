import { Trophy } from 'lucide-react';
import { cn } from '@/libs/utils';
import Image from 'next/image';
import { generateIdenticonAvatar } from '@/utils/generateAvatar';

type Participant = {
  name: string;
  score: number;
  rank: number;
  badge: string;
  avatar?: string; // Optional avatar URL
};

const topParticipantsByCategory: Participant[] = [
  { name: "John Doe", score: 98, rank: 1, badge: "Elite Coder", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Jane Smith", score: 95, rank: 2, badge: "Code Master" },
  { name: "Mike Johnson", score: 92, rank: 3, badge: "Tech Guru" },
  { name: "Sarah Wilson", score: 97, rank: 1, badge: "Language Expert" },
  { name: "Tom Brown", score: 94, rank: 2, badge: "Word Master" },
  { name: "Lisa Davis", score: 91, rank: 3, badge: "Grammar Pro" },
  { name: "Alex Turner", score: 96, rank: 1, badge: "Science Wizard" },
  { name: "Emma White", score: 93, rank: 2, badge: "Lab Master" },
  { name: "Chris Black", score: 90, rank: 3, badge: "Research Pro" },
];

export default function TopParticipants() {
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
        {topParticipantsByCategory.map((participant, index) => {
          const avatarSvg = participant.avatar || generateIdenticonAvatar(participant.name, 40);

          return (
            <div key={index} className="space-y-2">
              <div className="bg-[#343434] p-4 rounded-lg border border-gray-700 hover:border-green-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {participant.avatar ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden relative">
                        <Image
                          src={participant.avatar}
                          alt={participant.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover aspect-square"
                        />
                      </div>
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{ __html: avatarSvg }}
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                      />
                    )}
                    <div className='w-36'>
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
            </div>
          );
        })}
      </div>
    </div>
  );
}